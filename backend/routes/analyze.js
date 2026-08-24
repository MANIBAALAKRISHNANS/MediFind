import { Router } from 'express'

import prisma from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { detectPatterns } from '../utils/indianDiseasePatterns.js'
import { localDiagnose } from '../utils/localDiagnosis.js'
import { cacheGet, cacheSet } from '../utils/cache.js'

const router = Router()

// ─────────────────────────────────────────────────────────────────────────────
// Medicine name sanitiser — strips specific drug/dosage mentions from
// recommendations and replaces them with a specialist consultation prompt.
// Applied to every response path (fresh diagnosis, cache hits) so the app
// never tells a patient to take a named medicine or dose.
// ─────────────────────────────────────────────────────────────────────────────
const MEDICINE_TERMS = [
  // specific drug names
  'paracetamol', 'ibuprofen', 'aspirin', 'cetirizine', 'loratadine', 'salbutamol',
  'omeprazole', 'pantoprazole', 'ranitidine', 'amoxicillin', 'azithromycin',
  'warfarin', 'heparin', 'rivaroxaban', 'metformin', 'insulin', 'nitroglycerine',
  'nitroglycerin', 'atorvastatin', 'fluticasone', 'mometasone', 'tacrolimus',
  'hydrocortisone', 'chloroquine', 'artemisinin', 'doxycycline', 'ciprofloxacin',
  'ondansetron', 'domperidone', 'loperamide', 'folic acid', 'calamine',
  'levothyroxine', 'carbimazole', 'propylthiouracil', 'propranolol', 'hydroxychloroquine',
  'praziquantel', 'niclosamide', 'albendazole', 'mebendazole', 'permethrin',
  // drug class names used prescriptively
  'antihistamine', 'antibiotic', 'antifungal', 'antiviral', 'antidepressant',
  'antipsychotic', 'laba', 'lama', 'ace inhibitor', 'beta-blocker', 'beta blocker',
  'diuretic', 'statin', 'corticosteroid', 'steroid cream', 'inhaler',
  // dosage patterns
  ' mg', 'mg ', '10mg', '500mg', '300mg', '1000mg', 'tablet', 'capsule',
  // prescribing phrases
  'take prescribed', 'prescribed medication', 'prescribed inhaler',
]

function stripMedicineRecommendations(diagnosis) {
  if (!Array.isArray(diagnosis.recommendations) || diagnosis.recommendations.length === 0) {
    diagnosis.homeCare = []
    return
  }
  const specialty = diagnosis.specialty ?? 'specialist'
  const clean = []
  let hadMedicine = false

  for (const rec of diagnosis.recommendations) {
    const lower = rec.toLowerCase()
    if (MEDICINE_TERMS.some(term => lower.includes(term))) {
      hadMedicine = true
    } else {
      clean.push(rec)
    }
  }

  if (hadMedicine) {
    clean.push(`Consult ${withArticle(specialty)} for the appropriate medication and dosage — do not self-medicate`)
    diagnosis.recommendations = clean
  }

  // homeCare MUST be derived here, from the now-guaranteed-clean
  // `recommendations`, never from the raw pre-strip list — see the comment
  // on `homeCare: null` in adaptToApiResponse() above for why.
  diagnosis.homeCare = diagnosis.recommendations.slice(1, 3)
}

// ─────────────────────────────────────────────────────────────────────────────
// India pattern cross-validation
// ─────────────────────────────────────────────────────────────────────────────
function applyIndiaPatternCrossCheck(diagnosis, symptomsText) {
  const patternMatches = detectPatterns(symptomsText)
  if (patternMatches.length === 0) return

  const topPattern = patternMatches[0]

  if (topPattern.matchCount >= 3 && topPattern.specialty !== diagnosis.specialty) {
    console.log(
      `[india-crosscheck] Specialty override: "${diagnosis.specialty}" → "${topPattern.specialty}"`,
      `(pattern matchCount=${topPattern.matchCount})`
    )
    diagnosis.specialty   = topPattern.specialty
    diagnosis._adjustedBy = 'india-pattern'
  }

  // This heuristic's `confidence` (50 + matchCount*15, capped 95) comes from
  // a completely different formula than the local engine's own confidence
  // (localDiagnosis.js computeConfidence — weighted symptom-match ratios).
  // The two are NOT on a shared scale, so a raw `topPattern.confidence - 20`
  // can land above `diagnosis.confidence` purely by coincidence, and did:
  // "Dengue Fever 60%" rendered as a *differential* next to a "Viral
  // Meningitis 58%" *primary*, reading as the differential having outscored
  // the disease the engine actually picked. These entries exist to flag
  // "also consider this" alternates, not to out-rank the primary — cap them
  // strictly below it so the two numbers never contradict each other on
  // screen, regardless of which unrelated formula produced them.
  const probability = Math.max(0, Math.min(topPattern.confidence - 20, diagnosis.confidence - 1))

  diagnosis.differentialDiagnosis = diagnosis.differentialDiagnosis ?? []
  for (const name of topPattern.diseases) {
    const alreadyPresent = diagnosis.differentialDiagnosis.some(
      (x) => x.name.toLowerCase().includes(name.toLowerCase())
    )
    if (!alreadyPresent) {
      diagnosis.differentialDiagnosis.push({ name, probability })
    }
  }
  diagnosis.differentialDiagnosis = diagnosis.differentialDiagnosis.slice(0, 4)

  if (topPattern.severity === 'severe' && diagnosis.severity === 'mild') {
    console.log('[india-crosscheck] Severity bumped: mild → moderate')
    diagnosis.severity = 'moderate'
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Adapter — maps localDiagnose()'s engine-native shape onto the stable public
// API JSON shape the frontend (web + Android) already expects, so the
// engine's internal contract (STEP 3 of the local-engine spec) can evolve
// independently of the HTTP response contract (STEP 5).
// ─────────────────────────────────────────────────────────────────────────────
function withArticle(noun) {
  return `${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun}`
}

function buildDescription(match) {
  const specialistText = (match.specialist ?? 'General Physician').toLowerCase()
  return `${match.disease} is a ${(match.category ?? 'general').toLowerCase()} condition. ` +
    `Based on your reported symptoms, MediFind's local triage engine matched this with ` +
    `${Math.round(match.confidence * 100)}% confidence. Consult ${withArticle(specialistText)} for a proper evaluation.`
}

function buildWhenToSeekHelp(match) {
  if (match.urgency === 'emergency') {
    return 'This requires immediate medical attention — call 112 or 108 now.'
  }
  if (match.redFlags?.length > 0) {
    return `Seek prompt medical care if you notice: ${match.redFlags.slice(0, 3).join(', ')}.`
  }
  return `See a ${(match.specialist ?? 'doctor').toLowerCase()} if symptoms persist or worsen.`
}

function adaptToApiResponse(diagnosisResult) {
  const { primary, differentials } = diagnosisResult

  const differentialDiagnosis = differentials.map((d) => ({
    name: d.disease,
    probability: Math.round(d.confidence * 100),
  }))

  return {
    disease: primary.disease,
    confidence: Math.round(primary.confidence * 100),
    differentialDiagnosis,
    specialty: (primary.specialist ?? 'General Physician').toLowerCase(),
    severity: primary.severity,
    urgency: primary.urgency,
    description: buildDescription(primary),
    recommendations: primary.recommendations,
    redFlags: primary.redFlags ?? [],
    // homeCare is deliberately NOT computed here — it must be derived from
    // `recommendations` AFTER stripMedicineRecommendations() runs (see the
    // route handler below), never from the raw pre-strip list. It used to
    // be sliced from `primary.recommendations` directly at this point,
    // which bypassed medicine-name stripping entirely: `recommendations`
    // came out clean, but `homeCare` could still leak a specific drug name
    // through a side door — the exact thing this whole sanitiser exists to
    // prevent. Left `null` here as a safety net; anything reaching a
    // response with `homeCare: null` is a sign this got skipped.
    homeCare: null,
    whenToSeekHelp: buildWhenToSeekHelp(primary),
    source: 'local-rule-engine',
    _localEngine: true,
    _diseaseId: primary.id,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/analyze  (protected)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', requireAuth, async (req, res, next) => {
  const { symptoms, age, gender } = req.body ?? {}

  if (typeof symptoms !== 'string' || symptoms.trim().length < 10 || symptoms.trim().length > 2000) {
    return res.status(400).json({
      error: 'Symptoms must be between 10 and 2000 characters.',
      code:  'INVALID_INPUT',
    })
  }

  const trimmed  = symptoms.trim()
  const cacheKey = trimmed.toLowerCase().replace(/\s+/g, ' ')

  // ── Cache hit ─────────────────────────────────────────────────────────────
  const cached = await cacheGet(cacheKey)
  if (cached) {
    console.log('[analyze] Cache hit — skipping recomputation')
    stripMedicineRecommendations(cached)
    let analysisId = null
    try {
      const saved = await prisma.analysis.create({
        data: {
          userId:          req.user.id,
          symptoms:        trimmed,
          disease:         cached.disease,
          specialty:       cached.specialty,
          severity:        cached.severity,
          urgency:         cached.urgency,
          description:     cached.description,
          recommendations: cached.recommendations ?? [],
          redFlags:        cached.redFlags ?? [],
        },
      })
      analysisId = saved.id
    } catch (dbErr) {
      console.error('[analyze] DB save failed (cache path, non-fatal):', dbErr.message)
    }
    return res.json({ ...cached, analysisId })
  }

  // ── Run the local rule-based diagnosis engine (no external calls) ────────
  const engineResult = localDiagnose(trimmed, { age, gender })
  const diagnosis = adaptToApiResponse(engineResult)

  // ── India pattern cross-validation ───────────────────────────────────────
  applyIndiaPatternCrossCheck(diagnosis, trimmed)

  // ── Strip any medicine names from recommendations ─────────────────────────
  stripMedicineRecommendations(diagnosis)

  // ── Cache the sanitised result ────────────────────────────────────────────
  await cacheSet(cacheKey, diagnosis)

  // ── Persist to DB (awaited because analysisId is returned to the client) ──
  let analysisId = null
  try {
    const saved = await prisma.analysis.create({
      data: {
        userId:          req.user.id,
        symptoms:        trimmed,
        disease:         diagnosis.disease,
        specialty:       diagnosis.specialty,
        severity:        diagnosis.severity,
        urgency:         diagnosis.urgency,
        description:     diagnosis.description,
        recommendations: diagnosis.recommendations ?? [],
        redFlags:        diagnosis.redFlags ?? [],
      },
    })
    analysisId = saved.id
  } catch (dbErr) {
    console.error('[analyze] DB save failed (non-fatal):', dbErr.message)
  }

  return res.json({ ...diagnosis, analysisId })
})

export default router

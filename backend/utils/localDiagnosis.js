// The PRIMARY and ONLY diagnosis engine for MediFind — a local, rule-based,
// weighted symptom-matching system. No external API calls, no machine
// learning model: every score traces back to a readable disease definition
// in backend/utils/diseases/, making the output fully deterministic and
// auditable. See README.md → "backend/utils/localDiagnosis.js" for the
// scoring formula reference.
import { DISEASE_DB } from './diseases/index.js'
import { normalize } from './nlp/tokenizer.js'
import { parseDuration, durationFitsPattern } from './nlp/durationParser.js'
import { parseSeverity } from './nlp/severityParser.js'
import { detectNegations, isNegated } from './nlp/negationDetector.js'

// ── Tunables (see STEP 3 of the spec this engine implements) ────────────────
const MIN_SCORE = 30
const MIN_PRIMARY_MATCHES = 2
const CONFIDENCE_CAP = 0.92
const CONFIDENCE_FLOOR = 0.15
const PRIMARY_WEIGHT_POINTS = 20
const SECONDARY_WEIGHT_POINTS = 10
const DIFFERENTIATING_WEIGHT_POINTS = 15
const DURATION_BONUS = 10
const RISK_FACTOR_BONUS = 5
const NEGATED_PRIMARY_PENALTY = 15
const PREVALENCE_BONUS = { high: 8, moderate: 4, low: 0, rare: 0 }
const SEASONAL_BONUS = 5
// Normalizing denominator for the "bonus factors" component of confidence —
// an approximate ceiling on how many bonus points a single candidate could
// realistically accrue (duration + a couple of risk factors + prevalence + season).
const BONUS_NORMALIZER = 25

// ── Short-input relaxation ──────────────────────────────────────────────────
// A terse, 1–3 word complaint ("chest pain", "blood in stool") carries real
// clinical signal but structurally cannot satisfy the >=2-matched-primary
// gate below: there simply aren't enough words in the input to match two
// symptoms. Every such input fell through to defaultDiagnosis() — the engine
// answered "Unspecified Condition, 15%" to the exact phrasing a worried user
// is most likely to type first. When the input is this short, one match
// against a HIGH-weight primary symptom (a symptom its own entry treats as
// near-defining, not incidental) plus a real total score is the strongest
// evidence the input can physically carry, so accept it. The token gate is
// what keeps this narrow: a longer description that still only lands one
// primary match is a genuinely weak match and stays rejected.
const SHORT_INPUT_MAX_TOKENS = 3
const SHORT_INPUT_MIN_SCORE = 25
const SHORT_INPUT_MIN_PRIMARY_WEIGHT = 0.8

// ── Common-condition priority ───────────────────────────────────────────────
// The confidence at which a match stops being "one plausible reading among
// several" and becomes the answer. Candidates at or above it are ranked as a
// band ABOVE every borderline (< 0.5) candidate, regardless of raw score.
// Raw score and confidence measure different things — score rewards absolute
// symptom weights plus prevalence/seasonal bonuses, confidence rewards how
// much of THIS entry's own picture the input actually filled in — and a rare
// condition matching 2 of its 3 primaries can out-SCORE a common one while
// explaining the input no better. That is how "fever, headache, cough" (a
// textbook flu) came back as Viral Meningitis at 45%: meningitis beat
// Influenza by 1 point of monsoon seasonal bonus, then carried its own
// entry-level urgency:'emergency' straight to the user's screen. Banding by
// confidence first keeps the borderline red-flag-adjacent match where it
// belongs — in the differentials, still visible — instead of at the top.
const COMMON_CONDITION_MIN_CONFIDENCE = 0.5

// India seasons by month (0-indexed, matching Date#getMonth()).
const SEASON_MONTHS = {
  monsoon: [5, 6, 7, 8],       // Jun–Sep
  'post-monsoon': [9, 10],     // Oct–Nov
  winter: [11, 0, 1],          // Dec–Feb
  summer: [2, 3, 4],           // Mar–May
}

function isCurrentSeason(seasonalPattern) {
  if (!seasonalPattern) return false
  const months = SEASON_MONTHS[seasonalPattern]
  if (!months) return false
  return months.includes(new Date().getMonth())
}

/** Word-boundary-safe substring match, run through the same normalize()
 * pipeline on both sides so synonym phrasing differences never cause a miss. */
function containsPhrase(normalizedText, phrase) {
  const needle = normalize(phrase)
  if (!needle) return false
  return (' ' + normalizedText + ' ').includes(' ' + needle + ' ')
}

// ── Feature extraction ───────────────────────────────────────────────────────

/**
 * @param {string} symptomText
 * @returns {{ normalizedText: string, duration: object, severity: object, negatedPhrases: string[], riskFactorHints: string[] }}
 */
function extractFeatures(symptomText) {
  const normalizedText = normalize(symptomText)
  const duration = parseDuration(symptomText)
  const severity = parseSeverity(normalizedText)
  const negatedPhrases = detectNegations(symptomText)

  return { normalizedText, duration, severity, negatedPhrases }
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreSymptomGroup(symptoms, normalizedText, negatedPhrases, pointsPerWeight) {
  let score = 0
  const matched = []
  for (const s of symptoms) {
    if (isNegated(negatedPhrases, s.name)) continue
    if (containsPhrase(normalizedText, s.name)) {
      score += s.weight * pointsPerWeight
      matched.push(s)
    }
  }
  return { score, matched }
}

function scoreNegativePenalty(primarySymptoms, negatedPhrases) {
  let penalty = 0
  let count = 0
  for (const s of primarySymptoms) {
    if (isNegated(negatedPhrases, s.name)) {
      penalty += NEGATED_PRIMARY_PENALTY
      count += 1
    }
  }
  return { penalty, count }
}

function scoreDisease(entry, features) {
  const { normalizedText, duration, negatedPhrases } = features
  const primary = entry.symptoms?.primary ?? []
  const secondary = entry.symptoms?.secondary ?? []
  const differentiating = entry.symptoms?.differentiating ?? []

  const primaryResult = scoreSymptomGroup(primary, normalizedText, negatedPhrases, PRIMARY_WEIGHT_POINTS)
  const secondaryResult = scoreSymptomGroup(secondary, normalizedText, negatedPhrases, SECONDARY_WEIGHT_POINTS)
  const differentiatingResult = scoreSymptomGroup(differentiating, normalizedText, negatedPhrases, DIFFERENTIATING_WEIGHT_POINTS)
  const { penalty: negativePenalty } = scoreNegativePenalty(primary, negatedPhrases)

  let bonus = 0
  let durationMatched = false
  if (entry.duration_patterns && durationFitsPattern(duration, entry.duration_patterns)) {
    bonus += DURATION_BONUS
    durationMatched = true
  }

  let riskFactorMatches = 0
  for (const rf of entry.risk_factors ?? []) {
    if (containsPhrase(normalizedText, rf)) {
      bonus += RISK_FACTOR_BONUS
      riskFactorMatches += 1
    }
  }

  bonus += PREVALENCE_BONUS[entry.india_prevalence] ?? 0

  let seasonalMatched = false
  if (isCurrentSeason(entry.seasonal_pattern)) {
    bonus += SEASONAL_BONUS
    seasonalMatched = true
  }

  const rawScore =
    primaryResult.score + secondaryResult.score + differentiatingResult.score + bonus - negativePenalty
  const score = Math.max(0, Math.round(rawScore))

  return {
    entry,
    score,
    matchedPrimary: primaryResult.matched,
    matchedSecondary: secondaryResult.matched,
    matchedDifferentiating: differentiatingResult.matched,
    bonus,
    durationMatched,
    riskFactorMatches,
    seasonalMatched,
  }
}

function computeConfidence(result, entry) {
  const totalPrimary = (entry.symptoms?.primary ?? []).length
  const totalSecondary = (entry.symptoms?.secondary ?? []).length

  const primaryRatio = totalPrimary > 0 ? result.matchedPrimary.length / totalPrimary : 0
  const secondaryRatio = totalSecondary > 0 ? result.matchedSecondary.length / totalSecondary : 0
  const bonusFactor = Math.min(1, result.bonus / BONUS_NORMALIZER)

  const raw = primaryRatio * 0.6 + secondaryRatio * 0.25 + bonusFactor * 0.15
  return Math.min(CONFIDENCE_CAP, Math.max(CONFIDENCE_FLOOR, raw))
}

/** Ranking band: 1 for a confident match, 0 for a borderline one. Used as the
 * primary sort key so a confident common condition is never out-ranked on raw
 * score alone by a borderline match that happens to carry an urgent entry. */
function confidenceBand(result) {
  return result.confidence >= COMMON_CONDITION_MIN_CONFIDENCE ? 1 : 0
}

// ── Red flag check ────────────────────────────────────────────────────────────

function checkRedFlags(entry, normalizedText) {
  const matched = []
  for (const flag of entry.red_flags ?? []) {
    if (containsPhrase(normalizedText, flag)) matched.push(flag)
  }
  return matched
}

// ── Severity determination ───────────────────────────────────────────────────

function determineSeverity(entry, features, redFlagsMatched) {
  if (redFlagsMatched.length > 0) return 'severe'

  const qualifierLevel = features.severity.level
  const levels = entry.severity_levels ?? {}

  if (qualifierLevel === 'severe' && levels.severe) return 'severe'
  if (qualifierLevel === 'moderate' && levels.moderate) return 'moderate'
  if (qualifierLevel === 'mild' && levels.mild) return 'mild'

  // No explicit qualifier in the input — fall back to whichever level is
  // actually defined, preferring mild (avoids over-alarming on a vague match).
  if (levels.mild) return 'mild'
  if (levels.moderate) return 'moderate'
  if (levels.severe) return 'severe'
  return 'moderate'
}

// ── Result shaping ────────────────────────────────────────────────────────────

function buildMatchSummary(result, confidence, severity) {
  const { entry } = result
  const levelInfo = entry.severity_levels?.[severity] ?? {}
  const redFlagsMatched = result.redFlagsMatched ?? []

  let urgency = levelInfo.urgency ?? 'see-doctor-soon'
  let recommendations = [...(entry.recommendations ?? [])]

  if (redFlagsMatched.length > 0) {
    urgency = 'emergency'
    recommendations = ['SEEK IMMEDIATE MEDICAL ATTENTION — call 112 or 108 now.', ...recommendations]
  }

  // Severity/urgency invariant — these two fields are derived independently
  // above (severity from determineSeverity()'s qualifier/red-flag logic;
  // urgency from this entry's OWN severity_levels[severity].urgency, which
  // ~90 DB entries deliberately set to 'emergency' even on their 'mild' or
  // 'moderate' tier — e.g. viral meningitis, where "mild" symptoms still
  // can't be told apart from bacterial meningitis without a lumbar puncture,
  // so urgency stays emergency regardless of how mild it looks). That's
  // clinically correct as two separate axes, but rendered side by side in
  // the UI ("Severity: Mild" next to an "EMERGENCY" banner) it reads as a
  // flat self-contradiction, not a nuanced "looks mild, treat as urgent"
  // message. Never let severity be non-severe when urgency is emergency —
  // this is a strict output-shaping invariant, not a decision (there is no
  // amount of clinical nuance a badge pair can express without also failing
  // to alarm a user reading only the big red banner).
  if (urgency === 'emergency' && severity !== 'severe') {
    severity = 'severe'
  }

  return {
    disease: entry.name,
    id: entry.id,
    confidence: Math.round(confidence * 100) / 100,
    severity,
    urgency,
    specialist: entry.specialist ?? 'General Physician',
    category: entry.category,
    recommendations,
    redFlags: entry.red_flags ?? [],
    matchedRedFlags: redFlagsMatched,
    matchedPrimarySymptoms: result.matchedPrimary.map((s) => s.name),
    matchedSecondarySymptoms: result.matchedSecondary.map((s) => s.name),
    matchedDifferentiatingSymptoms: result.matchedDifferentiating.map((s) => s.name),
    similarDiseases: entry.similar_diseases ?? [],
    score: result.score,
  }
}

function defaultDiagnosis() {
  return {
    disease: 'Unspecified Condition',
    id: null,
    confidence: CONFIDENCE_FLOOR,
    severity: 'mild',
    urgency: 'see-doctor-soon',
    specialist: 'General Physician',
    category: 'General',
    recommendations: [
      'See a general physician for a proper examination and diagnosis',
      'Describe your symptoms in detail — onset, duration, severity',
      'Keep a symptom diary noting when symptoms are better or worse',
      'Ensure adequate rest, hydration, and nutrition while awaiting consultation',
    ],
    redFlags: ['Any breathing difficulty', 'Chest pain', 'Loss of consciousness or confusion', 'Symptoms rapidly worsening'],
    matchedRedFlags: [],
    matchedPrimarySymptoms: [],
    matchedSecondarySymptoms: [],
    matchedDifferentiatingSymptoms: [],
    similarDiseases: [],
    score: 0,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Diagnoses free-text symptoms against the local rule-based DISEASE_DB.
 *
 * @param {string} symptomText
 * @param {{ age?: number, gender?: string, location?: string }} [context]
 * @returns {{
 *   primary: object,
 *   differentials: object[],
 *   inputParsed: { symptoms: string, duration: object, severityQualifiers: string[], riskFactors: string[] },
 *   disclaimer: string,
 * }}
 */
export function localDiagnose(symptomText, context = {}) {
  const features = extractFeatures(symptomText)

  const scored = DISEASE_DB.map((entry) => scoreDisease(entry, features))

  // Attach red-flag matches once per candidate (needed for both the
  // threshold-independent risk check and the final response shaping).
  for (const result of scored) {
    result.redFlagsMatched = checkRedFlags(result.entry, features.normalizedText)
    // Confidence is now a RANKING input (see the banded sort below), not just
    // a display field computed on the final three, so it has to exist for
    // every candidate before any ordering decision is made.
    result.confidence = computeConfidence(result, result.entry)
  }

  const tokenCount = features.normalizedText ? features.normalizedText.split(' ').length : 0

  // MIN_PRIMARY_MATCHES is a "need genuine overlap, not one coincidental
  // word" anti-false-positive gate — but 58 of 275 DB entries (e.g.
  // bone_osteoporosis: primary=['back pain'], respiratory_pharyngitis:
  // primary=['throat pain']) have only ONE clinically real primary symptom.
  // Requiring 2 there isn't a stricter check, it's an unsatisfiable one:
  // no phrasing of real symptoms could ever qualify them, and for the ~23
  // of those with no red_flags either, the entry was structurally
  // undiagnosable, full stop — never reachable by any user input. Scale the
  // requirement to what the entry actually defines instead of padding
  // single-symptom conditions with synthetic "primary" symptoms just to
  // satisfy a fixed threshold.
  let qualifying = scored.filter((r) => {
    const primaryCount = r.entry.symptoms?.primary?.length ?? 0
    const requiredPrimaryMatches = Math.max(1, Math.min(MIN_PRIMARY_MATCHES, primaryCount))
    return r.score >= MIN_SCORE && r.matchedPrimary.length >= requiredPrimaryMatches
  })

  // Short-input relaxation — see SHORT_INPUT_* above. Deliberately a
  // FALLBACK, not a widening of the filter: it runs only when the strict gate
  // admitted nobody, so it can never inject a weak single-primary candidate
  // into an otherwise healthy result set, only replace the generic default.
  const relaxed = []
  if (qualifying.length === 0 && tokenCount > 0 && tokenCount <= SHORT_INPUT_MAX_TOKENS) {
    for (const r of scored) {
      if (r.matchedPrimary.length !== 1) continue
      if (r.matchedPrimary[0].weight < SHORT_INPUT_MIN_PRIMARY_WEIGHT) continue
      if (r.score < SHORT_INPUT_MIN_SCORE) continue
      relaxed.push(r)
    }
  }

  const redFlagged = scored
    .filter((r) => r.redFlagsMatched.length > 0)
    .sort((a, b) => b.score - a.score)

  if (relaxed.length > 0) {
    // A matched red flag preempts a relaxed short-input match ONLY when the
    // red-flagged candidate is itself a confident match. A borderline
    // red-flag hit (the 45%-and-below band) is exactly the case that used to
    // bury an obvious common condition under an emergency banner, so it no
    // longer gets to override — it stays available through the safety net
    // below for the case where nothing else qualifies at all.
    const confidentRedFlag = redFlagged.some((r) => r.confidence >= COMMON_CONDITION_MIN_CONFIDENCE)
    if (!confidentRedFlag) qualifying = relaxed
  }

  // Rank by confidence band first, then raw score within the band — see
  // COMMON_CONDITION_MIN_CONFIDENCE above for why score alone was the wrong
  // sole key.
  qualifying.sort(
    (a, b) => (confidenceBand(b) - confidenceBand(a)) || (b.score - a.score),
  )

  const riskFactorsMentioned = []
  if (qualifying.length > 0) {
    for (const rf of qualifying[0].entry.risk_factors ?? []) {
      if (containsPhrase(features.normalizedText, rf)) riskFactorsMentioned.push(rf)
    }
  }

  const inputParsed = {
    symptoms: features.normalizedText,
    duration: features.duration,
    severityQualifiers: features.severity.qualifiers,
    riskFactors: riskFactorsMentioned,
  }

  const disclaimer =
    'MediFind provides preliminary health information only. This is NOT a medical diagnosis. ' +
    'Please consult a qualified healthcare professional. For emergencies, call 112 or 108.'

  if (qualifying.length === 0) {
    // Red-flag safety net. checkRedFlags() ran for every candidate above
    // regardless of whether it qualified — but qualifying itself requires
    // >=2 matched PRIMARY symptoms, which a sparse, panicked symptom
    // description (or a genuinely single-symptom-pathognomonic condition,
    // e.g. a thunderclap headache) can easily fail even when a red flag DID
    // match. Without this check, a matched red flag was computed and then
    // silently discarded — the bland default was returned even for input
    // that unambiguously named an emergency warning sign. Surface the
    // highest-scoring red-flagged candidate instead, through the exact same
    // confidence/severity/urgency pipeline a normally-qualifying match uses
    // (determineSeverity + buildMatchSummary already force severity:'severe'
    // and urgency:'emergency' whenever redFlagsMatched is non-empty).
    if (redFlagged.length > 0) {
      const top = redFlagged[0]
      const confidence = top.confidence
      const severity = determineSeverity(top.entry, features, top.redFlagsMatched)
      const primary = buildMatchSummary(top, confidence, severity)
      return { primary, differentials: [], inputParsed, disclaimer }
    }

    return { primary: defaultDiagnosis(), differentials: [], inputParsed, disclaimer }
  }

  const top3 = qualifying.slice(0, 3)
  const summaries = top3.map((result) => {
    const confidence = result.confidence
    const severity = determineSeverity(result.entry, features, result.redFlagsMatched)
    return buildMatchSummary(result, confidence, severity)
  })

  const [primary, ...differentials] = summaries

  return {
    primary,
    differentials: differentials.map((d) => ({
      disease: d.disease,
      id: d.id,
      confidence: d.confidence,
      severity: d.severity,
    })),
    inputParsed,
    disclaimer,
  }
}

export default localDiagnose

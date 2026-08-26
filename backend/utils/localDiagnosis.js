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

// ── Three-tier matching ─────────────────────────────────────────────────────
// TIER 1 is the strict gate above (>=2 matched primaries, score >= MIN_SCORE).
// TIER 2 and 3 exist because the binary "qualify or fall back" design had only
// one answer for everything below the bar — "Unspecified Condition, 15%,
// see a general physician" — which is not a triage result, it is the engine
// declining to answer. A user who types "headache" has told us something real;
// answering "unspecified" is strictly worse than answering "tension headache,
// low confidence, here is what would make this clearer". The tiers degrade the
// CLAIM (confidence, urgency, an explicit note) rather than the ANSWER.
const PARTIAL_MIN_PRIMARY_WEIGHT = 0.6
const PARTIAL_MIN_SCORE = 20
const PARTIAL_MAX_CONFIDENCE = 0.45
const WEAK_MIN_CONFIDENCE = 0.15
const WEAK_MAX_CONFIDENCE = 0.25
const WEAK_CONFIDENCE_SCORE_SCALE = 20

const PARTIAL_MATCH_NOTE =
  'Based on limited symptoms — describe more symptoms for a more accurate result'
const WEAK_MATCH_NOTE =
  'These are possible conditions only — the symptoms given are too general to narrow down. ' +
  'Describe more symptoms, how long they have lasted, and how severe they are.'

// ── Urgency ladder ──────────────────────────────────────────────────────────
// Ranks, not array indices, so 'see-doctor-24h' and 'see-doctor-today' can
// share a rung: stepping down from 'see-doctor-today' lands on
// 'see-doctor-soon' rather than sliding sideways into the near-identical
// 'see-doctor-24h'.
const URGENCY_RANK = {
  'self-care': 0,
  'see-doctor-soon': 1,
  'see-doctor-24h': 2,
  'see-doctor-today': 2,
  'emergency': 3,
}
const URGENCY_BY_RANK = ['self-care', 'see-doctor-soon', 'see-doctor-today', 'emergency']

// Symptoms that set a FLOOR under urgency no matter what qualifier surrounds
// them. "Slight chest pain" is still chest pain: the qualifier describes how
// it feels, not how dangerous the cause is, and a patient minimising their own
// cardiac symptoms is the textbook presentation, not an edge case.
const URGENCY_FLOOR_SYMPTOMS = [
  'chest pain', 'chest tightness', 'chest pressure', 'chest discomfort',
  'dyspnea', 'one sided weakness', 'facial droop', 'speech difficulty',
  'loss of consciousness', 'sudden severe headache',
]
const URGENCY_FLOOR = 'see-doctor-today'
// ...with ONE exception: a benign trigger ("only after eating", "heartburn-
// like") is the qualifier that genuinely argues for reflux over a cardiac
// cause, so it lowers the floor by a rung instead of being ignored.
const URGENCY_FLOOR_WITH_BENIGN_TRIGGER = 'see-doctor-soon'

function urgencyRank(urgency) {
  return URGENCY_RANK[urgency] ?? 1
}

function stepUrgency(urgency, delta) {
  if (delta === 0) return urgency
  const rank = urgencyRank(urgency)
  const next = Math.max(0, Math.min(URGENCY_BY_RANK.length - 1, rank + delta))
  return URGENCY_BY_RANK[next]
}

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

// ── Symptom vocabulary ──────────────────────────────────────────────────────
// Every meaningful word used by any symptom name anywhere in the DB, built
// once at module load. This is what decides whether an input is a medical
// complaint at all: defaultDiagnosis() is now reserved for input with NO
// recognisable symptom word in it (gibberish, "hello", an empty box), so
// something has to be able to tell those apart from a real but sparse
// complaint. Derived from the DB rather than hand-listed so it can never
// drift out of sync with the entries it is meant to describe.
const VOCABULARY_STOPWORDS = new Set([
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'and', 'or', 'with', 'without',
  'for', 'from', 'by', 'my', 'your', 'is', 'are', 'was', 'were', 'be', 'been',
  'it', 'its', 'that', 'this', 'these', 'those', 'i', 'me', 'we', 'you', 'he',
  'she', 'they', 'not', 'no', 'than', 'then', 'when', 'while', 'after', 'before',
  'during', 'more', 'most', 'less', 'least', 'very', 'too', 'also', 'any', 'all',
  'some', 'one', 'two', 'other', 'others', 'such', 'same', 'like', 'as', 'if',
  'but', 'so', 'up', 'down', 'out', 'over', 'under', 'about', 'into', 'only',
  'own', 'just', 'can', 'cannot', 'cant', 'will', 'would', 'should', 'could',
  'may', 'might', 'must', 'have', 'has', 'had', 'do', 'does', 'did', 'being',
  'both', 'each', 'few', 'because', 'due', 'per', 'often', 'usually', 'may',
  'feel', 'feels', 'feeling', 'get', 'gets', 'getting', 'last', 'lasting',
  'how', 'hello', 'hey', 'thanks', 'thank', 'please', 'ok', 'okay', 'yes',
  'day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years', 'hour',
  'hours', 'since', 'ago', 'morning', 'night', 'evening', 'today', 'yesterday',
])

const SYMPTOM_VOCABULARY = (() => {
  const vocab = new Set()
  for (const entry of DISEASE_DB) {
    for (const group of ['primary', 'secondary', 'differentiating']) {
      for (const s of entry.symptoms?.[group] ?? []) {
        for (const word of normalize(s.name).split(' ')) {
          if (word.length >= 3 && !VOCABULARY_STOPWORDS.has(word)) vocab.add(word)
        }
      }
    }
  }
  return vocab
})()

/** True when the input names at least one thing the knowledge base recognises
 * as a symptom. False for gibberish, greetings, and empty input — the only
 * cases that may still fall through to defaultDiagnosis(). */
function hasRecognizableSymptom(normalizedText) {
  if (!normalizedText) return false
  return normalizedText.split(' ').some((w) => SYMPTOM_VOCABULARY.has(w))
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

/** How many of this entry's symptoms the input actually named, across all
 * three groups. Distinct from `score`, which also includes prevalence,
 * seasonal and duration bonuses that accrue with no symptom match at all. */
function matchedSymptomCount(result) {
  return result.matchedPrimary.length
    + result.matchedSecondary.length
    + result.matchedDifferentiating.length
}

/** An entry whose whole purpose is a specific dangerous combination of
 * symptoms, not a disease in its own right. Held out of the partial/weak
 * tiers unless one of its red flags genuinely fired. */
function isRedFlagEntry(entry) {
  return entry.category === 'Emergency Red Flag'
}

/** Confidence, clamped to what the matching tier can honestly claim. A
 * partial match never reads above 45%, and a symptom-only match sits in the
 * 15–25% band the UI renders as "possible condition" rather than an answer. */
function tierConfidence(result, tier) {
  if (tier === 2) return Math.min(PARTIAL_MAX_CONFIDENCE, result.confidence)
  if (tier === 3) {
    const spread = WEAK_MAX_CONFIDENCE - WEAK_MIN_CONFIDENCE
    const reach = Math.min(1, result.score / WEAK_CONFIDENCE_SCORE_SCALE)
    return WEAK_MIN_CONFIDENCE + spread * reach
  }
  return result.confidence
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

// ── Urgency adjustment ───────────────────────────────────────────────────────

/**
 * Applies the tier penalty and the user's own severity qualifiers to an
 * entry's declared urgency, then enforces the floor for symptoms that are
 * never safe to de-escalate.
 *
 * The three inputs deliberately CLAMP to a single step rather than summing:
 * a weak-tier match described with the word "mild" is still only one notch
 * less urgent than the entry says, not two. Stacking them was how a real
 * complaint could walk itself all the way down to 'self-care'.
 */
function adjustUrgency(urgency, { tier, features, redFlagsMatched }) {
  // A matched red flag has already forced urgency to 'emergency' by the time
  // anything else gets a say, and nothing here is allowed to walk that back —
  // a qualifier like "mild" or "after eating" appearing in the same sentence
  // as a genuine warning sign describes the symptom, not the danger.
  if (redFlagsMatched.length > 0) return urgency

  let delta = 0
  if (tier >= 2) delta -= 1
  if (features.severity.downgrade) delta -= 1
  if (features.severity.upgrade) delta += 1
  delta = Math.max(-1, Math.min(1, delta))

  return applyUrgencyFloor(stepUrgency(urgency, delta), features)
}

function applyUrgencyFloor(urgency, features) {
  const hit = URGENCY_FLOOR_SYMPTOMS.some(
    (s) => containsPhrase(features.normalizedText, s) && !isNegated(features.negatedPhrases, s),
  )
  if (!hit) return urgency

  const floor = features.severity.benignTrigger
    ? URGENCY_FLOOR_WITH_BENIGN_TRIGGER
    : URGENCY_FLOOR
  return urgencyRank(urgency) >= urgencyRank(floor) ? urgency : floor
}

// ── Result shaping ────────────────────────────────────────────────────────────

function buildMatchSummary(result, confidence, severity, { tier = 1, features, note = null } = {}) {
  const { entry } = result
  const levelInfo = entry.severity_levels?.[severity] ?? {}
  const redFlagsMatched = result.redFlagsMatched ?? []

  let urgency = levelInfo.urgency ?? 'see-doctor-soon'
  let recommendations = [...(entry.recommendations ?? [])]

  if (features) {
    urgency = adjustUrgency(urgency, { tier, features, redFlagsMatched })
  }

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
    matchTier: tier,
    note,
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
    matchTier: 0,
    note: 'No recognisable symptoms were found in what you described. ' +
      'Try naming what you feel and where — for example "headache and fever for two days".',
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

  const redFlagged = scored
    .filter((r) => r.redFlagsMatched.length > 0)
    .sort((a, b) => b.score - a.score)

  // ── Red-flag safety net, ahead of the lower tiers ─────────────────────────
  // Order matters more than it looks. TIER 2 and 3 will happily find SOME
  // partial match for almost any input — that is their whole job — so if they
  // run first, they permanently shadow the safety net: "throat closing after a
  // bee sting" came back as Viral Fever (self-care) because the word "fever"
  // was nowhere in it but a high-prevalence monsoon entry still out-scored an
  // anaphylaxis red flag that had genuinely fired. A matched red flag is the
  // strongest signal this engine can produce and it is not something a
  // consolation match is allowed to outrank.
  const hasRedFlag = redFlagged.length > 0

  // ── TIER 2 — partial match ────────────────────────────────────────────────
  // One genuinely characteristic primary symptom, or a real-but-under-
  // threshold total. Emergency-red-flag entries are held out unless one of
  // their red flags actually fired: those entries are defined by a specific
  // dangerous COMBINATION ("chest pain with breathlessness"), and letting one
  // surface on a single generic symptom would put an ambulance banner on the
  // word "chest pain" — the exact false positive their own authors documented
  // when they stripped the bare terms out of red_flags.
  let tier = 1
  if (qualifying.length === 0 && !hasRedFlag) {
    const partial = scored.filter((r) => {
      if (r.matchedPrimary.length === 0) return false
      if (isRedFlagEntry(r.entry) && r.redFlagsMatched.length === 0) return false
      const strongestPrimary = Math.max(...r.matchedPrimary.map((s) => s.weight))
      const strongSingle = strongestPrimary >= PARTIAL_MIN_PRIMARY_WEIGHT
      const nearMissScore = r.score >= PARTIAL_MIN_SCORE && r.score < MIN_SCORE
      return strongSingle || nearMissScore
    })
    if (partial.length > 0) {
      qualifying = partial
      tier = 2
    }
  }

  // ── TIER 3 — symptom-only match ───────────────────────────────────────────
  // The input names something the DB recognises but nothing lands anywhere
  // near a real match. Rather than refusing to answer, offer the best-scoring
  // candidates explicitly labelled as possibilities. Still requires a non-zero
  // score: listing entries that matched literally nothing would be inventing
  // a differential, not reporting one.
  if (qualifying.length === 0 && !hasRedFlag && hasRecognizableSymptom(features.normalizedText)) {
    const weak = scored.filter((r) => {
      // score > 0 is NOT enough on its own. Prevalence and seasonal bonuses
      // are added before any symptom is matched, so every high-prevalence
      // monsoon entry carries 13 free points and would qualify here against
      // literally any input — which is how Viral Fever became the answer to
      // "rigid board-like abdomen". Require that the entry matched something
      // the user actually said.
      if (matchedSymptomCount(r) === 0) return false
      return !(isRedFlagEntry(r.entry) && r.redFlagsMatched.length === 0)
    })
    if (weak.length > 0) {
      qualifying = weak
      tier = 3
    }
  }

  // Rank by confidence band first, then raw score within the band — see
  // COMMON_CONDITION_MIN_CONFIDENCE above for why score alone was the wrong
  // sole key. Only TIER 1 uses the band: tiers 2 and 3 cap confidence below
  // the band boundary anyway, so there the band is uniformly 0 and score is
  // the only meaningful ordering left.
  if (tier === 1) {
    qualifying.sort(
      (a, b) => (confidenceBand(b) - confidenceBand(a)) || (b.score - a.score),
    )
  } else {
    qualifying.sort((a, b) => b.score - a.score)
  }

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
      const primary = buildMatchSummary(top, confidence, severity, { tier: 1, features })
      return { primary, differentials: [], inputParsed, disclaimer }
    }

    // Reached only when the input contains no recognisable symptom word at
    // all — see hasRecognizableSymptom() and the TIER 3 branch above.
    return { primary: defaultDiagnosis(), differentials: [], inputParsed, disclaimer }
  }

  const note = tier === 2 ? PARTIAL_MATCH_NOTE : tier === 3 ? WEAK_MATCH_NOTE : null

  const top3 = qualifying.slice(0, 3)
  const summaries = top3.map((result) => {
    const confidence = tierConfidence(result, tier)
    const severity = determineSeverity(result.entry, features, result.redFlagsMatched)
    return buildMatchSummary(result, confidence, severity, { tier, features, note })
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

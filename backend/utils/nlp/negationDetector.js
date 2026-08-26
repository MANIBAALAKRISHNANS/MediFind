// Detects explicitly denied symptoms — "no fever", "not coughing",
// "without rash", "denies chest pain" — so the scoring engine can subtract
// points instead of adding them (see localDiagnosis.js NEGATED_PRIMARY_PENALTY).
import { normalize } from './tokenizer.js'

// Captures the negator word and the phrase that follows it, stopping at
// punctuation or common conjunctions so "no fever, no cough" yields two
// separate negated phrases rather than one run-on phrase.
const NEGATION_RE =
  /\b(?:no|not|without|denies|denied|negative for|absence of|non[\s-]?)\s+([a-z][a-z\s]{1,40}?)(?=[,.;!?]|\s+(?:and|but|or|with|since|for|however)\b|$)/gi

// Words that shouldn't be treated as the start of a negated symptom even if
// they immediately follow a negator (avoids false positives like "no idea").
const STOPWORDS = new Set(['idea', 'problem', 'issues', 'issue', 'clue'])

/**
 * @param {string} rawText — original (not yet normalised) symptom text, so
 *   negation phrasing like "can't" survives basicClean's punctuation strip
 *   only after this runs (normalize() is applied to each captured phrase).
 * @returns {string[]} — normalised, deduplicated list of denied symptom phrases
 */
export function detectNegations(rawText) {
  const source = String(rawText ?? '').toLowerCase()
  const negated = new Set()

  let match
  NEGATION_RE.lastIndex = 0
  while ((match = NEGATION_RE.exec(source)) !== null) {
    const phrase = match[1].trim()
    if (!phrase) continue
    const firstWord = phrase.split(' ')[0]
    if (STOPWORDS.has(firstWord)) continue
    if (isAbsenceSymptom(match[0])) continue

    const normalized = normalize(phrase)
    if (normalized) negated.add(normalized)
  }

  return [...negated]
}

/**
 * Distinguishes "no appetite" (a SYMPTOM — anorexia) from "no fever" (a
 * denial). Both are a negator followed by a body word, so the regex above
 * cannot tell them apart, and treating the first as a denial was actively
 * harmful: "no appetite" cancelled 'loss of appetite' everywhere it appears,
 * so the engine matched nothing at all and answered "Unspecified Condition"
 * to a perfectly clear complaint. Same for "no energy", "no motion", "not
 * eating" — all of them idioms where the negation is part of the symptom's
 * name, and all of them phrases the synonym map already knows.
 *
 * That is exactly what this uses as the test, rather than a hand-kept list:
 * normalise the WHOLE negated phrase, and normalise the negator plus the
 * phrase separately. If the two agree ("no loose motions" → "no diarrhea"
 * either way) the negator is doing its ordinary job and this is a real
 * denial. If they disagree ("no appetite" → "loss of appetite" as a whole,
 * but "no appetite" piecewise) the synonym map has recognised the negator as
 * part of a symptom name, and it must not be treated as a denial.
 */
function isAbsenceSymptom(fullMatch) {
  const whole = normalize(fullMatch)
  if (!whole) return false

  const trimmed = String(fullMatch).trim().toLowerCase()
  const firstSpace = trimmed.indexOf(' ')
  if (firstSpace < 0) return false

  const negator = trimmed.slice(0, firstSpace)
  const rest = trimmed.slice(firstSpace + 1)
  const piecewise = `${normalize(negator)} ${normalize(rest)}`.trim()

  return whole !== piecewise
}

/**
 * Checks whether a given symptom name was explicitly denied — matches if
 * either phrase contains the other (after normalisation), so "no fever"
 * cancels a disease symptom named "high fever" or just "fever".
 */
export function isNegated(negatedPhrases, symptomName) {
  const normalizedSymptom = normalize(symptomName)
  if (!normalizedSymptom) return false
  return negatedPhrases.some(
    (neg) => normalizedSymptom.includes(neg) || neg.includes(normalizedSymptom),
  )
}

export default { detectNegations, isNegated }

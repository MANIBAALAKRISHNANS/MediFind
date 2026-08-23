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

    const normalized = normalize(phrase)
    if (normalized) negated.add(normalized)
  }

  return [...negated]
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

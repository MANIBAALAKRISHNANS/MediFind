// Defines the shape every disease entry in backend/utils/diseases/**/*.js
// must follow, and a lightweight (warn-only, never throws) dev-time
// validator so a malformed entry fails loudly in the console instead of
// silently never matching. See README.md → "Disease knowledge base" for the
// full field-by-field explanation.
//
// Shape (JSDoc — not enforced by the runtime, just documentation + the
// validator's checklist):
//
// {
//   id: "unique_string_id",                    // e.g. "viral_dengue"
//   name: "Disease Name",                       // display name
//   category: "Category",                       // e.g. "Infectious - Viral"
//   aliases: ["other names", "common names"],
//   symptoms: {
//     primary: [{ name, weight, description }],       // ≥2 matched for a normal match; a
//                                                     // 1–3 word input can qualify on ONE
//                                                     // match of weight ≥0.8 (localDiagnosis.js
//                                                     // → SHORT_INPUT_*)
//     secondary: [{ name, weight, description }],      // boosts confidence
//     differentiating: [{ name, weight, description }], // distinguishes from similar diseases
//   },
//   duration_patterns: { acute, typical, chronic },     // free-text patterns, e.g. "< 7 days"
//   severity_levels: {
//     mild:     { description, urgency },
//     moderate: { description, urgency },
//     severe:   { description, urgency },
//   },
//   risk_factors: ["recent travel to endemic area", ...],
//   red_flags: ["bleeding gums", ...],
//   specialist: "General Physician",
//   india_prevalence: "high" | "moderate" | "low" | "rare",
//   seasonal_pattern: "monsoon" | "winter" | "summer" | "post-monsoon" | null,
//   age_relevance: "all" | "children" | "adults" | "elderly",
//   gender_relevance: "all" | "male" | "female",
//   similar_diseases: ["chikungunya", "malaria", ...],
//   recommendations: ["Stay hydrated...", ...],
// }

const REQUIRED_TOP_LEVEL = [
  'id', 'name', 'category', 'symptoms', 'severity_levels',
  'specialist', 'recommendations',
]

const VALID_INDIA_PREVALENCE = new Set(['high', 'moderate', 'low', 'rare'])
const VALID_AGE_RELEVANCE = new Set(['all', 'children', 'adults', 'elderly'])
const VALID_GENDER_RELEVANCE = new Set(['all', 'male', 'female'])
const VALID_URGENCY = new Set(['self-care', 'see-doctor-24h', 'see-doctor-soon', 'see-doctor-today', 'emergency'])

function isSymptomArray(arr) {
  return Array.isArray(arr) && arr.every(
    (s) => s && typeof s.name === 'string' && typeof s.weight === 'number',
  )
}

/**
 * Validates one disease entry. Returns an array of human-readable problems
 * (empty = valid). Never throws — this runs at module-load time via
 * diseases/index.js and a bad entry should warn, not crash the server.
 */
export function validateDiseaseEntry(entry) {
  const problems = []
  if (!entry || typeof entry !== 'object') {
    return ['entry is not an object']
  }

  for (const field of REQUIRED_TOP_LEVEL) {
    if (entry[field] == null) problems.push(`missing required field "${field}"`)
  }

  if (entry.symptoms) {
    if (!isSymptomArray(entry.symptoms.primary) || entry.symptoms.primary.length === 0) {
      problems.push('symptoms.primary must be a non-empty array of { name, weight }')
    }
    if (entry.symptoms.secondary != null && !isSymptomArray(entry.symptoms.secondary)) {
      problems.push('symptoms.secondary must be an array of { name, weight }')
    }
    if (entry.symptoms.differentiating != null && !isSymptomArray(entry.symptoms.differentiating)) {
      problems.push('symptoms.differentiating must be an array of { name, weight }')
    }
  }

  if (entry.severity_levels) {
    for (const level of ['mild', 'moderate', 'severe']) {
      const def = entry.severity_levels[level]
      if (def && def.urgency && !VALID_URGENCY.has(def.urgency)) {
        problems.push(`severity_levels.${level}.urgency "${def.urgency}" is not a recognised urgency value`)
      }
    }
  }

  if (entry.india_prevalence != null && !VALID_INDIA_PREVALENCE.has(entry.india_prevalence)) {
    problems.push(`india_prevalence "${entry.india_prevalence}" must be one of high|moderate|low|rare`)
  }
  if (entry.age_relevance != null && !VALID_AGE_RELEVANCE.has(entry.age_relevance)) {
    problems.push(`age_relevance "${entry.age_relevance}" must be one of all|children|adults|elderly`)
  }
  if (entry.gender_relevance != null && !VALID_GENDER_RELEVANCE.has(entry.gender_relevance)) {
    problems.push(`gender_relevance "${entry.gender_relevance}" must be one of all|male|female`)
  }
  if (!Array.isArray(entry.recommendations) || entry.recommendations.length === 0) {
    problems.push('recommendations must be a non-empty array of strings')
  }

  return problems
}

export default { validateDiseaseEntry }

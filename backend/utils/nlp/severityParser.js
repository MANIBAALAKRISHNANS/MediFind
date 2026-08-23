// Detects severity qualifiers in free-text symptoms — words like "severe",
// "mild", "unbearable" — and any body-location phrases ("left arm", "lower
// back", "behind eyes"). Used by the scoring engine to help pick a severity
// level and is echoed back in the API response's inputParsed field.

const SEVERE_WORDS = [
  'severe', 'unbearable', 'excruciating', 'intense', 'worst', 'extreme',
  'extremely', 'critical', 'debilitating', 'agonizing', 'agonising',
  "can't breathe", 'cannot breathe', 'crushing', 'sudden severe',
  'rapidly worsening', 'getting worse fast',
]

const MODERATE_WORDS = [
  'moderate', 'significant', 'bad', 'strong', 'persistent', 'constant',
  'considerable', 'noticeable', 'worsening',
]

const MILD_WORDS = [
  'mild', 'slight', 'minor', 'little', 'occasional', 'faint',
  'barely noticeable', 'not too bad', 'manageable',
]

// Common body-location phrases the parser can recognise — kept short and
// deliberately not exhaustive since it's used for display/context, not scoring.
const LOCATION_PHRASES = [
  'left arm', 'right arm', 'left leg', 'right leg', 'left side', 'right side',
  'lower back', 'upper back', 'lower abdomen', 'upper abdomen',
  'behind eyes', 'behind the eyes', 'chest', 'left chest', 'right chest',
  'lower right abdomen', 'lower left abdomen', 'jaw', 'neck', 'shoulder',
  'left shoulder', 'right shoulder', 'temple', 'temples', 'forehead',
  'back of head', 'left foot', 'right foot', 'left hand', 'right hand',
]

function findMatches(text, words) {
  return words.filter((w) => text.includes(w))
}

/**
 * @param {string} normalizedText
 * @returns {{ qualifiers: string[], level: 'mild'|'moderate'|'severe'|null, locations: string[] }}
 */
export function parseSeverity(normalizedText) {
  const text = ` ${String(normalizedText ?? '')} `

  const severeMatches = findMatches(text, SEVERE_WORDS)
  const moderateMatches = findMatches(text, MODERATE_WORDS)
  const mildMatches = findMatches(text, MILD_WORDS)

  let level = null
  if (severeMatches.length) level = 'severe'
  else if (moderateMatches.length) level = 'moderate'
  else if (mildMatches.length) level = 'mild'

  const qualifiers = [...severeMatches, ...moderateMatches, ...mildMatches]
  const locations = LOCATION_PHRASES.filter((loc) => text.includes(loc))

  return { qualifiers, level, locations }
}

export default { parseSeverity }

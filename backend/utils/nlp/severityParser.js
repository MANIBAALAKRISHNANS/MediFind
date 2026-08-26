// Detects severity qualifiers in free-text symptoms — words like "severe",
// "mild", "unbearable" — and any body-location phrases ("left arm", "lower
// back", "behind eyes"). Used by the scoring engine to help pick a severity
// level and is echoed back in the API response's inputParsed field.

// NOTE: every list here is matched against text that has ALREADY been through
// normalize(), which strips apostrophes — so the apostrophe-free spelling is
// the one that can actually match ("cant breathe", not "can't breathe"). Both
// are kept: the apostrophe forms are harmless, and parseSeverity() is called
// with raw text in some callers' tests.
const SEVERE_WORDS = [
  'severe', 'unbearable', 'excruciating', 'intense', 'worst', 'extreme',
  'extremely', 'critical', 'debilitating', 'agonizing', 'agonising',
  "can't breathe", 'cannot breathe', 'cant breathe', 'crushing', 'sudden severe',
  'rapidly worsening', 'getting worse fast',
  // Upgrade cues added for the severity-qualifier UPGRADE rule in
  // localDiagnosis.js. 'suddenly' (not bare 'sudden') on purpose: 'sudden
  // onset' is a legitimate differentiating SYMPTOM name on several entries
  // (influenza, migraine) and must not be read as a severity qualifier.
  'suddenly', 'all of a sudden', 'cant move', "can't move", 'cannot move',
  'collapsed', 'passing out',
]

const MODERATE_WORDS = [
  'moderate', 'significant', 'bad', 'strong', 'persistent', 'constant',
  'considerable', 'noticeable', 'worsening',
]

const MILD_WORDS = [
  'mild', 'slight', 'minor', 'little', 'occasional', 'faint',
  'barely noticeable', 'not too bad', 'manageable',
  'sometimes', 'a bit', 'on and off', 'comes and goes', 'now and then',
  'once in a while', 'off and on',
]

// Qualifiers that name a BENIGN TRIGGER rather than an intensity — "only
// after I eat", "heartburn-like". They read as mild, but they are kept in
// their own list rather than folded into MILD_WORDS because they are not
// interchangeable with it: "after eating" is the phrase that separates reflux
// from cardiac chest pain (localDiagnosis.js consults `benignTrigger` for
// exactly that), while a general urgency downgrade on "after eating" would
// also fire on "throat tightness after eating shrimp" — anaphylaxis — and
// quietly de-escalate a genuine emergency.
const BENIGN_TRIGGER_WORDS = [
  'after eating', 'after meals', 'after a meal', 'when i eat', 'while eating',
  'heartburn like', 'heartburn-like', 'spicy food', 'after food',
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
  const benignTriggerMatches = findMatches(text, BENIGN_TRIGGER_WORDS)

  let level = null
  if (severeMatches.length) level = 'severe'
  else if (moderateMatches.length) level = 'moderate'
  else if (mildMatches.length || benignTriggerMatches.length) level = 'mild'

  const qualifiers = [...severeMatches, ...moderateMatches, ...mildMatches, ...benignTriggerMatches]
  const locations = LOCATION_PHRASES.filter((loc) => text.includes(loc))

  return {
    qualifiers,
    level,
    locations,
    // Direction flags consumed by localDiagnosis.js's urgency adjustment. A
    // 'severe' qualifier and a 'mild' one can both be present ("severe pain
    // that comes and goes"); `level` already resolves that by precedence, and
    // these keep the raw signal so the caller can decide independently.
    upgrade: severeMatches.length > 0,
    downgrade: severeMatches.length === 0 && (mildMatches.length > 0 || benignTriggerMatches.length > 0),
    benignTrigger: benignTriggerMatches.length > 0,
  }
}

export default { parseSeverity }

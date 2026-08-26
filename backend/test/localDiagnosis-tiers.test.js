// Guards the three-tier matching system (localDiagnosis.js TIER 1/2/3) and the
// promise it exists to keep: a user who names a real symptom always gets a real
// answer, never "Unspecified Condition".
//
// The two failure modes here pull against each other, so both are asserted on
// the same inputs. Loosen the engine and ordinary complaints start coming back
// as emergencies (bare "tiredness" once matched an infant RSV red flag and
// returned urgency: 'emergency'); tighten it and they fall through to the
// generic default (which is what "headache" used to do). A case list that only
// checked one side would pass while the other silently broke — which is exactly
// how the RSV regression survived a green run.
import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import localDiagnose from '../utils/localDiagnosis.js'

const URGENCY_RANK = {
  'self-care': 0,
  'see-doctor-soon': 1,
  'see-doctor-24h': 2,
  'see-doctor-today': 2,
  'emergency': 3,
}

// Single symptoms and colloquial Indian-English phrasing. None of these is an
// emergency and none may reach the generic fallback.
const EVERYDAY_COMPLAINTS = [
  'headache', 'stomach pain', 'back pain', 'dizziness', 'fatigue', 'fever',
  'cough', 'nausea', 'rash', 'body pain', 'throat pain', 'loose motion',
  'vomiting', 'burning urination', 'body is paining', 'stomach is paining',
  'head is paining', 'loose motions since morning', 'feeling giddy',
  'no appetite', 'running nose and fever', 'whole body ache', 'mild headache',
  'slight fever', 'tired lately', 'indigestion', 'slight stomach discomfort',
]

describe('localDiagnose — everyday complaints get a real answer, not the fallback', () => {
  for (const symptoms of EVERYDAY_COMPLAINTS) {
    test(`"${symptoms}" → a named condition`, () => {
      const { primary } = localDiagnose(symptoms)
      assert.notEqual(
        primary.disease, 'Unspecified Condition',
        `"${symptoms}" fell through to defaultDiagnosis(): ${JSON.stringify(primary)}`,
      )
    })
  }
})

describe('localDiagnose — everyday complaints must not escalate to emergency', () => {
  for (const symptoms of EVERYDAY_COMPLAINTS) {
    test(`"${symptoms}" → urgency !== emergency`, () => {
      const { primary } = localDiagnose(symptoms)
      assert.notEqual(
        primary.urgency, 'emergency',
        `"${symptoms}" escalated: ${JSON.stringify({ disease: primary.disease, urgency: primary.urgency, tier: primary.matchTier })}`,
      )
    })
  }
})

// Input with nothing medical in it is the ONLY thing still allowed to reach
// defaultDiagnosis() — that is the whole point of the tiers above.
describe('localDiagnose — non-medical input still falls back', () => {
  for (const symptoms of ['hello', 'how are you', 'asdfghjkl', 'ok thanks']) {
    test(`"${symptoms}" → Unspecified Condition`, () => {
      const { primary } = localDiagnose(symptoms)
      assert.equal(primary.disease, 'Unspecified Condition')
      assert.equal(primary.matchTier, 0)
    })
  }
})

// Severity qualifiers move urgency, but never below the floor for symptoms
// that are not safe to de-escalate, and never above it for ordinary ones.
const QUALIFIED = [
  { symptoms: 'chest pain', urgency: 'see-doctor-today' },
  { symptoms: 'slight chest pain', minUrgency: 'see-doctor-today' },
  { symptoms: 'chest tightness', minUrgency: 'see-doctor-today' },
  { symptoms: 'heart pain', minUrgency: 'see-doctor-today' },
  { symptoms: 'chest hurts', minUrgency: 'see-doctor-today' },
  // "after eating" is the one qualifier that genuinely argues for reflux over
  // a cardiac cause, so it — and only it — lowers the cardiac floor a rung.
  { symptoms: 'mild chest pain after eating', urgency: 'see-doctor-soon' },
  { symptoms: 'crushing chest pain', urgency: 'emergency' },
  { symptoms: 'chest pain with shortness of breath', urgency: 'emergency' },
  { symptoms: 'severe headache', minUrgency: 'see-doctor-today' },
  { symptoms: 'mild headache', maxUrgency: 'see-doctor-soon' },
  { symptoms: 'slight fever', urgency: 'self-care' },
  { symptoms: 'high fever with chills', minUrgency: 'see-doctor-today' },
]

describe('localDiagnose — severity qualifiers adjust urgency within safe bounds', () => {
  for (const c of QUALIFIED) {
    test(`"${c.symptoms}" → ${c.urgency ?? (c.minUrgency ? '>= ' + c.minUrgency : '<= ' + c.maxUrgency)}`, () => {
      const { primary } = localDiagnose(c.symptoms)
      const got = `got ${JSON.stringify({ disease: primary.disease, urgency: primary.urgency, severity: primary.severity })}`

      if (c.urgency) assert.equal(primary.urgency, c.urgency, got)
      if (c.minUrgency) {
        assert.ok(URGENCY_RANK[primary.urgency] >= URGENCY_RANK[c.minUrgency], `expected at least ${c.minUrgency}, ${got}`)
      }
      if (c.maxUrgency) {
        assert.ok(URGENCY_RANK[primary.urgency] <= URGENCY_RANK[c.maxUrgency], `expected at most ${c.maxUrgency}, ${got}`)
      }
    })
  }
})

// Full multi-symptom presentations must still resolve to the specific
// condition — the tiers are a floor under the engine, not a replacement for it.
const SPECIFIC = [
  { symptoms: 'fever headache body aches', disease: /influenza/i, tier: 1 },
  { symptoms: 'fever headache cough stiff neck', disease: /meningitis/i, tier: 1, urgency: 'emergency' },
  { symptoms: 'crushing chest pain sweating', disease: /heart attack/i, urgency: 'emergency' },
  { symptoms: 'mild cough runny nose', disease: /common cold/i, tier: 1 },
  { symptoms: 'burning urination frequent urination', disease: /urinary tract/i, tier: 1 },
]

describe('localDiagnose — multi-symptom input still resolves to the specific condition', () => {
  for (const c of SPECIFIC) {
    test(`"${c.symptoms}" → ${c.disease}`, () => {
      const { primary } = localDiagnose(c.symptoms)
      const got = JSON.stringify({ disease: primary.disease, tier: primary.matchTier, urgency: primary.urgency })
      assert.match(primary.disease, c.disease, got)
      if (c.tier) assert.equal(primary.matchTier, c.tier, got)
      if (c.urgency) assert.equal(primary.urgency, c.urgency, got)
    })
  }
})

// A partial or symptom-only match must SAY it is one — the confidence cap and
// the note are how the answer stays honest about how little it rests on.
describe('localDiagnose — lower tiers cap confidence and carry a note', () => {
  test('a partial (TIER 2) match is capped at 45% and annotated', () => {
    const { primary } = localDiagnose('headache')
    assert.equal(primary.matchTier, 2)
    assert.ok(primary.confidence <= 0.45, `confidence ${primary.confidence} exceeds the TIER 2 cap`)
    assert.match(primary.note, /limited symptoms/i)
  })

  test('a full (TIER 1) match carries no caveat', () => {
    const { primary } = localDiagnose('fever headache cough stiff neck')
    assert.equal(primary.matchTier, 1)
    assert.equal(primary.note, null)
  })
})

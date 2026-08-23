// Broad-sweep false-positive check across the WHOLE 275-entry disease DB at
// once — not entry-by-entry like localDiagnosis.test.js. Runs a batch of
// completely ordinary, non-emergency symptom phrases through localDiagnose()
// and asserts none of them return urgency: 'emergency'. This is the check
// for the exact class of bug this whole pass was hunting: a red_flags
// phrase, anywhere in the DB, broad enough to fire on everyday language.
import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import localDiagnose from '../utils/localDiagnosis.js'

const ORDINARY_PHRASES = [
  'mild headache',
  'slight stomach discomfort',
  'a little dizzy after standing up',
  'small rash on arm',
  'tired lately',
  'mild cough for two days',
  'sore throat',
  'a little bit of back pain from sitting all day',
  'mild joint stiffness in the morning',
  'occasional heartburn after meals',
  'slight itching on my leg',
  'mild acne breakout',
  'a bit of nasal congestion',
  'minor bruise on my knee',
  'feeling a little anxious about work',
]

describe('localDiagnose — broad sweep: ordinary phrases must never return urgency: emergency', () => {
  for (const phrase of ORDINARY_PHRASES) {
    test(`"${phrase}" → urgency !== emergency`, () => {
      const result = localDiagnose(phrase)
      assert.notEqual(
        result.primary.urgency, 'emergency',
        `expected NOT emergency for ordinary phrase "${phrase}", got: ` +
        JSON.stringify({
          disease: result.primary.disease,
          urgency: result.primary.urgency,
          severity: result.primary.severity,
          matchedRedFlags: result.primary.matchedRedFlags,
        }),
      )
    })
  }
})

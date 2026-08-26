// Guards the specialty disqualification rules in utils/ranking.js.
//
// The bug these cover: a single-speciality facility that cannot treat the
// requested problem at all — an eye hospital, a dental clinic, a maternity
// home — stayed in the fallback list, and because ranking weights distance at
// 40%, being nearer was enough to make it the recommended facility. Someone
// with chest pain was sent to the eye hospital down the road.
import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import { findBestMatch, normalizeSpecialty, SPECIALTY_KEYWORDS } from '../utils/ranking.js'

const USER_LAT = 13.0
const USER_LNG = 80.2

/** A facility `km` due north of the user, so distances are exact and readable. */
function at(name, km, type = 'hospital') {
  return { name, type, lat: USER_LAT + km / 111.32, lng: USER_LNG, osmId: 'node/1' }
}

function names(result) {
  return (result.facilities ?? []).map((f) => f.name)
}

describe('findBestMatch — a nearer wrong-speciality facility never wins', () => {
  test('eye hospital at 0.69km loses to a general hospital at 1.1km for Emergency Medicine', () => {
    const eye = at('Aravind Eye Hospital', 0.69)
    const general = at('ACS Medical College And Hospital', 1.1)

    const result = findBestMatch([eye, general], 'Emergency Medicine', USER_LAT, USER_LNG)

    assert.equal(result.bestMatch.name, 'ACS Medical College And Hospital')
    assert.ok(
      !names(result).some((n) => /aravind/i.test(n)),
      `the eye hospital was not disqualified: ${JSON.stringify(names(result))}`,
    )
    assert.ok(result.bestMatch.distanceKm > 0.69, 'the closer facility should have been rejected')
  })

  const WRONG_KIND = [
    'Aravind Eye Hospital',
    'Sankara Nethralaya',        // the other transliteration — 'netralaya' alone misses it
    'Vasan Eye Care',
    'Smile Dental Clinic',
    'City Maternity Home',
    'Bloom Fertility Centre',
    'Glow Skin And Cosmetic Clinic',
    'Happy Paws Veterinary Hospital',
  ]

  for (const specialty of ['Emergency Medicine', 'General Physician']) {
    for (const wrong of WRONG_KIND) {
      test(`${specialty}: "${wrong}" is disqualified even when it is the closest`, () => {
        const result = findBestMatch(
          [at(wrong, 0.2), at('City General Hospital', 4)],
          specialty, USER_LAT, USER_LNG,
        )
        assert.equal(result.bestMatch.name, 'City General Hospital', `got ${JSON.stringify(names(result))}`)
      })
    }
  }
})

describe('findBestMatch — genuine matches are not caught by the new negatives', () => {
  const KEEP = [
    ['Emergency Medicine', 'Apollo Emergency & Trauma Centre'],
    ['Emergency Medicine', 'Government General Hospital Casualty'],
    ['Emergency Medicine', '24x7 Accident Care Hospital'],
    ['General Physician', 'Rajiv Gandhi Government General Hospital'],
    ['General Physician', 'Chennai Multi Speciality Hospital'],
    // A negative keyword does NOT disqualify when a positive is also present —
    // a teaching hospital attached to an eye department still treats patients.
    ['General Physician', 'Aravind Eye Hospital and Medical College'],
    ['Ophthalmologist', 'Sankara Nethralaya'],
  ]

  for (const [specialty, name] of KEEP) {
    test(`${specialty}: "${name}" still scores a full specialty match`, () => {
      const result = findBestMatch([at(name, 1)], specialty, USER_LAT, USER_LNG)
      assert.equal(result.bestMatch.name, name)
      assert.equal(result.bestMatch.scoreBreakdown.specialtyScore, 35)
    })
  }
})

// Aliases are merged into the positive keyword list, which is matched as a
// word PREFIX — so a two-letter alias matches the start of ordinary words.
// 'er' hit "Erode" and "Ernakulam", real Indian place names, scoring those
// facilities a perfect specialty match AND making them immune to every
// negative keyword (disqualification requires hasNegative && !hasPositive).
describe('findBestMatch — two-letter aliases do not match as word prefixes', () => {
  test('a dental clinic in Erode is not an Emergency Medicine match', () => {
    const result = findBestMatch(
      [at('Erode Dental Care', 0.3, 'clinic'), at('City General Hospital', 4)],
      'Emergency Medicine', USER_LAT, USER_LNG,
    )
    assert.equal(result.bestMatch.name, 'City General Hospital', `got ${JSON.stringify(names(result))}`)
  })

  test('an eye hospital in Ernakulam is not an Emergency Medicine match', () => {
    const result = findBestMatch(
      [at('Ernakulam Eye Care', 0.3), at('City General Hospital', 4)],
      'Emergency Medicine', USER_LAT, USER_LNG,
    )
    assert.equal(result.bestMatch.name, 'City General Hospital', `got ${JSON.stringify(names(result))}`)
  })

  // The aliases must still do the job they were added for.
  test('"er" and "gp" still resolve as specialty aliases', () => {
    assert.equal(normalizeSpecialty('er'), 'emergency medicine')
    assert.equal(normalizeSpecialty('ER'), 'emergency medicine')
    assert.equal(normalizeSpecialty('gp'), 'general physician')
  })
})

describe('findBestMatch — last-resort fallback returns usable facilities', () => {
  // Reachable now that emergency medicine has negative keywords at all: when
  // every candidate is disqualified, the branch used to pass the disqualified
  // objects straight through, which carry totalScore 0 and no breakdown.
  test('when everything is disqualified, the fallback is still scored and annotated', () => {
    const result = findBestMatch([at('Aravind Eye Hospital', 0.5)], 'Emergency Medicine', USER_LAT, USER_LNG)

    assert.equal(result.bestMatch.name, 'Aravind Eye Hospital')
    assert.ok(result.bestMatch.matchScore > 0, 'last-resort facility came back with matchScore 0')
    assert.ok(result.bestMatch.scoreBreakdown, 'last-resort facility lost its scoreBreakdown')
    assert.match(result.note, /No nearby facility matches Emergency Medicine/)
  })

  test('the last-resort list is ordered closest-first', () => {
    const result = findBestMatch(
      [at('Far Eye Hospital', 6), at('Near Eye Hospital', 0.5), at('Mid Dental Hospital', 2)],
      'Emergency Medicine', USER_LAT, USER_LNG,
    )
    assert.equal(result.bestMatch.name, 'Near Eye Hospital')
    assert.deepEqual(names(result), ['Near Eye Hospital', 'Mid Dental Hospital', 'Far Eye Hospital'])
  })
})

describe('SPECIALTY_KEYWORDS — every specialty declares negatives', () => {
  test('no specialty has an empty negative list', () => {
    const empty = Object.entries(SPECIALTY_KEYWORDS)
      .filter(([, def]) => !def.negative || def.negative.length === 0)
      .map(([key]) => key)

    assert.deepEqual(empty, [], `these specialties disqualify nothing: ${empty.join(', ')}`)
  })
})

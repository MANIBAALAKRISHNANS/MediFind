// Guards the specialty disqualification rules in utils/ranking.js.
//
// The bug these cover: a single-speciality facility that cannot treat the
// requested problem at all — an eye hospital, a dental clinic, a maternity
// home — stayed in the fallback list, and because ranking weights distance at
// 40%, being nearer was enough to make it the recommended facility. Someone
// with chest pain was sent to the eye hospital down the road.
import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import {
  findBestMatch, normalizeSpecialty, classifyFacility,
  SPECIALTY_KEYWORDS, SPECIALTY_DOMAINS,
} from '../utils/ranking.js'

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

describe('findBestMatch — genuine matches survive domain disqualification', () => {
  const KEEP = [
    ['Emergency Medicine', 'Apollo Emergency & Trauma Centre'],
    ['Emergency Medicine', 'Government General Hospital Casualty'],
    ['Emergency Medicine', '24x7 Accident Care Hospital'],
    ['General Physician', 'Rajiv Gandhi Government General Hospital'],
    ['General Physician', 'Chennai Multi Speciality Hospital'],
    // A broad-service signal ("Medical College") wins over the eye keyword —
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
// facilities a perfect 35/35 specialty match they had no claim to.
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
  // When every candidate is disqualified, this branch used to pass the
  // disqualified objects straight through — they carry totalScore 0 and no
  // breakdown, so the facility came back unscored and unsorted.
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

// The old invariant here was "no specialty ships an empty negative list".
// Manual negative lists are gone — disqualification is derived from
// classifyFacility() — so the equivalent guard is that the specialty→domain
// map cannot drift out of step with the domains that actually exist.
describe('SPECIALTY_DOMAINS — the domain map stays consistent', () => {
  test('every specialty maps only to domains classifyFacility can produce', () => {
    // A typo here would be invisible in production: the specialty would accept
    // a domain no facility is ever classified as, silently disqualifying every
    // specialized facility it was meant to match.
    const producible = new Set()
    for (const name of ['Eye Hospital', 'Dental Clinic', 'Maternity Home', 'Skin Clinic',
      'Ortho Centre', 'ENT Clinic', 'Heart Centre', 'Neuro Centre', 'Cancer Centre',
      'Child Hospital', 'Mental Health Centre', 'Ayurveda Centre', 'Animal Hospital']) {
      for (const d of classifyFacility({ name }).domains) producible.add(d)
    }

    for (const [specialty, domains] of Object.entries(SPECIALTY_DOMAINS)) {
      for (const domain of domains) {
        assert.ok(
          producible.has(domain),
          `${specialty} accepts domain "${domain}", which classifyFacility() never produces`,
        )
      }
    }
  })

  test('every canonical specialty in the domain map is a real specialty', () => {
    for (const specialty of Object.keys(SPECIALTY_DOMAINS)) {
      assert.ok(
        SPECIALTY_KEYWORDS[specialty],
        `"${specialty}" is not a key in SPECIALTY_KEYWORDS — it will never be looked up`,
      )
    }
  })

  test('the manual negative lists are gone for good', () => {
    const leftover = Object.entries(SPECIALTY_KEYWORDS)
      .filter(([, def]) => def.negative !== undefined)
      .map(([key]) => key)

    assert.deepEqual(
      leftover, [],
      `these still carry a negative list that no longer does anything: ${leftover.join(', ')}`,
    )
  })
})

describe('classifyFacility — facility kind is read from the facility, not the query', () => {
  const CASES = [
    // A broad-service signal always wins, wherever else the name points.
    ['ACS Medical College And Hospital', 'general', null],
    ['Apollo Multi Specialty Hospital', 'general', null],
    ['Rajiv Gandhi Government General Hospital', 'general', null],
    ['Aravind Eye Hospital and Medical College', 'general', null],
    // Specialized facilities.
    ['Aravind Eye Hospital', 'specialized', 'eye'],
    ['Sankara Nethralaya', 'specialized', 'eye'],
    ['Saveetha Dental College Hospital', 'specialized', 'dental'],
    ['Chennai Fertility Centre', 'specialized', 'maternity'],
    ['Skin and Hair Clinic', 'specialized', 'skin'],
    ['Chennai Heart Centre', 'specialized', 'cardiac'],
    ['Kids Care Hospital', 'specialized', 'pediatric'],
    ['Pet Care Animal Hospital', 'specialized', 'veterinary'],
    // Ambiguous words resolve to the more specific domain, by list order.
    ['Laser Eye Surgery Centre', 'specialized', 'eye'],
    // "Sacred Heart" is a mission-hospital name, not a cardiac unit.
    ['Sacred Heart Hospital', 'general', null],
    // Nothing to go on — benefit of the doubt.
    ['', 'general', null],
  ]

  for (const [name, type, domain] of CASES) {
    test(`"${name || '(unnamed)'}" → ${type}${domain ? '/' + domain : ''}`, () => {
      const c = classifyFacility({ name })
      assert.equal(c.type, type, `got ${JSON.stringify(c)}`)
      assert.equal(c.domain, domain, `got ${JSON.stringify(c)}`)
    })
  }

  test('a dual-specialty facility keeps both domains and answers either search', () => {
    const c = classifyFacility({ name: 'City Eye and ENT Hospital' })
    assert.deepEqual(c.domains, ['eye', 'ent'])

    for (const specialty of ['Ophthalmologist', 'ENT Specialist']) {
      const result = findBestMatch([at('City Eye and ENT Hospital', 1)], specialty, USER_LAT, USER_LNG)
      assert.equal(result.bestMatch.name, 'City Eye and ENT Hospital', `disqualified for ${specialty}`)
    }
  })

  test('a facility is classified from its address too, not just its name', () => {
    const c = classifyFacility({ name: 'Dr Rai Centre', address: 'Saveetha Dental College Campus, Chennai' })
    assert.equal(c.domain, 'dental')
  })
})

describe('scoreFacility — specialty SCORING is unchanged by the new disqualification', () => {
  // Disqualification decides eligibility; positive keywords still decide the
  // score. A general hospital with no cardiology keyword remains a valid
  // cardiology answer — it just scores below a heart centre.
  test('a general hospital is eligible for a cardiology search but scores below a heart centre', () => {
    const result = findBestMatch(
      [at('Rajiv Gandhi Government General Hospital', 0.5), at('Chennai Heart Centre', 3)],
      'Cardiologist', USER_LAT, USER_LNG,
    )
    assert.equal(result.bestMatch.name, 'Chennai Heart Centre')
    assert.equal(result.bestMatch.scoreBreakdown.specialtyScore, 35)
    assert.equal(result.note, null, 'a real specialty match was found')
  })

  test('the 25-point general-hospital tier still applies', () => {
    const result = findBestMatch([at('City General Hospital', 1)], 'Cardiologist', USER_LAT, USER_LNG)
    assert.equal(result.bestMatch.scoreBreakdown.specialtyScore, 25)
  })

  test('the 10-point clinic tier still applies', () => {
    const result = findBestMatch([at('Random Clinic', 1, 'clinic')], 'Cardiologist', USER_LAT, USER_LNG)
    assert.equal(result.bestMatch.scoreBreakdown.specialtyScore, 10)
  })
})

describe('findBestMatch — fallback prefers general facilities over specialized ones', () => {
  test('a general hospital outranks a nearer surviving specialized facility', () => {
    const result = findBestMatch(
      [at('General Hospital', 2), at('Random Clinic', 0.5, 'clinic')],
      'Cardiologist', USER_LAT, USER_LNG,
    )
    assert.equal(result.bestMatch.name, 'General Hospital')
  })

  test('a domain-matching specialized facility still loses to a general one in fallback', () => {
    // 'ivf' is a maternity-DOMAIN keyword but not a gynaecology POSITIVE one,
    // so this facility survives disqualification yet never reaches the
    // 30-point match bar. Both candidates land in the fallback path — and on
    // raw score the IVF centre wins it (72 vs 60, distance being 40% of the
    // total), so this only passes because general outranks specialized first.
    const result = findBestMatch(
      [at('Bloom IVF Centre', 0.3), at('City General Hospital', 5)],
      'Gynecologist', USER_LAT, USER_LNG,
    )

    assert.ok(result.facilities, 'expected the fallback path, not an exact match')
    assert.equal(result.bestMatch.name, 'City General Hospital')
    assert.ok(
      result.bestMatch.matchScore < result.facilities[1].matchScore,
      'the general hospital should be winning on the tier, not on score',
    )
    assert.ok(
      result.facilities.some((f) => f.name === 'Bloom IVF Centre'),
      'the domain-matching facility should still be offered, just ranked lower',
    )
  })
})

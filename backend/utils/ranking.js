// ─────────────────────────────────────────────────────────────────────────────
// Specialty alias map — canonical specialty key → the keywords/phrases that
// identify it. `aliases` are alternate ways the *specialty itself* might be
// phrased (including common Indian-English variants) — used to normalize
// whatever string the caller passes (e.g. from the diagnosis engine's
// `specialist` field) onto one of these canonical keys. `positive`/`negative`
// are keywords matched against a facility's name/speciality tag on OSM.
// `aliases` are also merged into `positive` since a facility is often named
// after the very phrase a patient would search for (e.g. "XYZ Heart Clinic").
// ─────────────────────────────────────────────────────────────────────────────
const SPECIALTY_KEYWORDS = {
  'general physician': {
    aliases:  ['general practice', 'gp', 'family medicine', 'general medicine', 'family physician', 'family doctor', 'primary care physician'],
    positive: ['general', 'multi', 'medical', 'polyclinic', 'family', 'primary care', 'practice'],
  },
  'infectious disease specialist': {
    aliases:  ['infectious disease', 'infectious diseases', 'id specialist'],
    positive: ['infectious', 'infection clinic', 'tropical disease', 'fever clinic', 'communicable disease'],
  },
  pulmonologist: {
    aliases:  ['pulmonology', 'chest specialist', 'lung specialist', 'respiratory medicine', 'pulmonary medicine', 'chest physician'],
    positive: ['pulmonolog', 'chest', 'respiratory', 'lung', 'thoracic', 'breathe', 'copd', 'asthma', 'bronch'],
  },
  gastroenterologist: {
    aliases:  ['gastroenterology', 'gi specialist', 'digestive disease specialist', 'stomach specialist'],
    positive: ['gastro', 'digest', 'colon', 'endoscopy', 'stomach'],
  },
  hepatologist: {
    aliases:  ['hepatology', 'liver specialist', 'liver disease specialist'],
    positive: ['hepatol', 'liver', 'hepatitis', 'cirrhosis', 'bile'],
  },
  cardiologist: {
    aliases:  ['cardiology', 'heart specialist', 'cardiac'],
    positive: ['cardio', 'heart', 'cardiac', 'pacemaker', 'angio', 'echo', 'ecg'],
  },
  'vascular specialist': {
    aliases:  ['vascular surgery', 'vein specialist', 'vascular medicine', 'vascular surgeon'],
    positive: ['vascular', 'vein', 'varicose', 'artery'],
  },
  neurologist: {
    aliases:  ['neurology', 'brain specialist', 'nerve specialist'],
    positive: ['neuro', 'brain', 'nerve', 'epilepsy', 'stroke', 'parkinson', 'headache clinic'],
  },
  orthopedic: {
    aliases:  ['orthopedics', 'bone specialist', 'orthopaedic', 'orthopaedics', 'bone doctor', 'orthopedic specialist', 'orthopaedic specialist'],
    positive: ['ortho', 'bone', 'joint', 'spine', 'fracture', 'trauma', 'sports medicine'],
  },
  rheumatologist: {
    aliases:  ['rheumatology', 'arthritis specialist'],
    positive: ['rheumatolog', 'autoimmune', 'arthritis', 'lupus', 'connective tissue'],
  },
  endocrinologist: {
    aliases:  ['endocrinology', 'hormone specialist'],
    positive: ['endocrinolog', 'thyroid', 'hormone', 'diabetes', 'metabolic', 'gland', 'diabetolog'],
  },
  urologist: {
    aliases:  ['urology', 'urinary specialist', 'prostate specialist'],
    positive: ['urolog', 'prostate', 'bladder', 'kidney stone', 'renal stone', 'nephro urology'],
  },
  nephrologist: {
    aliases:  ['nephrology', 'kidney specialist', 'renal specialist'],
    positive: ['nephrol', 'kidney', 'renal', 'dialysis', 'transplant'],
  },
  dermatologist: {
    aliases:  ['dermatology', 'skin specialist', 'skin doctor'],
    positive: ['skin', 'derma', 'cosmetic', 'hair', 'nail', 'laser'],
  },
  psychiatrist: {
    aliases:  ['psychiatry', 'mental health', 'mental health specialist', 'psychological medicine'],
    positive: ['psychiatry', 'mental', 'mind', 'psych', 'behavioural', 'addiction', 'rehab'],
  },
  hematologist: {
    aliases:  ['hematology', 'haematology', 'blood specialist', 'blood disorder specialist', 'haematologist'],
    positive: ['hematolog', 'haematolog', 'blood disorder', 'anemia', 'anaemia', 'thalassemia', 'leukemia'],
  },
  'ent specialist': {
    aliases:  ['otolaryngology', 'ear nose throat', 'ent doctor', 'ent surgeon'],
    positive: ['ent', 'ear', 'nose', 'throat', 'sinus', 'laryngo', 'audiolog'],
  },
  ophthalmologist: {
    aliases:  ['ophthalmology', 'eye specialist', 'eye doctor'],
    positive: ['eye', 'eyes', 'vision', 'optic', 'aravind', 'sankara', 'retina', 'glaucoma', 'cataract', 'cornea', 'ocular', 'sight', 'netralaya', 'nethralaya', 'netra', 'nayan', 'drishti'],
  },
  gynecologist: {
    aliases:  ['gynecology', 'gynaecology', 'obstetrics', 'obgyn', "women's health", 'maternity specialist', 'gynaecologist'],
    positive: ['gynec', 'gynaec', 'maternity', 'women', 'obstetric', 'fertility', 'prenatal', 'antenatal'],
  },
  pediatrician: {
    aliases:  ['pediatrics', 'paediatrics', 'child specialist', "children's hospital", 'child doctor', 'paediatrician'],
    positive: ['child', 'pediatric', 'paediatric', 'kids', 'neonat', 'infant'],
  },
  allergist: {
    aliases:  ['allergy specialist', 'immunology', 'allergy and immunology', 'allergist immunologist'],
    positive: ['allerg', 'immunolog', 'rhinitis', 'sensitisation', 'patch test'],
  },
  'emergency medicine': {
    aliases:  ['emergency physician', 'casualty', 'trauma center', 'trauma centre', 'er', 'accident and emergency', 'emergency room'],
    positive: ['emergency', 'casualty', 'trauma', 'accident', '24 hour', '24x7', 'ambulance'],
  },
  dentist: {
    aliases:  ['dental clinic', 'dental surgeon', 'oral health', 'dental care'],
    positive: ['dental', 'dentist', 'tooth', 'smile', 'oral', 'maxillo'],
  },
  oncologist: {
    aliases:  ['oncology', 'cancer specialist', 'cancer center', 'cancer centre'],
    positive: ['oncol', 'cancer', 'tumor', 'tumour', 'chemotherapy', 'radiation'],
  },
  'general surgeon': {
    aliases:  ['general surgery', 'surgeon'],
    positive: ['surgery', 'surgical', 'surgeon'],
  },
  neurosurgeon: {
    aliases:  ['neurosurgery', 'brain surgeon', 'spine surgeon'],
    positive: ['neurosurg', 'brain surgery', 'spine surgery'],
  },
  physiotherapist: {
    aliases:  ['physiotherapy', 'physical therapy', 'rehab specialist', 'physical therapist'],
    positive: ['physio', 'physiotherapy', 'rehabilitation', 'rehab'],
  },
  diabetologist: {
    aliases:  ['diabetes clinic', 'diabetes specialist', 'sugar specialist', 'diabetes center', 'diabetes centre'],
    positive: ['diabet', 'sugar clinic', 'blood sugar'],
  },
  radiologist: {
    aliases:  ['radiology', 'imaging center', 'imaging centre', 'diagnostic imaging', 'diagnostic center', 'diagnostic centre'],
    positive: ['radiolog', 'imaging', 'scan', 'x-ray', 'mri', 'ct scan', 'ultrasound', 'diagnostic'],
  },
  anesthesiologist: {
    aliases:  ['anesthesia', 'anaesthesiologist', 'anaesthesia', 'anesthetist', 'anaesthetist'],
    positive: ['anesthesi', 'anaesthesi'],
  },
  'sports medicine specialist': {
    aliases:  ['sports medicine', 'sports injury clinic', 'sports injury specialist'],
    positive: ['sports medicine', 'sports injury', 'sports clinic'],
  },
  geriatrician: {
    aliases:  ['geriatrics', 'elderly care specialist', 'old age specialist', 'geriatric medicine'],
    positive: ['geriatric', 'elderly care', 'senior citizen'],
  },
  andrologist: {
    aliases:  ['andrology', 'male fertility specialist'],
    positive: ['androlog', 'male fertility', "men's health"],
  },
  dietitian: {
    aliases:  ['nutritionist', 'dietician', 'nutrition clinic', 'dietary specialist'],
    positive: ['diet', 'nutrition', 'nutritionist', 'dietician'],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Facility specialisation domains
//
// Replaces the per-specialty `negative` keyword lists this table used to
// carry. Those encoded the problem backwards: each specialty had to name
// every OTHER kind of facility it did not want, so 34 lists had to stay
// mutually consistent by hand, and a gap in any one of them was invisible
// until a patient saw the wrong hospital. Emergency medicine shipped with an
// empty list and returned an eye hospital for chest pain; general physician,
// which backs most searches, was missing eye and dental.
//
// The relationship is really a property of the FACILITY, not of the
// specialty: an eye hospital is an eye hospital no matter who is searching.
// So classify the facility once, then ask whether the requested specialty
// wants that kind of place. Adding a specialty now needs no negative list at
// all, and a facility type nobody anticipated is excluded by default rather
// than included by default.
//
// Order matters — the FIRST domain listed wins the `domain` field, so the
// more specific reading of an ambiguous word comes first ("Laser Eye
// Surgery" is eye, not skin; "Laser Dentistry" is dental, not skin).
// `domains` keeps every match, so a genuinely dual-specialty facility
// ("Eye and ENT Hospital", "Spine and Neuro Centre") satisfies either search.
// ─────────────────────────────────────────────────────────────────────────────
const FACILITY_DOMAINS = [
  { domain: 'eye',         keywords: ['eye', 'eyes', 'ophthalm', 'optical', 'vision', 'netralaya', 'nethralaya', 'retina', 'cataract', 'glaucoma', 'cornea'] },
  { domain: 'dental',      keywords: ['dental', 'dentist', 'tooth', 'teeth', 'oral', 'maxillo'] },
  { domain: 'maternity',   keywords: ['maternity', 'fertility', 'ivf', 'prenatal', 'antenatal', 'obstetric', 'gynec', 'gynaec'] },
  { domain: 'skin',        keywords: ['skin', 'derma', 'cosmetic', 'laser'] },
  { domain: 'ortho',       keywords: ['ortho', 'bone', 'joint', 'spine', 'fracture'] },
  // Deliberately NOT bare "ent" — it is a literal substring of "Government"
  // and "Centre", both everywhere in Indian hospital names.
  { domain: 'ent',         keywords: ['ent clinic', 'ent hospital', 'ear nose', 'hearing', 'audiolog'] },
  { domain: 'cardiac',     keywords: ['heart', 'cardiac', 'cardio', 'angio', 'ecg'] },
  { domain: 'neuro',       keywords: ['neuro', 'brain', 'nerve'] },
  { domain: 'cancer',      keywords: ['oncol', 'cancer', 'tumor', 'tumour', 'chemotherapy'] },
  { domain: 'pediatric',   keywords: ['child', 'pediatric', 'paediatric', 'kids', 'neonat'] },
  // Bare "rehab" is left out on purpose: it reads as de-addiction here but
  // as physiotherapy just as often ("XYZ Rehabilitation Centre"), and
  // misfiling a physio centre as psychiatric would hide it from the searches
  // it should answer.
  { domain: 'psychiatric', keywords: ['psych', 'mental', 'behavioural', 'behavioral', 'addiction'] },
  { domain: 'ayurvedic',   keywords: ['ayurved', 'siddha', 'unani', 'homeo', 'naturopathy'] },
]

// A facility describing itself in any of these terms is a broad-service
// facility, whatever else its name mentions: "ACS Medical College And
// Hospital" and "Apollo Multi Specialty Hospital" are general, and a
// department name in the rest of the string does not narrow them.
// 'sacred heart' is here as a false-positive guard, not a general signal —
// it is a common mission-hospital name across India and has nothing to do
// with cardiology, but 'heart' would otherwise file it under cardiac and
// hide it from every non-cardiac search.
const GENERAL_SIGNALS = ['multi', 'general', 'medical college', 'polyclinic', 'sacred heart']

// Veterinary facilities are excluded from every human specialty, including
// the no-specialty fallback — not a domain mismatch but a category error.
const VETERINARY_SIGNALS = ['veterinary', 'animal', 'pet clinic', 'pet care', 'pet hospital']

// Canonical specialty → the facility domain(s) it is willing to be matched
// with. Anything absent accepts no specialized domain at all, so a facility
// built around some other body part is excluded automatically.
const SPECIALTY_DOMAINS = {
  cardiologist:                 ['cardiac'],
  'vascular specialist':        ['cardiac'],
  neurologist:                  ['neuro'],
  neurosurgeon:                 ['neuro'],
  ophthalmologist:              ['eye'],
  dentist:                      ['dental'],
  gynecologist:                 ['maternity'],
  dermatologist:                ['skin'],
  orthopedic:                   ['ortho'],
  'sports medicine specialist': ['ortho'],
  'ent specialist':             ['ent'],
  oncologist:                   ['cancer'],
  pediatrician:                 ['pediatric'],
  psychiatrist:                 ['psychiatric'],
}

/**
 * Reads a facility's name, speciality tag and address and decides what KIND
 * of place it is.
 *
 * @returns {{ type: "general"|"specialized", domain: string|null, domains: string[], veterinary: boolean }}
 *   `domain` is the primary (first-listed) match, kept for readability;
 *   `domains` is every match, which is what the disqualification check uses.
 *   An unnamed or untagged facility comes back "general" — benefit of the
 *   doubt, since excluding a facility we know nothing about would quietly
 *   drop real hospitals that OSM simply records thinly.
 */
function classifyFacility(facility) {
  const text = [facility?.name, facility?.speciality, facility?.address]
    .filter(Boolean).join(' ').toLowerCase()

  if (!text.trim()) return { type: 'general', domain: null, domains: [], veterinary: false }

  const veterinary = VETERINARY_SIGNALS.some((k) => startsWord(text, k))
  if (veterinary) return { type: 'specialized', domain: 'veterinary', domains: ['veterinary'], veterinary: true }

  if (GENERAL_SIGNALS.some((k) => startsWord(text, k))) {
    return { type: 'general', domain: null, domains: [], veterinary: false }
  }

  const domains = FACILITY_DOMAINS
    .filter((d) => d.keywords.some((k) => startsWord(text, k)))
    .map((d) => d.domain)

  return domains.length > 0
    ? { type: 'specialized', domain: domains[0], domains, veterinary: false }
    : { type: 'general', domain: null, domains: [], veterinary: false }
}

// ── Word-boundary-safe substring match ───────────────────────────────────────
// Prevents false positives like the "gp" alias matching inside "Group
// Hospital" (a common Indian hospital naming pattern) that a naive
// `.includes()` would have produced.
function includesWord(haystack, needle) {
  if (!haystack || !needle) return false
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, 'i').test(haystack)
}

// ── Word-START-safe prefix match ─────────────────────────────────────────────
// Used for scoreFacility()'s positive/negative keyword lists, which are
// deliberately word-STEMS/prefixes of longer clinical terms (e.g. 'cardio'
// is meant to match inside "Cardiology", 'neuro' inside "Neurology",
// 'hepatol' inside "Hepatology") — includesWord()'s trailing-boundary
// requirement blocks exactly those matches, since a letter (not a boundary)
// follows the stem. Plain, unanchored .includes() is NOT a safe substitute:
// several of these keywords are short common-English fragments that collide
// with ordinary words when matched with no boundary at all — most
// importantly 'ent' (a negative keyword for 12+ specialties, meant as the
// ENT-clinic abbreviation) is a literal substring of "Government" and
// "Centre/Center", both extremely common in real Indian hospital names
// (e.g. "Rajiv Gandhi Government General Hospital", "Chennai Heart Centre" —
// both real facilities this ranking correctly matched earlier; unanchored
// .includes() would wrongly disqualify both from cardiology/neurology/etc.
// searches). Requiring a boundary immediately BEFORE the keyword — but not
// after — gets both properties at once: 'cardio' still matches at the start
// of "Cardiology" (preceded by a word boundary), while 'ent' no longer
// matches mid-word inside "government" or "centre" (preceded by a letter,
// not a boundary).
function startsWord(haystack, needle) {
  if (!haystack || !needle) return false
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?:^|[^a-z0-9])${escaped}`, 'i').test(haystack)
}

/**
 * Resolves a free-form specialty string (however it's phrased — including the
 * Indian-English variants callers commonly use) onto one of the canonical
 * SPECIALTY_KEYWORDS keys. Returns null if nothing matches, which signals
 * "no exact specialty match" to findBestMatch.
 */
function normalizeSpecialty(specialty) {
  if (!specialty) return null
  const s = specialty.trim().toLowerCase()
  if (SPECIALTY_KEYWORDS[s]) return s

  for (const [canonical, def] of Object.entries(SPECIALTY_KEYWORDS)) {
    if (def.aliases?.some((alias) => s === alias || includesWord(s, alias) || includesWord(alias, s))) {
      return canonical
    }
  }
  return null
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function scoreFacility(facility, canonicalSpecialty, userLat, userLng) {
  const distanceKm = haversine(userLat, userLng, facility.lat, facility.lng)
  // address is included so a facility whose own name/speciality tags are
  // generic (e.g. "Dr.Rai Cbcc Centre") still gets caught by a negative
  // keyword that only shows up in its address (e.g. "...Dental College
  // Campus...") — see the disqualification test in findDoctor.test.js.
  const nameLower = `${facility.name || ''} ${facility.speciality || ''} ${facility.address || ''}`.toLowerCase()
  const def = canonicalSpecialty ? SPECIALTY_KEYWORDS[canonicalSpecialty] : null
  // Aliases join the positive list because facilities are often named after
  // the phrase a patient would search for — but the two-letter ones must not,
  // because positives are matched with startsWord(), i.e. as word PREFIXES.
  // 'er' (emergency medicine) therefore matched the first word of "Erode
  // Dental Care" and "Ernakulam ..." — both real Indian place names — scoring
  // them a full 35/35 specialty match. Worse, hasPositive suppresses
  // disqualification, so those facilities also became immune to every negative
  // keyword: a dental clinic in Erode was returned as the best emergency
  // match. 'gp' has the same shape. Both stay usable by normalizeSpecialty(),
  // which matches aliases with includesWord() — whole words, both sides — and
  // is not affected.
  const positiveKeywords = def
    ? [...def.positive, ...(def.aliases ?? []).filter((alias) => alias.length > 2)]
    : []

  // HARD DISQUALIFY — see classifyFacility() above. A general facility is
  // never disqualified; a specialized one survives only when the requested
  // specialty actually wants that kind of place.
  const classification = classifyFacility(facility)

  if (classification.veterinary) {
    return { totalScore: 0, distanceKm, disqualified: true, reason: 'veterinary', classification }
  }

  if (canonicalSpecialty && classification.type === 'specialized') {
    const wanted = SPECIALTY_DOMAINS[canonicalSpecialty] ?? []
    if (!classification.domains.some((d) => wanted.includes(d))) {
      return { totalScore: 0, distanceKm, disqualified: true, reason: 'wrong-specialty', classification }
    }
  }

  // Positive matching is unchanged — it decides the specialty SCORE (below),
  // never whether a facility is eligible. The two questions are separate: a
  // general hospital with no cardiology keyword is still a valid answer for a
  // cardiology search, it just scores lower than a heart centre.
  const hasPositive = positiveKeywords.some((k) => startsWord(nameLower, k))

  // SPECIALTY MATCH SCORE (35%)
  let specialtyScore = 0
  if (hasPositive) specialtyScore = 35
  else if (facility.type === 'hospital' && /general|multi|medical college|gh\b/i.test(facility.name || '')) specialtyScore = 25
  else if (facility.type === 'hospital') specialtyScore = 18
  else if (facility.type === 'clinic') specialtyScore = 10
  else specialtyScore = 5

  // DISTANCE SCORE (40%) — closer = better; steep falloff beyond 5km, zero after 12km
  const distanceScore = distanceKm <= 5
    ? Math.max(0, (5 - distanceKm) / 5) * 20 + 20   // 0-5km: 20-40 pts
    : Math.max(0, (12 - distanceKm) / 7) * 20        // 5-12km: 0-20 pts

  // FACILITY TYPE SCORE (15%)
  let typeScore = 0
  if (facility.type === 'hospital') typeScore = 15
  else if (facility.type === 'clinic') typeScore = 10
  else if (facility.type === 'doctors') typeScore = 8
  else typeScore = 5

  // COMPLETENESS SCORE (10%) — has phone, address, hours = more reliable
  let completenessScore = 0
  if (facility.phone) completenessScore += 5
  if (facility.address) completenessScore += 3
  if (facility.openingHours) completenessScore += 2

  const totalScore = specialtyScore + distanceScore + typeScore + completenessScore

  return {
    totalScore: Math.round(totalScore),
    distanceKm,
    disqualified: false,
    classification,
    breakdown: { specialtyScore, distanceScore, typeScore, completenessScore },
  }
}

function formatFacility(f, specialty) {
  return {
    name: f.name || f.address || 'Nearby Facility',
    address: f.address,
    phone: f.phone,
    website: f.website,
    type: f.type,
    distanceKm: Number(f.distanceKm.toFixed(2)),
    openingHours: f.openingHours,
    lat: f.lat,
    lng: f.lng,
    osmId: f.osmId,
    osmMapUrl: `https://www.openstreetmap.org/${f.osmId}`,
    directionsUrl: `https://www.openstreetmap.org/directions?from=${f._userLat},${f._userLng}&to=${f.lat},${f.lng}`,
    matchScore: f.totalScore,
    scoreBreakdown: f.breakdown,
    recommendedSpecialty: specialty,
    source: 'OpenStreetMap',
  }
}

/**
 * Scores and ranks nearby facilities against a requested specialty.
 *
 * Returns:
 *   - { bestMatch, note: null, facilities: null }        — a real specialty match was found.
 *   - { bestMatch, note: '<explanatory note>', facilities: [...] } — no facility matched the
 *     requested specialty; `facilities` lists ALL nearby (non-disqualified) health facilities,
 *     closest first, so the caller can render "no exact match — here's what's nearby".
 *   - { bestMatch: null, note: null, facilities: null }   — nothing usable at all.
 */
function findBestMatch(facilities, specialty, userLat, userLng) {
  if (!facilities || facilities.length === 0) return { bestMatch: null, note: null, facilities: null }

  const canonicalSpecialty = normalizeSpecialty(specialty)

  // Disqualify facilities with neither a name nor an address (raw/incomplete
  // OSM nodes) — they carry nothing a patient could act on.
  const scored = facilities
    .filter((f) => f.lat != null && f.lng != null && (f.name || f.address))
    .map((f) => ({ ...f, _userLat: userLat, _userLng: userLng, ...scoreFacility(f, canonicalSpecialty, userLat, userLng) }))

  const matched = scored.filter((f) => !f.disqualified && f.breakdown?.specialtyScore >= 30)

  if (matched.length > 0) {
    matched.sort((a, b) => b.totalScore - a.totalScore)
    return { bestMatch: formatFacility(matched[0], specialty), note: null, facilities: null }
  }

  // No exact specialty match — fall back to ALL nearby non-disqualified facilities.
  let candidates = scored.filter((f) => !f.disqualified)
  let lastResort = false

  if (candidates.length === 0) {
    // Everything got disqualified — fall back to the closest hospital, any
    // specialty. Showing a patient the one hospital in range beats showing
    // them nothing, as long as the note says plainly that it does not match.
    //
    // RE-SCORED with a null specialty rather than reused as-is. A disqualified
    // result carries totalScore: 0 and NO breakdown at all (see scoreFacility's
    // early return), so passing those straight through produced facilities with
    // matchScore: 0 and scoreBreakdown: undefined — a field the response
    // contract documents, silently dropped on serialisation — and made the sort
    // below meaningless, since every score was 0. That left this branch
    // returning an arbitrary hospital while its own comment promised the
    // closest. Re-scoring with a null specialty disqualifies nothing, so every
    // candidate comes back with a real distance-weighted score and breakdown.
    //
    // Barely reachable until now: emergency medicine and general physician had
    // almost no negative keywords, so "everything disqualified" could not happen
    // for the two commonest searches. Tightening those lists is what makes this
    // path live.
    candidates = scored
      .filter((f) => f.type === 'hospital')
      .map((f) => ({ ...f, ...scoreFacility(f, null, userLat, userLng) }))
      // A null specialty waives the DOMAIN check but not the veterinary
      // one, so re-filter: a vet hospital is never an answer for a person,
      // not even as a last resort.
      .filter((f) => !f.disqualified)
    lastResort = candidates.length > 0
  }

  if (candidates.length === 0) {
    return { bestMatch: null, note: null, facilities: null }
  }

  // General facilities first, then by score.
  //
  // The general-before-specialized tier matters because this is the "nothing
  // matched what you asked for" path. A specialized facility only reaches
  // here when its domain was acceptable but its name carried no positive
  // keyword, and against a request nothing satisfied, a hospital that treats
  // everything is a better answer than one built around a single body part —
  // regardless of which is nearer. Distance is 40% of totalScore, so without
  // this tier a closer specialist would keep winning the very case where the
  // engine has already admitted it has no idea what the patient needs.
  //
  // Within a tier, score rather than distance alone: a well-documented
  // hospital slightly farther away should outrank a bare unnamed node that's
  // marginally closer, and totalScore already weighs distance alongside type
  // and completeness.
  const isGeneral = (f) => (f.classification?.type ?? 'general') === 'general'
  candidates.sort((a, b) => (isGeneral(b) - isGeneral(a)) || (b.totalScore - a.totalScore))
  const allFormatted = candidates.map((f) => formatFacility(f, specialty))

  return {
    bestMatch: allFormatted[0],
    note: lastResort
      // Every nearby facility was ruled out as the wrong kind of place for this
      // specialty (an eye hospital for chest pain, say). Say so, rather than
      // wording it like an ordinary near-miss.
      ? `No nearby facility matches ${specialty}. These are the closest hospitals — call ahead to check they can help:`
      : 'No exact specialty match found. Here are nearby health facilities:',
    facilities: allFormatted,
  }
}

export { haversine, findBestMatch, normalizeSpecialty, classifyFacility, SPECIALTY_KEYWORDS, SPECIALTY_DOMAINS }

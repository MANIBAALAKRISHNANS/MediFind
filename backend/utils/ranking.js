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
    // Had only ['veterinary', 'animal'] while 24 of the 34 specialties here
    // already excluded eye and dental — and this is the one that matters most,
    // since the diagnosis engine defaults `specialist` to "General Physician",
    // so it backs the majority of real searches. A single-speciality clinic
    // still survives this if its name ALSO carries a positive ("... Eye
    // Hospital and Medical College" keeps 'medical'), which is the intended
    // behaviour of the hasNegative && !hasPositive rule below.
    negative: [
      'eye', 'optical', 'ophthalm', 'vision', 'netralaya', 'nethralaya',
      'dental', 'maternity', 'fertility', 'veterinary', 'animal',
      'skin', 'derma', 'cosmetic',
    ],
  },
  'infectious disease specialist': {
    aliases:  ['infectious disease', 'infectious diseases', 'id specialist'],
    positive: ['infectious', 'infection clinic', 'tropical disease', 'fever clinic', 'communicable disease'],
    negative: ['eye', 'dental', 'maternity', 'ortho', 'ent'],
  },
  pulmonologist: {
    aliases:  ['pulmonology', 'chest specialist', 'lung specialist', 'respiratory medicine', 'pulmonary medicine', 'chest physician'],
    positive: ['pulmonolog', 'chest', 'respiratory', 'lung', 'thoracic', 'breathe', 'copd', 'asthma', 'bronch'],
    negative: ['eye', 'dental', 'maternity', 'child', 'pediatric', 'skin', 'ent', 'ortho', 'fertility', 'cardio', 'neuro'],
  },
  gastroenterologist: {
    aliases:  ['gastroenterology', 'gi specialist', 'digestive disease specialist', 'stomach specialist'],
    positive: ['gastro', 'digest', 'colon', 'endoscopy', 'stomach'],
    negative: ['eye', 'dental', 'maternity', 'ortho', 'skin', 'ent', 'cardio'],
  },
  hepatologist: {
    aliases:  ['hepatology', 'liver specialist', 'liver disease specialist'],
    positive: ['hepatol', 'liver', 'hepatitis', 'cirrhosis', 'bile'],
    negative: ['eye', 'dental', 'maternity', 'child', 'pediatric', 'skin', 'ent', 'cardio', 'ortho'],
  },
  cardiologist: {
    aliases:  ['cardiology', 'heart specialist', 'cardiac'],
    positive: ['cardio', 'heart', 'cardiac', 'pacemaker', 'angio', 'echo', 'ecg'],
    negative: ['eye', 'dental', 'maternity', 'child', 'pediatric', 'skin', 'ent', 'ortho', 'fertility', 'ayurved', 'homeo'],
  },
  'vascular specialist': {
    aliases:  ['vascular surgery', 'vein specialist', 'vascular medicine', 'vascular surgeon'],
    positive: ['vascular', 'vein', 'varicose', 'artery'],
    negative: ['eye', 'dental', 'maternity', 'child', 'pediatric', 'skin', 'ent'],
  },
  neurologist: {
    aliases:  ['neurology', 'brain specialist', 'nerve specialist'],
    positive: ['neuro', 'brain', 'nerve', 'epilepsy', 'stroke', 'parkinson', 'headache clinic'],
    negative: ['eye', 'dental', 'maternity', 'child', 'pediatric', 'skin', 'ent', 'ortho', 'fertility', 'ayurved', 'homeo'],
  },
  orthopedic: {
    aliases:  ['orthopedics', 'bone specialist', 'orthopaedic', 'orthopaedics', 'bone doctor', 'orthopedic specialist', 'orthopaedic specialist'],
    positive: ['ortho', 'bone', 'joint', 'spine', 'fracture', 'trauma', 'sports medicine'],
    negative: ['eye', 'dental', 'maternity', 'child', 'skin', 'ent', 'cardio', 'neuro'],
  },
  rheumatologist: {
    aliases:  ['rheumatology', 'arthritis specialist'],
    positive: ['rheumatolog', 'autoimmune', 'arthritis', 'lupus', 'connective tissue'],
    negative: ['eye', 'dental', 'maternity', 'child', 'pediatric', 'ortho', 'cardio', 'neuro'],
  },
  endocrinologist: {
    aliases:  ['endocrinology', 'hormone specialist'],
    positive: ['endocrinolog', 'thyroid', 'hormone', 'diabetes', 'metabolic', 'gland', 'diabetolog'],
    negative: ['eye', 'dental', 'maternity', 'child', 'pediatric', 'skin', 'ent', 'ortho'],
  },
  urologist: {
    aliases:  ['urology', 'urinary specialist', 'prostate specialist'],
    positive: ['urolog', 'prostate', 'bladder', 'kidney stone', 'renal stone', 'nephro urology'],
    negative: ['eye', 'dental', 'maternity', 'skin', 'ent', 'cardio', 'neuro', 'ortho'],
  },
  nephrologist: {
    aliases:  ['nephrology', 'kidney specialist', 'renal specialist'],
    positive: ['nephrol', 'kidney', 'renal', 'dialysis', 'transplant'],
    negative: ['eye', 'dental', 'maternity', 'child', 'pediatric', 'skin', 'ent', 'cardio'],
  },
  dermatologist: {
    aliases:  ['dermatology', 'skin specialist', 'skin doctor'],
    positive: ['skin', 'derma', 'cosmetic', 'hair', 'nail', 'laser'],
    negative: ['eye', 'dental', 'maternity', 'child', 'ortho', 'cardio', 'neuro'],
  },
  psychiatrist: {
    aliases:  ['psychiatry', 'mental health', 'mental health specialist', 'psychological medicine'],
    positive: ['psychiatry', 'mental', 'mind', 'psych', 'behavioural', 'addiction', 'rehab'],
    negative: ['veterinary', 'animal'],
  },
  hematologist: {
    aliases:  ['hematology', 'haematology', 'blood specialist', 'blood disorder specialist', 'haematologist'],
    positive: ['hematolog', 'haematolog', 'blood disorder', 'anemia', 'anaemia', 'thalassemia', 'leukemia'],
    negative: ['eye', 'dental', 'maternity', 'ortho', 'ent'],
  },
  'ent specialist': {
    aliases:  ['otolaryngology', 'ear nose throat', 'ent doctor', 'ent surgeon'],
    positive: ['ent', 'ear', 'nose', 'throat', 'sinus', 'laryngo', 'audiolog'],
    negative: ['eye', 'dental', 'maternity', 'ortho', 'cardio'],
  },
  ophthalmologist: {
    aliases:  ['ophthalmology', 'eye specialist', 'eye doctor'],
    positive: ['eye', 'eyes', 'vision', 'optic', 'aravind', 'sankara', 'retina', 'glaucoma', 'cataract', 'cornea', 'ocular', 'sight', 'netralaya', 'nethralaya', 'netra', 'nayan', 'drishti'],
    negative: ['dental', 'maternity', 'ortho', 'cardio', 'ent'],
  },
  gynecologist: {
    aliases:  ['gynecology', 'gynaecology', 'obstetrics', 'obgyn', "women's health", 'maternity specialist', 'gynaecologist'],
    positive: ['gynec', 'gynaec', 'maternity', 'women', 'obstetric', 'fertility', 'prenatal', 'antenatal'],
    negative: ['child', 'pediatric', 'veterinary'],
  },
  pediatrician: {
    aliases:  ['pediatrics', 'paediatrics', 'child specialist', "children's hospital", 'child doctor', 'paediatrician'],
    positive: ['child', 'pediatric', 'paediatric', 'kids', 'neonat', 'infant'],
    negative: ['adult', 'geriatric', 'veterinary'],
  },
  allergist: {
    aliases:  ['allergy specialist', 'immunology', 'allergy and immunology', 'allergist immunologist'],
    positive: ['allerg', 'immunolog', 'rhinitis', 'sensitisation', 'patch test'],
    negative: ['eye', 'dental', 'maternity', 'ortho', 'cardio'],
  },
  'emergency medicine': {
    aliases:  ['emergency physician', 'casualty', 'trauma center', 'trauma centre', 'er', 'accident and emergency', 'emergency room'],
    positive: ['emergency', 'casualty', 'trauma', 'accident', '24 hour', '24x7', 'ambulance'],
    // Was []. Every other specialty in this table carries negatives; emergency
    // medicine carried none, so a single-speciality facility that cannot treat
    // an emergency at all — an eye hospital, a dental clinic, a maternity home
    // — stayed in the fallback list and, being nearer, was returned as the
    // best match for someone with chest pain. Nearest is the wrong answer when
    // the nearest place does not do emergencies.
    // 'netralaya' is included because 'eye' misses the way many Indian eye
    // hospitals are actually named (Sankara Nethralaya, Dr Agarwal's
    // Netralaya). 'netra', 'nayan' and 'drishti' are left OUT deliberately —
    // they also occur as ordinary given names in general hospital names, and
    // a false disqualification in an emergency search is worse than a false
    // inclusion.
    negative: [
      'eye', 'optical', 'ophthalm', 'vision', 'netralaya', 'nethralaya',
      'dental', 'maternity', 'fertility', 'veterinary', 'animal',
      'skin', 'derma', 'cosmetic',
    ],
  },
  dentist: {
    aliases:  ['dental clinic', 'dental surgeon', 'oral health', 'dental care'],
    positive: ['dental', 'dentist', 'tooth', 'smile', 'oral', 'maxillo'],
    negative: ['eye', 'maternity', 'ortho', 'cardio', 'ent'],
  },
  oncologist: {
    aliases:  ['oncology', 'cancer specialist', 'cancer center', 'cancer centre'],
    positive: ['oncol', 'cancer', 'tumor', 'tumour', 'chemotherapy', 'radiation'],
    negative: ['eye', 'dental', 'veterinary'],
  },
  'general surgeon': {
    aliases:  ['general surgery', 'surgeon'],
    positive: ['surgery', 'surgical', 'surgeon'],
    negative: ['eye', 'dental', 'veterinary'],
  },
  neurosurgeon: {
    aliases:  ['neurosurgery', 'brain surgeon', 'spine surgeon'],
    positive: ['neurosurg', 'brain surgery', 'spine surgery'],
    negative: ['eye', 'dental', 'maternity', 'child', 'skin', 'ent'],
  },
  physiotherapist: {
    aliases:  ['physiotherapy', 'physical therapy', 'rehab specialist', 'physical therapist'],
    positive: ['physio', 'physiotherapy', 'rehabilitation', 'rehab'],
    negative: ['eye', 'dental', 'veterinary'],
  },
  diabetologist: {
    aliases:  ['diabetes clinic', 'diabetes specialist', 'sugar specialist', 'diabetes center', 'diabetes centre'],
    positive: ['diabet', 'sugar clinic', 'blood sugar'],
    negative: ['eye', 'dental', 'maternity', 'ortho', 'ent'],
  },
  radiologist: {
    aliases:  ['radiology', 'imaging center', 'imaging centre', 'diagnostic imaging', 'diagnostic center', 'diagnostic centre'],
    positive: ['radiolog', 'imaging', 'scan', 'x-ray', 'mri', 'ct scan', 'ultrasound', 'diagnostic'],
    negative: ['veterinary'],
  },
  anesthesiologist: {
    aliases:  ['anesthesia', 'anaesthesiologist', 'anaesthesia', 'anesthetist', 'anaesthetist'],
    positive: ['anesthesi', 'anaesthesi'],
    negative: ['eye', 'dental', 'veterinary'],
  },
  'sports medicine specialist': {
    aliases:  ['sports medicine', 'sports injury clinic', 'sports injury specialist'],
    positive: ['sports medicine', 'sports injury', 'sports clinic'],
    negative: ['eye', 'dental', 'maternity', 'child'],
  },
  geriatrician: {
    aliases:  ['geriatrics', 'elderly care specialist', 'old age specialist', 'geriatric medicine'],
    positive: ['geriatric', 'elderly care', 'senior citizen'],
    negative: ['child', 'pediatric', 'veterinary'],
  },
  andrologist: {
    aliases:  ['andrology', 'male fertility specialist'],
    positive: ['androlog', 'male fertility', "men's health"],
    negative: ['eye', 'dental', 'maternity', 'child'],
  },
  dietitian: {
    aliases:  ['nutritionist', 'dietician', 'nutrition clinic', 'dietary specialist'],
    positive: ['diet', 'nutrition', 'nutritionist', 'dietician'],
    negative: ['eye', 'dental', 'veterinary'],
  },
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
  const negativeKeywords = def ? def.negative : []

  // HARD DISQUALIFY — wrong specialty. Uses startsWord(), not includesWord():
  // these lists are word-stems/prefixes ('cardio' should match "Cardiology"),
  // which startsWord() allows while still blocking the mid-word collisions
  // unanchored .includes() would cause (see startsWord()'s doc comment).
  const hasNegative = negativeKeywords.some((k) => startsWord(nameLower, k))
  const hasPositive = positiveKeywords.some((k) => startsWord(nameLower, k))
  if (hasNegative && !hasPositive) {
    return { totalScore: 0, distanceKm, disqualified: true, reason: 'wrong-specialty' }
  }

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
    lastResort = candidates.length > 0
  }

  if (candidates.length === 0) {
    return { bestMatch: null, note: null, facilities: null }
  }

  // Score-based, not distance-only: a well-documented hospital slightly
  // farther away should outrank a bare unnamed node that's marginally
  // closer — totalScore already factors in distance (40%) alongside type
  // and completeness, so this is strictly more informed than distance alone.
  candidates.sort((a, b) => b.totalScore - a.totalScore)
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

export { haversine, findBestMatch, normalizeSpecialty, SPECIALTY_KEYWORDS }

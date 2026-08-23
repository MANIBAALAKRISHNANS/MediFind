// Symptom-COMBINATION alerts rather than individual diseases. Each entry
// requires two specific co-occurring symptoms — the combination itself is
// the red flag, regardless of which underlying condition ultimately
// explains it. All resolve to urgency: "emergency" at every severity level,
// so whichever disease wins top rank for a matching input, the localDiagnose()
// red-flag check (matching red_flags phrases against the input text) still
// forces the response to "SEEK EMERGENCY CARE IMMEDIATELY."
export const red_flags = [
  {
    id: 'redflag_chest_pain_breathlessness',
    name: 'Chest Pain with Shortness of Breath',
    category: 'Emergency Red Flag',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'chest pain', weight: 1.0, description: 'Any chest pain combined with breathlessness' },
        { name: 'shortness of breath', weight: 1.0, description: 'Occurring together with chest pain' },
      ],
      secondary: [
        { name: 'excessive sweating', weight: 0.5, description: '—' },
        { name: 'dizziness', weight: 0.4, description: '—' },
      ],
      differentiating: [],
    },
    duration_patterns: { acute: 'any duration', typical: 'this combination is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This combination has no mild presentation — always call emergency services', urgency: 'emergency' },
      moderate: { description: 'Chest pain with breathlessness', urgency: 'emergency' },
      severe: { description: 'Severe chest pain with severe breathlessness', urgency: 'emergency' },
    },
    risk_factors: ['smoking', 'diabetes', 'hypertension', 'high cholesterol', 'family history of heart disease'],
    // Bare "chest pain" / "shortness of breath" dropped — both alone are far
    // too common for benign causes (muscle strain, anxiety, mild asthma).
    // Requires the combination or a specific concerning quality.
    red_flags: [
      'chest pain and shortness of breath',
      'chest pain with breathlessness',
      'crushing chest pain',
      'chest pain radiating to arm',
      'chest pain radiating to my arm',
      'chest pain radiating to jaw',
      'chest pain radiating to my jaw',
      'chest pain with sweating',
    ],
    specialist: 'Emergency Medicine',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['heart_attack', 'vascular_pulmonary_embolism', 'heart_angina'],
    recommendations: [
      'Call emergency services (108/112) IMMEDIATELY',
      'Do not drive yourself — wait for an ambulance or have someone else drive',
      'Chew an aspirin if available and you are not allergic, while awaiting help',
      'Stay as calm and still as possible',
      'This combination of symptoms can indicate a heart attack or pulmonary embolism — treat it as a life-threatening emergency',
    ],
  },

  {
    id: 'redflag_sudden_severe_headache',
    name: 'Sudden Severe Headache (Thunderclap)',
    category: 'Emergency Red Flag',
    aliases: [],
    symptoms: {
      // See headache_thunderclap (neurological/headache.js) for the same
      // fix + rationale — this is a near-duplicate entry with the same
      // single-primary-symptom structural bug (the engine requires >=2
      // matched primary symptoms to qualify normally, which one symptom can
      // never satisfy) and the same malformed-prose red_flags issue.
      primary: [
        { name: 'sudden severe headache', weight: 1.0, description: 'Worst headache of life, reaches peak intensity within seconds to a minute' },
        { name: 'worst headache of my life', weight: 1.0, description: 'The classic way patients describe a thunderclap headache' },
        { name: 'headache worst of my life', weight: 1.0, description: 'Same phrase, reversed word order' },
        { name: 'thunderclap headache', weight: 1.0, description: 'The clinical term itself' },
        { name: 'headache like being hit', weight: 0.9, description: 'Instant, explosive onset' },
        { name: 'headache came on suddenly', weight: 0.9, description: 'Instant peak intensity, not a gradual build-up' },
      ],
      secondary: [
        { name: 'neck stiffness', weight: 0.5, description: '—' },
        { name: 'vomiting', weight: 0.4, description: '—' },
        { name: 'confusion', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'worst headache ever', weight: 0.9, description: '—' },
      ],
    },
    duration_patterns: { acute: 'sudden onset', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This combination has no mild presentation — always call emergency services', urgency: 'emergency' },
      moderate: { description: 'Sudden severe headache alone', urgency: 'emergency' },
      severe: { description: 'Sudden severe headache with neck stiffness or confusion', urgency: 'emergency' },
    },
    risk_factors: ['hypertension', 'family history of brain aneurysm'],
    red_flags: [
      'sudden severe headache',
      'worst headache of my life',
      'headache worst of my life',
      'thunderclap headache',
      'headache like being hit',
      'headache came on suddenly',
      'worst headache ever',
    ],
    specialist: 'Emergency Medicine',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['headache_thunderclap', 'bacterial_meningitis'],
    recommendations: [
      'Call emergency services (108/112) immediately',
      'Do not wait to see if it improves — this can indicate bleeding in the brain',
      'Avoid any exertion while awaiting emergency care',
      'Note the exact time of onset to tell emergency responders',
      'This requires urgent brain imaging — go to the nearest hospital with CT capability',
    ],
  },

  {
    id: 'redflag_one_sided_weakness_speech',
    name: 'One-Sided Weakness with Speech Slur',
    category: 'Emergency Red Flag',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'one-sided weakness', weight: 1.0, description: 'Sudden, face/arm/leg' },
        { name: 'speech difficulty', weight: 1.0, description: 'Slurred or unable to speak' },
      ],
      secondary: [
        { name: 'facial droop', weight: 0.6, description: '—' },
        { name: 'confusion', weight: 0.4, description: '—' },
      ],
      differentiating: [],
    },
    duration_patterns: { acute: 'sudden onset', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This combination has no mild presentation — always call emergency services', urgency: 'emergency' },
      moderate: { description: 'One-sided weakness with speech difficulty', urgency: 'emergency' },
      severe: { description: 'Complete weakness with total speech loss', urgency: 'emergency' },
    },
    risk_factors: ['hypertension', 'diabetes', 'smoking', 'atrial fibrillation', 'age over 55'],
    // "one-sided weakness" / "speech difficulty" are kept bare — unlike
    // "chest pain", these are inherently concerning phrases people don't use
    // casually, so standalone triggering here is appropriate.
    red_flags: ['one-sided weakness', 'speech difficulty', 'face drooping on one side', 'slurred speech'],
    specialist: 'Emergency Medicine',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['central_stroke_warning', 'central_tia'],
    recommendations: [
      'Call emergency services (108/112) IMMEDIATELY',
      'Use FAST: Face drooping, Arm weakness, Speech difficulty — Time to call emergency services',
      'Note the exact time symptoms started — clot-busting treatment is time-critical',
      'Do NOT give food, water, or medication',
      'Every minute of delay causes permanent brain damage — call 108 now',
    ],
  },

  {
    id: 'redflag_severe_allergic_reaction',
    name: 'Severe Allergic Reaction (Anaphylaxis Combination)',
    category: 'Emergency Red Flag',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'breathing difficulty', weight: 1.0, description: 'Sudden, after exposure to a known or suspected allergen' },
        { name: 'facial swelling', weight: 0.9, description: 'Lips, tongue, or throat' },
      ],
      secondary: [
        { name: 'hives', weight: 0.5, description: '—' },
        { name: 'dizziness', weight: 0.5, description: '—' },
      ],
      differentiating: [],
    },
    duration_patterns: { acute: 'minutes', typical: 'this is always a life-threatening emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This combination has no mild presentation — always call emergency services', urgency: 'emergency' },
      moderate: { description: 'Breathing difficulty with facial swelling', urgency: 'emergency' },
      severe: { description: 'Severe breathing difficulty with collapse', urgency: 'emergency' },
    },
    risk_factors: ['known severe allergy', 'previous anaphylactic reaction', 'insect sting or new food/medication exposure'],
    // (Bonus fix — not in the original ~24, but the same prose-tail bug in
    // the same file.) "breathing difficulty" / "facial swelling" are kept
    // bare, same reasoning as one-sided weakness above.
    red_flags: ['breathing difficulty', 'facial swelling', 'throat swelling'],
    specialist: 'Emergency Medicine',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['allergy_anaphylaxis', 'allergy_angioedema'],
    recommendations: [
      'Use an epinephrine auto-injector immediately if available',
      'Call emergency services (108/112) immediately, even if symptoms improve after epinephrine',
      'Lay the person flat with legs raised unless breathing is difficult, then sit them up',
      'Do not wait to see if symptoms resolve on their own',
      'A second wave of symptoms can occur hours later — emergency monitoring is essential',
    ],
  },

  {
    id: 'redflag_high_fever_stiff_neck',
    name: 'High Fever with Stiff Neck',
    category: 'Emergency Red Flag',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'high fever', weight: 1.0, description: 'Sudden, significant' },
        { name: 'neck stiffness', weight: 1.0, description: 'Unable to touch chin to chest' },
      ],
      secondary: [
        { name: 'severe headache', weight: 0.6, description: '—' },
        { name: 'photophobia', weight: 0.4, description: '—' },
      ],
      differentiating: [],
    },
    duration_patterns: { acute: 'sudden onset', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This combination has no mild presentation — always call emergency services', urgency: 'emergency' },
      moderate: { description: 'High fever with neck stiffness', urgency: 'emergency' },
      severe: { description: 'Fever, neck stiffness, with confusion or rash', urgency: 'emergency' },
    },
    risk_factors: ['unvaccinated', 'crowded living conditions', 'recent ear or sinus infection', 'immunocompromised'],
    // Bare "high fever" / "stiff neck" dropped — both alone are common
    // (many benign infections cause fever; sleeping wrong causes neck
    // stiffness). Requires the combination.
    red_flags: [
      'high fever with stiff neck',
      'fever with neck stiffness and headache',
      'stiff neck with fever',
    ],
    specialist: 'Emergency Medicine',
    india_prevalence: 'moderate',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_meningitis', 'central_meningitis_viral'],
    recommendations: [
      'Call emergency services (108/112) IMMEDIATELY',
      'Do not wait to see if it improves — bacterial meningitis can be fatal within 24 hours',
      'Do NOT give food or water until assessed by a doctor',
      'Watch for a non-blanching (does not fade under pressure) rash — this is an additional emergency sign',
      'IV antibiotics must be started within 1 hour of suspicion in hospital',
    ],
  },

  {
    id: 'redflag_sudden_testicular_pain',
    name: 'Sudden Severe Testicular Pain',
    category: 'Emergency Red Flag',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'sudden testicular pain', weight: 1.0, description: 'Severe, one-sided, abrupt onset' },
        { name: 'sudden testicle pain', weight: 1.0, description: 'Colloquial phrasing' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.5, description: '—' },
        { name: 'testicular swelling', weight: 0.6, description: '—' },
      ],
      differentiating: [],
    },
    duration_patterns: { acute: 'sudden onset, minutes', typical: 'this is always a surgical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This combination has no mild presentation — any sudden testicular pain is an emergency', urgency: 'emergency' },
      moderate: { description: 'Sudden testicular pain with swelling', urgency: 'emergency' },
      severe: { description: 'Severe pain with nausea/vomiting', urgency: 'emergency' },
    },
    risk_factors: ['adolescent and young males', 'undescended testicle history', 'previous episode'],
    // (Bonus fix.) Bare "sudden testicular/testicle pain" kept — same
    // reasoning as testicular_torsion_warning above.
    red_flags: ['sudden testicular pain', 'sudden testicle pain', 'sudden severe testicular pain', 'sudden severe testicle pain'],
    specialist: 'Emergency Medicine',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'male',
    similar_diseases: ['testicular_torsion_warning'],
    recommendations: [
      'Go to the emergency room IMMEDIATELY — this is a surgical emergency',
      'Surgery within 6 hours of onset gives the best chance of saving the testicle',
      'Do not wait to see if the pain improves',
      'This is one of the few true urological emergencies',
      'Call 108/112 or go directly to the nearest emergency room',
    ],
  },

  {
    id: 'redflag_sudden_vision_loss',
    name: 'Sudden Vision Loss',
    category: 'Emergency Red Flag',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'sudden vision loss', weight: 1.0, description: 'Partial or complete, in one or both eyes' },
        { name: 'vision went black suddenly', weight: 0.9, description: 'Colloquial phrasing' },
        { name: 'lost vision suddenly', weight: 0.9, description: '—' },
      ],
      secondary: [
        { name: 'floaters', weight: 0.5, description: '—' },
        { name: 'flashes of light', weight: 0.5, description: '—' },
        { name: 'eye pain', weight: 0.4, description: '—' },
      ],
      differentiating: [],
    },
    duration_patterns: { acute: 'sudden onset', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This combination has no mild presentation — always seek same-day ophthalmology care', urgency: 'emergency' },
      moderate: { description: 'Sudden partial vision loss', urgency: 'emergency' },
      severe: { description: 'Sudden complete vision loss', urgency: 'emergency' },
    },
    risk_factors: ['high myopia', 'diabetes', 'hypertension', 'previous eye surgery', 'eye trauma'],
    // Every phrase requires the "sudden" framing — gradual vision changes
    // (cataracts, refractive changes) are common and not an emergency.
    red_flags: ['sudden vision loss', 'vision went black suddenly', 'suddenly went blind', 'lost sight suddenly'],
    specialist: 'Emergency Medicine',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['eye_retinal_detachment_warning', 'eye_glaucoma_warning', 'central_stroke_warning'],
    recommendations: [
      'Go to the nearest emergency room or ophthalmologist immediately',
      'Sudden vision loss can indicate retinal detachment, stroke, or acute glaucoma — all require immediate care',
      'Do not delay — some causes can lead to permanent vision loss within hours',
      'Avoid strenuous activity or heavy lifting while awaiting evaluation',
      'Note exactly when the vision loss started and whether it affects one or both eyes',
    ],
  },

  {
    id: 'redflag_severe_abdominal_pain_rigidity',
    name: 'Severe Abdominal Pain with Rigidity',
    category: 'Emergency Red Flag',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'severe abdominal pain', weight: 1.0, description: 'Sudden or rapidly worsening' },
        { name: 'rigid abdomen', weight: 0.9, description: 'Board-like, tender to any touch' },
      ],
      secondary: [
        { name: 'fever', weight: 0.5, description: '—' },
        { name: 'vomiting', weight: 0.5, description: '—' },
      ],
      differentiating: [],
    },
    duration_patterns: { acute: 'sudden or rapidly worsening', typical: 'this is always a surgical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This combination has no mild presentation — always call emergency services', urgency: 'emergency' },
      moderate: { description: 'Severe abdominal pain with guarding', urgency: 'emergency' },
      severe: { description: 'Rigid abdomen with fever and vomiting (possible perforation/peritonitis)', urgency: 'emergency' },
    },
    risk_factors: ['recent abdominal surgery', 'known ulcer disease', 'known diverticular disease', 'recent trauma'],
    // Bare "severe abdominal pain" dropped — commonly self-described as
    // "severe" for many benign causes (cramps, gas, gastritis). "Rigid" /
    // "board-like" are specific clinical descriptions unlikely to be used
    // casually, so kept standalone.
    red_flags: ['rigid abdomen', 'board-like abdomen', 'severe abdominal pain with rigidity', 'abdomen hard as a board'],
    specialist: 'Emergency Medicine',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['gi_appendicitis', 'pancreas_acute_pancreatitis', 'gi_peptic_ulcer'],
    recommendations: [
      'Go to the emergency room IMMEDIATELY — this is a surgical emergency',
      'Do not eat or drink anything — surgery may be needed urgently',
      'Do not take painkillers before being seen — they can mask worsening symptoms',
      'A rigid, board-like abdomen suggests possible perforation of an organ requiring immediate surgery',
      'This is a true surgical emergency — go to hospital now without delay',
    ],
  },
]

export default red_flags

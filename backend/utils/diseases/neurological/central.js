// Bacterial meningitis is defined in infectious/bacterial.js — this file
// covers viral meningitis and other central nervous system conditions.
export const central = [
  {
    id: 'central_stroke_warning',
    name: 'Stroke — Warning Signs',
    category: 'Neurological - Central',
    aliases: ['cva', 'brain attack'],
    symptoms: {
      primary: [
        { name: 'one-sided weakness', weight: 1.0, description: 'Sudden, face/arm/leg' },
        { name: 'speech difficulty', weight: 0.9, description: 'Slurred or unable to speak' },
      ],
      secondary: [
        { name: 'facial droop', weight: 0.8, description: '—' },
        { name: 'confusion', weight: 0.5, description: '—' },
        { name: 'vision problems', weight: 0.4, description: 'Sudden' },
      ],
      differentiating: [
        { name: 'sudden onset', weight: 0.8, description: 'Symptoms appear abruptly, within seconds to minutes' },
      ],
    },
    duration_patterns: { acute: 'sudden onset', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — any suspicion requires an emergency response', urgency: 'emergency' },
      moderate: { description: 'One-sided weakness or speech difficulty', urgency: 'emergency' },
      severe: { description: 'Loss of consciousness, severe weakness, or complete speech loss', urgency: 'emergency' },
    },
    risk_factors: ['hypertension', 'diabetes', 'smoking', 'atrial fibrillation', 'high cholesterol', 'age over 55'],
    red_flags: [
      'sudden one-sided weakness',
      'face drooping on one side',
      'slurred speech',
      'sudden difficulty speaking',
    ],
    specialist: 'Neurologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['central_tia', 'neurological_bells_palsy', 'headache_migraine'],
    recommendations: [
      'Call emergency services (108/112) IMMEDIATELY — this is a medical emergency',
      'Use FAST: Face drooping, Arm weakness, Speech difficulty — Time to call emergency services',
      'Do NOT give food, water, or medication — the person may not be able to swallow safely',
      'Note the exact time symptoms started — clot-busting treatment is time-critical',
      'Call 108 now — every minute of delay causes permanent brain damage',
    ],
  },

  {
    id: 'central_tia',
    name: 'Transient Ischemic Attack (TIA / Mini-Stroke)',
    category: 'Neurological - Central',
    aliases: ['tia', 'mini stroke'],
    symptoms: {
      primary: [
        { name: 'one-sided weakness', weight: 0.9, description: 'Temporary, resolves within 24 hours' },
        { name: 'speech difficulty', weight: 0.7, description: 'Temporary' },
      ],
      secondary: [
        { name: 'vision problems', weight: 0.4, description: 'Temporary' },
        { name: 'dizziness', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'symptoms resolve completely', weight: 0.7, description: 'Full resolution within minutes to hours distinguishes from full stroke' },
      ],
    },
    duration_patterns: { acute: '< 24 hours, usually minutes', typical: 'resolves completely but warrants urgent workup', chronic: null },
    severity_levels: {
      mild: { description: 'This condition still requires emergency evaluation even after symptoms resolve', urgency: 'emergency' },
      moderate: { description: 'Resolved weakness or speech difficulty', urgency: 'emergency' },
      severe: { description: 'Recurrent episodes or symptoms not fully resolving', urgency: 'emergency' },
    },
    risk_factors: ['hypertension', 'diabetes', 'atrial fibrillation', 'smoking', 'high cholesterol'],
    red_flags: [
      'weakness that went away',
      'temporary one-sided weakness',
      'brief speech difficulty',
      'speech difficulty that resolved',
    ],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['central_stroke_warning', 'headache_migraine'],
    recommendations: [
      'Go to the emergency room immediately even if symptoms have completely resolved',
      'A TIA is a strong warning sign of an impending major stroke — urgent workup is essential',
      'Do not drive yourself — call an ambulance or have someone take you',
      'Blood pressure, cholesterol, and blood sugar control are critical for prevention',
      'Follow up urgently with a neurologist for imaging and preventive treatment',
    ],
  },

  {
    id: 'central_meningitis_viral',
    name: 'Viral Meningitis',
    category: 'Neurological - Central',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.7, description: '—' },
        { name: 'neck stiffness', weight: 0.7, description: '—' },
        { name: 'headache', weight: 0.7, description: 'Severe' },
      ],
      secondary: [
        { name: 'photophobia', weight: 0.4, description: '—' },
        { name: 'nausea', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'less severe than bacterial', weight: 0.3, description: 'Generally milder course than bacterial meningitis, but still requires evaluation' },
      ],
    },
    duration_patterns: { acute: '< 10 days', typical: '7-10 days', chronic: null },
    severity_levels: {
      mild: { description: 'Fever with mild headache and neck discomfort — still needs urgent evaluation to exclude bacterial cause', urgency: 'emergency' },
      moderate: { description: 'Fever, headache, and neck stiffness', urgency: 'emergency' },
      severe: { description: 'Confusion, seizures, or non-blanching rash', urgency: 'emergency' },
    },
    risk_factors: ['recent viral illness', 'crowded living conditions', 'weakened immunity'],
    // Bare "fever" or "headache" alone are dropped — both are extremely
    // common for benign causes. Requires the combination, or a genuinely
    // rare/specific sign (non-blanching rash, seizure).
    red_flags: [
      'fever with stiff neck',
      'fever and neck stiffness and headache',
      'stiff neck with headache and fever',
      'confusion or seizures',
      'non-blanching rash',
    ],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_meningitis', 'headache_migraine'],
    recommendations: [
      'Go to the hospital immediately for fever with stiff neck and headache — cannot be distinguished from bacterial meningitis without testing',
      'A lumbar puncture is needed to distinguish viral from bacterial cause',
      'Supportive care (fluids, pain relief) is the mainstay for confirmed viral meningitis',
      'Most cases resolve within 1-2 weeks with supportive care',
      'Do not wait to see if it improves — call 108 immediately',
    ],
  },

  {
    id: 'central_encephalitis',
    name: 'Encephalitis',
    category: 'Neurological - Central',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.8, description: '—' },
        { name: 'confusion', weight: 0.85, description: 'Altered mental status' },
      ],
      secondary: [
        { name: 'headache', weight: 0.5, description: '—' },
        { name: 'seizure', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'altered consciousness', weight: 0.7, description: 'Distinguishes from simple meningitis — brain tissue itself is inflamed' },
      ],
    },
    duration_patterns: { acute: '< 7 days onset', typical: 'rapid progression over days', chronic: 'neurological deficits can be permanent' },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always treat as an emergency', urgency: 'emergency' },
      moderate: { description: 'Fever with confusion', urgency: 'emergency' },
      severe: { description: 'Seizures, coma, or focal neurological deficits', urgency: 'emergency' },
    },
    risk_factors: ['mosquito exposure', 'recent viral illness', 'immunocompromised', 'unvaccinated (JE)'],
    red_flags: ['confusion or altered consciousness', 'seizures', 'focal weakness'],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['tropical_japanese_encephalitis', 'bacterial_meningitis'],
    recommendations: [
      'Go to the hospital immediately — this is a medical emergency',
      'Brain imaging and lumbar puncture are needed for diagnosis',
      'Hospital admission for supportive care and monitoring is essential',
      'Antiviral treatment may help if a treatable viral cause (like HSV) is identified',
      'Rehabilitation may be needed for any lasting neurological effects',
    ],
  },

  {
    id: 'central_epilepsy',
    name: 'Epilepsy / Seizures',
    category: 'Neurological - Central',
    aliases: ['seizure disorder'],
    symptoms: {
      primary: [
        { name: 'seizure', weight: 0.9, description: 'Convulsions or staring spells' },
      ],
      secondary: [
        { name: 'confusion', weight: 0.4, description: 'Post-seizure (post-ictal)' },
        { name: 'weakness', weight: 0.3, description: 'Temporary, after seizure' },
      ],
      differentiating: [
        { name: 'loss of consciousness', weight: 0.6, description: 'During tonic-clonic seizures' },
        { name: 'tongue biting', weight: 0.5, description: 'Common during convulsive seizures' },
      ],
    },
    duration_patterns: { acute: '< 5 minutes typical seizure', typical: 'recurrent episodes', chronic: 'condition itself may be lifelong' },
    severity_levels: {
      mild: { description: 'Brief seizure with full recovery', urgency: 'see-doctor-today' },
      moderate: { description: 'Recurrent seizures despite medication', urgency: 'see-doctor-today' },
      severe: { description: 'Seizure lasting more than 5 minutes, or no recovery between seizures (status epilepticus)', urgency: 'emergency' },
    },
    risk_factors: ['head injury history', 'family history', 'brain infection history', 'sleep deprivation'],
    red_flags: ['seizure lasting more than 5 minutes', 'no recovery of consciousness between seizures', 'first-ever seizure in an adult', 'seizure during pregnancy'],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['central_febrile_seizure', 'hypoglycemia_warning'],
    recommendations: [
      'See a neurologist urgently for EEG and MRI brain evaluation',
      'Take prescribed anti-epileptic medication every day — never stop abruptly',
      'Avoid driving, swimming alone, or working at heights until seizure-free as advised by your doctor',
      'During a seizure: protect the person from injury, do not restrain, do not put anything in their mouth',
      'Call emergency services for a seizure lasting more than 5 minutes',
    ],
  },

  {
    id: 'central_multiple_sclerosis_awareness',
    name: 'Multiple Sclerosis (Awareness)',
    category: 'Neurological - Central',
    aliases: ['ms'],
    symptoms: {
      primary: [
        { name: 'numbness', weight: 0.5, description: 'In limbs or face' },
        { name: 'vision problems', weight: 0.5, description: 'Often one eye, blurred or double vision' },
      ],
      secondary: [
        { name: 'weakness', weight: 0.4, description: '—' },
        { name: 'balance problems', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'symptoms come and go', weight: 0.5, description: 'Relapsing-remitting pattern with distinct episodes' },
      ],
    },
    duration_patterns: { acute: 'relapse days to weeks', typical: 'chronic, relapsing-remitting course', chronic: '> 90 days between distinct episodes typical' },
    severity_levels: {
      mild: { description: 'Mild sensory symptoms resolving over weeks', urgency: 'see-doctor-soon' },
      moderate: { description: 'Vision loss or significant weakness', urgency: 'see-doctor-today' },
      severe: { description: 'Rapid progression of weakness or loss of bladder/bowel control', urgency: 'emergency' },
    },
    risk_factors: ['female gender', 'age 20-40', 'family history', 'certain geographic/ethnic patterns'],
    red_flags: ['rapid loss of vision', 'sudden loss of bladder or bowel control', 'rapidly progressing weakness'],
    specialist: 'Neurologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['neurological_peripheral_neuropathy', 'vitamin_b12_deficiency'],
    recommendations: [
      'See a neurologist for MRI brain/spine and further evaluation',
      'This is informational only — diagnosis requires specialist assessment over time',
      'Disease-modifying therapies can slow progression if diagnosed',
      'Manage fatigue with pacing and adequate rest',
      'Seek urgent care for rapid vision loss or loss of bladder/bowel control',
    ],
  },

  {
    id: 'central_parkinsons_early',
    name: "Parkinson's Disease — Early Signs",
    category: 'Neurological - Central',
    aliases: ['parkinsons'],
    symptoms: {
      primary: [
        { name: 'tremor at rest', weight: 0.8, description: 'Often starts in one hand' },
        { name: 'slow movement', weight: 0.7, description: 'Bradykinesia' },
      ],
      secondary: [
        { name: 'rigidity', weight: 0.5, description: 'Muscle stiffness' },
        { name: 'balance problems', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'tremor improves with movement', weight: 0.5, description: 'Resting tremor that decreases with intentional movement, unlike essential tremor' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over months to years', chronic: '> 90 days of progressive symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild tremor not affecting daily activities', urgency: 'see-doctor-soon' },
      moderate: { description: 'Tremor and slowness affecting daily tasks', urgency: 'see-doctor-soon' },
      severe: { description: 'Falls, difficulty swallowing, or hallucinations', urgency: 'see-doctor-today' },
    },
    risk_factors: ['age over 60', 'family history', 'male gender'],
    red_flags: ['sudden inability to swallow', 'falls with head injury', 'hallucinations or confusion', 'rapid deterioration over weeks'],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['neurological_essential_tremor'],
    recommendations: [
      'See a neurologist for clinical evaluation — no single test confirms the diagnosis',
      'Levodopa and other medications significantly improve quality of life',
      'Physiotherapy, speech therapy, and regular exercise help maintain function',
      'Take medications at consistent times, and around meals as advised',
      'Seek urgent care for falls, swallowing difficulty, or new confusion',
    ],
  },

  {
    id: 'neurological_bells_palsy',
    name: "Bell's Palsy",
    category: 'Neurological - Central',
    aliases: ['facial palsy'],
    symptoms: {
      primary: [
        { name: 'facial droop', weight: 0.9, description: 'Sudden, one-sided, including forehead' },
      ],
      secondary: [
        { name: 'difficulty closing eye', weight: 0.5, description: 'On affected side' },
        { name: 'ear pain', weight: 0.3, description: 'May precede facial weakness' },
      ],
      differentiating: [
        { name: 'forehead involvement', weight: 0.7, description: 'Whole face including forehead affected, unlike stroke which typically spares the forehead' },
        // These two describe the entry's OWN mild/moderate tier (Ramsay
        // Hunt needs same-day antivirals; unprotected eye risks corneal
        // damage) — both "see-doctor-today", not the severe/emergency tier
        // (stroke pattern), so they belong here, not in red_flags.
        { name: 'facial paralysis with ear pain and blisters', weight: 0.5, description: 'Suggests Ramsay Hunt syndrome — needs prompt antiviral treatment' },
        { name: 'eye becoming very red or painful', weight: 0.4, description: 'Risk of corneal damage from being unable to fully close the eye' },
      ],
    },
    duration_patterns: { acute: '< 72 hours onset', typical: 'recovers over 3-6 months', chronic: '> 180 days without improvement warrants re-evaluation' },
    severity_levels: {
      mild: { description: 'Partial facial weakness', urgency: 'see-doctor-today' },
      moderate: { description: 'Complete facial weakness on one side', urgency: 'see-doctor-today' },
      severe: { description: 'Facial weakness WITH arm/leg weakness or speech difficulty (this pattern is stroke, not Bell\'s palsy)', urgency: 'emergency' },
    },
    risk_factors: ['recent viral infection', 'pregnancy', 'diabetes'],
    // Only the stroke-pattern combination stays here — it's the one
    // scenario this entry's own severity ladder actually calls 'emergency'.
    red_flags: [
      'facial weakness with arm weakness',
      'facial weakness with leg weakness',
      'facial droop with arm or leg weakness',
    ],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['central_stroke_warning'],
    recommendations: [
      'See a doctor today — early steroid treatment within 72 hours dramatically improves recovery chances',
      'Protect the affected eye — use lubricating eye drops and an eye patch at night if unable to close it',
      'Facial exercises and physiotherapy can help maintain muscle tone',
      'Most cases (80%) recover fully within 3-6 months',
      'Call emergency services immediately if any arm or leg weakness accompanies the facial droop — this is stroke, not Bell\'s palsy',
    ],
  },

  {
    id: 'neurological_trigeminal_neuralgia',
    name: 'Trigeminal Neuralgia',
    category: 'Neurological - Central',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'facial pain', weight: 0.9, description: 'Sudden, severe, electric-shock-like' },
        { name: 'electric shock facial pain', weight: 0.9, description: 'The way most patients actually describe it' },
      ],
      secondary: [
        { name: 'pain triggered by touch', weight: 0.6, description: 'Chewing, talking, brushing teeth' },
      ],
      differentiating: [
        { name: 'brief electric shock pain', weight: 0.8, description: 'Episodes last seconds, triggered by light touch' },
      ],
    },
    duration_patterns: { acute: 'seconds per episode', typical: 'recurrent episodes over weeks to months', chronic: '> 90 days recurrent pattern typical' },
    severity_levels: {
      mild: { description: 'Occasional brief episodes', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent episodes affecting eating/speaking', urgency: 'see-doctor-soon' },
      severe: { description: 'Constant severe pain preventing normal function', urgency: 'see-doctor-today' },
    },
    risk_factors: ['age over 50', 'multiple sclerosis (in younger patients)', 'female gender'],
    // Deliberately requires the COMBINATION (pain + numbness/weakness), not
    // bare "facial numbness" alone — isolated facial numbness has many
    // trivial causes (e.g. sleeping on your arm) and firing on that alone
    // would be a false alarm unrelated to this condition's actual concern:
    // that numbness/weakness alongside the pain suggests something other
    // than benign TN (stroke-mimic, MS, tumor).
    red_flags: [
      'facial pain with numbness',
      'facial numbness and weakness',
      'facial weakness with pain',
    ],
    specialist: 'Neurologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'female',
    similar_diseases: ['dental_abscess', 'sinusitis'],
    recommendations: [
      'See a neurologist — this condition responds well to specific medications (not standard painkillers)',
      'Avoid known triggers when possible — cold wind, certain foods',
      'Prescribed anticonvulsant medications are the first-line treatment',
      'Surgical options are available for cases not responding to medication',
      'See a dentist first to exclude dental causes if pain is localized to jaw/teeth',
    ],
  },

  {
    id: 'neurological_vertigo_central',
    name: 'Central Vertigo',
    category: 'Neurological - Central',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'vertigo', weight: 0.8, description: 'Persistent spinning sensation' },
      ],
      secondary: [
        { name: 'unsteady gait', weight: 0.5, description: '—' },
        { name: 'double vision', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'not triggered by position', weight: 0.5, description: 'Unlike BPPV, symptoms are not clearly triggered by head movement' },
        { name: 'neurological symptoms', weight: 0.7, description: 'Weakness, speech difficulty, or double vision accompanying vertigo' },
      ],
    },
    duration_patterns: { acute: 'variable, hours to persistent', typical: 'depends on underlying cause', chronic: null },
    severity_levels: {
      mild: { description: 'This symptom combination warrants prompt neurological evaluation', urgency: 'see-doctor-today' },
      moderate: { description: 'Persistent vertigo with unsteady gait', urgency: 'see-doctor-today' },
      severe: { description: 'Vertigo with weakness, double vision, or difficulty walking (possible stroke)', urgency: 'emergency' },
    },
    risk_factors: ['hypertension', 'diabetes', 'age over 55', 'vascular risk factors'],
    red_flags: ['vertigo with weakness or speech difficulty', 'vertigo with severe headache', 'vertigo with double vision', 'inability to walk'],
    specialist: 'Neurologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['ent_bppv', 'ent_menieres'],
    recommendations: [
      'See a neurologist urgently — central vertigo can indicate a stroke affecting the brainstem/cerebellum',
      'Do not assume it is simple inner-ear vertigo if any other neurological symptoms are present',
      'Brain imaging is often needed to rule out serious causes',
      'Avoid driving until evaluated',
      'Call emergency services if vertigo is accompanied by weakness, double vision, or difficulty walking',
    ],
  },
]

export default central

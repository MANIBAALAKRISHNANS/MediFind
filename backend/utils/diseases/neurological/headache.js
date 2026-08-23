export const headache = [
  {
    id: 'headache_migraine',
    name: 'Migraine',
    category: 'Neurological - Headache',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'throbbing headache', weight: 0.85, description: 'One-sided, pulsating' },
        { name: 'nausea', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'photophobia', weight: 0.5, description: 'Light sensitivity' },
        { name: 'vomiting', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'visual disturbance', weight: 0.5, description: 'Aura — flashing lights or zigzag lines before headache' },
        { name: 'one-sided headache', weight: 0.6, description: '—' },
      ],
    },
    duration_patterns: { acute: '4-72 hours per episode', typical: 'episodic, recurrent', chronic: '> 15 days/month suggests chronic migraine' },
    severity_levels: {
      mild: { description: 'Mild throbbing headache, manageable', urgency: 'self-care' },
      moderate: { description: 'Significant headache with nausea affecting activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Worst headache of life, or headache with fever/stiff neck/weakness', urgency: 'emergency' },
    },
    risk_factors: ['family history', 'hormonal changes', 'stress', 'certain foods', 'irregular sleep'],
    // "worst headache of your life" fixed to first-person — a patient
    // describing their own symptom says "my life", not "your life" (that
    // second-person phrasing is how a doctor would ask, not how a patient
    // would answer), so as written it could never match real user input.
    red_flags: ['worst headache of my life', 'headache with fever and stiff neck', 'headache with one-sided weakness or vision loss', 'headache after head injury'],
    specialist: 'Neurologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['headache_tension', 'headache_cluster', 'heart_hypertension'],
    recommendations: [
      'Take prescribed triptan medication at the very first sign of a migraine if available',
      'Rest in a dark, quiet room',
      'Apply a cold compress to the forehead',
      'Identify and avoid personal triggers — certain foods, stress, irregular sleep',
      'Go to emergency care for a sudden extremely severe headache unlike any before, or with confusion, weakness, or fever',
    ],
  },

  {
    id: 'headache_tension',
    name: 'Tension Headache',
    category: 'Neurological - Headache',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'headache', weight: 0.7, description: 'Band-like, dull pressure' },
      ],
      secondary: [
        { name: 'neck stiffness', weight: 0.3, description: '—' },
        { name: 'shoulder pain', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'both sides headache', weight: 0.5, description: 'Bilateral distribution, unlike migraine' },
      ],
    },
    duration_patterns: { acute: '30 minutes - 7 days per episode', typical: 'episodic, may become frequent', chronic: '> 15 days/month suggests chronic tension headache' },
    severity_levels: {
      mild: { description: 'Mild pressure, doesn\'t interfere with activities', urgency: 'self-care' },
      moderate: { description: 'Noticeable pressure affecting concentration', urgency: 'self-care' },
      severe: { description: 'Severe, unusual, or accompanied by other neurological symptoms', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['stress', 'poor posture', 'eye strain', 'dehydration', 'screen time'],
    red_flags: ['sudden severe headache unlike any before', 'headache with fever and stiff neck', 'headache with weakness or vision changes'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['headache_migraine', 'respiratory_sinusitis'],
    recommendations: [
      'Take paracetamol for immediate relief',
      'Drink a full glass of water — dehydration is a common trigger',
      'Take breaks from screens every 20 minutes',
      'Gently massage temples, neck, and shoulders',
      'See a doctor if headaches occur more than 15 days per month',
    ],
  },

  {
    id: 'headache_cluster',
    name: 'Cluster Headache',
    category: 'Neurological - Headache',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'severe one-sided headache', weight: 0.9, description: 'Around/behind one eye, excruciating' },
      ],
      secondary: [
        { name: 'eye redness', weight: 0.5, description: 'On the affected side' },
        { name: 'nasal congestion', weight: 0.4, description: 'One-sided' },
        { name: 'restlessness', weight: 0.4, description: 'Unlike migraine, patients tend to pace' },
      ],
      differentiating: [
        { name: 'occurs in clusters', weight: 0.7, description: 'Multiple attacks per day for weeks, then remission periods' },
        { name: 'severe pain behind eyes', weight: 0.7, description: '—' },
      ],
    },
    duration_patterns: { acute: '15 minutes - 3 hours per attack', typical: 'clusters over 6-12 weeks', chronic: '> 365 days without remission for chronic cluster headache' },
    severity_levels: {
      mild: { description: 'This condition is inherently severe — even "mild" episodes are intensely painful', urgency: 'see-doctor-today' },
      moderate: { description: 'Multiple daily attacks during a cluster period', urgency: 'see-doctor-today' },
      severe: { description: 'New neurological symptoms accompanying attacks', urgency: 'emergency' },
    },
    risk_factors: ['male gender', 'smoking', 'alcohol use during cluster periods', 'family history'],
    red_flags: ['new weakness or vision loss with headache', 'confusion with headache'],
    specialist: 'Neurologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'male',
    similar_diseases: ['headache_migraine', 'headache_thunderclap'],
    recommendations: [
      'See a neurologist for diagnosis and preventive treatment during cluster periods',
      'High-flow oxygen therapy can abort an acute attack effectively',
      'Avoid alcohol during a cluster period — it is a common trigger',
      'Keep a headache diary to track patterns and triggers',
      'Prescribed preventive medications can reduce attack frequency during a cluster',
    ],
  },

  {
    id: 'headache_medication_overuse',
    name: 'Medication Overuse Headache',
    category: 'Neurological - Headache',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'headache', weight: 0.75, description: 'Present most days, dull, constant' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.3, description: '—' },
        { name: 'irritability', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'frequent painkiller use', weight: 0.7, description: 'Taking headache medication more than 10-15 days per month' },
      ],
    },
    duration_patterns: { acute: null, typical: 'daily or near-daily headache', chronic: '> 15 days/month is the diagnostic threshold' },
    severity_levels: {
      mild: { description: 'Mild daily headache with frequent medication use', urgency: 'see-doctor-soon' },
      moderate: { description: 'Moderate headache affecting daily function', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe headache not responding to any medication', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['frequent use of painkillers for headache', 'underlying migraine or tension headache', 'anxiety or depression'],
    red_flags: ['sudden change in headache pattern', 'new neurological symptoms'],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['headache_tension', 'headache_migraine'],
    recommendations: [
      'See a neurologist — gradual withdrawal of the overused medication is usually needed',
      'Do not use over-the-counter painkillers more than 2-3 days per week',
      'A preventive medication strategy may be needed for the underlying headache disorder',
      'Keep a headache and medication diary',
      'Expect headaches to temporarily worsen during withdrawal — this is normal and improves',
    ],
  },

  {
    id: 'headache_thunderclap',
    name: 'Thunderclap Headache — Warning Sign',
    category: 'Neurological - Headache',
    aliases: [],
    // NOTE ON PRIMARY LIST LENGTH: this condition is, by clinical definition,
    // diagnosed on a SINGLE feature — instantaneous onset to maximum
    // intensity — not a combination of symptoms. But the engine's qualifying
    // gate (localDiagnosis.js) requires >=2 matched PRIMARY symptoms for any
    // entry to surface normally, which a single-primary-symptom entry can
    // NEVER satisfy regardless of how well the user's wording matches. These
    // extra primary entries are the same core concept phrased the way real
    // (often panicked) users actually type it, so two of them can co-occur
    // in one sentence — plus localDiagnose() now also has a red-flag safety
    // net (see localDiagnosis.js) for the common case where a user mentions
    // only ONE of these phrasings and nothing else.
    symptoms: {
      primary: [
        { name: 'sudden severe headache', weight: 1.0, description: 'Reaches maximum intensity within seconds to a minute — "worst headache of my life"' },
        { name: 'worst headache of my life', weight: 1.0, description: 'The classic way patients describe a thunderclap headache' },
        { name: 'headache worst of my life', weight: 1.0, description: 'Same phrase, reversed word order — "headache, worst of my life"' },
        { name: 'thunderclap headache', weight: 1.0, description: 'The clinical term itself, when a user knows/uses it' },
        { name: 'headache like being hit', weight: 0.9, description: 'Instant, explosive onset — "like being hit on the head"' },
        { name: 'headache came on suddenly', weight: 0.9, description: 'Instant peak intensity, not a gradual build-up' },
      ],
      secondary: [
        { name: 'neck stiffness', weight: 0.5, description: '—' },
        { name: 'vomiting', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'sudden onset', weight: 0.9, description: 'Instantaneous peak intensity is the defining feature' },
        { name: 'worst headache ever', weight: 0.9, description: '—' },
      ],
    },
    duration_patterns: { acute: 'sudden onset', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always treat as an emergency', urgency: 'emergency' },
      moderate: { description: 'Sudden severe headache without other symptoms', urgency: 'emergency' },
      severe: { description: 'Sudden severe headache with vomiting, neck stiffness, or altered consciousness', urgency: 'emergency' },
    },
    risk_factors: ['hypertension', 'family history of aneurysm', 'sudden exertion or straining'],
    // Short, literally-matchable trigger phrases — NOT prose. containsPhrase()
    // requires the ENTIRE red_flags string to appear as a contiguous
    // substring in the user's text, so a descriptive sentence here (as this
    // used to be) can never actually fire. Deliberately does NOT include a
    // bare "severe headache" or "sudden headache" — those are common and NOT
    // inherently an emergency; every phrase below specifically requires the
    // sudden/instant/worst-of-life framing that makes this a red flag.
    red_flags: [
      'sudden severe headache',
      'worst headache of my life',
      'headache worst of my life',
      'thunderclap headache',
      'headache like being hit',
      'headache came on suddenly',
      'worst headache ever',
    ],
    specialist: 'Neurologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['headache_migraine', 'bacterial_meningitis'],
    recommendations: [
      'Call emergency services (108/112) immediately — this requires urgent brain imaging',
      'Do not wait to see if it improves — this can indicate bleeding in the brain (subarachnoid hemorrhage)',
      'Avoid any exertion while awaiting emergency care',
      'This is a genuine neurological emergency, not a typical headache',
      'Every minute matters — go to the nearest hospital with CT scan capability immediately',
    ],
  },
]

export default headache

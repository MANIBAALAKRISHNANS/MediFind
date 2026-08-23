// Allergic rhinitis is defined in respiratory/upper.js — cross-reference from
// here rather than duplicating.
export const allergy_autoimmune = [
  {
    id: 'allergy_food',
    name: 'Food Allergy',
    category: 'Allergic/Immune',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'hives', weight: 0.7, description: 'Appearing soon after eating a specific food' },
        { name: 'lip swelling', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'vomiting', weight: 0.4, description: '—' },
        { name: 'abdominal cramps', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'symptoms shortly after eating', weight: 0.6, description: 'Clear temporal relationship to a specific food' },
      ],
    },
    duration_patterns: { acute: '< 2 hours onset', typical: 'minutes to hours', chronic: null },
    severity_levels: {
      mild: { description: 'Mild hives without breathing symptoms', urgency: 'see-doctor-soon' },
      moderate: { description: 'Widespread hives with lip/facial swelling', urgency: 'see-doctor-today' },
      severe: { description: 'Breathing difficulty, throat tightness, or dizziness (anaphylaxis)', urgency: 'emergency' },
    },
    risk_factors: ['family history of allergies', 'known food allergy', 'asthma history', 'eczema history'],
    // Scoped to a food-exposure context — bare "breathing difficulty" alone
    // is far too broad (asthma, panic, many other causes).
    red_flags: [
      'throat tightness after eating',
      'difficulty breathing after eating',
      'swelling after eating',
    ],
    specialist: 'Allergist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_urticaria', 'allergy_anaphylaxis'],
    recommendations: [
      'Identify and strictly avoid the trigger food going forward',
      'Take an antihistamine for mild reactions',
      'Carry an epinephrine auto-injector if prescribed after a severe reaction',
      'See an allergist for formal food allergy testing',
      'Call emergency services immediately for any breathing difficulty or throat tightness',
    ],
  },

  {
    id: 'allergy_anaphylaxis',
    name: 'Anaphylaxis — Warning Signs',
    category: 'Allergic/Immune',
    aliases: ['severe allergic reaction'],
    symptoms: {
      primary: [
        { name: 'breathing difficulty', weight: 1.0, description: 'Sudden, following allergen exposure' },
        { name: 'facial swelling', weight: 0.8, description: 'Lips, tongue, throat' },
      ],
      secondary: [
        { name: 'hives', weight: 0.5, description: 'Widespread' },
        { name: 'dizziness', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'rapid onset after exposure', weight: 0.8, description: 'Symptoms develop within minutes of allergen exposure (food, sting, medication)' },
      ],
    },
    duration_patterns: { acute: 'minutes', typical: 'this is always a life-threatening emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — any suspicion requires immediate emergency treatment', urgency: 'emergency' },
      moderate: { description: 'Facial swelling with hives after allergen exposure', urgency: 'emergency' },
      severe: { description: 'Breathing difficulty, throat closing, or collapse', urgency: 'emergency' },
    },
    risk_factors: ['known severe allergy (food, insect sting, medication, latex)', 'previous anaphylactic reaction', 'asthma'],
    red_flags: [
      'throat closing',
      'throat tightness after allergen',
      'difficulty breathing after a sting',
      'swelling of lips and tongue with breathing difficulty',
    ],
    specialist: 'Emergency Medicine',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['allergy_food', 'dermatological_urticaria'],
    recommendations: [
      'Use an epinephrine auto-injector immediately if available and call emergency services',
      'Call 108/112 immediately even if symptoms seem to improve after epinephrine — a second reaction can occur',
      'Lay the person flat with legs raised unless they are having trouble breathing (then sit them up)',
      'Do not wait to see if symptoms resolve on their own',
      'Anyone with a known severe allergy should carry an epinephrine auto-injector at all times',
    ],
  },

  {
    id: 'allergy_drug',
    name: 'Drug Allergy',
    category: 'Allergic/Immune',
    aliases: ['medication allergy'],
    symptoms: {
      primary: [
        { name: 'skin rash', weight: 0.7, description: 'Appearing after starting a new medication' },
        { name: 'itching', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.3, description: '—' },
        { name: 'facial swelling', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'recent new medication', weight: 0.6, description: 'Clear temporal relationship to starting a new drug' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset', typical: 'days after starting the medication', chronic: null },
    severity_levels: {
      mild: { description: 'Mild rash without breathing symptoms', urgency: 'see-doctor-soon' },
      moderate: { description: 'Widespread rash with fever', urgency: 'see-doctor-today' },
      severe: { description: 'Breathing difficulty, facial swelling, or skin blistering/peeling', urgency: 'emergency' },
    },
    risk_factors: ['known drug allergies', 'multiple medication use', 'family history of drug allergies'],
    red_flags: ['breathing difficulty', 'facial or throat swelling', 'skin blistering or peeling', 'fever with widespread rash'],
    specialist: 'Allergist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_urticaria', 'allergy_anaphylaxis'],
    recommendations: [
      'Stop the suspected medication immediately and contact your doctor',
      'Take an antihistamine for mild itching and rash',
      'Note the exact medication name and keep a record for future reference',
      'Inform all future healthcare providers about this allergy',
      'Call emergency services immediately for breathing difficulty, facial swelling, or skin blistering',
    ],
  },

  {
    id: 'lupus_awareness',
    name: 'Lupus (SLE) — Awareness',
    category: 'Allergic/Immune',
    aliases: ['sle', 'systemic lupus erythematosus'],
    symptoms: {
      primary: [
        { name: 'joint pain', weight: 0.7, description: 'Multiple joints' },
        { name: 'fatigue', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'butterfly rash', weight: 0.5, description: 'Across cheeks and nose' },
        { name: 'photosensitivity', weight: 0.4, description: 'Rash worsens with sun exposure' },
        { name: 'hair loss', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'butterfly-shaped facial rash', weight: 0.7, description: 'Highly characteristic malar rash' },
        { name: 'mouth ulcers', weight: 0.4, description: 'Painless' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, with flares', chronic: '> 42 days of symptoms warrants evaluation' },
    severity_levels: {
      mild: { description: 'Mild joint pain and fatigue', urgency: 'see-doctor-soon' },
      moderate: { description: 'Butterfly rash with joint pain and fatigue', urgency: 'see-doctor-today' },
      severe: { description: 'Blood in urine, seizures, or severe chest pain (organ involvement)', urgency: 'emergency' },
    },
    risk_factors: ['female gender', 'age 15-45', 'family history', 'certain ethnicities show higher rates'],
    red_flags: ['blood in urine or swelling of face and legs', 'seizures or confusion', 'severe chest pain or breathlessness'],
    specialist: 'Rheumatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['musculoskeletal_rheumatoid_arthritis', 'vascular_vasculitis'],
    recommendations: [
      'See a rheumatologist — ANA and other specific blood tests are key diagnostic tools',
      'Strict sun protection is essential — SPF 50+ sunscreen and protective clothing',
      'Take prescribed medication (often hydroxychloroquine) consistently without missing doses',
      'Regular urine tests are needed to monitor for kidney involvement',
      'Seek emergency care for blood in urine, seizures, or severe chest pain/breathlessness',
    ],
  },

  {
    id: 'sjogrens_syndrome',
    name: "Sjögren's Syndrome",
    category: 'Allergic/Immune',
    aliases: ['sjogrens'],
    symptoms: {
      primary: [
        { name: 'eye dryness', weight: 0.7, description: 'Chronic, gritty sensation' },
        { name: 'dry mouth', weight: 0.7, description: 'Persistent' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'joint pain', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'both dry eyes and dry mouth together', weight: 0.6, description: 'Combined dryness is characteristic of this autoimmune condition' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, gradual onset', chronic: '> 90 days of symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild dryness, manageable with drops', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant dryness affecting daily comfort', urgency: 'see-doctor-soon' },
      severe: { description: 'Corneal damage from severe dry eyes, or organ involvement', urgency: 'see-doctor-today' },
    },
    risk_factors: ['female gender', 'age over 40', 'other autoimmune conditions'],
    red_flags: ['severe eye pain or vision changes', 'significant swallowing difficulty from dry mouth'],
    specialist: 'Rheumatologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['eye_dry_eye', 'lupus_awareness'],
    recommendations: [
      'See a rheumatologist for blood tests and possible lip biopsy to confirm',
      'Use artificial tears and saliva substitutes regularly',
      'Stay well hydrated and avoid dry, air-conditioned environments when possible',
      'Regular dental checkups are important — dry mouth increases cavity risk',
      'See an ophthalmologist for severe eye dryness to prevent corneal damage',
    ],
  },

  {
    id: 'allergy_angioedema',
    name: 'Angioedema',
    category: 'Allergic/Immune',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'facial swelling', weight: 0.85, description: 'Sudden, deep tissue swelling' },
        { name: 'lip swelling', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'hives', weight: 0.3, description: 'May or may not be present' },
      ],
      differentiating: [
        { name: 'swelling without itching', weight: 0.4, description: 'Deep tissue swelling, sometimes without the itch typical of hives' },
      ],
    },
    duration_patterns: { acute: '< 72 hours per episode', typical: 'hours to days', chronic: '> 42 days of recurrent episodes suggests chronic angioedema' },
    severity_levels: {
      mild: { description: 'Mild localized swelling', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant facial or lip swelling', urgency: 'emergency' },
      severe: { description: 'Throat or tongue swelling with breathing difficulty', urgency: 'emergency' },
    },
    risk_factors: ['certain blood pressure medications (ACE inhibitors)', 'allergies', 'hereditary angioedema (family history)'],
    red_flags: ['throat or tongue swelling', 'breathing difficulty', 'voice change'],
    specialist: 'Allergist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['allergy_anaphylaxis', 'dermatological_urticaria'],
    recommendations: [
      'Call emergency services immediately if throat or tongue swelling occurs',
      'If on an ACE inhibitor blood pressure medication, discuss switching with your doctor',
      'Use an epinephrine auto-injector if prescribed for severe episodes',
      'See an allergist to identify the underlying cause',
      'Seek emergency care immediately for any breathing difficulty or voice change',
    ],
  },

  {
    id: 'serum_sickness',
    name: 'Serum Sickness',
    category: 'Allergic/Immune',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'skin rash', weight: 0.7, description: 'Appearing 1-2 weeks after exposure' },
        { name: 'joint pain', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.4, description: '—' },
        { name: 'lymph node swelling', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'recent medication or antiserum exposure', weight: 0.6, description: 'Symptoms follow exposure by 1-2 weeks, unlike immediate drug allergy' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset after exposure', typical: '1-2 weeks after exposure, resolves over days', chronic: null },
    severity_levels: {
      mild: { description: 'Mild rash and joint discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant rash with fever and joint pain', urgency: 'see-doctor-today' },
      severe: { description: 'Breathing difficulty or severe systemic symptoms', urgency: 'emergency' },
    },
    risk_factors: ['recent antiserum/antitoxin exposure (e.g. snake antivenom)', 'certain antibiotics', 'recent monoclonal antibody treatment'],
    red_flags: ['breathing difficulty', 'severe systemic symptoms'],
    specialist: 'Allergist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['allergy_drug', 'lupus_awareness'],
    recommendations: [
      'See a doctor to confirm the diagnosis and identify the trigger',
      'Take prescribed anti-inflammatory or antihistamine medication for symptom relief',
      'The condition is usually self-limiting and resolves within 1-2 weeks',
      'Avoid the triggering agent in the future if identifiable',
      'Seek emergency care for breathing difficulty or severe systemic symptoms',
    ],
  },
]

export default allergy_autoimmune

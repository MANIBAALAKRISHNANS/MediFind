export const blood = [
  {
    id: 'anemia_iron_deficiency',
    name: 'Anemia (Iron Deficiency)',
    category: 'Hematological',
    aliases: ['anemia', 'low hemoglobin'],
    symptoms: {
      primary: [
        // The single most common way iron-deficiency anaemia presents, and by
        // some distance the commonest deficiency in India — this is the entry
        // a bare "tiredness" should reach.
        { name: 'fatigue', weight: 0.8, description: '—' },
        { name: 'pallor', weight: 0.6, description: 'Pale skin, gums' },
      ],
      secondary: [
        { name: 'dizziness', weight: 0.4, description: '—' },
        { name: 'shortness of breath', weight: 0.4, description: 'On exertion' },
        { name: 'hair loss', weight: 0.3, description: '—' },
        { name: 'palpitations', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'brittle nails', weight: 0.3, description: 'Spoon-shaped nails in severe cases' },
        { name: 'heavy periods', weight: 0.4, description: 'Common cause in women' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over weeks to months', chronic: '> 90 days of symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild fatigue, hemoglobin slightly low', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant fatigue and pallor', urgency: 'see-doctor-soon' },
      severe: { description: 'Hemoglobin below 7 g/dL, breathlessness on minimal exertion, or fainting', urgency: 'emergency' },
    },
    risk_factors: ['female gender', 'heavy menstrual periods', 'poor diet', 'pregnancy', 'intestinal worm infestation'],
    // Bare "chest pain" narrowed — it also matches "chest tightness" via the
    // synonym map, unrelated to anemia on its own.
    red_flags: ['hemoglobin below 7 g/dL', 'severe breathlessness on minimal exertion', 'chest pain with breathlessness', 'fainting'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'female',
    similar_diseases: ['vitamin_b12_deficiency', 'hypothyroidism', 'blood_sickle_cell_awareness'],
    recommendations: [
      'See a doctor for a complete blood count and iron studies',
      'Take prescribed iron supplements with vitamin C to improve absorption',
      'Eat iron-rich foods daily — green leafy vegetables, jaggery, dates, lean meat',
      'Avoid tea and coffee immediately after meals — they reduce iron absorption',
      'Seek emergency care if you feel breathless on minimal activity or faint',
    ],
  },

  {
    id: 'vitamin_b12_deficiency',
    name: 'Vitamin B12 Deficiency',
    category: 'Hematological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'fatigue', weight: 0.6, description: '—' },
        { name: 'numbness', weight: 0.5, description: 'Hands and feet' },
      ],
      secondary: [
        { name: 'tingling', weight: 0.5, description: '—' },
        { name: 'memory problems', weight: 0.3, description: '—' },
        { name: 'pallor', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'vegetarian diet', weight: 0.5, description: 'B12 is found almost exclusively in animal products' },
        { name: 'sore tongue', weight: 0.3, description: 'Glossitis' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over months to years', chronic: '> 90 days typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Mild fatigue, low-normal B12', urgency: 'see-doctor-soon' },
      moderate: { description: 'Numbness and tingling with fatigue', urgency: 'see-doctor-soon' },
      severe: { description: 'Progressive neurological symptoms or severe anemia below 8 g/dL', urgency: 'see-doctor-today' },
    },
    risk_factors: ['strict vegetarian/vegan diet', 'elderly age', 'certain gut conditions affecting absorption', 'metformin use'],
    red_flags: ['progressive numbness spreading upward', 'balance problems', 'severe anemia below 8 g/dL', 'dementia symptoms in an elderly patient'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['anemia_iron_deficiency', 'neurological_peripheral_neuropathy'],
    recommendations: [
      'See a doctor for serum B12 and complete blood count testing',
      'Vitamin B12 injections may be needed initially for confirmed deficiency',
      'Oral B12 supplements are effective for maintenance once levels are restored',
      'Vegetarians should use fortified foods or supplements lifelong',
      'See a doctor for progressive neurological symptoms — these can become permanent if untreated',
    ],
  },

  {
    id: 'blood_folate_deficiency',
    name: 'Folate Deficiency',
    category: 'Hematological',
    aliases: ['folic acid deficiency'],
    symptoms: {
      primary: [
        { name: 'fatigue', weight: 0.6, description: '—' },
        { name: 'pallor', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'sore tongue', weight: 0.3, description: '—' },
        { name: 'irritability', weight: 0.2, description: '—' },
      ],
      differentiating: [
        { name: 'poor diet', weight: 0.4, description: 'Low intake of leafy greens and legumes' },
        { name: 'pregnancy', weight: 0.5, description: 'Increased requirement during pregnancy' },
        // Moved out of red_flags: matches this entry's own see-doctor-today
        // max — needs prompt supplementation, not an ambulance.
        { name: 'pregnancy with confirmed deficiency', weight: 0.5, description: 'Needs prompt supplementation' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over weeks to months', chronic: '> 60 days typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Mild fatigue', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant fatigue with pallor', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe anemia, or pregnancy (risk of neural tube defects in the baby)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['poor diet', 'pregnancy', 'alcohol use', 'certain medications'],
    red_flags: ['severe anemia symptoms'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'female',
    similar_diseases: ['anemia_iron_deficiency', 'vitamin_b12_deficiency'],
    recommendations: [
      'See a doctor for blood tests to confirm folate deficiency',
      'Take prescribed folic acid supplements',
      'Eat folate-rich foods — leafy greens, legumes, citrus fruits',
      'Women planning pregnancy should take folic acid supplements before conception',
      'See a doctor promptly if pregnant with confirmed deficiency',
    ],
  },

  {
    id: 'blood_thrombocytopenia',
    name: 'Thrombocytopenia (Low Platelets)',
    category: 'Hematological',
    aliases: ['low platelets'],
    symptoms: {
      primary: [
        { name: 'easy bruising', weight: 0.75, description: '—' },
        { name: 'bleeding gums', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'nosebleed', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pinpoint red spots on skin', weight: 0.6, description: 'Petechiae — small red/purple dots' },
        { name: 'recent fever', weight: 0.4, description: 'Suggests dengue as a cause in India' },
      ],
    },
    duration_patterns: { acute: '< 7 days if infectious cause', typical: 'depends on underlying cause', chronic: '> 90 days suggests chronic ITP' },
    severity_levels: {
      mild: { description: 'Mild bruising, platelets moderately low', urgency: 'see-doctor-soon' },
      moderate: { description: 'Bleeding gums and nosebleeds', urgency: 'see-doctor-today' },
      severe: { description: 'Significant bleeding, blood in stool/urine, or severe headache (possible brain bleed)', urgency: 'emergency' },
    },
    risk_factors: ['recent viral infection (especially dengue)', 'certain medications', 'autoimmune conditions'],
    red_flags: ['significant or uncontrolled bleeding', 'blood in stool or urine', 'severe headache with easy bruising', 'platelet count below 20,000'],
    specialist: 'Hematologist',
    india_prevalence: 'moderate',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_dengue', 'blood_leukemia_warning'],
    recommendations: [
      'See a doctor promptly for a complete blood count and platelet monitoring',
      'Avoid aspirin, ibuprofen, and other blood-thinning medications',
      'Avoid contact sports or activities with injury risk until platelets normalize',
      'If related to dengue, monitor platelet counts daily as advised',
      'Seek emergency care for significant bleeding, blood in stool/urine, or severe headache',
    ],
  },

  {
    id: 'blood_leukemia_warning',
    name: 'Leukemia — Warning Signs (Awareness)',
    category: 'Hematological',
    aliases: ['blood cancer warning'],
    symptoms: {
      primary: [
        { name: 'fatigue', weight: 0.6, description: 'Persistent, unexplained' },
        { name: 'easy bruising', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.4, description: 'Recurrent, unexplained' },
        { name: 'lymph node swelling', weight: 0.4, description: '—' },
        { name: 'unexplained weight loss', weight: 0.4, description: '—' },
        { name: 'bone pain', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'frequent infections', weight: 0.5, description: 'Recurrent infections suggest impaired immune function' },
        { name: 'unexplained bleeding', weight: 0.5, description: 'Nosebleeds, gum bleeding without clear cause' },
      ],
    },
    duration_patterns: { acute: null, typical: 'symptoms develop over weeks to months', chronic: '> 30 days of unexplained symptoms warrants evaluation' },
    severity_levels: {
      mild: { description: 'Mild unexplained fatigue — still warrants blood testing', urgency: 'see-doctor-soon' },
      moderate: { description: 'Fatigue with bruising and recurrent infections', urgency: 'see-doctor-today' },
      severe: { description: 'Significant bleeding, high fever, or severe bone pain', urgency: 'emergency' },
    },
    risk_factors: ['radiation exposure history', 'certain genetic conditions', 'family history'],
    red_flags: ['significant unexplained bleeding', 'high persistent fever', 'severe bone pain', 'rapidly enlarging lymph nodes'],
    specialist: 'Hematologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['blood_thrombocytopenia', 'bacterial_tuberculosis', 'parasitic_leishmaniasis'],
    recommendations: [
      'See a doctor promptly for a complete blood count if these symptoms are present together',
      'This is informational only — diagnosis requires blood tests and possibly a bone marrow biopsy',
      'Do not delay evaluation of unexplained persistent fatigue with bruising or fever',
      'Early diagnosis significantly improves treatment outcomes',
      'Seek emergency care for significant bleeding or very high fever',
    ],
  },

  {
    id: 'blood_lymphoma_warning',
    name: 'Lymphoma — Warning Signs (Awareness)',
    category: 'Hematological',
    aliases: ['lymphoma'],
    symptoms: {
      primary: [
        { name: 'lymph node swelling', weight: 0.8, description: 'Painless, persistent, often neck/armpit/groin' },
      ],
      secondary: [
        { name: 'night sweats', weight: 0.5, description: 'Drenching' },
        { name: 'unexplained weight loss', weight: 0.5, description: '—' },
        { name: 'fever', weight: 0.4, description: 'Unexplained' },
        { name: 'itching', weight: 0.3, description: 'Generalized, without rash' },
      ],
      differentiating: [
        { name: 'painless lymph node', weight: 0.6, description: 'Painless nature distinguishes from reactive/infectious nodes' },
      ],
    },
    duration_patterns: { acute: null, typical: 'lymph node persists or grows over weeks', chronic: '> 30 days of persistent swelling warrants evaluation' },
    severity_levels: {
      mild: { description: 'Single persistent painless lymph node — still warrants evaluation', urgency: 'see-doctor-soon' },
      moderate: { description: 'Multiple nodes with weight loss and night sweats', urgency: 'see-doctor-today' },
      severe: { description: 'Rapidly enlarging nodes with breathing difficulty (mediastinal involvement)', urgency: 'emergency' },
    },
    risk_factors: ['immunocompromised', 'certain viral infections', 'family history', 'age extremes (young or elderly)'],
    red_flags: ['rapidly enlarging lymph node', 'breathing difficulty', 'drenching night sweats with weight loss'],
    specialist: 'Hematologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_tuberculosis', 'blood_leukemia_warning'],
    recommendations: [
      'See a doctor for evaluation of any lymph node that persists more than 2-4 weeks',
      'This is informational only — a biopsy is needed to confirm any diagnosis',
      'Do not delay evaluation of a painless, persistent, enlarging lymph node',
      'Blood tests and imaging help guide further workup',
      'Seek emergency care for rapidly enlarging nodes with breathing difficulty',
    ],
  },

  {
    id: 'blood_hemophilia_awareness',
    name: 'Hemophilia (Awareness)',
    category: 'Hematological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'excessive bleeding', weight: 0.8, description: 'After minor injury or spontaneously' },
        { name: 'joint swelling', weight: 0.6, description: 'From bleeding into joints (hemarthrosis)' },
      ],
      secondary: [
        { name: 'easy bruising', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'family history', weight: 0.6, description: 'X-linked genetic condition, typically affects males' },
        { name: 'bleeding into joints', weight: 0.7, description: 'Highly characteristic of hemophilia' },
      ],
    },
    duration_patterns: { acute: 'bleeding episodes', typical: 'lifelong genetic condition', chronic: 'condition itself is lifelong' },
    severity_levels: {
      mild: { description: 'Bleeding only with significant trauma/surgery', urgency: 'see-doctor-soon' },
      moderate: { description: 'Bleeding with minor injury', urgency: 'see-doctor-today' },
      severe: { description: 'Spontaneous bleeding into joints or muscles, or head injury', urgency: 'emergency' },
    },
    risk_factors: ['family history', 'male gender (X-linked inheritance)'],
    red_flags: ['head injury in a known hemophilia patient', 'spontaneous joint or muscle bleeding', 'uncontrolled bleeding'],
    specialist: 'Hematologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'male',
    similar_diseases: ['blood_thrombocytopenia'],
    recommendations: [
      'See a hematologist for factor level testing to confirm and classify severity',
      'Factor replacement therapy is the mainstay of treatment for confirmed hemophilia',
      'Avoid contact sports and activities with high injury risk',
      'Carry a medical alert card noting the condition',
      'Seek emergency care immediately for any head injury or spontaneous joint bleeding',
    ],
  },
  {
    id: 'blood_sickle_cell_awareness',
    name: 'Sickle Cell Disease (Awareness)',
    category: 'Hematological',
    aliases: ['sickle cell anemia'],
    symptoms: {
      primary: [
        { name: 'severe joint pain', weight: 0.8, description: 'Vaso-occlusive crisis, recurrent episodes' },
        { name: 'fatigue', weight: 0.5, description: 'Due to chronic anemia' },
      ],
      secondary: [
        { name: 'pallor', weight: 0.4, description: '—' },
        { name: 'jaundice', weight: 0.3, description: 'Mild, from ongoing red cell breakdown' },
      ],
      differentiating: [
        { name: 'family history', weight: 0.6, description: 'Genetic condition, more common in certain communities/regions' },
        { name: 'recurrent painful crises', weight: 0.7, description: 'Episodic severe pain is highly characteristic' },
      ],
    },
    duration_patterns: { acute: 'crisis lasts days', typical: 'lifelong condition with recurrent crises', chronic: 'condition itself is lifelong' },
    severity_levels: {
      mild: { description: 'Known condition with mild chronic fatigue', urgency: 'see-doctor-soon' },
      moderate: { description: 'Painful crisis manageable with home measures', urgency: 'see-doctor-today' },
      severe: { description: 'Severe crisis with chest pain, breathing difficulty, or high fever', urgency: 'emergency' },
    },
    risk_factors: ['family history', 'certain tribal/regional populations in India (higher prevalence)'],
    red_flags: ['chest pain with breathing difficulty', 'high fever in a known sickle cell patient', 'stroke-like symptoms', 'severe unrelenting pain crisis'],
    specialist: 'Hematologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['anemia_iron_deficiency', 'musculoskeletal_osteoarthritis'],
    recommendations: [
      'See a hematologist for hemoglobin electrophoresis to confirm and manage the condition',
      'Stay well hydrated and avoid extreme temperatures — both can trigger a crisis',
      'Take prescribed pain management and hydroxyurea therapy as directed',
      'Keep vaccinations up to date — increased infection risk',
      'Go to the emergency room immediately for chest pain, breathing difficulty, high fever, or stroke-like symptoms',
    ],
  },
]

export default blood

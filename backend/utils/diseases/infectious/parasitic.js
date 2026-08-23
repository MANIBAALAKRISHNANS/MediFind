export const parasitic = [
  {
    id: 'parasitic_malaria',
    name: 'Malaria',
    category: 'Infectious - Parasitic',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.9, description: 'Cyclical, with chills and sweating' },
        { name: 'chills', weight: 0.8, description: 'Rigors, often preceding fever spike' },
      ],
      secondary: [
        { name: 'headache', weight: 0.4, description: '—' },
        { name: 'body aches', weight: 0.4, description: '—' },
        { name: 'nausea', weight: 0.3, description: '—' },
        { name: 'excessive sweating', weight: 0.4, description: 'Following fever spike' },
      ],
      differentiating: [
        { name: 'cyclical fever pattern', weight: 0.7, description: 'Fever recurring every 48-72 hours depending on species' },
        { name: 'enlarged spleen', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: '< 7 days early', typical: '1-2 weeks with treatment', chronic: '> 30 days suggests relapse or resistant strain' },
    severity_levels: {
      mild: { description: 'Cyclical fever and chills without complications', urgency: 'see-doctor-today' },
      moderate: { description: 'High fever with significant weakness', urgency: 'see-doctor-today' },
      severe: { description: 'Confusion, seizures, dark urine, jaundice, or severe anemia (cerebral/severe malaria)', urgency: 'emergency' },
    },
    risk_factors: ['mosquito exposure', 'monsoon season', 'recent travel to endemic area', 'stagnant water nearby'],
    red_flags: ['altered consciousness or confusion', 'seizures', 'dark or cola-colored urine', 'severe anemia or jaundice', 'difficulty breathing'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_dengue', 'bacterial_typhoid', 'viral_fever'],
    recommendations: [
      'Get a rapid diagnostic test or blood smear immediately to confirm and identify the species',
      'Take the complete prescribed antimalarial course — do not stop early',
      'Use mosquito nets and repellents to prevent re-infection and spread',
      'Stay hydrated with ORS and clear fluids',
      'Seek emergency care immediately for confusion, seizures, or dark urine',
    ],
  },

  {
    id: 'parasitic_filariasis',
    name: 'Lymphatic Filariasis',
    category: 'Infectious - Parasitic',
    aliases: ['elephantiasis'],
    symptoms: {
      primary: [
        { name: 'limb swelling', weight: 0.85, description: 'Chronic, often asymmetric swelling of legs or arms' },
        { name: 'fever', weight: 0.4, description: 'During acute attacks' },
      ],
      secondary: [
        { name: 'skin thickening', weight: 0.5, description: 'In chronic stages' },
        { name: 'lymph node swelling', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'mosquito exposure', weight: 0.4, description: 'Transmitted by Culex mosquitoes' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic condition developing over years', chronic: '> 90 days is the norm for established disease' },
    severity_levels: {
      mild: { description: 'Mild intermittent limb swelling', urgency: 'see-doctor-soon' },
      moderate: { description: 'Persistent swelling with skin changes', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe elephantiasis with recurrent infections/fever attacks', urgency: 'see-doctor-today' },
    },
    risk_factors: ['mosquito exposure', 'endemic rural area', 'poor sanitation', 'prolonged residence in endemic zone'],
    // Requires the full combination (fever + worsening + swelling) — this
    // entry's baseline urgency is NOT emergency-tier, so a bare symptom
    // alone should not force the emergency escalation a matched red flag
    // triggers; only the specific acute-attack pattern should.
    red_flags: [
      'fever with rapidly worsening leg swelling',
      'sudden worsening limb swelling with fever and redness',
    ],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['deep_vein_thrombosis', 'cellulitis'],
    recommendations: [
      'See a doctor for blood testing (microfilaria, antigen test)',
      'Take prescribed antifilarial medication (DEC, albendazole) as directed',
      'Practice careful hygiene of the affected limb to prevent secondary infection',
      'Use mosquito nets and repellents to prevent further transmission',
      'Compression and limb elevation help manage chronic swelling',
    ],
  },

  {
    id: 'parasitic_amoebiasis',
    name: 'Amoebiasis',
    category: 'Infectious - Parasitic',
    aliases: ['amoebic dysentery'],
    symptoms: {
      primary: [
        { name: 'diarrhea', weight: 0.8, description: 'Often with blood and mucus' },
        { name: 'abdominal cramps', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.3, description: 'Low-grade' },
        { name: 'weight loss', weight: 0.3, description: 'With chronic infection' },
      ],
      differentiating: [
        { name: 'blood in stool', weight: 0.6, description: 'Mucoid, blood-streaked stool is characteristic' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '2-4 weeks', chronic: '> 30 days suggests chronic amoebiasis or liver abscess' },
    severity_levels: {
      mild: { description: 'Mild loose stools without blood', urgency: 'see-doctor-soon' },
      moderate: { description: 'Bloody diarrhea with cramps', urgency: 'see-doctor-today' },
      severe: { description: 'High fever with right upper abdomen pain (possible amoebic liver abscess)', urgency: 'emergency' },
    },
    risk_factors: ['contaminated water exposure', 'ate raw or street food', 'poor sanitation area'],
    red_flags: ['high fever with right upper abdominal pain', 'severe dehydration', 'rigid abdomen', 'my abdomen feels rigid'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_dysentery', 'ibd', 'gastroenteritis'],
    recommendations: [
      'Get a stool examination to confirm the diagnosis',
      'Complete the full prescribed antiparasitic (metronidazole) course',
      'Drink only boiled or bottled water going forward',
      'Maintain good hand hygiene, especially before eating',
      'Seek emergency care for high fever with abdominal pain — possible liver abscess',
    ],
  },

  {
    id: 'parasitic_giardiasis',
    name: 'Giardiasis',
    category: 'Infectious - Parasitic',
    aliases: ['giardia'],
    symptoms: {
      primary: [
        { name: 'diarrhea', weight: 0.7, description: 'Foul-smelling, greasy stools' },
        { name: 'bloating', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'abdominal cramps', weight: 0.5, description: '—' },
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'weight loss', weight: 0.3, description: 'With prolonged infection' },
      ],
      differentiating: [
        { name: 'greasy foul stools', weight: 0.6, description: 'Fatty, floating, malodorous stool suggests malabsorption from giardia' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '2-6 weeks if untreated', chronic: '> 30 days can cause chronic malabsorption' },
    severity_levels: {
      mild: { description: 'Mild bloating and loose stools', urgency: 'see-doctor-soon' },
      moderate: { description: 'Persistent diarrhea with weight loss', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe dehydration or significant unintended weight loss', urgency: 'see-doctor-today' },
    },
    risk_factors: ['contaminated water exposure', 'recent travel', 'daycare/childcare setting'],
    red_flags: ['severe dehydration', 'significant unintended weight loss'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['ibs', 'lactose_intolerance', 'celiac_disease'],
    recommendations: [
      'Get a stool test (antigen or microscopy) to confirm',
      'Complete the prescribed antiparasitic course (metronidazole or tinidazole)',
      'Drink only boiled or filtered water',
      'Stay well hydrated during the illness',
      'Practice good hand hygiene, especially after using the toilet',
    ],
  },

  {
    id: 'parasitic_hookworm',
    name: 'Hookworm Infection',
    category: 'Infectious - Parasitic',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'fatigue', weight: 0.6, description: 'Due to iron-deficiency anemia' },
        { name: 'abdominal pain', weight: 0.4, description: '—' },
      ],
      secondary: [
        { name: 'pallor', weight: 0.5, description: 'Due to anemia' },
        { name: 'itchy rash feet', weight: 0.4, description: 'At site of larval skin penetration' },
      ],
      differentiating: [
        { name: 'walking barefoot on soil', weight: 0.5, description: 'Larvae penetrate skin from contaminated soil' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, low-grade over months', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Mild fatigue without significant anemia', urgency: 'see-doctor-soon' },
      moderate: { description: 'Fatigue with detectable anemia', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe anemia causing breathlessness or fainting', urgency: 'see-doctor-today' },
    },
    risk_factors: ['walking barefoot on soil', 'poor sanitation area', 'rural agricultural work'],
    red_flags: ['severe anemia with breathlessness', 'fainting'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['anemia_iron_deficiency'],
    recommendations: [
      'Get a stool examination for ova and parasites',
      'Take a single-dose antiparasitic (albendazole/mebendazole) as prescribed',
      'Take iron supplementation to correct anemia',
      'Wear footwear when walking on soil, especially in endemic areas',
      'Improve sanitation practices to prevent reinfection',
    ],
  },

  {
    id: 'parasitic_roundworm',
    name: 'Roundworm Infection (Ascariasis)',
    category: 'Infectious - Parasitic',
    aliases: ['ascariasis'],
    symptoms: {
      primary: [
        { name: 'abdominal pain', weight: 0.6, description: '—' },
        { name: 'loss of appetite', weight: 0.4, description: '—' },
      ],
      secondary: [
        { name: 'weight loss', weight: 0.3, description: 'Especially in children' },
        { name: 'nausea', weight: 0.3, description: '—' },
        { name: 'passing worms', weight: 0.5, description: 'In stool or vomit' },
      ],
      differentiating: [
        { name: 'passing worms in stool', weight: 0.8, description: 'Visible worms confirm the diagnosis' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, low-grade symptoms', chronic: '> 30 days typical before detection' },
    severity_levels: {
      mild: { description: 'Mild abdominal discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant abdominal pain with poor appetite', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe cramping abdominal pain with distension and vomiting (possible intestinal obstruction)', urgency: 'emergency' },
    },
    risk_factors: ['poor sanitation area', 'contaminated food or water', 'children'],
    red_flags: ['severe abdominal pain with distension', 'vomiting worms', 'no bowel movement with distension'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['parasitic_pinworm', 'ibs'],
    recommendations: [
      'Get a stool examination to confirm and identify the worm type',
      'Take albendazole or mebendazole as prescribed — single dose usually effective',
      'All household/school-going children should be dewormed together',
      'Practice strict handwashing before eating and after using the toilet',
      'Seek emergency care for severe abdominal pain with distension — possible obstruction',
    ],
  },

  {
    id: 'parasitic_tapeworm',
    name: 'Tapeworm Infection (Taeniasis)',
    category: 'Infectious - Parasitic',
    aliases: ['taeniasis'],
    symptoms: {
      primary: [
        { name: 'abdominal discomfort', weight: 0.5, description: 'Mild, often nonspecific' },
        { name: 'passing worm segments', weight: 0.7, description: 'Flat, rice-grain-like segments in stool' },
      ],
      secondary: [
        { name: 'weight loss', weight: 0.3, description: '—' },
        { name: 'nausea', weight: 0.2, description: '—' },
      ],
      differentiating: [
        { name: 'ate raw or street food', weight: 0.5, description: 'Undercooked pork or beef is the typical source' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, often asymptomatic for months', chronic: '> 90 days typical before detection' },
    severity_levels: {
      mild: { description: 'Asymptomatic, found incidentally', urgency: 'see-doctor-soon' },
      moderate: { description: 'Mild abdominal discomfort with segment passage', urgency: 'see-doctor-soon' },
      severe: { description: 'Neurological symptoms (seizures) — suggests neurocysticercosis, a serious complication', urgency: 'emergency' },
    },
    risk_factors: ['ate raw or street food', 'undercooked pork or beef', 'poor sanitation area'],
    red_flags: ['seizures', 'severe headache with visual changes'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['parasitic_roundworm'],
    recommendations: [
      'See a doctor for stool testing and appropriate antiparasitic treatment (praziquantel/niclosamide)',
      'Cook pork and beef thoroughly before eating',
      'Practice good hand hygiene',
      'Seek emergency care immediately if seizures occur — may indicate cysts in the brain',
      'Follow up stool tests to confirm clearance',
    ],
  },

  {
    id: 'parasitic_toxoplasmosis',
    name: 'Toxoplasmosis',
    category: 'Infectious - Parasitic',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'lymph node swelling', weight: 0.5, description: 'Often neck' },
        { name: 'fatigue', weight: 0.4, description: '—' },
      ],
      secondary: [
        { name: 'low-grade fever', weight: 0.3, description: '—' },
        { name: 'muscle aches', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'cat exposure', weight: 0.5, description: 'Cat feces or undercooked meat are the typical sources' },
        { name: 'pregnancy', weight: 0.7, description: 'High risk of fetal harm if infected during pregnancy' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: 'often mild/self-limiting in healthy people', chronic: 'latent infection can persist lifelong' },
    severity_levels: {
      mild: { description: 'Mild or no symptoms in a healthy person', urgency: 'self-care' },
      moderate: { description: 'Persistent lymph node swelling and fatigue', urgency: 'see-doctor-soon' },
      severe: { description: 'Pregnant woman with exposure, or immunocompromised with neurological symptoms', urgency: 'emergency' },
    },
    risk_factors: ['cat exposure', 'ate raw or street food', 'gardening without gloves', 'pregnancy', 'immunocompromised'],
    red_flags: ['pregnancy with symptoms or exposure', 'neurological symptoms in immunocompromised patient'],
    specialist: 'Infectious Disease Specialist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['infectious_mononucleosis'],
    recommendations: [
      'Pregnant women with exposure or symptoms should see a doctor urgently',
      'Avoid handling cat litter, especially during pregnancy',
      'Cook meat thoroughly before eating',
      'Wash hands and vegetables thoroughly after gardening',
      'Immunocompromised patients need prompt evaluation for any new neurological symptoms',
    ],
  },

  {
    id: 'parasitic_scabies',
    name: 'Scabies',
    category: 'Infectious - Parasitic',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'itching at night', weight: 0.9, description: 'Intense, worse at night' },
        { name: 'rash', weight: 0.6, description: 'Small bumps, often in a line' },
      ],
      secondary: [
        { name: 'skin burrow tracks', weight: 0.6, description: 'Thin grey lines on skin' },
      ],
      differentiating: [
        { name: 'itching between fingers', weight: 0.6, description: 'Classic location, also wrists and genitals' },
        { name: 'family members also affected', weight: 0.5, description: 'Highly contagious within households' },
        // Moved out of red_flags: this entry never reaches emergency-tier
        // severity (max is see-doctor-today), so a matched red_flag would
        // over-escalate. ('widespread crusted scabies' was already
        // matchable before this pass and had the same mismatch — fixed here
        // too while touching this entry, not part of the original prose bug.)
        { name: 'widespread crusted scabies', weight: 0.6, description: 'Norwegian scabies — more severe presentation' },
        { name: 'pus with spreading redness', weight: 0.5, description: 'Suggests secondary bacterial infection' },
      ],
    },
    duration_patterns: { acute: null, typical: '2-6 weeks for symptoms to fully resolve after treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Mild itching in a few areas', urgency: 'see-doctor-soon' },
      moderate: { description: 'Widespread itching and rash', urgency: 'see-doctor-soon' },
      severe: { description: 'Widespread crusting (Norwegian scabies) or signs of secondary bacterial infection', urgency: 'see-doctor-today' },
    },
    risk_factors: ['close contact with infected person', 'overcrowded living conditions', 'shared bedding'],
    red_flags: [],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['eczema', 'allergic_dermatitis'],
    recommendations: [
      'Apply prescribed scabicidal cream (permethrin) from neck to toes, leave on 8-14 hours',
      'Treat all household members simultaneously, even if asymptomatic',
      'Wash all bedding, towels, and clothing in hot water and dry in sunlight',
      'Keep nails short to reduce scratching-related skin damage',
      'Itching may persist for 2-4 weeks even after successful treatment',
    ],
  },

  {
    id: 'parasitic_head_lice',
    name: 'Head Lice (Pediculosis)',
    category: 'Infectious - Parasitic',
    aliases: ['pediculosis capitis'],
    symptoms: {
      primary: [
        { name: 'scalp itching', weight: 0.85, description: '—' },
      ],
      secondary: [
        { name: 'visible nits', weight: 0.6, description: 'White eggs attached to hair shafts' },
        { name: 'scalp redness', weight: 0.3, description: 'From scratching' },
      ],
      differentiating: [
        { name: 'school-age child', weight: 0.4, description: 'Most common in school-going children' },
      ],
    },
    duration_patterns: { acute: null, typical: 'resolves within 1-2 weeks with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Mild itching, few lice/nits visible', urgency: 'self-care' },
      moderate: { description: 'Widespread infestation with significant itching', urgency: 'self-care' },
      severe: { description: 'Secondary bacterial infection from scratching (crusting, pus)', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['close head-to-head contact', 'shared combs/hats', 'school-age children'],
    red_flags: ['signs of secondary bacterial infection on scalp'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['seborrheic_dermatitis'],
    recommendations: [
      'Use a medicated anti-lice shampoo or lotion as directed',
      'Comb hair with a fine-toothed nit comb daily for 2 weeks',
      'Wash bedding, combs, and hats in hot water',
      'Avoid sharing combs, hats, or hair accessories',
      'Check and treat all household members if infested',
    ],
  },

  {
    id: 'parasitic_pinworm',
    name: 'Pinworm Infection (Enterobiasis)',
    category: 'Infectious - Parasitic',
    aliases: ['enterobiasis', 'threadworm'],
    symptoms: {
      primary: [
        { name: 'anal itching', weight: 0.85, description: 'Especially at night' },
      ],
      secondary: [
        { name: 'irritability', weight: 0.3, description: 'Due to disturbed sleep, especially in children' },
        { name: 'abdominal pain', weight: 0.3, description: 'Mild' },
      ],
      differentiating: [
        { name: 'itching at night', weight: 0.7, description: 'Worms migrate to lay eggs at night, causing nocturnal itching' },
      ],
    },
    duration_patterns: { acute: null, typical: 'resolves within 1-2 weeks with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Mild anal itching', urgency: 'self-care' },
      moderate: { description: 'Disturbed sleep due to itching', urgency: 'see-doctor-soon' },
      severe: { description: 'Not applicable — this is a mild, self-limiting condition', urgency: 'self-care' },
    },
    risk_factors: ['children', 'crowded households/schools', 'poor hand hygiene'],
    red_flags: [],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['parasitic_roundworm'],
    recommendations: [
      'Take a single dose of albendazole or mebendazole, repeated after 2 weeks',
      'Treat all household members simultaneously',
      'Wash hands before meals and after using the toilet',
      'Wash bedding and underwear in hot water',
      'Keep nails short to reduce egg transmission via scratching',
    ],
  },

  {
    id: 'parasitic_leishmaniasis',
    name: 'Visceral Leishmaniasis (Kala-azar)',
    category: 'Infectious - Parasitic',
    aliases: ['kala-azar'],
    symptoms: {
      primary: [
        { name: 'prolonged fever', weight: 0.85, description: 'Irregular, lasting weeks' },
        { name: 'weight loss', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'pallor', weight: 0.4, description: 'Due to anemia' },
        { name: 'skin darkening', weight: 0.3, description: 'Gives disease its name ("kala-azar" = black fever)' },
      ],
      differentiating: [
        { name: 'enlarged spleen', weight: 0.8, description: 'Massive splenomegaly is characteristic' },
        { name: 'sandfly exposure', weight: 0.5, description: 'Transmitted by sandfly bites' },
      ],
    },
    duration_patterns: { acute: null, typical: 'weeks to months if untreated', chronic: '> 60 days is typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Intermittent fever with mild fatigue', urgency: 'see-doctor-today' },
      moderate: { description: 'Prolonged fever with weight loss and enlarged spleen', urgency: 'see-doctor-today' },
      severe: { description: 'Severe anemia, bleeding tendency, or secondary infections', urgency: 'emergency' },
    },
    risk_factors: ['sandfly exposure', 'endemic rural area (Bihar, Jharkhand, West Bengal)', 'malnutrition', 'poor housing conditions'],
    red_flags: ['severe anemia', 'bleeding tendency', 'signs of sepsis'],
    specialist: 'Infectious Disease Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_typhoid', 'malaria', 'leukemia_warning'],
    recommendations: [
      'See a doctor urgently for blood tests and spleen assessment',
      'Complete the full prescribed antiparasitic treatment course',
      'Use insecticide-treated bed nets to prevent sandfly bites',
      'Improve nutrition to support recovery',
      'Seek emergency care for severe anemia or bleeding',
    ],
  },
]

export default parasitic

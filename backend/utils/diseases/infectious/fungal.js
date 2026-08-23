export const fungal = [
  {
    id: 'fungal_oral_candidiasis',
    name: 'Oral Candidiasis (Oral Thrush)',
    category: 'Infectious - Fungal',
    aliases: ['oral thrush', 'thrush'],
    symptoms: {
      primary: [
        { name: 'white patches in mouth', weight: 0.85, description: 'Creamy white patches on tongue/inner cheeks' },
        { name: 'mouth soreness', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'loss of taste', weight: 0.3, description: '—' },
        { name: 'difficulty swallowing', weight: 0.3, description: 'If it spreads to throat' },
      ],
      differentiating: [
        { name: 'patches that bleed when scraped', weight: 0.6, description: 'Distinguishes from normal coating' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '1-2 weeks with treatment', chronic: '> 30 days suggests underlying immune issue' },
    severity_levels: {
      mild: { description: 'Small patches without pain', urgency: 'see-doctor-soon' },
      moderate: { description: 'Widespread patches with soreness', urgency: 'see-doctor-soon' },
      severe: { description: 'Spreading to throat causing difficulty swallowing/breathing', urgency: 'see-doctor-today' },
    },
    risk_factors: ['recent antibiotic use', 'diabetes', 'immunocompromised', 'denture use', 'inhaled steroid use'],
    red_flags: ['difficulty swallowing or breathing', 'spreading to esophagus with chest pain'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['leukoplakia'],
    recommendations: [
      'Use prescribed antifungal mouth rinse or lozenges',
      'Rinse mouth with warm salt water',
      'Clean dentures thoroughly and remove overnight',
      'Manage underlying diabetes if present',
      'See a doctor if it spreads or doesn\'t improve within a week of treatment',
    ],
  },

  {
    id: 'fungal_vaginal_candidiasis',
    name: 'Vaginal Candidiasis (Yeast Infection)',
    category: 'Infectious - Fungal',
    aliases: ['yeast infection', 'vaginal thrush'],
    symptoms: {
      primary: [
        { name: 'vaginal itching', weight: 0.85, description: 'Intense' },
        { name: 'vaginal discharge', weight: 0.7, description: 'Thick, white, cottage-cheese-like' },
      ],
      secondary: [
        { name: 'vaginal redness', weight: 0.4, description: '—' },
        { name: 'painful intercourse', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'no foul odor', weight: 0.4, description: 'Distinguishes from bacterial vaginosis which typically has odor' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-7 days with treatment', chronic: '> 4 episodes/year suggests recurrent candidiasis' },
    severity_levels: {
      mild: { description: 'Mild itching without discomfort', urgency: 'self-care' },
      moderate: { description: 'Significant itching and discharge', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe swelling, fissures, or recurrent infections', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['recent antibiotic use', 'diabetes', 'pregnancy', 'tight synthetic clothing', 'high-sugar diet'],
    red_flags: ['fever with pelvic pain', 'symptoms in pregnancy'],
    specialist: 'Gynecologist',
    india_prevalence: 'high',
    seasonal_pattern: 'summer',
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['bacterial_vaginosis', 'trichomoniasis'],
    recommendations: [
      'Use over-the-counter or prescribed antifungal cream/pessary',
      'Wear breathable cotton underwear',
      'Avoid scented soaps or douches in the genital area',
      'Manage blood sugar if diabetic',
      'See a gynecologist if symptoms recur more than 4 times a year',
    ],
  },

  {
    id: 'fungal_ringworm',
    name: 'Ringworm (Tinea Corporis)',
    category: 'Infectious - Fungal',
    aliases: ['tinea', 'dermatophytosis'],
    symptoms: {
      primary: [
        { name: 'ring-shaped rash', weight: 0.85, description: 'Circular, red, with a clearer center' },
        { name: 'itching', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'scaling', weight: 0.5, description: 'Border is typically raised and scaly' },
      ],
      differentiating: [
        { name: 'raised border', weight: 0.6, description: 'Border more active/raised than center' },
      ],
    },
    duration_patterns: { acute: null, typical: '2-4 weeks with treatment', chronic: '> 30 days if untreated or misdiagnosed' },
    severity_levels: {
      mild: { description: 'Single small patch', urgency: 'see-doctor-soon' },
      moderate: { description: 'Multiple or larger patches', urgency: 'see-doctor-soon' },
      severe: { description: 'Widespread infection not responding to OTC treatment', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['hot humid climate', 'contact with infected person or pet', 'shared clothing/towels', 'excessive sweating'],
    red_flags: ['widespread rapid spread', 'signs of secondary bacterial infection'],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['eczema', 'psoriasis', 'pityriasis_rosea'],
    recommendations: [
      'Apply topical antifungal cream twice daily for 2-4 weeks — continue even after visible clearing',
      'Keep the area dry — moisture promotes fungal growth',
      'Do not share towels, clothing, or footwear',
      'Wash bedding and clothes in hot water',
      'See a dermatologist if it doesn\'t improve after 2 weeks of treatment',
    ],
  },

  {
    id: 'fungal_athletes_foot',
    name: "Athlete's Foot (Tinea Pedis)",
    category: 'Infectious - Fungal',
    aliases: ['tinea pedis'],
    symptoms: {
      primary: [
        { name: 'itching between toes', weight: 0.85, description: '—' },
        { name: 'peeling skin on feet', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'burning sensation feet', weight: 0.4, description: '—' },
        { name: 'foul foot odor', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'cracked skin between toes', weight: 0.5, description: '—' },
        // This entry never reaches emergency-tier severity (max is
        // see-doctor-soon) — a matched red_flag always forces
        // urgency:'emergency' with no softer option, so ordinary secondary
        // infection signs belong here (raising score/confidence) rather
        // than in red_flags, which would over-escalate.
        { name: 'spreading redness with pus', weight: 0.6, description: 'Suggests secondary bacterial infection' },
      ],
    },
    duration_patterns: { acute: null, typical: '2-4 weeks with treatment', chronic: '> 30 days suggests recurrent/untreated infection' },
    severity_levels: {
      mild: { description: 'Mild itching between toes', urgency: 'self-care' },
      moderate: { description: 'Peeling and cracking with discomfort', urgency: 'see-doctor-soon' },
      severe: { description: 'Signs of secondary bacterial infection — spreading redness, pus', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['sweaty feet', 'closed footwear', 'public showers/pools', 'diabetes'],
    // "diabetic foot with any wound" is kept — a diabetic foot wound is
    // independently limb-threatening regardless of this entry's own ladder,
    // and was already a matchable, intentional red flag before this pass.
    // It's still the clinical noun-phrase form though, not how a patient
    // would actually type it — add the natural first-person phrasing too.
    red_flags: ['diabetic foot with any wound', 'i have diabetes and a wound on my foot', 'diabetic and i have a foot wound'],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['contact_dermatitis'],
    recommendations: [
      'Apply topical antifungal cream or powder daily',
      'Keep feet dry — change socks daily, use breathable footwear',
      'Wash and thoroughly dry feet, especially between toes',
      'Avoid walking barefoot in public showers or pools',
      'See a doctor if diabetic and any foot wound develops',
    ],
  },

  {
    id: 'fungal_jock_itch',
    name: 'Jock Itch (Tinea Cruris)',
    category: 'Infectious - Fungal',
    aliases: ['tinea cruris'],
    symptoms: {
      primary: [
        { name: 'groin itching', weight: 0.85, description: '—' },
        { name: 'groin rash', weight: 0.7, description: 'Red, well-demarcated border' },
      ],
      secondary: [
        { name: 'burning sensation groin', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'sparing of scrotum', weight: 0.4, description: 'Typically spares the scrotum, unlike candidiasis' },
      ],
    },
    duration_patterns: { acute: null, typical: '2-4 weeks with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Mild itching without spreading', urgency: 'self-care' },
      moderate: { description: 'Spreading rash with discomfort', urgency: 'see-doctor-soon' },
      severe: { description: 'Widespread with secondary infection', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['excessive sweating', 'tight clothing', 'obesity', 'hot humid climate'],
    red_flags: ['signs of secondary bacterial infection'],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: 'summer',
    age_relevance: 'adults',
    gender_relevance: 'male',
    similar_diseases: ['fungal_ringworm', 'contact_dermatitis'],
    recommendations: [
      'Apply topical antifungal cream twice daily',
      'Wear loose, breathable cotton underwear',
      'Keep the area clean and dry',
      'Avoid sharing towels or clothing',
      'See a dermatologist if it persists beyond 2 weeks of treatment',
    ],
  },

  {
    id: 'fungal_pneumonia_aspergillosis',
    name: 'Fungal Pneumonia / Aspergillosis',
    category: 'Infectious - Fungal',
    aliases: ['invasive aspergillosis'],
    symptoms: {
      primary: [
        { name: 'cough', weight: 0.7, description: 'Persistent' },
        { name: 'fever', weight: 0.6, description: '—' },
        { name: 'chest pain', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'shortness of breath', weight: 0.5, description: '—' },
        { name: 'fatigue', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'immunocompromised', weight: 0.7, description: 'Occurs mainly in immunocompromised individuals or those with chronic lung disease' },
        { name: 'hemoptysis', weight: 0.6, description: 'Coughing blood' },
      ],
    },
    duration_patterns: { acute: null, typical: 'weeks', chronic: '> 30 days chronic pulmonary aspergillosis' },
    severity_levels: {
      mild: { description: 'Mild cough in an immunocompromised patient', urgency: 'see-doctor-today' },
      moderate: { description: 'Fever with cough and chest pain', urgency: 'see-doctor-today' },
      severe: { description: 'Coughing blood or severe breathlessness', urgency: 'emergency' },
    },
    risk_factors: ['immunocompromised', 'chronic lung disease', 'recent chemotherapy', 'prolonged steroid use'],
    red_flags: ['coughing up blood', 'severe breathlessness', 'high fever in immunocompromised patient'],
    specialist: 'Pulmonologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_tuberculosis', 'bacterial_pneumonia'],
    recommendations: [
      'See a pulmonologist urgently, especially if immunocompromised',
      'Chest imaging and fungal culture/galactomannan testing are needed',
      'Antifungal therapy must be started promptly once confirmed',
      'Avoid exposure to dusty/moldy environments',
      'Seek emergency care for hemoptysis or severe breathlessness',
    ],
  },

  {
    id: 'fungal_histoplasmosis',
    name: 'Histoplasmosis',
    category: 'Infectious - Fungal',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.6, description: '—' },
        { name: 'cough', weight: 0.6, description: '—' },
        { name: 'fatigue', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'chest pain', weight: 0.3, description: '—' },
        { name: 'joint pain', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'exposure to bird or bat droppings', weight: 0.6, description: 'Caves, old buildings, poultry farms' },
      ],
    },
    duration_patterns: { acute: '< 14 days often self-limiting in healthy people', typical: '2-4 weeks', chronic: '> 30 days in chronic pulmonary form' },
    severity_levels: {
      mild: { description: 'Mild flu-like symptoms, often self-resolving', urgency: 'self-care' },
      moderate: { description: 'Persistent fever and cough', urgency: 'see-doctor-soon' },
      severe: { description: 'Disseminated infection in immunocompromised — high fever, weight loss, organ involvement', urgency: 'see-doctor-today' },
    },
    risk_factors: ['exposure to bird or bat droppings', 'caving/spelunking', 'immunocompromised', 'poultry or bat habitat exposure'],
    red_flags: ['severe breathlessness', 'disseminated symptoms in immunocompromised patient'],
    specialist: 'Infectious Disease Specialist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_tuberculosis', 'viral_influenza'],
    recommendations: [
      'Most healthy individuals recover without specific treatment',
      'See a doctor if symptoms persist beyond 2 weeks or worsen',
      'Immunocompromised patients need antifungal treatment and closer monitoring',
      'Avoid disturbing bird/bat droppings without a mask',
      'Seek prompt care for severe breathlessness or disseminated symptoms',
    ],
  },

  {
    id: 'fungal_nail_infection',
    name: 'Fungal Nail Infection (Onychomycosis)',
    category: 'Infectious - Fungal',
    aliases: ['onychomycosis'],
    symptoms: {
      primary: [
        { name: 'thickened nails', weight: 0.8, description: '—' },
        { name: 'discolored nails', weight: 0.7, description: 'Yellow, white, or brown' },
      ],
      secondary: [
        { name: 'brittle nails', weight: 0.4, description: '—' },
        { name: 'nail separation from bed', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'foul odor', weight: 0.3, description: '—' },
      ],
    },
    duration_patterns: { acute: null, typical: 'months of treatment needed', chronic: '> 90 days is typical for this condition' },
    severity_levels: {
      mild: { description: 'Mild discoloration of one nail', urgency: 'self-care' },
      moderate: { description: 'Multiple nails thickened and discolored', urgency: 'see-doctor-soon' },
      severe: { description: 'Painful nails affecting walking, or spreading infection in a diabetic', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['diabetes', 'poor circulation', 'nail trauma', 'communal showers', 'increasing age'],
    red_flags: ['painful, spreading infection in a diabetic foot'],
    specialist: 'Dermatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['psoriasis'],
    recommendations: [
      'See a dermatologist — oral antifungal therapy is often more effective than topical alone',
      'Keep nails trimmed short and dry',
      'Avoid nail polish which can trap moisture',
      'Disinfect nail clippers and footwear regularly',
      'Diabetics should monitor closely for any signs of spreading infection',
    ],
  },

  {
    id: 'fungal_tinea_versicolor',
    name: 'Tinea Versicolor',
    category: 'Infectious - Fungal',
    aliases: ['pityriasis versicolor'],
    symptoms: {
      primary: [
        { name: 'skin discoloration patches', weight: 0.8, description: 'Lighter or darker than surrounding skin' },
        { name: 'fine scaling', weight: 0.4, description: '—' },
      ],
      secondary: [
        { name: 'mild itching', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'chest and back distribution', weight: 0.5, description: 'Commonly affects trunk, shoulders, and upper arms' },
      ],
    },
    duration_patterns: { acute: null, typical: '2-4 weeks treatment, pigment change may take months to resolve', chronic: null },
    severity_levels: {
      mild: { description: 'Few small patches', urgency: 'self-care' },
      moderate: { description: 'Widespread patches', urgency: 'see-doctor-soon' },
      severe: { description: 'Not applicable — this is a cosmetic, non-serious condition', urgency: 'self-care' },
    },
    risk_factors: ['hot humid climate', 'oily skin', 'excessive sweating', 'weakened immunity'],
    red_flags: [],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: 'summer',
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['vitiligo', 'pityriasis_alba'],
    recommendations: [
      'Use antifungal shampoo (selenium sulfide or ketoconazole) as a body wash',
      'Apply topical antifungal cream for localized patches',
      'Pigment may take weeks to months to normalize even after fungus is cleared',
      'Keep skin dry and avoid excessive oiliness',
      'See a dermatologist if it recurs frequently',
    ],
  },
]

export default fungal

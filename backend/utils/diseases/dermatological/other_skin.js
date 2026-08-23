export const other_skin = [
  {
    id: 'dermatological_vitiligo',
    name: 'Vitiligo',
    category: 'Dermatological - Other',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'white patches on skin', weight: 0.9, description: 'Milk-white, well-defined borders' },
      ],
      secondary: [],
      differentiating: [
        { name: 'spreading white patches', weight: 0.5, description: 'Patches may enlarge or new ones appear over time' },
        // Moved out of red_flags: this entry never reaches beyond
        // see-doctor-soon, and this is purely a comorbidity note (vitiligo
        // is linked to autoimmune thyroid disease), not an emergency.
        { name: 'thyroid symptoms', weight: 0.3, description: 'Vitiligo is linked to autoimmune thyroid disease' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset and spread over months to years', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Small stable patches', urgency: 'see-doctor-soon' },
      moderate: { description: 'Multiple or enlarging patches', urgency: 'see-doctor-soon' },
      severe: { description: 'Rapidly spreading patches over weeks, or facial involvement', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['family history', 'autoimmune conditions', 'skin trauma'],
    red_flags: [],
    specialist: 'Dermatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['fungal_tinea_versicolor', 'dermatological_pityriasis_alba'],
    recommendations: [
      'See a dermatologist — Wood\'s lamp examination confirms the diagnosis',
      'Topical treatments are most effective when started early for small, stable patches',
      'Use high SPF sunscreen on white patches — they lack protective melanin and burn easily',
      'Narrow-band UVB phototherapy is effective for widespread vitiligo',
      'Rapidly spreading new patches should be evaluated urgently to start treatment early',
    ],
  },

  {
    id: 'dermatological_alopecia',
    name: 'Alopecia (Hair Loss)',
    category: 'Dermatological - Other',
    aliases: ['hair loss', 'baldness'],
    symptoms: {
      primary: [
        { name: 'hair loss', weight: 0.85, description: 'Gradual thinning or patchy loss' },
      ],
      secondary: [
        { name: 'scalp itching', weight: 0.2, description: 'If underlying scalp condition present' },
      ],
      differentiating: [
        { name: 'patchy hair loss', weight: 0.5, description: 'Sudden circular patches suggests alopecia areata rather than pattern baldness' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual over months, or sudden patches over weeks', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Mild thinning', urgency: 'self-care' },
      moderate: { description: 'Noticeable patchy or diffuse hair loss', urgency: 'see-doctor-soon' },
      severe: { description: 'Rapid extensive hair loss', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['family history', 'stress', 'hormonal changes', 'iron deficiency', 'thyroid disorders', 'autoimmune conditions'],
    red_flags: ['rapid extensive hair loss over days to weeks'],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['hypothyroidism', 'anemia_iron_deficiency'],
    recommendations: [
      'See a dermatologist to determine the underlying cause',
      'Check for iron deficiency and thyroid dysfunction with blood tests',
      'Avoid excessive heat styling and tight hairstyles',
      'Prescribed topical or oral treatments can help depending on the cause',
      'See a doctor promptly for rapid or extensive hair loss',
    ],
  },

  {
    id: 'dermatological_skin_tags',
    name: 'Skin Tags',
    category: 'Dermatological - Other',
    aliases: ['acrochordon'],
    symptoms: {
      primary: [
        { name: 'small skin growth', weight: 0.9, description: 'Soft, flesh-colored, on a stalk' },
      ],
      secondary: [],
      differentiating: [
        { name: 'located in skin folds', weight: 0.4, description: 'Neck, armpit, groin are common sites' },
      ],
    },
    duration_patterns: { acute: null, typical: 'benign, persistent unless removed', chronic: null },
    severity_levels: {
      mild: { description: 'Asymptomatic skin tag', urgency: 'self-care' },
      moderate: { description: 'Skin tag causing irritation from friction', urgency: 'see-doctor-soon' },
      severe: { description: 'Not applicable — skin tags are benign and harmless', urgency: 'self-care' },
    },
    risk_factors: ['obesity', 'diabetes', 'aging', 'friction in skin folds'],
    red_flags: [],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: [],
    recommendations: [
      'Skin tags are benign and do not require treatment unless bothersome',
      'A dermatologist can remove them easily if they catch on clothing or jewelry',
      'Do not attempt to remove them yourself at home',
      'Check blood sugar if you have multiple skin tags — associated with insulin resistance',
      'See a doctor if a growth changes rapidly in size, color, or shape — to confirm it is truly a skin tag',
    ],
  },

  {
    id: 'dermatological_keratosis',
    name: 'Seborrheic Keratosis',
    category: 'Dermatological - Other',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'skin growth', weight: 0.85, description: 'Waxy, "stuck-on" appearance, brown/black' },
      ],
      secondary: [
        { name: 'itching', weight: 0.2, description: 'Occasionally' },
      ],
      differentiating: [
        { name: 'stuck-on appearance', weight: 0.6, description: 'Looks like it could be peeled off, unlike a mole' },
      ],
    },
    duration_patterns: { acute: null, typical: 'benign, increases with age', chronic: null },
    severity_levels: {
      mild: { description: 'Single stable growth', urgency: 'self-care' },
      moderate: { description: 'Multiple growths', urgency: 'see-doctor-soon' },
      severe: { description: 'Rapidly changing appearance — needs evaluation to exclude melanoma', urgency: 'see-doctor-today' },
    },
    risk_factors: ['age over 50', 'family history', 'sun exposure'],
    red_flags: ['rapid change in size, color, or shape', 'bleeding or ulceration', 'irregular borders'],
    specialist: 'Dermatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_melanoma_warning'],
    recommendations: [
      'These growths are benign and usually need no treatment',
      'See a dermatologist for any new or changing skin growth to confirm the diagnosis',
      'Removal is possible if the growth is irritated by clothing or for cosmetic reasons',
      'Do not attempt to remove growths yourself',
      'See a doctor promptly for any growth that changes rapidly or bleeds',
    ],
  },

  {
    id: 'dermatological_melanoma_warning',
    name: 'Melanoma — Warning Signs (Awareness)',
    category: 'Dermatological - Other',
    aliases: ['skin cancer warning'],
    symptoms: {
      primary: [
        { name: 'changing mole', weight: 0.8, description: 'Asymmetric, irregular border, color change' },
      ],
      secondary: [
        { name: 'new mole in adulthood', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'asymmetric irregular mole', weight: 0.8, description: 'ABCDE criteria — Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolving' },
        { name: 'bleeding mole', weight: 0.7, description: 'Concerning feature warranting urgent evaluation' },
      ],
    },
    duration_patterns: { acute: null, typical: 'changes noticed over weeks to months', chronic: null },
    severity_levels: {
      mild: { description: 'A mole with one concerning feature — still needs evaluation', urgency: 'see-doctor-soon' },
      moderate: { description: 'A mole with multiple ABCDE features', urgency: 'see-doctor-today' },
      severe: { description: 'A bleeding, ulcerated, or rapidly growing mole', urgency: 'see-doctor-today' },
    },
    risk_factors: ['fair skin', 'excessive sun exposure/sunburn history', 'family history of melanoma', 'many moles'],
    red_flags: ['rapidly changing mole', 'bleeding or ulcerated mole', 'new mole in adulthood with irregular features'],
    specialist: 'Dermatologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_keratosis', 'dermatological_basal_cell_awareness'],
    recommendations: [
      'See a dermatologist promptly for any mole showing ABCDE warning signs',
      'This is informational only — a biopsy is needed to confirm any diagnosis',
      'Use sun protection to reduce risk — sunscreen, protective clothing',
      'Perform regular self-skin checks and note any new or changing moles',
      'Early detection significantly improves outcomes — do not delay evaluation',
    ],
  },

  {
    id: 'dermatological_basal_cell_awareness',
    name: 'Basal Cell Carcinoma — Awareness',
    category: 'Dermatological - Other',
    aliases: ['skin cancer awareness'],
    symptoms: {
      primary: [
        { name: 'persistent skin sore', weight: 0.7, description: 'Does not heal, may bleed or crust' },
      ],
      secondary: [
        { name: 'pearly skin bump', weight: 0.5, description: 'Shiny, translucent appearance' },
      ],
      differentiating: [
        { name: 'non-healing sore', weight: 0.7, description: 'Present for weeks to months without healing' },
      ],
    },
    duration_patterns: { acute: null, typical: 'slow growing over months', chronic: '> 30 days without healing warrants evaluation' },
    severity_levels: {
      mild: { description: 'Small persistent sore or bump', urgency: 'see-doctor-soon' },
      moderate: { description: 'Growing lesion that bleeds easily', urgency: 'see-doctor-today' },
      severe: { description: 'Large or invasive-appearing lesion', urgency: 'see-doctor-today' },
    },
    risk_factors: ['fair skin', 'excessive sun exposure', 'age over 50', 'history of sunburns'],
    red_flags: ['non-healing sore lasting more than 4 weeks', 'lesion that bleeds easily with minor trauma'],
    specialist: 'Dermatologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_melanoma_warning'],
    recommendations: [
      'See a dermatologist for any sore that does not heal within 4 weeks',
      'This is informational only — a biopsy is needed to confirm any diagnosis',
      'Use daily sun protection, especially on the face and exposed areas',
      'This type of skin cancer is highly treatable when caught early',
      'Perform regular self-skin checks, especially on sun-exposed areas',
    ],
  },
]

export default other_skin

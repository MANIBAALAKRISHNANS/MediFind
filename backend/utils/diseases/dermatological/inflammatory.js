export const inflammatory = [
  {
    id: 'dermatological_eczema',
    name: 'Eczema (Atopic Dermatitis)',
    category: 'Dermatological - Inflammatory',
    aliases: ['atopic dermatitis'],
    symptoms: {
      primary: [
        { name: 'itchy skin', weight: 0.85, description: 'Chronic, intense' },
        { name: 'dry skin patches', weight: 0.7, description: 'Especially flexural areas — behind knees, inside elbows' },
      ],
      secondary: [
        { name: 'skin thickening', weight: 0.4, description: 'From chronic scratching' },
      ],
      differentiating: [
        { name: 'flexural distribution', weight: 0.5, description: 'Behind knees, inside elbows is characteristic' },
        { name: 'personal or family history of allergies', weight: 0.4, description: 'Often linked with asthma/allergic rhinitis' },
        // Moved out of red_flags: entry's own max is see-doctor-today —
        // forcing 'emergency' would overstate what's usually a "see a
        // dermatologist promptly" situation.
        { name: 'infected eczema', weight: 0.5, description: '—' },
        { name: 'weeping eczema', weight: 0.5, description: '—' },
        { name: 'crusting skin with pain', weight: 0.5, description: '—' },
        { name: 'widespread blistering', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, with flares', chronic: '> 90 days recurrent symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild dry, itchy patches', urgency: 'see-doctor-soon' },
      moderate: { description: 'Widespread itchy rash affecting sleep', urgency: 'see-doctor-soon' },
      severe: { description: 'Infected eczema (weeping, crusting) or widespread blistering', urgency: 'see-doctor-today' },
    },
    risk_factors: ['family history of allergies/asthma', 'dry climate', 'harsh soaps', 'stress'],
    red_flags: [],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['fungal_ringworm', 'dermatological_psoriasis', 'parasitic_scabies'],
    recommendations: [
      'Moisturize heavily at least twice daily, within 3 minutes of bathing',
      'Use mild, fragrance-free soap and avoid hot baths',
      'Apply prescribed topical corticosteroids for flares as directed',
      'Wear soft cotton clothing — avoid synthetic fabrics and wool',
      'See a doctor for infected eczema (weeping, crusting) or widespread blistering',
    ],
  },

  {
    id: 'dermatological_psoriasis',
    name: 'Psoriasis',
    category: 'Dermatological - Inflammatory',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'skin plaques', weight: 0.85, description: 'Thick, red, with silvery scales' },
      ],
      secondary: [
        { name: 'itching', weight: 0.4, description: '—' },
        { name: 'joint pain', weight: 0.3, description: 'If psoriatic arthritis present' },
      ],
      differentiating: [
        { name: 'silvery scales', weight: 0.7, description: 'Distinctive scaling pattern' },
        { name: 'elbow and knee plaques', weight: 0.6, description: 'Classic distribution' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, lifelong with flares', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Small localized plaques', urgency: 'see-doctor-soon' },
      moderate: { description: 'Plaques covering multiple body areas', urgency: 'see-doctor-soon' },
      severe: { description: 'Widespread pustular/erythrodermic psoriasis or joint involvement', urgency: 'see-doctor-today' },
    },
    risk_factors: ['family history', 'stress', 'certain infections', 'obesity'],
    red_flags: ['sudden widespread pustular or erythrodermic flare', 'joint swelling and stiffness alongside skin disease'],
    specialist: 'Dermatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: 'winter',
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_eczema', 'fungal_ringworm', 'musculoskeletal_psoriatic_arthritis'],
    recommendations: [
      'See a dermatologist — clinical diagnosis is usually sufficient',
      'Apply prescribed topical corticosteroids and vitamin D analogues',
      'Moisturize heavily to reduce scaling and itching',
      'Avoid known triggers — stress, alcohol, certain infections',
      'See a rheumatologist if joint pain develops alongside skin symptoms',
    ],
  },

  {
    id: 'dermatological_contact_dermatitis',
    name: 'Contact Dermatitis',
    category: 'Dermatological - Inflammatory',
    aliases: ['allergic dermatitis'],
    symptoms: {
      primary: [
        { name: 'skin rash', weight: 0.8, description: 'At site of contact with irritant/allergen' },
        { name: 'itching', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'skin redness', weight: 0.5, description: '—' },
        { name: 'skin blisters', weight: 0.3, description: 'In severe cases' },
      ],
      differentiating: [
        { name: 'recent new product exposure', weight: 0.5, description: 'New soap, cosmetic, clothing, or plant contact' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '1-3 weeks after removing the trigger', chronic: '> 30 days if trigger persists' },
    severity_levels: {
      mild: { description: 'Localized mild rash', urgency: 'self-care' },
      moderate: { description: 'Widespread rash with significant itching', urgency: 'see-doctor-soon' },
      severe: { description: 'Facial or lip swelling with breathing difficulty (anaphylaxis)', urgency: 'emergency' },
    },
    risk_factors: ['new cosmetics/soaps', 'plant contact', 'jewelry (nickel allergy)', 'occupational chemical exposure'],
    red_flags: ['facial or lip swelling with breathing difficulty', 'rash spreading rapidly over the whole body'],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_eczema', 'allergy_food'],
    recommendations: [
      'Identify and avoid the trigger — review recent new products',
      'Apply calamine lotion or prescribed corticosteroid cream',
      'Take an antihistamine for itching',
      'Wash the area thoroughly if contact with an irritant just occurred',
      'Call emergency services immediately for facial/lip swelling with breathing difficulty',
    ],
  },

  {
    id: 'dermatological_seborrheic_dermatitis',
    name: 'Seborrheic Dermatitis',
    category: 'Dermatological - Inflammatory',
    aliases: ['dandruff', 'seborrhea'],
    symptoms: {
      primary: [
        { name: 'scalp flaking', weight: 0.8, description: 'Dandruff, greasy scales' },
        { name: 'itching', weight: 0.5, description: 'Scalp and affected areas' },
      ],
      secondary: [
        { name: 'skin redness', weight: 0.4, description: 'Face — nasolabial folds, eyebrows' },
      ],
      differentiating: [
        { name: 'greasy yellowish scales', weight: 0.5, description: 'Distinguishes from dry dandruff' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, with flares', chronic: '> 90 days recurrent symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild flaking', urgency: 'self-care' },
      moderate: { description: 'Significant flaking with redness', urgency: 'see-doctor-soon' },
      severe: { description: 'Widespread involvement affecting quality of life', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['stress', 'cold weather', 'oily skin', 'certain neurological conditions'],
    red_flags: [],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_psoriasis', 'parasitic_head_lice'],
    recommendations: [
      'Use an antidandruff/antifungal shampoo regularly',
      'Avoid excessive hair product use',
      'Apply prescribed topical treatment to affected facial areas if needed',
      'Manage stress, which can trigger flares',
      'See a dermatologist if over-the-counter treatments don\'t control symptoms',
    ],
  },

  {
    id: 'dermatological_rosacea',
    name: 'Rosacea',
    category: 'Dermatological - Inflammatory',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'facial redness', weight: 0.8, description: 'Central face — cheeks, nose, forehead' },
      ],
      secondary: [
        { name: 'visible blood vessels', weight: 0.4, description: 'On the face' },
        { name: 'facial bumps', weight: 0.4, description: 'Acne-like' },
      ],
      differentiating: [
        { name: 'flushing triggers', weight: 0.5, description: 'Worsens with spicy food, alcohol, heat, sun' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, progressive if untreated', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Occasional flushing', urgency: 'self-care' },
      moderate: { description: 'Persistent redness with visible vessels', urgency: 'see-doctor-soon' },
      severe: { description: 'Eye involvement (ocular rosacea) or significant skin thickening', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['fair skin', 'family history', 'sun exposure', 'spicy food/alcohol'],
    red_flags: ['eye irritation, redness, or vision changes'],
    specialist: 'Dermatologist',
    india_prevalence: 'low',
    seasonal_pattern: 'summer',
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['dermatological_acne'],
    recommendations: [
      'Identify and avoid personal triggers — spicy food, alcohol, extreme temperatures',
      'Use daily sun protection — a major trigger',
      'Apply prescribed topical treatments as directed',
      'Use gentle, fragrance-free skincare products',
      'See an ophthalmologist if eye irritation or redness develops',
    ],
  },

  {
    id: 'dermatological_acne',
    name: 'Acne Vulgaris',
    category: 'Dermatological - Inflammatory',
    aliases: ['acne', 'pimples'],
    symptoms: {
      primary: [
        { name: 'facial pimples', weight: 0.8, description: '—' },
        { name: 'blackheads', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'oily skin', weight: 0.4, description: '—' },
        { name: 'skin scarring', weight: 0.3, description: 'From severe/untreated acne' },
      ],
      differentiating: [
        { name: 'comedones', weight: 0.5, description: 'Blackheads and whiteheads present' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic during adolescence, may persist into adulthood', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Few comedones without inflammation', urgency: 'self-care' },
      moderate: { description: 'Inflammatory pimples, some scarring risk', urgency: 'see-doctor-soon' },
      severe: { description: 'Nodulocystic acne with high scarring risk', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['adolescence', 'hormonal changes', 'family history', 'high-glycemic diet', 'PCOS'],
    red_flags: ['severe painful nodulocystic acne', 'acne causing significant psychological distress'],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_rosacea', 'pcos'],
    recommendations: [
      'Wash face with a gentle cleanser twice daily',
      'Apply topical retinoid at night as prescribed — most evidence-based treatment',
      'Avoid scrubbing, picking, or squeezing — worsens scarring',
      'Use non-comedogenic sunscreen daily, especially if using retinoids',
      'See a dermatologist for moderate-severe acne to prevent scarring',
    ],
  },

  {
    id: 'dermatological_urticaria',
    name: 'Urticaria (Hives)',
    category: 'Dermatological - Inflammatory',
    aliases: ['hives'],
    symptoms: {
      primary: [
        { name: 'raised itchy welts', weight: 0.9, description: 'Come and go, can move around the body' },
      ],
      secondary: [
        { name: 'skin swelling', weight: 0.3, description: 'Localized' },
      ],
      differentiating: [
        { name: 'welts that resolve within 24 hours', weight: 0.6, description: 'Individual lesions typically fade within a day' },
      ],
    },
    duration_patterns: { acute: '< 42 days', typical: 'hours to days per episode', chronic: '> 42 days suggests chronic urticaria' },
    severity_levels: {
      mild: { description: 'A few isolated welts', urgency: 'self-care' },
      moderate: { description: 'Widespread welts with significant itching', urgency: 'see-doctor-soon' },
      severe: { description: 'Facial/throat swelling with breathing difficulty (anaphylaxis)', urgency: 'emergency' },
    },
    risk_factors: ['food allergy', 'medication allergy', 'infections', 'stress', 'cold/heat exposure'],
    red_flags: ['facial or throat swelling', 'difficulty breathing', 'dizziness or fainting alongside hives'],
    specialist: 'Allergist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_contact_dermatitis', 'allergy_angioedema'],
    recommendations: [
      'Take an antihistamine for itching and welts',
      'Try to identify and avoid the trigger — food, medication, or physical factor',
      'Apply a cool compress for symptomatic relief',
      'See an allergist if hives recur frequently (chronic urticaria)',
      'Call emergency services immediately for facial/throat swelling or breathing difficulty',
    ],
  },
]

export default inflammatory

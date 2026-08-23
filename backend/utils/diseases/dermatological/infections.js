// Cellulitis and impetigo are defined in infectious/bacterial.js; ringworm,
// athlete's foot, jock itch, and tinea versicolor in infectious/fungal.js —
// cross-reference from here rather than duplicating.
export const infections = [
  {
    id: 'dermatological_herpes_simplex',
    name: 'Herpes Simplex (Cold Sores)',
    category: 'Dermatological - Infections',
    aliases: ['cold sores', 'hsv'],
    symptoms: {
      primary: [
        { name: 'skin blisters', weight: 0.8, description: 'Clustered, small, painful, around lips/mouth' },
      ],
      secondary: [
        { name: 'itching', weight: 0.3, description: 'Before blisters appear (prodrome)' },
        { name: 'burning sensation', weight: 0.4, description: 'Tingling before outbreak' },
      ],
      differentiating: [
        { name: 'recurrent episodes', weight: 0.5, description: 'Tends to recur at the same site, often triggered by stress/illness' },
        // Moved out of red_flags: entry's own max is see-doctor-today (its
        // exact wording matches this scenario), so forcing 'emergency'
        // would overstate it.
        { name: 'spreading to the eye', weight: 0.5, description: 'Can threaten vision — needs prompt ophthalmology care' },
        { name: 'widespread outbreak in an immunocompromised person', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '7-10 days per outbreak', chronic: 'recurrent outbreaks over lifetime' },
    severity_levels: {
      mild: { description: 'Small localized cold sore', urgency: 'self-care' },
      moderate: { description: 'Larger or more painful outbreak', urgency: 'see-doctor-soon' },
      severe: { description: 'Spreading to eyes, or widespread in immunocompromised', urgency: 'see-doctor-today' },
    },
    risk_factors: ['stress', 'sun exposure', 'illness/fever', 'immunocompromised', 'menstruation'],
    red_flags: [],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_shingles', 'viral_hand_foot_mouth'],
    recommendations: [
      'Apply prescribed antiviral cream at the first sign of tingling',
      'Avoid touching the sore and then touching eyes or other areas',
      'Oral antiviral medication can reduce severity for frequent outbreaks',
      'Use sun protection on lips to prevent triggers',
      'See a doctor urgently if the sore spreads near or into the eye',
    ],
  },

  {
    id: 'dermatological_shingles',
    name: 'Shingles (Herpes Zoster)',
    category: 'Dermatological - Infections',
    aliases: ['herpes zoster'],
    symptoms: {
      primary: [
        { name: 'skin rash', weight: 0.85, description: 'Band-like, one-sided, follows a nerve pathway' },
        { name: 'burning sensation', weight: 0.7, description: 'Precedes and accompanies rash' },
      ],
      secondary: [
        { name: 'fever', weight: 0.3, description: 'Mild' },
        { name: 'fatigue', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'one-sided distribution', weight: 0.7, description: 'Rash strictly stays on one side, following a single nerve' },
      ],
    },
    duration_patterns: { acute: '< 21 days', typical: '2-4 weeks', chronic: 'postherpetic neuralgia can persist for months' },
    severity_levels: {
      mild: { description: 'Small localized rash on the trunk', urgency: 'see-doctor-soon' },
      moderate: { description: 'Painful rash affecting a larger area', urgency: 'see-doctor-today' },
      severe: { description: 'Rash affecting the eye or face, or in an immunocompromised person', urgency: 'emergency' },
    },
    risk_factors: ['age over 50', 'previous chickenpox infection', 'immunocompromised', 'stress'],
    red_flags: ['rash near or on the eye', 'facial rash with ear pain', 'widespread rash in immunocompromised person'],
    specialist: 'Dermatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['viral_chickenpox', 'neurological_trigeminal_neuralgia'],
    recommendations: [
      'See a doctor within 72 hours of rash onset — antiviral treatment is most effective when started early',
      'Take prescribed pain medication — nerve pain can be significant',
      'Keep the rash clean and covered to prevent spreading the virus to others',
      'Avoid contact with pregnant women and anyone who has never had chickenpox',
      'Seek emergency care immediately if the rash is near the eye — can threaten vision',
    ],
  },

  {
    id: 'dermatological_warts',
    name: 'Warts',
    category: 'Dermatological - Infections',
    aliases: ['verruca'],
    symptoms: {
      primary: [
        { name: 'skin growth', weight: 0.85, description: 'Rough, raised bump, often on hands/feet' },
      ],
      secondary: [
        { name: 'mild pain', weight: 0.2, description: 'If on pressure-bearing area like sole of foot' },
      ],
      differentiating: [
        { name: 'rough textured surface', weight: 0.5, description: 'Distinguishes from smooth moles/skin tags' },
      ],
    },
    duration_patterns: { acute: null, typical: 'may resolve spontaneously over months to years or persist', chronic: '> 90 days without resolution common' },
    severity_levels: {
      mild: { description: 'Single small wart', urgency: 'self-care' },
      moderate: { description: 'Multiple or spreading warts', urgency: 'see-doctor-soon' },
      severe: { description: 'Not applicable — warts are not a dangerous condition', urgency: 'self-care' },
    },
    risk_factors: ['direct skin contact with warts', 'public showers/pools barefoot', 'weakened immunity'],
    red_flags: [],
    specialist: 'Dermatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_molluscum'],
    recommendations: [
      'Over-the-counter salicylic acid treatments can help remove small warts',
      'Avoid picking or scratching warts — can spread them',
      'See a dermatologist for cryotherapy or other removal if they persist or spread',
      'Keep feet dry and wear footwear in public showers/pools to prevent plantar warts',
      'Most warts eventually resolve on their own, though this can take months to years',
    ],
  },

  {
    id: 'dermatological_molluscum',
    name: 'Molluscum Contagiosum',
    category: 'Dermatological - Infections',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'skin bumps', weight: 0.85, description: 'Small, pearly, with central dimple' },
      ],
      secondary: [
        { name: 'itching', weight: 0.3, description: 'Mild, around bumps' },
      ],
      differentiating: [
        { name: 'central dimple', weight: 0.6, description: 'Umbilicated center is characteristic' },
      ],
    },
    duration_patterns: { acute: null, typical: 'resolves over 6-12 months without treatment', chronic: '> 180 days without resolution is common' },
    severity_levels: {
      mild: { description: 'Few isolated bumps', urgency: 'self-care' },
      moderate: { description: 'Multiple spreading bumps', urgency: 'see-doctor-soon' },
      severe: { description: 'Widespread in an immunocompromised person', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['children', 'close skin contact', 'shared towels/bathing items', 'immunocompromised'],
    red_flags: [],
    specialist: 'Dermatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['dermatological_warts'],
    recommendations: [
      'Most cases resolve on their own within 6-12 months without treatment',
      'Avoid scratching or picking at the bumps — can spread them to other areas',
      'Avoid sharing towels or bathing items with others',
      'A dermatologist can remove lesions if they are persistent, numerous, or cosmetically bothersome',
      'See a doctor if lesions are widespread, especially if immunocompromised',
    ],
  },

  {
    id: 'dermatological_boils',
    name: 'Boils (Furuncles)',
    category: 'Dermatological - Infections',
    aliases: ['furuncle'],
    symptoms: {
      primary: [
        { name: 'painful skin lump', weight: 0.85, description: 'Red, swollen, often with a pus-filled center' },
      ],
      secondary: [
        { name: 'fever', weight: 0.2, description: 'If severe/multiple' },
      ],
      differentiating: [
        { name: 'pus-filled center', weight: 0.6, description: 'Distinguishes from other skin lumps' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '1-2 weeks with treatment', chronic: 'recurrent boils suggest carrier state or underlying condition' },
    severity_levels: {
      mild: { description: 'Single small boil', urgency: 'self-care' },
      moderate: { description: 'Larger boil or multiple boils', urgency: 'see-doctor-soon' },
      severe: { description: 'Fever with multiple boils, or a boil on the face (risk of spread)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['diabetes', 'poor hygiene', 'skin friction/sweating', 'immunocompromised', 'recurrent skin colonization'],
    red_flags: ['fever with multiple boils', 'boil on the face with spreading redness', 'signs of spreading infection'],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: 'summer',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_cellulitis'],
    recommendations: [
      'Apply warm compresses several times a day to encourage drainage',
      'Do not squeeze or pop the boil — can spread the infection',
      'See a doctor if it is large, painful, or not improving — may need drainage',
      'Take prescribed antibiotics if directed, especially for facial boils or fever',
      'Manage underlying diabetes if present — increases risk of recurrent boils',
    ],
  },
]

export default infections

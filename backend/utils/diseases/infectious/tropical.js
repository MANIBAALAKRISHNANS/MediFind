// Tropical diseases prevalent in India. Dengue and Chikungunya are defined
// in ./viral.js, and Malaria + Kala-azar in ./parasitic.js — see those files
// rather than duplicating entries here.
export const tropical = [
  {
    id: 'tropical_japanese_encephalitis',
    name: 'Japanese Encephalitis',
    category: 'Infectious - Tropical',
    aliases: ['je'],
    symptoms: {
      primary: [
        { name: 'high fever', weight: 0.85, description: 'Sudden onset' },
        { name: 'severe headache', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'vomiting', weight: 0.4, description: '—' },
        { name: 'neck stiffness', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'seizure', weight: 0.8, description: 'Common presenting feature, especially in children' },
        { name: 'confusion', weight: 0.7, description: 'Altered consciousness suggests brain involvement' },
      ],
    },
    duration_patterns: { acute: '< 7 days onset', typical: '5-14 days acute illness', chronic: 'neurological deficits can be permanent' },
    severity_levels: {
      mild: { description: 'This condition has no truly mild presentation — always treat as an emergency once suspected', urgency: 'emergency' },
      moderate: { description: 'Fever with headache and neck stiffness', urgency: 'emergency' },
      severe: { description: 'Seizures, confusion, or coma', urgency: 'emergency' },
    },
    risk_factors: ['mosquito exposure', 'rural area near rice paddies/pig farming', 'monsoon season', 'unvaccinated child'],
    red_flags: ['seizures', 'confusion or altered consciousness', 'neck stiffness with fever', 'weakness or paralysis'],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: 'monsoon',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_meningitis', 'central_meningitis_viral'],
    recommendations: [
      'Go to the hospital immediately — this is a medical emergency',
      'Supportive care in hospital is essential; there is no specific antiviral cure',
      'JE vaccination is available and recommended in endemic areas',
      'Use mosquito nets and repellents, especially near rice paddies/livestock',
      'Rehabilitation may be needed for neurological deficits after recovery',
    ],
  },

  {
    id: 'tropical_scrub_typhus',
    name: 'Scrub Typhus',
    category: 'Infectious - Tropical',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'high fever', weight: 0.85, description: 'Sudden onset' },
        { name: 'headache', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'rash', weight: 0.4, description: 'May appear with fever' },
        { name: 'muscle pain', weight: 0.4, description: '—' },
        { name: 'lymph node swelling', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'eschar', weight: 0.8, description: 'Painless black scab at the mite bite site — highly characteristic' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '1-2 weeks with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Fever with visible eschar, no organ involvement', urgency: 'see-doctor-today' },
      moderate: { description: 'Fever with rash and lymph node swelling', urgency: 'see-doctor-today' },
      severe: { description: 'Multi-organ involvement, confusion, or breathing difficulty', urgency: 'emergency' },
    },
    risk_factors: ['rural/forest/farm exposure', 'mite exposure', 'monsoon and post-monsoon season'],
    red_flags: ['confusion or encephalitis', 'breathing difficulty', 'no improvement after 48 hours of treatment', 'multi-organ failure signs'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: 'post-monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_dengue', 'bacterial_typhoid', 'malaria'],
    recommendations: [
      'See a doctor urgently — doxycycline is life-saving and should start promptly',
      'Check the entire body for an eschar (black scab), especially skin folds',
      'Wear protective clothing when working in fields or forests',
      'Untreated scrub typhus can have significant mortality — do not delay treatment',
      'Seek emergency care if no improvement within 48 hours of starting antibiotics',
    ],
  },

  {
    id: 'tropical_nipah_awareness',
    name: 'Nipah Virus Infection (Awareness)',
    category: 'Infectious - Tropical',
    aliases: ['nipah'],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.8, description: 'Sudden onset' },
        { name: 'severe headache', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'vomiting', weight: 0.4, description: '—' },
        { name: 'drowsiness', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'confusion', weight: 0.8, description: 'Rapid progression to altered consciousness is characteristic' },
        { name: 'bat or pig exposure', weight: 0.6, description: 'Contact with infected bats, pigs, or their body fluids/fruit contaminated by bats' },
      ],
    },
    duration_patterns: { acute: '< 14 days incubation', typical: 'rapid progression over days', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always treat suspected cases as an emergency', urgency: 'emergency' },
      moderate: { description: 'Fever with severe headache in an exposure area/season', urgency: 'emergency' },
      severe: { description: 'Confusion, seizures, or coma — encephalitis', urgency: 'emergency' },
    },
    risk_factors: ['bat or pig exposure', 'consuming unwashed fallen fruit or raw date palm sap', 'outbreak area (Kerala)', 'healthcare worker contact with a case'],
    red_flags: ['confusion or altered consciousness', 'seizures', 'rapid deterioration', 'any fever during a declared local outbreak'],
    specialist: 'Infectious Disease Specialist',
    india_prevalence: 'rare',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['tropical_japanese_encephalitis', 'bacterial_meningitis'],
    recommendations: [
      'Go to the hospital immediately if you have fever with confusion during a known outbreak or after bat/pig exposure',
      'Avoid consuming raw date palm sap or fallen fruit that may be contaminated by bats',
      'Strict isolation and infection control are critical — Nipah can spread person-to-person',
      'This is informational only — Nipah outbreaks require immediate public health involvement',
      'Report suspected cases to local health authorities without delay',
    ],
  },

  {
    id: 'tropical_plague',
    name: 'Plague (Awareness)',
    category: 'Infectious - Tropical',
    aliases: ['bubonic plague'],
    symptoms: {
      primary: [
        { name: 'high fever', weight: 0.85, description: 'Sudden onset with chills' },
        { name: 'lymph node swelling', weight: 0.8, description: 'Painful, swollen lymph nodes ("buboes")' },
      ],
      secondary: [
        { name: 'headache', weight: 0.4, description: '—' },
        { name: 'weakness', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'flea or rodent exposure', weight: 0.6, description: 'Transmitted by fleas from infected rodents' },
        { name: 'cough with blood', weight: 0.7, description: 'Suggests pneumonic plague — highly contagious and severe' },
      ],
    },
    duration_patterns: { acute: '< 7 days onset can be rapid', typical: '1-2 weeks with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always treat as an emergency once suspected', urgency: 'emergency' },
      moderate: { description: 'Fever with painful swollen lymph node', urgency: 'emergency' },
      severe: { description: 'Cough with blood, breathing difficulty, or shock — pneumonic/septicemic plague', urgency: 'emergency' },
    },
    risk_factors: ['rodent or flea exposure', 'rural/forest area with rodent activity', 'outbreak area'],
    red_flags: ['cough with blood', 'breathing difficulty', 'painful swollen lymph node with high fever', 'signs of shock'],
    specialist: 'Infectious Disease Specialist',
    india_prevalence: 'rare',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_cellulitis', 'lymph_node_tuberculosis'],
    recommendations: [
      'Go to the hospital immediately — plague is treatable with prompt antibiotics but fatal if delayed',
      'Avoid contact with rodents and fleas; control rodent populations around homes',
      'Pneumonic plague requires strict respiratory isolation — it spreads person-to-person',
      'Report suspected cases to public health authorities immediately',
      'Close contacts of a confirmed case may need preventive antibiotics',
    ],
  },
]

export default tropical

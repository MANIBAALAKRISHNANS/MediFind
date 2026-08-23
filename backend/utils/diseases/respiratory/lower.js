// Pneumonia is defined once in infectious/bacterial.js (bacterial_pneumonia)
// as it's most commonly bacterial in origin — cross-reference from here.
export const lower = [
  {
    id: 'respiratory_acute_bronchitis',
    name: 'Acute Bronchitis',
    category: 'Respiratory - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'productive cough', weight: 0.8, description: 'With mucus/phlegm' },
        { name: 'chest congestion', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'mild fever', weight: 0.3, description: '—' },
        { name: 'fatigue', weight: 0.3, description: '—' },
        { name: 'wheezing', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'recent cold', weight: 0.4, description: 'Usually follows a viral upper respiratory infection' },
      ],
    },
    duration_patterns: { acute: '< 10 days', typical: '10-20 days, cough may linger', chronic: '> 21 days warrants further evaluation' },
    severity_levels: {
      mild: { description: 'Productive cough without breathing difficulty', urgency: 'self-care' },
      moderate: { description: 'Persistent cough with chest discomfort', urgency: 'see-doctor-soon' },
      severe: { description: 'Breathing difficulty, high fever, or blood in sputum', urgency: 'see-doctor-today' },
    },
    risk_factors: ['recent viral infection', 'smoking', 'air pollution exposure', 'winter/monsoon season'],
    red_flags: ['breathing rate above 25/min', 'coughing up blood', 'fever above 103°F', 'chest pain while breathing'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_pneumonia', 'asthma', 'bacterial_tuberculosis'],
    recommendations: [
      'Most acute bronchitis is viral — antibiotics usually aren\'t needed',
      'Use steam inhalation 3-4 times daily to loosen mucus',
      'Stay hydrated with at least 2 litres of warm fluids daily',
      'Rest and avoid smoke exposure',
      'See a doctor if cough persists beyond 3 weeks or you cough up blood',
    ],
  },

  {
    id: 'respiratory_chronic_bronchitis',
    name: 'Chronic Bronchitis',
    category: 'Respiratory - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'productive cough', weight: 0.85, description: 'Present most days for at least 3 months in 2 consecutive years' },
        { name: 'shortness of breath', weight: 0.6, description: 'Progressive over time' },
      ],
      secondary: [
        { name: 'wheezing', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'smoking history', weight: 0.6, description: 'Major risk factor, though biomass smoke exposure also common in India' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, defined by 3 months of symptoms per year', chronic: '> 90 days per year is diagnostic' },
    severity_levels: {
      mild: { description: 'Cough on most days without significant breathlessness', urgency: 'see-doctor-soon' },
      moderate: { description: 'Cough with breathlessness on exertion', urgency: 'see-doctor-soon' },
      severe: { description: 'Breathlessness at rest, bluish lips, or exacerbation with fever', urgency: 'emergency' },
    },
    risk_factors: ['smoking', 'biomass fuel/cooking smoke exposure', 'air pollution exposure', 'occupational dust exposure'],
    red_flags: ['breathlessness at rest', 'bluish lips or fingertips', 'confusion', 'coughing up blood'],
    specialist: 'Pulmonologist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['copd', 'bacterial_tuberculosis'],
    recommendations: [
      'Quit smoking immediately — the single most effective intervention',
      'See a pulmonologist for spirometry testing',
      'Get annual influenza and pneumococcal vaccination',
      'Use prescribed inhalers as directed',
      'Reduce exposure to biomass smoke and air pollution where possible',
    ],
  },

  {
    id: 'respiratory_bronchiolitis',
    name: 'Bronchiolitis',
    category: 'Respiratory - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'wheezing', weight: 0.8, description: 'In an infant' },
        { name: 'cough', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'nasal congestion', weight: 0.4, description: '—' },
        { name: 'mild fever', weight: 0.3, description: '—' },
        { name: 'poor feeding', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'infant age', weight: 0.6, description: 'Occurs almost exclusively in children under 2 years' },
      ],
    },
    duration_patterns: { acute: '< 10 days', typical: '1-2 weeks', chronic: null },
    severity_levels: {
      mild: { description: 'Mild wheeze, feeding normally', urgency: 'see-doctor-soon' },
      moderate: { description: 'Wheeze with mild breathing difficulty', urgency: 'see-doctor-today' },
      severe: { description: 'Rapid breathing, retractions, poor feeding, or bluish lips', urgency: 'emergency' },
    },
    risk_factors: ['infant under 2 years', 'winter season', 'daycare exposure', 'premature birth', 'secondhand smoke exposure'],
    red_flags: ['rapid or labored breathing', 'bluish lips or face', 'poor feeding with dehydration', 'lethargy', 'pauses in breathing'],
    specialist: 'Pediatrician',
    india_prevalence: 'moderate',
    seasonal_pattern: 'winter',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['viral_rsv', 'asthma'],
    recommendations: [
      'Keep the infant well hydrated with frequent small feeds',
      'Use a bulb syringe and saline drops to clear nasal congestion before feeds',
      'Avoid smoke exposure around the infant',
      'Monitor breathing rate and effort closely',
      'Seek emergency care immediately for rapid breathing, retractions, or bluish lips',
    ],
  },

  {
    id: 'respiratory_pleurisy',
    name: 'Pleurisy (Pleuritis)',
    category: 'Respiratory - Lower',
    aliases: ['pleuritis'],
    symptoms: {
      primary: [
        { name: 'sharp chest pain', weight: 0.85, description: 'Worse with breathing or coughing' },
      ],
      secondary: [
        { name: 'shortness of breath', weight: 0.4, description: 'Due to shallow breathing from pain' },
        { name: 'fever', weight: 0.3, description: 'If infectious cause' },
      ],
      differentiating: [
        { name: 'pain worse with breathing', weight: 0.7, description: 'Pleuritic quality distinguishes from other chest pain' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: 'depends on underlying cause', chronic: null },
    severity_levels: {
      mild: { description: 'Mild pain with deep breaths', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant pain limiting breathing', urgency: 'see-doctor-today' },
      severe: { description: 'Severe breathlessness, high fever, or suspected pulmonary embolism', urgency: 'emergency' },
    },
    risk_factors: ['recent respiratory infection', 'autoimmune disease', 'recent surgery or immobility (PE risk)'],
    red_flags: ['sudden severe breathlessness', 'coughing blood', 'sudden calf swelling', 'high fever with chest pain'],
    specialist: 'Pulmonologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['pulmonary_embolism', 'bacterial_pneumonia', 'pericarditis'],
    recommendations: [
      'See a doctor promptly to determine the underlying cause',
      'Chest X-ray and blood tests are usually needed',
      'Take prescribed anti-inflammatory medication for pain relief',
      'Rest and avoid strenuous activity until evaluated',
      'Seek emergency care for sudden severe breathlessness or calf swelling',
    ],
  },

  {
    id: 'respiratory_lung_abscess',
    name: 'Lung Abscess',
    category: 'Respiratory - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'productive cough', weight: 0.8, description: 'Foul-smelling sputum' },
        { name: 'fever', weight: 0.7, description: 'High, with chills' },
      ],
      secondary: [
        { name: 'chest pain', weight: 0.4, description: '—' },
        { name: 'weight loss', weight: 0.4, description: '—' },
        { name: 'night sweats', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'foul-smelling sputum', weight: 0.7, description: 'Highly suggestive of anaerobic lung abscess' },
      ],
    },
    duration_patterns: { acute: null, typical: 'weeks of symptoms before diagnosis common', chronic: '> 42 days without improvement suggests chronic abscess' },
    severity_levels: {
      mild: { description: 'Cough and low fever', urgency: 'see-doctor-today' },
      moderate: { description: 'Foul sputum with persistent fever', urgency: 'see-doctor-today' },
      severe: { description: 'Coughing blood, severe breathlessness, or sepsis signs', urgency: 'emergency' },
    },
    risk_factors: ['poor dental hygiene', 'alcohol use with risk of aspiration', 'swallowing difficulty', 'recent pneumonia'],
    red_flags: ['coughing up blood', 'severe breathlessness', 'confusion with rapid heart rate'],
    specialist: 'Pulmonologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_tuberculosis', 'bacterial_pneumonia'],
    recommendations: [
      'See a pulmonologist urgently — chest imaging is needed to confirm',
      'Complete a prolonged course of prescribed antibiotics as directed',
      'Improve dental hygiene to reduce aspiration risk',
      'Drainage procedures may be needed in some cases',
      'Seek emergency care for coughing blood or severe breathlessness',
    ],
  },

  {
    id: 'respiratory_empyema',
    name: 'Empyema',
    category: 'Respiratory - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'chest pain', weight: 0.7, description: 'Pleuritic, worse with breathing' },
        { name: 'fever', weight: 0.75, description: 'Persistent despite antibiotics for pneumonia' },
      ],
      secondary: [
        { name: 'shortness of breath', weight: 0.5, description: '—' },
        { name: 'productive cough', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'persistent fever despite treatment', weight: 0.7, description: 'Fever not resolving with pneumonia treatment suggests empyema' },
      ],
    },
    duration_patterns: { acute: null, typical: 'complication of pneumonia, days to weeks', chronic: null },
    severity_levels: {
      mild: { description: 'This condition usually requires hospital-level care once suspected', urgency: 'see-doctor-today' },
      moderate: { description: 'Persistent fever and chest pain after pneumonia treatment', urgency: 'emergency' },
      severe: { description: 'Severe breathlessness or sepsis signs', urgency: 'emergency' },
    },
    risk_factors: ['recent or inadequately treated pneumonia', 'immunocompromised', 'diabetes'],
    red_flags: ['severe breathlessness', 'signs of sepsis', 'persistent high fever despite antibiotics'],
    specialist: 'Pulmonologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_pleurisy', 'bacterial_pneumonia'],
    recommendations: [
      'Go to the hospital promptly — this usually requires drainage plus IV antibiotics',
      'Complete the full course of hospital-directed treatment',
      'Follow up imaging is needed to confirm resolution',
      'Report worsening breathlessness or fever immediately',
      'Address the underlying pneumonia adequately to prevent recurrence',
    ],
  },
]

export default lower

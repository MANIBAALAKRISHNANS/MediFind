export const chronic = [
  {
    id: 'respiratory_asthma',
    name: 'Asthma',
    category: 'Respiratory - Chronic',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'wheezing', weight: 0.85, description: 'Whistling sound while breathing' },
        { name: 'shortness of breath', weight: 0.75, description: 'Episodic, often triggered' },
      ],
      secondary: [
        { name: 'chest tightness', weight: 0.5, description: '—' },
        { name: 'cough', weight: 0.4, description: 'Often worse at night' },
      ],
      differentiating: [
        { name: 'symptoms triggered by allergens', weight: 0.5, description: 'Worsens with dust, cold air, exercise, or strong smells' },
      ],
    },
    duration_patterns: { acute: 'acute exacerbation < 24 hours', typical: 'episodic, chronic condition', chronic: '> 90 days of recurrent episodes typical' },
    severity_levels: {
      mild: { description: 'Occasional wheeze relieved by inhaler', urgency: 'self-care' },
      moderate: { description: 'Frequent wheeze and breathlessness affecting activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe breathlessness preventing speech, reliever inhaler not helping', urgency: 'emergency' },
    },
    risk_factors: ['family history of asthma/allergies', 'air pollution exposure', 'dust exposure', 'cold weather', 'respiratory infections'],
    red_flags: ['severe breathlessness preventing speech', 'bluish lips or fingernails', 'reliever inhaler giving no relief', 'breathing rate above 30/min'],
    specialist: 'Pulmonologist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['copd', 'allergic_rhinitis', 'respiratory_bronchiolitis'],
    recommendations: [
      'Use your prescribed reliever inhaler when wheezing or breathless',
      'See a pulmonologist for a long-term management plan including a preventer inhaler',
      'Avoid known triggers — dust, smoke, cold air, strong smells',
      'Check air quality index and stay indoors on high-pollution days',
      'Go to the emergency room immediately if breathing is severely labored or the inhaler isn\'t helping',
    ],
  },

  {
    id: 'respiratory_copd',
    name: 'COPD (Chronic Obstructive Pulmonary Disease)',
    category: 'Respiratory - Chronic',
    aliases: ['emphysema'],
    symptoms: {
      primary: [
        { name: 'chronic cough', weight: 0.8, description: 'Present for years, often with sputum' },
        { name: 'shortness of breath', weight: 0.8, description: 'Progressive, worse on exertion' },
      ],
      secondary: [
        { name: 'wheezing', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'smoking history', weight: 0.6, description: 'Major risk factor; biomass smoke exposure equally important in India' },
        { name: 'breathless walking', weight: 0.6, description: 'Progressive exertional breathlessness over years' },
      ],
    },
    duration_patterns: { acute: 'exacerbation days', typical: 'chronic, progressive over years', chronic: '> 365 days typical disease course' },
    severity_levels: {
      mild: { description: 'Breathlessness only with significant exertion', urgency: 'see-doctor-soon' },
      moderate: { description: 'Breathlessness with routine activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Breathlessness at rest, oxygen saturation below 90%, confusion (exacerbation)', urgency: 'emergency' },
    },
    risk_factors: ['smoking', 'biomass fuel/cooking smoke exposure', 'occupational dust exposure', 'age over 40'],
    red_flags: ['oxygen saturation below 90%', 'blue lips or fingertips', 'confusion', 'sudden worsening breathlessness with increased sputum'],
    specialist: 'Pulmonologist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_asthma', 'respiratory_chronic_bronchitis', 'heart_failure'],
    recommendations: [
      'Quit smoking immediately — the single most effective way to slow progression',
      'See a pulmonologist for spirometry testing and staging',
      'Use prescribed inhalers daily without missing doses',
      'Get annual influenza and pneumococcal vaccination',
      'Seek emergency care for sudden worsening breathlessness or oxygen saturation below 90%',
    ],
  },

  {
    id: 'respiratory_pulmonary_fibrosis',
    name: 'Pulmonary Fibrosis',
    category: 'Respiratory - Chronic',
    aliases: ['ipf'],
    symptoms: {
      primary: [
        { name: 'shortness of breath', weight: 0.8, description: 'Progressive, worsening over months to years' },
        { name: 'dry cough', weight: 0.6, description: 'Persistent' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'weight loss', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'gradual worsening breathlessness', weight: 0.6, description: 'Slowly progressive over months to years, distinguishing from acute causes' },
      ],
    },
    duration_patterns: { acute: null, typical: 'progressive over months to years', chronic: '> 90 days of progressive breathlessness typical' },
    severity_levels: {
      mild: { description: 'Breathlessness only with significant exertion', urgency: 'see-doctor-soon' },
      moderate: { description: 'Breathlessness with routine activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Breathlessness at rest, low oxygen saturation', urgency: 'emergency' },
    },
    risk_factors: ['age over 60', 'smoking history', 'occupational dust exposure', 'family history'],
    red_flags: ['rapid worsening of breathlessness', 'oxygen saturation dropping significantly', 'bluish lips'],
    specialist: 'Pulmonologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_copd', 'heart_failure', 'bacterial_tuberculosis'],
    recommendations: [
      'See a pulmonologist for high-resolution CT and lung function testing',
      'Pulmonary rehabilitation can improve quality of life',
      'Avoid smoking and occupational dust exposure',
      'Get annual influenza and pneumococcal vaccination',
      'Discuss antifibrotic medications and, in advanced cases, oxygen therapy with your doctor',
    ],
  },

  {
    id: 'respiratory_bronchiectasis',
    name: 'Bronchiectasis',
    category: 'Respiratory - Chronic',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'chronic productive cough', weight: 0.85, description: 'Large amounts of sputum daily' },
        { name: 'recurrent chest infections', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'shortness of breath', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'coughing up blood', weight: 0.5, description: 'Common due to damaged airway blood vessels' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, with recurrent flares', chronic: '> 90 days is typical presentation' },
    severity_levels: {
      mild: { description: 'Cough with sputum, infrequent flares', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent chest infections requiring antibiotics', urgency: 'see-doctor-soon' },
      severe: { description: 'Massive hemoptysis or severe breathlessness during flare', urgency: 'emergency' },
    },
    risk_factors: ['history of severe childhood lung infections', 'bacterial_tuberculosis history', 'immunodeficiency'],
    red_flags: ['coughing up large amounts of blood', 'severe breathlessness', 'high fever with worsening cough'],
    specialist: 'Pulmonologist',
    india_prevalence: 'moderate',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_copd', 'bacterial_tuberculosis'],
    recommendations: [
      'See a pulmonologist for CT chest and sputum culture',
      'Airway clearance techniques (chest physiotherapy) help remove sputum',
      'Complete antibiotic courses promptly during flares',
      'Get annual influenza and pneumococcal vaccination',
      'Seek emergency care for coughing up significant amounts of blood',
    ],
  },

  {
    id: 'respiratory_sleep_apnea',
    name: 'Obstructive Sleep Apnea',
    category: 'Respiratory - Chronic',
    aliases: ['osa'],
    symptoms: {
      primary: [
        { name: 'loud snoring', weight: 0.8, description: '—' },
        { name: 'daytime sleepiness', weight: 0.7, description: 'Excessive, despite adequate sleep hours' },
      ],
      secondary: [
        { name: 'morning headache', weight: 0.4, description: '—' },
        { name: 'poor concentration', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'witnessed breathing pauses', weight: 0.8, description: 'Partner reports pauses in breathing during sleep' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic condition', chronic: '> 90 days typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Mild snoring with occasional daytime tiredness', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent witnessed apneas with significant daytime sleepiness', urgency: 'see-doctor-soon' },
      severe: { description: 'Sleepiness causing accidents or severe cardiovascular complications', urgency: 'see-doctor-today' },
    },
    risk_factors: ['obesity', 'male gender', 'large neck circumference', 'alcohol use before bed', 'family history'],
    red_flags: ['daytime sleepiness causing accidents', 'new heart rhythm problems', 'worsening hypertension despite medication'],
    specialist: 'ENT Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['insomnia', 'hypothyroidism'],
    recommendations: [
      'See a sleep specialist for a polysomnography (sleep study)',
      'CPAP therapy is the gold-standard treatment for moderate-severe cases',
      'Weight loss significantly reduces severity, even a 10% reduction helps',
      'Avoid alcohol and sedatives before bed',
      'Sleep on your side rather than your back',
    ],
  },

  {
    id: 'respiratory_sarcoidosis',
    name: 'Sarcoidosis',
    category: 'Respiratory - Chronic',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'dry cough', weight: 0.6, description: 'Persistent' },
        { name: 'shortness of breath', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.5, description: '—' },
        { name: 'joint pain', weight: 0.3, description: '—' },
        { name: 'lymph node swelling', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'skin nodules', weight: 0.5, description: 'Erythema nodosum or skin lesions can accompany' },
      ],
    },
    duration_patterns: { acute: null, typical: 'variable, can resolve or become chronic', chronic: '> 730 days for chronic form' },
    severity_levels: {
      mild: { description: 'Mild cough and fatigue, often found incidentally', urgency: 'see-doctor-soon' },
      moderate: { description: 'Persistent symptoms affecting daily life', urgency: 'see-doctor-soon' },
      severe: { description: 'Significant breathlessness or heart/eye involvement', urgency: 'see-doctor-today' },
    },
    risk_factors: ['age 20-40', 'family history', 'certain occupational exposures'],
    red_flags: ['significant breathlessness', 'irregular heartbeat', 'vision changes', 'severe fatigue with weight loss'],
    specialist: 'Pulmonologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_tuberculosis', 'lymphoma_warning'],
    recommendations: [
      'See a pulmonologist for chest imaging and possible biopsy',
      'Many mild cases resolve spontaneously and just need monitoring',
      'Corticosteroids may be prescribed for more significant disease',
      'Regular eye and heart screening is recommended given possible organ involvement',
      'Seek prompt care for new breathlessness or irregular heartbeat',
    ],
  },
]

export default chronic

export const thyroid = [
  {
    id: 'hypothyroidism',
    name: 'Hypothyroidism',
    category: 'Endocrine - Thyroid',
    aliases: ['underactive thyroid'],
    symptoms: {
      primary: [
        { name: 'weight gain', weight: 0.6, description: 'Despite no change in diet' },
        { name: 'fatigue', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'cold intolerance', weight: 0.5, description: '—' },
        { name: 'constipation', weight: 0.4, description: '—' },
        { name: 'dry skin', weight: 0.4, description: '—' },
        { name: 'hair loss', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'puffy face', weight: 0.4, description: 'Periorbital and facial swelling' },
        { name: 'hoarse voice', weight: 0.4, description: '—' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over months', chronic: '> 90 days of symptoms typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Mild fatigue and weight gain', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant symptoms affecting quality of life', urgency: 'see-doctor-soon' },
      severe: { description: 'Extreme lethargy, confusion, or very low body temperature (myxedema coma)', urgency: 'emergency' },
    },
    risk_factors: ['female gender', 'family history', 'autoimmune conditions', 'previous thyroid surgery/radiation'],
    red_flags: ['extreme lethargy or confusion', 'rapidly enlarging neck swelling', 'severe difficulty swallowing or breathing', 'hypothyroidism in pregnancy'],
    specialist: 'Endocrinologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['depression_screening', 'anemia_iron_deficiency', 'fibromyalgia'],
    recommendations: [
      'See a doctor for a TSH blood test — the gold-standard diagnostic test',
      'Take prescribed thyroid hormone on an empty stomach, 30 minutes before breakfast',
      'Do not take calcium, iron, or antacids within 4 hours of thyroid medication — they block absorption',
      'Recheck TSH levels every 6-12 months to adjust the dose',
      'See a doctor urgently if pregnant — untreated hypothyroidism needs prompt management',
    ],
  },

  {
    id: 'hyperthyroidism',
    name: 'Hyperthyroidism',
    category: 'Endocrine - Thyroid',
    aliases: ['overactive thyroid', 'graves disease'],
    symptoms: {
      primary: [
        { name: 'unexplained weight loss', weight: 0.6, description: 'Despite increased appetite' },
        { name: 'palpitations', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'heat intolerance', weight: 0.5, description: '—' },
        { name: 'excessive sweating', weight: 0.4, description: '—' },
        { name: 'anxiety', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'hand tremor', weight: 0.5, description: 'Fine tremor, especially outstretched hands' },
        { name: 'bulging eyes', weight: 0.5, description: 'Exophthalmos — specific to Graves disease' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over weeks to months', chronic: '> 60 days of symptoms typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Mild weight loss and palpitations', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant symptoms with visible tremor', urgency: 'see-doctor-soon' },
      severe: { description: 'Extreme fever, rapid heart rate above 140, confusion (thyroid storm)', urgency: 'emergency' },
    },
    risk_factors: ['female gender', 'family history', 'autoimmune conditions', 'excess iodine intake'],
    red_flags: ['extreme fever with rapid heart rate and confusion', 'new irregular heartbeat or chest pain', 'severe eye pain or vision changes'],
    specialist: 'Endocrinologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['anxiety_disorder', 'heart_arrhythmia_afib'],
    recommendations: [
      'See a doctor for TSH and free T4 blood tests',
      'Take prescribed anti-thyroid medication as directed',
      'Beta-blockers can control palpitations and tremor while awaiting definitive treatment',
      'Avoid excess iodine intake (kelp, seaweed, iodized salt in excess)',
      'Seek emergency care for thyroid storm — extreme fever, very rapid heart rate, and confusion',
    ],
  },

  {
    id: 'thyroiditis',
    name: 'Thyroiditis',
    category: 'Endocrine - Thyroid',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'neck pain', weight: 0.6, description: 'Over the thyroid, may radiate to jaw/ear' },
        { name: 'fatigue', weight: 0.4, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.3, description: 'Low-grade, in subacute thyroiditis' },
        { name: 'palpitations', weight: 0.3, description: 'During the hyperthyroid phase' },
      ],
      differentiating: [
        { name: 'recent viral illness', weight: 0.4, description: 'Subacute thyroiditis often follows a viral infection' },
      ],
    },
    duration_patterns: { acute: '< 21 days onset', typical: 'weeks to months, phases of hyper- then hypothyroidism', chronic: null },
    severity_levels: {
      mild: { description: 'Mild neck discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant neck pain with thyroid dysfunction symptoms', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe neck swelling with difficulty breathing/swallowing', urgency: 'emergency' },
    },
    risk_factors: ['recent viral infection', 'postpartum period', 'autoimmune conditions'],
    red_flags: ['difficulty breathing or swallowing', 'rapidly enlarging neck swelling'],
    specialist: 'Endocrinologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['hypothyroidism', 'hyperthyroidism'],
    recommendations: [
      'See a doctor for thyroid function tests and possible ultrasound',
      'Take anti-inflammatory medication for neck pain as advised',
      'Thyroid function often fluctuates — regular monitoring is needed',
      'Most cases resolve over weeks to months',
      'Seek emergency care for difficulty breathing or swallowing',
    ],
  },

  {
    id: 'goiter',
    name: 'Goiter',
    category: 'Endocrine - Thyroid',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'neck swelling', weight: 0.85, description: 'Visible or palpable enlargement of the thyroid' },
      ],
      secondary: [
        { name: 'difficulty swallowing', weight: 0.3, description: 'If large' },
        { name: 'hoarse voice', weight: 0.2, description: '—' },
      ],
      differentiating: [
        { name: 'diffuse smooth swelling', weight: 0.4, description: 'Distinguishes simple goiter from a discrete nodule' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual enlargement over months to years', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Small, non-tender swelling without symptoms', urgency: 'see-doctor-soon' },
      moderate: { description: 'Visible swelling with mild pressure symptoms', urgency: 'see-doctor-soon' },
      severe: { description: 'Rapid growth, difficulty breathing, or hoarseness', urgency: 'see-doctor-today' },
    },
    risk_factors: ['iodine deficiency', 'family history', 'female gender', 'certain medications'],
    red_flags: ['rapid growth of the swelling', 'difficulty breathing or swallowing', 'hoarseness of voice'],
    specialist: 'Endocrinologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['hypothyroidism', 'thyroid_nodule'],
    recommendations: [
      'See a doctor for thyroid function tests and ultrasound',
      'Ensure adequate dietary iodine (iodized salt) unless advised otherwise',
      'Regular monitoring is needed to track size and function',
      'Surgery may be considered for large goiters causing pressure symptoms',
      'Seek prompt care for rapid growth or breathing/swallowing difficulty',
    ],
  },

  {
    id: 'thyroid_nodule',
    name: 'Thyroid Nodule',
    category: 'Endocrine - Thyroid',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'neck lump', weight: 0.8, description: 'Discrete, often found incidentally' },
      ],
      secondary: [
        { name: 'difficulty swallowing', weight: 0.2, description: 'If large' },
      ],
      differentiating: [
        { name: 'single discrete lump', weight: 0.5, description: 'Distinguishes from diffuse goiter' },
        { name: 'hoarseness', weight: 0.5, description: 'Concerning feature warranting prompt evaluation' },
      ],
    },
    duration_patterns: { acute: null, typical: 'often found incidentally, may be present for years', chronic: null },
    severity_levels: {
      mild: { description: 'Small nodule found incidentally, no symptoms', urgency: 'see-doctor-soon' },
      moderate: { description: 'Growing nodule or new hoarseness', urgency: 'see-doctor-today' },
      severe: { description: 'Rapidly growing hard fixed lump with hoarseness (concerning for malignancy)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['radiation exposure history', 'family history of thyroid cancer', 'female gender'],
    red_flags: ['rapidly growing lump', 'hard, fixed lump', 'new hoarseness with the lump', 'associated neck lymph node swelling'],
    specialist: 'Endocrinologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['goiter'],
    recommendations: [
      'See a doctor for thyroid ultrasound and function tests',
      'A fine needle aspiration biopsy may be recommended to check the nodule cells',
      'Most thyroid nodules are benign, but evaluation is important to be certain',
      'Regular follow-up ultrasounds may be advised to monitor size',
      'See a doctor promptly for rapid growth, a hard fixed lump, or new hoarseness',
    ],
  },
]

export default thyroid

export const adrenal_pituitary = [
  {
    id: 'cushings_syndrome',
    name: "Cushing's Syndrome",
    category: 'Endocrine - Adrenal/Pituitary',
    aliases: ['cushings'],
    symptoms: {
      primary: [
        { name: 'weight gain', weight: 0.7, description: 'Central — trunk and face, not limbs' },
        { name: 'fatigue', weight: 0.4, description: '—' },
      ],
      secondary: [
        { name: 'skin thinning', weight: 0.4, description: 'Easy bruising' },
        { name: 'muscle weakness', weight: 0.3, description: 'Proximal — difficulty rising from chair' },
      ],
      differentiating: [
        { name: 'purple stretch marks', weight: 0.6, description: 'Wide, purple striae on abdomen — characteristic' },
        { name: 'round face', weight: 0.5, description: '"Moon face" appearance' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over months to years', chronic: '> 90 days of symptoms typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Mild weight gain and fatigue', urgency: 'see-doctor-soon' },
      moderate: { description: 'Characteristic body changes with muscle weakness', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe muscle weakness, uncontrolled diabetes, or psychiatric symptoms', urgency: 'see-doctor-today' },
    },
    risk_factors: ['long-term steroid medication use', 'pituitary or adrenal tumor', 'female gender'],
    red_flags: ['severe muscle weakness', 'uncontrolled high blood sugar', 'severe depression or psychosis'],
    specialist: 'Endocrinologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['diabetes_type2', 'obesity_related_conditions'],
    recommendations: [
      'See an endocrinologist for cortisol testing (24-hour urine or blood tests)',
      'If caused by steroid medication, do not stop abruptly — needs gradual tapering under medical supervision',
      'Imaging (MRI/CT) may be needed to find the underlying cause',
      'Treatment depends on the cause — may include surgery for a tumor',
      'Monitor and manage blood sugar and blood pressure closely',
    ],
  },

  {
    id: 'addisons_disease',
    name: "Addison's Disease",
    category: 'Endocrine - Adrenal/Pituitary',
    aliases: ['adrenal insufficiency'],
    symptoms: {
      primary: [
        { name: 'fatigue', weight: 0.7, description: 'Progressive, severe' },
        { name: 'weight loss', weight: 0.5, description: 'Unintentional' },
      ],
      secondary: [
        { name: 'low blood pressure', weight: 0.4, description: '—' },
        { name: 'nausea', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'skin darkening', weight: 0.6, description: 'Hyperpigmentation, especially skin creases and scars' },
      ],
    },
    duration_patterns: { acute: 'crisis can be sudden', typical: 'gradual onset over months', chronic: '> 90 days of symptoms typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Mild fatigue and weight loss', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant fatigue with skin darkening', urgency: 'see-doctor-today' },
      severe: { description: 'Severe vomiting, low blood pressure, confusion (adrenal crisis)', urgency: 'emergency' },
    },
    risk_factors: ['autoimmune conditions', 'tuberculosis (adrenal involvement)', 'abrupt steroid withdrawal'],
    red_flags: ['severe vomiting with low blood pressure', 'confusion', 'shock'],
    specialist: 'Endocrinologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_tuberculosis', 'hypothyroidism'],
    recommendations: [
      'See an endocrinologist for cortisol and ACTH testing',
      'Lifelong steroid replacement therapy is needed once diagnosed',
      'Never stop prescribed steroid medication abruptly',
      'Carry a medical alert card/bracelet noting your condition',
      'Call emergency services for severe vomiting with low blood pressure or confusion — adrenal crisis is life-threatening',
    ],
  },

  {
    id: 'pcos',
    name: 'Polycystic Ovary Syndrome (PCOS)',
    category: 'Endocrine - Adrenal/Pituitary',
    aliases: ['pcos', 'polycystic ovary'],
    symptoms: {
      primary: [
        { name: 'irregular periods', weight: 0.8, description: 'Infrequent or absent' },
        { name: 'acne', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'excess hair growth', weight: 0.5, description: 'Face, chest — hirsutism' },
        { name: 'weight gain', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'difficulty conceiving', weight: 0.5, description: 'Common presenting complaint' },
        { name: 'dark skin patches', weight: 0.4, description: 'Acanthosis nigricans, especially neck' },
        // "no periods" / "signs of diabetes" moved here — both match this
        // entry's own see-doctor-today max, gradual concerns rather than
        // acute emergencies.
        { name: 'no periods for more than 3 months', weight: 0.5, description: '—' },
        { name: 'signs of diabetes', weight: 0.4, description: '—' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, since adolescence/young adulthood', chronic: '> 90 days of irregular cycles typical' },
    severity_levels: {
      mild: { description: 'Mild irregularity in periods', urgency: 'see-doctor-soon' },
      moderate: { description: 'Irregular periods with acne and excess hair', urgency: 'see-doctor-soon' },
      severe: { description: 'No periods for more than 3 months, or signs of diabetes', urgency: 'see-doctor-today' },
    },
    risk_factors: ['obesity', 'family history', 'insulin resistance'],
    // "sudden severe pelvic pain" kept — ovarian cyst rupture/torsion is
    // independently a surgical emergency regardless of PCOS's usual
    // chronicity.
    red_flags: ['sudden severe pelvic pain'],
    specialist: 'Gynecologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['hypothyroidism', 'cushings_syndrome'],
    recommendations: [
      'See a gynecologist — pelvic ultrasound and hormone panel are diagnostic',
      'Weight loss of even 5-10% significantly restores hormonal balance',
      'Regular exercise (at least 150 min/week) is a key treatment',
      'Prescribed medications can help regulate cycles and manage insulin resistance',
      'See a doctor urgently if trying to conceive and struggling for more than 12 months',
    ],
  },

  {
    id: 'acromegaly_awareness',
    name: 'Acromegaly (Awareness)',
    category: 'Endocrine - Adrenal/Pituitary',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'enlarged hands and feet', weight: 0.7, description: 'Gradual, noticed by ring/shoe size change' },
      ],
      secondary: [
        { name: 'joint pain', weight: 0.4, description: '—' },
        { name: 'headache', weight: 0.3, description: '—' },
        { name: 'excessive sweating', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'coarsening facial features', weight: 0.6, description: 'Gradual change in facial appearance over years' },
      ],
    },
    duration_patterns: { acute: null, typical: 'very gradual onset over years', chronic: '> 365 days typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Subtle changes in hand/foot size', urgency: 'see-doctor-soon' },
      moderate: { description: 'Noticeable facial and extremity changes with joint pain', urgency: 'see-doctor-soon' },
      severe: { description: 'Vision changes (suggests pituitary tumor pressing on optic nerves)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['pituitary tumor (usually the underlying cause)'],
    red_flags: ['new vision changes', 'severe headache with vision changes'],
    specialist: 'Endocrinologist',
    india_prevalence: 'rare',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['thyroid_nodule'],
    recommendations: [
      'See an endocrinologist for growth hormone (IGF-1) testing',
      'This is informational only — diagnosis requires specialist blood testing and imaging',
      'MRI of the pituitary gland is usually needed to find the cause',
      'Treatment often involves surgery, medication, or radiation depending on the cause',
      'See a doctor promptly for new vision changes or severe headache',
    ],
  },
]

export default adrenal_pituitary

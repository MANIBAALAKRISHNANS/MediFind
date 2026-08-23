export const diabetes = [
  {
    id: 'diabetes_type2',
    name: 'Type 2 Diabetes',
    category: 'Endocrine - Diabetes',
    aliases: ['diabetes', 'sugar'],
    symptoms: {
      primary: [
        { name: 'frequent urination', weight: 0.7, description: '—' },
        { name: 'excessive thirst', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'blurred vision', weight: 0.4, description: '—' },
        { name: 'unexplained weight loss', weight: 0.4, description: '—' },
        { name: 'slow wound healing', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'numbness in feet', weight: 0.4, description: 'Suggests longstanding undiagnosed diabetes with neuropathy' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over months to years', chronic: '> 90 days of symptoms typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Mild symptoms, newly detected elevated sugar', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant thirst/urination with fatigue', urgency: 'see-doctor-soon' },
      severe: { description: 'Blood glucose above 300, confusion, or fruity breath (DKA)', urgency: 'emergency' },
    },
    risk_factors: ['obesity', 'sedentary lifestyle', 'family history', 'age over 40', 'high-carbohydrate diet'],
    red_flags: ['blood glucose above 300 mg/dL', 'fruity breath with confusion and rapid breathing', 'foot ulcer not healing', 'severe hypoglycemia symptoms'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['diabetes_prediabetes', 'hyperthyroidism', 'diabetes_gestational'],
    recommendations: [
      'See a doctor for HbA1c and fasting blood glucose testing',
      'Follow a diabetic diet — reduce refined carbs, increase vegetables and fiber',
      'Exercise 30-45 minutes daily — walking after meals is very effective',
      'Monitor blood glucose regularly if already diagnosed',
      'Go to hospital if blood sugar is above 300, you are confused, or a foot wound is not healing',
    ],
  },

  {
    id: 'diabetes_type1_early',
    name: 'Type 1 Diabetes — Early Signs',
    category: 'Endocrine - Diabetes',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'frequent urination', weight: 0.8, description: 'Often rapid onset' },
        { name: 'excessive thirst', weight: 0.8, description: 'Rapid onset' },
      ],
      secondary: [
        { name: 'unexplained weight loss', weight: 0.6, description: 'Rapid, despite normal/increased appetite' },
        { name: 'fatigue', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'children and young adults', weight: 0.5, description: 'Most commonly diagnosed in childhood/adolescence' },
        { name: 'rapid onset over weeks', weight: 0.6, description: 'Faster onset than type 2, distinguishing feature' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset', typical: 'rapid onset over days to weeks', chronic: null },
    severity_levels: {
      mild: { description: 'Early symptoms without significant weight loss', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant thirst, urination, and weight loss', urgency: 'see-doctor-today' },
      severe: { description: 'Confusion, fruity breath, vomiting, rapid breathing (DKA)', urgency: 'emergency' },
    },
    risk_factors: ['family history', 'childhood/young adult age', 'certain autoimmune conditions'],
    red_flags: ['fruity breath', 'confusion or extreme drowsiness', 'rapid deep breathing', 'persistent vomiting'],
    specialist: 'Endocrinologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['diabetes_type2', 'diabetes_dka'],
    recommendations: [
      'See a doctor urgently for blood glucose testing — this can progress quickly',
      'Insulin therapy is required and needs to start promptly once confirmed',
      'Learn blood glucose monitoring and insulin administration from a diabetes educator',
      'Family members should learn to recognize signs of low blood sugar',
      'Go to emergency care immediately for fruity breath, confusion, or persistent vomiting — signs of DKA',
    ],
  },

  {
    id: 'diabetes_gestational',
    name: 'Gestational Diabetes',
    category: 'Endocrine - Diabetes',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'excessive thirst', weight: 0.5, description: 'During pregnancy' },
        { name: 'frequent urination', weight: 0.5, description: 'More than typical pregnancy frequency' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.3, description: '—' },
        { name: 'blurred vision', weight: 0.2, description: '—' },
      ],
      differentiating: [
        { name: 'pregnancy', weight: 0.6, description: 'Occurs specifically during pregnancy, usually 2nd/3rd trimester' },
      ],
    },
    duration_patterns: { acute: null, typical: 'diagnosed via screening around 24-28 weeks', chronic: null },
    severity_levels: {
      mild: { description: 'Mildly elevated glucose on screening', urgency: 'see-doctor-soon' },
      moderate: { description: 'Elevated glucose requiring dietary management', urgency: 'see-doctor-soon' },
      severe: { description: 'Poorly controlled glucose despite treatment, or symptoms of DKA', urgency: 'emergency' },
    },
    risk_factors: ['obesity', 'family history of diabetes', 'previous gestational diabetes', 'age over 25', 'PCOS'],
    red_flags: ['confusion with fruity breath', 'reduced fetal movement'],
    specialist: 'Endocrinologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['diabetes_type2'],
    recommendations: [
      'Attend all recommended prenatal glucose screening tests',
      'Follow a diabetic diet plan as advised by your obstetrician/dietitian',
      'Monitor blood glucose as directed',
      'Regular moderate exercise, as approved by your doctor, helps control glucose',
      'Close monitoring is needed for both mother and baby throughout pregnancy',
    ],
  },

  {
    id: 'diabetes_dka',
    name: 'Diabetic Ketoacidosis (DKA) — Warning Signs',
    category: 'Endocrine - Diabetes',
    aliases: ['dka'],
    symptoms: {
      primary: [
        { name: 'excessive thirst', weight: 0.7, description: '—' },
        { name: 'confusion', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.5, description: '—' },
        { name: 'vomiting', weight: 0.5, description: '—' },
        { name: 'abdominal pain', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'fruity breath', weight: 0.9, description: 'Acetone smell on breath — highly characteristic' },
        { name: 'rapid deep breathing', weight: 0.8, description: 'Kussmaul breathing' },
        { name: 'breathing very fast', weight: 0.7, description: 'How a patient/caregiver is more likely to describe Kussmaul breathing than the clinical term' },
      ],
    },
    duration_patterns: { acute: '< 24 hours onset', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always treat as an emergency', urgency: 'emergency' },
      moderate: { description: 'Thirst, nausea, and vomiting in a diabetic', urgency: 'emergency' },
      severe: { description: 'Confusion, fruity breath, and rapid breathing', urgency: 'emergency' },
    },
    risk_factors: ['known type 1 diabetes', 'missed insulin doses', 'infection or illness in a diabetic', 'new undiagnosed type 1 diabetes'],
    // Bare "confusion" or "rapid breathing" alone dropped — both have many
    // common causes unrelated to diabetes. "Fruity breath" is specific
    // enough to stand alone (an unusual, rarely-reported symptom).
    red_flags: [
      'fruity breath',
      'fruity smelling breath',
      'rapid breathing with confusion',
      'confusion with fruity breath',
    ],
    specialist: 'Endocrinologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['diabetes_type1_early', 'diabetes_hypoglycemia'],
    recommendations: [
      'Call emergency services (108/112) immediately — this is a life-threatening emergency',
      'Do not attempt to manage this at home — IV fluids and insulin in a hospital are required',
      'Check blood glucose and ketones if equipment is available while awaiting help',
      'Never skip insulin doses even when unable to eat — contact your doctor for sick-day management instead',
      'This is a genuine emergency — go to the hospital immediately',
    ],
  },

  {
    id: 'diabetes_hypoglycemia',
    name: 'Hypoglycemia (Low Blood Sugar)',
    category: 'Endocrine - Diabetes',
    aliases: ['low blood sugar'],
    symptoms: {
      primary: [
        { name: 'excessive sweating', weight: 0.7, description: 'Sudden onset' },
        { name: 'shakiness', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'confusion', weight: 0.4, description: '—' },
        { name: 'palpitations', weight: 0.4, description: '—' },
        { name: 'dizziness', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'known diabetes on medication', weight: 0.6, description: 'Occurs in diabetics on insulin or certain oral medications' },
        { name: 'rapid symptom onset', weight: 0.5, description: 'Symptoms develop over minutes' },
      ],
    },
    duration_patterns: { acute: 'minutes', typical: 'resolves quickly with glucose intake', chronic: null },
    severity_levels: {
      mild: { description: 'Mild shakiness and sweating, able to self-treat', urgency: 'self-care' },
      moderate: { description: 'Significant symptoms needing assistance', urgency: 'see-doctor-today' },
      severe: { description: 'Loss of consciousness or seizure', urgency: 'emergency' },
    },
    risk_factors: ['insulin or sulfonylurea use', 'skipped meals', 'excessive exercise', 'alcohol use in a diabetic'],
    red_flags: ['loss of consciousness', 'seizure', 'unable to swallow safely'],
    specialist: 'Endocrinologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['anxiety_disorder', 'heart_arrhythmia_afib'],
    recommendations: [
      'If conscious, immediately consume fast-acting sugar — glucose tablets, juice, or sugar water',
      'Recheck blood sugar after 15 minutes and repeat treatment if still low',
      'Follow up with a small snack containing protein once sugar normalizes',
      'Review medication doses and meal timing with your doctor to prevent recurrence',
      'Call emergency services immediately if the person loses consciousness or has a seizure — do not give food/drink by mouth if unconscious',
    ],
  },

  {
    id: 'diabetes_prediabetes',
    name: 'Prediabetes',
    category: 'Endocrine - Diabetes',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'fatigue', weight: 0.3, description: 'Often mild or absent' },
      ],
      secondary: [
        { name: 'increased thirst', weight: 0.2, description: 'Mild, if present' },
      ],
      differentiating: [
        { name: 'often asymptomatic', weight: 0.3, description: 'Usually detected on routine blood testing' },
      ],
    },
    duration_patterns: { acute: null, typical: 'often silent, found on screening', chronic: null },
    severity_levels: {
      mild: { description: 'Mildly elevated blood glucose on screening', urgency: 'see-doctor-soon' },
      moderate: { description: 'Elevated glucose with risk factors present', urgency: 'see-doctor-soon' },
      severe: { description: 'Not applicable — this condition is preventable/reversible with early intervention', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['obesity', 'sedentary lifestyle', 'family history of diabetes', 'age over 40'],
    red_flags: [],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['diabetes_type2'],
    recommendations: [
      'Lose 5-7% of body weight if overweight — significantly reduces progression risk',
      'Exercise at least 150 minutes per week',
      'Reduce refined carbohydrate and sugar intake',
      'Get blood glucose rechecked annually',
      'Prediabetes is often reversible with lifestyle changes — early action matters',
    ],
  },
]

export default diabetes

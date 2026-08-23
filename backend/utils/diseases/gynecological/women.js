// PCOS is defined in endocrine/adrenal_pituitary.js — cross-reference from
// here rather than duplicating.
export const women = [
  {
    id: 'endometriosis',
    name: 'Endometriosis',
    category: 'Gynecological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'painful periods', weight: 0.85, description: 'Severe, worsening over time' },
        { name: 'pelvic pain', weight: 0.7, description: 'Chronic, cyclical' },
      ],
      secondary: [
        { name: 'painful intercourse', weight: 0.4, description: '—' },
        { name: 'heavy periods', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain worsening over years', weight: 0.5, description: 'Progressive severity, unlike typical menstrual cramps' },
        { name: 'difficulty conceiving', weight: 0.5, description: 'Common associated finding' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, cyclical with periods', chronic: '> 90 days recurrent symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild period pain beyond typical cramps', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant pain affecting daily activities during periods', urgency: 'see-doctor-soon' },
      severe: { description: 'Sudden severe pelvic pain (possible cyst rupture/torsion)', urgency: 'emergency' },
    },
    risk_factors: ['family history', 'early menarche', 'never having given birth'],
    red_flags: ['sudden severe pelvic pain', 'progressive worsening pain despite treatment'],
    specialist: 'Gynecologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['pcos', 'gynecological_pid', 'gynecological_fibroids'],
    recommendations: [
      'See a gynecologist — laparoscopy is the gold-standard diagnostic test',
      'Take NSAIDs for period pain, starting 1-2 days before your period',
      'Hormonal treatment can suppress endometriosis growth — discuss options with your doctor',
      'Seek fertility specialist input early if pregnancy is desired',
      'See a gynecologist if period pain is disabling or prevents daily activities',
    ],
  },

  {
    id: 'gynecological_pid',
    name: 'Pelvic Inflammatory Disease (PID)',
    category: 'Gynecological',
    aliases: ['pid'],
    symptoms: {
      primary: [
        { name: 'pelvic pain', weight: 0.8, description: 'Lower abdominal, often bilateral' },
        { name: 'fever', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'vaginal discharge', weight: 0.5, description: 'Abnormal, foul-smelling' },
        { name: 'painful intercourse', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'recent sexual contact', weight: 0.5, description: 'Often follows an untreated sexually transmitted infection' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset', typical: 'requires prompt antibiotic treatment', chronic: '> 90 days suggests chronic PID with complications' },
    severity_levels: {
      mild: { description: 'This condition requires prompt treatment even when apparently mild — untreated PID risks infertility', urgency: 'see-doctor-today' },
      moderate: { description: 'Fever with significant pelvic pain', urgency: 'emergency' },
      severe: { description: 'Severe pain with high fever (possible abscess)', urgency: 'emergency' },
    },
    risk_factors: ['unprotected sexual contact', 'multiple sexual partners', 'untreated sexually transmitted infection', 'IUD insertion'],
    red_flags: ['severe pelvic pain with high fever', 'signs of sepsis'],
    specialist: 'Gynecologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['endometriosis', 'gi_appendicitis'],
    recommendations: [
      'See a gynecologist urgently — prompt antibiotic treatment prevents long-term complications',
      'Complete the full prescribed antibiotic course',
      'Sexual partners should also be tested and treated',
      'Untreated PID can cause infertility — do not delay treatment',
      'Go to emergency care for severe pain with high fever',
    ],
  },

  {
    id: 'gynecological_vaginitis',
    name: 'Vaginitis',
    category: 'Gynecological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'vaginal discharge', weight: 0.8, description: 'Abnormal in color, consistency, or odor' },
        { name: 'vaginal itching', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'vaginal irritation', weight: 0.4, description: '—' },
        { name: 'painful intercourse', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'foul odor', weight: 0.4, description: 'Suggests bacterial vaginosis over candidiasis' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-7 days with treatment', chronic: '> 30 days recurrent symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild discharge and itching', urgency: 'self-care' },
      moderate: { description: 'Significant discharge with odor', urgency: 'see-doctor-soon' },
      severe: { description: 'Pain with fever (suggests PID rather than simple vaginitis)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['recent antibiotic use', 'new sexual partner', 'douching', 'diabetes'],
    red_flags: ['fever with pelvic pain', 'symptoms in pregnancy'],
    specialist: 'Gynecologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['fungal_vaginal_candidiasis', 'gynecological_pid'],
    recommendations: [
      'See a doctor for evaluation and appropriate treatment based on the cause',
      'Avoid douching — it disrupts normal vaginal flora',
      'Wear breathable cotton underwear',
      'Complete the full prescribed treatment course',
      'See a doctor urgently if pregnant or if fever/pelvic pain develops',
    ],
  },

  {
    id: 'menstrual_disorders',
    name: 'Menstrual Disorders (General)',
    category: 'Gynecological',
    aliases: ['irregular periods'],
    symptoms: {
      primary: [
        { name: 'irregular periods', weight: 0.8, description: '—' },
      ],
      secondary: [
        { name: 'heavy periods', weight: 0.4, description: '—' },
        { name: 'painful periods', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'sudden change in pattern', weight: 0.4, description: 'New irregularity in a previously regular cycle' },
        // Moved out of red_flags: matches this entry's own see-doctor-today
        // max — not an acute emergency on its own.
        { name: 'no periods for more than 3 months', weight: 0.5, description: 'If not pregnant or menopausal' },
      ],
    },
    duration_patterns: { acute: null, typical: 'variable, evaluated over 3 cycles', chronic: '> 90 days of irregularity typical for evaluation' },
    severity_levels: {
      mild: { description: 'Mild irregularity', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant irregularity or heavy bleeding', urgency: 'see-doctor-soon' },
      severe: { description: 'Very heavy bleeding causing weakness/dizziness, or no periods for 3+ months', urgency: 'see-doctor-today' },
    },
    risk_factors: ['PCOS', 'thyroid disorders', 'significant weight change', 'stress', 'perimenopause'],
    // "very heavy bleeding" + dizziness/weakness kept — hemorrhage causing
    // dizziness is independently dangerous (shock risk) regardless of this
    // entry's own max.
    red_flags: ['very heavy bleeding soaking through pads hourly', 'severe dizziness or weakness with bleeding'],
    specialist: 'Gynecologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['pcos', 'hypothyroidism', 'gynecological_fibroids'],
    recommendations: [
      'See a gynecologist to identify the underlying cause',
      'Keep a menstrual diary tracking cycle length and flow',
      'Thyroid and hormone testing may be needed',
      'Iron supplementation may be needed if bleeding is heavy',
      'See a doctor urgently for very heavy bleeding causing weakness or dizziness',
    ],
  },

  {
    id: 'gynecological_ectopic_pregnancy_warning',
    name: 'Ectopic Pregnancy — Warning Signs',
    category: 'Gynecological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'one-sided pelvic pain', weight: 0.9, description: 'Sharp, severe' },
        { name: 'missed period', weight: 0.6, description: 'With a positive pregnancy test' },
      ],
      secondary: [
        { name: 'vaginal bleeding', weight: 0.5, description: 'Abnormal, light' },
        { name: 'dizziness', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'shoulder tip pain', weight: 0.7, description: 'Referred pain from internal bleeding — a critical warning sign' },
        { name: 'positive pregnancy test', weight: 0.7, description: 'With pain — always urgent until ectopic is excluded' },
      ],
    },
    duration_patterns: { acute: 'sudden onset possible', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — any suspicion requires emergency evaluation', urgency: 'emergency' },
      moderate: { description: 'One-sided pain with a positive pregnancy test', urgency: 'emergency' },
      severe: { description: 'Sudden collapse, severe shoulder pain, or very low blood pressure (rupture)', urgency: 'emergency' },
    },
    risk_factors: ['previous ectopic pregnancy', 'PID history', 'fertility treatment', 'IUD use'],
    red_flags: [
      'severe shoulder pain with pregnancy',
      'sudden collapse with pelvic pain',
      'one-sided pain with positive pregnancy test',
    ],
    specialist: 'Gynecologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['gi_appendicitis', 'gynecological_ovarian_cyst_rupture'],
    recommendations: [
      'Call emergency services immediately and go to the emergency room',
      'Do NOT eat or drink anything — emergency surgery may be needed',
      'A blood test (beta-hCG) and transvaginal ultrasound confirm the diagnosis',
      'Any positive pregnancy test with one-sided pain needs same-day evaluation',
      'This is a life-threatening emergency — do not wait to see if it improves',
    ],
  },

  {
    id: 'gynecological_ovarian_cyst_rupture',
    name: 'Ovarian Cyst Rupture',
    category: 'Gynecological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'sudden pelvic pain', weight: 0.9, description: 'Sharp, one-sided, sudden onset' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'vaginal bleeding', weight: 0.3, description: 'Light spotting' },
      ],
      differentiating: [
        { name: 'sudden onset during ovulation', weight: 0.5, description: 'Often occurs mid-cycle' },
      ],
    },
    duration_patterns: { acute: 'sudden onset', typical: 'requires prompt evaluation', chronic: null },
    severity_levels: {
      mild: { description: 'Mild sudden discomfort resolving quickly', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant sudden pain', urgency: 'emergency' },
      severe: { description: 'Severe pain with dizziness or signs of internal bleeding', urgency: 'emergency' },
    },
    risk_factors: ['known ovarian cyst', 'ovulation timing', 'fertility treatment'],
    red_flags: ['severe pain with dizziness or fainting', 'rapid heart rate with low blood pressure'],
    specialist: 'Gynecologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['gynecological_ectopic_pregnancy_warning', 'gi_appendicitis'],
    recommendations: [
      'Go to the emergency room for sudden severe pelvic pain to exclude serious causes',
      'Ultrasound is needed to confirm the diagnosis',
      'Most simple cyst ruptures resolve with pain management and observation',
      'Surgery may be needed if there is significant internal bleeding',
      'Seek emergency care immediately for severe pain with dizziness',
    ],
  },

  {
    id: 'preeclampsia_warning',
    name: 'Preeclampsia — Warning Signs',
    category: 'Gynecological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'high blood pressure', weight: 0.8, description: 'New, during pregnancy after 20 weeks' },
        { name: 'severe headache', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'blurred vision', weight: 0.5, description: '—' },
        { name: 'facial swelling', weight: 0.4, description: 'Sudden' },
      ],
      differentiating: [
        { name: 'pregnancy after 20 weeks', weight: 0.6, description: 'Specific to pregnancy' },
        { name: 'right upper abdomen pain', weight: 0.6, description: 'Suggests severe preeclampsia (HELLP)' },
      ],
    },
    duration_patterns: { acute: 'can develop rapidly', typical: 'pregnancy after 20 weeks', chronic: null },
    severity_levels: {
      mild: { description: 'Mildly elevated BP in pregnancy — still requires prompt evaluation', urgency: 'emergency' },
      moderate: { description: 'High BP with headache or vision changes', urgency: 'emergency' },
      severe: { description: 'Very high BP with seizure (eclampsia) or severe abdominal pain', urgency: 'emergency' },
    },
    risk_factors: ['first pregnancy', 'multiple pregnancy (twins)', 'pre-existing hypertension', 'obesity', 'family history'],
    // Every phrase is scoped to pregnancy — bare "headache" or "high blood
    // pressure" alone are both extremely common outside pregnancy.
    red_flags: [
      'headache with vision changes in pregnancy',
      'severe headache with high blood pressure in pregnancy',
      'swelling with headache in pregnancy',
    ],
    specialist: 'Gynecologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['heart_hypertension'],
    recommendations: [
      'Go to the emergency room or labor and delivery unit immediately',
      'Any new headache, vision changes, or abdominal pain in pregnancy after 20 weeks needs urgent evaluation',
      'Blood pressure and urine protein testing confirm the diagnosis',
      'This condition can progress rapidly to seizures (eclampsia) — do not delay care',
      'Regular prenatal checkups help catch this condition early',
    ],
  },

  {
    id: 'gynecological_mastitis',
    name: 'Mastitis',
    category: 'Gynecological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'breast pain', weight: 0.8, description: 'Localized, often wedge-shaped area' },
        { name: 'fever', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'breast redness', weight: 0.5, description: '—' },
        { name: 'breast lump', weight: 0.4, description: 'Tender' },
      ],
      differentiating: [
        { name: 'breastfeeding', weight: 0.6, description: 'Most commonly occurs during breastfeeding' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '2-3 days with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Mild breast tenderness without fever', urgency: 'see-doctor-soon' },
      moderate: { description: 'Painful breast with fever', urgency: 'see-doctor-today' },
      severe: { description: 'Abscess formation or signs of sepsis', urgency: 'emergency' },
    },
    risk_factors: ['breastfeeding', 'cracked nipples', 'blocked milk duct', 'poor breastfeeding technique'],
    red_flags: ['abscess in the breast', 'signs of sepsis'],
    specialist: 'Gynecologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['bacterial_cellulitis'],
    recommendations: [
      'Continue breastfeeding or pumping frequently — this helps clear the blockage',
      'Apply warm compresses before feeding and massage the affected area',
      'See a doctor for antibiotics if fever develops',
      'Ensure proper latch technique to prevent recurrence',
      'Seek urgent care if a fluctuant lump develops (possible abscess)',
    ],
  },

  {
    id: 'gynecological_fibroids',
    name: 'Uterine Fibroids',
    category: 'Gynecological',
    aliases: ['fibroids'],
    symptoms: {
      primary: [
        { name: 'heavy periods', weight: 0.8, description: 'Prolonged, heavy bleeding' },
        { name: 'pelvic pain', weight: 0.5, description: 'Pressure sensation' },
      ],
      secondary: [
        { name: 'frequent urination', weight: 0.3, description: 'If fibroid presses on bladder' },
        { name: 'lower abdomen pain', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'palpable abdominal mass', weight: 0.4, description: 'Large fibroids may be felt' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, gradual growth', chronic: '> 90 days of symptoms typical' },
    severity_levels: {
      mild: { description: 'Small fibroid, mild symptoms', urgency: 'see-doctor-soon' },
      moderate: { description: 'Heavy periods causing anemia', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe bleeding causing significant weakness, or acute severe pelvic pain (degeneration)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['age 30-50', 'family history', 'obesity', 'never having given birth'],
    red_flags: ['severe bleeding causing significant weakness or dizziness', 'sudden severe pelvic pain'],
    specialist: 'Gynecologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['menstrual_disorders', 'endometriosis'],
    recommendations: [
      'See a gynecologist for pelvic ultrasound to confirm the diagnosis',
      'Iron supplementation may be needed for heavy-bleeding-related anemia',
      'Treatment options range from medication to surgery depending on size and symptoms',
      'Regular monitoring is needed to track fibroid growth',
      'See a doctor urgently for severe bleeding causing weakness or sudden severe pain',
    ],
  },
]

export default women

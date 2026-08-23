// Viral hepatitis A/B/C/E are defined in infectious/viral.js — cross-reference
// from here rather than duplicating.
export const liver = [
  {
    id: 'liver_fatty_liver',
    name: 'Non-Alcoholic Fatty Liver Disease (NAFLD)',
    category: 'Gastrointestinal - Liver',
    aliases: ['nafld', 'fatty liver'],
    symptoms: {
      primary: [
        { name: 'fatigue', weight: 0.5, description: 'Often the only symptom' },
        { name: 'right upper abdomen pain', weight: 0.4, description: 'Mild discomfort' },
      ],
      secondary: [
        { name: 'weight gain', weight: 0.3, description: 'Often associated with obesity' },
      ],
      differentiating: [
        { name: 'metabolic syndrome', weight: 0.5, description: 'Associated with obesity, diabetes, high cholesterol' },
        // Moved out of red_flags: this entry's own worst tier is
        // see-doctor-today — it never reaches emergency. Plain fatty liver
        // causing abdominal swelling/bruising/confusion would mean it's
        // actually progressed to cirrhosis/decompensation, which is a
        // separate, already-existing entry (liver_cirrhosis) that
        // correctly owns these as genuine red flags with its own
        // emergency tier. Kept here as differentiating signals that this
        // might not be simple NAFLD.
        { name: 'abdominal swelling', weight: 0.4, description: 'Suggests progression beyond simple fatty liver' },
        { name: 'easy bruising', weight: 0.4, description: 'Suggests progression beyond simple fatty liver' },
        { name: 'confusion', weight: 0.5, description: 'Suggests progression beyond simple fatty liver' },
      ],
    },
    duration_patterns: { acute: null, typical: 'often asymptomatic for years, found incidentally', chronic: '> 90 days is the norm' },
    severity_levels: {
      mild: { description: 'Asymptomatic, mild fat on ultrasound', urgency: 'see-doctor-soon' },
      moderate: { description: 'Elevated liver enzymes with symptoms', urgency: 'see-doctor-soon' },
      severe: { description: 'Signs of cirrhosis — jaundice, abdominal swelling, easy bruising', urgency: 'see-doctor-today' },
    },
    risk_factors: ['obesity', 'diabetes', 'high cholesterol', 'sedentary lifestyle', 'metabolic syndrome'],
    red_flags: ['jaundice'],
    specialist: 'Hepatologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['viral_hepatitis_b', 'liver_afld', 'liver_cirrhosis'],
    recommendations: [
      'See a hepatologist for liver function tests, lipid profile, and ultrasound',
      'Weight loss of 7-10% of body weight dramatically reduces liver fat',
      'Control blood sugar and cholesterol aggressively',
      'Avoid alcohol and unnecessary supplements/herbal remedies',
      'Regular exercise and a Mediterranean-style diet are the most evidence-based interventions',
    ],
  },

  {
    id: 'liver_afld',
    name: 'Alcoholic Fatty Liver Disease (AFLD)',
    category: 'Gastrointestinal - Liver',
    aliases: ['alcoholic liver disease'],
    symptoms: {
      primary: [
        { name: 'right upper abdomen pain', weight: 0.5, description: '—' },
        { name: 'fatigue', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'loss of appetite', weight: 0.3, description: '—' },
        { name: 'nausea', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'significant alcohol use', weight: 0.7, description: 'History of regular/heavy alcohol consumption' },
      ],
    },
    duration_patterns: { acute: null, typical: 'develops over months to years of alcohol use', chronic: '> 90 days is the norm' },
    severity_levels: {
      mild: { description: 'Mild fatigue, found incidentally', urgency: 'see-doctor-soon' },
      moderate: { description: 'Symptomatic with abnormal liver tests', urgency: 'see-doctor-soon' },
      severe: { description: 'Jaundice, abdominal swelling, confusion — advanced liver disease', urgency: 'emergency' },
    },
    risk_factors: ['heavy or regular alcohol use', 'malnutrition', 'obesity', 'hepatitis co-infection'],
    // "abdominal swelling" tightened to "severe abdominal swelling" — bare
    // it's indistinguishable from ordinary bloating; qualified it matches
    // the phrasing already used consistently on the viral hepatitis
    // entries (ascites is the intended meaning).
    red_flags: ['jaundice', 'severe abdominal swelling', 'confusion', 'vomiting blood'],
    specialist: 'Hepatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['liver_fatty_liver', 'liver_cirrhosis'],
    recommendations: [
      'Stop alcohol consumption completely — this is essential for recovery',
      'See a hepatologist for liver function tests and ultrasound',
      'Ensure adequate nutrition, including thiamine supplementation if advised',
      'Consider counseling or support programs for alcohol cessation',
      'Seek emergency care for jaundice, confusion, or abdominal swelling',
    ],
  },

  {
    id: 'liver_cirrhosis',
    name: 'Liver Cirrhosis',
    category: 'Gastrointestinal - Liver',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'jaundice', weight: 0.7, description: '—' },
        { name: 'abdominal swelling', weight: 0.7, description: 'Ascites' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'leg swelling', weight: 0.4, description: '—' },
        { name: 'easy bruising', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'spider veins on skin', weight: 0.5, description: 'Spider angiomas are characteristic' },
      ],
    },
    duration_patterns: { acute: null, typical: 'end-stage of chronic liver disease, develops over years', chronic: '> 365 days typical progression' },
    severity_levels: {
      mild: { description: 'Compensated cirrhosis without complications', urgency: 'see-doctor-soon' },
      moderate: { description: 'Ascites or mild confusion', urgency: 'see-doctor-today' },
      severe: { description: 'Vomiting blood, severe confusion (hepatic encephalopathy), or kidney failure', urgency: 'emergency' },
    },
    risk_factors: ['chronic hepatitis B/C', 'heavy alcohol use', 'NAFLD/NASH', 'autoimmune liver disease'],
    red_flags: ['vomiting blood', 'black tarry stool', 'severe confusion', 'rapidly worsening abdominal swelling'],
    specialist: 'Hepatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['liver_fatty_liver', 'liver_afld', 'heart_failure'],
    recommendations: [
      'See a hepatologist for comprehensive management and monitoring',
      'Avoid all alcohol completely',
      'Follow a low-salt diet to manage fluid retention',
      'Regular screening for liver cancer and esophageal varices is essential',
      'Seek emergency care immediately for vomiting blood or severe confusion',
    ],
  },

  {
    id: 'liver_abscess',
    name: 'Liver Abscess',
    category: 'Gastrointestinal - Liver',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'right upper abdomen pain', weight: 0.8, description: '—' },
        { name: 'high fever', weight: 0.75, description: 'With chills' },
      ],
      secondary: [
        { name: 'loss of appetite', weight: 0.4, description: '—' },
        { name: 'weight loss', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'recent amoebiasis or dysentery', weight: 0.5, description: 'Amoebic liver abscess often follows intestinal infection' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '2-3 weeks with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'This condition typically requires prompt hospital care once suspected', urgency: 'see-doctor-today' },
      moderate: { description: 'High fever with right upper abdominal pain', urgency: 'emergency' },
      severe: { description: 'Signs of rupture — severe abdominal pain, shock', urgency: 'emergency' },
    },
    risk_factors: ['recent amoebiasis', 'contaminated water exposure', 'diabetes', 'alcohol use'],
    red_flags: ['sudden severe abdominal pain', 'signs of shock', 'breathing difficulty'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['parasitic_amoebiasis', 'pancreas_cholecystitis'],
    recommendations: [
      'See a doctor urgently — ultrasound and blood tests are needed to confirm',
      'Complete the full prescribed antibiotic/antiparasitic course',
      'Drainage may be needed for larger abscesses',
      'Drink only boiled or bottled water to prevent recurrence',
      'Seek emergency care for sudden severe pain or signs of shock',
    ],
  },

  {
    id: 'liver_jaundice_general',
    name: 'Jaundice (General Presentation)',
    category: 'Gastrointestinal - Liver',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'jaundice', weight: 0.9, description: 'Yellowing of skin and eyes' },
        { name: 'dark urine', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'pale stool', weight: 0.4, description: '—' },
        { name: 'itching', weight: 0.3, description: '—' },
        { name: 'fatigue', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'abdominal pain', weight: 0.3, description: 'Presence/absence helps distinguish cause (gallstone vs hepatitis)' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset', typical: 'depends on underlying cause', chronic: null },
    severity_levels: {
      mild: { description: 'Mild jaundice without other symptoms', urgency: 'see-doctor-today' },
      moderate: { description: 'Jaundice with fatigue and nausea', urgency: 'see-doctor-today' },
      severe: { description: 'Confusion, severe abdominal pain, or rapidly deepening jaundice', urgency: 'emergency' },
    },
    risk_factors: ['contaminated water exposure', 'alcohol use', 'gallstones', 'recent new medication'],
    red_flags: ['confusion or extreme drowsiness', 'severe abdominal pain', 'rapidly deepening jaundice', 'bleeding or bruising'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_hepatitis_a', 'pancreas_gallstones', 'liver_gilbert_syndrome'],
    recommendations: [
      'See a doctor promptly for liver function tests to identify the cause',
      'Rest and avoid alcohol completely',
      'Eat light, low-fat, easily digestible food',
      'Drink only boiled or bottled water',
      'Seek emergency care for confusion, severe pain, or rapidly worsening jaundice',
    ],
  },

  {
    id: 'liver_gilbert_syndrome',
    name: 'Gilbert Syndrome',
    category: 'Gastrointestinal - Liver',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'mild jaundice', weight: 0.6, description: 'Intermittent, mild yellowing especially of the eyes' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.2, description: 'Mild, if any' },
      ],
      differentiating: [
        { name: 'jaundice worsens with fasting or illness', weight: 0.5, description: 'Triggered by stress, fasting, or minor illness' },
      ],
    },
    duration_patterns: { acute: null, typical: 'lifelong, benign, intermittent', chronic: 'condition is lifelong but harmless' },
    severity_levels: {
      mild: { description: 'Mild intermittent yellowing of eyes, otherwise well', urgency: 'self-care' },
      moderate: { description: 'More noticeable jaundice during illness/fasting', urgency: 'see-doctor-soon' },
      severe: { description: 'Not applicable — this is a benign, harmless condition', urgency: 'self-care' },
    },
    risk_factors: ['family history', 'fasting', 'dehydration', 'physical stress or illness'],
    red_flags: [],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['liver_jaundice_general'],
    recommendations: [
      'This is a benign, harmless condition requiring no specific treatment',
      'See a doctor once to confirm the diagnosis and rule out other liver conditions',
      'Avoid prolonged fasting, which can worsen mild jaundice',
      'Stay well hydrated, especially during illness',
      'No dietary or lifestyle restrictions are otherwise needed',
    ],
  },
]

export default liver

export const pancreas_gallbladder = [
  {
    id: 'pancreas_acute_pancreatitis',
    name: 'Acute Pancreatitis',
    category: 'Gastrointestinal - Pancreas/Gallbladder',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'severe upper abdominal pain', weight: 0.9, description: 'Radiating to the back, often band-like' },
        { name: 'vomiting', weight: 0.6, description: 'Persistent' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'fever', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain worse lying down', weight: 0.5, description: 'Pain improves when sitting forward' },
        { name: 'pain after alcohol', weight: 0.5, description: 'Common trigger alongside gallstones' },
      ],
    },
    duration_patterns: { acute: '< 7 days onset', typical: '1-2 weeks hospital course', chronic: null },
    severity_levels: {
      mild: { description: 'This condition requires hospital evaluation even when apparently mild', urgency: 'emergency' },
      moderate: { description: 'Severe pain with vomiting', urgency: 'emergency' },
      severe: { description: 'Fever with severe pain, confusion, or signs of organ failure', urgency: 'emergency' },
    },
    risk_factors: ['gallstones', 'heavy alcohol use', 'high triglycerides', 'certain medications'],
    red_flags: ['fever with severe abdominal pain', 'confusion or shock', 'rapidly spreading abdominal rigidity', 'signs of organ failure'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['pancreas_gallstones', 'gi_peptic_ulcer', 'heart_attack'],
    recommendations: [
      'Go to the hospital immediately — IV fluids and fasting are essential first steps',
      'Serum lipase and amylase blood tests confirm the diagnosis',
      'Complete fasting allows the pancreas to rest and recover',
      'CT abdomen assesses severity and complications',
      'This is a medical emergency — go to hospital immediately for any suspected pancreatitis',
    ],
  },

  {
    id: 'pancreas_chronic_pancreatitis',
    name: 'Chronic Pancreatitis',
    category: 'Gastrointestinal - Pancreas/Gallbladder',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'recurrent abdominal pain', weight: 0.8, description: 'Upper abdomen, radiating to back' },
        { name: 'weight loss', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'fatty stools', weight: 0.4, description: 'Malabsorption' },
        { name: 'nausea', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'recurrent episodes over years', weight: 0.5, description: 'History of repeated acute pancreatitis episodes' },
      ],
    },
    duration_patterns: { acute: null, typical: 'recurrent over years', chronic: '> 90 days recurrent symptoms typical' },
    severity_levels: {
      mild: { description: 'Occasional mild pain', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent pain with weight loss', urgency: 'see-doctor-today' },
      severe: { description: 'Severe pain flare or new diabetes with rapid weight loss', urgency: 'emergency' },
    },
    risk_factors: ['heavy alcohol use', 'recurrent acute pancreatitis', 'smoking', 'genetic conditions'],
    red_flags: ['severe acute pain flare', 'signs of new diabetes with weight loss', 'jaundice'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['pancreas_acute_pancreatitis', 'diabetes_type2'],
    recommendations: [
      'Stop alcohol consumption completely',
      'See a gastroenterologist for pancreatic enzyme supplementation if malabsorption is present',
      'Follow a low-fat diet as advised',
      'Monitor blood sugar regularly — chronic pancreatitis can cause diabetes',
      'Seek emergency care for a severe pain flare',
    ],
  },

  {
    id: 'pancreas_gallstones',
    name: 'Gallstones',
    category: 'Gastrointestinal - Pancreas/Gallbladder',
    aliases: ['cholelithiasis'],
    symptoms: {
      primary: [
        { name: 'right upper abdomen pain', weight: 0.8, description: 'Biliary colic, often after fatty meals' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'bloating', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain after fatty food', weight: 0.6, description: 'Classic trigger' },
      ],
    },
    duration_patterns: { acute: '< 6 hours per episode', typical: 'episodic biliary colic', chronic: 'recurrent episodes over months to years' },
    severity_levels: {
      mild: { description: 'Occasional mild discomfort after fatty meals', urgency: 'see-doctor-soon' },
      moderate: { description: 'Recurrent significant pain episodes', urgency: 'see-doctor-soon' },
      severe: { description: 'Fever with pain (cholecystitis) or jaundice (bile duct obstruction)', urgency: 'emergency' },
    },
    risk_factors: ['obesity', 'female gender', 'rapid weight loss', 'high-fat diet', 'family history'],
    red_flags: ['fever with right upper abdominal pain', 'jaundice with severe pain', 'severe unrelenting pain'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['pancreas_cholecystitis', 'gi_peptic_ulcer', 'liver_abscess'],
    recommendations: [
      'See a gastroenterologist — abdominal ultrasound is the key diagnostic test',
      'Avoid fatty, fried, and spicy foods to reduce pain episodes',
      'Elective laparoscopic cholecystectomy (keyhole surgery) is the definitive cure',
      'If fever or jaundice develop, go to hospital urgently — indicates complications',
      'Maintain gradual, sustainable weight loss rather than rapid weight loss',
    ],
  },

  {
    id: 'pancreas_cholecystitis',
    name: 'Acute Cholecystitis',
    category: 'Gastrointestinal - Pancreas/Gallbladder',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'right upper abdomen pain', weight: 0.85, description: 'Constant, severe, unlike intermittent biliary colic' },
        { name: 'fever', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.5, description: '—' },
        { name: 'vomiting', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'pain lasting more than 6 hours', weight: 0.6, description: 'Distinguishes from simple biliary colic' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: 'requires hospital treatment', chronic: null },
    severity_levels: {
      mild: { description: 'This condition typically requires hospital-level care once suspected', urgency: 'emergency' },
      moderate: { description: 'Fever with persistent right upper pain', urgency: 'emergency' },
      severe: { description: 'Jaundice, high fever, or signs of gallbladder rupture', urgency: 'emergency' },
    },
    risk_factors: ['gallstones', 'obesity', 'female gender', 'rapid weight loss'],
    red_flags: ['jaundice with severe pain', 'high fever with rigid abdomen', 'signs of sepsis'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['pancreas_gallstones', 'liver_abscess'],
    recommendations: [
      'Go to the hospital promptly — this usually requires IV antibiotics and possibly surgery',
      'Do not eat or drink until assessed by a doctor',
      'Ultrasound is needed to confirm the diagnosis',
      'Surgical removal of the gallbladder is often recommended after the acute episode settles',
      'Seek emergency care immediately for jaundice or worsening fever',
    ],
  },

  {
    id: 'pancreas_cholangitis',
    name: 'Cholangitis',
    category: 'Gastrointestinal - Pancreas/Gallbladder',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.85, description: 'High, with chills' },
        { name: 'jaundice', weight: 0.7, description: '—' },
        { name: 'right upper abdomen pain', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'confusion', weight: 0.3, description: 'In severe cases' },
      ],
      differentiating: [
        { name: 'triad of fever jaundice and pain', weight: 0.8, description: 'Charcot\'s triad — classic presentation of cholangitis' },
      ],
    },
    duration_patterns: { acute: '< 3 days onset', typical: 'requires urgent hospital treatment', chronic: null },
    severity_levels: {
      mild: { description: 'This condition always requires urgent hospital treatment', urgency: 'emergency' },
      moderate: { description: 'Fever, jaundice, and pain (Charcot\'s triad)', urgency: 'emergency' },
      severe: { description: 'Confusion and low blood pressure added to the triad (Reynolds pentad) — septic shock', urgency: 'emergency' },
    },
    risk_factors: ['gallstones', 'bile duct stricture', 'recent ERCP procedure'],
    red_flags: ['confusion', 'low blood pressure', 'the full triad of fever, jaundice, and abdominal pain'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['pancreas_cholecystitis', 'viral_hepatitis_a'],
    recommendations: [
      'Go to the emergency room immediately — this is a life-threatening infection',
      'IV antibiotics must be started promptly',
      'Urgent bile duct drainage (ERCP) is often required',
      'Do not delay care — cholangitis can progress rapidly to septic shock',
      'Follow-up treatment of the underlying gallstone/stricture is needed to prevent recurrence',
    ],
  },
]

export default pancreas_gallbladder

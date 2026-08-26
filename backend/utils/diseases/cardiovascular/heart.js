export const heart = [
  {
    id: 'heart_hypertension',
    name: 'Hypertension (High Blood Pressure)',
    category: 'Cardiovascular - Heart',
    aliases: ['high blood pressure'],
    symptoms: {
      primary: [
        { name: 'headache', weight: 0.5, description: 'Often occipital, morning' },
        { name: 'dizziness', weight: 0.4, description: '—' },
      ],
      secondary: [
        { name: 'palpitations', weight: 0.3, description: '—' },
        { name: 'blurred vision', weight: 0.3, description: '—' },
        { name: 'nosebleed', weight: 0.2, description: '—' },
      ],
      differentiating: [
        { name: 'hypertension', weight: 0.7, description: 'Often asymptomatic — "silent killer," found on routine checkup' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic condition, often lifelong', chronic: '> 90 days confirmed elevated readings' },
    severity_levels: {
      mild: { description: 'Mildly elevated BP without symptoms', urgency: 'see-doctor-soon' },
      moderate: { description: 'Elevated BP with headache or dizziness', urgency: 'see-doctor-soon' },
      severe: { description: 'BP above 180/120 with symptoms (hypertensive crisis)', urgency: 'emergency' },
    },
    risk_factors: ['obesity', 'high salt diet', 'family history', 'sedentary lifestyle', 'smoking', 'diabetes'],
    red_flags: ['BP above 180/120 mmHg', 'severe headache with vision changes', 'chest pain or breathlessness', 'sudden weakness in face/arm/leg'],
    specialist: 'Cardiologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['migraine', 'anxiety_disorder', 'tension_headache'],
    recommendations: [
      'Check your blood pressure regularly at home or a clinic',
      'If prescribed BP medication, take it every day without skipping',
      'Reduce salt intake to less than 5 grams per day',
      'Exercise 30 minutes daily and maintain a healthy weight',
      'Go to emergency care if BP is above 180/120 or you have chest pain, severe headache, or vision changes',
    ],
  },

  {
    id: 'heart_coronary_artery_disease',
    name: 'Coronary Artery Disease',
    category: 'Cardiovascular - Heart',
    aliases: ['cad', 'ischemic heart disease'],
    symptoms: {
      primary: [
        { name: 'chest pain on exertion', weight: 0.8, description: 'Relieved by rest' },
        { name: 'shortness of breath', weight: 0.5, description: 'On exertion' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain radiating to arm', weight: 0.6, description: 'Radiation to left arm or jaw' },
      ],
    },
    duration_patterns: { acute: 'acute event minutes', typical: 'chronic, progressive over years', chronic: '> 90 days of exertional symptoms typical' },
    severity_levels: {
      mild: { description: 'Chest discomfort only with significant exertion', urgency: 'see-doctor-soon' },
      moderate: { description: 'Chest discomfort with routine activity', urgency: 'see-doctor-today' },
      severe: { description: 'Chest pain at rest or with minimal exertion — unstable angina/heart attack', urgency: 'emergency' },
    },
    risk_factors: ['smoking', 'diabetes', 'hypertension', 'high cholesterol', 'family history', 'sedentary lifestyle'],
    red_flags: ['chest pain at rest', 'chest pain lasting more than 15 minutes', 'chest pain with sweating and breathlessness'],
    specialist: 'Cardiologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['heart_angina', 'heart_attack', 'gi_gerd'],
    recommendations: [
      'See a cardiologist for ECG, stress test, and lipid profile',
      'Control blood pressure, cholesterol, and blood sugar aggressively',
      'Quit smoking completely',
      'Exercise regularly as advised by your doctor',
      'Call emergency services for chest pain at rest or lasting more than 15 minutes',
    ],
  },

  {
    id: 'heart_angina',
    name: 'Angina Pectoris',
    category: 'Cardiovascular - Heart',
    aliases: ['angina'],
    symptoms: {
      primary: [
        { name: 'chest pain on exertion', weight: 0.85, description: 'Pressure or tightness' },
      ],
      secondary: [
        { name: 'shortness of breath', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'relieved by rest', weight: 0.7, description: 'Pain resolves within minutes of stopping activity' },
      ],
    },
    duration_patterns: { acute: '< 15 minutes per episode', typical: 'episodic, recurrent', chronic: '> 30 days recurrent pattern typical' },
    severity_levels: {
      mild: { description: 'Occasional discomfort with significant exertion', urgency: 'see-doctor-today' },
      moderate: { description: 'Frequent discomfort with moderate exertion', urgency: 'see-doctor-today' },
      severe: { description: 'Pain at rest, waking from sleep, or not relieved by rest — unstable angina', urgency: 'emergency' },
    },
    risk_factors: ['smoking', 'diabetes', 'hypertension', 'high cholesterol', 'family history'],
    red_flags: ['chest pain at rest or waking from sleep', 'pain lasting more than 15 minutes', 'new or rapidly worsening pattern'],
    specialist: 'Cardiologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['heart_coronary_artery_disease', 'heart_attack', 'gi_gerd'],
    recommendations: [
      'See a cardiologist today — ECG and stress testing may be needed',
      'Carry prescribed nitroglycerine and use it at the onset of angina if prescribed',
      'Take prescribed aspirin and statins daily as directed',
      'Strictly avoid smoking and control blood pressure/sugar/cholesterol',
      'Call emergency services immediately if pain occurs at rest or lasts more than 15 minutes',
    ],
  },

  {
    id: 'heart_attack',
    name: 'Heart Attack (Myocardial Infarction) — Warning Signs',
    category: 'Cardiovascular - Heart',
    aliases: ['myocardial infarction', 'mi'],
    symptoms: {
      primary: [
        { name: 'severe chest pain', weight: 1.0, description: 'Crushing, pressure-like, may radiate to arm/jaw' },
        { name: 'crushing chest pain', weight: 1.0, description: 'The most common way patients describe it — not just "severe"' },
        { name: 'shortness of breath', weight: 0.8, description: '—' },
      ],
      secondary: [
        { name: 'excessive sweating', weight: 0.5, description: '—' },
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'dizziness', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'pain radiating to arm', weight: 0.7, description: 'Left arm or jaw radiation is classic' },
        { name: 'sudden onset', weight: 0.6, description: '—' },
      ],
    },
    duration_patterns: { acute: 'sudden, minutes', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — any suspicion requires an emergency response', urgency: 'emergency' },
      moderate: { description: 'Chest pain with breathlessness and sweating', urgency: 'emergency' },
      severe: { description: 'Severe crushing chest pain, collapse, or loss of consciousness', urgency: 'emergency' },
    },
    risk_factors: ['smoking', 'diabetes', 'hypertension', 'high cholesterol', 'family history', 'obesity', 'age over 45'],
    // Deliberately NOT bare "chest pain" or "severe chest pain" alone — both
    // are extremely common for benign causes (muscle strain, GERD, anxiety)
    // and would over-trigger. Each phrase below requires either the specific
    // "crushing" quality or a concrete accompanying sign real heart-attack
    // patients report, not just severity.
    red_flags: [
      'crushing chest pain',
      'chest pain radiating to arm',
      'chest pain radiating to my arm',
      'chest pain radiating to jaw',
      'chest pain radiating to my jaw',
      'chest pain with sweating',
      'chest pain and shortness of breath',
    ],
    specialist: 'Cardiologist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['heart_angina', 'pulmonary_embolism', 'gi_gerd'],
    recommendations: [
      'Call emergency services (108/112) IMMEDIATELY — this is a medical emergency',
      'Chew one aspirin immediately if available and not allergic',
      'Stay as calm and still as possible; do not exert yourself',
      'Do not drive yourself to the hospital — call an ambulance',
      'Call 108 now — do not wait, every minute counts',
    ],
  },

  {
    id: 'heart_failure',
    name: 'Heart Failure',
    category: 'Cardiovascular - Heart',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'shortness of breath', weight: 0.8, description: 'Worse lying flat (orthopnea)' },
        { name: 'leg swelling', weight: 0.7, description: 'Bilateral' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'weight gain', weight: 0.3, description: 'Due to fluid retention' },
      ],
      differentiating: [
        { name: 'breathless lying flat', weight: 0.7, description: 'Orthopnea — needs multiple pillows to sleep' },
      ],
    },
    duration_patterns: { acute: 'acute decompensation days', typical: 'chronic, progressive', chronic: '> 90 days typical established disease' },
    severity_levels: {
      mild: { description: 'Breathlessness only with significant exertion', urgency: 'see-doctor-soon' },
      moderate: { description: 'Breathlessness with routine activity and mild leg swelling', urgency: 'see-doctor-today' },
      severe: { description: 'Breathlessness at rest, cannot lie flat, pink frothy cough', urgency: 'emergency' },
    },
    risk_factors: ['hypertension', 'diabetes', 'previous heart attack', 'valve disease', 'cardiomyopathy'],
    red_flags: ['severe breathlessness at rest', 'unable to lie flat', 'pink frothy cough', 'bluish lips'],
    specialist: 'Cardiologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['nephrotic_syndrome', 'liver_cirrhosis', 'pulmonary_embolism'],
    recommendations: [
      'See a cardiologist urgently — chest X-ray, echocardiogram, and BNP test are needed',
      'Take all prescribed medications daily without fail',
      'Follow fluid and salt restriction as advised',
      'Weigh yourself every morning — a gain of more than 2 kg in 2 days needs a doctor\'s attention',
      'Go to emergency care if you cannot lie flat or breathlessness is severe at rest',
    ],
  },

  {
    id: 'heart_arrhythmia_afib',
    name: 'Atrial Fibrillation',
    category: 'Cardiovascular - Heart',
    aliases: ['afib', 'af'],
    symptoms: {
      primary: [
        { name: 'palpitations', weight: 0.8, description: 'Irregular, often described as fluttering' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'dizziness', weight: 0.4, description: '—' },
        { name: 'shortness of breath', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'irregular heartbeat', weight: 0.7, description: 'Irregularly irregular pulse is characteristic' },
      ],
    },
    duration_patterns: { acute: 'paroxysmal episodes hours-days', typical: 'may become persistent over time', chronic: '> 7 days persistent AFib' },
    severity_levels: {
      mild: { description: 'Occasional brief palpitations', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent palpitations with fatigue', urgency: 'see-doctor-today' },
      severe: { description: 'Palpitations with fainting, chest pain, or severe breathlessness', urgency: 'emergency' },
    },
    risk_factors: ['hypertension', 'age over 60', 'thyroid disease', 'heart valve disease', 'alcohol use'],
    red_flags: ['fainting or near-fainting with palpitations', 'chest pain with palpitations', 'heart rate above 150 or below 40'],
    specialist: 'Cardiologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['heart_svt', 'hyperthyroidism', 'anxiety_disorder'],
    recommendations: [
      'See a cardiologist — ECG is essential to confirm and characterize the rhythm',
      'A Holter monitor may be needed to capture intermittent episodes',
      'Blood thinners are often prescribed to reduce stroke risk — take exactly as directed',
      'Avoid caffeine, alcohol, and energy drinks which can trigger episodes',
      'Seek emergency care for palpitations with fainting, chest pain, or breathlessness',
    ],
  },

  {
    id: 'heart_svt',
    name: 'Supraventricular Tachycardia (SVT)',
    category: 'Cardiovascular - Heart',
    aliases: ['svt'],
    symptoms: {
      primary: [
        { name: 'racing heart', weight: 0.85, description: 'Sudden onset and offset, very fast regular rhythm' },
      ],
      secondary: [
        { name: 'dizziness', weight: 0.4, description: '—' },
        { name: 'chest discomfort', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'sudden onset', weight: 0.6, description: 'Episodes start and stop abruptly, unlike gradual anxiety-related racing' },
      ],
    },
    duration_patterns: { acute: 'minutes to hours per episode', typical: 'episodic, recurrent', chronic: null },
    severity_levels: {
      mild: { description: 'Brief self-resolving episodes', urgency: 'see-doctor-soon' },
      moderate: { description: 'Prolonged episodes needing intervention to stop', urgency: 'see-doctor-today' },
      severe: { description: 'Episode with fainting, chest pain, or breathlessness', urgency: 'emergency' },
    },
    risk_factors: ['young age (often no structural heart disease)', 'caffeine', 'stress', 'stimulant use'],
    red_flags: ['fainting during an episode', 'chest pain during an episode', 'breathlessness during an episode'],
    specialist: 'Cardiologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['heart_arrhythmia_afib', 'anxiety_disorder'],
    recommendations: [
      'Try vagal maneuvers (bearing down, cold water on face) which can sometimes terminate an episode',
      'See a cardiologist for ECG and possible electrophysiology study',
      'Avoid caffeine, alcohol, and energy drinks',
      'Catheter ablation offers a potential cure for recurrent SVT',
      'Seek emergency care if an episode causes fainting, chest pain, or severe breathlessness',
    ],
  },

  {
    id: 'heart_valve_disorder',
    name: 'Heart Valve Disorder',
    category: 'Cardiovascular - Heart',
    aliases: ['valvular heart disease'],
    symptoms: {
      primary: [
        { name: 'shortness of breath', weight: 0.6, description: 'On exertion' },
        { name: 'fatigue', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'palpitations', weight: 0.3, description: '—' },
        { name: 'chest pain', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'heart murmur', weight: 0.6, description: 'Detected on clinical exam' },
        { name: 'history of rheumatic fever', weight: 0.5, description: 'Common cause of valve disease in India' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, progressive', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Mild breathlessness on significant exertion', urgency: 'see-doctor-soon' },
      moderate: { description: 'Breathlessness with routine activity', urgency: 'see-doctor-soon' },
      severe: { description: 'Breathlessness at rest, fainting, or chest pain', urgency: 'emergency' },
    },
    risk_factors: ['history of rheumatic fever', 'congenital heart disease', 'age-related degeneration', 'infective endocarditis history'],
    // Bare "chest pain" narrowed — matches "chest tightness" via the
    // synonym map, unrelated on its own.
    red_flags: ['breathlessness at rest', 'fainting on exertion', 'chest pain on exertion'],
    specialist: 'Cardiologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['heart_failure', 'heart_endocarditis'],
    recommendations: [
      'See a cardiologist for an echocardiogram to assess valve function',
      'Antibiotic prophylaxis before certain dental/surgical procedures may be needed — ask your doctor',
      'Regular follow-up echocardiograms to monitor progression',
      'Some valve conditions eventually require surgical repair or replacement',
      'Seek emergency care for breathlessness at rest, fainting, or chest pain',
    ],
  },

  {
    id: 'heart_myocarditis',
    name: 'Myocarditis',
    category: 'Cardiovascular - Heart',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'chest pain', weight: 0.7, description: '—' },
        { name: 'shortness of breath', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'palpitations', weight: 0.4, description: '—' },
        { name: 'fever', weight: 0.3, description: 'Recent or concurrent viral illness' },
      ],
      differentiating: [
        { name: 'recent viral infection', weight: 0.5, description: 'Often follows a viral illness by 1-2 weeks' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset', typical: 'weeks, variable recovery', chronic: 'can progress to chronic cardiomyopathy in some cases' },
    severity_levels: {
      mild: { description: 'Mild chest discomfort and fatigue after a viral illness', urgency: 'see-doctor-today' },
      moderate: { description: 'Chest pain with breathlessness and palpitations', urgency: 'emergency' },
      severe: { description: 'Severe breathlessness, fainting, or signs of heart failure', urgency: 'emergency' },
    },
    risk_factors: ['recent viral infection', 'autoimmune conditions', 'young age'],
    red_flags: ['fainting', 'severe breathlessness', 'chest pain with irregular heartbeat'],
    specialist: 'Cardiologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['heart_pericarditis', 'heart_attack'],
    recommendations: [
      'See a cardiologist urgently for ECG, echocardiogram, and blood tests',
      'Avoid strenuous exercise until cleared by a cardiologist — can worsen inflammation',
      'Rest is important during the acute phase',
      'Follow up is needed to monitor for any lasting heart function changes',
      'Seek emergency care for fainting, severe breathlessness, or irregular heartbeat with chest pain',
    ],
  },

  {
    id: 'heart_pericarditis',
    name: 'Pericarditis',
    category: 'Cardiovascular - Heart',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'sharp chest pain', weight: 0.85, description: 'Worse lying down, better sitting forward' },
      ],
      secondary: [
        { name: 'fever', weight: 0.3, description: '—' },
        { name: 'shortness of breath', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain worse lying down', weight: 0.6, description: 'Improves when sitting up and leaning forward' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '1-3 weeks', chronic: '> 90 days suggests chronic/recurrent pericarditis' },
    severity_levels: {
      mild: { description: 'Mild chest discomfort', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant pain affecting breathing', urgency: 'see-doctor-today' },
      severe: { description: 'Breathlessness with low blood pressure (possible cardiac tamponade)', urgency: 'emergency' },
    },
    risk_factors: ['recent viral infection', 'autoimmune disease', 'recent heart attack or surgery'],
    red_flags: ['severe breathlessness with low blood pressure', 'fainting', 'rapidly worsening chest pain'],
    specialist: 'Cardiologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['heart_myocarditis', 'heart_attack'],
    recommendations: [
      'See a cardiologist for ECG and echocardiogram to confirm and assess severity',
      'Anti-inflammatory medication is the mainstay of treatment',
      'Avoid strenuous exercise until symptoms resolve',
      'Sitting up and leaning forward can provide temporary relief',
      'Seek emergency care for breathlessness with low blood pressure or fainting',
    ],
  },

  {
    id: 'heart_endocarditis',
    name: 'Infective Endocarditis',
    category: 'Cardiovascular - Heart',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'prolonged fever', weight: 0.8, description: 'Persistent, low-grade to high' },
        { name: 'fatigue', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'joint pain', weight: 0.3, description: '—' },
        { name: 'weight loss', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'known heart valve disease', weight: 0.6, description: 'Underlying valve abnormality or prosthetic valve raises risk' },
        { name: 'new heart murmur', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: null, typical: 'weeks of unexplained fever before diagnosis', chronic: '> 14 days of fever in at-risk individual' },
    severity_levels: {
      mild: { description: 'Prolonged unexplained fever in someone with valve disease', urgency: 'see-doctor-today' },
      moderate: { description: 'Fever with new murmur or embolic symptoms', urgency: 'emergency' },
      severe: { description: 'Heart failure symptoms, stroke-like symptoms, or sepsis', urgency: 'emergency' },
    },
    risk_factors: ['known heart valve disease', 'prosthetic heart valve', 'IV drug use', 'recent dental procedure without prophylaxis'],
    red_flags: ['stroke-like symptoms', 'signs of heart failure', 'signs of sepsis'],
    specialist: 'Cardiologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_typhoid', 'heart_valve_disorder'],
    recommendations: [
      'See a doctor urgently for blood cultures and echocardiogram if unexplained fever with known valve disease',
      'Prolonged IV antibiotic treatment in hospital is usually required',
      'Ensure antibiotic prophylaxis before dental/surgical procedures if you have valve disease — discuss with your doctor',
      'Do not delay evaluation of unexplained persistent fever',
      'Seek emergency care for stroke-like symptoms or breathlessness',
    ],
  },

  {
    id: 'heart_cardiomyopathy',
    name: 'Cardiomyopathy',
    category: 'Cardiovascular - Heart',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'shortness of breath', weight: 0.7, description: 'Progressive' },
        { name: 'fatigue', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'leg swelling', weight: 0.4, description: '—' },
        { name: 'palpitations', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'family history', weight: 0.4, description: 'Some forms are genetic' },
      ],
    },
    duration_patterns: { acute: null, typical: 'progressive over months to years', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Mild breathlessness on significant exertion', urgency: 'see-doctor-soon' },
      moderate: { description: 'Breathlessness with routine activity', urgency: 'see-doctor-today' },
      severe: { description: 'Breathlessness at rest, fainting, or sudden cardiac symptoms', urgency: 'emergency' },
    },
    risk_factors: ['family history', 'long-standing hypertension', 'heavy alcohol use', 'previous viral myocarditis'],
    red_flags: ['fainting', 'breathlessness at rest', 'chest pain with irregular heartbeat'],
    specialist: 'Cardiologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['heart_failure', 'heart_myocarditis'],
    recommendations: [
      'See a cardiologist for echocardiogram and further cardiac evaluation',
      'Take prescribed heart failure medications consistently',
      'Avoid alcohol, especially in alcohol-related cardiomyopathy',
      'Family members may benefit from screening if a genetic cause is suspected',
      'Seek emergency care for fainting or breathlessness at rest',
    ],
  },

  // ── Undifferentiated chest pain ───────────────────────────────────────────
  // Bare "chest pain" had no home in the knowledge base. heart_attack requires
  // "crushing"/"severe", angina requires "on exertion", and
  // redflag_chest_pain_breathlessness requires the breathlessness half of its
  // name — so the single most alarming thing a user can type on their own was
  // landing on "Unspecified Condition, 15%, see a general physician", or worse,
  // on an ambulance banner for a symptom they had described no other way.
  //
  // This entry is deliberately NOT an emergency-red-flag entry. Undifferentiated
  // chest pain needs same-day cardiac evaluation, which is a different clinical
  // instruction from "call 108 now" — and a triage tool that shouts EMERGENCY at
  // every chest twinge teaches people to ignore it by the time it matters. The
  // urgency therefore tracks what the user actually said: crushing/radiating/
  // with sweating escalates to emergency through red_flags below, plain chest
  // pain gets same-day, and a clearly meal-linked or occasional pattern gets
  // prompt-but-not-same-day. localDiagnosis.js's URGENCY_FLOOR_SYMPTOMS
  // guarantees the floor of that range regardless of how the user minimises it.
  {
    id: 'heart_chest_pain_cardiac',
    name: 'Chest Pain — Possible Cardiac Cause',
    category: 'Cardiovascular - Heart',
    aliases: ['chest pain', 'heart pain'],
    symptoms: {
      // These four are the ONLY distinct tokens the synonym map produces for
      // chest complaints — "chest ache", "pain in my chest", "heart pain",
      // "chest is hurting" all normalise onto 'chest pain', and listing them
      // again here would let one phrase match several primaries at once.
      primary: [
        { name: 'chest pain', weight: 1.0, description: 'Any pain in the chest, however the patient words it' },
        { name: 'chest tightness', weight: 0.9, description: 'A band or squeezing sensation rather than sharp pain' },
        { name: 'chest pressure', weight: 0.9, description: 'Weight or heaviness on the chest' },
        { name: 'chest discomfort', weight: 0.8, description: 'Vague, hard-to-describe chest sensation' },
      ],
      secondary: [
        { name: 'dyspnea', weight: 0.6, description: 'Breathlessness alongside the chest symptom' },
        { name: 'excessive sweating', weight: 0.5, description: '—' },
        { name: 'palpitations', weight: 0.4, description: '—' },
        { name: 'nausea', weight: 0.3, description: '—' },
        { name: 'dizziness', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain radiating to arm', weight: 0.7, description: 'Radiation to arm, jaw, or back raises cardiac probability sharply' },
        { name: 'worse on exertion', weight: 0.6, description: 'Brought on by walking or climbing stairs, eased by rest' },
      ],
    },
    duration_patterns: { acute: '< 1 day', typical: 'needs evaluation regardless of duration', chronic: '> 30 days recurrent still needs a cardiac opinion' },
    severity_levels: {
      mild: { description: 'Occasional chest discomfort, or clearly linked to meals or posture — still worth a check', urgency: 'see-doctor-soon' },
      moderate: { description: 'Chest pain with no reassuring pattern — needs a same-day cardiac assessment (ECG)', urgency: 'see-doctor-today' },
      severe: { description: 'Crushing or radiating pain, or pain with sweating, breathlessness, or collapse', urgency: 'emergency' },
    },
    risk_factors: ['smoking', 'diabetes', 'hypertension', 'high cholesterol', 'family history of heart disease', 'obesity'],
    red_flags: [
      'crushing chest pain',
      'chest pain with sweating',
      'chest pain with breathlessness',
      'chest pain and shortness of breath',
      'chest pain radiating to arm',
      'chest pain radiating to my arm',
      'chest pain radiating to jaw',
      'chest pain at rest',
      'chest pain lasting more than 15 minutes',
    ],
    specialist: 'Cardiologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['heart_attack', 'heart_angina', 'gi_gerd', 'respiratory_costochondritis'],
    recommendations: [
      'Get an ECG today — chest pain should not be self-assessed, even when it feels minor',
      'Stop any physical exertion and rest until you have been assessed',
      'Call 108 immediately if the pain becomes crushing, spreads to your arm or jaw, or comes with sweating or breathlessness',
      'Note what brings it on and what relieves it — exertion, meals, posture, or breathing — this genuinely changes the diagnosis',
      'Tell the doctor about smoking, diabetes, blood pressure, or family heart history',
    ],
  },
]

export default heart

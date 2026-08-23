export const bacterial = [
  {
    id: 'bacterial_typhoid',
    name: 'Typhoid Fever',
    category: 'Infectious - Bacterial',
    aliases: ['enteric fever'],
    symptoms: {
      primary: [
        { name: 'prolonged fever', weight: 0.9, description: 'Continuous fever, stepwise rise over days' },
        { name: 'abdominal pain', weight: 0.6, description: '—' },
        { name: 'weakness', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'headache', weight: 0.4, description: '—' },
        { name: 'loss of appetite', weight: 0.4, description: '—' },
        { name: 'constipation', weight: 0.3, description: 'More common than diarrhea in adults' },
      ],
      differentiating: [
        { name: 'coated tongue', weight: 0.5, description: 'Classic finding in typhoid' },
        { name: 'rose spots', weight: 0.4, description: 'Faint pink spots on trunk' },
      ],
    },
    duration_patterns: { acute: '< 7 days early', typical: '2-4 weeks if untreated', chronic: '> 4 weeks suggests complications' },
    severity_levels: {
      mild: { description: 'Fever and mild abdominal discomfort', urgency: 'see-doctor-today' },
      moderate: { description: 'Persistent high fever with weakness', urgency: 'see-doctor-today' },
      severe: { description: 'Severe abdominal pain, confusion, or intestinal bleeding/perforation', urgency: 'emergency' },
    },
    risk_factors: ['ate raw or street food', 'contaminated water exposure', 'poor sanitation area'],
    red_flags: ['fever lasting more than 7 days', 'severe abdominal pain or swelling', 'blood in stool', 'confusion'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_dengue', 'malaria', 'viral_fever'],
    recommendations: [
      'Get a blood culture or Widal/Typhidot test to confirm',
      'Complete the full prescribed antibiotic course, usually 7-14 days',
      'Eat only freshly cooked, light food — khichdi, dal, rice',
      'Drink only boiled or bottled water; avoid street food',
      'Seek emergency care for severe abdominal pain or blood in stool',
    ],
  },

  {
    id: 'bacterial_tuberculosis',
    name: 'Tuberculosis (TB)',
    category: 'Infectious - Bacterial',
    aliases: ['tb', 'consumption'],
    symptoms: {
      primary: [
        { name: 'persistent cough', weight: 0.85, description: 'Lasting more than 2-3 weeks' },
        { name: 'weight loss', weight: 0.7, description: 'Unintentional' },
        { name: 'night sweats', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'low-grade fever', weight: 0.5, description: 'Often evening rise' },
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'loss of appetite', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'hemoptysis', weight: 0.8, description: 'Coughing up blood — strongly suggests TB in an endemic area' },
        // Moved out of red_flags: rapid weight loss marks advanced/
        // disseminated disease and warrants prompt treatment initiation,
        // but isn't itself an acute same-day danger the way coughing blood
        // or breathing difficulty at rest are — those stay below.
        { name: 'rapid weight loss', weight: 0.4, description: 'Marks more advanced disease' },
      ],
    },
    duration_patterns: { acute: null, typical: 'symptoms over weeks to months', chronic: '> 21 days of cough warrants TB testing' },
    severity_levels: {
      mild: { description: 'Cough for 2-3 weeks without other symptoms', urgency: 'see-doctor-today' },
      moderate: { description: 'Cough with weight loss and night sweats', urgency: 'see-doctor-today' },
      severe: { description: 'Coughing blood or severe breathlessness', urgency: 'emergency' },
    },
    risk_factors: ['contact with TB patient', 'crowded living conditions', 'malnutrition', 'HIV or immunocompromised', 'diabetes'],
    red_flags: ['coughing up blood', 'difficulty breathing at rest', 'high fever with night sweats lasting weeks'],
    specialist: 'Pulmonologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_pneumonia', 'lung_cancer_warning', 'chronic_bronchitis'],
    recommendations: [
      'Get a sputum test, chest X-ray, and Mantoux/IGRA test to confirm',
      'If diagnosed, complete the full DOTS treatment course — minimum 6 months, free at government hospitals under NTEP',
      'Wear a mask around others until declared non-infectious',
      'Maintain good nutrition with a high-protein diet',
      'Ensure the room is well-ventilated and gets sunlight',
    ],
  },

  {
    id: 'bacterial_cholera',
    name: 'Cholera',
    category: 'Infectious - Bacterial',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'profuse watery diarrhea', weight: 0.9, description: '"Rice water" stools, very frequent and voluminous' },
        { name: 'vomiting', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'muscle cramps', weight: 0.5, description: 'Due to electrolyte loss' },
        { name: 'weakness', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'rapid dehydration', weight: 0.8, description: 'Severe dehydration can develop within hours' },
      ],
    },
    duration_patterns: { acute: '< 5 days', typical: '3-5 days with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Mild watery diarrhea without dehydration', urgency: 'see-doctor-today' },
      moderate: { description: 'Frequent diarrhea with some dehydration signs', urgency: 'emergency' },
      severe: { description: 'Severe dehydration — sunken eyes, no urination, lethargy', urgency: 'emergency' },
    },
    risk_factors: ['contaminated water exposure', 'flood-affected area', 'poor sanitation', 'outbreak area'],
    red_flags: ['signs of severe dehydration', 'no urination for 6+ hours', 'lethargy or confusion', 'rapid heart rate with weak pulse'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['gastroenteritis', 'food_poisoning'],
    recommendations: [
      'Start ORS immediately — this is the most critical, life-saving treatment',
      'Go to a hospital immediately for IV fluids if dehydration is significant',
      'Take prescribed antibiotics to shorten illness duration',
      'Drink only boiled or bottled water going forward',
      'Practice strict hand hygiene to prevent spread to others',
    ],
  },

  {
    id: 'bacterial_pneumonia',
    name: 'Bacterial Pneumonia',
    category: 'Infectious - Bacterial',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'productive cough', weight: 0.8, description: 'With thick, colored sputum' },
        { name: 'fever', weight: 0.75, description: 'High, often with chills' },
        { name: 'chest pain', weight: 0.6, description: 'Sharp, worse with breathing' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'shortness of breath', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'rapid breathing', weight: 0.7, description: 'Breathing rate significantly elevated' },
      ],
    },
    duration_patterns: { acute: '< 7 days onset', typical: '1-2 weeks with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Cough and fever without breathing difficulty', urgency: 'see-doctor-today' },
      moderate: { description: 'Productive cough, fever, mild breathlessness', urgency: 'see-doctor-today' },
      severe: { description: 'Rapid breathing, low oxygen, confusion, bluish lips', urgency: 'emergency' },
    },
    risk_factors: ['elderly', 'young children', 'smoking', 'chronic lung disease', 'recent viral infection'],
    red_flags: ['breathing rate above 30/min', 'bluish lips or fingernails', 'confusion', 'oxygen saturation below 94%'],
    specialist: 'Pulmonologist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_tuberculosis', 'acute_bronchitis', 'viral_influenza'],
    recommendations: [
      'See a doctor today — chest X-ray and sputum test are needed',
      'Take the full prescribed antibiotic course',
      'Rest and drink plenty of warm fluids to loosen mucus',
      'Use steam inhalation for symptomatic relief',
      'Go to the emergency room if breathing becomes labored or lips turn blue',
    ],
  },

  {
    id: 'bacterial_uti',
    name: 'Urinary Tract Infection (UTI)',
    category: 'Infectious - Bacterial',
    aliases: ['bladder infection', 'cystitis'],
    symptoms: {
      primary: [
        { name: 'dysuria', weight: 0.9, description: 'Burning pain during urination' },
        { name: 'frequent urination', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'lower abdomen pain', weight: 0.4, description: '—' },
        { name: 'cloudy urine', weight: 0.3, description: '—' },
        { name: 'urgency', weight: 0.4, description: 'Sudden need to urinate' },
      ],
      differentiating: [
        { name: 'foul smelling urine', weight: 0.4, description: '—' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-5 days with treatment', chronic: '> 14 days or recurrent suggests complicated UTI' },
    severity_levels: {
      mild: { description: 'Burning urination without fever', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent painful urination with lower abdomen discomfort', urgency: 'see-doctor-today' },
      severe: { description: 'Fever with flank pain — possible kidney infection', urgency: 'see-doctor-today' },
    },
    risk_factors: ['female gender', 'sexual activity', 'pregnancy', 'diabetes', 'holding urine for long periods'],
    red_flags: ['fever above 101°F with UTI symptoms', 'back or flank pain', 'blood in urine', 'symptoms in pregnancy'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['kidney_stones', 'pyelonephritis'],
    recommendations: [
      'See a doctor for a urine culture and antibiotic prescription',
      'Drink at least 3 litres of water daily to flush bacteria',
      'Do not delay urination — empty the bladder regularly',
      'Complete the full antibiotic course even if symptoms improve quickly',
      'Seek prompt care if fever or back pain develops — may indicate kidney involvement',
    ],
  },

  {
    id: 'bacterial_strep_throat',
    name: 'Strep Throat',
    category: 'Infectious - Bacterial',
    aliases: ['streptococcal pharyngitis'],
    symptoms: {
      primary: [
        { name: 'sore throat', weight: 0.85, description: 'Sudden onset, severe' },
        { name: 'fever', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'swollen tonsils', weight: 0.5, description: 'Often with white patches' },
        { name: 'lymph node swelling', weight: 0.4, description: 'Neck' },
      ],
      differentiating: [
        { name: 'no cough', weight: 0.5, description: 'Absence of cough/runny nose favors bacterial over viral cause' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-5 days with antibiotics', chronic: null },
    severity_levels: {
      mild: { description: 'Sore throat without difficulty swallowing', urgency: 'see-doctor-soon' },
      moderate: { description: 'Painful swallowing with fever', urgency: 'see-doctor-today' },
      severe: { description: 'Difficulty breathing or swallowing saliva', urgency: 'emergency' },
    },
    risk_factors: ['close contact with infected person', 'children and young adults', 'crowded settings'],
    red_flags: ['difficulty breathing', 'drooling/unable to swallow saliva', 'muffled voice', 'severe neck swelling'],
    specialist: 'ENT Specialist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['tonsillitis', 'infectious_mononucleosis'],
    recommendations: [
      'See a doctor for a throat swab to confirm bacterial cause',
      'Complete the full prescribed antibiotic course to prevent complications',
      'Gargle with warm salt water for relief',
      'Take paracetamol for pain and fever',
      'Seek emergency care for breathing or swallowing difficulty',
    ],
  },

  {
    id: 'bacterial_meningitis',
    name: 'Bacterial Meningitis',
    category: 'Infectious - Bacterial',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.85, description: 'High, sudden onset' },
        { name: 'neck stiffness', weight: 0.9, description: 'Unable to touch chin to chest' },
        { name: 'severe headache', weight: 0.8, description: '—' },
      ],
      secondary: [
        { name: 'photophobia', weight: 0.5, description: 'Light sensitivity' },
        { name: 'vomiting', weight: 0.4, description: '—' },
        { name: 'confusion', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'non-blanching rash', weight: 0.9, description: 'Purple-red rash that doesn\'t fade under pressure — meningococcal emergency' },
      ],
    },
    duration_patterns: { acute: '< 24 hours onset can be rapid', typical: 'hours to days', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild presentation — always treat as an emergency', urgency: 'emergency' },
      moderate: { description: 'Fever, headache, neck stiffness', urgency: 'emergency' },
      severe: { description: 'Confusion, seizures, non-blanching rash', urgency: 'emergency' },
    },
    risk_factors: ['unvaccinated', 'crowded living conditions', 'recent ear or sinus infection', 'immunocompromised'],
    red_flags: ['fever with stiff neck and headache', 'non-blanching rash', 'confusion or seizures', 'loss of consciousness'],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['central_meningitis_viral', 'severe_migraine'],
    recommendations: [
      'Call emergency services (108/112) immediately — this is a medical emergency',
      'IV antibiotics must be started within 1 hour of suspicion',
      'Do not give food or water until assessed by a doctor',
      'Close contacts may need preventive antibiotics — follow medical advice',
      'Every hour of delay increases risk of death or permanent brain damage',
    ],
  },

  {
    id: 'bacterial_leptospirosis',
    name: 'Leptospirosis',
    category: 'Infectious - Bacterial',
    aliases: ['weil disease'],
    symptoms: {
      primary: [
        { name: 'high fever', weight: 0.8, description: 'Sudden onset' },
        { name: 'muscle pain', weight: 0.7, description: 'Especially calf muscles' },
      ],
      secondary: [
        { name: 'red eyes', weight: 0.5, description: 'Conjunctival suffusion without discharge' },
        { name: 'headache', weight: 0.4, description: '—' },
        { name: 'jaundice', weight: 0.3, description: 'In severe cases' },
      ],
      differentiating: [
        { name: 'contaminated water exposure', weight: 0.7, description: 'Contact with flood water or rat-urine-contaminated water' },
        { name: 'calf tenderness', weight: 0.6, description: 'Characteristic finding' },
      ],
    },
    duration_patterns: { acute: '< 7 days early phase', typical: '1-3 weeks', chronic: null },
    severity_levels: {
      mild: { description: 'Fever and muscle pain without jaundice', urgency: 'see-doctor-today' },
      moderate: { description: 'Fever with jaundice or reduced urine output', urgency: 'emergency' },
      severe: { description: 'Jaundice with kidney failure (Weil disease), bleeding, or breathing difficulty', urgency: 'emergency' },
    },
    risk_factors: ['contaminated water exposure', 'flood-affected area', 'monsoon season', 'outdoor/farm work'],
    // Bare "swollen legs" narrowed — it also matches "leg swelling" via the
    // synonym map, which is very common after standing/heat and unrelated
    // to leptospirosis on its own.
    red_flags: ['jaundice with reduced urine output', 'severe headache with stiff neck', 'coughing blood', 'jaundice with leg swelling'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_dengue', 'malaria', 'bacterial_typhoid'],
    recommendations: [
      'See a doctor urgently — early antibiotics (doxycycline) are life-saving',
      'Get blood tests for kidney and liver function',
      'Avoid wading in floodwater without protective footwear',
      'Doxycycline prophylaxis may be advised if repeated floodwater exposure is unavoidable',
      'Seek emergency care for jaundice, reduced urination, or breathing difficulty',
    ],
  },

  {
    id: 'bacterial_brucellosis',
    name: 'Brucellosis',
    category: 'Infectious - Bacterial',
    aliases: ['undulant fever'],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.8, description: 'Undulating — rises and falls in waves' },
        { name: 'fatigue', weight: 0.6, description: '—' },
        { name: 'joint pain', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'night sweats', weight: 0.5, description: '—' },
        { name: 'weight loss', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'unpasteurized dairy exposure', weight: 0.6, description: 'Consumption of raw milk or contact with livestock' },
      ],
    },
    duration_patterns: { acute: null, typical: 'weeks to months if untreated', chronic: '> 12 months suggests chronic brucellosis' },
    severity_levels: {
      mild: { description: 'Intermittent fever and fatigue', urgency: 'see-doctor-soon' },
      moderate: { description: 'Persistent fever with joint pain and night sweats', urgency: 'see-doctor-today' },
      severe: { description: 'Complications such as endocarditis or spinal infection', urgency: 'emergency' },
    },
    risk_factors: ['unpasteurized dairy', 'livestock/farm work', 'veterinary occupation'],
    red_flags: ['chest pain or breathlessness', 'severe back pain with fever', 'confusion'],
    specialist: 'Infectious Disease Specialist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_typhoid', 'bacterial_tuberculosis'],
    recommendations: [
      'Avoid unpasteurized/raw dairy products',
      'See a doctor for blood cultures and serology testing',
      'Complete the full prescribed combination antibiotic course — relapse is common with short courses',
      'Use protective equipment when handling livestock',
      'Seek urgent care if new heart or neurological symptoms develop',
    ],
  },

  {
    id: 'bacterial_tetanus',
    name: 'Tetanus',
    category: 'Infectious - Bacterial',
    aliases: ['lockjaw'],
    symptoms: {
      primary: [
        { name: 'jaw stiffness', weight: 0.9, description: 'Lockjaw — difficulty opening the mouth' },
        { name: 'muscle spasms', weight: 0.85, description: 'Painful, often triggered by light/sound/touch' },
      ],
      secondary: [
        { name: 'difficulty swallowing', weight: 0.5, description: '—' },
        { name: 'fever', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'recent wound', weight: 0.6, description: 'Especially deep or dirty wounds, often with no/incomplete vaccination' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset after injury', typical: '3-21 days incubation', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always an emergency once suspected', urgency: 'emergency' },
      moderate: { description: 'Jaw stiffness and localized spasms', urgency: 'emergency' },
      severe: { description: 'Generalized spasms, breathing difficulty, back arching', urgency: 'emergency' },
    },
    risk_factors: ['deep or dirty wound', 'incomplete tetanus vaccination', 'rusty metal injury', 'animal bite'],
    red_flags: [
      'lockjaw with recent wound', 'generalized muscle spasms', 'breathing difficulty',
      // "back arching" is the clinical/textbook noun phrase (opisthotonus);
      // "my back is arching" is how a person would actually describe it —
      // keep both.
      'back arching', 'my back is arching',
    ],
    specialist: 'Emergency Medicine',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: [],
    recommendations: [
      'Go to the emergency room immediately for any deep or dirty wound with jaw stiffness',
      'Clean all wounds thoroughly and get a tetanus toxoid booster if not up to date',
      'Tetanus immunoglobulin may be needed for high-risk wounds',
      'Keep the patient in a calm, quiet, dark environment to avoid triggering spasms',
      'Ensure routine tetanus vaccination is kept up to date (every 10 years)',
    ],
  },

  {
    id: 'bacterial_diphtheria',
    name: 'Diphtheria',
    category: 'Infectious - Bacterial',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'sore throat', weight: 0.8, description: 'With a grey membrane over the tonsils/throat' },
        { name: 'fever', weight: 0.5, description: 'Low to moderate' },
      ],
      secondary: [
        { name: 'lymph node swelling', weight: 0.5, description: '"Bull neck" appearance in severe cases' },
        { name: 'weakness', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'grey membrane in throat', weight: 0.9, description: 'Thick grey/white membrane that bleeds if scraped — highly characteristic' },
      ],
    },
    duration_patterns: { acute: '< 7 days onset', typical: '10-14 days', chronic: null },
    severity_levels: {
      mild: { description: 'Mild sore throat without membrane', urgency: 'see-doctor-today' },
      moderate: { description: 'Visible throat membrane with lymph node swelling', urgency: 'emergency' },
      severe: { description: 'Difficulty breathing, "bull neck," or cardiac involvement', urgency: 'emergency' },
    },
    risk_factors: ['unvaccinated or incomplete DPT vaccination', 'close contact with infected person', 'crowded conditions'],
    red_flags: ['difficulty breathing', 'grey throat membrane', 'severe neck swelling', 'irregular heartbeat'],
    specialist: 'Infectious Disease Specialist',
    india_prevalence: 'low',
    seasonal_pattern: 'winter',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_strep_throat', 'tonsillitis'],
    recommendations: [
      'Go to the hospital immediately — diphtheria antitoxin and antibiotics are needed urgently',
      'Isolate the patient to prevent spread',
      'Ensure complete DPT/Tdap vaccination for all household members',
      'Monitor breathing closely — airway obstruction is life-threatening',
      'Report to public health authorities as required',
    ],
  },

  {
    id: 'bacterial_whooping_cough',
    name: 'Whooping Cough (Pertussis)',
    category: 'Infectious - Bacterial',
    aliases: ['pertussis'],
    symptoms: {
      primary: [
        { name: 'paroxysmal cough', weight: 0.85, description: 'Severe coughing fits' },
        { name: 'whoop sound', weight: 0.7, description: 'Characteristic gasping sound after a coughing fit' },
      ],
      secondary: [
        { name: 'vomiting after coughing', weight: 0.4, description: '—' },
        { name: 'runny nose', weight: 0.3, description: 'Early, cold-like phase' },
      ],
      differentiating: [
        { name: 'cough worse at night', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: null, typical: '6-10 weeks total illness', chronic: '> 21 days of paroxysmal cough is typical, not unusual' },
    severity_levels: {
      mild: { description: 'Mild cough in an older, vaccinated child/adult', urgency: 'see-doctor-today' },
      moderate: { description: 'Paroxysmal cough with whoop, feeding difficulty', urgency: 'see-doctor-today' },
      severe: { description: 'Infant under 6 months with any cough, or cyanosis during fits', urgency: 'emergency' },
    },
    risk_factors: ['unvaccinated or incomplete DPT vaccination', 'infant under 6 months', 'close contact with infected person'],
    red_flags: ['cough turning lips or face blue', 'infant under 6 months with any cough', 'vomiting after every coughing fit', 'seizures'],
    specialist: 'Pulmonologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['viral_croup', 'asthma'],
    recommendations: [
      'See a doctor urgently — azithromycin shortens illness and reduces transmission',
      'Ensure children are vaccinated with DTP (free at government centres)',
      'Keep the child away from unvaccinated infants — can be fatal in babies under 6 months',
      'Offer small frequent feeds after coughing fits settle',
      'Seek emergency care for blue lips, seizures, or inability to feed',
    ],
  },

  {
    id: 'bacterial_salmonella_food_poisoning',
    name: 'Salmonella Food Poisoning',
    category: 'Infectious - Bacterial',
    aliases: ['salmonellosis'],
    symptoms: {
      primary: [
        { name: 'diarrhea', weight: 0.8, description: 'Often with blood or mucus' },
        { name: 'abdominal cramps', weight: 0.6, description: '—' },
        { name: 'fever', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'vomiting', weight: 0.4, description: '—' },
        { name: 'nausea', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'ate raw or street food', weight: 0.6, description: 'Undercooked poultry/eggs are the classic source' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '4-7 days', chronic: null },
    severity_levels: {
      mild: { description: 'Diarrhea without dehydration', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent diarrhea with fever', urgency: 'see-doctor-today' },
      severe: { description: 'Bloody diarrhea with high fever, or severe dehydration', urgency: 'emergency' },
    },
    risk_factors: ['ate raw or street food', 'undercooked poultry or eggs', 'contaminated water exposure'],
    red_flags: ['blood in stool', 'high fever with severe dehydration', 'confusion with rapid heart rate'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: 'summer',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['gastroenteritis', 'ecoli_infection', 'amoebiasis'],
    recommendations: [
      'Start ORS immediately to prevent dehydration',
      'Avoid anti-diarrheal medication unless advised by a doctor',
      'Eat bland, easily digestible food as tolerated',
      'Wash hands thoroughly and cook poultry/eggs completely to prevent recurrence',
      'Seek care if blood in stool or signs of severe dehydration appear',
    ],
  },

  {
    id: 'bacterial_ecoli_infection',
    name: 'E. coli Infection',
    category: 'Infectious - Bacterial',
    aliases: ['ecoli', 'traveler\'s diarrhea'],
    symptoms: {
      primary: [
        { name: 'watery diarrhea', weight: 0.8, description: 'Can progress to bloody diarrhea' },
        { name: 'abdominal cramps', weight: 0.6, description: 'Often severe' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'low-grade fever', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'ate raw or street food', weight: 0.5, description: 'Undercooked beef, contaminated produce, or water' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-7 days', chronic: null },
    severity_levels: {
      mild: { description: 'Watery diarrhea without blood', urgency: 'see-doctor-soon' },
      moderate: { description: 'Diarrhea with cramping and mild fever', urgency: 'see-doctor-today' },
      severe: { description: 'Bloody diarrhea, reduced urination (possible HUS in children)', urgency: 'emergency' },
    },
    risk_factors: ['ate raw or street food', 'undercooked beef', 'contaminated water exposure', 'recent travel'],
    red_flags: [
      'bloody diarrhea', 'reduced urine output', 'severe dehydration',
      // Clinical third-person phrasing ("X in a child") is how a textbook
      // describes it, not how a parent describing their own child's
      // symptom would type it — kept alongside the natural first-person
      // form so both phrasings match (same class of fix as the earlier
      // "worst headache of YOUR life" bug).
      'unexplained bruising in a child', 'my child has unexplained bruising',
      'very pale skin in a child', 'my child looks very pale',
    ],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: 'summer',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_salmonella_food_poisoning', 'gastroenteritis'],
    recommendations: [
      'Start ORS to prevent dehydration',
      'Avoid antibiotics and anti-diarrheal drugs unless prescribed — can worsen certain E. coli strains',
      'Rest and eat bland food as tolerated',
      'Seek emergency care for bloody diarrhea or reduced urination, especially in children',
      'Practice good hand hygiene and food safety to prevent spread',
    ],
  },

  {
    id: 'bacterial_hpylori',
    name: 'H. pylori Infection',
    category: 'Infectious - Bacterial',
    aliases: ['helicobacter pylori'],
    symptoms: {
      primary: [
        { name: 'burning stomach pain', weight: 0.7, description: 'Often worse on an empty stomach' },
        { name: 'bloating', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'loss of appetite', weight: 0.3, description: '—' },
        { name: 'belching', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain relieved by eating', weight: 0.5, description: 'Suggests duodenal ulcer association' },
        // Moved out of red_flags: this entry's own max severity is
        // emergency only for actual GI bleeding signs (black stools /
        // vomiting blood, below). Unexplained weight loss and new
        // difficulty swallowing are real gastric-cancer screening flags —
        // worth a prompt workup — but not independently an ambulance-now
        // emergency, and as bare red_flags they were forcing
        // urgency:'emergency' on unrelated entries too (e.g. a fibromyalgia
        // description mentioning unexplained weight loss) via cross-disease
        // scoring, since checkRedFlags() runs against every DB entry.
        { name: 'unexplained weight loss', weight: 0.4, description: 'Warrants prompt evaluation to rule out malignancy' },
        { name: 'difficulty swallowing', weight: 0.4, description: 'New/progressive — warrants prompt evaluation' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, intermittent symptoms over months', chronic: '> 30 days of symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild intermittent stomach discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Persistent burning pain affecting daily life', urgency: 'see-doctor-soon' },
      severe: { description: 'Black stools or vomiting blood — bleeding ulcer', urgency: 'emergency' },
    },
    risk_factors: ['contaminated food or water', 'family history', 'crowded living conditions'],
    red_flags: ['black tarry stools', 'vomiting blood or coffee-ground material'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['peptic_ulcer', 'gastritis', 'gerd'],
    recommendations: [
      'See a gastroenterologist for a urea breath test or stool antigen test',
      'Complete the full prescribed antibiotic + PPI combination therapy',
      'Avoid NSAIDs, alcohol, and spicy food during treatment',
      'Retest after treatment to confirm eradication',
      'Seek emergency care for black stools or vomiting blood',
    ],
  },

  {
    id: 'bacterial_cellulitis',
    name: 'Cellulitis',
    category: 'Infectious - Bacterial',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'skin redness', weight: 0.8, description: 'Warm, tender, spreading area of skin' },
        { name: 'skin swelling', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.4, description: 'May develop with worsening infection' },
        { name: 'skin pain', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'spreading border', weight: 0.6, description: 'Redness expands over hours to days, often with a defined edge' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '7-10 days with antibiotics', chronic: null },
    severity_levels: {
      mild: { description: 'Small area of redness without fever', urgency: 'see-doctor-soon' },
      moderate: { description: 'Spreading redness with fever', urgency: 'see-doctor-today' },
      severe: { description: 'Rapidly spreading with severe pain, blistering, or systemic illness', urgency: 'emergency' },
    },
    risk_factors: ['skin break or wound', 'diabetes', 'poor circulation', 'obesity', 'recent skin infection'],
    red_flags: ['rapidly spreading redness', 'severe pain out of proportion', 'high fever with chills', 'blistering or blackened skin'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['impetigo', 'deep_vein_thrombosis'],
    recommendations: [
      'See a doctor promptly for antibiotic treatment',
      'Keep the affected limb elevated to reduce swelling',
      'Mark the border of redness with a pen to monitor spread',
      'Complete the full antibiotic course even if it improves quickly',
      'Seek emergency care for rapid spread, severe pain, or high fever',
    ],
  },

  {
    id: 'bacterial_impetigo',
    name: 'Impetigo',
    category: 'Infectious - Bacterial',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'honey-colored crusted sores', weight: 0.85, description: 'Characteristic golden-yellow crust' },
        { name: 'skin blisters', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'itching', weight: 0.4, description: '—' },
        { name: 'lymph node swelling', weight: 0.3, description: 'Nearby nodes' },
      ],
      differentiating: [
        { name: 'face and hands location', weight: 0.5, description: 'Commonly affects face, especially around nose/mouth' },
        // Moved out of red_flags: this entry never reaches emergency-tier
        // severity (max is see-doctor-today), so a matched red_flag would
        // over-escalate. ('fever with spreading sores' was already
        // matchable before this pass and had the same mismatch — fixed
        // here too, not part of the original prose bug.)
        { name: 'fever with spreading sores', weight: 0.6, description: '—' },
        { name: 'warmth and spreading redness', weight: 0.5, description: 'Suggests deeper skin infection (cellulitis)' },
      ],
    },
    duration_patterns: { acute: '< 10 days', typical: '7-10 days with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Few small sores', urgency: 'see-doctor-soon' },
      moderate: { description: 'Multiple spreading sores', urgency: 'see-doctor-soon' },
      severe: { description: 'Widespread with fever, or signs of deeper skin infection', urgency: 'see-doctor-today' },
    },
    risk_factors: ['children', 'close contact/school setting', 'minor skin injury', 'warm humid climate'],
    red_flags: [],
    specialist: 'Dermatologist',
    india_prevalence: 'high',
    seasonal_pattern: 'summer',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['viral_chickenpox', 'bacterial_cellulitis'],
    recommendations: [
      'Apply prescribed topical or oral antibiotics as directed',
      'Keep the area clean and covered to prevent spread',
      'Avoid scratching and keep nails trimmed',
      'Wash towels and clothing separately in hot water',
      'Keep the child home from school until lesions are healing/covered',
    ],
  },
]

export default bacterial

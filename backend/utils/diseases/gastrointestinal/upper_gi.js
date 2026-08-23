export const upper_gi = [
  {
    id: 'gi_gerd',
    name: 'GERD (Acid Reflux)',
    category: 'Gastrointestinal - Upper',
    aliases: ['acid reflux', 'gastroesophageal reflux disease'],
    symptoms: {
      primary: [
        { name: 'acid reflux', weight: 0.85, description: 'Burning sensation rising from stomach to chest' },
        { name: 'bloating', weight: 0.4, description: '—' },
      ],
      secondary: [
        { name: 'belching', weight: 0.4, description: '—' },
        { name: 'sour taste', weight: 0.4, description: '—' },
        { name: 'throat burn', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'worse lying down', weight: 0.6, description: 'Symptoms worsen after eating or when lying flat' },
        // Moved out of red_flags: these are real "get it checked" alarm
        // signs (dysphagia/weight loss → rule out stricture or malignancy;
        // nocturnal heartburn → more severe reflux), but none is an
        // independent same-day emergency the way vomiting blood is —
        // bare, they were forcing urgency:'emergency' DB-wide via
        // cross-disease scoring (checkRedFlags runs against every entry),
        // e.g. hijacking unrelated symptom descriptions that happened to
        // mention weight loss.
        { name: 'difficulty swallowing', weight: 0.4, description: 'New/progressive — warrants prompt evaluation' },
        { name: 'unexplained weight loss', weight: 0.4, description: 'Warrants prompt evaluation to rule out malignancy' },
        { name: 'heartburn waking you from sleep regularly', weight: 0.3, description: 'Marker of more severe reflux' },
      ],
    },
    duration_patterns: { acute: '< 7 days episode', typical: 'recurrent, chronic condition', chronic: '> 60 days of recurring symptoms warrants evaluation' },
    severity_levels: {
      mild: { description: 'Occasional heartburn after meals', urgency: 'self-care' },
      moderate: { description: 'Heartburn more than twice a week', urgency: 'see-doctor-soon' },
      severe: { description: 'Difficulty swallowing, unexplained weight loss, or vomiting blood', urgency: 'emergency' },
    },
    risk_factors: ['spicy or oily food', 'obesity', 'smoking', 'irregular meal timing', 'pregnancy'],
    red_flags: ['vomiting blood'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['gi_peptic_ulcer', 'gi_gastritis', 'angina'],
    recommendations: [
      'Eat smaller, more frequent meals; avoid very spicy and oily food',
      'Do not lie down within 2 hours of eating; elevate the head of the bed',
      'Take an antacid for immediate relief',
      'Avoid tea, coffee, and cola on an empty stomach',
      'See a gastroenterologist if symptoms occur more than twice a week or swallowing becomes difficult',
    ],
  },

  {
    id: 'gi_gastritis',
    name: 'Gastritis',
    category: 'Gastrointestinal - Upper',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'epigastric pain', weight: 0.7, description: 'Upper abdominal discomfort' },
        { name: 'nausea', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'bloating', weight: 0.4, description: '—' },
        { name: 'loss of appetite', weight: 0.4, description: '—' },
        { name: 'vomiting', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain after eating', weight: 0.4, description: '—' },
        // Moved out of red_flags — see gi_gerd above for the same
        // reasoning: real alarm signs, not independent same-day
        // emergencies, and bare they were hijacking unrelated symptom
        // descriptions DB-wide.
        { name: 'rapid weight loss', weight: 0.4, description: 'Warrants prompt evaluation to rule out malignancy' },
        { name: 'difficulty swallowing', weight: 0.4, description: 'New/progressive — warrants prompt evaluation' },
        { name: 'persistent vomiting', weight: 0.3, description: 'Risk of dehydration if prolonged' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '1-2 weeks with treatment', chronic: '> 14 days suggests chronic gastritis' },
    severity_levels: {
      mild: { description: 'Mild discomfort after meals', urgency: 'self-care' },
      moderate: { description: 'Persistent pain affecting appetite', urgency: 'see-doctor-soon' },
      severe: { description: 'Black stools, vomiting blood, or rapid weight loss', urgency: 'emergency' },
    },
    risk_factors: ['NSAID use', 'alcohol use', 'H. pylori infection', 'spicy food', 'stress'],
    red_flags: ['blood in vomit or black tarry stools'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['gi_peptic_ulcer', 'gi_gerd', 'bacterial_hpylori'],
    recommendations: [
      'Avoid NSAIDs, alcohol, and spicy food',
      'Eat small, regular meals — do not skip meals',
      'See a gastroenterologist for H. pylori testing and possible endoscopy',
      'Take prescribed proton pump inhibitors as directed',
      'Seek emergency care for black stools or vomiting blood',
    ],
  },

  {
    id: 'gi_peptic_ulcer',
    name: 'Peptic Ulcer',
    category: 'Gastrointestinal - Upper',
    aliases: ['stomach ulcer', 'duodenal ulcer'],
    symptoms: {
      primary: [
        { name: 'burning stomach pain', weight: 0.8, description: 'Often on an empty stomach' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'bloating', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain relieved by eating', weight: 0.5, description: 'Suggests duodenal ulcer' },
        { name: 'black stool', weight: 0.7, description: 'Indicates bleeding ulcer' },
        // Moved out of red_flags — same reasoning as gi_gerd/gi_gastritis
        // above: not an independent same-day emergency, and bare it was
        // hijacking unrelated symptom descriptions DB-wide.
        { name: 'unexplained weight loss', weight: 0.4, description: 'Warrants prompt evaluation to rule out malignancy' },
      ],
    },
    duration_patterns: { acute: null, typical: 'weeks to months of intermittent pain', chronic: '> 30 days is typical presentation' },
    severity_levels: {
      mild: { description: 'Mild intermittent burning pain', urgency: 'see-doctor-soon' },
      moderate: { description: 'Persistent pain affecting eating/sleep', urgency: 'see-doctor-soon' },
      severe: { description: 'Black stools, vomiting blood, or sudden severe pain (possible perforation)', urgency: 'emergency' },
    },
    risk_factors: ['NSAID use', 'H. pylori infection', 'smoking', 'alcohol use', 'stress'],
    red_flags: ['black tarry stools', 'vomiting blood or coffee-ground material', 'sudden severe abdominal pain'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['gi_gastritis', 'gi_gerd', 'bacterial_hpylori'],
    recommendations: [
      'See a gastroenterologist for endoscopy and H. pylori testing',
      'Avoid NSAIDs (ibuprofen, aspirin) — use paracetamol instead if pain relief needed',
      'Eat small, regular meals; avoid alcohol and smoking',
      'Take prescribed proton pump inhibitors as directed',
      'Go to emergency care immediately if you see black stool or vomit blood — indicates a bleeding ulcer',
    ],
  },

  {
    id: 'gi_esophagitis',
    name: 'Esophagitis',
    category: 'Gastrointestinal - Upper',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'difficulty swallowing', weight: 0.7, description: '—' },
        { name: 'chest pain', weight: 0.5, description: 'Behind the breastbone' },
      ],
      secondary: [
        { name: 'acid reflux', weight: 0.5, description: 'Often the underlying cause' },
        { name: 'painful swallowing', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'food getting stuck', weight: 0.6, description: 'Sensation of food sticking while swallowing' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '2-4 weeks with treatment', chronic: '> 30 days suggests need for endoscopy' },
    severity_levels: {
      mild: { description: 'Mild discomfort swallowing', urgency: 'see-doctor-soon' },
      moderate: { description: 'Persistent painful swallowing', urgency: 'see-doctor-soon' },
      severe: { description: 'Complete inability to swallow, or vomiting blood', urgency: 'emergency' },
    },
    risk_factors: ['chronic GERD', 'certain medications taken without water', 'immunocompromised (candida esophagitis)'],
    red_flags: ['complete inability to swallow', 'vomiting blood', 'severe chest pain'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['gi_gerd', 'fungal_oral_candidiasis'],
    recommendations: [
      'See a gastroenterologist — endoscopy may be needed to determine the cause',
      'Take medications with plenty of water and remain upright afterward',
      'Manage underlying GERD with diet and medication',
      'Avoid very hot, spicy, or acidic foods during flares',
      'Seek emergency care for complete inability to swallow or vomiting blood',
    ],
  },

  {
    id: 'gi_dyspepsia',
    name: 'Functional Dyspepsia (Indigestion)',
    category: 'Gastrointestinal - Upper',
    aliases: ['indigestion'],
    symptoms: {
      primary: [
        { name: 'bloating', weight: 0.6, description: 'After meals' },
        { name: 'epigastric pain', weight: 0.5, description: 'Mild to moderate' },
      ],
      secondary: [
        { name: 'belching', weight: 0.4, description: '—' },
        { name: 'nausea', weight: 0.3, description: '—' },
        { name: 'loss of appetite', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'early fullness', weight: 0.5, description: 'Feeling full quickly after starting a meal' },
        // Moved out of red_flags: this entry's own worst tier is
        // 'see-doctor-soon' — it never reaches emergency at all, yet a
        // bare match here was forcing urgency:'emergency' via
        // cross-disease scoring. None of these are an acute same-day
        // danger for dyspepsia specifically.
        { name: 'unexplained weight loss', weight: 0.4, description: 'Needs evaluation to exclude other causes' },
        { name: 'persistent vomiting', weight: 0.3, description: 'Needs evaluation to exclude other causes' },
        { name: 'difficulty swallowing', weight: 0.4, description: 'Needs evaluation to exclude other causes' },
        { name: 'onset after age 50', weight: 0.3, description: 'New dyspepsia after 50 warrants workup' },
      ],
    },
    duration_patterns: { acute: null, typical: 'recurrent over months', chronic: '> 90 days recurrent symptoms typical' },
    severity_levels: {
      mild: { description: 'Occasional bloating after large meals', urgency: 'self-care' },
      moderate: { description: 'Frequent discomfort affecting appetite', urgency: 'see-doctor-soon' },
      severe: { description: 'Associated with weight loss or vomiting — needs evaluation to exclude other causes', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['irregular meal timing', 'stress', 'spicy/oily food', 'smoking'],
    red_flags: [],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['gi_gastritis', 'gi_ibs', 'gi_gerd'],
    recommendations: [
      'Eat smaller, more frequent meals and eat slowly',
      'Avoid spicy, oily, and fried food',
      'Manage stress through relaxation techniques',
      'Try an antacid or prescribed medication for symptom relief',
      'See a gastroenterologist if symptoms persist beyond a few weeks or occur with weight loss',
    ],
  },

  {
    id: 'gi_hiatal_hernia',
    name: 'Hiatal Hernia',
    category: 'Gastrointestinal - Upper',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'acid reflux', weight: 0.6, description: 'Often significant' },
        { name: 'chest pain', weight: 0.4, description: 'Can mimic cardiac pain' },
      ],
      secondary: [
        { name: 'belching', weight: 0.3, description: '—' },
        { name: 'bloating', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'worse lying down', weight: 0.5, description: 'Reflux symptoms significantly worse when supine' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, often incidental finding', chronic: '> 90 days ongoing symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild reflux symptoms', urgency: 'self-care' },
      moderate: { description: 'Frequent reflux affecting quality of life', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe chest pain, vomiting, or inability to pass gas/stool (strangulated hernia)', urgency: 'emergency' },
    },
    risk_factors: ['obesity', 'pregnancy', 'age over 50', 'chronic coughing or straining'],
    red_flags: ['severe chest pain', 'vomiting with inability to pass gas or stool', 'signs mimicking a heart attack'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['gi_gerd', 'angina'],
    recommendations: [
      'Manage reflux symptoms with diet modification and medication',
      'Avoid lying down immediately after eating',
      'Maintain a healthy weight',
      'See a gastroenterologist if symptoms are severe or persistent — surgery may be an option',
      'Seek emergency care for severe chest pain or inability to pass gas/stool',
    ],
  },

  {
    id: 'gi_gastroparesis',
    name: 'Gastroparesis',
    category: 'Gastrointestinal - Upper',
    aliases: ['delayed gastric emptying'],
    symptoms: {
      primary: [
        { name: 'early fullness', weight: 0.7, description: 'After small amounts of food' },
        { name: 'nausea', weight: 0.7, description: 'Chronic' },
      ],
      secondary: [
        { name: 'bloating', weight: 0.5, description: '—' },
        { name: 'vomiting undigested food', weight: 0.5, description: 'Hours after eating' },
      ],
      differentiating: [
        { name: 'diabetes history', weight: 0.6, description: 'Diabetic neuropathy is a leading cause' },
        // Moved out of red_flags: dehydration and inability to keep
        // anything down are the genuine acute dangers here (both stay
        // below) — weight loss reflects chronic malnutrition, not a
        // same-day emergency by itself.
        { name: 'significant weight loss', weight: 0.4, description: 'Reflects chronic inadequate nutrition' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, waxing and waning', chronic: '> 90 days ongoing symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild early fullness and occasional nausea', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent vomiting affecting nutrition', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe dehydration, inability to keep any food/fluids down', urgency: 'emergency' },
    },
    risk_factors: ['diabetes (especially long-standing)', 'previous abdominal surgery', 'certain neurological conditions'],
    red_flags: ['severe dehydration', 'inability to tolerate any oral intake'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['gi_dyspepsia', 'diabetes_type2'],
    recommendations: [
      'See a gastroenterologist for gastric emptying studies',
      'Eat small, frequent, low-fat, low-fiber meals',
      'Optimize blood sugar control if diabetic',
      'Prescribed prokinetic medications may help gastric emptying',
      'Seek emergency care for severe dehydration or inability to tolerate any intake',
    ],
  },

  {
    id: 'gi_achalasia',
    name: 'Achalasia',
    category: 'Gastrointestinal - Upper',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'difficulty swallowing', weight: 0.85, description: 'Both solids and liquids, progressive' },
        { name: 'regurgitation', weight: 0.6, description: 'Of undigested food' },
      ],
      secondary: [
        { name: 'chest pain', weight: 0.4, description: '—' },
        { name: 'weight loss', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'difficulty with both solids and liquids', weight: 0.6, description: 'Distinguishes from a mechanical obstruction, which typically affects solids first' },
        // "significant unintended weight loss" moved here — a gradual
        // concern matching this entry's own see-doctor-today tier, not an
        // acute emergency.
        { name: 'significant unintended weight loss', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: null, typical: 'progressive over months to years', chronic: '> 90 days progressive symptoms typical' },
    severity_levels: {
      mild: { description: 'Occasional difficulty swallowing solids', urgency: 'see-doctor-soon' },
      moderate: { description: 'Regular regurgitation and swallowing difficulty', urgency: 'see-doctor-soon' },
      severe: { description: 'Significant weight loss or aspiration symptoms (coughing while eating)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['age 25-60', 'unknown cause in most cases (idiopathic)'],
    // "coughing or choking while eating" / "complete inability to swallow"
    // kept — active aspiration risk and total swallowing failure are
    // independently dangerous (aspiration pneumonia, inability to manage
    // own saliva) regardless of achalasia's usual chronicity.
    red_flags: ['coughing or choking while eating', 'complete inability to swallow'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['gi_esophagitis', 'esophageal_cancer_warning'],
    recommendations: [
      'See a gastroenterologist for manometry and endoscopy to confirm diagnosis',
      'Eat slowly and chew thoroughly',
      'Treatment options include balloon dilation, surgery (myotomy), or medication depending on severity',
      'Avoid lying down immediately after eating',
      'Seek prompt care for significant weight loss or aspiration symptoms',
    ],
  },
]

export default upper_gi

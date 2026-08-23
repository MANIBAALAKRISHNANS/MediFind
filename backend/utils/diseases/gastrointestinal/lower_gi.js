export const lower_gi = [
  {
    id: 'gi_gastroenteritis',
    name: 'Gastroenteritis (Stomach Flu)',
    category: 'Gastrointestinal - Lower',
    aliases: ['stomach flu', 'stomach bug'],
    symptoms: {
      primary: [
        { name: 'diarrhea', weight: 0.9, description: 'Watery, frequent' },
        { name: 'abdominal pain', weight: 0.6, description: 'Cramping' },
        { name: 'vomiting', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'mild fever', weight: 0.4, description: '—' },
        { name: 'weakness', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'contaminated water exposure', weight: 0.4, description: 'Common source — food or water' },
        // Moved out of red_flags: entry's own max is see-doctor-today —
        // dehydration signs here are already covered by that tier.
        { name: 'sunken eyes or no urination for 8 hours', weight: 0.5, description: 'Signs of significant dehydration' },
      ],
    },
    duration_patterns: { acute: '< 5 days', typical: '2-4 days', chronic: '> 14 days suggests a different cause (parasitic, IBD, etc.)' },
    severity_levels: {
      mild: { description: 'A few loose stools without dehydration', urgency: 'self-care' },
      moderate: { description: 'Frequent diarrhea and vomiting', urgency: 'see-doctor-soon' },
      severe: { description: 'Signs of dehydration, blood in stool, or inability to keep fluids down', urgency: 'see-doctor-today' },
    },
    risk_factors: ['ate raw or street food', 'contaminated water exposure', 'contact with an infected person', 'monsoon season'],
    red_flags: ['more than 10 loose stools per day', 'blood or mucus in stool', 'severe vomiting preventing any fluid intake'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['gi_food_poisoning', 'bacterial_salmonella_food_poisoning', 'parasitic_amoebiasis', 'bacterial_cholera'],
    recommendations: [
      'Drink ORS after every loose stool — this is the most important treatment',
      'Eat small amounts of easily digestible food — khichdi, curd rice, bananas, toast',
      'Avoid dairy, oily, or spicy food until fully recovered',
      'See a doctor if diarrhea continues more than 2 days or you cannot keep fluids down',
      'Go to hospital if you cannot keep any fluids down, see blood in stool, or feel very weak and dizzy',
    ],
  },

  {
    id: 'gi_food_poisoning',
    name: 'Food Poisoning',
    category: 'Gastrointestinal - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'vomiting', weight: 0.8, description: 'Sudden onset, within hours of eating' },
        { name: 'diarrhea', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'abdominal cramps', weight: 0.5, description: '—' },
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'fever', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'ate raw or street food', weight: 0.6, description: 'Symptoms begin within 1-6 hours of eating a specific contaminated meal' },
      ],
    },
    duration_patterns: { acute: '< 3 days', typical: '1-2 days', chronic: null },
    severity_levels: {
      mild: { description: 'Mild vomiting and diarrhea, improving within a day', urgency: 'self-care' },
      moderate: { description: 'Persistent vomiting and diarrhea', urgency: 'see-doctor-soon' },
      severe: { description: 'Blood in vomit or stool, high fever, or severe dehydration', urgency: 'emergency' },
    },
    risk_factors: ['ate raw or street food', 'undercooked meat/eggs', 'leftover food not refrigerated'],
    red_flags: ['blood in vomit or stool', 'fever above 101°F', 'severe abdominal pain', 'signs of dehydration'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'summer',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['gi_gastroenteritis', 'bacterial_salmonella_food_poisoning', 'bacterial_ecoli_infection'],
    recommendations: [
      'Stop eating solid food for 4-6 hours; sip ORS or clear liquids constantly',
      'Resume eating with bland foods — curd rice, khichdi, bananas',
      'Do not take anti-diarrheal tablets unless advised by a doctor',
      'See a doctor if vomiting is persistent or blood appears in stool',
      'Go to a clinic if symptoms do not start improving within 24 hours',
    ],
  },

  {
    id: 'gi_ibs',
    name: 'Irritable Bowel Syndrome (IBS)',
    category: 'Gastrointestinal - Lower',
    aliases: ['ibs'],
    symptoms: {
      primary: [
        { name: 'abdominal cramps', weight: 0.7, description: 'Relieved by defecation' },
        { name: 'bloating', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'alternating diarrhea constipation', weight: 0.5, description: '—' },
        { name: 'mucus in stool', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain relieved by defecation', weight: 0.6, description: 'Characteristic of functional bowel disorder' },
        { name: 'stress-related worsening', weight: 0.4, description: '—' },
        // Moved out of red_flags: this entry's own worst tier is
        // 'see-doctor-today' (it has no 'emergency' tier at all) — none of
        // these are an acute same-day danger, they're colorectal-cancer
        // screening flags warranting exclusion of other causes. Bare, they
        // were forcing urgency:'emergency' via cross-disease scoring on
        // any input mentioning them, for a condition that never reaches
        // emergency itself.
        { name: 'blood in stool', weight: 0.5, description: 'Needs exclusion of other causes' },
        { name: 'unexplained weight loss', weight: 0.4, description: 'Needs exclusion of other causes' },
        { name: 'anemia', weight: 0.3, description: '—' },
        { name: 'onset after age 50', weight: 0.3, description: 'New IBS-like symptoms after 50 warrant workup' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, recurrent over months', chronic: '> 90 days is diagnostic criterion' },
    severity_levels: {
      mild: { description: 'Mild intermittent bloating and cramping', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent symptoms affecting daily activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Symptoms with blood in stool, weight loss, or onset after age 50 — needs exclusion of other causes', urgency: 'see-doctor-today' },
    },
    risk_factors: ['stress', 'spicy diet', 'irregular meals', 'family history', 'previous gut infection'],
    red_flags: [],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['gi_ibd', 'celiac_disease', 'lactose_intolerance'],
    recommendations: [
      'Keep a food diary to identify personal triggers',
      'Try a low-FODMAP diet for 6-8 weeks under guidance',
      'Manage stress through relaxation techniques and regular exercise',
      'See a gastroenterologist to exclude other causes, especially if red flags are present',
      'Prescribed antispasmodics or fiber supplements may help specific symptoms',
    ],
  },

  {
    id: 'gi_ibd',
    name: 'Inflammatory Bowel Disease (Crohn\'s/Ulcerative Colitis)',
    category: 'Gastrointestinal - Lower',
    aliases: ['crohns disease', 'ulcerative colitis', 'ibd'],
    symptoms: {
      primary: [
        { name: 'diarrhea', weight: 0.75, description: 'Often chronic, may contain blood' },
        { name: 'abdominal pain', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'weight loss', weight: 0.5, description: '—' },
        { name: 'fatigue', weight: 0.4, description: '—' },
        { name: 'blood in stool', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'chronic diarrhea with blood', weight: 0.7, description: 'Persistent, distinguishes from infectious causes' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, relapsing-remitting', chronic: '> 30 days of symptoms warrants evaluation' },
    severity_levels: {
      mild: { description: 'Mild intermittent diarrhea and cramping', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent bloody diarrhea with weight loss', urgency: 'see-doctor-today' },
      severe: { description: 'Severe abdominal pain with distension, high fever, or heavy bleeding', urgency: 'emergency' },
    },
    risk_factors: ['family history', 'smoking (Crohn\'s)', 'young adult age', 'Western diet pattern'],
    red_flags: ['severe abdominal pain with distension', 'heavy rectal bleeding', 'high fever with bloody diarrhea', 'signs of bowel obstruction'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['gi_ibs', 'amoebiasis', 'celiac_disease'],
    recommendations: [
      'See a gastroenterologist for colonoscopy and blood tests to confirm diagnosis',
      'Take prescribed anti-inflammatory or immunosuppressive medications as directed',
      'Work with a dietitian to identify trigger foods',
      'Monitor for nutritional deficiencies with regular blood tests',
      'Seek emergency care for severe pain with distension or heavy bleeding',
    ],
  },

  {
    id: 'gi_appendicitis',
    name: 'Appendicitis',
    category: 'Gastrointestinal - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'lower right abdominal pain', weight: 0.9, description: 'Pain that migrates from around the navel to lower right' },
        { name: 'loss of appetite', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.5, description: '—' },
        { name: 'vomiting', weight: 0.4, description: '—' },
        { name: 'fever', weight: 0.4, description: 'Low-grade' },
      ],
      differentiating: [
        { name: 'rebound tenderness', weight: 0.7, description: 'Pain worse when pressure is released, not applied' },
        { name: 'pain worse with movement', weight: 0.5, description: 'Walking or coughing increases pain' },
      ],
    },
    duration_patterns: { acute: '< 2 days onset', typical: '24-48 hours before rupture risk rises', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always requires urgent evaluation', urgency: 'emergency' },
      moderate: { description: 'Classic migrating pain with nausea', urgency: 'emergency' },
      severe: { description: 'Sudden worsening pain over entire abdomen (possible rupture), rigid abdomen', urgency: 'emergency' },
    },
    risk_factors: ['age 10-30 most common', 'family history'],
    red_flags: ['sudden severe pain spreading across the whole abdomen', 'rigid board-like abdomen', 'high fever with severe pain', 'inability to walk upright'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['ovarian_cyst', 'kidney_stones', 'gastroenteritis'],
    recommendations: [
      'Go to the emergency room immediately — this is a surgical emergency',
      'Do not eat or drink anything — surgery may be needed',
      'Do not take painkillers before being seen — they can mask worsening symptoms',
      'Ultrasound or CT scan will be needed to confirm',
      'This is an emergency — go to hospital now without delay',
    ],
  },

  {
    id: 'gi_diverticulitis',
    name: 'Diverticulitis',
    category: 'Gastrointestinal - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'lower left abdomen pain', weight: 0.8, description: '—' },
        { name: 'fever', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'constipation', weight: 0.3, description: '—' },
        { name: 'bloating', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'localized left-sided pain', weight: 0.5, description: 'Contrasts with right-sided appendicitis pain' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '7-10 days with treatment', chronic: '> 90 days recurrent episodes suggest chronic diverticular disease' },
    severity_levels: {
      mild: { description: 'Mild pain without fever', urgency: 'see-doctor-today' },
      moderate: { description: 'Pain with fever', urgency: 'see-doctor-today' },
      severe: { description: 'Rigid abdomen, high fever, or signs of perforation/abscess', urgency: 'emergency' },
    },
    risk_factors: ['low-fiber diet', 'age over 50', 'obesity', 'sedentary lifestyle'],
    red_flags: ['rigid or severely tender abdomen', 'high fever with severe pain', 'inability to pass gas or stool'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['gi_appendicitis', 'gi_ibd'],
    recommendations: [
      'See a doctor today — imaging is needed to confirm and assess severity',
      'Follow a clear liquid or low-residue diet during acute flare as advised',
      'Complete the prescribed antibiotic course if given',
      'Increase dietary fiber gradually once the acute episode resolves, to prevent recurrence',
      'Seek emergency care for rigid abdomen or high fever with severe pain',
    ],
  },

  {
    id: 'gi_colorectal_warning',
    name: 'Colorectal Cancer — Warning Signs (Awareness)',
    category: 'Gastrointestinal - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'blood in stool', weight: 0.7, description: 'Especially if persistent or unexplained' },
        { name: 'change in bowel habits', weight: 0.6, description: 'Persistent, new pattern' },
      ],
      secondary: [
        { name: 'abdominal pain', weight: 0.4, description: '—' },
        { name: 'unexplained weight loss', weight: 0.5, description: '—' },
        { name: 'fatigue', weight: 0.3, description: 'Due to anemia' },
      ],
      differentiating: [
        { name: 'age over 45', weight: 0.5, description: 'Risk rises significantly with age' },
        { name: 'family history', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: null, typical: 'symptoms often develop gradually over months', chronic: '> 30 days of unexplained symptoms warrants evaluation' },
    severity_levels: {
      mild: { description: 'Occasional minor rectal bleeding — still warrants evaluation', urgency: 'see-doctor-soon' },
      moderate: { description: 'Persistent change in bowel habits with bleeding', urgency: 'see-doctor-today' },
      severe: { description: 'Significant bleeding, severe abdominal pain, or bowel obstruction signs', urgency: 'emergency' },
    },
    risk_factors: ['age over 45', 'family history of colorectal cancer', 'low-fiber high-fat diet', 'smoking', 'inflammatory bowel disease history'],
    red_flags: ['significant rectal bleeding', 'severe abdominal pain with distension', 'inability to pass stool or gas'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['hemorrhoids', 'anal_fissure', 'gi_ibd'],
    recommendations: [
      'See a gastroenterologist promptly for evaluation — colonoscopy is the key diagnostic test',
      'Do not assume rectal bleeding is only from hemorrhoids without evaluation, especially after age 45',
      'This is informational only — early detection significantly improves outcomes',
      'Discuss screening colonoscopy with your doctor if over 45 or with family history',
      'Seek emergency care for severe bleeding or bowel obstruction symptoms',
    ],
  },

  {
    id: 'gi_hemorrhoids',
    name: 'Hemorrhoids (Piles)',
    category: 'Gastrointestinal - Lower',
    aliases: ['piles'],
    symptoms: {
      primary: [
        { name: 'blood in stool', weight: 0.7, description: 'Bright red, on toilet paper or in the bowl' },
        { name: 'anal itching', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'anal pain', weight: 0.4, description: 'Especially with thrombosed hemorrhoids' },
        { name: 'anal lump', weight: 0.4, description: 'Prolapsing tissue' },
      ],
      differentiating: [
        { name: 'straining at stool', weight: 0.4, description: 'Common precipitating factor' },
      ],
    },
    duration_patterns: { acute: '< 7 days flare', typical: 'chronic, recurrent', chronic: '> 30 days recurrent symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild bleeding without pain', urgency: 'see-doctor-soon' },
      moderate: { description: 'Bleeding with prolapse or discomfort', urgency: 'see-doctor-soon' },
      severe: { description: 'Heavy bleeding, thrombosed painful hemorrhoid, or bleeding after age 50 (needs colonoscopy to exclude other causes)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['low-fiber diet', 'chronic constipation', 'pregnancy', 'prolonged sitting', 'straining'],
    red_flags: ['heavy rectal bleeding', 'severe thrombosed lump', 'new rectal bleeding after age 50'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['anal_fissure', 'gi_colorectal_warning'],
    recommendations: [
      'Increase dietary fiber and fluid intake',
      'Take a warm sitz bath for 10-15 minutes twice daily',
      'Avoid prolonged sitting on the toilet and straining',
      'Use over-the-counter hemorrhoid creams for symptom relief',
      'See a doctor for heavy bleeding, a painful thrombosed lump, or if bleeding starts after age 50',
    ],
  },

  {
    id: 'gi_anal_fissure',
    name: 'Anal Fissure',
    category: 'Gastrointestinal - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'anal pain', weight: 0.85, description: 'Sharp, severe, especially during and after bowel movements' },
        { name: 'blood in stool', weight: 0.6, description: 'Bright red, small amount' },
      ],
      secondary: [
        { name: 'anal itching', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain with defecation', weight: 0.7, description: 'Severe sharp pain during bowel movement is highly characteristic' },
        // Moved out of red_flags: an abscess needs same-day treatment, not
        // an ambulance — entry's own max is see-doctor-soon.
        { name: 'pus with fever', weight: 0.5, description: 'Suggests a developing abscess' },
      ],
    },
    duration_patterns: { acute: '< 42 days', typical: '2-6 weeks with treatment', chronic: '> 42 days suggests chronic fissure' },
    severity_levels: {
      mild: { description: 'Mild discomfort with bowel movements', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant pain affecting daily activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Chronic fissure not responding to conservative treatment', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['chronic constipation', 'hard stools', 'childbirth', 'low-fiber diet'],
    // "heavy bleeding" kept — uncontrolled/heavy rectal bleeding is
    // independently dangerous (anemia, shock risk) regardless of how mild
    // the underlying fissure usually is; this was already matchable before
    // this pass.
    red_flags: ['heavy bleeding'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['gi_hemorrhoids'],
    recommendations: [
      'Increase fiber and fluid intake to soften stools',
      'Take warm sitz baths after bowel movements',
      'Use prescribed topical medication to relax the anal sphincter',
      'Avoid straining during bowel movements',
      'See a doctor if it doesn\'t improve within 6 weeks — further treatment may be needed',
    ],
  },

  {
    id: 'gi_chronic_constipation',
    name: 'Chronic Constipation',
    category: 'Gastrointestinal - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'constipation', weight: 0.85, description: 'Infrequent, hard stools' },
        { name: 'straining at stool', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'bloating', weight: 0.4, description: '—' },
        { name: 'abdominal discomfort', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'hard stools', weight: 0.4, description: '—' },
        // Moved out of red_flags: cancer-screening flags, not an acute
        // same-day danger — see gi_ibs above for the same reasoning.
        // "no bowel movement with severe abdominal distension" (possible
        // obstruction) stays a genuine red flag below.
        { name: 'blood in stool', weight: 0.5, description: 'Needs exclusion of other causes' },
        { name: 'unexplained weight loss', weight: 0.4, description: 'Needs exclusion of other causes' },
        { name: 'onset after age 50', weight: 0.3, description: 'New symptoms after 50 warrant workup' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, recurring pattern', chronic: '> 90 days is the diagnostic threshold' },
    severity_levels: {
      mild: { description: 'Occasional hard stools', urgency: 'self-care' },
      moderate: { description: 'Frequent straining and infrequent bowel movements', urgency: 'see-doctor-soon' },
      severe: { description: 'No bowel movement for many days with severe bloating/pain (possible obstruction)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['low-fiber diet', 'inadequate fluid intake', 'sedentary lifestyle', 'certain medications', 'hypothyroidism'],
    red_flags: ['no bowel movement with severe abdominal distension'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['gi_ibs', 'hypothyroidism'],
    recommendations: [
      'Increase dietary fiber gradually — fruits, vegetables, whole grains',
      'Drink at least 2-3 litres of water daily',
      'Exercise regularly — even daily walking helps bowel motility',
      'Try isabgol (psyllium husk) for added fiber',
      'See a doctor if constipation is new, severe, or accompanied by blood/weight loss',
    ],
  },

  {
    id: 'gi_chronic_diarrhea',
    name: 'Chronic Diarrhea',
    category: 'Gastrointestinal - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'diarrhea', weight: 0.85, description: 'Persistent, more than 4 weeks' },
      ],
      secondary: [
        { name: 'weight loss', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.3, description: '—' },
        { name: 'abdominal cramps', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'duration beyond 4 weeks', weight: 0.5, description: 'Distinguishes from acute infectious diarrhea' },
        // Moved out of red_flags: this entry's own worst tier is
        // see-doctor-today (no emergency tier at all) — weight loss here
        // reflects chronic malabsorption/malnutrition, not a same-day
        // danger.
        { name: 'significant weight loss', weight: 0.4, description: 'Reflects chronic malabsorption or underlying disease' },
      ],
    },
    duration_patterns: { acute: null, typical: 'by definition lasts > 4 weeks', chronic: '> 28 days is the diagnostic threshold' },
    severity_levels: {
      mild: { description: 'Mild intermittent loose stools', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent diarrhea affecting nutrition', urgency: 'see-doctor-soon' },
      severe: { description: 'Significant weight loss, dehydration, or blood in stool', urgency: 'see-doctor-today' },
    },
    risk_factors: ['celiac disease', 'IBD', 'lactose intolerance', 'chronic infection', 'IBS'],
    red_flags: ['blood in stool', 'severe dehydration', 'nighttime diarrhea waking from sleep'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['celiac_disease', 'gi_ibd', 'lactose_intolerance', 'gi_ibs'],
    recommendations: [
      'See a gastroenterologist for stool studies and blood tests to find the underlying cause',
      'Keep a food diary to identify potential triggers',
      'Stay well hydrated with ORS as needed',
      'Avoid self-medicating with long-term anti-diarrheal drugs without a diagnosis',
      'Seek prompt care for blood in stool or significant weight loss',
    ],
  },

  {
    id: 'gi_celiac_disease',
    name: 'Celiac Disease (Gluten Intolerance)',
    category: 'Gastrointestinal - Lower',
    aliases: ['celiac', 'gluten intolerance'],
    symptoms: {
      primary: [
        { name: 'chronic diarrhea', weight: 0.7, description: 'Often after eating wheat products' },
        { name: 'bloating', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'weight loss', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.4, description: 'Due to malabsorption/anemia' },
      ],
      differentiating: [
        { name: 'symptoms after wheat', weight: 0.6, description: 'Symptoms triggered by gluten-containing foods' },
        { name: 'anemia not responding to iron', weight: 0.5, description: 'Suggests malabsorption' },
        // Moved out of red_flags: entry's own max is see-doctor-today, and
        // "severe malnutrition/failure to thrive" is that exact tier, not
        // emergency. "anemia not responding to iron" was already a
        // duplicate of the differentiating entry above. Gluten ataxia is a
        // chronic/progressive complication, not an acute emergency.
        { name: 'severe malnutrition or failure to thrive in a child', weight: 0.5, description: '—' },
        { name: 'neurological symptoms', weight: 0.4, description: 'Suggests gluten ataxia' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, often under-diagnosed for years', chronic: '> 90 days recurrent symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild bloating after wheat consumption', urgency: 'see-doctor-soon' },
      moderate: { description: 'Chronic diarrhea with weight loss', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe malnutrition or failure to thrive in a child', urgency: 'see-doctor-today' },
    },
    risk_factors: ['family history', 'high wheat consumption diet', 'other autoimmune conditions'],
    red_flags: [],
    specialist: 'Gastroenterologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['gi_ibs', 'lactose_intolerance'],
    recommendations: [
      'See a gastroenterologist for anti-tTG antibody testing and possible biopsy',
      'A strict, lifelong gluten-free diet is the only treatment',
      'Replace wheat with rice, jowar, bajra, or ragi flour — all naturally gluten-free',
      'Check iron, B12, vitamin D, and folate levels for deficiencies',
      'Read food labels carefully — gluten hides in sauces and processed foods',
    ],
  },

  {
    id: 'gi_lactose_intolerance',
    name: 'Lactose Intolerance',
    category: 'Gastrointestinal - Lower',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'bloating', weight: 0.7, description: 'After consuming dairy' },
        { name: 'diarrhea', weight: 0.6, description: 'After consuming dairy' },
      ],
      secondary: [
        { name: 'abdominal cramps', weight: 0.5, description: '—' },
        { name: 'gas', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'symptoms after dairy', weight: 0.6, description: 'Clear temporal relationship with milk/dairy consumption' },
      ],
    },
    duration_patterns: { acute: '< 1 day per episode', typical: 'symptoms within 30 min - 2 hours of dairy intake', chronic: null },
    severity_levels: {
      mild: { description: 'Mild bloating with dairy', urgency: 'self-care' },
      moderate: { description: 'Significant diarrhea and cramping with dairy', urgency: 'see-doctor-soon' },
      severe: { description: 'Not applicable — this is a manageable dietary condition, not dangerous', urgency: 'self-care' },
    },
    risk_factors: ['Asian ethnicity (higher prevalence)', 'family history', 'certain gut infections (secondary lactose intolerance)'],
    red_flags: [],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['gi_ibs', 'gi_celiac_disease'],
    recommendations: [
      'Reduce or avoid dairy products, or choose lactose-free alternatives',
      'Try lactase enzyme supplements before consuming dairy',
      'Yogurt and hard cheeses are often better tolerated than milk',
      'Ensure adequate calcium intake from non-dairy sources',
      'See a doctor if symptoms persist despite dairy avoidance — may indicate another cause',
    ],
  },
]

export default lower_gi

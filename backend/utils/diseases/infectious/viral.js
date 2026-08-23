// Viral infectious diseases. Common Cold is defined once in respiratory/upper.js
// (its natural home) and cross-referenced from here rather than duplicated.
export const viral = [
  {
    id: 'viral_influenza',
    name: 'Influenza (Flu)',
    category: 'Infectious - Viral',
    aliases: ['flu', 'seasonal flu'],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.9, description: 'Sudden high fever, often 101–104°F' },
        { name: 'body aches', weight: 0.8, description: 'Severe muscle and body aches, more intense than a cold' },
        { name: 'fatigue', weight: 0.7, description: 'Extreme tiredness that can last 1–2 weeks' },
      ],
      secondary: [
        { name: 'headache', weight: 0.5, description: 'Often accompanies fever' },
        { name: 'cough', weight: 0.5, description: 'Usually dry' },
        { name: 'sore throat', weight: 0.4, description: 'Mild to moderate' },
        { name: 'chills', weight: 0.5, description: 'Common with fever spikes' },
      ],
      differentiating: [
        { name: 'sudden onset', weight: 0.6, description: 'Symptoms appear abruptly within hours, unlike a cold\'s gradual onset' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '5-7 days', chronic: '> 14 days suggests complications' },
    severity_levels: {
      mild: { description: 'Low-grade fever, mild aches, manageable at home', urgency: 'self-care' },
      moderate: { description: 'High fever, significant aches, persistent cough', urgency: 'see-doctor-soon' },
      severe: { description: 'Difficulty breathing, chest pain, persistent high fever beyond 4 days', urgency: 'emergency' },
    },
    risk_factors: ['contact with infected person', 'winter season', 'crowded places', 'no flu vaccination'],
    // "chest pain" narrowed to a compound phrase — bare, it also matches
    // "chest tightness" via the tokenizer's synonym map (chest tightness →
    // chest pain), which would over-trigger on ordinary anxiety-related
    // chest tightness that has nothing to do with flu.
    red_flags: ['difficulty breathing', 'chest pain with breathing difficulty', 'bluish lips', 'severe persistent vomiting', 'confusion'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['common_cold', 'covid19', 'viral_fever'],
    recommendations: [
      'Rest and stay hydrated with warm fluids',
      'Take paracetamol for fever and body aches',
      'Isolate from others for at least 3-4 days to prevent spread',
      'Seek care if breathing difficulty or chest pain develops',
      'Consider an annual flu vaccination for prevention',
    ],
  },

  {
    id: 'viral_dengue',
    name: 'Dengue Fever',
    category: 'Infectious - Viral',
    aliases: ['breakbone fever'],
    symptoms: {
      primary: [
        { name: 'high fever', weight: 0.9, description: 'Sudden onset, often 103-104°F, lasting 2-7 days' },
        { name: 'severe headache', weight: 0.7, description: 'Intense, often frontal' },
        { name: 'joint pain', weight: 0.8, description: 'Severe joint and muscle pain, gave rise to the name "breakbone fever"' },
      ],
      secondary: [
        { name: 'rash', weight: 0.5, description: 'Appears 3-4 days after fever onset' },
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'vomiting', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'retro-orbital pain', weight: 0.8, description: 'Pain behind the eyes, characteristic of dengue' },
        { name: 'low platelet count', weight: 0.7, description: 'Confirmed via blood test, distinguishes from viral fever' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '5-7 days', chronic: '> 14 days suggests complications (DHF/DSS)' },
    severity_levels: {
      mild: { description: 'Fever with body aches, no bleeding or warning signs', urgency: 'see-doctor-24h' },
      moderate: { description: 'High fever, rash, significant joint pain', urgency: 'see-doctor-today' },
      severe: { description: 'Bleeding gums, blood in vomit/stool, severe abdominal pain, low platelets', urgency: 'emergency' },
    },
    risk_factors: ['mosquito exposure', 'monsoon season', 'stagnant water nearby', 'recent travel to endemic area'],
    red_flags: ['bleeding gums', 'blood in vomit', 'blood in stool', 'severe abdominal pain', 'rapid breathing', 'persistent vomiting', 'restlessness or lethargy'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['chikungunya', 'malaria', 'zika', 'typhoid'],
    recommendations: [
      'Get a blood test (CBC + platelet count, Dengue NS1/IgM) urgently',
      'Stay hydrated — drink plenty of fluids (ORS, coconut water, clear soups)',
      'Monitor platelet count daily if dengue is suspected or confirmed',
      'Avoid aspirin and ibuprofen — they can worsen bleeding risk; use paracetamol only',
      'Use mosquito nets and repellent to prevent transmission to others',
      'Seek immediate medical care if any warning sign appears',
    ],
  },

  {
    id: 'viral_chikungunya',
    name: 'Chikungunya',
    category: 'Infectious - Viral',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.85, description: 'High fever, often abrupt onset' },
        { name: 'severe joint pain', weight: 0.9, description: 'Debilitating, often symmetric, in hands/wrists/ankles' },
      ],
      secondary: [
        { name: 'joint swelling', weight: 0.5, description: '—' },
        { name: 'rash', weight: 0.4, description: '—' },
        { name: 'headache', weight: 0.4, description: '—' },
        { name: 'muscle pain', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'prolonged joint pain', weight: 0.7, description: 'Joint pain can persist for weeks to months after fever resolves — distinguishes from dengue' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-7 days fever; joint pain may persist for months', chronic: '> 90 days of joint pain suggests chronic chikungunya arthritis' },
    severity_levels: {
      mild: { description: 'Fever with mild joint discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'High fever with disabling joint pain limiting movement', urgency: 'see-doctor-today' },
      severe: { description: 'Neurological symptoms or severe joint swelling preventing all movement', urgency: 'emergency' },
    },
    risk_factors: ['mosquito exposure', 'monsoon season', 'urban outbreak area'],
    red_flags: ['neurological symptoms', 'severe swelling preventing movement', 'high fever above 104°F'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_dengue', 'malaria', 'rheumatoid_arthritis'],
    recommendations: [
      'See a doctor for a Chikungunya IgM blood test',
      'Take paracetamol for fever and pain — avoid NSAIDs in the first few days',
      'Rest and elevate swollen joints',
      'Apply warm compresses to painful joints for relief',
      'Use mosquito protection to prevent further transmission',
    ],
  },

  {
    id: 'viral_covid19',
    name: 'COVID-19',
    category: 'Infectious - Viral',
    aliases: ['coronavirus', 'sars-cov-2'],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.7, description: 'Mild to moderate in most cases' },
        { name: 'cough', weight: 0.7, description: 'Usually dry' },
        { name: 'fatigue', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'sore throat', weight: 0.4, description: '—' },
        { name: 'body aches', weight: 0.4, description: '—' },
        { name: 'headache', weight: 0.4, description: '—' },
        { name: 'nasal congestion', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'loss of taste', weight: 0.8, description: 'Loss of taste or smell without nasal congestion is highly characteristic' },
        { name: 'loss of smell', weight: 0.8, description: '—' },
      ],
    },
    duration_patterns: { acute: '< 7 days mild cases', typical: '7-14 days', chronic: '> 21 days suggests long COVID' },
    severity_levels: {
      mild: { description: 'Fever, cough, fatigue without breathing difficulty', urgency: 'self-care' },
      moderate: { description: 'Persistent fever with mild breathlessness on exertion', urgency: 'see-doctor-today' },
      severe: { description: 'Difficulty breathing at rest, low oxygen saturation, chest pain', urgency: 'emergency' },
    },
    risk_factors: ['close contact with confirmed case', 'crowded indoor spaces', 'no vaccination', 'elderly or immunocompromised'],
    // Bare "chest pain" narrowed — matches "chest tightness" via the
    // synonym map, unrelated to COVID on its own.
    red_flags: ['difficulty breathing at rest', 'oxygen saturation below 94%', 'bluish lips or face', 'chest pain with breathing difficulty', 'confusion', 'inability to stay awake'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_influenza', 'common_cold'],
    recommendations: [
      'Get a RT-PCR or rapid antigen test to confirm',
      'Isolate from others for at least 5-7 days',
      'Monitor oxygen saturation with a pulse oximeter if available',
      'Rest, hydrate, and take paracetamol for fever',
      'Seek emergency care immediately if breathing becomes difficult',
    ],
  },

  {
    id: 'viral_measles',
    name: 'Measles',
    category: 'Infectious - Viral',
    aliases: ['rubeola'],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.85, description: 'High fever, often above 104°F' },
        { name: 'maculopapular rash', weight: 0.85, description: 'Red rash starting on the face and spreading downward' },
        { name: 'cough', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'runny nose', weight: 0.4, description: '—' },
        { name: 'red eyes', weight: 0.5, description: 'Conjunctivitis often accompanies' },
        { name: 'sore throat', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'koplik spots', weight: 0.9, description: 'Small white spots inside the mouth, appear before the rash' },
        { name: 'rash starting face', weight: 0.7, description: 'Rash begins on face/hairline then spreads to trunk and limbs' },
      ],
    },
    duration_patterns: { acute: '< 10 days', typical: '7-10 days', chronic: '> 14 days suggests complications' },
    severity_levels: {
      mild: { description: 'Fever and rash without complications', urgency: 'see-doctor-today' },
      moderate: { description: 'High fever, extensive rash, cough', urgency: 'see-doctor-today' },
      severe: { description: 'Difficulty breathing, seizures, confusion (encephalitis)', urgency: 'emergency' },
    },
    risk_factors: ['unvaccinated', 'contact with infected person', 'young children'],
    red_flags: ['difficulty breathing', 'seizures', 'confusion', 'severe ear pain', 'high fever above 104°F lasting more than 4 days'],
    specialist: 'Pediatrician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['rubella', 'roseola', 'viral_dengue'],
    recommendations: [
      'See a doctor today for confirmation and public health reporting',
      'Isolate the patient from unvaccinated individuals for at least 4 days after rash onset',
      'Ensure adequate fluid intake and rest',
      'Vitamin A supplementation as prescribed reduces severity in children',
      'Ensure MMR vaccination for household contacts who are unvaccinated',
    ],
  },

  {
    id: 'viral_mumps',
    name: 'Mumps',
    category: 'Infectious - Viral',
    aliases: ['parotitis'],
    symptoms: {
      primary: [
        { name: 'jaw swelling', weight: 0.85, description: 'Painful swelling of the parotid salivary glands' },
        { name: 'fever', weight: 0.6, description: 'Mild to moderate' },
      ],
      secondary: [
        { name: 'headache', weight: 0.3, description: '—' },
        { name: 'muscle aches', weight: 0.3, description: '—' },
        { name: 'loss of appetite', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'cheek swelling', weight: 0.7, description: 'Characteristic hamster-like facial swelling, usually bilateral' },
      ],
    },
    duration_patterns: { acute: '< 10 days', typical: '7-10 days', chronic: null },
    severity_levels: {
      mild: { description: 'Mild glandular swelling and low fever', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant swelling and pain, difficulty chewing', urgency: 'see-doctor-today' },
      severe: { description: 'Testicular pain/swelling, severe headache with stiff neck', urgency: 'emergency' },
    },
    risk_factors: ['unvaccinated', 'contact with infected person', 'crowded living conditions'],
    // Bare "abdominal pain" narrowed — it also matches "stomach ache" via
    // the synonym map, which is far too common/benign to stand alone.
    red_flags: ['severe headache with stiff neck', 'testicular swelling or pain in males post-puberty', 'severe abdominal pain with swelling', 'hearing loss'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['dental_abscess'],
    recommendations: [
      'Rest and isolate for at least 5 days from swelling onset — highly contagious',
      'Take paracetamol for pain and fever',
      'Apply warm or cold compress to swollen glands for comfort',
      'Eat soft foods and avoid sour foods which stimulate saliva and worsen pain',
      'Seek urgent care for testicular pain, severe headache, or stiff neck',
    ],
  },

  {
    id: 'viral_rubella',
    name: 'Rubella (German Measles)',
    category: 'Infectious - Viral',
    aliases: ['german measles'],
    symptoms: {
      primary: [
        { name: 'mild fever', weight: 0.6, description: 'Low-grade' },
        { name: 'rash', weight: 0.7, description: 'Fine pink rash starting on the face' },
      ],
      secondary: [
        { name: 'lymph node swelling', weight: 0.6, description: 'Especially behind the ears and neck' },
        { name: 'joint pain', weight: 0.4, description: 'More common in adult women' },
      ],
      differentiating: [
        { name: 'swollen lymph nodes behind ears', weight: 0.7, description: 'Characteristic postauricular lymphadenopathy' },
      ],
    },
    duration_patterns: { acute: '< 5 days', typical: '3-5 days', chronic: null },
    severity_levels: {
      mild: { description: 'Mild rash and fever', urgency: 'self-care' },
      moderate: { description: 'Rash with joint pain and swollen glands', urgency: 'see-doctor-soon' },
      severe: { description: 'Pregnant woman with exposure — risk to fetus', urgency: 'emergency' },
    },
    risk_factors: ['unvaccinated', 'contact with infected person', 'pregnancy'],
    red_flags: ['pregnancy with exposure or symptoms', 'bleeding tendency'],
    specialist: 'General Physician',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_measles', 'roseola'],
    recommendations: [
      'Isolate from pregnant women and unvaccinated individuals',
      'Rest and stay hydrated',
      'Take paracetamol for fever',
      'Pregnant women exposed to rubella must see a doctor urgently',
      'Ensure MMR vaccination is up to date for future prevention',
    ],
  },

  {
    id: 'viral_chickenpox',
    name: 'Chickenpox',
    category: 'Infectious - Viral',
    aliases: ['varicella'],
    symptoms: {
      primary: [
        { name: 'itchy blisters', weight: 0.9, description: 'Fluid-filled blisters that appear in crops all over the body' },
        { name: 'fever', weight: 0.6, description: 'Mild to moderate, precedes or accompanies rash' },
      ],
      secondary: [
        { name: 'headache', weight: 0.3, description: '—' },
        { name: 'loss of appetite', weight: 0.3, description: '—' },
        { name: 'fatigue', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'crusting blisters', weight: 0.6, description: 'Blisters at different stages (new, crusted) present simultaneously' },
      ],
    },
    duration_patterns: { acute: '< 10 days', typical: '7-10 days until all blisters crust', chronic: null },
    severity_levels: {
      mild: { description: 'Scattered blisters, mild fever', urgency: 'see-doctor-soon' },
      moderate: { description: 'Widespread blisters with significant discomfort', urgency: 'see-doctor-soon' },
      severe: { description: 'Blisters showing signs of bacterial infection, or in a newborn/pregnant/immunocompromised person', urgency: 'emergency' },
    },
    risk_factors: ['unvaccinated', 'contact with infected person', 'children'],
    red_flags: ['blisters becoming red/warm/pus-filled', 'difficulty breathing', 'severe headache or confusion', 'high fever above 103°F lasting more than 4 days'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['hand_foot_mouth', 'shingles'],
    recommendations: [
      'Isolate until all blisters have crusted over',
      'Apply calamine lotion to soothe itching',
      'Take an antihistamine for itching and paracetamol for fever',
      'Keep nails short to avoid scratching and secondary infection',
      'Seek care immediately if blisters look infected or breathing difficulty occurs',
    ],
  },

  {
    id: 'viral_hepatitis_a',
    name: 'Hepatitis A',
    category: 'Infectious - Viral',
    aliases: ['hep a'],
    symptoms: {
      primary: [
        { name: 'jaundice', weight: 0.8, description: 'Yellowing of skin and eyes' },
        { name: 'fatigue', weight: 0.6, description: '—' },
        { name: 'nausea', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'abdominal pain', weight: 0.5, description: 'Right upper quadrant' },
        { name: 'dark urine', weight: 0.6, description: '—' },
        { name: 'loss of appetite', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'contaminated water exposure', weight: 0.6, description: 'Typically follows consumption of contaminated food/water' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset', typical: '2-4 weeks', chronic: 'Hepatitis A does not become chronic' },
    severity_levels: {
      mild: { description: 'Mild fatigue and nausea without jaundice', urgency: 'see-doctor-soon' },
      moderate: { description: 'Jaundice with fatigue and nausea', urgency: 'see-doctor-today' },
      severe: { description: 'Confusion, severe abdominal swelling, bleeding — signs of liver failure', urgency: 'emergency' },
    },
    risk_factors: ['contaminated water exposure', 'ate raw or street food', 'poor sanitation area'],
    red_flags: ['confusion or extreme drowsiness', 'rapidly deepening jaundice', 'severe abdominal swelling', 'blood in vomit or black stool'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['hepatitis_b', 'hepatitis_e', 'gallstones'],
    recommendations: [
      'See a doctor for liver function tests and hepatitis panel',
      'Rest completely — the liver needs rest to recover',
      'Eat freshly cooked, low-fat, easily digestible food',
      'Drink only boiled or bottled water; avoid alcohol completely',
      'Seek emergency care for confusion, bleeding, or worsening jaundice',
    ],
  },

  {
    id: 'viral_hepatitis_b',
    name: 'Hepatitis B',
    category: 'Infectious - Viral',
    aliases: ['hbv'],
    symptoms: {
      primary: [
        { name: 'jaundice', weight: 0.7, description: '—' },
        { name: 'fatigue', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'abdominal pain', weight: 0.4, description: 'Right upper quadrant' },
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'loss of appetite', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'dark urine', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: '< 30 days acute phase', typical: '1-3 months', chronic: '> 6 months indicates chronic infection' },
    severity_levels: {
      mild: { description: 'Asymptomatic or mild fatigue — many carriers have no symptoms', urgency: 'see-doctor-soon' },
      moderate: { description: 'Jaundice with fatigue and nausea', urgency: 'see-doctor-today' },
      severe: { description: 'Confusion, severe abdominal swelling, bleeding', urgency: 'emergency' },
    },
    risk_factors: ['unprotected sexual contact', 'unscreened blood transfusion', 'shared needles', 'household contact with carrier'],
    red_flags: ['deepening jaundice', 'confusion or extreme drowsiness', 'severe abdominal swelling', 'vomiting blood'],
    specialist: 'Hepatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['hepatitis_a', 'hepatitis_c', 'fatty_liver'],
    recommendations: [
      'See a hepatologist for HBsAg, liver function tests, and ultrasound',
      'Chronic hepatitis B requires antiviral therapy — never stop medication without medical guidance',
      'Avoid all alcohol completely',
      'Household members and sexual partners should be vaccinated',
      'Seek emergency care for confusion, bleeding, or rapidly worsening jaundice',
    ],
  },

  {
    id: 'viral_hepatitis_c',
    name: 'Hepatitis C',
    category: 'Infectious - Viral',
    aliases: ['hcv'],
    symptoms: {
      primary: [
        { name: 'fatigue', weight: 0.6, description: 'Often the only symptom for years' },
        { name: 'jaundice', weight: 0.4, description: 'Uncommon in early stages' },
      ],
      secondary: [
        { name: 'joint pain', weight: 0.3, description: '—' },
        { name: 'loss of appetite', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'history of blood transfusion', weight: 0.5, description: 'Often the only identifiable risk factor' },
      ],
    },
    duration_patterns: { acute: '< 6 months', typical: 'often asymptomatic for years', chronic: '> 6 months indicates chronic infection, most common outcome' },
    severity_levels: {
      mild: { description: 'Asymptomatic, detected incidentally on blood tests', urgency: 'see-doctor-soon' },
      moderate: { description: 'Fatigue with abnormal liver tests', urgency: 'see-doctor-soon' },
      severe: { description: 'Signs of cirrhosis — abdominal swelling, bleeding, confusion', urgency: 'emergency' },
    },
    risk_factors: ['unscreened blood transfusion before 2001', 'shared needles', 'unprotected sexual contact'],
    // "abdominal swelling" tightened to "severe abdominal swelling" for
    // consistency with the other hepatitis entries (bare, it's
    // indistinguishable from ordinary bloating; the intended meaning is
    // ascites from decompensation).
    red_flags: ['severe abdominal swelling', 'confusion', 'vomiting blood', 'black tarry stool'],
    specialist: 'Hepatologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['hepatitis_b', 'fatty_liver', 'cirrhosis'],
    recommendations: [
      'Get tested with anti-HCV antibody and HCV RNA if at risk',
      'Direct-acting antiviral treatment can cure most cases — consult a hepatologist',
      'Avoid alcohol completely to protect the liver',
      'Get vaccinated against hepatitis A and B',
      'Seek emergency care if signs of liver failure develop',
    ],
  },

  {
    id: 'viral_hepatitis_e',
    name: 'Hepatitis E',
    category: 'Infectious - Viral',
    aliases: ['hev'],
    symptoms: {
      primary: [
        { name: 'jaundice', weight: 0.8, description: '—' },
        { name: 'fatigue', weight: 0.6, description: '—' },
        { name: 'nausea', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'abdominal pain', weight: 0.4, description: '—' },
        { name: 'fever', weight: 0.4, description: 'Mild, often precedes jaundice' },
      ],
      differentiating: [
        { name: 'contaminated water exposure', weight: 0.6, description: 'Waterborne, common after flooding' },
        { name: 'pregnancy', weight: 0.7, description: 'Can be severe/fatal in pregnant women, especially 3rd trimester' },
      ],
    },
    duration_patterns: { acute: '< 21 days', typical: '2-6 weeks', chronic: 'Rare, mainly in immunocompromised' },
    severity_levels: {
      mild: { description: 'Mild jaundice and fatigue', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant jaundice with nausea', urgency: 'see-doctor-today' },
      severe: { description: 'Pregnant with jaundice, or confusion/bleeding — fulminant hepatic failure risk', urgency: 'emergency' },
    },
    risk_factors: ['contaminated water exposure', 'flood-affected area', 'pregnancy'],
    red_flags: ['pregnancy with jaundice', 'confusion', 'bleeding', 'severe abdominal swelling'],
    specialist: 'Gastroenterologist',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['hepatitis_a', 'leptospirosis'],
    recommendations: [
      'Drink only boiled or bottled water, especially during/after flooding',
      'Rest and eat light, low-fat food',
      'Pregnant women with jaundice must be seen urgently — high-risk group',
      'Avoid alcohol and hepatotoxic medications',
      'Seek emergency care for confusion or bleeding',
    ],
  },

  {
    id: 'viral_rabies_exposure',
    name: 'Rabies Exposure',
    category: 'Infectious - Viral',
    aliases: ['hydrophobia'],
    symptoms: {
      primary: [
        { name: 'animal bite', weight: 0.9, description: 'Bite or scratch from a potentially rabid animal (dog, cat, bat, monkey)' },
        { name: 'wound at bite site', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.3, description: 'May develop days to weeks later if untreated' },
        { name: 'tingling at wound site', weight: 0.5, description: 'Early neurological sign' },
      ],
      differentiating: [
        { name: 'hydrophobia', weight: 0.9, description: 'Fear/spasm on attempting to drink water — late-stage sign, disease is fatal by this point' },
      ],
    },
    duration_patterns: { acute: 'exposure requiring immediate action', typical: 'incubation 20-90 days', chronic: null },
    severity_levels: {
      mild: { description: 'Recent bite/scratch, no symptoms yet — this is a medical emergency regardless', urgency: 'emergency' },
      moderate: { description: 'Wound with tingling or numbness at the site', urgency: 'emergency' },
      severe: { description: 'Any neurological symptoms after animal bite — hydrophobia, agitation, paralysis', urgency: 'emergency' },
    },
    risk_factors: ['animal bite', 'stray dog exposure', 'unvaccinated pet exposure', 'living in endemic area'],
    red_flags: ['any bite from a stray or wild animal', 'hydrophobia', 'agitation or unusual behaviour after a bite', 'paralysis after a bite'],
    specialist: 'Emergency Medicine',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: [],
    recommendations: [
      'Wash the wound immediately with soap and running water for 15 minutes',
      'Go to the nearest hospital or emergency room immediately — do not wait for symptoms',
      'Start post-exposure prophylaxis (rabies vaccine ± immunoglobulin) as advised by a doctor',
      'Try to safely observe the animal if possible, but do not delay treatment to do so',
      'Rabies is fatal once symptoms appear — prevention via prompt vaccination is essential',
    ],
  },

  {
    id: 'viral_hiv_early',
    name: 'HIV — Early/Acute Infection (Awareness)',
    category: 'Infectious - Viral',
    aliases: ['acute retroviral syndrome'],
    symptoms: {
      primary: [
        { name: 'fever', weight: 0.6, description: 'Flu-like, 2-4 weeks after exposure' },
        { name: 'fatigue', weight: 0.5, description: '—' },
        { name: 'lymph node swelling', weight: 0.6, description: 'Generalised' },
      ],
      secondary: [
        { name: 'rash', weight: 0.4, description: '—' },
        { name: 'sore throat', weight: 0.3, description: '—' },
        { name: 'joint pain', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'unprotected sexual contact', weight: 0.6, description: 'Recent high-risk exposure' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '2-4 weeks flu-like illness, then often asymptomatic for years', chronic: 'untreated infection progresses over years' },
    severity_levels: {
      mild: { description: 'Mild flu-like symptoms after a known risk exposure', urgency: 'see-doctor-soon' },
      moderate: { description: 'Persistent fever, weight loss, recurrent infections', urgency: 'see-doctor-today' },
      severe: { description: 'Severe opportunistic infection or unexplained rapid weight loss', urgency: 'see-doctor-today' },
    },
    risk_factors: ['unprotected sexual contact', 'shared needles', 'unscreened blood transfusion', 'occupational needle-stick injury'],
    red_flags: ['severe unexplained weight loss', 'persistent high fever', 'recurrent severe infections'],
    specialist: 'Infectious Disease Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['viral_influenza', 'infectious_mononucleosis'],
    recommendations: [
      'Get an HIV test if you have had a recent high-risk exposure — testing is confidential',
      'If exposure was within 72 hours, ask a doctor about post-exposure prophylaxis (PEP) immediately',
      'Early diagnosis and treatment (ART) allows a normal life expectancy',
      'Use protection to prevent further transmission',
      'This is informational only — a qualified doctor must confirm any diagnosis',
    ],
  },

  {
    id: 'viral_zika',
    name: 'Zika Virus Fever',
    category: 'Infectious - Viral',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'mild fever', weight: 0.6, description: 'Low-grade' },
        { name: 'rash', weight: 0.6, description: 'Maculopapular' },
      ],
      secondary: [
        { name: 'joint pain', weight: 0.4, description: '—' },
        { name: 'red eyes', weight: 0.4, description: 'Conjunctivitis without discharge' },
      ],
      differentiating: [
        { name: 'mosquito exposure', weight: 0.5, description: 'Same Aedes mosquito vector as dengue' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '4-7 days', chronic: null },
    severity_levels: {
      mild: { description: 'Mild fever and rash', urgency: 'self-care' },
      moderate: { description: 'Fever, rash, joint pain', urgency: 'see-doctor-soon' },
      severe: { description: 'Pregnant woman with symptoms or exposure — fetal risk', urgency: 'emergency' },
    },
    risk_factors: ['mosquito exposure', 'pregnancy', 'recent travel to endemic area'],
    red_flags: ['pregnancy with symptoms or exposure', 'neurological symptoms'],
    specialist: 'General Physician',
    india_prevalence: 'low',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_dengue', 'viral_chikungunya', 'rubella'],
    recommendations: [
      'Rest and take paracetamol for fever — avoid aspirin and ibuprofen',
      'Pregnant women must avoid travel to affected areas and use strict mosquito protection',
      'Use barrier contraception for 6 months after confirmed Zika',
      'Eliminate stagnant water around the home to reduce mosquito breeding',
      'See a doctor urgently if pregnant and exposed or symptomatic',
    ],
  },

  {
    id: 'viral_infectious_mononucleosis',
    name: 'Infectious Mononucleosis (Mono)',
    category: 'Infectious - Viral',
    aliases: ['mono', 'glandular fever', 'kissing disease'],
    symptoms: {
      primary: [
        { name: 'fatigue', weight: 0.7, description: 'Profound, can last weeks' },
        { name: 'sore throat', weight: 0.7, description: 'Severe, often with white patches' },
        { name: 'fever', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'lymph node swelling', weight: 0.6, description: 'Especially neck' },
        { name: 'headache', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'splenomegaly', weight: 0.6, description: 'Enlarged spleen — increases risk of rupture with contact sports' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '2-4 weeks', chronic: 'fatigue can persist for months' },
    severity_levels: {
      mild: { description: 'Mild sore throat and fatigue', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant fatigue, sore throat, swollen glands', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe abdominal pain (possible spleen rupture), difficulty breathing', urgency: 'emergency' },
    },
    risk_factors: ['close contact/saliva exchange', 'young adults', 'shared drinks or utensils'],
    red_flags: ['severe left-sided abdominal pain', 'difficulty breathing due to throat swelling', 'severe dehydration'],
    specialist: 'General Physician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['strep_throat', 'viral_influenza'],
    recommendations: [
      'Rest extensively — fatigue can persist for weeks',
      'Avoid contact sports for at least 4 weeks due to spleen enlargement risk',
      'Stay hydrated and take paracetamol for fever and throat pain',
      'Avoid sharing drinks, food, or utensils with others',
      'Seek urgent care for severe abdominal pain or breathing difficulty',
    ],
  },

  {
    id: 'viral_hand_foot_mouth',
    name: 'Hand, Foot and Mouth Disease',
    category: 'Infectious - Viral',
    aliases: ['hfmd'],
    symptoms: {
      primary: [
        { name: 'mouth ulcers', weight: 0.8, description: 'Painful sores inside the mouth' },
        { name: 'rash on hands and feet', weight: 0.8, description: 'Small blisters on palms and soles' },
        { name: 'fever', weight: 0.5, description: 'Mild to moderate' },
      ],
      secondary: [
        { name: 'loss of appetite', weight: 0.4, description: 'Due to painful mouth sores' },
        { name: 'irritability', weight: 0.3, description: 'Especially in young children' },
      ],
      differentiating: [
        { name: 'sores in mouth', weight: 0.7, description: 'Combined with rash on extremities is highly characteristic' },
      ],
    },
    duration_patterns: { acute: '< 10 days', typical: '7-10 days', chronic: null },
    severity_levels: {
      mild: { description: 'Few mouth sores, mild rash', urgency: 'see-doctor-soon' },
      moderate: { description: 'Extensive sores affecting eating/drinking', urgency: 'see-doctor-soon' },
      severe: { description: 'High fever with lethargy, stiff neck, or difficulty breathing', urgency: 'emergency' },
    },
    risk_factors: ['children under 10', 'daycare or school exposure'],
    red_flags: ['high fever above 104°F lasting more than 3 days', 'severe headache or stiff neck', 'extreme drowsiness', 'inability to swallow fluids'],
    specialist: 'Pediatrician',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['viral_chickenpox', 'herpangina'],
    recommendations: [
      'Offer cool, soft foods to soothe mouth sores',
      'Give paracetamol for fever and pain',
      'Keep the child isolated from school for at least 7 days',
      'Ensure adequate fluid intake to prevent dehydration',
      'Seek care if the child refuses all fluids or becomes very drowsy',
    ],
  },

  {
    id: 'viral_rsv',
    name: 'Respiratory Syncytial Virus (RSV) Infection',
    category: 'Infectious - Viral',
    aliases: ['rsv bronchiolitis'],
    symptoms: {
      primary: [
        { name: 'cough', weight: 0.7, description: '—' },
        { name: 'wheezing', weight: 0.6, description: 'Common in infants' },
        { name: 'nasal congestion', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.4, description: 'Mild to moderate' },
        { name: 'poor feeding', weight: 0.4, description: 'In infants' },
      ],
      differentiating: [
        { name: 'infant age', weight: 0.6, description: 'Most severe in infants under 1 year and the elderly' },
      ],
    },
    duration_patterns: { acute: '< 10 days', typical: '7-10 days', chronic: null },
    severity_levels: {
      mild: { description: 'Cold-like symptoms in an older child or adult', urgency: 'self-care' },
      moderate: { description: 'Wheezing and cough in an infant, feeding normally', urgency: 'see-doctor-today' },
      severe: { description: 'Rapid breathing, retractions, poor feeding, or bluish lips in infant', urgency: 'emergency' },
    },
    risk_factors: ['infant under 1 year', 'winter season', 'daycare exposure', 'premature birth'],
    red_flags: ['rapid or labored breathing', 'bluish lips or face', 'poor feeding with dehydration', 'lethargy'],
    specialist: 'Pediatrician',
    india_prevalence: 'moderate',
    seasonal_pattern: 'winter',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['bronchiolitis', 'viral_influenza'],
    recommendations: [
      'Keep the infant well hydrated with frequent small feeds',
      'Use a cool-mist humidifier and saline nasal drops for congestion',
      'Monitor breathing rate and effort closely',
      'Avoid smoke exposure',
      'Seek emergency care immediately for rapid breathing, retractions, or bluish lips',
    ],
  },
]

export default viral

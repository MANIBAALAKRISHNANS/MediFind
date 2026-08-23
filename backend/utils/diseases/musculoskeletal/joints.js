export const joints = [
  {
    id: 'musculoskeletal_osteoarthritis',
    name: 'Osteoarthritis',
    category: 'Musculoskeletal - Joints',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'joint pain', weight: 0.8, description: 'Worse with activity, better with rest' },
        { name: 'joint stiffness', weight: 0.6, description: 'Morning stiffness under 30 minutes' },
      ],
      secondary: [
        { name: 'creaking joints', weight: 0.3, description: '—' },
        { name: 'joint swelling', weight: 0.3, description: 'Mild' },
      ],
      differentiating: [
        { name: 'pain climbing stairs', weight: 0.5, description: 'Weight-bearing joints affected, worse with use' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, progressive over years', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Mild pain after activity', urgency: 'see-doctor-soon' },
      moderate: { description: 'Pain affecting daily activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Sudden severe swelling/warmth (possible gout or infection) or complete inability to bear weight', urgency: 'see-doctor-today' },
    },
    risk_factors: ['age over 50', 'obesity', 'previous joint injury', 'repetitive joint stress'],
    red_flags: ['sudden joint swelling with warmth and redness', 'complete inability to bear weight', 'joint deformity progressing rapidly'],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['musculoskeletal_rheumatoid_arthritis', 'musculoskeletal_gout'],
    recommendations: [
      'See an orthopedic specialist for X-ray assessment',
      'Take prescribed NSAIDs with food for pain and stiffness',
      'Do low-impact exercises — swimming, cycling — to strengthen muscles around joints',
      'Maintain a healthy weight to reduce joint load',
      'Seek care for sudden severe swelling — may indicate gout or infection',
    ],
  },

  {
    id: 'musculoskeletal_rheumatoid_arthritis',
    name: 'Rheumatoid Arthritis',
    category: 'Musculoskeletal - Joints',
    aliases: ['ra'],
    symptoms: {
      primary: [
        { name: 'joint pain', weight: 0.8, description: 'Symmetric, small joints of hands/feet' },
        { name: 'joint stiffness', weight: 0.7, description: 'Morning stiffness lasting more than 1 hour' },
      ],
      secondary: [
        { name: 'joint swelling', weight: 0.5, description: '—' },
        { name: 'fatigue', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'symmetric joint involvement', weight: 0.6, description: 'Both sides of the body affected equally' },
        { name: 'prolonged morning stiffness', weight: 0.6, description: '> 1 hour, unlike osteoarthritis' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, progressive if untreated', chronic: '> 42 days of symptoms warrants evaluation' },
    severity_levels: {
      mild: { description: 'Mild joint pain and stiffness', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant swelling and stiffness affecting function', urgency: 'see-doctor-soon' },
      severe: { description: 'Rapid joint deformity, fever, or new breathing/chest symptoms', urgency: 'see-doctor-today' },
    },
    risk_factors: ['family history', 'female gender', 'smoking', 'age 30-60'],
    red_flags: ['rapid joint deformity within weeks', 'fever with severe fatigue and weight loss', 'new breathing difficulty or chest pain'],
    specialist: 'Rheumatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['musculoskeletal_osteoarthritis', 'musculoskeletal_psoriatic_arthritis', 'lupus_awareness'],
    recommendations: [
      'See a rheumatologist urgently — early DMARD treatment prevents joint damage',
      'Rheumatoid Factor and Anti-CCP blood tests are needed for diagnosis',
      'NSAIDs can help pain while awaiting specialist review',
      'Gentle range-of-motion exercises help preserve joint function',
      'Early treatment within 3-6 months of onset significantly improves long-term outcomes',
    ],
  },

  {
    id: 'musculoskeletal_gout',
    name: 'Gout',
    category: 'Musculoskeletal - Joints',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'sudden joint pain', weight: 0.9, description: 'Severe, often big toe' },
        { name: 'joint swelling', weight: 0.7, description: 'Red, warm, tender' },
      ],
      secondary: [
        { name: 'joint redness', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'big toe involvement', weight: 0.7, description: 'Classic first presentation site' },
        { name: 'night onset', weight: 0.5, description: 'Attacks often start suddenly at night' },
      ],
    },
    duration_patterns: { acute: '3-10 days per episode', typical: 'recurrent episodes', chronic: '> 365 days of recurrent attacks suggests chronic tophaceous gout' },
    severity_levels: {
      mild: { description: 'Mild joint discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Severe pain in one joint, unable to bear weight', urgency: 'see-doctor-soon' },
      severe: { description: 'Fever with a hot swollen joint — may indicate septic arthritis, not gout', urgency: 'emergency' },
    },
    risk_factors: ['high-purine diet (red meat, seafood)', 'alcohol use', 'obesity', 'family history', 'kidney disease'],
    red_flags: ['fever with a hot swollen joint', 'multiple joints affected simultaneously', 'joint pain not responding to anti-inflammatory medication'],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'male',
    similar_diseases: ['musculoskeletal_septic_arthritis', 'musculoskeletal_pseudogout'],
    recommendations: [
      'See a doctor for serum uric acid testing and prescribed medication',
      'Apply an ice pack to the affected joint for 20 minutes every few hours',
      'Avoid alcohol, red meat, and seafood — these raise uric acid',
      'Drink plenty of water to help flush out uric acid',
      'See a doctor promptly if it is your first gout attack, or if fever accompanies joint inflammation',
    ],
  },

  {
    id: 'musculoskeletal_reactive_arthritis',
    name: 'Reactive Arthritis',
    category: 'Musculoskeletal - Joints',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'joint pain', weight: 0.7, description: 'Large joints, asymmetric' },
        { name: 'joint swelling', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'eye redness', weight: 0.3, description: 'Conjunctivitis' },
        { name: 'burning urination', weight: 0.3, description: 'Urethritis' },
      ],
      differentiating: [
        { name: 'recent infection', weight: 0.6, description: 'Follows gut or genital infection by 1-4 weeks' },
      ],
    },
    duration_patterns: { acute: null, typical: '3-6 months, most cases resolve', chronic: '> 180 days suggests chronic reactive arthritis' },
    severity_levels: {
      mild: { description: 'Mild joint discomfort after recent infection', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant joint swelling with eye/urinary symptoms', urgency: 'see-doctor-soon' },
      severe: { description: 'High fever with a hot swollen joint (possible septic arthritis)', urgency: 'emergency' },
    },
    risk_factors: ['recent gut infection (Salmonella, Shigella)', 'recent sexually transmitted infection', 'HLA-B27 genetic marker'],
    red_flags: ['high fever with hot swollen joint', 'eye pain or vision changes'],
    specialist: 'Rheumatologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['musculoskeletal_rheumatoid_arthritis', 'musculoskeletal_gout'],
    recommendations: [
      'See a rheumatologist — blood tests may be needed',
      'Treat any ongoing underlying infection with appropriate antibiotics',
      'Take NSAIDs for joint pain and inflammation',
      'Most cases resolve within 3-6 months',
      'See an ophthalmologist urgently for eye pain or vision changes',
    ],
  },

  {
    id: 'musculoskeletal_psoriatic_arthritis',
    name: 'Psoriatic Arthritis',
    category: 'Musculoskeletal - Joints',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'joint pain', weight: 0.75, description: 'Often asymmetric' },
        { name: 'joint swelling', weight: 0.6, description: 'Can affect entire fingers/toes (dactylitis)' },
      ],
      secondary: [
        { name: 'nail changes', weight: 0.4, description: 'Pitting, thickening' },
      ],
      differentiating: [
        { name: 'psoriasis skin patches', weight: 0.7, description: 'Personal or family history of psoriasis' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, progressive if untreated', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Mild joint discomfort with known psoriasis', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant joint swelling and skin involvement', urgency: 'see-doctor-soon' },
      severe: { description: 'Rapid joint deformity or severe skin flare', urgency: 'see-doctor-today' },
    },
    risk_factors: ['personal or family history of psoriasis', 'age 30-50'],
    red_flags: ['rapid joint deformity', 'eye pain or redness'],
    specialist: 'Rheumatologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['musculoskeletal_rheumatoid_arthritis', 'dermatological_psoriasis'],
    recommendations: [
      'See a rheumatologist for joint and skin assessment together',
      'DMARDs or biologics can control both joint and skin disease',
      'Manage psoriasis skin flares with a dermatologist in parallel',
      'Regular exercise helps maintain joint mobility',
      'See a doctor promptly for rapid joint deformity or eye symptoms',
    ],
  },

  {
    id: 'musculoskeletal_septic_arthritis',
    name: 'Septic Arthritis',
    category: 'Musculoskeletal - Joints',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'severe joint pain', weight: 0.9, description: 'Single joint, sudden' },
        { name: 'fever', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'joint swelling', weight: 0.6, description: 'Hot, red' },
      ],
      differentiating: [
        { name: 'single hot swollen joint with fever', weight: 0.8, description: 'Classic presentation requiring urgent joint aspiration' },
      ],
    },
    duration_patterns: { acute: '< 3 days onset', typical: 'requires emergency treatment', chronic: null },
    severity_levels: {
      mild: { description: 'This condition always requires emergency evaluation once suspected', urgency: 'emergency' },
      moderate: { description: 'Fever with a hot swollen joint', urgency: 'emergency' },
      severe: { description: 'Signs of sepsis alongside joint symptoms', urgency: 'emergency' },
    },
    risk_factors: ['recent joint injury or surgery', 'immunocompromised', 'diabetes', 'existing joint disease'],
    // Requires the fever+joint combination — bare "fever" or "joint pain"
    // alone are both common for benign reasons (viral illness, overuse).
    red_flags: [
      'fever with a hot swollen joint',
      'hot swollen joint and fever',
      'joint pain with fever and swelling',
    ],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['musculoskeletal_gout', 'musculoskeletal_reactive_arthritis'],
    recommendations: [
      'Go to the emergency room immediately — delayed treatment can permanently destroy the joint',
      'Joint aspiration and IV antibiotics are needed urgently',
      'Do not wait to see if it improves — this is a true orthopedic emergency',
      'Surgical drainage may be needed in some cases',
      'Early treatment gives the best chance of preserving joint function',
    ],
  },

  {
    id: 'musculoskeletal_bursitis',
    name: 'Bursitis',
    category: 'Musculoskeletal - Joints',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'joint pain', weight: 0.6, description: 'Localized, around a joint' },
        { name: 'joint swelling', weight: 0.5, description: 'Localized soft swelling' },
      ],
      secondary: [
        { name: 'warmth over joint', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain with pressure on the area', weight: 0.5, description: 'Point tenderness rather than deep joint pain' },
        // Moved out of red_flags: matches this entry's own see-doctor-today
        // max — needs prompt care, not an ambulance.
        { name: 'fever with spreading redness', weight: 0.5, description: 'Suggests possible septic bursitis' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '2-4 weeks with treatment', chronic: '> 90 days suggests chronic bursitis' },
    severity_levels: {
      mild: { description: 'Mild localized discomfort', urgency: 'self-care' },
      moderate: { description: 'Significant swelling limiting movement', urgency: 'see-doctor-soon' },
      severe: { description: 'Fever with redness and warmth (possible septic bursitis)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['repetitive kneeling/leaning', 'joint overuse', 'direct trauma'],
    red_flags: [],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['musculoskeletal_tendinitis', 'musculoskeletal_osteoarthritis'],
    recommendations: [
      'Rest the affected joint and avoid the aggravating activity',
      'Apply ice for the first 48 hours, then heat',
      'Take NSAIDs for pain and inflammation',
      'Use padding to protect the area from pressure',
      'See a doctor if fever or spreading redness develops — may indicate infection',
    ],
  },

  {
    id: 'musculoskeletal_tendinitis',
    name: 'Tendinitis',
    category: 'Musculoskeletal - Joints',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'joint pain', weight: 0.6, description: 'Around a tendon, worse with movement' },
      ],
      secondary: [
        { name: 'joint stiffness', weight: 0.4, description: '—' },
        { name: 'mild swelling', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain with specific movement', weight: 0.5, description: 'Pain reproduced by using the specific tendon' },
        // Moved out of red_flags: matches this entry's own see-doctor-today
        // max — a tendon rupture needs prompt ortho care, not an ambulance.
        { name: 'sudden inability to move the joint', weight: 0.5, description: 'Suggests possible tendon rupture' },
        { name: 'popping sensation in the joint', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '2-6 weeks with rest and treatment', chronic: '> 90 days suggests chronic tendinopathy' },
    severity_levels: {
      mild: { description: 'Mild discomfort with activity', urgency: 'self-care' },
      moderate: { description: 'Pain limiting normal use of the joint', urgency: 'see-doctor-soon' },
      severe: { description: 'Sudden inability to move the joint (possible tendon rupture)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['repetitive motion/overuse', 'sports activity', 'age-related tendon changes'],
    red_flags: [],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['musculoskeletal_bursitis', 'soft_tissue_tennis_elbow'],
    recommendations: [
      'Rest the affected tendon and avoid the aggravating activity',
      'Apply ice for the first 48 hours',
      'Take NSAIDs for pain relief',
      'Gradual stretching and strengthening exercises once acute pain settles',
      'See a doctor for sudden inability to move the joint — may indicate a tendon rupture',
    ],
  },
]

export default joints

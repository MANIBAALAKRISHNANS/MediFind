export const soft_tissue = [
  {
    id: 'soft_tissue_fibromyalgia',
    name: 'Fibromyalgia',
    category: 'Musculoskeletal - Soft Tissue',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'widespread pain', weight: 0.85, description: 'All over body, tender points' },
        { name: 'fatigue', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'insomnia', weight: 0.4, description: 'Non-restorative sleep' },
        { name: 'poor concentration', weight: 0.3, description: '"Fibro fog"' },
      ],
      differentiating: [
        { name: 'tender points', weight: 0.5, description: 'Multiple specific tender points on examination' },
        // Moved out of red_flags: this entry never reaches emergency-tier
        // severity (max is see-doctor-soon), and none of these are acutely
        // dangerous on their own — they're "this might not be simple
        // fibromyalgia, get it properly worked up" differential flags, not
        // an emergency. A matched red_flag has no softer tier, so keeping
        // them there would tell someone with unexplained weight loss to go
        // to the ER, which is wrong.
        { name: 'unexplained weight loss', weight: 0.4, description: 'Suggests an alternative diagnosis should be excluded' },
        { name: 'joint swelling with widespread pain', weight: 0.4, description: 'Objective swelling is not typical of fibromyalgia itself' },
        { name: 'neurological symptoms', weight: 0.4, description: '—' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, widespread', chronic: '> 90 days is the diagnostic criterion' },
    severity_levels: {
      mild: { description: 'Mild widespread discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant pain and fatigue affecting daily life', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe pain with significant disability — should also exclude other causes', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['female gender', 'stress', 'anxiety or depression', 'other chronic pain conditions'],
    red_flags: [],
    specialist: 'Rheumatologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['musculoskeletal_rheumatoid_arthritis', 'hypothyroidism', 'depression_screening'],
    recommendations: [
      'See a rheumatologist for diagnosis — blood tests help exclude other conditions',
      'Aerobic exercise (walking, swimming) is the most evidence-based treatment',
      'Cognitive behavioral therapy is highly effective for pain management',
      'Keep a consistent sleep schedule — poor sleep worsens symptoms significantly',
      'Prescribed medications for sleep and pain may be recommended by your doctor',
    ],
  },

  {
    id: 'soft_tissue_muscle_strain',
    name: 'Muscle Strain',
    category: 'Musculoskeletal - Soft Tissue',
    aliases: ['pulled muscle'],
    symptoms: {
      primary: [
        { name: 'muscle pain', weight: 0.8, description: 'Sudden onset, often during activity' },
      ],
      secondary: [
        { name: 'swelling', weight: 0.3, description: '—' },
        { name: 'bruising', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain during specific activity', weight: 0.5, description: 'Clear relationship to a specific movement or exertion' },
        // Moved out of red_flags: entry's own max is see-doctor-today (a
        // muscle tear needs prompt ortho evaluation, not an ambulance) —
        // forcing 'emergency' via red_flags would overstate the urgency.
        { name: 'visible muscle defect', weight: 0.5, description: 'Suggests complete tear' },
        { name: 'feel a gap in my muscle', weight: 0.5, description: '—' },
        { name: 'complete inability to use the limb', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '2-6 weeks depending on severity', chronic: '> 90 days suggests a different or complicated injury' },
    severity_levels: {
      mild: { description: 'Mild discomfort without significant limitation', urgency: 'self-care' },
      moderate: { description: 'Pain limiting normal movement', urgency: 'see-doctor-soon' },
      severe: { description: 'Complete inability to use the muscle, or a visible/palpable defect (possible tear)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['sudden exertion without warm-up', 'sports activity', 'heavy lifting', 'poor conditioning'],
    red_flags: [],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['soft_tissue_myositis', 'bone_fracture_signs'],
    recommendations: [
      'Follow RICE — Rest, Ice, Compression, Elevation for the first 48 hours',
      'Take an anti-inflammatory medication for pain if needed',
      'Gradually resume activity as pain allows',
      'Gentle stretching once acute pain has settled',
      'See a doctor if there is a visible muscle defect or complete inability to use the limb',
    ],
  },

  {
    id: 'soft_tissue_myositis',
    name: 'Myositis',
    category: 'Musculoskeletal - Soft Tissue',
    aliases: ['polymyositis', 'dermatomyositis'],
    symptoms: {
      primary: [
        { name: 'muscle weakness', weight: 0.8, description: 'Proximal muscles — shoulders, hips' },
      ],
      secondary: [
        { name: 'muscle pain', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'skin rash', weight: 0.5, description: 'Present in dermatomyositis — violet discoloration around eyes' },
        { name: 'difficulty rising from chair', weight: 0.6, description: 'Reflects proximal muscle weakness' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over weeks to months', chronic: '> 42 days progressive weakness typical' },
    severity_levels: {
      mild: { description: 'Mild weakness noticed with specific activities', urgency: 'see-doctor-soon' },
      moderate: { description: 'Difficulty rising from a chair or climbing stairs', urgency: 'see-doctor-today' },
      severe: { description: 'Difficulty swallowing or breathing due to muscle weakness', urgency: 'emergency' },
    },
    risk_factors: ['autoimmune conditions', 'age 40-60', 'female gender'],
    red_flags: ['difficulty swallowing', 'breathing difficulty', 'rapid progression of weakness'],
    specialist: 'Rheumatologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['neurological_guillain_barre_awareness', 'hypothyroidism'],
    recommendations: [
      'See a rheumatologist for blood tests (muscle enzymes) and possible muscle biopsy',
      'Corticosteroids or immunosuppressants are the mainstay of treatment',
      'Physiotherapy helps maintain and restore muscle strength',
      'Screen for associated conditions as advised by your doctor',
      'Seek emergency care for difficulty swallowing or breathing',
    ],
  },

  {
    id: 'soft_tissue_plantar_fasciitis',
    name: 'Plantar Fasciitis',
    category: 'Musculoskeletal - Soft Tissue',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'heel pain', weight: 0.9, description: 'Sharp, especially first steps in the morning' },
      ],
      secondary: [
        { name: 'foot pain', weight: 0.4, description: 'Worse after prolonged standing' },
      ],
      differentiating: [
        { name: 'pain worse with first steps', weight: 0.7, description: 'Classic morning "first-step" pain pattern' },
      ],
    },
    duration_patterns: { acute: null, typical: 'weeks to months', chronic: '> 180 days suggests chronic plantar fasciitis' },
    severity_levels: {
      mild: { description: 'Mild heel discomfort', urgency: 'self-care' },
      moderate: { description: 'Pain affecting walking throughout the day', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe pain not responding to conservative treatment after months', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['obesity', 'prolonged standing', 'flat feet or high arches', 'unsupportive footwear'],
    red_flags: [],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['soft_tissue_tendinitis'],
    recommendations: [
      'Stretch the calf and plantar fascia regularly, especially before getting out of bed',
      'Wear supportive, cushioned footwear',
      'Apply ice to the heel after activity',
      'Rest from high-impact activities temporarily',
      'See an orthopedic doctor if pain persists beyond a few months of home treatment',
    ],
  },

  {
    id: 'soft_tissue_rotator_cuff',
    name: 'Rotator Cuff Injury',
    category: 'Musculoskeletal - Soft Tissue',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'shoulder pain', weight: 0.8, description: 'Worse with overhead activity' },
      ],
      secondary: [
        { name: 'shoulder weakness', weight: 0.5, description: '—' },
        { name: 'night pain', weight: 0.4, description: 'Difficulty sleeping on the affected side' },
      ],
      differentiating: [
        { name: 'pain with overhead reaching', weight: 0.6, description: 'Reproduces the pain characteristically' },
      ],
    },
    duration_patterns: { acute: '< 14 days if traumatic', typical: 'weeks to months', chronic: '> 90 days suggests chronic tear' },
    severity_levels: {
      mild: { description: 'Mild discomfort with overhead activity', urgency: 'self-care' },
      moderate: { description: 'Pain and weakness affecting daily tasks', urgency: 'see-doctor-soon' },
      severe: { description: 'Sudden complete loss of shoulder strength after injury (possible full tear)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['repetitive overhead activity', 'age over 40', 'previous shoulder injury'],
    red_flags: ['sudden complete inability to lift the arm after an injury'],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['musculoskeletal_bursitis', 'musculoskeletal_tendinitis'],
    recommendations: [
      'Rest from overhead activities and aggravating movements',
      'Apply ice for pain relief',
      'Physiotherapy strengthening exercises are the mainstay of treatment',
      'Take NSAIDs for pain and inflammation as needed',
      'See an orthopedic doctor for a sudden complete loss of shoulder strength — may need imaging/surgery',
    ],
  },

  {
    id: 'soft_tissue_tennis_elbow',
    name: 'Tennis Elbow (Lateral Epicondylitis)',
    category: 'Musculoskeletal - Soft Tissue',
    aliases: ['lateral epicondylitis'],
    symptoms: {
      primary: [
        { name: 'elbow pain', weight: 0.85, description: 'Outer elbow, worse with gripping' },
      ],
      secondary: [
        { name: 'grip weakness', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'pain with wrist extension against resistance', weight: 0.6, description: 'Reproduces the characteristic pain' },
      ],
    },
    duration_patterns: { acute: null, typical: 'weeks to months', chronic: '> 180 days suggests chronic tendinopathy' },
    severity_levels: {
      mild: { description: 'Mild discomfort with specific activities', urgency: 'self-care' },
      moderate: { description: 'Pain affecting grip and daily tasks', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe pain not improving after months of conservative treatment', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['repetitive wrist/forearm motion', 'racquet sports', 'manual labor', 'computer use'],
    red_flags: [],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['musculoskeletal_tendinitis'],
    recommendations: [
      'Rest from the aggravating activity',
      'Apply ice to the outer elbow after activity',
      'Use a counterforce brace during activities that trigger pain',
      'Gradual stretching and strengthening exercises once acute pain settles',
      'See a doctor if pain persists despite several months of conservative treatment',
    ],
  },

  {
    id: 'musculoskeletal_back_pain',
    name: 'Mechanical Lower Back Pain',
    category: 'Musculoskeletal - Soft Tissue',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'lower back pain', weight: 0.85, description: 'Localized, worse with movement' },
      ],
      secondary: [
        { name: 'back stiffness', weight: 0.4, description: '—' },
        { name: 'muscle spasm', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'no leg radiation', weight: 0.4, description: 'Pain stays localized to the back, distinguishing from sciatica' },
      ],
    },
    duration_patterns: { acute: '< 42 days', typical: '4-6 weeks with conservative treatment', chronic: '> 90 days is chronic back pain' },
    severity_levels: {
      mild: { description: 'Mild discomfort, manageable with activity', urgency: 'self-care' },
      moderate: { description: 'Pain limiting normal activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Loss of bladder/bowel control, or leg weakness (cauda equina emergency)', urgency: 'emergency' },
    },
    risk_factors: ['prolonged sitting', 'poor posture', 'heavy lifting', 'obesity', 'sedentary lifestyle'],
    red_flags: ['loss of bladder or bowel control', 'progressive leg weakness', 'fever with back pain', 'pain after significant trauma'],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['neurological_sciatica', 'kidney_stones'],
    recommendations: [
      'Apply a heat pad to relax muscles',
      'Continue light activity — avoid complete bed rest',
      'Take an anti-inflammatory medication for pain relief',
      'Practice good posture and proper lifting technique',
      'Go to emergency care for loss of bladder/bowel control or leg weakness',
    ],
  },
]

export default soft_tissue

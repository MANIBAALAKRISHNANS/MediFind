export const peripheral = [
  {
    id: 'neurological_peripheral_neuropathy',
    name: 'Peripheral Neuropathy',
    category: 'Neurological - Peripheral',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'numbness', weight: 0.8, description: 'Hands and feet, glove-and-stocking pattern' },
        { name: 'tingling', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'burning feet', weight: 0.5, description: '—' },
        { name: 'weakness', weight: 0.3, description: 'In affected limbs' },
      ],
      differentiating: [
        { name: 'diabetes history', weight: 0.5, description: 'Most common cause in India' },
        { name: 'symmetric distribution', weight: 0.4, description: 'Both feet/hands affected equally' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over months', chronic: '> 90 days progressive symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild tingling in toes', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant numbness affecting balance', urgency: 'see-doctor-soon' },
      severe: { description: 'Rapidly spreading weakness, or a foot ulcer due to loss of sensation', urgency: 'see-doctor-today' },
    },
    risk_factors: ['diabetes', 'vitamin B12 deficiency (vegetarian diet)', 'alcohol use', 'certain medications'],
    red_flags: ['rapidly spreading weakness', 'loss of bladder or bowel control', 'non-healing foot wound with numbness'],
    specialist: 'Neurologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['vitamin_b12_deficiency', 'diabetes_type2', 'neurological_guillain_barre_awareness'],
    recommendations: [
      'See a neurologist — nerve conduction studies help confirm and localize the damage',
      'Control blood sugar strictly if diabetic — the most important intervention',
      'Take vitamin B12 supplements if deficient',
      'Inspect feet daily for cuts or wounds since numb feet cannot feel injuries',
      'Seek emergency care for rapidly spreading weakness or loss of bladder/bowel control',
    ],
  },

  {
    id: 'neurological_carpal_tunnel',
    name: 'Carpal Tunnel Syndrome',
    category: 'Neurological - Peripheral',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'hand numbness', weight: 0.8, description: 'Thumb, index, and middle fingers' },
        { name: 'tingling', weight: 0.6, description: 'In the hand' },
      ],
      secondary: [
        { name: 'wrist pain', weight: 0.4, description: '—' },
        { name: 'hand weakness', weight: 0.3, description: 'Dropping objects' },
      ],
      differentiating: [
        { name: 'worse at night', weight: 0.5, description: 'Symptoms often wake patients from sleep' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over months', chronic: '> 90 days progressive symptoms typical' },
    severity_levels: {
      mild: { description: 'Intermittent tingling', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent numbness affecting grip', urgency: 'see-doctor-soon' },
      severe: { description: 'Constant numbness with muscle wasting at the base of the thumb', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['repetitive wrist movement', 'computer/keyboard use', 'pregnancy', 'diabetes', 'hypothyroidism'],
    red_flags: ['complete loss of thumb grip strength', 'severe constant numbness with no relief'],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['musculoskeletal_cervical_spondylosis', 'neurological_peripheral_neuropathy'],
    recommendations: [
      'Wear a wrist splint at night to keep the wrist in a neutral position',
      'Take regular breaks from repetitive wrist activities',
      'See a neurologist for nerve conduction studies if symptoms persist',
      'Physiotherapy and ergonomic adjustments help mild-moderate cases',
      'See a doctor urgently if grip strength is rapidly weakening',
    ],
  },

  {
    id: 'neurological_sciatica',
    name: 'Sciatica',
    category: 'Neurological - Peripheral',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'back pain', weight: 0.6, description: 'Lower back' },
        { name: 'leg pain', weight: 0.8, description: 'Radiating down the back of the leg' },
      ],
      secondary: [
        { name: 'numbness', weight: 0.4, description: 'In the leg or foot' },
        { name: 'tingling', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'pain radiating below the knee', weight: 0.6, description: 'Distinguishes true sciatica from simple back pain' },
      ],
    },
    duration_patterns: { acute: '< 42 days', typical: '4-6 weeks with conservative treatment', chronic: '> 90 days suggests need for further evaluation' },
    severity_levels: {
      mild: { description: 'Mild radiating discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant pain limiting activity', urgency: 'see-doctor-soon' },
      severe: { description: 'Leg weakness, or loss of bladder/bowel control (cauda equina emergency)', urgency: 'emergency' },
    },
    risk_factors: ['disc herniation', 'prolonged sitting', 'heavy lifting', 'obesity', 'age 30-50'],
    red_flags: ['loss of bladder or bowel control', 'progressive leg weakness', 'numbness in the groin/saddle area', 'pain after significant trauma'],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['musculoskeletal_back_pain', 'vascular_pad'],
    recommendations: [
      'Continue light activity — avoid complete bed rest, which slows recovery',
      'Apply heat to the lower back for muscle relaxation',
      'Take prescribed anti-inflammatory medication for pain',
      'See an orthopedic doctor for physiotherapy if pain persists more than a week',
      'Go to emergency care immediately for loss of bladder/bowel control or progressive leg weakness',
    ],
  },

  {
    id: 'neurological_guillain_barre_awareness',
    name: 'Guillain-Barré Syndrome (Awareness)',
    category: 'Neurological - Peripheral',
    aliases: ['gbs'],
    symptoms: {
      primary: [
        { name: 'ascending weakness', weight: 0.9, description: 'Starts in legs, moves upward' },
        { name: 'numbness', weight: 0.5, description: 'In hands and feet' },
      ],
      secondary: [
        { name: 'tingling', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'recent infection', weight: 0.5, description: 'Often follows a gastrointestinal or respiratory infection by 1-3 weeks' },
        { name: 'rapidly progressive weakness', weight: 0.8, description: 'Weakness worsening over days is a hallmark' },
      ],
    },
    duration_patterns: { acute: '< 14 days progression', typical: 'progresses over days to 4 weeks', chronic: 'recovery can take months' },
    severity_levels: {
      mild: { description: 'This condition requires emergency evaluation even at early/mild stages due to rapid progression risk', urgency: 'emergency' },
      moderate: { description: 'Ascending weakness affecting walking', urgency: 'emergency' },
      severe: { description: 'Breathing difficulty or weakness affecting swallowing', urgency: 'emergency' },
    },
    risk_factors: ['recent gastrointestinal or respiratory infection', 'recent vaccination (rare)'],
    red_flags: ['rapidly progressive weakness', 'breathing difficulty', 'difficulty swallowing'],
    specialist: 'Neurologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['neurological_peripheral_neuropathy', 'central_epilepsy'],
    recommendations: [
      'Go to the hospital immediately — this condition can progress to affect breathing within hours to days',
      'Hospital monitoring of breathing function is essential in the acute phase',
      'Treatment (IVIG or plasma exchange) is most effective when started early',
      'Most patients recover significantly with treatment, though recovery can take months',
      'This is a medical emergency — do not wait to see if weakness improves on its own',
    ],
  },

  {
    id: 'neurological_restless_leg',
    name: 'Restless Leg Syndrome',
    category: 'Neurological - Peripheral',
    aliases: ['rls'],
    symptoms: {
      primary: [
        { name: 'urge to move legs', weight: 0.85, description: 'Uncomfortable sensation relieved by movement' },
      ],
      secondary: [
        { name: 'insomnia', weight: 0.5, description: 'Due to symptoms disrupting sleep' },
        { name: 'leg discomfort', weight: 0.5, description: 'Crawling or tingling sensation' },
      ],
      differentiating: [
        { name: 'worse in the evening', weight: 0.6, description: 'Symptoms characteristically worsen at rest, especially evening/night' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, recurring nightly', chronic: '> 90 days recurring symptoms typical' },
    severity_levels: {
      mild: { description: 'Occasional mild discomfort', urgency: 'self-care' },
      moderate: { description: 'Nightly symptoms disrupting sleep', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe symptoms significantly impairing sleep and daily function', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['iron deficiency', 'pregnancy', 'kidney disease', 'family history'],
    red_flags: [],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['insomnia', 'anemia_iron_deficiency'],
    recommendations: [
      'Check and correct iron deficiency if present — a common treatable cause',
      'Maintain a regular sleep schedule',
      'Avoid caffeine and alcohol in the evening',
      'Gentle stretching or a warm bath before bed may help',
      'See a neurologist if symptoms significantly disrupt sleep despite these measures',
    ],
  },

  {
    id: 'neurological_essential_tremor',
    name: 'Essential Tremor',
    category: 'Neurological - Peripheral',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'hand tremor', weight: 0.85, description: 'Worsens with action/intention, not at rest' },
      ],
      secondary: [
        { name: 'voice tremor', weight: 0.3, description: 'In some cases' },
        { name: 'head tremor', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'tremor worse with action', weight: 0.7, description: 'Unlike Parkinson\'s tremor which is worse at rest' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset, slowly progressive', chronic: '> 365 days typical, often lifelong' },
    severity_levels: {
      mild: { description: 'Mild tremor not affecting daily tasks', urgency: 'self-care' },
      moderate: { description: 'Tremor interfering with writing or eating', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe tremor significantly impairing independence', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['family history', 'age over 40'],
    red_flags: [],
    specialist: 'Neurologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['central_parkinsons_early', 'hyperthyroidism'],
    recommendations: [
      'See a neurologist for clinical evaluation to distinguish from Parkinson\'s disease',
      'Avoid caffeine, which can worsen tremor',
      'Prescribed medications (beta-blockers or others) can reduce tremor severity',
      'Occupational therapy can help with daily task adaptations',
      'Tremor that significantly worsens or spreads should be re-evaluated',
    ],
  },
]

export default peripheral

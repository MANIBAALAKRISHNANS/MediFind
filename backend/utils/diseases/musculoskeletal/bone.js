export const bone = [
  {
    id: 'bone_osteoporosis',
    name: 'Osteoporosis',
    category: 'Musculoskeletal - Bone',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'back pain', weight: 0.4, description: 'From vertebral compression, may be absent until fracture' },
      ],
      secondary: [
        { name: 'height loss', weight: 0.4, description: 'Gradual, over years' },
        { name: 'stooped posture', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'fracture from minor fall', weight: 0.7, description: 'Fragility fracture from low-impact trauma is a key indicator' },
        { name: 'postmenopausal', weight: 0.5, description: 'Major risk period for women' },
        // Moved out of red_flags: entry's own max is see-doctor-today (a
        // fragility fracture needs prompt imaging/ortho care, not an
        // ambulance) — forcing 'emergency' would overstate the urgency.
        { name: 'fracture from minor trauma', weight: 0.6, description: '—' },
        { name: 'sudden severe back pain after a minor fall', weight: 0.6, description: 'Suggests a new vertebral compression fracture' },
      ],
    },
    duration_patterns: { acute: null, typical: 'silent, progressive over years', chronic: '> 365 days typical before diagnosis' },
    severity_levels: {
      mild: { description: 'Low bone density on screening, no fractures', urgency: 'see-doctor-soon' },
      moderate: { description: 'Height loss or mild back pain', urgency: 'see-doctor-soon' },
      severe: { description: 'Fracture from a minor fall or bump', urgency: 'see-doctor-today' },
    },
    risk_factors: ['postmenopausal women', 'age over 50', 'low calcium/vitamin D intake', 'sedentary lifestyle', 'smoking', 'family history'],
    red_flags: [],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'female',
    similar_diseases: ['vitamin_d_deficiency', 'bone_pagets_disease'],
    recommendations: [
      'See a doctor for a bone density (DEXA) scan',
      'Ensure adequate calcium and vitamin D intake through diet and sunlight',
      'Do weight-bearing exercise regularly to maintain bone strength',
      'Avoid smoking and excessive alcohol',
      'Take prescribed bone-strengthening medication if diagnosed with osteoporosis',
    ],
  },

  {
    id: 'bone_osteomyelitis',
    name: 'Osteomyelitis (Bone Infection)',
    category: 'Musculoskeletal - Bone',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'bone pain', weight: 0.8, description: 'Deep, constant, localized' },
        { name: 'fever', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'swelling', weight: 0.4, description: 'Over affected area' },
        { name: 'warmth over bone', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'recent wound or surgery near the bone', weight: 0.5, description: 'Common route of infection' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset', typical: 'requires weeks of antibiotic treatment', chronic: '> 42 days suggests chronic osteomyelitis' },
    severity_levels: {
      mild: { description: 'This condition requires urgent evaluation even when apparently mild', urgency: 'see-doctor-today' },
      moderate: { description: 'Fever with localized bone pain and swelling', urgency: 'emergency' },
      severe: { description: 'Signs of sepsis or rapidly spreading infection', urgency: 'emergency' },
    },
    risk_factors: ['diabetes', 'recent surgery or open fracture', 'immunocompromised', 'IV drug use', 'peripheral vascular disease'],
    red_flags: ['confusion with rapid heart rate', 'rapidly spreading swelling and redness'],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_cellulitis', 'musculoskeletal_septic_arthritis'],
    recommendations: [
      'See a doctor urgently — imaging and blood cultures are needed to confirm',
      'Prolonged IV antibiotic treatment is usually required',
      'Surgical drainage may be needed for confirmed bone infection',
      'Diabetics should monitor any foot wound extremely closely',
      'Seek emergency care for signs of sepsis or rapidly spreading infection',
    ],
  },

  {
    id: 'bone_fracture_signs',
    name: 'Bone Fracture — Warning Signs',
    category: 'Musculoskeletal - Bone',
    aliases: ['broken bone'],
    symptoms: {
      primary: [
        { name: 'severe localized pain', weight: 0.9, description: 'After an injury, worse with movement' },
        { name: 'swelling', weight: 0.6, description: 'Rapid, around the injury' },
      ],
      secondary: [
        { name: 'bruising', weight: 0.4, description: '—' },
        { name: 'deformity', weight: 0.5, description: 'Visible abnormal shape' },
      ],
      differentiating: [
        { name: 'inability to bear weight or use the limb', weight: 0.7, description: 'Strongly suggests fracture over sprain' },
        { name: 'visible deformity', weight: 0.7, description: 'Highly suggestive of fracture' },
      ],
    },
    duration_patterns: { acute: 'immediate after injury', typical: 'requires prompt imaging and immobilization', chronic: null },
    severity_levels: {
      mild: { description: 'Pain and swelling without deformity — still needs X-ray evaluation', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant pain with inability to bear weight/use limb', urgency: 'see-doctor-today' },
      severe: { description: 'Visible deformity, bone protruding through skin, or loss of sensation/pulse below injury', urgency: 'emergency' },
    },
    risk_factors: ['trauma or fall', 'osteoporosis', 'sports injury', 'road traffic accident'],
    red_flags: ['bone visible through the skin', 'loss of sensation or pulse below the injury', 'severe deformity', 'inability to move the limb at all'],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['soft_tissue_muscle_strain'],
    recommendations: [
      'Immobilize the injured area and avoid moving it unnecessarily',
      'Apply ice wrapped in cloth to reduce swelling',
      'Go to the emergency room for X-ray evaluation, especially with deformity or inability to bear weight',
      'Do not attempt to realign a visibly deformed limb yourself',
      'Call emergency services immediately for an open fracture or loss of sensation/pulse below the injury',
    ],
  },

  {
    id: 'bone_pagets_disease',
    name: "Paget's Disease of Bone",
    category: 'Musculoskeletal - Bone',
    aliases: ['pagets disease'],
    symptoms: {
      primary: [
        { name: 'bone pain', weight: 0.7, description: 'Deep, aching' },
      ],
      secondary: [
        { name: 'bone deformity', weight: 0.4, description: 'Bowing of long bones' },
        { name: 'joint pain', weight: 0.3, description: 'Adjacent to affected bones' },
      ],
      differentiating: [
        { name: 'age over 50', weight: 0.4, description: 'Rarely seen before age 50' },
        { name: 'hearing loss', weight: 0.3, description: 'If skull bones affected' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, often found incidentally', chronic: '> 365 days typical' },
    severity_levels: {
      mild: { description: 'Asymptomatic, found incidentally on imaging', urgency: 'see-doctor-soon' },
      moderate: { description: 'Bone pain with mild deformity', urgency: 'see-doctor-soon' },
      severe: { description: 'Fracture, severe deformity, or new neurological symptoms', urgency: 'see-doctor-today' },
    },
    risk_factors: ['age over 50', 'family history', 'male gender'],
    red_flags: ['fracture with minimal trauma', 'new neurological symptoms', 'rapidly worsening bone pain'],
    specialist: 'Orthopedic Specialist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'male',
    similar_diseases: ['bone_osteoporosis'],
    recommendations: [
      'See a doctor for blood tests (alkaline phosphatase) and imaging',
      'Prescribed bisphosphonate medication can control disease activity',
      'Regular monitoring for complications like fracture or hearing loss',
      'Adequate calcium and vitamin D intake as advised',
      'See a doctor promptly for new bone pain or neurological symptoms',
    ],
  },
]

export default bone

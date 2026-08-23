export const vascular = [
  {
    id: 'vascular_dvt',
    name: 'Deep Vein Thrombosis (DVT)',
    category: 'Cardiovascular - Vascular',
    aliases: ['dvt'],
    symptoms: {
      primary: [
        { name: 'leg swelling', weight: 0.85, description: 'Usually one-sided' },
        { name: 'calf pain', weight: 0.7, description: 'Tenderness, warmth' },
      ],
      secondary: [
        { name: 'skin redness', weight: 0.4, description: 'Over the affected area' },
      ],
      differentiating: [
        { name: 'one-sided leg swelling', weight: 0.6, description: 'Asymmetric swelling distinguishes from systemic causes like heart failure' },
        { name: 'recent surgery or immobility', weight: 0.5, description: 'Major risk factor' },
      ],
    },
    duration_patterns: { acute: '< 7 days onset', typical: 'requires prompt treatment', chronic: null },
    severity_levels: {
      mild: { description: 'This condition requires prompt evaluation even when apparently mild', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant one-sided leg swelling and pain', urgency: 'emergency' },
      severe: { description: 'Sudden breathlessness or chest pain (suggests pulmonary embolism)', urgency: 'emergency' },
    },
    risk_factors: ['recent surgery', 'prolonged immobility/long travel', 'pregnancy', 'oral contraceptive use', 'obesity', 'smoking'],
    red_flags: ['sudden breathlessness or chest pain', 'severe calf pain with swelling'],
    specialist: 'Vascular Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['vascular_varicose_veins', 'bacterial_cellulitis', 'parasitic_filariasis'],
    recommendations: [
      'See a doctor urgently — Doppler ultrasound is needed to confirm',
      'Blood thinners are usually needed promptly to prevent clot spread',
      'Avoid massaging the affected leg — could dislodge the clot',
      'Keep the leg elevated as advised',
      'Seek emergency care immediately for sudden breathlessness or chest pain',
    ],
  },

  {
    id: 'vascular_pulmonary_embolism',
    name: 'Pulmonary Embolism',
    category: 'Cardiovascular - Vascular',
    aliases: ['pe', 'blood clot in lung'],
    symptoms: {
      primary: [
        { name: 'sudden shortness of breath', weight: 1.0, description: 'Abrupt onset' },
        { name: 'chest pain', weight: 0.7, description: 'Pleuritic, worse with breathing' },
      ],
      secondary: [
        { name: 'rapid heart rate', weight: 0.4, description: '—' },
        { name: 'calf swelling', weight: 0.4, description: 'Suggests DVT as the source' },
      ],
      differentiating: [
        { name: 'recent surgery or immobility', weight: 0.6, description: 'Major precipitating risk factor' },
        { name: 'hemoptysis', weight: 0.5, description: 'Coughing blood' },
      ],
    },
    duration_patterns: { acute: 'sudden onset, minutes', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always an emergency once suspected', urgency: 'emergency' },
      moderate: { description: 'Sudden breathlessness with chest pain', urgency: 'emergency' },
      severe: { description: 'Severe breathlessness, fainting, or shock', urgency: 'emergency' },
    },
    risk_factors: ['recent surgery', 'prolonged immobility/long flight', 'DVT history', 'cancer', 'pregnancy', 'oral contraceptive use'],
    red_flags: [
      'sudden severe breathlessness',
      'sudden shortness of breath with chest pain',
      'sudden breathlessness with chest pain',
    ],
    specialist: 'Pulmonologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['heart_attack', 'respiratory_pleurisy', 'pneumothorax'],
    recommendations: [
      'Call emergency services (108/112) immediately — this is a medical emergency',
      'Oxygen therapy is given immediately on arrival at hospital',
      'CT pulmonary angiography confirms the diagnosis',
      'Anticoagulation is the mainstay treatment, started urgently',
      'Do not delay — call 108 immediately for sudden severe breathlessness with or without calf swelling',
    ],
  },

  {
    id: 'vascular_varicose_veins',
    name: 'Varicose Veins',
    category: 'Cardiovascular - Vascular',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'leg pain', weight: 0.6, description: 'Aching, heaviness, worse by end of day' },
        { name: 'visible bulging veins', weight: 0.7, description: 'Twisted, enlarged veins visible under skin' },
      ],
      secondary: [
        { name: 'leg swelling', weight: 0.4, description: 'Mild, evening' },
        { name: 'itching', weight: 0.3, description: 'Over affected veins' },
      ],
      differentiating: [
        { name: 'symptoms worse standing', weight: 0.5, description: 'Improves with leg elevation' },
        // Moved out of red_flags: a venous ulcer needs prompt wound care,
        // not an ambulance — matches this entry's own see-doctor-today max
        // (was already matchable, pre-existing mismatch fixed here too).
        { name: 'skin ulceration', weight: 0.5, description: '—' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, progressive', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Visible veins without significant discomfort', urgency: 'self-care' },
      moderate: { description: 'Aching and swelling affecting daily activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Skin ulceration, bleeding, or signs of clot formation', urgency: 'see-doctor-today' },
    },
    risk_factors: ['prolonged standing occupation', 'pregnancy', 'obesity', 'family history', 'age'],
    // "sudden bleeding from a vein" and "sudden calf pain with swelling"
    // (DVT signs) kept — active uncontrolled venous bleeding and a possible
    // clot are both independently urgent regardless of how mild the
    // varicose veins usually are.
    red_flags: ['sudden bleeding from a vein', 'sudden calf pain with swelling'],
    specialist: 'Vascular Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['vascular_dvt', 'vascular_pad'],
    recommendations: [
      'Wear compression stockings as advised',
      'Elevate legs when resting',
      'Avoid prolonged standing or sitting — take movement breaks',
      'Maintain a healthy weight',
      'See a vascular specialist if pain is significant or skin changes/ulcers develop',
    ],
  },

  {
    id: 'vascular_pad',
    name: 'Peripheral Artery Disease (PAD)',
    category: 'Cardiovascular - Vascular',
    aliases: ['pad'],
    symptoms: {
      primary: [
        { name: 'leg pain', weight: 0.8, description: 'Cramping with walking, relieved by rest (claudication)' },
      ],
      secondary: [
        { name: 'cold hands and feet', weight: 0.4, description: 'Affected limb feels cooler' },
        { name: 'weakness', weight: 0.3, description: 'In the affected leg' },
      ],
      differentiating: [
        { name: 'pain with walking relieved by rest', weight: 0.7, description: 'Intermittent claudication is the hallmark symptom' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, progressive', chronic: '> 90 days typical presentation' },
    severity_levels: {
      mild: { description: 'Mild cramping after long-distance walking', urgency: 'see-doctor-soon' },
      moderate: { description: 'Cramping with short-distance walking', urgency: 'see-doctor-soon' },
      severe: { description: 'Pain at rest, non-healing wound, or limb color change (critical limb ischemia)', urgency: 'emergency' },
    },
    risk_factors: ['smoking', 'diabetes', 'hypertension', 'high cholesterol', 'age over 60'],
    red_flags: ['pain at rest', 'non-healing wound on foot', 'sudden limb pallor and coldness'],
    specialist: 'Vascular Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['neurological_sciatica', 'vascular_varicose_veins'],
    recommendations: [
      'See a vascular specialist for ankle-brachial index testing',
      'Quit smoking completely — critical for slowing disease progression',
      'Control diabetes, blood pressure, and cholesterol',
      'Supervised walking exercise programs can improve symptoms',
      'Seek emergency care for a sudden cold, pale, or painful limb, or a non-healing wound',
    ],
  },

  {
    id: 'vascular_aortic_aneurysm_warning',
    name: 'Aortic Aneurysm — Warning Signs (Awareness)',
    category: 'Cardiovascular - Vascular',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'abdominal pain', weight: 0.5, description: 'Deep, constant, may be absent until rupture' },
        { name: 'back pain', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'pulsating abdominal mass', weight: 0.5, description: 'Felt on self or clinical exam' },
      ],
      differentiating: [
        { name: 'sudden severe pain', weight: 0.9, description: 'Sudden tearing pain suggests rupture or dissection — extreme emergency' },
      ],
    },
    duration_patterns: { acute: 'rupture is sudden', typical: 'often asymptomatic until rupture', chronic: null },
    severity_levels: {
      mild: { description: 'Asymptomatic, found incidentally on imaging', urgency: 'see-doctor-soon' },
      moderate: { description: 'Mild constant abdominal or back discomfort', urgency: 'see-doctor-today' },
      severe: { description: 'Sudden severe abdominal/back pain with dizziness or collapse (rupture)', urgency: 'emergency' },
    },
    risk_factors: ['smoking', 'hypertension', 'age over 65', 'male gender', 'family history'],
    red_flags: ['sudden severe tearing abdominal or back pain', 'dizziness or fainting with abdominal pain', 'pulsating abdominal mass with pain'],
    specialist: 'Vascular Specialist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'male',
    similar_diseases: ['gi_peptic_ulcer', 'kidney_stones'],
    recommendations: [
      'Call emergency services immediately for sudden severe abdominal or back pain with dizziness',
      'Men over 65 with a smoking history should discuss screening ultrasound with their doctor',
      'Control blood pressure strictly if an aneurysm is known',
      'Avoid heavy lifting/straining if a large aneurysm has been diagnosed',
      'This is informational only — any suspected rupture is a life-threatening emergency',
    ],
  },

  {
    id: 'vascular_raynauds',
    name: "Raynaud's Phenomenon",
    category: 'Cardiovascular - Vascular',
    aliases: ['raynauds'],
    symptoms: {
      primary: [
        { name: 'cold hands and feet', weight: 0.7, description: 'Triggered by cold or stress' },
        { name: 'skin discoloration', weight: 0.7, description: 'Fingers turn white, then blue, then red' },
      ],
      secondary: [
        { name: 'numbness', weight: 0.4, description: 'During episodes' },
        { name: 'tingling', weight: 0.4, description: 'As circulation returns' },
      ],
      differentiating: [
        { name: 'triggered by cold exposure', weight: 0.6, description: 'Episodes clearly linked to cold or emotional stress' },
        // Moved out of red_flags: both match this entry's own
        // see-doctor-today max, and "suggests secondary Raynaud's" is a
        // differential note, not an acute emergency.
        { name: 'skin ulceration on fingertips', weight: 0.5, description: '—' },
        { name: 'joint pain with rash', weight: 0.4, description: 'Suggests an underlying autoimmune disease' },
      ],
    },
    duration_patterns: { acute: '< 1 hour per episode', typical: 'episodic, recurrent with cold exposure', chronic: 'condition itself may be lifelong' },
    severity_levels: {
      mild: { description: 'Occasional color change without pain', urgency: 'self-care' },
      moderate: { description: 'Frequent episodes with discomfort', urgency: 'see-doctor-soon' },
      severe: { description: 'Skin ulceration or sores on fingertips (suggests secondary Raynaud\'s from underlying disease)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['female gender', 'cold climate exposure', 'family history', 'autoimmune disease (secondary Raynaud\'s)'],
    red_flags: [],
    specialist: 'Rheumatologist',
    india_prevalence: 'low',
    seasonal_pattern: 'winter',
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['vascular_pad', 'lupus_awareness'],
    recommendations: [
      'Keep hands and feet warm, wear gloves in cold weather',
      'Avoid smoking and caffeine, which can worsen symptoms',
      'Manage stress, as emotional stress can trigger episodes',
      'See a doctor if episodes are frequent, severe, or ulcers develop — may indicate an underlying condition',
      'Warm the affected area gradually during an episode — avoid sudden heat',
    ],
  },

  {
    id: 'vascular_vasculitis',
    name: 'Vasculitis',
    category: 'Cardiovascular - Vascular',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'skin rash', weight: 0.5, description: 'Purple/red spots (purpura), especially legs' },
        { name: 'joint pain', weight: 0.4, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'purple skin spots', weight: 0.6, description: 'Palpable purpura, doesn\'t blanch with pressure' },
      ],
    },
    duration_patterns: { acute: null, typical: 'variable, can be acute or chronic', chronic: '> 90 days for chronic forms' },
    severity_levels: {
      mild: { description: 'Skin rash without organ involvement', urgency: 'see-doctor-soon' },
      moderate: { description: 'Rash with joint pain and fatigue', urgency: 'see-doctor-today' },
      severe: { description: 'Kidney involvement, severe abdominal pain, or neurological symptoms', urgency: 'emergency' },
    },
    risk_factors: ['autoimmune disease', 'recent infection', 'certain medications'],
    red_flags: ['blood in urine', 'severe abdominal pain', 'neurological symptoms', 'breathing difficulty'],
    specialist: 'Rheumatologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['lupus_awareness', 'rheumatoid_arthritis'],
    recommendations: [
      'See a rheumatologist for blood tests and possible skin/kidney biopsy',
      'Treatment often includes corticosteroids or immunosuppressants',
      'Monitor kidney function regularly with blood and urine tests',
      'Report new or worsening symptoms promptly',
      'Seek emergency care for blood in urine, severe abdominal pain, or neurological symptoms',
    ],
  },
]

export default vascular

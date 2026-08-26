export const upper = [
  {
    id: 'respiratory_common_cold',
    name: 'Common Cold',
    category: 'Respiratory - Upper',
    aliases: ['cold', 'upper respiratory infection'],
    symptoms: {
      primary: [
        { name: 'rhinorrhea', weight: 0.8, description: 'Runny nose' },
        // 0.5 → 0.6: at 0.5 a bare "cough" reached COVID-19 before it reached
        // the common cold, which is the overwhelmingly likelier cause and the
        // one that does not need a test to act on.
        { name: 'cough', weight: 0.6, description: 'Mild, often dry' },
        { name: 'nasal congestion', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'sneezing', weight: 0.5, description: '—' },
        { name: 'sore throat', weight: 0.4, description: 'Mild' },
        { name: 'mild headache', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'gradual onset', weight: 0.4, description: 'Symptoms develop over 1-2 days, unlike flu\'s sudden onset' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '7-10 days', chronic: '> 14 days suggests sinusitis or another cause' },
    severity_levels: {
      mild: { description: 'Runny nose, mild cough, no fever', urgency: 'self-care' },
      moderate: { description: 'Congestion with mild fever and sore throat', urgency: 'self-care' },
      severe: { description: 'Symptoms worsening after day 7, or high fever developing', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['contact with infected person', 'seasonal change', 'crowded places'],
    red_flags: ['fever above 102°F lasting more than 3 days', 'difficulty breathing', 'severe facial pain'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['viral_influenza', 'allergic_rhinitis', 'sinusitis'],
    recommendations: [
      'Rest and stay warm',
      'Drink warm fluids — ginger tea, soups',
      'Use saline nasal drops or steam inhalation for congestion',
      'Take paracetamol if fever or throat discomfort is bothersome',
      'See a doctor if symptoms worsen after day 7 or fever rises above 102°F',
    ],
  },

  {
    id: 'respiratory_sinusitis',
    name: 'Sinusitis',
    category: 'Respiratory - Upper',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'facial pain', weight: 0.8, description: 'Pressure over cheeks/forehead' },
        { name: 'nasal congestion', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'headache', weight: 0.5, description: '—' },
        { name: 'reduced smell', weight: 0.3, description: '—' },
        { name: 'post-nasal drip', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'facial pain worse bending forward', weight: 0.6, description: 'Characteristic of sinus pressure' },
      ],
    },
    duration_patterns: { acute: '< 10 days', typical: '10-14 days', chronic: '> 90 days indicates chronic sinusitis' },
    severity_levels: {
      mild: { description: 'Mild facial pressure and congestion', urgency: 'self-care' },
      moderate: { description: 'Facial pain with fever, symptoms beyond 10 days', urgency: 'see-doctor-soon' },
      severe: { description: 'Swelling around eyes, vision changes, or severe headache with fever', urgency: 'emergency' },
    },
    risk_factors: ['recent cold', 'air pollution exposure', 'allergies', 'nasal septum deviation'],
    // Bare "stiff neck" narrowed — it also matches "neck stiffness" via the
    // synonym map, which is commonly just from sleeping awkwardly.
    red_flags: ['swelling around eyes', 'vision changes', 'severe headache with fever', 'stiff neck with fever'],
    specialist: 'ENT Specialist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_common_cold', 'allergic_rhinitis', 'tension_headache'],
    recommendations: [
      'Use saline nasal irrigation twice daily',
      'Steam inhalation 3-4 times daily',
      'See an ENT doctor if symptoms persist more than 10 days — antibiotics may be needed',
      'Avoid cold drinks and air conditioning',
      'Seek emergency care for swelling around the eyes or vision changes',
    ],
  },

  {
    id: 'respiratory_pharyngitis',
    name: 'Viral Pharyngitis',
    category: 'Respiratory - Upper',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'throat pain', weight: 0.8, description: 'Scratchy, mild to moderate' },
      ],
      secondary: [
        { name: 'mild fever', weight: 0.3, description: '—' },
        { name: 'cough', weight: 0.4, description: '—' },
        { name: 'rhinorrhea', weight: 0.4, description: 'Often accompanies' },
      ],
      differentiating: [
        { name: 'runny nose with sore throat', weight: 0.4, description: 'Concurrent cold symptoms favor viral over bacterial cause' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-5 days', chronic: null },
    severity_levels: {
      mild: { description: 'Mild throat discomfort', urgency: 'self-care' },
      moderate: { description: 'Painful swallowing with fever', urgency: 'see-doctor-soon' },
      severe: { description: 'Difficulty breathing or swallowing saliva', urgency: 'emergency' },
    },
    risk_factors: ['contact with infected person', 'seasonal change'],
    red_flags: ['difficulty breathing', 'drooling/unable to swallow', 'severe neck swelling'],
    specialist: 'General Physician',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_strep_throat', 'tonsillitis'],
    recommendations: [
      'Gargle with warm salt water several times a day',
      'Take paracetamol for pain relief',
      'Drink warm fluids and honey-lemon water',
      'Rest your voice',
      'See a doctor if pain is severe or lasts more than a week',
    ],
  },

  {
    id: 'respiratory_laryngitis',
    name: 'Laryngitis',
    category: 'Respiratory - Upper',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'hoarseness', weight: 0.85, description: 'Voice change or loss' },
        { name: 'throat pain', weight: 0.4, description: 'Mild' },
      ],
      secondary: [
        { name: 'dry cough', weight: 0.4, description: '—' },
        { name: 'throat irritation', weight: 0.3, description: 'Tickling sensation' },
      ],
      differentiating: [
        { name: 'voice overuse', weight: 0.4, description: 'Often follows shouting, singing, or prolonged talking' },
        // Moved out of red_flags: this is a "get it checked to exclude a
        // more serious cause" concern (per duration_patterns.chronic
        // below), not an emergency — the red_flags mechanism forces
        // urgency:'emergency' on any match with no softer tier, which
        // would be clinically wrong here.
        { name: 'hoarseness lasting three weeks', weight: 0.5, description: 'Persistent hoarseness beyond the typical course warrants ENT evaluation' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-7 days', chronic: '> 14 days warrants ENT evaluation' },
    severity_levels: {
      mild: { description: 'Mild hoarseness', urgency: 'self-care' },
      moderate: { description: 'Significant voice loss affecting daily activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Breathing difficulty or stridor (rare)', urgency: 'emergency' },
    },
    risk_factors: ['voice overuse', 'recent upper respiratory infection', 'smoking', 'acid reflux'],
    red_flags: ['breathing difficulty'],
    specialist: 'ENT Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_pharyngitis', 'gerd'],
    recommendations: [
      'Rest your voice as much as possible',
      'Drink warm fluids and avoid caffeine/alcohol which dry the throat',
      'Use a humidifier if the air is dry',
      'Avoid whispering — it strains the voice more than normal speech',
      'See an ENT specialist if hoarseness lasts more than 3 weeks',
    ],
  },

  {
    id: 'respiratory_tonsillitis',
    name: 'Tonsillitis',
    category: 'Respiratory - Upper',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'throat pain', weight: 0.8, description: '—' },
        { name: 'swollen tonsils', weight: 0.8, description: 'Red, enlarged, sometimes with white patches' },
      ],
      secondary: [
        { name: 'fever', weight: 0.5, description: '—' },
        { name: 'difficulty swallowing', weight: 0.4, description: '—' },
        { name: 'bad breath', weight: 0.2, description: '—' },
      ],
      differentiating: [
        { name: 'white patches throat', weight: 0.5, description: 'Suggests bacterial cause, needs throat swab' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '5-7 days', chronic: '> 90 days recurrent episodes suggest chronic tonsillitis' },
    severity_levels: {
      mild: { description: 'Mild throat pain without fever', urgency: 'see-doctor-soon' },
      moderate: { description: 'Painful swallowing with fever and visible tonsil swelling', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe difficulty swallowing or breathing, one-sided severe swelling', urgency: 'emergency' },
    },
    risk_factors: ['children and young adults', 'contact with infected person', 'seasonal change'],
    red_flags: ['difficulty breathing or swallowing', 'drooling', 'one-sided severe swelling', 'muffled voice'],
    specialist: 'ENT Specialist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_strep_throat', 'peritonsillar_abscess'],
    recommendations: [
      'See a doctor for a throat swab to check for bacterial infection',
      'Gargle with warm salt water every 2-3 hours',
      'Eat soft, cool foods — curd, ice cream, soup',
      'Take paracetamol for pain and fever',
      'Seek emergency care if swallowing or breathing becomes difficult',
    ],
  },

  {
    id: 'respiratory_allergic_rhinitis',
    name: 'Allergic Rhinitis',
    category: 'Respiratory - Upper',
    aliases: ['hay fever'],
    symptoms: {
      primary: [
        { name: 'sneezing', weight: 0.8, description: 'Bouts of repeated sneezing' },
        { name: 'rhinorrhea', weight: 0.7, description: 'Clear, watery' },
      ],
      secondary: [
        { name: 'eye itching', weight: 0.5, description: '—' },
        { name: 'nasal congestion', weight: 0.5, description: '—' },
      ],
      differentiating: [
        { name: 'seasonal pattern', weight: 0.5, description: 'Recurs with pollen seasons or specific triggers (dust, pets)' },
        { name: 'no fever', weight: 0.4, description: 'Absence of fever distinguishes from infectious causes' },
        // "severe facial pain with fever" moved here (out of red_flags) —
        // suggests urgent sinusitis, not itself an ambulance-level
        // emergency; entry's own max is see-doctor-soon.
        { name: 'severe facial pain with fever', weight: 0.5, description: 'Suggests sinusitis complication' },
      ],
    },
    duration_patterns: { acute: null, typical: 'symptoms while exposed to trigger', chronic: '> 30 days suggests perennial allergic rhinitis' },
    severity_levels: {
      mild: { description: 'Occasional sneezing and mild congestion', urgency: 'self-care' },
      moderate: { description: 'Frequent symptoms affecting daily activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Symptoms triggering asthma or severe sinus complications', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['dust exposure', 'pollen season', 'pet dander exposure', 'family history of allergies'],
    // "wheezing or breathing difficulty" kept — breathing difficulty is a
    // universal danger sign regardless of underlying cause, unlike facial
    // pain (moved to differentiating above).
    red_flags: ['wheezing or breathing difficulty'],
    specialist: 'Allergist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_common_cold', 'respiratory_sinusitis'],
    recommendations: [
      'Take an antihistamine to control symptoms',
      'Use an intranasal corticosteroid spray for longer-term control',
      'Identify and reduce exposure to triggers — dust-mite-proof pillowcases, avoid pets if allergic',
      'Use saline nasal rinses to clear allergens',
      'See an allergist if symptoms are frequent or severe despite treatment',
    ],
  },

  {
    id: 'respiratory_epiglottitis',
    name: 'Epiglottitis',
    category: 'Respiratory - Upper',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'severe throat pain', weight: 0.8, description: 'Out of proportion to visible findings' },
        { name: 'difficulty swallowing', weight: 0.8, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.5, description: 'High' },
        { name: 'muffled voice', weight: 0.6, description: '"Hot potato" voice' },
      ],
      differentiating: [
        { name: 'drooling', weight: 0.7, description: 'Inability to swallow saliva — strongly suggests epiglottitis' },
        { name: 'stridor', weight: 0.8, description: 'High-pitched breathing sound indicating airway narrowing' },
      ],
    },
    duration_patterns: { acute: '< 24 hours onset can be rapid', typical: 'rapid progression over hours', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always an emergency', urgency: 'emergency' },
      moderate: { description: 'Severe throat pain with drooling', urgency: 'emergency' },
      severe: { description: 'Stridor, sitting forward to breathe, difficulty breathing', urgency: 'emergency' },
    },
    risk_factors: ['unvaccinated (Hib)', 'children', 'recent throat infection'],
    red_flags: ['drooling with inability to swallow', 'stridor', 'sitting forward/tripod position to breathe', 'muffled voice with severe throat pain'],
    specialist: 'Emergency Medicine',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_tonsillitis', 'viral_croup'],
    recommendations: [
      'Go to the emergency room immediately — this is a life-threatening airway emergency',
      'Do not lay the person flat or examine the throat with a tongue depressor — can worsen obstruction',
      'Keep the person calm and sitting in the position they find most comfortable for breathing',
      'Hib vaccination has greatly reduced the incidence of this condition',
      'Immediate airway management in hospital is essential',
    ],
  },

  {
    id: 'respiratory_croup',
    name: 'Croup',
    category: 'Respiratory - Upper',
    aliases: ['laryngotracheobronchitis'],
    symptoms: {
      primary: [
        { name: 'barking cough', weight: 0.85, description: 'Seal-like bark, characteristic' },
        { name: 'hoarseness', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.4, description: 'Mild' },
        { name: 'runny nose', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'cough worse at night', weight: 0.5, description: 'Often worsens at night, may improve with cool/humid air' },
        { name: 'stridor', weight: 0.7, description: 'Present with more severe cases' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-7 days', chronic: null },
    severity_levels: {
      mild: { description: 'Barking cough without stridor at rest', urgency: 'self-care' },
      moderate: { description: 'Stridor with activity/crying but not at rest', urgency: 'see-doctor-today' },
      severe: { description: 'Stridor at rest, retractions, or bluish lips', urgency: 'emergency' },
    },
    risk_factors: ['children 6 months - 3 years', 'winter season', 'recent viral upper respiratory infection'],
    red_flags: ['stridor at rest', 'bluish lips or face', 'severe retractions', 'extreme drowsiness'],
    specialist: 'Pediatrician',
    india_prevalence: 'moderate',
    seasonal_pattern: 'winter',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_epiglottitis', 'asthma'],
    recommendations: [
      'Keep the child calm — crying can worsen airway narrowing',
      'Sit with the child in a steamy bathroom or take them into cool night air for relief',
      'Use a cool-mist humidifier at home',
      'Give paracetamol for fever/discomfort',
      'Seek emergency care immediately for stridor at rest or bluish lips',
    ],
  },

  {
    id: 'respiratory_peritonsillar_abscess',
    name: 'Peritonsillar Abscess',
    category: 'Respiratory - Upper',
    aliases: ['quinsy'],
    symptoms: {
      primary: [
        { name: 'severe throat pain', weight: 0.85, description: 'Usually one-sided' },
        { name: 'difficulty swallowing', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.5, description: '—' },
        { name: 'ear pain', weight: 0.3, description: 'Referred pain on affected side' },
      ],
      differentiating: [
        { name: 'muffled voice', weight: 0.7, description: '"Hot potato" voice from swelling' },
        { name: 'trismus', weight: 0.6, description: 'Difficulty opening the mouth fully' },
      ],
    },
    duration_patterns: { acute: '< 7 days onset', typical: 'requires drainage + antibiotics', chronic: null },
    severity_levels: {
      mild: { description: 'This condition typically requires urgent medical drainage — treat as urgent', urgency: 'see-doctor-today' },
      moderate: { description: 'One-sided severe throat pain with trismus', urgency: 'emergency' },
      severe: { description: 'Difficulty breathing or spreading neck swelling', urgency: 'emergency' },
    },
    risk_factors: ['recent or untreated tonsillitis', 'smoking', 'poor dental hygiene'],
    red_flags: ['difficulty breathing', 'spreading neck swelling', 'inability to swallow saliva', 'trismus with high fever'],
    specialist: 'ENT Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_tonsillitis'],
    recommendations: [
      'See an ENT doctor or go to the emergency room promptly — this usually needs drainage',
      'Complete the full prescribed antibiotic course',
      'Do not attempt to drain the abscess yourself',
      'Stay hydrated even though swallowing is painful',
      'Seek emergency care immediately for breathing difficulty or spreading swelling',
    ],
  },
]

export default upper

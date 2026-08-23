// Hand-foot-mouth is defined in infectious/viral.js, croup in
// respiratory/upper.js, and measles/rubella in infectious/viral.js —
// cross-reference from here rather than duplicating.
export const children = [
  {
    id: 'pediatric_febrile_seizure_awareness',
    name: 'Febrile Seizure (Awareness)',
    category: 'Pediatric',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'seizure', weight: 0.9, description: 'Occurring with fever in a young child' },
        { name: 'fever', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'loss of consciousness', weight: 0.4, description: 'Brief, during the seizure' },
      ],
      differentiating: [
        { name: 'child age 6 months to 5 years', weight: 0.6, description: 'Typical age range for febrile seizures' },
      ],
    },
    duration_patterns: { acute: '< 5 minutes typical', typical: 'brief, self-limiting', chronic: null },
    severity_levels: {
      mild: { description: 'Brief seizure under 5 minutes with quick recovery — still needs same-day evaluation', urgency: 'emergency' },
      moderate: { description: 'Seizure with fever, first episode', urgency: 'emergency' },
      severe: { description: 'Seizure lasting more than 5 minutes, or repeated seizures', urgency: 'emergency' },
    },
    risk_factors: ['age 6 months - 5 years', 'family history of febrile seizures', 'rapid fever rise'],
    red_flags: ['seizure lasting more than 5 minutes', 'no full recovery between seizures', 'stiff neck or extreme lethargy after recovery', 'first seizure in a child under 6 months'],
    specialist: 'Pediatrician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['central_epilepsy', 'central_meningitis_viral'],
    recommendations: [
      'Call emergency services or go to the hospital immediately for any first-time seizure',
      'Keep the child safe during the seizure — clear the area, cushion the head, do not restrain',
      'Place the child on their side once jerking stops',
      'Do not put anything in the child\'s mouth during a seizure',
      'Most febrile seizures are brief and do not cause lasting harm, but always need medical evaluation',
    ],
  },

  {
    id: 'kawasaki_disease_warning',
    name: 'Kawasaki Disease — Warning Signs',
    category: 'Pediatric',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'high fever', weight: 0.85, description: 'Persistent, lasting 5+ days' },
        { name: 'rash', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'red eyes', weight: 0.5, description: 'Without discharge' },
        { name: 'red lips', weight: 0.5, description: 'Cracked, "strawberry tongue"' },
        { name: 'lymph node swelling', weight: 0.4, description: 'Neck, usually one-sided' },
      ],
      differentiating: [
        { name: 'fever lasting 5 or more days', weight: 0.7, description: 'Key diagnostic criterion' },
        { name: 'swollen hands and feet', weight: 0.6, description: 'With redness, later peeling' },
      ],
    },
    duration_patterns: { acute: '5-14 days', typical: 'requires prompt treatment within 10 days of fever onset', chronic: null },
    severity_levels: {
      mild: { description: 'This condition requires urgent evaluation even when apparently mild — delayed treatment risks heart complications', urgency: 'emergency' },
      moderate: { description: 'Persistent fever with rash and red eyes', urgency: 'emergency' },
      severe: { description: 'Signs of heart involvement or shock', urgency: 'emergency' },
    },
    risk_factors: ['age under 5', 'male gender', 'certain ethnicities show higher rates'],
    // Duration-scoped — bare "fever" or "rash" in a child are both very
    // common for benign viral illness. The 5-day duration is the actual
    // diagnostic trigger.
    red_flags: [
      'fever for 5 days with rash',
      'fever lasting five days with rash',
      'high fever with red eyes and rash',
      'fever with swollen hands and feet',
    ],
    specialist: 'Pediatrician',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'male',
    similar_diseases: ['viral_measles', 'scarlet_fever'],
    recommendations: [
      'Go to the hospital immediately for any child with fever lasting 5 or more days',
      'Treatment (IVIG) within 10 days of fever onset significantly reduces heart complication risk',
      'An echocardiogram is needed to check for coronary artery involvement',
      'Do not delay evaluation — Kawasaki disease can affect the heart if untreated',
      'Follow-up cardiac monitoring is important even after treatment',
    ],
  },

  {
    id: 'intussusception_warning',
    name: 'Intussusception — Warning Signs',
    category: 'Pediatric',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'severe abdominal pain', weight: 0.9, description: 'Episodic, causing the child to draw up their knees' },
        { name: 'vomiting', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'blood in stool', weight: 0.6, description: '"Currant jelly" appearance' },
        { name: 'lethargy', weight: 0.5, description: 'Between pain episodes' },
      ],
      differentiating: [
        { name: 'episodic pain with pain-free intervals', weight: 0.7, description: 'Cyclical pattern is characteristic' },
        { name: 'infant or young child', weight: 0.5, description: 'Most common under age 2' },
      ],
    },
    duration_patterns: { acute: '< 24 hours onset', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always treat as an emergency', urgency: 'emergency' },
      moderate: { description: 'Episodic severe pain with vomiting', urgency: 'emergency' },
      severe: { description: 'Currant jelly stool or lethargy between episodes', urgency: 'emergency' },
    },
    risk_factors: ['age under 2', 'recent viral gastrointestinal illness', 'male gender'],
    // "Currant jelly stool" is a highly specific, non-generic phrase — safe
    // to use standalone. The others require the child + pain combination.
    red_flags: [
      'currant jelly stool',
      'bloody stool with abdominal pain in a child',
      'episodic abdominal pain with vomiting in a child',
    ],
    specialist: 'Pediatrician',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'male',
    similar_diseases: ['gi_appendicitis'],
    recommendations: [
      'Go to the emergency room immediately — this requires urgent imaging and treatment',
      'An air or contrast enema can often successfully reduce the intussusception without surgery',
      'Do not give the child food or water while awaiting emergency care',
      'Delayed treatment can lead to bowel damage requiring surgery',
      'This is a true pediatric emergency — do not wait to see if the pain resolves',
    ],
  },

  {
    id: 'roseola',
    name: 'Roseola',
    category: 'Pediatric',
    aliases: ['sixth disease'],
    symptoms: {
      primary: [
        { name: 'high fever', weight: 0.8, description: 'Sudden, lasting 3-5 days' },
      ],
      secondary: [
        { name: 'rash', weight: 0.6, description: 'Appears as fever breaks' },
        { name: 'irritability', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'rash appears after fever resolves', weight: 0.7, description: 'Distinctive sequence — rash follows fever, unlike most viral rashes' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '5-7 days total', chronic: null },
    severity_levels: {
      mild: { description: 'Fever without complications', urgency: 'see-doctor-soon' },
      moderate: { description: 'High fever with febrile seizure risk', urgency: 'see-doctor-today' },
      severe: { description: 'Febrile seizure occurring', urgency: 'emergency' },
    },
    risk_factors: ['age 6 months - 2 years', 'daycare exposure'],
    red_flags: ['seizure with fever', 'extreme lethargy', 'difficulty breathing'],
    specialist: 'Pediatrician',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['viral_measles', 'rubella'],
    recommendations: [
      'Give paracetamol for fever as advised by your pediatrician',
      'Keep the child hydrated with fluids',
      'The rash itself needs no treatment and fades within days',
      'Watch for signs of febrile seizure during high fever',
      'See a doctor if fever is very high or a seizure occurs',
    ],
  },

  {
    id: 'scarlet_fever',
    name: 'Scarlet Fever',
    category: 'Pediatric',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'sore throat', weight: 0.7, description: '—' },
        { name: 'rash', weight: 0.7, description: 'Fine, sandpaper-like texture' },
      ],
      secondary: [
        { name: 'fever', weight: 0.5, description: '—' },
        { name: 'red tongue', weight: 0.5, description: '"Strawberry tongue"' },
      ],
      differentiating: [
        { name: 'sandpaper rash texture', weight: 0.7, description: 'Highly characteristic rough texture' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '4-7 days with antibiotics', chronic: null },
    severity_levels: {
      mild: { description: 'Mild sore throat and rash', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant rash with fever', urgency: 'see-doctor-today' },
      severe: { description: 'Difficulty swallowing or breathing', urgency: 'emergency' },
    },
    risk_factors: ['recent streptococcal throat infection', 'children 5-15 years', 'close contact exposure'],
    red_flags: ['difficulty swallowing or breathing', 'high fever not responding to treatment'],
    specialist: 'Pediatrician',
    india_prevalence: 'moderate',
    seasonal_pattern: 'winter',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_strep_throat', 'kawasaki_disease_warning'],
    recommendations: [
      'See a doctor for a throat swab to confirm the strep infection',
      'Complete the full prescribed antibiotic course — important to prevent complications',
      'Keep the child isolated from others until 24 hours after starting antibiotics',
      'Give paracetamol for fever and throat pain',
      'See a doctor promptly if breathing or swallowing becomes difficult',
    ],
  },
]

export default children

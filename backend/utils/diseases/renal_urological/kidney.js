export const kidney = [
  {
    id: 'kidney_stones',
    name: 'Kidney Stones',
    category: 'Renal/Urological - Kidney',
    aliases: ['renal calculi'],
    symptoms: {
      primary: [
        { name: 'flank pain', weight: 0.9, description: 'Severe, wave-like (renal colic), radiating to groin' },
      ],
      secondary: [
        { name: 'blood in urine', weight: 0.4, description: '—' },
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'frequent urination', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain radiating to groin', weight: 0.6, description: 'Characteristic radiation pattern of renal colic' },
      ],
    },
    duration_patterns: { acute: '< 24 hours per episode', typical: 'hours to days until stone passes', chronic: null },
    severity_levels: {
      mild: { description: 'Mild flank discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant colicky pain', urgency: 'see-doctor-today' },
      severe: { description: 'Fever with flank pain (infected obstructed kidney) or complete inability to urinate', urgency: 'emergency' },
    },
    risk_factors: ['dehydration', 'high salt/protein diet', 'family history', 'hot climate'],
    red_flags: ['fever with flank pain', 'persistent vomiting preventing fluid intake', 'complete inability to urinate', 'severe pain preventing sitting still'],
    specialist: 'Urologist',
    india_prevalence: 'high',
    seasonal_pattern: 'summer',
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_uti', 'gi_appendicitis', 'musculoskeletal_back_pain'],
    recommendations: [
      'Go to hospital for ultrasound or CT scan to locate the stone',
      'Drink at least 3-4 litres of water daily to help pass small stones',
      'Take prescribed pain relief for renal colic',
      'Strain your urine to catch any passed stone for analysis',
      'Go to emergency care if fever develops alongside flank pain — indicates an infected obstructed kidney',
    ],
  },

  {
    id: 'pyelonephritis',
    name: 'Pyelonephritis (Kidney Infection)',
    category: 'Renal/Urological - Kidney',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'flank pain', weight: 0.8, description: 'One-sided, back' },
        { name: 'fever', weight: 0.75, description: 'High, with chills' },
      ],
      secondary: [
        { name: 'burning urination', weight: 0.5, description: 'Often preceded by UTI symptoms' },
        { name: 'nausea', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'fever with flank pain', weight: 0.7, description: 'Combination distinguishes from simple UTI' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '1-2 weeks with antibiotics', chronic: null },
    severity_levels: {
      mild: { description: 'This condition typically requires prompt treatment even when apparently mild', urgency: 'see-doctor-today' },
      moderate: { description: 'Fever with flank pain', urgency: 'emergency' },
      severe: { description: 'Signs of sepsis or persistent vomiting', urgency: 'emergency' },
    },
    risk_factors: ['untreated UTI', 'female gender', 'pregnancy', 'urinary tract abnormalities', 'diabetes'],
    red_flags: [
      // Sepsis warning-sign combo (confusion + tachycardia) — kept as a
      // compound phrase deliberately, since either symptom alone is too
      // common/benign to be a meaningful independent danger marker. The
      // clinical noun-phrase form doesn't match how a person would
      // actually describe it, so both forms are kept.
      'confusion with rapid heart rate', 'confused and my heart is racing',
      'persistent vomiting preventing oral antibiotics', 'pregnancy with symptoms',
    ],
    specialist: 'Urologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['bacterial_uti', 'kidney_stones'],
    recommendations: [
      'See a doctor urgently — urine culture and blood tests are needed',
      'Complete the full prescribed antibiotic course',
      'Stay well hydrated',
      'Go to hospital if vomiting prevents taking oral antibiotics',
      'Pregnant women with these symptoms should be seen urgently',
    ],
  },

  {
    id: 'ckd',
    name: 'Chronic Kidney Disease (CKD)',
    category: 'Renal/Urological - Kidney',
    aliases: ['chronic kidney failure'],
    symptoms: {
      primary: [
        { name: 'leg swelling', weight: 0.5, description: '—' },
        { name: 'fatigue', weight: 0.5, description: 'Due to anemia' },
      ],
      secondary: [
        { name: 'foamy urine', weight: 0.4, description: 'Suggests protein in urine' },
        { name: 'nausea', weight: 0.3, description: '—' },
        { name: 'itching', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'diabetes or hypertension history', weight: 0.5, description: 'Leading causes of CKD in India' },
      ],
    },
    duration_patterns: { acute: null, typical: 'often silent until advanced, over years', chronic: '> 90 days confirmed reduced kidney function is diagnostic' },
    severity_levels: {
      mild: { description: 'Mildly reduced kidney function on blood tests, asymptomatic', urgency: 'see-doctor-soon' },
      moderate: { description: 'Symptomatic with swelling and fatigue', urgency: 'see-doctor-today' },
      severe: { description: 'No urine output, severe breathlessness, or confusion', urgency: 'emergency' },
    },
    risk_factors: ['diabetes', 'hypertension', 'family history', 'recurrent kidney stones/infections'],
    red_flags: ['no urine output for more than 12 hours', 'severe breathlessness due to fluid overload', 'confusion'],
    specialist: 'Nephrologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['nephrotic_syndrome', 'heart_failure'],
    recommendations: [
      'See a nephrologist — blood tests (creatinine, eGFR), urine tests, and ultrasound are needed',
      'Strict blood pressure control is the most important intervention to slow progression',
      'Strict blood sugar control in diabetics prevents further kidney damage',
      'Avoid NSAIDs completely — they are harmful to the kidneys in CKD',
      'Go to emergency care if urine output stops, breathing is labored, or you are confused',
    ],
  },

  {
    id: 'nephrotic_syndrome',
    name: 'Nephrotic Syndrome',
    category: 'Renal/Urological - Kidney',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'facial swelling', weight: 0.8, description: 'Puffy face, worse in the morning' },
        { name: 'foamy urine', weight: 0.7, description: 'Heavy protein loss' },
      ],
      secondary: [
        { name: 'leg swelling', weight: 0.5, description: '—' },
        { name: 'weight gain', weight: 0.3, description: 'Due to fluid retention' },
      ],
      differentiating: [
        { name: 'generalized swelling', weight: 0.5, description: 'Both face and legs, unlike localized causes' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset', typical: 'weeks, requires specialist management', chronic: null },
    severity_levels: {
      mild: { description: 'This condition requires prompt evaluation even when apparently mild', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant facial and leg swelling', urgency: 'see-doctor-today' },
      severe: { description: 'Severe breathlessness or sudden abdominal pain (complications)', urgency: 'emergency' },
    },
    risk_factors: ['children (common age group)', 'diabetes', 'autoimmune conditions'],
    red_flags: ['severe breathlessness', 'sudden severe abdominal pain', 'confusion', 'leg swelling with chest pain'],
    specialist: 'Nephrologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['ckd', 'heart_failure', 'liver_cirrhosis'],
    recommendations: [
      'See a nephrologist urgently — urine protein tests, blood albumin, and kidney function tests are essential',
      'A kidney biopsy is often needed to determine the underlying cause',
      'Follow strict salt restriction to reduce fluid retention',
      'Take prescribed diuretics as directed to reduce swelling',
      'Seek emergency care for breathlessness, sudden abdominal pain, or confusion',
    ],
  },

  {
    id: 'aki_warning',
    name: 'Acute Kidney Injury — Warning Signs',
    category: 'Renal/Urological - Kidney',
    aliases: ['aki', 'acute kidney failure'],
    symptoms: {
      primary: [
        { name: 'reduced urine output', weight: 0.85, description: 'Sudden decrease or absence' },
        { name: 'leg swelling', weight: 0.5, description: 'Rapid onset' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'confusion', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'recent illness or dehydration', weight: 0.5, description: 'Often precipitated by severe illness, dehydration, or medication' },
      ],
    },
    duration_patterns: { acute: '< 7 days onset', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form once suspected — always treat as an emergency', urgency: 'emergency' },
      moderate: { description: 'Reduced urine output with swelling', urgency: 'emergency' },
      severe: { description: 'No urine output, confusion, or breathlessness', urgency: 'emergency' },
    },
    risk_factors: ['severe dehydration', 'recent major illness/surgery', 'certain medications (NSAIDs)', 'sepsis'],
    red_flags: [
      'no urine output',
      'sudden reduced urine output',
      'not urinating for hours',
      'stopped urinating',
    ],
    specialist: 'Nephrologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['ckd', 'bacterial_leptospirosis'],
    recommendations: [
      'Go to the hospital immediately for sudden significant reduction in urine output',
      'Blood tests for kidney function are needed urgently',
      'Stop any nephrotoxic medications (like NSAIDs) immediately',
      'The underlying cause (dehydration, infection, obstruction) needs urgent identification and treatment',
      'Dialysis may be needed temporarily in severe cases — full recovery is possible with prompt treatment',
    ],
  },

  {
    id: 'glomerulonephritis',
    name: 'Glomerulonephritis',
    category: 'Renal/Urological - Kidney',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'blood in urine', weight: 0.8, description: 'Cola-colored or visibly bloody' },
        { name: 'leg swelling', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'high blood pressure', weight: 0.4, description: 'New or worsening' },
        { name: 'reduced urine output', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'recent throat or skin infection', weight: 0.5, description: 'Post-streptococcal glomerulonephritis often follows infection by 1-3 weeks' },
      ],
    },
    duration_patterns: { acute: '< 14 days onset', typical: 'weeks, requires specialist management', chronic: '> 90 days suggests chronic glomerulonephritis' },
    severity_levels: {
      mild: { description: 'Mild blood in urine without other symptoms', urgency: 'see-doctor-today' },
      moderate: { description: 'Blood in urine with swelling and high blood pressure', urgency: 'see-doctor-today' },
      severe: { description: 'Severely reduced urine output or breathlessness', urgency: 'emergency' },
    },
    risk_factors: ['recent streptococcal throat/skin infection', 'autoimmune conditions'],
    red_flags: ['severely reduced urine output', 'severe breathlessness', 'very high blood pressure'],
    specialist: 'Nephrologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['nephrotic_syndrome', 'ckd'],
    recommendations: [
      'See a nephrologist urgently for urine tests, blood tests, and possible kidney biopsy',
      'Treat any underlying infection with appropriate antibiotics',
      'Follow salt restriction and monitor blood pressure closely',
      'Most post-infectious cases in children recover well with treatment',
      'Seek emergency care for severely reduced urine output or breathlessness',
    ],
  },
]

export default kidney

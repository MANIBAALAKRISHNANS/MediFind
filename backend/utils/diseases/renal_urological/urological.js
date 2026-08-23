// UTI is defined in infectious/bacterial.js (bacterial_uti) — cross-reference
// from here rather than duplicating.
export const urological = [
  {
    id: 'bph',
    name: 'Benign Prostatic Hyperplasia (BPH)',
    category: 'Renal/Urological - Urological',
    aliases: ['enlarged prostate'],
    symptoms: {
      primary: [
        { name: 'poor urine stream', weight: 0.8, description: 'Weak flow' },
        { name: 'frequent urination at night', weight: 0.7, description: 'Nocturia' },
      ],
      secondary: [
        { name: 'urgency', weight: 0.4, description: '—' },
        { name: 'incomplete emptying', weight: 0.5, description: 'Sensation of residual urine' },
      ],
      differentiating: [
        { name: 'elderly male', weight: 0.5, description: 'Very common in men over 50' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over years', chronic: '> 90 days of symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild stream weakness', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant nocturia and incomplete emptying', urgency: 'see-doctor-soon' },
      severe: { description: 'Complete inability to urinate (acute urinary retention)', urgency: 'emergency' },
    },
    risk_factors: ['age over 50', 'male gender'],
    red_flags: ['complete inability to urinate', 'blood in urine', 'severe lower abdominal pain with inability to void'],
    specialist: 'Urologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'male',
    similar_diseases: ['bacterial_uti', 'urological_urethral_stricture'],
    recommendations: [
      'See a urologist for a digital rectal exam, PSA test, and uroflowmetry',
      'Prescribed alpha-blockers can improve urine flow within days',
      'Reduce fluid intake in the evening; avoid caffeine and alcohol',
      'Avoid decongestants and antihistamines — they can worsen urinary obstruction',
      'Go to emergency care immediately if you cannot pass urine at all',
    ],
  },

  {
    id: 'urethritis',
    name: 'Urethritis',
    category: 'Renal/Urological - Urological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'burning urination', weight: 0.8, description: '—' },
      ],
      secondary: [
        { name: 'urethral discharge', weight: 0.5, description: '—' },
        { name: 'frequent urination', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'recent sexual contact', weight: 0.5, description: 'Common cause is a sexually transmitted infection' },
        // Moved out of red_flags: bare "testicular pain" is too broad
        // (ordinary epididymitis-type discomfort is common and not
        // torsion), and this entry's own worst tier is see-doctor-today —
        // it never reaches emergency. The genuinely dangerous, specific
        // version ("sudden severe testicular pain") already has its own
        // dedicated red-flag entries reachable regardless of which
        // condition the rest of the input suggests.
        { name: 'testicular pain', weight: 0.4, description: 'Warrants same-day evaluation to rule out epididymitis/torsion' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-7 days with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Mild burning without discharge', urgency: 'see-doctor-soon' },
      moderate: { description: 'Burning with visible discharge', urgency: 'see-doctor-soon' },
      severe: { description: 'Fever with severe pain or spreading pelvic pain', urgency: 'see-doctor-today' },
    },
    risk_factors: ['unprotected sexual contact', 'multiple sexual partners'],
    red_flags: ['fever with severe pelvic pain'],
    specialist: 'Urologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['bacterial_uti'],
    recommendations: [
      'See a doctor for testing and appropriate antibiotic treatment',
      'Avoid sexual contact until treatment is complete',
      'Partners should also be tested and treated to prevent reinfection',
      'Drink plenty of water',
      'See a doctor promptly for fever or testicular pain',
    ],
  },

  {
    id: 'interstitial_cystitis',
    name: 'Interstitial Cystitis',
    category: 'Renal/Urological - Urological',
    aliases: ['painful bladder syndrome'],
    symptoms: {
      primary: [
        { name: 'lower abdomen pain', weight: 0.7, description: 'Bladder pain, relieved by urination' },
        { name: 'frequent urination', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'urgency', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'no infection on testing', weight: 0.5, description: 'Symptoms persist despite negative urine cultures' },
        // Moved out of red_flags: this entry never reaches emergency
        // (max see-doctor-soon) — blood in urine warrants a prompt workup,
        // not an ambulance.
        { name: 'blood in urine', weight: 0.4, description: 'Needs evaluation to exclude other causes' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, recurrent', chronic: '> 42 days is the diagnostic criterion' },
    severity_levels: {
      mild: { description: 'Mild bladder discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant pain affecting quality of life', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe pain unresponsive to initial treatment', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['female gender', 'other chronic pain conditions', 'certain autoimmune conditions'],
    red_flags: [],
    specialist: 'Urologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'female',
    similar_diseases: ['bacterial_uti', 'endometriosis'],
    recommendations: [
      'See a urologist — this diagnosis is made after excluding infection and other causes',
      'Keep a food/symptom diary to identify bladder irritants (caffeine, spicy food, citrus)',
      'Bladder training techniques may help reduce frequency',
      'Prescribed medications can help manage pain and urgency',
      'See a doctor if blood in urine occurs — needs evaluation to exclude other causes',
    ],
  },

  {
    id: 'testicular_torsion_warning',
    name: 'Testicular Torsion — Warning Signs',
    category: 'Renal/Urological - Urological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'sudden testicular pain', weight: 1.0, description: 'Severe, one-sided, sudden onset' },
        { name: 'sudden testicle pain', weight: 1.0, description: 'Colloquial phrasing — a patient is more likely to say "testicle" than "testicular"' },
        { name: 'testicular pain and swelling', weight: 0.9, description: 'Combined presentation' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: '—' },
        { name: 'vomiting', weight: 0.4, description: '—' },
        { name: 'testicular swelling', weight: 0.6, description: '—' },
      ],
      differentiating: [
        { name: 'sudden onset', weight: 0.8, description: 'Abrupt, severe pain distinguishes from gradual epididymitis' },
      ],
    },
    duration_patterns: { acute: 'sudden onset, minutes', typical: 'this is always a surgical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — any sudden testicular pain is an emergency', urgency: 'emergency' },
      moderate: { description: 'Sudden testicular pain with swelling', urgency: 'emergency' },
      severe: { description: 'Severe pain with nausea/vomiting', urgency: 'emergency' },
    },
    risk_factors: ['adolescent and young males', 'undescended testicle history', 'previous episode'],
    // Bare "sudden testicular/testicle pain" IS kept as a standalone trigger
    // here — unlike most other entries in this pass, real urology guidance
    // is to treat ANY sudden testicular pain as torsion until proven
    // otherwise, since the window to save the testicle is only hours.
    // Over-triggering here is the medically correct default, not a bug.
    red_flags: [
      'sudden testicular pain',
      'sudden testicle pain',
      'sudden severe testicular pain',
      'sudden severe testicle pain',
      'severe testicular pain with swelling',
    ],
    specialist: 'Emergency Medicine',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'children',
    gender_relevance: 'male',
    similar_diseases: ['urological_epididymitis'],
    recommendations: [
      'Go to the emergency room IMMEDIATELY — this is a surgical emergency',
      'Surgery within 6 hours of onset gives the best chance of saving the testicle',
      'Do not wait to see if the pain improves — every hour of delay reduces the chance of saving the testicle',
      'This is one of the few true urological emergencies — treat any sudden testicular pain this way',
      'Call 108/112 or go directly to the nearest emergency room',
    ],
  },

  {
    id: 'urological_epididymitis',
    name: 'Epididymitis',
    category: 'Renal/Urological - Urological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'testicular pain', weight: 0.8, description: 'Gradual onset, one-sided' },
        { name: 'testicular swelling', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'fever', weight: 0.4, description: '—' },
        { name: 'burning urination', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'gradual onset', weight: 0.5, description: 'Develops over hours to days, unlike the sudden onset of torsion' },
      ],
    },
    duration_patterns: { acute: '< 7 days onset', typical: '1-2 weeks with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Mild discomfort with gradual onset', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant pain and swelling with fever', urgency: 'see-doctor-today' },
      severe: { description: 'Cannot distinguish from torsion — treat as emergency if any doubt', urgency: 'emergency' },
    },
    risk_factors: ['unprotected sexual contact', 'recent UTI', 'BPH'],
    red_flags: ['sudden severe pain', 'high fever with severe swelling'],
    specialist: 'Urologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'male',
    similar_diseases: ['testicular_torsion_warning'],
    recommendations: [
      'See a doctor promptly — any testicular pain needs urgent evaluation to exclude torsion',
      'Complete the prescribed antibiotic course if a bacterial cause is identified',
      'Rest and use scrotal support/elevation for comfort',
      'Apply ice packs for pain relief',
      'Go to the emergency room immediately if pain is sudden and severe — torsion cannot be safely excluded without examination',
    ],
  },
]

export default urological

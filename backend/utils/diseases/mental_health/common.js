// IMPORTANT: These entries screen for common indicators only — they never
// output a diagnosis. Every recommendations list leads with directing the
// user to a qualified mental health professional, per the schema's intent
// for this category.
export const common = [
  {
    id: 'depression_screening',
    name: 'Depression — Screening Indicators',
    category: 'Mental Health',
    aliases: ['depression', 'major depressive disorder'],
    symptoms: {
      primary: [
        { name: 'depressed mood', weight: 0.85, description: 'Persistent sadness most of the day' },
        { name: 'loss of interest', weight: 0.8, description: 'In previously enjoyed activities (anhedonia)' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.5, description: '—' },
        { name: 'insomnia', weight: 0.4, description: 'Or sleeping too much' },
        { name: 'poor concentration', weight: 0.4, description: '—' },
        { name: 'unexplained weight loss', weight: 0.3, description: 'Or weight gain' },
      ],
      differentiating: [
        { name: 'symptoms most days for 2 weeks', weight: 0.6, description: 'Duration criterion distinguishes from normal sadness' },
      ],
    },
    duration_patterns: { acute: null, typical: 'present most days for at least 2 weeks', chronic: '> 14 days is the screening threshold' },
    severity_levels: {
      mild: { description: 'Some symptoms present, manageable daily function', urgency: 'see-doctor-soon' },
      moderate: { description: 'Multiple symptoms affecting daily function', urgency: 'see-doctor-soon' },
      severe: { description: 'Any thoughts of self-harm or suicide, or inability to care for basic needs', urgency: 'emergency' },
    },
    risk_factors: ['family history', 'major life stress', 'chronic illness', 'social isolation', 'previous depressive episode'],
    red_flags: ['any thoughts of suicide or self-harm', 'inability to eat, drink, or care for basic needs', 'complete social withdrawal', 'hallucinations or delusions'],
    specialist: 'Psychiatrist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['hypothyroidism', 'anemia_iron_deficiency', 'anxiety_gad'],
    recommendations: [
      'We recommend speaking with a mental health professional — this screening is not a diagnosis',
      'Call iCall (9152987821) or Vandrevala Foundation (1860-2662-345) if you have thoughts of self-harm',
      'Maintain regular sleep and wake times, even on difficult days',
      'Daily exercise, even a short walk, meaningfully improves mood over time',
      'Stay connected with supportive family or friends rather than withdrawing',
    ],
  },

  {
    id: 'anxiety_gad',
    name: 'Generalized Anxiety Disorder — Screening Indicators',
    category: 'Mental Health',
    aliases: ['gad', 'anxiety'],
    symptoms: {
      primary: [
        { name: 'excessive worry', weight: 0.85, description: 'Persistent, difficult to control' },
        { name: 'restlessness', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'muscle tension', weight: 0.4, description: '—' },
        { name: 'insomnia', weight: 0.4, description: '—' },
        { name: 'poor concentration', weight: 0.4, description: '—' },
        { name: 'fatigue', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'worry most days for 6 months', weight: 0.5, description: 'Duration criterion for generalized anxiety' },
      ],
    },
    duration_patterns: { acute: null, typical: 'present most days for at least 6 months', chronic: '> 180 days is the screening threshold' },
    severity_levels: {
      mild: { description: 'Manageable worry, mild impact on function', urgency: 'see-doctor-soon' },
      moderate: { description: 'Worry significantly affecting daily activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Panic attacks multiple times daily, or complete inability to function', urgency: 'see-doctor-today' },
    },
    risk_factors: ['family history', 'chronic stress', 'trauma history', 'other anxiety disorders'],
    red_flags: ['thoughts of self-harm or suicide', 'panic attacks multiple times daily', 'complete inability to function at work/school'],
    specialist: 'Psychiatrist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['hyperthyroidism', 'anxiety_panic_disorder', 'heart_arrhythmia_afib'],
    recommendations: [
      'We recommend speaking with a mental health professional — this screening is not a diagnosis',
      'Cognitive behavioral therapy is a highly effective, evidence-based treatment for anxiety',
      'Practice diaphragmatic breathing during episodes of acute worry',
      'Limit caffeine and alcohol — both can worsen anxiety symptoms',
      'Call iCall (9152987821) if anxiety feels overwhelming or unmanageable',
    ],
  },

  {
    id: 'anxiety_panic_disorder',
    name: 'Panic Disorder — Screening Indicators',
    category: 'Mental Health',
    aliases: ['panic attacks'],
    symptoms: {
      primary: [
        { name: 'panic attack', weight: 0.9, description: 'Sudden intense fear, peaks within minutes' },
        { name: 'palpitations', weight: 0.6, description: 'During episodes' },
      ],
      secondary: [
        { name: 'chest tightness', weight: 0.4, description: 'During episodes' },
        { name: 'dizziness', weight: 0.4, description: 'During episodes' },
        { name: 'excessive sweating', weight: 0.3, description: 'During episodes' },
      ],
      differentiating: [
        { name: 'fear of future attacks', weight: 0.5, description: 'Anticipatory anxiety between episodes' },
      ],
    },
    duration_patterns: { acute: '10-30 minutes per episode', typical: 'recurrent episodes', chronic: '> 30 days of recurrent episodes typical' },
    severity_levels: {
      mild: { description: 'Occasional mild panic episodes', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent episodes affecting daily life', urgency: 'see-doctor-soon' },
      severe: { description: 'Episodes with chest pain requiring evaluation to exclude cardiac cause, or thoughts of self-harm', urgency: 'see-doctor-today' },
    },
    risk_factors: ['family history', 'major life stress', 'other anxiety disorders'],
    // Both kept as emergency triggers despite this entry's own max being
    // see-doctor-today: active self-harm/suicidal thoughts are always an
    // independent emergency, and first-episode chest pain during panic
    // can't be safely assumed non-cardiac without evaluation.
    red_flags: ['thoughts of self-harm or suicide', 'first episode with chest pain'],
    specialist: 'Psychiatrist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['heart_svt', 'hyperthyroidism', 'anxiety_gad'],
    recommendations: [
      'We recommend speaking with a mental health professional — this screening is not a diagnosis',
      'A first-ever episode with chest pain should be evaluated to exclude a cardiac cause',
      'Cognitive behavioral therapy is highly effective for panic disorder',
      'Learn grounding techniques to use during an acute panic episode',
      'Call iCall (9152987821) if you have thoughts of self-harm',
    ],
  },

  {
    id: 'insomnia',
    name: 'Insomnia',
    category: 'Mental Health',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'insomnia', weight: 0.9, description: 'Difficulty falling or staying asleep' },
      ],
      secondary: [
        { name: 'fatigue', weight: 0.4, description: 'Daytime' },
        { name: 'poor concentration', weight: 0.3, description: '—' },
        { name: 'irritability', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'difficulty despite adequate opportunity to sleep', weight: 0.5, description: 'Not simply due to insufficient time in bed' },
        // Sleep apnea needs a sleep study, not an ambulance — moved out of
        // red_flags (unlike self-harm thoughts below, which stays).
        { name: 'loud snoring with witnessed breathing pauses', weight: 0.4, description: 'Suggests possible sleep apnea' },
      ],
    },
    duration_patterns: { acute: '< 21 days', typical: 'weeks', chronic: '> 90 days suggests chronic insomnia' },
    severity_levels: {
      mild: { description: 'Occasional difficulty sleeping', urgency: 'self-care' },
      moderate: { description: 'Frequent difficulty affecting daytime function', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe sleep disruption causing significant impairment, or with suicidal thoughts', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['stress', 'anxiety or depression', 'irregular sleep schedule', 'caffeine/screen use before bed'],
    // Kept as an emergency trigger despite this entry's own max being
    // see-doctor-soon — active self-harm/suicidal thoughts are always an
    // independent emergency.
    red_flags: ['thoughts of self-harm alongside insomnia'],
    specialist: 'Psychiatrist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['anxiety_gad', 'depression_screening', 'respiratory_sleep_apnea'],
    recommendations: [
      'Maintain a consistent sleep schedule — same bedtime and wake time every day',
      'Avoid screens for at least 1 hour before bedtime',
      'Create a cool, dark, quiet sleeping environment',
      'Avoid caffeine after 2 PM and alcohol before bed',
      'See a doctor if insomnia lasts more than 3 weeks and significantly affects daily function',
    ],
  },

  {
    id: 'ocd_awareness',
    name: 'OCD — Awareness',
    category: 'Mental Health',
    aliases: ['obsessive compulsive disorder'],
    symptoms: {
      primary: [
        { name: 'intrusive thoughts', weight: 0.8, description: 'Unwanted, repetitive, distressing' },
        { name: 'compulsive behaviors', weight: 0.8, description: 'Repeated actions to reduce distress' },
      ],
      secondary: [
        { name: 'anxiety', weight: 0.4, description: 'When unable to perform compulsions' },
      ],
      differentiating: [
        { name: 'time-consuming rituals', weight: 0.5, description: 'Behaviors taking more than 1 hour per day' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, present most days', chronic: '> 30 days of symptoms typical before recognition' },
    severity_levels: {
      mild: { description: 'Occasional intrusive thoughts, minimal impact', urgency: 'see-doctor-soon' },
      moderate: { description: 'Compulsions taking significant daily time', urgency: 'see-doctor-soon' },
      severe: { description: 'Compulsions severely impairing daily function, or with thoughts of self-harm', urgency: 'see-doctor-today' },
    },
    risk_factors: ['family history', 'major life stress', 'other anxiety disorders'],
    red_flags: ['thoughts of self-harm or suicide', 'complete inability to function due to compulsions'],
    specialist: 'Psychiatrist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['anxiety_gad'],
    recommendations: [
      'We recommend speaking with a mental health professional — this screening is not a diagnosis',
      'Exposure and response prevention therapy is highly effective for OCD',
      'This is informational only, not a diagnostic tool',
      'Support groups can help reduce feelings of isolation',
      'Call iCall (9152987821) if you have thoughts of self-harm',
    ],
  },

  {
    id: 'ptsd_awareness',
    name: 'PTSD — Awareness',
    category: 'Mental Health',
    aliases: ['post traumatic stress disorder'],
    symptoms: {
      primary: [
        { name: 'flashbacks', weight: 0.8, description: 'Re-experiencing a traumatic event' },
        { name: 'avoidance behavior', weight: 0.6, description: 'Of reminders of the trauma' },
      ],
      secondary: [
        { name: 'insomnia', weight: 0.4, description: '—' },
        { name: 'irritability', weight: 0.4, description: '—' },
        { name: 'hypervigilance', weight: 0.5, description: 'Constantly on edge' },
      ],
      differentiating: [
        { name: 'history of a traumatic event', weight: 0.6, description: 'Symptoms follow exposure to trauma' },
      ],
    },
    duration_patterns: { acute: '< 30 days is acute stress reaction', typical: 'symptoms persisting beyond a month', chronic: '> 90 days suggests chronic PTSD' },
    severity_levels: {
      mild: { description: 'Occasional intrusive memories, manageable', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent flashbacks and avoidance affecting daily life', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe symptoms with thoughts of self-harm', urgency: 'see-doctor-today' },
    },
    risk_factors: ['history of trauma, abuse, accident, or disaster', 'lack of social support', 'previous mental health conditions'],
    red_flags: ['thoughts of self-harm or suicide', 'severe dissociation'],
    specialist: 'Psychiatrist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['anxiety_gad', 'depression_screening'],
    recommendations: [
      'We recommend speaking with a mental health professional — this screening is not a diagnosis',
      'Trauma-focused therapy (like EMDR or trauma-focused CBT) is highly effective',
      'Build a support network of trusted people',
      'Grounding techniques can help manage flashbacks in the moment',
      'Call iCall (9152987821) if you have thoughts of self-harm',
    ],
  },
]

export default common

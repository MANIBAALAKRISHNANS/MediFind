// Sinusitis and peritonsillar abscess are defined in respiratory/upper.js —
// cross-reference from here rather than duplicating.
export const ear_nose_throat = [
  {
    id: 'ent_otitis_media',
    name: 'Otitis Media (Middle Ear Infection)',
    category: 'ENT',
    aliases: ['ear infection'],
    symptoms: {
      primary: [
        { name: 'earache', weight: 0.85, description: 'Throbbing, often severe' },
        { name: 'fever', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'hearing loss', weight: 0.4, description: 'Muffled hearing' },
        { name: 'ear discharge', weight: 0.3, description: 'If eardrum perforates' },
      ],
      differentiating: [
        { name: 'recent cold', weight: 0.4, description: 'Often follows an upper respiratory infection' },
        { name: 'tugging at ear', weight: 0.5, description: 'In young children who cannot verbalize pain' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '5-7 days with treatment', chronic: '> 90 days recurrent episodes suggest chronic otitis media' },
    severity_levels: {
      mild: { description: 'Mild ear discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant pain with fever', urgency: 'see-doctor-soon' },
      severe: { description: 'Swelling behind the ear or facial weakness (mastoiditis)', urgency: 'emergency' },
    },
    risk_factors: ['young children', 'recent upper respiratory infection', 'daycare exposure', 'bottle feeding lying down'],
    red_flags: ['swelling and redness behind the ear', 'facial weakness', 'complete hearing loss after infection', 'ear discharge with high fever'],
    specialist: 'ENT Specialist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'children',
    gender_relevance: 'all',
    similar_diseases: ['ent_otitis_externa', 'neurological_trigeminal_neuralgia'],
    recommendations: [
      'See an ENT doctor — otoscopy confirms the diagnosis',
      'Take prescribed antibiotics if a bacterial cause is confirmed',
      'Take paracetamol or ibuprofen for pain and fever relief',
      'Follow up after treatment to confirm resolution and check hearing',
      'Seek emergency care for swelling behind the ear or facial weakness',
    ],
  },

  {
    id: 'ent_otitis_externa',
    name: "Otitis Externa (Swimmer's Ear)",
    category: 'ENT',
    aliases: ['swimmers ear'],
    symptoms: {
      primary: [
        { name: 'ear pain', weight: 0.8, description: 'Worse with pulling the ear' },
        { name: 'ear itching', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'ear discharge', weight: 0.4, description: '—' },
        { name: 'ear congestion', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'pain with pulling the outer ear', weight: 0.6, description: 'Distinguishes from middle ear infection' },
        { name: 'recent water exposure', weight: 0.5, description: 'Swimming or bathing' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '5-10 days with treatment', chronic: null },
    severity_levels: {
      mild: { description: 'Mild itching and discomfort', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant pain and swelling', urgency: 'see-doctor-soon' },
      severe: { description: 'Spreading facial swelling or fever (severe infection, especially in diabetics)', urgency: 'see-doctor-today' },
    },
    risk_factors: ['frequent swimming', 'ear canal trauma (cotton swabs)', 'diabetes', 'humid climate'],
    red_flags: ['spreading facial swelling', 'fever with severe ear pain', 'diabetic with severe ear infection'],
    specialist: 'ENT Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['ent_otitis_media'],
    recommendations: [
      'Keep the ear dry — avoid swimming until healed',
      'Use prescribed antibiotic ear drops as directed',
      'Avoid inserting cotton swabs or objects into the ear canal',
      'Take pain relief medication as needed',
      'See a doctor promptly if diabetic with a severe ear infection',
    ],
  },

  {
    id: 'ent_bppv',
    name: 'Benign Paroxysmal Positional Vertigo (BPPV)',
    category: 'ENT',
    aliases: ['bppv'],
    symptoms: {
      primary: [
        { name: 'vertigo', weight: 0.9, description: 'Brief, intense spinning triggered by head movement' },
      ],
      secondary: [
        { name: 'nausea', weight: 0.4, description: 'During episodes' },
      ],
      differentiating: [
        { name: 'triggered by head position change', weight: 0.7, description: 'Rolling over in bed or looking up triggers episodes' },
        { name: 'brief episodes', weight: 0.6, description: 'Lasts seconds to about a minute' },
      ],
    },
    duration_patterns: { acute: '< 60 seconds per episode', typical: 'recurrent over days to weeks', chronic: '> 30 days if untreated' },
    severity_levels: {
      mild: { description: 'Occasional brief episodes', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent episodes affecting daily activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Vertigo with severe headache, double vision, or difficulty walking — possible central cause', urgency: 'emergency' },
    },
    risk_factors: ['age over 50', 'head injury history', 'prolonged bed rest'],
    red_flags: ['vertigo with severe headache', 'double vision', 'difficulty walking', 'hearing loss with vertigo'],
    specialist: 'ENT Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['ent_menieres', 'neurological_vertigo_central'],
    recommendations: [
      'See an ENT specialist for the Dix-Hallpike test to confirm the diagnosis',
      'The Epley repositioning maneuver resolves BPPV in most cases within 1-3 sessions',
      'Perform Brandt-Daroff exercises at home as instructed',
      'Avoid sudden head movements that trigger episodes until treated',
      'Seek emergency care for vertigo with severe headache, double vision, or difficulty walking',
    ],
  },

  {
    id: 'ent_menieres',
    name: "Meniere's Disease",
    category: 'ENT',
    aliases: ['menieres disease'],
    symptoms: {
      primary: [
        { name: 'vertigo', weight: 0.85, description: 'Episodes lasting 20 minutes to hours' },
        { name: 'hearing loss', weight: 0.6, description: 'Fluctuating, one-sided' },
      ],
      secondary: [
        { name: 'tinnitus', weight: 0.6, description: 'Ringing in the affected ear' },
        { name: 'ear congestion', weight: 0.4, description: 'Fullness sensation' },
      ],
      differentiating: [
        { name: 'triad of vertigo hearing loss and tinnitus', weight: 0.7, description: 'Classic combination distinguishes from BPPV' },
      ],
    },
    duration_patterns: { acute: '20 minutes - 24 hours per episode', typical: 'recurrent episodes over years', chronic: '> 365 days typical disease course' },
    severity_levels: {
      mild: { description: 'Occasional mild episodes', urgency: 'see-doctor-soon' },
      moderate: { description: 'Frequent episodes with progressive hearing loss', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe vertigo with falls, or rapidly progressing hearing loss', urgency: 'see-doctor-today' },
    },
    risk_factors: ['family history', 'high salt intake', 'stress'],
    red_flags: ['vertigo with new neurological symptoms', 'rapidly progressing hearing loss'],
    specialist: 'ENT Specialist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['ent_bppv', 'ent_sudden_hearing_loss'],
    recommendations: [
      'See an ENT specialist for hearing tests and further evaluation',
      'A low-salt diet can help reduce the frequency of episodes',
      'Prescribed medications can help manage acute vertigo episodes',
      'Avoid caffeine and alcohol, which may worsen symptoms',
      'See a doctor promptly for rapidly progressing hearing loss',
    ],
  },

  {
    id: 'ent_sudden_hearing_loss',
    name: 'Sudden Sensorineural Hearing Loss — Warning Sign',
    category: 'ENT',
    aliases: ['sudden deafness'],
    symptoms: {
      primary: [
        { name: 'sudden hearing loss', weight: 1.0, description: 'One-sided, over hours to 3 days' },
        { name: 'sudden deafness', weight: 0.9, description: 'Colloquial phrasing for the same presentation' },
        { name: 'hearing loss came on suddenly', weight: 0.9, description: '—' },
      ],
      secondary: [
        { name: 'tinnitus', weight: 0.5, description: 'In the affected ear' },
        { name: 'dizziness', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'rapid onset', weight: 0.8, description: 'Develops over hours to a few days, unlike gradual age-related loss' },
      ],
    },
    duration_patterns: { acute: '< 72 hours onset', typical: 'this requires treatment within 2 weeks for best recovery chances', chronic: null },
    severity_levels: {
      mild: { description: 'This condition requires urgent evaluation even when apparently mild', urgency: 'emergency' },
      moderate: { description: 'Sudden significant hearing loss in one ear', urgency: 'emergency' },
      severe: { description: 'Complete sudden hearing loss with dizziness', urgency: 'emergency' },
    },
    risk_factors: ['viral infection', 'vascular risk factors', 'autoimmune conditions'],
    // Each phrase requires the "sudden"/instantaneous framing — bare
    // "hearing loss" alone is dropped since gradual age-related loss is
    // common and NOT an emergency.
    red_flags: ['sudden hearing loss', 'sudden deafness', 'hearing loss came on suddenly'],
    specialist: 'ENT Specialist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['ent_menieres', 'ent_otitis_media'],
    recommendations: [
      'See an ENT specialist immediately — treatment within 72 hours to a week offers the best chance of recovery',
      'Oral or injected corticosteroids are often used to treat sudden hearing loss',
      'Do not wait to see if hearing returns on its own — time-sensitive treatment matters',
      'Audiometry testing is needed to confirm and monitor the hearing loss',
      'This is a true ENT emergency — treat it with the same urgency as a stroke',
    ],
  },

  {
    id: 'ent_nasal_polyps',
    name: 'Nasal Polyps',
    category: 'ENT',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'nasal congestion', weight: 0.8, description: 'Persistent, often both sides' },
        { name: 'reduced smell', weight: 0.6, description: '—' },
      ],
      secondary: [
        { name: 'post-nasal drip', weight: 0.4, description: '—' },
        { name: 'facial pain', weight: 0.3, description: 'If sinuses involved' },
      ],
      differentiating: [
        { name: 'chronic allergy history', weight: 0.4, description: 'Often associated with allergic rhinitis or asthma' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, progressive', chronic: '> 90 days is typical presentation' },
    severity_levels: {
      mild: { description: 'Mild congestion', urgency: 'see-doctor-soon' },
      moderate: { description: 'Persistent congestion with reduced smell', urgency: 'see-doctor-soon' },
      severe: { description: 'Complete nasal obstruction affecting breathing/sleep', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['chronic allergic rhinitis', 'asthma', 'chronic sinusitis', 'aspirin sensitivity'],
    red_flags: [],
    specialist: 'ENT Specialist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['respiratory_allergic_rhinitis', 'respiratory_sinusitis'],
    recommendations: [
      'See an ENT specialist for nasal endoscopy to confirm the diagnosis',
      'Prescribed nasal corticosteroid sprays can shrink polyps and reduce symptoms',
      'Manage underlying allergies and asthma effectively',
      'Surgery may be considered for polyps not responding to medical treatment',
      'See a doctor if congestion becomes severe enough to affect breathing or sleep',
    ],
  },

  {
    id: 'ent_epistaxis',
    name: 'Epistaxis (Nosebleed)',
    category: 'ENT',
    aliases: ['nosebleed'],
    symptoms: {
      primary: [
        { name: 'nosebleed', weight: 0.95, description: 'Bleeding from one or both nostrils' },
      ],
      secondary: [],
      differentiating: [
        { name: 'recent nose trauma or picking', weight: 0.4, description: 'Common cause, especially in children' },
      ],
    },
    duration_patterns: { acute: '< 20 minutes typical episode', typical: 'resolves with first aid measures', chronic: '> 30 days of recurrent nosebleeds warrants evaluation' },
    severity_levels: {
      mild: { description: 'Brief, self-limiting nosebleed', urgency: 'self-care' },
      moderate: { description: 'Recurrent nosebleeds', urgency: 'see-doctor-soon' },
      severe: { description: 'Heavy bleeding not stopping after 20 minutes of pressure', urgency: 'emergency' },
    },
    risk_factors: ['nose picking/trauma', 'dry air', 'blood thinner medication', 'high blood pressure'],
    red_flags: ['bleeding not stopping after 20 minutes of firm pressure', 'heavy blood loss with dizziness', 'nosebleed after significant head trauma'],
    specialist: 'ENT Specialist',
    india_prevalence: 'high',
    seasonal_pattern: 'winter',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['blood_thrombocytopenia', 'heart_hypertension'],
    recommendations: [
      'Sit up and lean slightly forward; pinch the soft part of the nose for 10-15 minutes continuously',
      'Avoid tilting the head back — can cause blood to be swallowed',
      'Apply a cold compress to the bridge of the nose',
      'Avoid nose picking and blowing forcefully for a few hours after',
      'Go to the emergency room if bleeding does not stop after 20 minutes of firm pressure',
    ],
  },
]

export default ear_nose_throat

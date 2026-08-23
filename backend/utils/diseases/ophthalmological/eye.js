export const eye = [
  {
    id: 'eye_conjunctivitis',
    name: 'Conjunctivitis (Pink Eye)',
    category: 'Ophthalmological',
    aliases: ['pink eye'],
    symptoms: {
      primary: [
        { name: 'eye redness', weight: 0.85, description: '—' },
        { name: 'eye discharge', weight: 0.6, description: 'Watery or sticky' },
      ],
      secondary: [
        { name: 'eye itching', weight: 0.4, description: '—' },
        { name: 'eye irritation', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'morning eye crusting', weight: 0.5, description: 'Especially with bacterial conjunctivitis' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '5-7 days', chronic: null },
    severity_levels: {
      mild: { description: 'Mild redness and discharge', urgency: 'see-doctor-soon' },
      moderate: { description: 'Significant discharge affecting vision clarity', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe eye pain, sudden vision loss, or extreme light sensitivity', urgency: 'emergency' },
    },
    risk_factors: ['contact with infected person', 'allergies', 'contact lens use', 'summer/monsoon season'],
    red_flags: ['severe eye pain', 'sudden vision loss or blurring', 'extreme light sensitivity', 'very swollen eyelid unable to open'],
    specialist: 'Ophthalmologist',
    india_prevalence: 'high',
    seasonal_pattern: 'monsoon',
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['eye_stye', 'eye_uveitis'],
    recommendations: [
      'Clean eye discharge with a clean, wet cotton ball, wiping from inner to outer corner',
      'Do not touch your eyes; wash hands frequently — it is very contagious',
      'Do not share towels, pillowcases, or eye drops',
      'See an ophthalmologist for antibiotic drops if discharge is yellow or green',
      'See an eye doctor today if pain is severe or vision is affected',
    ],
  },

  {
    id: 'eye_stye',
    name: 'Stye (Hordeolum)',
    category: 'Ophthalmological',
    aliases: ['hordeolum'],
    symptoms: {
      primary: [
        { name: 'eyelid swelling', weight: 0.85, description: 'Localized, tender bump' },
        { name: 'eye pain', weight: 0.5, description: 'Localized to the bump' },
      ],
      secondary: [
        { name: 'eye redness', weight: 0.3, description: 'Around the bump' },
      ],
      differentiating: [
        { name: 'localized tender bump on eyelid', weight: 0.6, description: 'Distinguishes from generalized conjunctivitis' },
      ],
    },
    duration_patterns: { acute: '< 7 days', typical: '3-7 days, may drain spontaneously', chronic: '> 14 days suggests chalazion instead' },
    severity_levels: {
      mild: { description: 'Small localized bump', urgency: 'self-care' },
      moderate: { description: 'Larger, more painful bump', urgency: 'see-doctor-soon' },
      severe: { description: 'Spreading redness and swelling around the eye (orbital cellulitis)', urgency: 'emergency' },
    },
    risk_factors: ['poor eyelid hygiene', 'contact lens use', 'previous styes'],
    red_flags: ['spreading redness and swelling around the entire eye', 'fever with eye swelling', 'vision changes'],
    specialist: 'Ophthalmologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['eye_conjunctivitis', 'eye_blepharitis'],
    recommendations: [
      'Apply a warm compress to the affected eyelid several times a day',
      'Do not squeeze or attempt to pop the stye',
      'Maintain good eyelid hygiene',
      'Most styes drain and resolve on their own within a week',
      'Seek emergency care for spreading redness/swelling around the whole eye or fever',
    ],
  },

  {
    id: 'eye_blepharitis',
    name: 'Blepharitis',
    category: 'Ophthalmological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'eyelid irritation', weight: 0.8, description: 'Red, itchy eyelid margins' },
      ],
      secondary: [
        { name: 'eye crusting', weight: 0.5, description: 'Especially in the morning' },
        { name: 'eye burning', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'affects eyelid margin specifically', weight: 0.5, description: 'Distinguishes from conjunctivitis' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, recurring', chronic: '> 90 days recurrent symptoms typical' },
    severity_levels: {
      mild: { description: 'Mild eyelid irritation', urgency: 'self-care' },
      moderate: { description: 'Significant crusting and discomfort', urgency: 'see-doctor-soon' },
      severe: { description: 'Vision changes or severe pain (needs evaluation for complications)', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['seborrheic dermatitis', 'rosacea', 'poor eyelid hygiene'],
    red_flags: ['vision changes', 'severe eye pain'],
    specialist: 'Ophthalmologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['eye_stye', 'eye_dry_eye'],
    recommendations: [
      'Clean eyelid margins gently with diluted baby shampoo or a warm compress daily',
      'Avoid eye makeup during active flares',
      'Manage underlying skin conditions like seborrheic dermatitis or rosacea',
      'Artificial tears can help with associated dryness',
      'See an ophthalmologist if symptoms are persistent or affect vision',
    ],
  },

  {
    id: 'eye_dry_eye',
    name: 'Dry Eye Syndrome',
    category: 'Ophthalmological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'eye dryness', weight: 0.85, description: 'Gritty, sandy sensation' },
      ],
      secondary: [
        { name: 'eye redness', weight: 0.4, description: '—' },
        { name: 'eye burning', weight: 0.4, description: '—' },
        { name: 'blurred vision', weight: 0.3, description: 'Fluctuating, improves with blinking' },
      ],
      differentiating: [
        { name: 'worse with screen use', weight: 0.5, description: 'Symptoms worsen with prolonged screen time' },
      ],
    },
    duration_patterns: { acute: null, typical: 'chronic, fluctuating', chronic: '> 90 days recurrent symptoms typical' },
    severity_levels: {
      mild: { description: 'Occasional mild dryness', urgency: 'self-care' },
      moderate: { description: 'Frequent discomfort affecting daily activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Severe pain or vision changes (possible corneal damage)', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['prolonged screen use', 'contact lens use', 'aging', 'certain medications', 'dry climate/AC exposure'],
    red_flags: ['severe eye pain', 'vision changes'],
    specialist: 'Ophthalmologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['eye_blepharitis'],
    recommendations: [
      'Use artificial tear drops regularly',
      'Follow the 20-20-20 rule during screen use — every 20 minutes, look at something 20 feet away for 20 seconds',
      'Use a humidifier in dry or air-conditioned environments',
      'Blink deliberately and frequently during screen use',
      'See an ophthalmologist if symptoms persist despite these measures',
    ],
  },

  {
    id: 'eye_glaucoma_warning',
    name: 'Glaucoma — Warning Signs',
    category: 'Ophthalmological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'vision loss', weight: 0.6, description: 'Gradual peripheral loss (chronic) or sudden (acute)' },
        { name: 'severe eye pain with halos', weight: 1.0, description: 'The acute angle-closure presentation specifically — not the gradual chronic form' },
      ],
      secondary: [
        { name: 'eye pain', weight: 0.4, description: 'In acute angle-closure glaucoma' },
        { name: 'headache', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'halos around lights', weight: 0.7, description: 'Characteristic of acute angle-closure glaucoma' },
        { name: 'nausea with eye pain', weight: 0.6, description: 'Accompanies acute glaucoma attack' },
      ],
    },
    duration_patterns: { acute: 'acute attack sudden onset', typical: 'chronic type is gradual over years', chronic: '> 365 days for chronic open-angle glaucoma' },
    severity_levels: {
      mild: { description: 'Mildly elevated eye pressure found on routine exam', urgency: 'see-doctor-soon' },
      moderate: { description: 'Gradual peripheral vision loss noticed', urgency: 'see-doctor-today' },
      severe: { description: 'Sudden severe eye pain with halos, nausea, and red eye (acute angle-closure)', urgency: 'emergency' },
    },
    risk_factors: ['age over 40', 'family history', 'diabetes', 'high eye pressure'],
    // Bare "eye pain" or "vision loss" alone dropped — both common for many
    // benign causes. Requires the specific acute-attack combination.
    red_flags: [
      'severe eye pain with halos',
      'eye pain with nausea and halos',
      'sudden severe eye pain with vision loss',
    ],
    specialist: 'Ophthalmologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['eye_cataract'],
    recommendations: [
      'See an ophthalmologist immediately — tonometry and optic disc examination are essential',
      'Never miss prescribed eye drop doses — vision loss from glaucoma is permanent and irreversible',
      'Family members of glaucoma patients should have regular eye pressure checks',
      'Regular eye check-ups every year after age 40',
      'Go to emergency care immediately for sudden severe eye pain with nausea and halos — acute angle closure can cause blindness within hours',
    ],
  },

  {
    id: 'eye_cataract',
    name: 'Cataract',
    category: 'Ophthalmological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'cloudy vision', weight: 0.8, description: 'Gradual' },
        { name: 'blurred vision', weight: 0.7, description: '—' },
      ],
      secondary: [
        { name: 'glare from lights', weight: 0.4, description: '—' },
        { name: 'faded colors', weight: 0.3, description: '—' },
      ],
      differentiating: [
        { name: 'gradual vision decline over months to years', weight: 0.6, description: 'Distinguishes from sudden vision loss' },
      ],
    },
    duration_patterns: { acute: null, typical: 'gradual onset over months to years', chronic: '> 180 days progressive vision changes typical' },
    severity_levels: {
      mild: { description: 'Mild cloudiness not affecting daily activities', urgency: 'see-doctor-soon' },
      moderate: { description: 'Vision blurring affecting daily activities', urgency: 'see-doctor-soon' },
      severe: { description: 'Dense cataract causing significant functional blindness', urgency: 'see-doctor-soon' },
    },
    risk_factors: ['age over 60', 'diabetes', 'excessive UV exposure', 'smoking'],
    red_flags: ['sudden vision loss in a cataract patient'],
    specialist: 'Ophthalmologist',
    india_prevalence: 'high',
    seasonal_pattern: null,
    age_relevance: 'elderly',
    gender_relevance: 'all',
    similar_diseases: ['eye_glaucoma_warning'],
    recommendations: [
      'See an ophthalmologist for visual acuity testing and slit lamp examination',
      'Cataract surgery is the only cure — glasses cannot correct cataracts',
      'Free cataract surgery is available at government hospitals under the National Programme for Control of Blindness',
      'Wear UV-protective sunglasses outdoors to slow progression',
      'Control blood sugar if diabetic to help slow cataract progression',
    ],
  },

  {
    id: 'eye_retinal_detachment_warning',
    name: 'Retinal Detachment — Warning Signs',
    category: 'Ophthalmological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'sudden vision loss', weight: 0.9, description: 'Partial, like a curtain coming down' },
        { name: 'floaters', weight: 0.7, description: 'Sudden increase' },
      ],
      secondary: [
        { name: 'flashes of light', weight: 0.6, description: '—' },
      ],
      differentiating: [
        { name: 'curtain-like vision loss', weight: 0.8, description: 'Highly characteristic description of retinal detachment' },
      ],
    },
    duration_patterns: { acute: 'sudden onset', typical: 'this is always a medical emergency', chronic: null },
    severity_levels: {
      mild: { description: 'This condition has no mild form — always treat as an emergency', urgency: 'emergency' },
      moderate: { description: 'New floaters and flashes of light', urgency: 'emergency' },
      severe: { description: 'Curtain-like vision loss', urgency: 'emergency' },
    },
    risk_factors: ['high myopia (nearsightedness)', 'previous eye surgery', 'eye trauma', 'family history'],
    // Bare "floaters" dropped — occasional floaters are extremely common and
    // benign. "Curtain-like" is the highly characteristic, safe-to-use-alone
    // description of this specific condition.
    red_flags: [
      'curtain over my vision',
      'curtain-like vision loss',
      'sudden increase in floaters',
      'flashes of light with floaters',
    ],
    specialist: 'Ophthalmologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['eye_glaucoma_warning'],
    recommendations: [
      'See an ophthalmologist immediately — this is a same-day emergency',
      'Prompt surgical treatment offers the best chance of preserving vision',
      'Do not delay — permanent vision loss can occur within days if untreated',
      'Avoid strenuous activity or heavy lifting until evaluated',
      'This is a true ophthalmic emergency, similar in urgency to a stroke',
    ],
  },

  {
    id: 'eye_uveitis',
    name: 'Uveitis',
    category: 'Ophthalmological',
    aliases: [],
    symptoms: {
      primary: [
        { name: 'eye pain', weight: 0.8, description: 'Deep, aching' },
        { name: 'eye redness', weight: 0.6, description: 'Especially around the iris' },
      ],
      secondary: [
        { name: 'photophobia', weight: 0.6, description: 'Significant light sensitivity' },
        { name: 'blurred vision', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'photophobia with eye pain', weight: 0.6, description: 'Distinguishes from simple conjunctivitis' },
      ],
    },
    duration_patterns: { acute: '< 14 days', typical: '2-8 weeks with treatment', chronic: '> 90 days suggests chronic uveitis' },
    severity_levels: {
      mild: { description: 'Mild eye discomfort', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant pain and light sensitivity', urgency: 'see-doctor-today' },
      severe: { description: 'Severe vision loss or very severe pain', urgency: 'emergency' },
    },
    risk_factors: ['autoimmune conditions', 'ankylosing spondylitis', 'recent eye trauma', 'certain infections'],
    red_flags: ['significant vision loss', 'severe eye pain'],
    specialist: 'Ophthalmologist',
    india_prevalence: 'low',
    seasonal_pattern: null,
    age_relevance: 'adults',
    gender_relevance: 'all',
    similar_diseases: ['eye_conjunctivitis', 'eye_glaucoma_warning'],
    recommendations: [
      'See an ophthalmologist promptly — this requires prescription treatment, not over-the-counter drops',
      'Prescribed corticosteroid eye drops are typically needed',
      'Underlying autoimmune conditions should be evaluated if uveitis recurs',
      'Wear sunglasses to reduce light sensitivity discomfort',
      'Seek emergency care for significant vision loss or severe pain',
    ],
  },

  {
    id: 'eye_corneal_abrasion',
    name: 'Corneal Abrasion',
    category: 'Ophthalmological',
    aliases: ['scratched eye'],
    symptoms: {
      primary: [
        { name: 'eye pain', weight: 0.85, description: 'Sharp, worse with blinking' },
        { name: 'eye redness', weight: 0.5, description: '—' },
      ],
      secondary: [
        { name: 'photophobia', weight: 0.5, description: '—' },
        { name: 'excessive tearing', weight: 0.4, description: '—' },
      ],
      differentiating: [
        { name: 'recent eye injury or foreign body', weight: 0.6, description: 'Clear precipitating event' },
      ],
    },
    duration_patterns: { acute: '< 3 days', typical: '1-3 days to heal', chronic: null },
    severity_levels: {
      mild: { description: 'Mild surface scratch', urgency: 'see-doctor-today' },
      moderate: { description: 'Significant pain limiting eye opening', urgency: 'see-doctor-today' },
      severe: { description: 'Visible foreign body embedded, or vision loss', urgency: 'emergency' },
    },
    risk_factors: ['eye trauma', 'contact lens use', 'foreign body exposure', 'occupational hazards (dust, metal work)'],
    red_flags: ['embedded foreign body in the eye', 'vision loss', 'chemical exposure to the eye'],
    specialist: 'Ophthalmologist',
    india_prevalence: 'moderate',
    seasonal_pattern: null,
    age_relevance: 'all',
    gender_relevance: 'all',
    similar_diseases: ['eye_conjunctivitis'],
    recommendations: [
      'See an ophthalmologist promptly for evaluation and treatment',
      'Do not rub the eye',
      'Avoid wearing contact lenses until fully healed',
      'Use prescribed antibiotic drops to prevent infection during healing',
      'Go to the emergency room immediately for an embedded foreign body or chemical exposure',
    ],
  },
]

export default eye

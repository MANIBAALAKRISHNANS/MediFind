// Common symptom → likely India-prevalent disease mappings
// Used as a sanity-check / boost layer on top of the local diagnosis engine's result

export const INDIAN_PATTERNS = [
  // ── Fever & Vector-borne ────────────────────────────────────────────────────
  { symptoms: ['fever','chills','headache','body ache','muscle pain'],          diseases: ['Dengue Fever','Malaria','Typhoid','Viral Fever','Chikungunya'],         specialty: 'general physician',  severity: 'moderate' },
  { symptoms: ['fever','rash','joint pain'],                                    diseases: ['Dengue Fever','Chikungunya','Measles'],                                 specialty: 'general physician',  severity: 'moderate' },
  { symptoms: ['fever','cyclical','chills','sweating','rigor'],                 diseases: ['Malaria','Dengue Fever','Viral Fever'],                                 specialty: 'general physician',  severity: 'moderate' },
  { symptoms: ['fever','abdominal pain','constipation','coated tongue'],        diseases: ['Typhoid Fever','Typhus','Brucellosis'],                                 specialty: 'general physician',  severity: 'moderate' },

  // ── Respiratory ─────────────────────────────────────────────────────────────
  { symptoms: ['fever','cough','breathing','chest'],                            diseases: ['Pneumonia','Tuberculosis','COVID-19','Bronchitis'],                     specialty: 'pulmonologist',      severity: 'severe'   },
  { symptoms: ['fever','chest pain','nausea'],                                  diseases: ['Pleuritis','Pericarditis','Pneumonia','Pulmonary Embolism'],             specialty: 'pulmonologist',      severity: 'severe'   },
  { symptoms: ['cough','sputum','weight loss','night sweat'],                   diseases: ['Tuberculosis','Lung Infection','Chronic Bronchitis'],                   specialty: 'pulmonologist',      severity: 'severe'   },
  { symptoms: ['wheezing','breathless','chest tightness','nocturnal cough'],    diseases: ['Asthma','COPD','Allergic Bronchitis'],                                  specialty: 'pulmonologist',      severity: 'moderate' },
  { symptoms: ['chronic cough','breathless','smoker','sputum'],                 diseases: ['COPD','Chronic Bronchitis','Emphysema','Lung Cancer'],                  specialty: 'pulmonologist',      severity: 'severe'   },
  { symptoms: ['sudden breathless','chest pain','leg swelling','calf pain'],    diseases: ['Pulmonary Embolism','DVT','Pneumothorax'],                              specialty: 'pulmonologist',      severity: 'severe'   },

  // ── Cardiovascular ──────────────────────────────────────────────────────────
  { symptoms: ['chest pain','breathlessness','sweating','left arm','jaw pain'], diseases: ['Heart Attack','Angina','Acute Coronary Syndrome'],                     specialty: 'cardiologist',       severity: 'severe'   },
  { symptoms: ['high bp','headache','dizzy'],                                   diseases: ['Hypertension','Hypertensive Crisis'],                                   specialty: 'cardiologist',       severity: 'moderate' },
  { symptoms: ['palpitations','racing heart','irregular heartbeat','faint'],    diseases: ['Arrhythmia','Atrial Fibrillation','SVT','Panic Attack'],                specialty: 'cardiologist',       severity: 'moderate' },
  { symptoms: ['leg swelling','breathless lying flat','fatigue','ankle oedema'],diseases: ['Heart Failure','Nephrotic Syndrome','Cirrhosis','DVT'],                 specialty: 'cardiologist',       severity: 'severe'   },
  { symptoms: ['chest pain on exertion','relieved by rest','radiation arm'],    diseases: ['Angina Pectoris','GERD','Costochondritis'],                             specialty: 'cardiologist',       severity: 'moderate' },

  // ── Gastrointestinal ────────────────────────────────────────────────────────
  { symptoms: ['yellow eyes','yellow skin','dark urine','jaundice'],            diseases: ['Hepatitis A','Hepatitis B','Jaundice','Liver Infection'],               specialty: 'hepatologist',       severity: 'severe'   },
  { symptoms: ['diarrhea','vomiting','stomach pain','loose motion'],            diseases: ['Gastroenteritis','Food Poisoning','Cholera','Amoebiasis'],              specialty: 'gastroenterologist', severity: 'moderate' },
  { symptoms: ['abdominal pain','bloating','alternating diarrhea constipation'],diseases: ['IBS','IBD','Coeliac Disease','Lactose Intolerance'],                    specialty: 'gastroenterologist', severity: 'mild'     },
  { symptoms: ['severe upper abdomen pain','back pain','vomiting','fatty food'],diseases: ['Pancreatitis','Gallstones','Peptic Ulcer'],                             specialty: 'gastroenterologist', severity: 'severe'   },
  { symptoms: ['right upper abdomen pain','fever','nausea','fatty food'],       diseases: ['Cholecystitis','Gallstones','Hepatitis'],                               specialty: 'gastroenterologist', severity: 'moderate' },
  { symptoms: ['rectal bleeding','blood in stool','weight loss','fatigue'],     diseases: ['Colorectal Cancer','Haemorrhoids','IBD','Diverticulitis'],               specialty: 'gastroenterologist', severity: 'severe'   },
  { symptoms: ['blood in stool','pain defecation','anal mass','itching anus'],  diseases: ['Haemorrhoids (Piles)','Anal Fissure','Rectal Prolapse'],                specialty: 'gastroenterologist', severity: 'mild'     },

  // ── Neurological ────────────────────────────────────────────────────────────
  { symptoms: ['headache','vision','vomit','one side'],                         diseases: ['Migraine','Cluster Headache','Tension Headache'],                      specialty: 'neurologist',        severity: 'moderate' },
  { symptoms: ['headache','fever','neck stiff','rash'],                         diseases: ['Meningitis','Encephalitis','Severe Migraine'],                         specialty: 'neurologist',        severity: 'severe'   },
  { symptoms: ['sudden weakness','face drooping','slurred speech','arm weakness'],diseases: ['Stroke','TIA','Hemiplegic Migraine','Brain Tumour'],                 specialty: 'neurologist',        severity: 'severe'   },
  { symptoms: ['seizure','convulsion','loss of consciousness','shaking'],       diseases: ['Epilepsy','Febrile Seizure','Hypoglycaemia','Meningitis'],              specialty: 'neurologist',        severity: 'severe'   },
  { symptoms: ['tremor','slow movement','stiffness','balance problem'],         diseases: ['Parkinson\'s Disease','Essential Tremor','Cerebellar Ataxia'],         specialty: 'neurologist',        severity: 'moderate' },
  { symptoms: ['numbness','tingling','burning feet','hands','peripheral'],      diseases: ['Peripheral Neuropathy','Diabetic Neuropathy','B12 Deficiency'],        specialty: 'neurologist',        severity: 'moderate' },

  // ── Musculoskeletal ─────────────────────────────────────────────────────────
  { symptoms: ['leg pain','swelling','varicose','calf'],                        diseases: ['DVT','Muscle Strain','Varicose Veins','Sciatica'],                     specialty: 'orthopedic',         severity: 'moderate' },
  { symptoms: ['back pain','leg pain','numb','tingling'],                       diseases: ['Sciatica','Slipped Disc','Lumbar Spondylosis'],                        specialty: 'orthopedic',         severity: 'moderate' },
  { symptoms: ['morning stiffness','multiple joint pain','symmetrical','fatigue'],diseases: ['Rheumatoid Arthritis','Lupus','Psoriatic Arthritis'],               specialty: 'rheumatologist',     severity: 'moderate' },
  { symptoms: ['low back pain','young adult','morning stiffness','sacrum'],     diseases: ['Ankylosing Spondylitis','Reactive Arthritis','Sacroiliitis'],          specialty: 'rheumatologist',     severity: 'moderate' },
  { symptoms: ['butterfly rash','joint pain','fatigue','sun sensitivity'],      diseases: ['Lupus (SLE)','Dermatomyositis','Mixed Connective Tissue Disease'],     specialty: 'rheumatologist',     severity: 'moderate' },

  // ── Endocrine / Metabolic ───────────────────────────────────────────────────
  { symptoms: ['thirst','frequent urine','weight loss','tired'],                diseases: ['Type 2 Diabetes','Type 1 Diabetes','Diabetes Insipidus'],              specialty: 'endocrinologist',    severity: 'moderate' },
  { symptoms: ['weight gain','fatigue','cold intolerance','constipation','dry skin'],diseases: ['Hypothyroidism','Cushing\'s Syndrome','Depression'],              specialty: 'endocrinologist',    severity: 'moderate' },
  { symptoms: ['weight loss','palpitations','heat intolerance','tremor','anxiety'],diseases: ['Hyperthyroidism','Thyrotoxicosis','Anxiety Disorder'],              specialty: 'endocrinologist',    severity: 'moderate' },
  { symptoms: ['irregular periods','weight gain','acne','excessive hair growth'],diseases: ['PCOS','Hypothyroidism','Cushing\'s Syndrome'],                       specialty: 'endocrinologist',    severity: 'moderate' },

  // ── Urological & Nephrological ──────────────────────────────────────────────
  { symptoms: ['burning urine','frequent urine','lower abdomen'],               diseases: ['UTI','Cystitis','Kidney Stone'],                                       specialty: 'urologist',          severity: 'moderate' },
  { symptoms: ['poor urine stream','frequent urination night','incomplete void'],diseases: ['BPH','Prostate Cancer','Urethral Stricture'],                        specialty: 'urologist',          severity: 'moderate' },
  { symptoms: ['swelling face','legs','fatigue','foamy urine','high bp'],       diseases: ['CKD','Nephrotic Syndrome','Glomerulonephritis'],                       specialty: 'nephrologist',       severity: 'severe'   },

  // ── Dermatological ──────────────────────────────────────────────────────────
  { symptoms: ['itchy','rash','red patches','skin'],                            diseases: ['Eczema','Fungal Infection','Allergic Dermatitis','Scabies'],           specialty: 'dermatologist',      severity: 'mild'     },
  { symptoms: ['silvery scales','plaques','scalp','elbows','knees'],            diseases: ['Psoriasis','Seborrhoeic Dermatitis','Pityriasis Rosea'],               specialty: 'dermatologist',      severity: 'mild'     },
  { symptoms: ['ring-shaped rash','scaling','itchy circular'],                  diseases: ['Ringworm (Tinea)','Pityriasis Rosea','Nummular Eczema'],               specialty: 'dermatologist',      severity: 'mild'     },
  { symptoms: ['acne','pimples','blackheads','oily skin','cysts face'],         diseases: ['Acne Vulgaris','Rosacea','Perioral Dermatitis'],                       specialty: 'dermatologist',      severity: 'mild'     },
  { symptoms: ['white patches','loss of pigment','skin'],                       diseases: ['Vitiligo','Pityriasis Alba','Tinea Versicolor'],                       specialty: 'dermatologist',      severity: 'mild'     },

  // ── Ophthalmological ────────────────────────────────────────────────────────
  { symptoms: ['eye pain','red eye','blurred vision'],                          diseases: ['Conjunctivitis','Glaucoma','Iritis'],                                  specialty: 'ophthalmologist',    severity: 'moderate' },
  { symptoms: ['gradual vision loss','halos','night difficulty','elderly'],     diseases: ['Cataract','Glaucoma','Age-related Macular Degeneration'],              specialty: 'ophthalmologist',    severity: 'moderate' },
  { symptoms: ['sudden vision loss','floaters','flashes of light'],             diseases: ['Retinal Detachment','Vitreous Haemorrhage','Acute Glaucoma'],          specialty: 'ophthalmologist',    severity: 'severe'   },

  // ── ENT ─────────────────────────────────────────────────────────────────────
  { symptoms: ['ear pain','hearing','discharge'],                               diseases: ['Otitis Media','Ear Infection','Eardrum Rupture'],                      specialty: 'ent specialist',     severity: 'moderate' },
  { symptoms: ['dizziness','spinning','vertigo','balance','nausea turning'],    diseases: ['BPPV','Vestibular Neuritis','Meniere\'s Disease','Labyrinthitis'],     specialty: 'ent specialist',     severity: 'moderate' },
  { symptoms: ['sneezing','runny nose','itchy eyes','seasonal','dust allergy'], diseases: ['Allergic Rhinitis','Sinusitis','Non-Allergic Rhinitis'],               specialty: 'ent specialist',     severity: 'mild'     },
  { symptoms: ['snoring','daytime sleepiness','witnessed apnea','morning headache'],diseases: ['Obstructive Sleep Apnoea','Obesity Hypoventilation','Insomnia'],   specialty: 'ent specialist',     severity: 'moderate' },

  // ── Dental ──────────────────────────────────────────────────────────────────
  { symptoms: ['tooth pain','swollen gum','jaw'],                               diseases: ['Dental Caries','Gingivitis','Tooth Abscess'],                          specialty: 'dentist',            severity: 'moderate' },

  // ── Mental Health ────────────────────────────────────────────────────────────
  { symptoms: ['anxiety','panic','can\'t sleep','worry'],                       diseases: ['Anxiety Disorder','Panic Disorder','Generalised Anxiety'],             specialty: 'psychiatrist',       severity: 'moderate' },
  { symptoms: ['sad','no interest','tired','sleep'],                            diseases: ['Depression','Burnout','Adjustment Disorder'],                          specialty: 'psychiatrist',       severity: 'moderate' },
  { symptoms: ['elevated mood','no sleep needed','grandiose','racing thoughts'],diseases: ['Bipolar Disorder (Mania)','Hypomania','Schizophrenia'],                specialty: 'psychiatrist',       severity: 'severe'   },

  // ── Gynaecological ──────────────────────────────────────────────────────────
  { symptoms: ['irregular periods','pelvic pain','acne','excess hair','weight gain'],diseases: ['PCOS','Hypothyroidism','Endometriosis'],                         specialty: 'gynecologist',       severity: 'moderate' },
  { symptoms: ['pelvic pain','painful periods','painful intercourse','infertility'],diseases: ['Endometriosis','Fibroids','PID','Adenomyosis'],                   specialty: 'gynecologist',       severity: 'moderate' },
  { symptoms: ['severe one-sided pain','missed period','vaginal bleeding','shoulder tip'],diseases: ['Ectopic Pregnancy','Ruptured Ovarian Cyst','Miscarriage'],  specialty: 'gynecologist',       severity: 'severe'   },
  { symptoms: ['heavy periods','prolonged bleeding','anaemia','clots'],         diseases: ['Menorrhagia','Fibroids','Endometrial Polyp','Hypothyroidism'],         specialty: 'gynecologist',       severity: 'moderate' },

  // ── Paediatric ───────────────────────────────────────────────────────────────
  { symptoms: ['child fever','rash','red eyes','swollen lymph','red lips'],     diseases: ['Kawasaki Disease','Scarlet Fever','Measles','Viral Fever'],            specialty: 'pediatrician',       severity: 'severe'   },
  { symptoms: ['child convulsion','fever','first fit'],                         diseases: ['Febrile Seizure','Meningitis','Epilepsy'],                             specialty: 'pediatrician',       severity: 'severe'   },
]

/**
 * Scan free-text symptoms against all INDIAN_PATTERNS.
 * Returns matched patterns sorted by match count (desc), each enriched with
 * `matchCount` and a derived `confidence` score.
 * A pattern must have at least 2 keyword hits to be considered a match.
 *
 * @param {string} symptomsText — raw symptom string from the user
 * @returns {Array}
 */
export function detectPatterns(symptomsText) {
  const text = symptomsText.toLowerCase()
  const matches = []

  for (const pattern of INDIAN_PATTERNS) {
    const matchCount = pattern.symptoms.filter(s => text.includes(s)).length
    if (matchCount >= 2) {
      matches.push({
        ...pattern,
        matchCount,
        confidence: Math.min(95, 50 + matchCount * 15),
      })
    }
  }

  return matches.sort((a, b) => b.matchCount - a.matchCount)
}

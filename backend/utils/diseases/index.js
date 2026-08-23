// Aggregates every disease category file into one flat DISEASE_DB array,
// validating each entry against _schema.js (dev-time, warn-only — a
// malformed entry never crashes the server, it just won't score well and
// will be logged so it can be fixed).
import { validateDiseaseEntry } from './_schema.js'

import { viral } from './infectious/viral.js'
import { bacterial } from './infectious/bacterial.js'
import { fungal } from './infectious/fungal.js'
import { parasitic } from './infectious/parasitic.js'
import { tropical } from './infectious/tropical.js'

import { upper } from './respiratory/upper.js'
import { lower } from './respiratory/lower.js'
import { chronic } from './respiratory/chronic.js'

import { upper_gi } from './gastrointestinal/upper_gi.js'
import { lower_gi } from './gastrointestinal/lower_gi.js'
import { liver } from './gastrointestinal/liver.js'
import { pancreas_gallbladder } from './gastrointestinal/pancreas_gallbladder.js'

import { heart } from './cardiovascular/heart.js'
import { vascular } from './cardiovascular/vascular.js'

import { headache } from './neurological/headache.js'
import { central } from './neurological/central.js'
import { peripheral } from './neurological/peripheral.js'

import { joints } from './musculoskeletal/joints.js'
import { bone } from './musculoskeletal/bone.js'
import { soft_tissue } from './musculoskeletal/soft_tissue.js'

import { diabetes } from './endocrine/diabetes.js'
import { thyroid } from './endocrine/thyroid.js'
import { adrenal_pituitary } from './endocrine/adrenal_pituitary.js'

import { kidney } from './renal_urological/kidney.js'
import { urological } from './renal_urological/urological.js'

import { infections } from './dermatological/infections.js'
import { inflammatory } from './dermatological/inflammatory.js'
import { other_skin } from './dermatological/other_skin.js'

import { common } from './mental_health/common.js'

import { blood } from './hematological/blood.js'

import { ear_nose_throat } from './ent/ear_nose_throat.js'

import { eye } from './ophthalmological/eye.js'

import { women } from './gynecological/women.js'

import { children } from './pediatric_common/children.js'

import { allergy_autoimmune } from './allergic_immune/allergy_autoimmune.js'

import { red_flags } from './emergency_red_flags/red_flags.js'

export const DISEASE_DB = [
  ...viral, ...bacterial, ...fungal, ...parasitic, ...tropical,
  ...upper, ...lower, ...chronic,
  ...upper_gi, ...lower_gi, ...liver, ...pancreas_gallbladder,
  ...heart, ...vascular,
  ...headache, ...central, ...peripheral,
  ...joints, ...bone, ...soft_tissue,
  ...diabetes, ...thyroid, ...adrenal_pituitary,
  ...kidney, ...urological,
  ...infections, ...inflammatory, ...other_skin,
  ...common,
  ...blood,
  ...ear_nose_throat,
  ...eye,
  ...women,
  ...children,
  ...allergy_autoimmune,
  ...red_flags,
]

// ── Dev-time integrity checks ──────────────────────────────────────────────
// Runs once at module load. Never throws — a bad entry just gets logged so
// it can be fixed without taking the whole triage engine down.
const seenIds = new Set()
for (const entry of DISEASE_DB) {
  const problems = validateDiseaseEntry(entry)
  if (problems.length > 0) {
    console.warn(`[diseases] Invalid entry "${entry?.id ?? entry?.name ?? '?'}": ${problems.join('; ')}`)
  }
  if (entry?.id) {
    if (seenIds.has(entry.id)) {
      console.warn(`[diseases] Duplicate disease id "${entry.id}" — check for a copy-paste error.`)
    }
    seenIds.add(entry.id)
  }
}

console.log(`[diseases] Loaded ${DISEASE_DB.length} disease entries across ${seenIds.size} unique ids.`)

export default DISEASE_DB

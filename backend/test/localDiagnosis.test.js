// Verifies the 24 disease entries fixed for the "prose-not-phrase red_flags"
// bug (see backend/utils/diseases/*, and localDiagnosis.js's red-flag safety
// net) actually escalate to urgency: 'emergency' on realistic phrasing of
// the genuine warning sign — and, just as important, do NOT escalate on a
// mild/ordinary version of a related but non-emergency symptom. Each entry
// gets exactly one true-positive and one true-negative case.
import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import localDiagnose from '../utils/localDiagnosis.js'

// entryId is informational (which disease this case targets) — the
// assertion is on urgency, not on which exact entry wins top rank, since
// several near-duplicate entries can legitimately tie/compete for the same
// phrasing (e.g. headache_thunderclap vs redflag_sudden_severe_headache).
const CASES = [
  {
    entryId: 'heart_attack',
    positive: 'crushing chest pain and sweating',
    negative: 'mild chest discomfort after eating spicy food',
  },
  {
    entryId: 'central_stroke_warning',
    positive: 'sudden weakness on one side of my face and slurred speech',
    negative: 'my arm feels a bit tired after the gym',
  },
  {
    entryId: 'central_tia',
    positive: 'I had sudden weakness on one side that went away after a few minutes',
    negative: 'I feel a little tired today',
  },
  {
    entryId: 'central_meningitis_viral',
    positive: 'fever with stiff neck and a bad headache',
    negative: 'mild headache after a long day at work',
  },
  {
    entryId: 'neurological_trigeminal_neuralgia',
    positive: 'sharp facial pain with numbness on one side',
    negative: 'my face feels a little numb after sleeping on it wrong',
  },
  {
    entryId: 'musculoskeletal_septic_arthritis',
    positive: 'fever with a hot swollen joint',
    negative: 'my knee feels stiff after running',
  },
  {
    entryId: 'diabetes_dka',
    positive: 'fruity smelling breath and confusion',
    negative: 'I feel a bit tired and thirsty today',
  },
  {
    entryId: 'aki_warning',
    positive: 'I stopped urinating completely, nothing for hours',
    negative: "I'm urinating a bit less than usual because it's hot outside",
  },
  {
    entryId: 'testicular_torsion_warning',
    positive: 'sudden severe testicle pain',
    negative: "mild testicular discomfort that's been there for a few weeks",
  },
  {
    entryId: 'ent_sudden_hearing_loss',
    positive: 'sudden deafness in my left ear',
    negative: 'my hearing has been gradually getting worse over the years',
  },
  {
    entryId: 'eye_glaucoma_warning',
    positive: 'severe eye pain with halos around lights',
    negative: 'my vision has been slowly getting worse over the past few years',
  },
  {
    entryId: 'eye_retinal_detachment_warning',
    positive: 'sudden curtain-like vision loss',
    negative: 'I occasionally see a few floaters in my vision',
  },
  {
    entryId: 'gynecological_ectopic_pregnancy_warning',
    positive: 'severe shoulder pain with pregnancy and one-sided pelvic pain',
    negative: 'mild cramping during my period',
  },
  {
    entryId: 'preeclampsia_warning',
    positive: 'severe headache with high blood pressure in pregnancy',
    negative: 'mild headache after a stressful day',
  },
  {
    entryId: 'kawasaki_disease_warning',
    positive: 'fever for 5 days with rash in my child',
    negative: 'my child has a mild fever for one day',
  },
  {
    entryId: 'intussusception_warning',
    positive: 'currant jelly stool in my baby',
    negative: 'my baby has slightly loose stool today',
  },
  {
    entryId: 'allergy_food',
    positive: 'throat tightness after eating shrimp',
    negative: 'mild itching after eating strawberries',
  },
  {
    entryId: 'allergy_anaphylaxis',
    positive: 'throat closing after a bee sting',
    negative: 'mild redness at the site of an insect bite',
  },
  {
    entryId: 'parasitic_filariasis',
    positive: 'fever with rapidly worsening leg swelling',
    negative: 'mild leg swelling after standing all day',
  },
  {
    entryId: 'redflag_chest_pain_breathlessness',
    positive: 'chest pain radiating to my arm',
    negative: 'mild chest tightness from anxiety',
  },
  {
    entryId: 'redflag_one_sided_weakness_speech',
    positive: 'one-sided weakness and slurred speech',
    negative: 'my whole body feels weak and tired',
  },
  {
    entryId: 'redflag_high_fever_stiff_neck',
    positive: 'high fever with stiff neck',
    negative: 'mild neck stiffness after sleeping in a weird position',
  },
  {
    entryId: 'redflag_sudden_vision_loss',
    positive: 'suddenly went blind in one eye',
    negative: 'my near vision has gotten worse gradually',
  },
  {
    entryId: 'redflag_severe_abdominal_pain_rigidity',
    positive: 'rigid board-like abdomen',
    negative: 'mild stomach ache after a big meal',
  },
]

describe('localDiagnose — red-flag entries: true positives (real emergency phrasing)', () => {
  for (const c of CASES) {
    test(`${c.entryId}: "${c.positive}" → urgency: emergency`, () => {
      const result = localDiagnose(c.positive)
      assert.equal(
        result.primary.urgency, 'emergency',
        `expected emergency for "${c.positive}" (target: ${c.entryId}), got: ` +
        JSON.stringify({ disease: result.primary.disease, urgency: result.primary.urgency, severity: result.primary.severity }),
      )
    })
  }
})

describe('localDiagnose — red-flag entries: true negatives (mild/ordinary phrasing must NOT escalate)', () => {
  for (const c of CASES) {
    test(`${c.entryId}: "${c.negative}" → urgency !== emergency`, () => {
      const result = localDiagnose(c.negative)
      assert.notEqual(
        result.primary.urgency, 'emergency',
        `expected NOT emergency for "${c.negative}" (guarding against over-broad trigger for ${c.entryId}), got: ` +
        JSON.stringify({ disease: result.primary.disease, urgency: result.primary.urgency, severity: result.primary.severity }),
      )
    })
  }
})

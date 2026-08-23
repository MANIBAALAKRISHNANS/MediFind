import { describe, it, expect, beforeEach } from 'vitest'

import {
  saveAnalysis, updateAnalysis, getHistory, getAnalysis,
  deleteAnalysis, clearHistory,
} from '../services/historyService.js'

const STORAGE_KEY = 'medifind_history'

const diagnosis = {
  disease: 'Migraine',
  specialty: 'neurologist',
  severity: 'moderate',
  urgency: 'see-doctor-soon',
  description: 'Recurring headache with visual aura.',
  recommendations: ['Rest in a dark room'],
  redFlags: [],
}

describe('historyService', () => {
  beforeEach(() => {
    clearHistory()
  })

  it('saveAnalysis persists an entry to localStorage and returns it', () => {
    const entry = saveAnalysis({ symptoms: 'headache with aura', diagnosis })

    expect(entry.id).toBeTruthy()
    expect(entry.disease).toBe('Migraine')
    expect(entry.symptoms).toBe('headache with aura')

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(entry.id)
  })

  it('getHistory returns saved entries, most recent first', () => {
    saveAnalysis({ symptoms: 'first symptom', diagnosis })
    saveAnalysis({ symptoms: 'second symptom', diagnosis })

    const history = getHistory()
    expect(history).toHaveLength(2)
    expect(history[0].symptoms).toBe('second symptom')
    expect(history[1].symptoms).toBe('first symptom')
  })

  it('updateAnalysis patches an existing entry and persists the change', () => {
    const entry = saveAnalysis({ symptoms: 'headache', diagnosis })

    const updated = updateAnalysis(entry.id, { severity: 'severe' })
    expect(updated.severity).toBe('severe')

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored[0].severity).toBe('severe')
  })

  it('updateAnalysis returns null for an unknown id', () => {
    expect(updateAnalysis('does-not-exist', { severity: 'severe' })).toBeNull()
  })

  it('getAnalysis resolves a saved entry by id and rejects for an unknown one', async () => {
    const entry = saveAnalysis({ symptoms: 'headache', diagnosis })

    await expect(getAnalysis(entry.id)).resolves.toMatchObject({ id: entry.id })
    await expect(getAnalysis('nope')).rejects.toThrow(/not found/i)
  })

  it('deleteAnalysis removes the entry from both memory and localStorage', async () => {
    const entry = saveAnalysis({ symptoms: 'headache', diagnosis })
    await deleteAnalysis(entry.id)

    expect(getHistory()).toHaveLength(0)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(0)
  })

  it('clearHistory empties both the in-memory cache and localStorage', () => {
    saveAnalysis({ symptoms: 'headache', diagnosis })
    clearHistory()

    expect(getHistory()).toHaveLength(0)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

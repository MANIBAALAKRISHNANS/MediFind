import { describe, it, expect, beforeEach, vi } from 'vitest'
import { toast } from 'react-hot-toast'

import {
  saveAnalysis, updateAnalysis, getHistory, getAnalysis,
  deleteAnalysis, clearHistory, getHistoryCount,
} from '../services/historyService.js'

vi.mock('react-hot-toast', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }))

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
    toast.mockClear()
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

  it('getHistoryCount reflects the number of stored entries', () => {
    expect(getHistoryCount()).toBe(0)
    saveAnalysis({ symptoms: 'headache one', diagnosis })
    saveAnalysis({ symptoms: 'headache two', diagnosis })
    expect(getHistoryCount()).toBe(2)
  })

  it('caps at 50 entries and shows a one-time archive toast on the entry that overflows the cap', () => {
    for (let i = 0; i < 50; i++) saveAnalysis({ symptoms: `symptom ${i}`, diagnosis })
    expect(getHistoryCount()).toBe(50)
    expect(toast).not.toHaveBeenCalled()

    // The 51st save evicts the oldest entry and should fire the notice.
    saveAnalysis({ symptoms: 'symptom 50 (overflow)', diagnosis })
    expect(getHistoryCount()).toBe(50)
    expect(toast).toHaveBeenCalledTimes(1)
    expect(toast).toHaveBeenCalledWith(
      'Older entries have been archived. Sign in to keep full history.',
      expect.objectContaining({ icon: expect.any(String) }),
    )

    // Further overflow saves must NOT show the toast again ("one-time").
    saveAnalysis({ symptoms: 'symptom 51 (overflow)', diagnosis })
    saveAnalysis({ symptoms: 'symptom 52 (overflow)', diagnosis })
    expect(toast).toHaveBeenCalledTimes(1)
    expect(getHistoryCount()).toBe(50)
  })

  it('the oldest entry is the one actually evicted when the cap overflows', () => {
    for (let i = 0; i < 50; i++) saveAnalysis({ symptoms: `symptom ${i}`, diagnosis })
    saveAnalysis({ symptoms: 'newest overflow entry', diagnosis })

    const history = getHistory()
    expect(history).toHaveLength(50)
    expect(history[0].symptoms).toBe('newest overflow entry')          // most recent, kept
    expect(history.some((e) => e.symptoms === 'symptom 0')).toBe(false) // oldest, evicted
    expect(history.some((e) => e.symptoms === 'symptom 1')).toBe(true) // next-oldest, still kept
  })
})

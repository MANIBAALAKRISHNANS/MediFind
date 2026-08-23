const STORAGE_KEY = 'medifind_history'
const MAX_ENTRIES = 50

// ── In-memory cache — avoids JSON.parse on every operation ───────────────────
let _cache = null     // null means "not loaded yet"
let _index = null     // Map<id, entry> for O(1) lookup

function ensureLoaded() {
  if (_cache !== null) return
  try {
    _cache = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    _cache = []
  }
  _index = new Map(_cache.map(e => [e.id, e]))
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(_cache))
}

// Invalidate if another tab writes to localStorage
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) { _cache = null; _index = null }
  })
}

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function flattenFacility(facility) {
  if (!facility) return {}
  const sb = facility.scoreBreakdown ?? {}
  return {
    matchName:              facility.name          ?? null,
    matchAddress:           facility.address       ?? null,
    matchPhone:             facility.phone         ?? null,
    matchWebsite:           facility.website       ?? null,
    matchType:              facility.type          ?? null,
    matchDistanceKm:        facility.distanceKm    ?? null,
    matchLat:               facility.lat           ?? null,
    matchLng:               facility.lng           ?? null,
    matchOsmMapUrl:         facility.osmMapUrl     ?? null,
    matchScore:             facility.matchScore    ?? null,
    matchDirectionsUrl:     facility.directionsUrl ?? null,
    matchSpecialtyScore:    sb.specialtyScore      ?? null,
    matchDistanceScore:     sb.distanceScore       ?? null,
    matchTypeScore:         sb.typeScore           ?? null,
    matchCompletenessScore: sb.completenessScore   ?? null,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function saveAnalysis({ symptoms, diagnosis, facility = null }) {
  ensureLoaded()

  const entry = {
    id:              generateId(),
    createdAt:       new Date().toISOString(),
    symptoms,
    disease:         diagnosis?.disease         ?? 'Unknown condition',
    specialty:       diagnosis?.specialty       ?? '',
    severity:        diagnosis?.severity        ?? 'mild',
    urgency:         diagnosis?.urgency         ?? 'see-doctor-soon',
    description:     diagnosis?.description     ?? '',
    recommendations: diagnosis?.recommendations ?? [],
    redFlags:        diagnosis?.redFlags        ?? [],
    ...flattenFacility(facility),
  }

  _cache.unshift(entry)
  if (_cache.length > MAX_ENTRIES) _cache.length = MAX_ENTRIES
  _index.set(entry.id, entry)
  persist()
  return entry
}

export function updateAnalysis(id, patch) {
  ensureLoaded()

  const entry = _index.get(id)
  if (!entry) return null

  const { facility, ...rest } = patch
  Object.assign(entry, rest, flattenFacility(facility ?? null))
  persist()
  return entry
}

export function getHistory(_page, _limit) {
  ensureLoaded()
  return _cache
}

export async function getAnalysis(id) {
  ensureLoaded()
  const entry = _index.get(id)
  if (!entry) throw new Error('Analysis not found in local history.')
  return entry
}

export async function deleteAnalysis(id) {
  ensureLoaded()
  _cache = _cache.filter(e => e.id !== id)
  _index.delete(id)
  persist()
}

export function clearHistory() {
  _cache = []
  _index = new Map()
  localStorage.removeItem(STORAGE_KEY)
}

export async function downloadReport(_id) {
  throw new Error(
    'PDF reports require the MediFind server to be running. ' +
    'Please check your connection and try again.'
  )
}

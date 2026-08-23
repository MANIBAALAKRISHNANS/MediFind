// Extracts how long the user has had their symptoms from free text, e.g.
// "fever for 2 days", "cough since last week", "pain for 3 months".
// Used by the scoring engine to award a bonus when the reported duration
// fits a disease's typical course (see diseases/_schema.js duration_patterns).

const UNIT_TO_DAYS = {
  hour: 1 / 24, hours: 1 / 24, hr: 1 / 24, hrs: 1 / 24,
  day: 1, days: 1,
  week: 7, weeks: 7,
  month: 30, months: 30,
  year: 365, years: 365,
}

// "for 2 days", "since 3 weeks", "past 5 days", "last 2 months"
const RELATIVE_COUNT_RE =
  /\b(?:for|since|past|last|over the last)\s+(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten)\s+(hour|hours|hr|hrs|day|days|week|weeks|month|months|year|years)\b/i

// "2 days ago", "3 weeks back"
const AGO_RE =
  /\b(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten)\s+(hour|hours|hr|hrs|day|days|week|weeks|month|months|year|years)\s+(?:ago|back)\b/i

const WORD_NUMBERS = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
}

// Fixed relative phrases → approximate days
const NAMED_PHRASES = [
  [/\bsince\s+yesterday\b/i, 1],
  [/\bsince\s+this\s+morning\b/i, 0.5],
  [/\bsince\s+last\s+night\b/i, 0.5],
  [/\bsince\s+last\s+week\b/i, 7],
  [/\bsince\s+last\s+month\b/i, 30],
  [/\btoday\s+only\b/i, 0.5],
  [/\bjust\s+started\b/i, 0.5],
  [/\bsuddenly\b/i, 0.5],
  [/\bchronic\b/i, 60],
  [/\blong[\s-]?standing\b/i, 90],
  [/\bfor\s+a\s+long\s+time\b/i, 60],
]

function toNumber(raw) {
  const lower = raw.toLowerCase()
  if (WORD_NUMBERS[lower] != null) return WORD_NUMBERS[lower]
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? n : null
}

/**
 * @param {string} text — raw or normalised symptom text
 * @returns {{ raw: string|null, days: number|null, category: 'acute'|'subacute'|'chronic'|null }}
 */
export function parseDuration(text) {
  const source = String(text ?? '')

  let match = source.match(RELATIVE_COUNT_RE) || source.match(AGO_RE)
  if (match) {
    const count = toNumber(match[1])
    const unit = match[2].toLowerCase()
    const days = count != null ? count * (UNIT_TO_DAYS[unit] ?? 1) : null
    return { raw: match[0], days, category: categorize(days) }
  }

  for (const [re, days] of NAMED_PHRASES) {
    const found = source.match(re)
    if (found) {
      return { raw: found[0], days, category: categorize(days) }
    }
  }

  return { raw: null, days: null, category: null }
}

function categorize(days) {
  if (days == null) return null
  if (days < 7) return 'acute'
  if (days <= 14) return 'subacute'
  return 'chronic'
}

/**
 * Checks whether a parsed duration fits a disease's duration_patterns.
 * Pattern strings look like "< 7 days", "5-7 days", "> 14 days suggests complications".
 */
export function durationFitsPattern(parsedDuration, durationPatterns) {
  if (!parsedDuration || parsedDuration.days == null || !durationPatterns) return false
  const { days, category } = parsedDuration

  const rangeMatch = String(durationPatterns.typical ?? '').match(/(\d+)\s*-\s*(\d+)/)
  if (rangeMatch) {
    const [, lo, hi] = rangeMatch
    if (days >= Number(lo) && days <= Number(hi)) return true
  }

  const acuteText = String(durationPatterns.acute ?? '')
  if (/<\s*(\d+)/.test(acuteText) && category === 'acute') return true

  const chronicText = String(durationPatterns.chronic ?? '')
  if (/>\s*(\d+)/.test(chronicText) && category === 'chronic') return true

  return false
}

export default { parseDuration, durationFitsPattern }

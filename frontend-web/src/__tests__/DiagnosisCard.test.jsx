import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import DiagnosisCard from '../components/DiagnosisCard.jsx'

const baseDiagnosis = {
  disease: 'Tension Headache',
  specialty: 'general physician',
  severity: 'mild',
  urgency: 'self-care',
  description: 'A common, non-dangerous headache pattern.',
  recommendations: ['Rest in a quiet, dark room', 'Stay hydrated'],
  redFlags: [],
}

describe('DiagnosisCard', () => {
  it('displays the disease name and capitalised severity badge', () => {
    render(<DiagnosisCard diagnosis={baseDiagnosis} onFindDoctor={vi.fn()} onReset={vi.fn()} />)

    expect(screen.getByText('Tension Headache')).toBeInTheDocument()
    expect(screen.getByText('Mild')).toBeInTheDocument()
  })

  it('renders the recommended specialty and description', () => {
    render(<DiagnosisCard diagnosis={baseDiagnosis} onFindDoctor={vi.fn()} onReset={vi.fn()} />)

    expect(screen.getByText('general physician')).toBeInTheDocument()
    expect(screen.getByText(baseDiagnosis.description)).toBeInTheDocument()
  })

  it('lists each recommendation', () => {
    render(<DiagnosisCard diagnosis={baseDiagnosis} onFindDoctor={vi.fn()} onReset={vi.fn()} />)

    for (const rec of baseDiagnosis.recommendations) {
      expect(screen.getByText(rec)).toBeInTheDocument()
    }
  })

  it('shows the emergency banner instead of the ordinary urgency pill when urgency is emergency', () => {
    const emergencyDiagnosis = { ...baseDiagnosis, urgency: 'emergency', severity: 'severe' }
    render(<DiagnosisCard diagnosis={emergencyDiagnosis} onFindDoctor={vi.fn()} onReset={vi.fn()} />)

    // The ordinary urgency pill label should NOT be present for the emergency path
    expect(screen.queryByText('Self-care — manageable at home')).not.toBeInTheDocument()
    expect(screen.getByText('Tension Headache')).toBeInTheDocument()
    expect(screen.getByText('Severe')).toBeInTheDocument()
  })

  it('shows the ordinary urgency pill for a non-emergency urgency', () => {
    render(<DiagnosisCard diagnosis={baseDiagnosis} onFindDoctor={vi.fn()} onReset={vi.fn()} />)
    expect(screen.getByText('Self-care — manageable at home')).toBeInTheDocument()
  })
})

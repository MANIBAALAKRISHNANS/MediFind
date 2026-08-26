import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SymptomInput from '../components/SymptomInput.jsx'

describe('SymptomInput', () => {
  it('renders the heading, disclaimer, and textarea', () => {
    render(<SymptomInput onSubmit={vi.fn()} />)

    expect(screen.getByText('How are you feeling?')).toBeInTheDocument()
    expect(screen.getByLabelText('Medical disclaimer')).toBeInTheDocument()
    expect(screen.getByLabelText('Symptom description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analyze symptoms/i })).toBeInTheDocument()
  })

  // The minimum was 10 characters until the backend dropped its own floor to 3
  // — see MIN in SymptomInput.jsx. 'short' (5 chars) is now a submittable
  // input, so the boundary moved down with the limit rather than away.
  it('submit button is disabled until at least 3 characters are entered', async () => {
    const user = userEvent.setup()
    render(<SymptomInput onSubmit={vi.fn()} />)

    const button = screen.getByRole('button', { name: /analyze symptoms/i })
    expect(button).toBeDisabled()

    await user.type(screen.getByLabelText('Symptom description'), 'ab')
    expect(button).toBeDisabled()

    await user.type(screen.getByLabelText('Symptom description'), 'c')
    expect(button).toBeEnabled()
  })

  // The single-word complaints the old 10-character floor rejected outright.
  it('accepts a single-word symptom like "headache" or "rash"', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SymptomInput onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Symptom description'), 'headache')
    const button = screen.getByRole('button', { name: /analyze symptoms/i })
    expect(button).toBeEnabled()

    await user.click(button)
    expect(onSubmit).toHaveBeenCalledWith('headache')
  })

  it('calls onSubmit with the trimmed symptom text when clicked', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SymptomInput onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Symptom description'), '  fever and headache for two days  ')
    await user.click(screen.getByRole('button', { name: /analyze symptoms/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith('fever and headache for two days')
  })

  it('clicking a quick-symptom chip appends it to the textarea', async () => {
    const user = userEvent.setup()
    render(<SymptomInput onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Fever' }))
    await user.click(screen.getByRole('button', { name: 'Headache' }))

    expect(screen.getByLabelText('Symptom description')).toHaveValue('Fever Headache')
  })

  it('shows an inline error banner when the error prop is set', () => {
    render(<SymptomInput onSubmit={vi.fn()} error="Something went wrong." />)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })
})

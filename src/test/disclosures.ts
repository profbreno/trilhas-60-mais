import { screen } from '@testing-library/react'
import type userEvent from '@testing-library/user-event'

export async function openPracticeOptions(user: ReturnType<typeof userEvent.setup>) {
  const summary = screen.getByText('Opções da prática', { selector: 'summary' })
  if (!summary.parentElement?.hasAttribute('open')) await user.click(summary)
}

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SignOutButton } from '@/components/admin/SignOutButton'

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}))

describe('SignOutButton', () => {
  it('renders the sign out button correctly', () => {
    render(<SignOutButton />)
    expect(screen.getByText('تسجيل الخروج')).toBeInTheDocument()
  })
})

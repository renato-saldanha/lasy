import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock do Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { email: 'test@test.com' } } })),
      signOut: jest.fn(),
    },
  },
}));

describe('Header Component', () => {
  it('renders the CRM title', () => {
    render(<Header />);
    expect(screen.getByText('CRM')).toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(<Header />);
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });
});


import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/app/(auth)/register/page';

// Mock do next/navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock do Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

import { supabase } from '@/lib/supabase';
const mockSignUp = (supabase.auth.signUp as jest.Mock);

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form', () => {
    render(<RegisterPage />);
    
    expect(screen.getByRole('heading', { name: /criar conta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^e-mail$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('validates password match', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/^e-mail$/i), 'test@test.com');
    await user.type(screen.getAllByPlaceholderText(/••••••••/i)[0], 'password123');
    await user.type(screen.getAllByPlaceholderText(/••••••••/i)[1], 'different');
    
    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/senhas não coincidem/i)).toBeInTheDocument();
    });
  });

  it('validates password length', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/^e-mail$/i), 'test@test.com');
    await user.type(screen.getAllByPlaceholderText(/••••••••/i)[0], '12345');
    await user.type(screen.getByLabelText(/confirmar senha/i), '12345');
    
    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/senha deve ter pelo menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('creates account successfully', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: 'user-id' } },
      error: null,
    });

    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/^e-mail$/i), 'test@test.com');
    await user.type(screen.getAllByPlaceholderText(/••••••••/i)[0], 'password123');
    await user.type(screen.getAllByPlaceholderText(/••••••••/i)[1], 'password123');
    
    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});


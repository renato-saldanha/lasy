import { render, screen } from '@testing-library/react';
import KanbanBoard from '@/components/KanbanBoard';
import { Lead } from '@/types';

jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}));

const baseLead = {
  telefone: '',
  empresa: '',
  observacoes: '',
  origem: '',
  user_id: 'u1',
  created_at: '2026-10-01T10:00:00.000Z',
  updated_at: '2026-10-01T10:00:00.000Z',
};

const leads: Lead[] = [
  { ...baseLead, id: '1', nome: 'Ana Souza', email: 'ana@exemplo.test', status: 'novo' },
  { ...baseLead, id: '2', nome: 'Bruno Lima', email: 'bruno@exemplo.test', status: 'contato' },
  { ...baseLead, id: '3', nome: 'Carla Dias', email: 'carla@exemplo.test', status: 'novo' },
];

describe('KanbanBoard', () => {
  it('mostra as colunas e distribui os leads pelo status', () => {
    render(<KanbanBoard leads={leads} onUpdate={jest.fn()} />);

    expect(screen.getByText('Novo')).toBeInTheDocument();
    expect(screen.getByText('Em Contato')).toBeInTheDocument();
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.getByText('Bruno Lima')).toBeInTheDocument();
    expect(screen.getByText('Carla Dias')).toBeInTheDocument();
  });
});

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string | null;
  observacoes: string | null;
  status: 'novo' | 'contato' | 'qualificado' | 'proposta' | 'fechado' | 'perdido';
  origem: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Interaction {
  id: string;
  lead_id: string;
  tipo: 'email' | 'telefone' | 'reuniao' | 'observacao' | 'outro';
  descricao: string;
  data: string;
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
}


# Instruções de Configuração

## Configuração do Supabase

### 1. Executar a Migration do Banco de Dados

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `supabase/migrations.sql`
6. Clique em **Run** para executar a migration

### 2. Verificar as Tabelas

Após executar a migration, você deve ter as seguintes tabelas:
- `leads` - Tabela de leads
- `interactions` - Tabela de interações

### 3. Verificar as Políticas RLS

As políticas de Row Level Security (RLS) já estão configuradas na migration:
- Usuários só podem ver/editar seus próprios leads
- Usuários só podem ver/editar suas próprias interações

### 4. Criar um Usuário de Teste

1. Acesse **Authentication** no Supabase Dashboard
2. Clique em **Users**
3. Clique em **Add User**
4. Crie um usuário com email e senha
5. Use essas credenciais para fazer login no CRM

### 5. Executar o Projeto

```bash
npm run dev
```

Acesse http://localhost:3000 e faça login com o usuário criado.

## Variáveis de Ambiente

O arquivo `.env.local` já está configurado com:
- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave pública do Supabase

## Testes

Execute os testes:
```bash
npm test
```

Todos os testes devem passar.

## Build para Produção

```bash
npm run build
npm start
```


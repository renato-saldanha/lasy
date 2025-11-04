# CRM - Sistema de Gestão de Leads

Sistema completo de gestão de leads com pipeline Kanban, desenvolvido com Next.js, React, TypeScript e Tailwind CSS 4.

## 🚀 Funcionalidades

- ✅ Autenticação JWT com Supabase
- ✅ Pipeline Kanban com drag & drop
- ✅ Inserção manual de leads
- ✅ Importação de leads via CSV/Excel
- ✅ Busca e filtros avançados
- ✅ Exportação de dados em planilha (CSV/Excel)
- ✅ Tela de detalhes do lead com histórico de interações
- ✅ Interface responsiva (mobile e desktop)
- ✅ Validações e máscaras de campo
- ✅ Testes automatizados com Jest e React Testing Library

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Supabase** - Backend e autenticação
- **@dnd-kit** - Drag and drop
- **date-fns** - Manipulação de datas
- **papaparse** - Parse de CSV
- **xlsx** - Manipulação de Excel
- **Jest** - Framework de testes
- **React Testing Library** - Testes de componentes

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (já configurada)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd lasy
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
O arquivo `.env.local` já está configurado com as credenciais do Supabase.

4. Execute a migration do banco de dados:
Acesse o Supabase Dashboard e execute o SQL em `supabase/migrations.sql` no SQL Editor.

5. Execute o projeto:
```bash
npm run dev
```

6. Acesse no navegador:
```
http://localhost:3000
```

## 🧪 Testes

Execute os testes:
```bash
npm test
```

Execute os testes em modo watch:
```bash
npm run test:watch
```

Execute os testes com cobertura:
```bash
npm run test:coverage
```

## 📁 Estrutura do Projeto

```
lasy/
├── app/
│   ├── (auth)/          # Rotas de autenticação
│   │   ├── login/
│   │   └── register/
│   └── dashboard/       # Dashboard principal
│       ├── leads/[id]/  # Detalhes do lead
│       └── page.tsx
├── components/          # Componentes React
│   ├── Header.tsx
│   ├── KanbanBoard.tsx
│   ├── LeadForm.tsx
│   ├── SearchAndFilters.tsx
│   └── ...
├── lib/
│   └── supabase.ts      # Cliente Supabase
├── types/
│   └── index.ts         # Tipos TypeScript
├── supabase/
│   └── migrations.sql   # Migrations do banco
└── __tests__/           # Testes
```

## 🎨 Paleta de Cores

- `#222651` - Primary (azul escuro)
- `#0078b7` - Secondary (azul)
- `#00b4d8` - Accent (azul claro)
- `#97d4e5` - Light (azul muito claro)
- `#cc39f3` - Purple (roxo)

## 📝 Funcionalidades Detalhadas

### Autenticação
- Login e registro de usuários
- Proteção de rotas com JWT
- Sessão persistente

### Pipeline Kanban
- 6 estágios: Novo, Em Contato, Qualificado, Proposta, Fechado, Perdido
- Drag & drop para mover leads entre estágios
- Visualização por colunas

### Gestão de Leads
- Criar, editar e excluir leads
- Campos: nome, email, telefone, empresa, observações, status, origem
- Validações em todos os campos
- Máscara de telefone brasileiro

### Importação/Exportação
- Importar leads via CSV ou Excel
- Exportar dados em CSV ou Excel
- Validação de dados na importação

### Busca e Filtros
- Busca por nome, email, telefone ou empresa
- Filtro por status
- Filtro por data

### Histórico de Interações
- Registrar interações com leads
- Tipos: E-mail, Telefone, Reunião, Observação, Outro
- Histórico completo por lead

## 🚀 Build para Produção

```bash
npm run build
npm start
```

## 📄 Licença

Este projeto é privado.

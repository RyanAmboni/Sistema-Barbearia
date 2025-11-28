# Sistema Barbearia

Aplicação completa (frontend + backend) para gerenciamento de barbearias, com cadastro de usuários, serviços e agendamentos.

## Stack

- **Frontend**: React 19 com Vite, React Toastify para feedbacks e proxy local apontando para `/api`.
- **Backend**: Node.js + Express, autenticação via Supabase Auth
- **Banco de dados**: Supabase (PostgreSQL gerenciado)
- **Autenticação**: Supabase Auth com Row Level Security (RLS)

## Requisitos

- Node.js 18+
- Conta no Supabase (gratuita em https://supabase.com)

## Configuração

### 1. Configurar Supabase

1. Crie um projeto em https://supabase.com
2. No Dashboard do Supabase, vá em **SQL Editor**
3. Execute o arquivo `backend/supabase-schema.sql` para criar todas as tabelas, políticas RLS e funções necessárias
4. Anote as chaves do projeto:
   - **SUPABASE_URL**: Settings → API → Project URL
   - **SUPABASE_ANON_KEY**: Settings → API → anon/public key
   - **SUPABASE_SERVICE_ROLE_KEY**: Settings → API → service_role key ⚠️ **NUNCA exponha esta chave no frontend!**

### 2. Backend

```bash
cd backend
npm install
```

1. Crie um arquivo `.env` na pasta `backend/`:

```env
PORT=3001
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

2. Inicie o servidor:

```bash
npm run dev
```

O backend responde em `http://localhost:3001` e expõe as rotas sob `/api/*`.

### 3. Frontend

```bash
cd frontend
npm install
```

1. Crie um arquivo `.env` na pasta `frontend/`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
VITE_API_URL=http://localhost:3001
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Durante o desenvolvimento o Vite já faz proxy de `/api` para `http://localhost:3001`.  
Para build/produção, informe a URL do backend com `VITE_API_URL` (ex.: `VITE_API_URL=https://sua-api.com`).

## Documentação Adicional

- **Configuração detalhada do Supabase**: Veja `SUPABASE_SETUP.md`
- **Schema SQL**: Execute `backend/supabase-schema.sql` no SQL Editor do Supabase

## Observações

- O Supabase gerencia autenticação, banco de dados e Row Level Security (RLS)
- As políticas RLS garantem que usuários só vejam/modifiquem seus próprios dados
- Barbeiros têm permissões especiais para ver todos os agendamentos
- O frontend pode usar a API REST do backend ou o Supabase diretamente (veja `frontend/src/lib/supabaseApi.js`)

## Migração do PostgreSQL tradicional

Se você estava usando PostgreSQL tradicional, a migração para Supabase foi feita mantendo a mesma interface de API. As principais mudanças:

- ✅ Autenticação agora usa Supabase Auth (mais seguro)
- ✅ Queries SQL foram adaptadas para usar a API do Supabase
- ✅ Row Level Security (RLS) habilitado por padrão
- ✅ UUIDs em vez de SERIAL para IDs (mais seguro e escalável)

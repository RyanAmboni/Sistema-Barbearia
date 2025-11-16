# Sistema Barbearia

Aplicação completa (frontend + backend) para gerenciamento de barbearias, com cadastro de usuários, serviços e agendamentos.

## Stack

- **Frontend**: React 19 com Vite, React Toastify para feedbacks e proxy local apontando para `/api`.
- **Backend**: Node.js + Express, autenticação JWT e consultas SQL simples usando o driver `pg`.
- **Banco de dados**: PostgreSQL

## Requisitos

- Node.js 18+
- PostgreSQL 13+ (local ou hospedado)

## Configuração

### Backend

```bash
cd backend
npm install
```

1. Copie `backend/.env` e ajuste conforme o seu ambiente:

```
PORT=3001
JWT_SECRET=sua_chave_segura
# Use DATABASE_URL OU os campos detalhados abaixo
DATABASE_URL=postgres://usuario:senha@localhost:5432/sistema_barbearia
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_barbearia
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false
```

2. Inicie o servidor:

```bash
npm run dev
```

O backend responde em `http://localhost:3001` e expõe as rotas sob `/api/*`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Durante o desenvolvimento o Vite já faz proxy de `/api` para `http://localhost:3001`.  
Para build/produção, informe a URL do backend com `VITE_API_URL` (ex.: `VITE_API_URL=https://sua-api.com`).

## Observações

- As tabelas precisam existir previamente (use o script abaixo como referência).
- Se usar um banco gerenciado que exige SSL, defina `DB_SSL=true`.
- Sempre rode `npm install` após mudanças nas dependências do backend para atualizar o `package-lock.json`.

### Estrutura sugerida

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

# 🚀 Como Rodar o Projeto Localmente

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase configurada
- Arquivos `.env` configurados (veja abaixo)

## Passo a Passo

### 1️⃣ Verificar Configuração do Supabase

Certifique-se de que:

- ✅ O schema SQL foi executado no Supabase (`backend/supabase-schema.sql`)
- ✅ Você tem as chaves do Supabase:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 2️⃣ Configurar Variáveis de Ambiente

#### Backend (`backend/.env`)

```env
PORT=3001
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

#### Frontend (`frontend/.env`)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
VITE_API_URL=http://localhost:3001
```

### 3️⃣ Instalar Dependências (se necessário)

Se as dependências não estiverem instaladas:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4️⃣ Rodar o Projeto

**Opção 1: Rodar em terminais separados (Recomendado)**

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

O backend estará rodando em `http://localhost:3001`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

O frontend estará rodando em `http://localhost:5173` (ou outra porta que o Vite indicar)

---

**Opção 2: Rodar tudo de uma vez (Windows PowerShell)**

```powershell
# Rodar backend em background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Aguardar um pouco e rodar frontend
Start-Sleep -Seconds 3
cd frontend
npm run dev
```

---

## ✅ Verificação

1. **Backend**: Acesse `http://localhost:3001` - deve retornar `{"ok": true, "message": "Sistema Barbearia API"}`
2. **Frontend**: Acesse a URL mostrada no terminal (geralmente `http://localhost:5173`)

## 🔧 Troubleshooting

- **Erro de conexão com Supabase**: Verifique se as variáveis de ambiente estão corretas
- **Porta já em uso**: Altere a `PORT` no `.env` do backend ou feche o processo que está usando a porta
- **CORS errors**: O backend já tem CORS habilitado, mas verifique se o frontend está apontando para a URL correta

## 📝 Notas

- O Vite já está configurado para fazer proxy de `/api` para `http://localhost:3001`
- Durante desenvolvimento, o frontend se conecta ao backend local automaticamente
- Para produção, configure `VITE_API_URL` com a URL do seu backend em produção

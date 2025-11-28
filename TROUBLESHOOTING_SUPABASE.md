# Troubleshooting - Erro ao Criar Conta no Supabase

## Problema: "Error creating user"

Este erro geralmente ocorre quando há problemas na conexão ou configuração do Supabase.

## ✅ Checklist de Verificação

### 1. Verificar Variáveis de Ambiente na Vercel

Acesse seu projeto na Vercel → **Settings → Environment Variables** e verifique se TODAS estas variáveis estão configuradas:

#### Backend (obrigatórias):
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

#### Frontend (obrigatórias):
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

**⚠️ IMPORTANTE:**
- As variáveis devem estar disponíveis para **Production**, **Preview** e **Development**
- Após adicionar/alterar variáveis, faça um **novo deploy**

### 2. Como Obter as Chaves do Supabase

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings → API**
4. Copie:
   - **Project URL** → use para `SUPABASE_URL` e `VITE_SUPABASE_URL`
   - **service_role key** (secret) → use para `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NÃO use a anon key aqui!)
   - **anon public key** → use para `VITE_SUPABASE_ANON_KEY`

### 3. Verificar Logs na Vercel

1. Acesse seu projeto na Vercel
2. Vá em **Deployments** → clique no último deploy
3. Abra a aba **Functions** → clique na função que deu erro
4. Veja os logs para identificar o erro específico

### 4. Verificar Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Tente criar uma conta novamente
4. Veja se há erros detalhados no console

### 5. Verificar Tabela `users` no Supabase

1. Acesse https://app.supabase.com
2. Vá em **Table Editor**
3. Verifique se a tabela `users` existe
4. Verifique se as colunas estão corretas:
   - `id` (uuid, primary key)
   - `name` (text)
   - `email` (text, unique)
   - `role` (text)

### 6. Verificar RLS (Row Level Security)

1. Acesse https://app.supabase.com
2. Vá em **Authentication → Policies**
3. Verifique se há políticas que bloqueiam a criação de usuários
4. Para a tabela `users`, certifique-se de que há uma política que permite INSERT

### 7. Testar Conexão Manualmente

Você pode testar a API diretamente usando curl ou Postman:

```bash
curl -X POST https://seu-projeto.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

## 🔧 Soluções Comuns

### Erro: "Missing Supabase environment variables"
**Solução:** Adicione todas as variáveis de ambiente na Vercel e faça um novo deploy.

### Erro: "Email already in use"
**Solução:** O email já está cadastrado. Use outro email ou faça login.

### Erro: "Error creating user" (genérico)
**Solução:** 
1. Verifique os logs na Vercel para ver o erro específico
2. Verifique se a Service Role Key está correta (não use a anon key)
3. Verifique se a URL do Supabase está correta (sem barra no final)

### Erro: "Error creating user profile"
**Solução:**
1. Verifique se a tabela `users` existe no Supabase
2. Verifique se as políticas RLS permitem INSERT
3. Verifique se o usuário foi criado no Auth mas falhou ao criar o perfil

## 📝 Após Corrigir

1. Faça um novo deploy na Vercel
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Tente criar a conta novamente
4. Verifique os logs se ainda houver erro

## 🆘 Ainda com Problemas?

Se após seguir todos os passos o problema persistir:

1. Copie os logs completos da Vercel
2. Copie os erros do console do navegador
3. Verifique se todas as variáveis estão corretas
4. Teste a API diretamente (curl/Postman)


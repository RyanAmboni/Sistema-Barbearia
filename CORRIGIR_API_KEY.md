# 🔧 Como Corrigir o Erro "Invalid API key"

## ❌ Erro Identificado
```
AuthApiError: Invalid API key (status: 401)
```

Este erro ocorre porque a `SUPABASE_SERVICE_ROLE_KEY` está incorreta ou não está configurada na Vercel.

## ✅ Solução Passo a Passo

### 1. Obter a Service Role Key Correta

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** (ícone de engrenagem no menu lateral)
4. Clique em **API** no menu de configurações
5. Role até a seção **Project API keys**
6. Localize a chave **`service_role`** (⚠️ NÃO use a `anon` key!)
7. Clique no ícone de **olho** para revelar a chave
8. Clique em **Copy** para copiar a chave completa

**⚠️ IMPORTANTE:**
- A Service Role Key é uma chave **SECRETA** e **LONGA**
- Ela começa com `eyJ...` e tem várias centenas de caracteres
- NÃO use a chave `anon` (anon public key) - ela não tem permissões de admin

### 2. Configurar na Vercel

1. Acesse seu projeto na Vercel: https://vercel.com
2. Vá em **Settings** → **Environment Variables**
3. Procure pela variável `SUPABASE_SERVICE_ROLE_KEY`
4. Se ela existir:
   - Clique nos **3 pontinhos** ao lado
   - Selecione **Edit**
   - **Delete** a chave antiga
   - Cole a nova chave correta
   - Marque todas as opções: **Production**, **Preview**, **Development**
   - Clique em **Save**
5. Se ela NÃO existir:
   - Clique em **Add New**
   - Nome: `SUPABASE_SERVICE_ROLE_KEY`
   - Valor: Cole a Service Role Key que você copiou
   - Marque todas as opções: **Production**, **Preview**, **Development**
   - Clique em **Save**

### 3. Verificar Outras Variáveis

Certifique-se de que TODAS estas variáveis estão configuradas:

#### Backend:
- `SUPABASE_URL` = URL do seu projeto (ex: `https://xxxxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` = Service Role Key (a chave longa que você copiou)

#### Frontend:
- `VITE_SUPABASE_URL` = Mesma URL do projeto
- `VITE_SUPABASE_ANON_KEY` = Anon public key (a chave pública, não a service_role)

### 4. Fazer Novo Deploy

**⚠️ CRÍTICO:** Após alterar variáveis de ambiente, você DEVE fazer um novo deploy:

1. Na Vercel, vá em **Deployments**
2. Clique nos **3 pontinhos** do último deploy
3. Selecione **Redeploy**
4. Ou faça um novo commit e push para o Git

### 5. Testar Novamente

1. Aguarde o deploy completar
2. Acesse sua aplicação
3. Tente criar uma nova conta
4. Se ainda der erro, verifique os logs novamente

## 🔍 Como Verificar se Está Correto

### Verificar na Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Verifique se `SUPABASE_SERVICE_ROLE_KEY` existe
3. Verifique se está marcada para Production, Preview e Development
4. O valor deve começar com `eyJ` e ser muito longo (centenas de caracteres)

### Verificar nos Logs:
Após o novo deploy, os logs não devem mais mostrar "Invalid API key". Se ainda aparecer:
- A chave pode ter espaços extras (copie novamente)
- A chave pode estar incompleta (certifique-se de copiar tudo)
- Você pode estar usando a anon key ao invés da service_role key

## ⚠️ Erros Comuns

### ❌ Erro: "Invalid API key" continua aparecendo
**Solução:** 
- Certifique-se de que copiou a **service_role** key, não a **anon** key
- Verifique se não há espaços antes ou depois da chave
- Faça um novo deploy após alterar

### ❌ Erro: "Missing Supabase environment variables"
**Solução:**
- Adicione todas as variáveis necessárias
- Marque todas as opções (Production, Preview, Development)
- Faça um novo deploy

### ❌ Erro: Funciona localmente mas não na Vercel
**Solução:**
- Variáveis de ambiente locais (`.env`) não são usadas na Vercel
- Configure todas as variáveis na Vercel
- Faça um novo deploy

## 📝 Checklist Final

- [ ] Service Role Key copiada do Supabase (não a anon key)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada na Vercel
- [ ] `SUPABASE_URL` configurada na Vercel
- [ ] `VITE_SUPABASE_URL` configurada na Vercel
- [ ] `VITE_SUPABASE_ANON_KEY` configurada na Vercel
- [ ] Todas as variáveis marcadas para Production, Preview e Development
- [ ] Novo deploy feito após configurar as variáveis
- [ ] Testado criar uma nova conta


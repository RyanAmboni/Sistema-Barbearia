# Deploy na Vercel - Sistema Barbearia

Este guia explica como fazer o deploy do Sistema Barbearia na Vercel.

## Pré-requisitos

1. Conta na Vercel (gratuita em https://vercel.com)
2. Conta no Supabase com projeto configurado
3. Git repository (GitHub, GitLab ou Bitbucket)

## Estrutura do Projeto

O projeto está configurado como monorepo na Vercel:
- **Frontend**: React + Vite (deploy como site estático)
- **Backend**: Express.js (deploy como serverless function)

## Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que todos os arquivos estão commitados:

```bash
git add .
git commit -m "Preparar para deploy na Vercel"
git push
```

### 2. Conectar o Projeto na Vercel

1. Acesse https://vercel.com e faça login
2. Clique em **"Add New Project"**
3. Importe seu repositório Git
4. A Vercel detectará automaticamente a configuração do `vercel.json`

### 3. Configurar Variáveis de Ambiente

Na Vercel, vá em **Settings → Environment Variables** e adicione:

#### Variáveis do Backend:
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
PORT=3001
```

#### Variáveis do Frontend:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
VITE_API_URL=https://seu-projeto.vercel.app
```

**⚠️ IMPORTANTE**: 
- Substitua `https://seu-projeto.vercel.app` pela URL real do seu projeto na Vercel após o primeiro deploy
- Ou deixe `VITE_API_URL` vazio para usar a mesma origem (recomendado)

### 4. Configurar Build Settings

A Vercel deve detectar automaticamente:
- **Root Directory**: Deixe vazio (raiz do projeto)
- **Build Command**: Será executado automaticamente pelo `vercel.json`
- **Output Directory**: `frontend/dist` (para o frontend)

### 5. Fazer o Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar
3. A Vercel fornecerá uma URL do tipo: `https://seu-projeto.vercel.app`

### 6. Atualizar Variáveis de Ambiente (se necessário)

Após o primeiro deploy, se você deixou `VITE_API_URL` vazio, atualize para a URL real:

```
VITE_API_URL=https://seu-projeto.vercel.app
```

E faça um novo deploy.

## Estrutura de Rotas

Após o deploy, as rotas funcionarão assim:

- **Frontend**: `https://seu-projeto.vercel.app/`
- **API Auth**: `https://seu-projeto.vercel.app/api/auth/*`
- **API Users**: `https://seu-projeto.vercel.app/api/users/*`
- **API Services**: `https://seu-projeto.vercel.app/api/services/*`
- **API Appointments**: `https://seu-projeto.vercel.app/api/appointments/*`
- **API KPI**: `https://seu-projeto.vercel.app/api/kpi/*`

## Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se todas as variáveis de ambiente estão configuradas na Vercel
- Certifique-se de que as variáveis estão disponíveis para **Production**, **Preview** e **Development**

### Erro: "Cannot find module"
- Verifique se o `package.json` do backend e frontend estão corretos
- A Vercel instala dependências automaticamente, mas pode ser necessário verificar os scripts de build

### Frontend não carrega
- Verifique se o build do frontend está gerando a pasta `dist/`
- Confirme que o `vite.config.js` está correto

### API retorna 404
- Verifique se o `vercel.json` está na raiz do projeto
- Confirme que as rotas estão configuradas corretamente

## Deploy Automático

A Vercel faz deploy automático sempre que você fizer push para a branch principal. Para outras branches, cria preview deployments.

## Domínio Customizado

1. Vá em **Settings → Domains**
2. Adicione seu domínio customizado
3. Siga as instruções para configurar o DNS

## Monitoramento

- Acesse **Analytics** para ver métricas de uso
- Use **Logs** para debugar problemas em produção
- Configure **Alerts** para ser notificado sobre erros

## Suporte

Para mais informações, consulte:
- [Documentação da Vercel](https://vercel.com/docs)
- [Vercel + Express](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)
- [Vercel + React](https://vercel.com/docs/concepts/deployments/overview)


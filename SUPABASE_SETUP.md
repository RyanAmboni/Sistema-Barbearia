# Configuração do Supabase

## Variáveis de Ambiente Necessárias

### Backend (.env)
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
PORT=3001
```

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
VITE_API_URL=http://localhost:3001
```

## Passos para Configuração

1. **Criar projeto no Supabase**
   - Acesse https://supabase.com
   - Crie um novo projeto
   - Anote a URL do projeto e as chaves (anon key e service role key)

2. **Executar o schema SQL**
   - No Dashboard do Supabase, vá em "SQL Editor"
   - Execute o arquivo `backend/supabase-schema.sql`
   - Isso criará todas as tabelas, políticas RLS e funções necessárias

3. **Configurar variáveis de ambiente**
   - Backend: Crie um arquivo `.env` na pasta `backend/` com as variáveis acima
   - Frontend: Crie um arquivo `.env` na pasta `frontend/` com as variáveis acima

4. **Testar a conexão**
   - Inicie o backend: `cd backend && npm run dev`
   - Inicie o frontend: `cd frontend && npm run dev`
   - Teste o registro e login de usuários

## Onde encontrar as chaves no Supabase

1. **SUPABASE_URL**: Dashboard → Settings → API → Project URL
2. **SUPABASE_ANON_KEY**: Dashboard → Settings → API → anon/public key
3. **SUPABASE_SERVICE_ROLE_KEY**: Dashboard → Settings → API → service_role key (⚠️ NUNCA exponha esta chave no frontend!)

## Notas Importantes

- A **service_role key** tem acesso total ao banco e deve ser usada APENAS no backend
- A **anon key** é segura para usar no frontend (com RLS habilitado)
- As políticas RLS garantem que usuários só vejam/modifiquem seus próprios dados
- Barbeiros têm permissões especiais para ver todos os agendamentos


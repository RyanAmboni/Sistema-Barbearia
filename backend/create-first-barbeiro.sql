-- ============================================
-- Script para criar o primeiro barbeiro
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Primeiro, crie um usuário normal através do endpoint /api/auth/register
-- 2. Copie o ID do usuário criado (você pode encontrar no Supabase Dashboard > Authentication > Users)
-- 3. Execute este script no SQL Editor do Supabase, substituindo USER_ID_AQUI pelo ID do usuário
--
-- Exemplo:
-- UPDATE public.users SET role = 'barbeiro' WHERE id = '123e4567-e89b-12d3-a456-426614174000';
-- ============================================

-- Opção 1: Atualizar um usuário existente para ser barbeiro
-- Substitua 'USER_ID_AQUI' pelo ID do usuário que você quer tornar barbeiro
UPDATE public.users 
SET role = 'barbeiro' 
WHERE id = 'USER_ID_AQUI'::uuid;

-- Opção 2: Verificar se a atualização foi bem-sucedida
SELECT id, name, email, role 
FROM public.users 
WHERE role = 'barbeiro';

-- ============================================
-- ALTERNATIVA: Criar barbeiro diretamente via SQL
-- (Use apenas se você já tiver o ID do auth.users)
-- ============================================
-- 
-- INSERT INTO public.users (id, name, email, role)
-- VALUES (
--   'USER_ID_DO_AUTH_USERS'::uuid,
--   'Nome do Barbeiro',
--   'barbeiro@email.com',
--   'barbeiro'
-- )
-- ON CONFLICT (id) DO UPDATE SET role = 'barbeiro';


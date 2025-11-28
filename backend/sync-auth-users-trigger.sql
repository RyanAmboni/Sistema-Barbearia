-- ============================================
-- Trigger para sincronizar auth.users com public.users
-- ============================================
-- Este trigger cria automaticamente um registro em public.users
-- quando um novo usuário é criado em auth.users
-- Execute este script no SQL Editor do Supabase Dashboard
-- ============================================

-- Função que será executada quando um novo usuário for criado em auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'Usuário'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'cliente')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar o trigger que executa a função quando um novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- IMPORTANTE: Para usuários já criados
-- ============================================
-- Se você já tem usuários em auth.users que não estão em public.users,
-- execute este comando para sincronizá-los:

-- INSERT INTO public.users (id, name, email, role)
-- SELECT 
--   id,
--   COALESCE(raw_user_meta_data->>'name', email, 'Usuário') as name,
--   email,
--   COALESCE(raw_user_meta_data->>'role', 'cliente') as role
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM public.users)
-- ON CONFLICT (id) DO NOTHING;


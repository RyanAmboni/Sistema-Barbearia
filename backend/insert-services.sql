-- ============================================
-- Script SQL para inserir serviços no banco
-- Execute este script no SQL Editor do Supabase Dashboard
-- ============================================

-- Inserir serviços da barbearia
INSERT INTO public.services (name, description, price, duration_minutes) VALUES
  ('Cabelo', 'Corte de cabelo masculino', 40.00, 30),
  ('Barba', 'Aparar e modelar barba', 20.00, 20),
  ('Cabelo + Barba', 'Pacote completo: corte de cabelo e barba', 55.00, 50),
  ('Sombrancelha', 'Design e modelagem de sombrancelha', 15.00, 15),
  ('Cabelo + Sombrancelha', 'Corte de cabelo com design de sombrancelha', 50.00, 45),
  ('Barba + Sombrancelha', 'Aparar barba com design de sombrancelha', 30.00, 35),
  ('Barba + Sombrancelha + Cabelo', 'Pacote completo: cabelo, barba e sombrancelha', 65.00, 60)
ON CONFLICT DO NOTHING;

-- Verificar se os serviços foram inseridos
SELECT id, name, price, duration_minutes 
FROM public.services 
ORDER BY price ASC;


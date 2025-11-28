-- ============================================
-- Script SQL para inserir serviços no banco
-- Execute este script no SQL Editor do Supabase Dashboard
-- ============================================

-- Inserir serviços da barbearia
INSERT INTO public.services (name, description, price, duration_minutes) VALUES
  ('Cabelo', 'Corte de cabelo masculino', 40.00, 30),
  ('Barba', 'Aparar e modelar barba', 20.00, 20),
  ('Cabelo + Barba', 'Pacote completo: corte de cabelo e barba', 55.00, 50),
  ('Sobrancelha', 'Design e modelagem de sobrancelha', 15.00, 15),
  ('Cabelo + Sobrancelha', 'Corte de cabelo com design de sobrancelha', 50.00, 45),
  ('Barba + Sobrancelha', 'Aparar barba com design de sobrancelha', 30.00, 35),
  ('Barba + Sobrancelha + Cabelo', 'Pacote completo: cabelo, barba e sobrancelha', 65.00, 60)
ON CONFLICT DO NOTHING;

-- Verificar se os serviços foram inseridos
SELECT id, name, price, duration_minutes 
FROM public.services 
ORDER BY price ASC;


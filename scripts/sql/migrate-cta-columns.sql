-- =============================================
-- MIGRACIÓN: Agregar campos CTA de producto a posts
-- Ejecutar en SQL Editor de Supabase
-- =============================================
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS cta_product_name TEXT,
  ADD COLUMN IF NOT EXISTS cta_product_url  TEXT,
  ADD COLUMN IF NOT EXISTS cta_product_price TEXT;

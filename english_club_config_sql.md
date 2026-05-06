-- SQL Script pro vytvoření konfigurační tabulky pro English Club

-- 1. Vytvoření tabulky
CREATE TABLE IF NOT EXISTS public.english_club_config (
  id text PRIMARY KEY,
  config jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Nastavení Row Level Security (RLS)
ALTER TABLE public.english_club_config ENABLE ROW LEVEL SECURITY;

-- 3. Povolit čtení (SELECT) komukoliv (anonymním uživatelům na webu)
CREATE POLICY "Povolit čtení všem" 
ON public.english_club_config 
FOR SELECT 
USING (true);

-- 4. Povolit zápis (INSERT) pouze přihlášeným uživatelům
CREATE POLICY "Povolit zápis přihlášeným uživatelům" 
ON public.english_club_config 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 5. Povolit úpravy (UPDATE) pouze přihlášeným uživatelům
CREATE POLICY "Povolit úpravy přihlášeným uživatelům" 
ON public.english_club_config 
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 6. Vložit výchozí data pro ceny
INSERT INTO public.english_club_config (id, config)
VALUES ('prices', '{"club_1": 700, "club_2": 700, "club_3": 700, "club_4": 700}'::jsonb)
ON CONFLICT (id) DO NOTHING;

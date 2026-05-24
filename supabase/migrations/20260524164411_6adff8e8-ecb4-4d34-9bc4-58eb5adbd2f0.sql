CREATE TABLE public.parties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'customer',
  gstin TEXT,
  pan TEXT,
  email TEXT,
  phone TEXT,
  billing_address TEXT,
  state TEXT,
  state_code TEXT,
  place_of_supply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view own parties" ON public.parties
  FOR SELECT USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners insert own parties" ON public.parties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners update own parties" ON public.parties
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners delete own parties" ON public.parties
  FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX idx_parties_owner ON public.parties(owner_id);

CREATE TRIGGER trg_parties_updated_at
  BEFORE UPDATE ON public.parties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
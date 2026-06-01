
-- ============ ACCOUNTING ============
CREATE TABLE public.chart_of_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('asset','liability','equity','income','expense')),
  opening_balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chart_of_accounts TO authenticated;
GRANT ALL ON public.chart_of_accounts TO service_role;
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners all coa" ON public.chart_of_accounts FOR ALL USING (auth.uid()=owner_id OR has_role(auth.uid(),'admin')) WITH CHECK (auth.uid()=owner_id);

CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  entry_no text NOT NULL,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  narration text,
  total_debit numeric NOT NULL DEFAULT 0,
  total_credit numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journal_entries TO authenticated;
GRANT ALL ON public.journal_entries TO service_role;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners all je" ON public.journal_entries FOR ALL USING (auth.uid()=owner_id OR has_role(auth.uid(),'admin')) WITH CHECK (auth.uid()=owner_id);

CREATE TABLE public.journal_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  account_id uuid NOT NULL REFERENCES public.chart_of_accounts(id) ON DELETE RESTRICT,
  debit numeric NOT NULL DEFAULT 0,
  credit numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journal_lines TO authenticated;
GRANT ALL ON public.journal_lines TO service_role;
ALTER TABLE public.journal_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners all jl" ON public.journal_lines FOR ALL USING (auth.uid()=owner_id OR has_role(auth.uid(),'admin')) WITH CHECK (auth.uid()=owner_id);

-- ============ BILLING ============
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  invoice_no text NOT NULL,
  invoice_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  party_id uuid REFERENCES public.parties(id) ON DELETE SET NULL,
  party_snapshot jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  cgst numeric NOT NULL DEFAULT 0,
  sgst numeric NOT NULL DEFAULT 0,
  igst numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  gst_rate numeric NOT NULL DEFAULT 18,
  is_interstate boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','cancelled')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners all inv" ON public.invoices FOR ALL USING (auth.uid()=owner_id OR has_role(auth.uid(),'admin')) WITH CHECK (auth.uid()=owner_id);

CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  description text NOT NULL,
  hsn_sac text,
  qty numeric NOT NULL DEFAULT 1,
  rate numeric NOT NULL DEFAULT 0,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO authenticated;
GRANT ALL ON public.invoice_items TO service_role;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners all ii" ON public.invoice_items FOR ALL USING (auth.uid()=owner_id OR has_role(auth.uid(),'admin')) WITH CHECK (auth.uid()=owner_id);

-- ============ HRIS ============
CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  employee_code text NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  designation text,
  department text,
  date_of_joining date NOT NULL DEFAULT CURRENT_DATE,
  basic_salary numeric NOT NULL DEFAULT 0,
  hra numeric NOT NULL DEFAULT 0,
  allowances numeric NOT NULL DEFAULT 0,
  pf_number text,
  esic_number text,
  pan text,
  aadhar text,
  bank_name text,
  bank_account text,
  ifsc text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','left')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id, employee_code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners all emp" ON public.employees FOR ALL USING (auth.uid()=owner_id OR has_role(auth.uid(),'admin')) WITH CHECK (auth.uid()=owner_id);

CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  att_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status IN ('present','absent','half','leave','holiday')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(employee_id, att_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners all att" ON public.attendance FOR ALL USING (auth.uid()=owner_id OR has_role(auth.uid(),'admin')) WITH CHECK (auth.uid()=owner_id);

CREATE TABLE public.payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  period_month int NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year int NOT NULL,
  days_present numeric NOT NULL DEFAULT 0,
  gross_pay numeric NOT NULL DEFAULT 0,
  pf_deduction numeric NOT NULL DEFAULT 0,
  esic_deduction numeric NOT NULL DEFAULT 0,
  tds_deduction numeric NOT NULL DEFAULT 0,
  other_deductions numeric NOT NULL DEFAULT 0,
  net_pay numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','processed','paid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(employee_id, period_month, period_year)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payroll_runs TO authenticated;
GRANT ALL ON public.payroll_runs TO service_role;
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners all pr" ON public.payroll_runs FOR ALL USING (auth.uid()=owner_id OR has_role(auth.uid(),'admin')) WITH CHECK (auth.uid()=owner_id);


-- Set password and confirm email for the sole admin
UPDATE auth.users
SET encrypted_password = crypt('welcome4U@', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'jeet0731@gmail.com';

-- Ensure admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'jeet0731@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Remove any other admin roles (only jeet0731@gmail.com should be admin)
DELETE FROM public.user_roles
WHERE role = 'admin'::app_role
  AND user_id NOT IN (SELECT id FROM auth.users WHERE email = 'jeet0731@gmail.com');

-- Drop the self-registration backdoor
DROP FUNCTION IF EXISTS public.self_register_admin();

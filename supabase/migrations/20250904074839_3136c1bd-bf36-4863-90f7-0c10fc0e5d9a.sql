-- Enable Row Level Security on hrms_users table
ALTER TABLE public.hrms_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
-- This assumes company employees should have access to HRMS data
CREATE POLICY "Allow all operations for authenticated users" 
ON public.hrms_users 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
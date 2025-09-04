-- Add additional columns to cards table for company card details
ALTER TABLE public.cards 
ADD COLUMN funding_wallet TEXT,
ADD COLUMN card_nickname TEXT,
ADD COLUMN spend_control_type TEXT DEFAULT 'daily',
ADD COLUMN daily_limit INTEGER DEFAULT 0,
ADD COLUMN currency TEXT DEFAULT 'AED',
ADD COLUMN allowed_countries TEXT DEFAULT 'United Arab Emirates',
ADD COLUMN category_control TEXT DEFAULT 'allow-all',
ADD COLUMN per_transaction_limit BOOLEAN DEFAULT false,
ADD COLUMN online_transactions BOOLEAN DEFAULT true,
ADD COLUMN contactless_transactions BOOLEAN DEFAULT true;
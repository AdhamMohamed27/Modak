import { createClient } from '@supabase/supabase-js';

SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqbWp4ZWVwd2V2c2RlY3NlcnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MzMxNTYsImV4cCI6MjA0NjQwOTE1Nn0.uyQPGqlD_RIanSo2a7VRcJ9RH5EUeQC6pMeF0k7Hie0'
SUPABASE_URL='https://rjmjxeepwevsdecserxk.supabase.co'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


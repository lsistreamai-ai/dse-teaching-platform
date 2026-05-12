const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://zywgdjbuttwyingoldgb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d2dkamJ1dHR3eWluZ29sZGdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODIyOTY3MiwiZXhwIjoyMDkzODA1NjcyfQ.03441XTX8Nq2AwMFDUf3yygO0fKeP7XbFuk8cD3Y5g4';

// Use service role key for server-side operations (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;

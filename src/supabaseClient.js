import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pmgwktarquswpgnewary.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZ3drdGFycXVzd3BnbmV3YXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MDI1MjMsImV4cCI6MjA2NTA3ODUyM30.C_BSN2ECDKamMVOnmnHvu4wb8Wasbo5DCyeXe3z6GlA';

export const supabase = createClient(supabaseUrl, supabaseKey);

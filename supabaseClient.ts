
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: In a production application, these values should be stored in
// secure environment variables and not hardcoded in the source code.
const supabaseUrl = 'https://khdpmreamvrskcsngbmc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZHBtcmVhbXZyc2tjc25nYm1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0ODI4NDEsImV4cCI6MjA4NjA1ODg0MX0.k5yHNjWMujY5BJsenXY57k7m3hUB2um63JFl5j9CmzI';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

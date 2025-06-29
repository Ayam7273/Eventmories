import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uyrdfarlgizseredjtdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cmRmYXJsZ2l6c2VyZWRqdGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MzIzMDksImV4cCI6MjA2NjMwODMwOX0.Qw4AnOEO-WbDEq5B7vJPoDQo7MYD7oMtlsGayLOj4vQ';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
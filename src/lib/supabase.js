import { createClient } from '@supabase/supabase-js'

// Project credentials
const SUPABASE_URL = 'https://ogdlldjpkqxocuqlfohc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nZGxsZGpwa3F4b2N1cWxmb2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg4MDcsImV4cCI6MjA2NjUzNDgwN30.fiKdZxlrbjd24h8AiWxnOa0CvbZwpkJ5n-D-im0zy_Q'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Клиент с JWT токеном авторизованного пользователя — для запросов с RLS
export function getAuthClient() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('agent_token') : null;
  if (!token) return supabase;
  return createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false }
  });
}

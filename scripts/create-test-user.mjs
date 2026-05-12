import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdghihjgcwxezrwakejc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kZ2hpaGpnY3d4ZXpyd2FrZWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4ODI3ODMsImV4cCI6MjA4MTQ1ODc4M30.hlwe8i6zylTMGPVsu7uQ8bmd3Y3TSSwiKDaXMM-QIsA';

const supabase = createClient(supabaseUrl, supabaseKey);

const email = 'malakhov19851985+agent@gmail.com';
const password = 'Agent1234!';

const { data, error } = await supabase.auth.signUp({ email, password });

if (error) {
  console.error('Ошибка:', error.message);
} else {
  console.log('✅ Пользователь создан!');
  console.log('Email:   ', email);
  console.log('Password:', password);
  console.log('ID:      ', data.user?.id);
}

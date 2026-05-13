import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  try {
    const { name, phone, email } = await request.json();

    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    const { error } = await supabase
      .from('leads')
      .insert({ name: name.trim(), phone: phone.trim(), email: email.trim() });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('leads POST error:', err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

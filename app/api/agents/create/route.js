import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  try {
    // Проверяем что запрос от менеджера
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Проверяем роль
    const { data: managerAgent } = await supabaseAdmin
      .from('agents')
      .select('portal_role')
      .eq('user_id', user.id)
      .single();
    if (managerAgent?.portal_role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, phone, email, leadId } = await request.json();
    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    // Создаём пользователя через invite — Supabase отправит письмо с ссылкой для установки пароля
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email.trim(),
      {
        data: { full_name: name.trim() },
        redirectTo: `${appUrl}/auth/set-password`,
      }
    );
    if (inviteError) {
      if (inviteError.message?.includes('already been registered')) {
        return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 400 });
      }
      throw inviteError;
    }

    // Создаём запись агента
    const { error: agentError } = await supabaseAdmin
      .from('agents')
      .insert({
        user_id: inviteData.user.id,
        full_name: name.trim(),
        contact_email: email.trim(),
        contact_phone: phone.trim(),
        portal_role: 'agent',
        status: 'pending',
        created_by: user.id,
      });
    if (agentError) throw agentError;

    // Помечаем лид как сконвертированный
    if (leadId) {
      await supabaseAdmin
        .from('leads')
        .update({ status: 'converted' })
        .eq('id', leadId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('agents/create error:', err);
    return NextResponse.json({ error: err.message || 'Ошибка сервера' }, { status: 500 });
  }
}

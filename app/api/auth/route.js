import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { action, email, password, token } = await request.json();

    if (action === 'login') {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
      }

      // Check if user is an agent
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (agentError || !agent) {
        return NextResponse.json({ error: 'Аккаунт агента не найден' }, { status: 403 });
      }

      if (agent.status === 'blocked' || agent.status === 'rejected') {
        return NextResponse.json({ error: 'Аккаунт заблокирован или отклонён' }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        token: data.session.access_token,
        agent: {
          id: agent.id,
          full_name: agent.full_name,
          company_name: agent.company_name,
          contact_name: agent.contact_name,
          email: agent.contact_email,
          portal_role: agent.portal_role || 'agent',
          status: agent.status,
        }
      });
    }

    if (action === 'verify') {
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      // Get agent data
      const { data: agent } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        agent: {
          id: agent.id,
          full_name: agent.full_name,
          company_name: agent.company_name,
          contact_name: agent.contact_name,
          email: agent.contact_email,
          portal_role: agent.portal_role || 'agent',
          status: agent.status,
        }
      });
    }

    if (action === 'logout') {
      await supabase.auth.signOut();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

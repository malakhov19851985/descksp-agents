'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase передаёт токен в hash: #access_token=...&type=invite
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      // Supabase JS автоматически подхватывает токен из hash
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true);
      });
    } else {
      setError('Ссылка недействительна или устарела');
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 8) {
      setError('Пароль должен быть не менее 8 символов');
      return;
    }
    setState('loading');
    setError('');

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setState('error');
      return;
    }

    setState('success');
    setTimeout(() => router.push('/login'), 2000);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-blue)' }}>N1</span>
          <span style={{ fontSize: '24px', fontWeight: '300' }}> PRODUCTS</span>
          <h1 style={{ fontSize: '22px', fontWeight: '600', marginTop: '16px' }}>Установите пароль</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
            Придумайте пароль для входа в кабинет
          </p>
        </div>

        {state === 'success' ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <p>Пароль установлен. Перенаправляем на страницу входа...</p>
          </div>
        ) : !ready ? (
          <div style={{ textAlign: 'center', color: error ? '#ef4444' : 'var(--text-secondary)' }}>
            {error || 'Загрузка...'}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Пароль
              </label>
              <input
                type="password"
                required
                placeholder="Минимум 8 символов"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Повторите пароль
              </label>
              <input
                type="password"
                required
                placeholder="Повторите пароль"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={state === 'loading'}
              style={{ padding: '14px', fontSize: '15px', marginTop: '8px' }}
            >
              {state === 'loading' ? 'Сохраняем...' : 'Установить пароль'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

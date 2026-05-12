'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('agent_token', data.token);
        localStorage.setItem('agent_data', JSON.stringify(data.agent));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed',
        top: '-200px',
        left: '-200px',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-200px',
        right: '-200px',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '40px',
          textDecoration: 'none'
        }}>
          <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--accent-blue)' }}>N1</span>
          <span style={{ fontSize: '32px', fontWeight: '300', color: 'var(--text-primary)' }}>CAPITAL</span>
        </Link>

        {/* Login Card */}
        <div className="card" style={{ padding: '40px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            Вход в кабинет
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: '32px',
            fontSize: '14px'
          }}>
            Партнёрский портал
          </p>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: 'var(--danger)',
              fontSize: '14px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="agent@company.com"
                required
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'wait' : 'pointer'
              }}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'var(--text-muted)',
          fontSize: '14px'
        }}>
          Нет доступа?{' '}
          <a href="mailto:partners@n1capital.kz" style={{ color: 'var(--accent-blue)' }}>
            Свяжитесь с нами
          </a>
        </p>
      </div>
    </div>
  );
}

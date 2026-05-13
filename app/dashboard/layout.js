'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const agentMenu = [
  { id: 'dashboard', label: 'Главная', icon: '📊', href: '/dashboard' },
  { id: 'products', label: 'Продукты', icon: '📦', href: '/dashboard/products' },
  { id: 'sales', label: 'Мои продажи', icon: '💼', href: '/dashboard/sales' },
  { id: 'commissions', label: 'Комиссии', icon: '💰', href: '/dashboard/commissions' },
];

const managerMenu = [
  { id: 'manage-products', label: 'Управление продуктами', icon: '⚙️', href: '/admin/products' },
  { id: 'manage-agents', label: 'Агенты', icon: '👥', href: '/admin/agents' },
  { id: 'manage-sales', label: 'Продажи', icon: '📋', href: '/admin/sales' },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('agent_token');
    const agentData = localStorage.getItem('agent_data');

    if (!token) {
      router.push('/login');
      return;
    }

    if (agentData) {
      setAgent(JSON.parse(agentData));
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('agent_token');
    localStorage.removeItem('agent_data');
    router.push('/login');
  };

  const isManager = agent?.portal_role === 'manager';

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)'
      }}>
        Загрузка...
      </div>
    );
  }

  if (agent?.status === 'pending') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '24px',
        padding: '40px'
      }}>
        <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>⏳</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Заявка на рассмотрении
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '32px' }}>
            Ваш аккаунт создан. Менеджер проверит данные и активирует доступ к кабинету.
            Обычно это занимает 1–2 рабочих дня. После активации войдите заново.
          </p>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '10px 24px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <aside style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0
      }}>
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-blue)' }}>N1</span>
            <span style={{ fontSize: '24px', fontWeight: '300', color: 'var(--text-primary)' }}>PRODUCTS</span>
          </Link>
          <div style={{
            marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)',
            padding: '4px 8px', background: 'var(--bg-card)', borderRadius: '4px', display: 'inline-block'
          }}>
            Партнёрский портал
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {agentMenu.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.id} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '8px', marginBottom: '4px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                textDecoration: 'none', fontSize: '14px', transition: 'all 0.2s'
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Раздел менеджера */}
          {isManager && (
            <>
              <div style={{
                fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600',
                letterSpacing: '0.08em', padding: '16px 16px 8px', textTransform: 'uppercase'
              }}>
                Управление
              </div>
              {managerMenu.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link key={item.id} href={item.href} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '8px', marginBottom: '4px',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-gradient)' : 'transparent',
                    textDecoration: 'none', fontSize: '14px', transition: 'all 0.2s'
                  }}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* User section */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'var(--accent-gradient)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '16px'
            }}>
              {isManager ? '🔑' : '👤'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {agent?.contact_name || agent?.email || 'Агент'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isManager ? 'Менеджер' : 'Агент'}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', background: 'transparent',
            border: '1px solid var(--border-color)', borderRadius: '8px',
            color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s'
          }}>
            Выйти
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: '260px', padding: '32px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}

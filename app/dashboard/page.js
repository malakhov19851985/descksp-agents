'use client';

import Link from 'next/link';

export default function DashboardPage() {
  // Mock data - будет загружаться из API
  const stats = {
    totalSales: 12,
    totalNominal: 450000,
    totalCommission: 2250,
    pendingCommission: 750
  };

  const recentEvents = [
    { date: '25.12.2024', client: 'Иванов И.И.', product: 'AUTOCALL Tech', event: 'Купон 3%' },
    { date: '28.12.2024', client: 'Петров П.П.', product: 'FIXRATE 8%', event: 'Observation #2' },
    { date: '01.01.2025', client: 'Сидоров С.С.', product: 'AUTOCALL Banks', event: 'Погашение' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
          Добро пожаловать! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Обзор вашей партнёрской активности
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {[
          { label: 'Всего продаж', value: stats.totalSales, icon: '📊', color: 'var(--accent-blue)' },
          { label: 'Общий номинал', value: `$${stats.totalNominal.toLocaleString()}`, icon: '💵', color: 'var(--accent-purple)' },
          { label: 'Заработано', value: `$${stats.totalCommission.toLocaleString()}`, icon: '💰', color: 'var(--success)' },
          { label: 'К выплате', value: `$${stats.pendingCommission.toLocaleString()}`, icon: '⏳', color: 'var(--warning)' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '32px' }}>{stat.icon}</span>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: stat.color
              }} />
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        {/* Upcoming Events */}
        <div className="card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
              📅 Ближайшие события
            </h2>
            <Link href="/dashboard/sales" style={{
              fontSize: '14px',
              color: 'var(--accent-blue)'
            }}>
              Все →
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentEvents.map((event, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px',
                background: 'var(--bg-secondary)',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '48px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'var(--text-muted)'
                }}>
                  {event.date}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{event.client}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{event.product}</div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color: 'var(--accent-blue)'
                }}>
                  {event.event}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            ⚡ Быстрые действия
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/dashboard/products" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '24px' }}>📦</span>
              <div>
                <div style={{ fontWeight: '500' }}>Смотреть продукты</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Витрина доступных продуктов</div>
              </div>
            </Link>
            
            <Link href="/dashboard/sales" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '24px' }}>💼</span>
              <div>
                <div style={{ fontWeight: '500' }}>Мои продажи</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>История ваших сделок</div>
              </div>
            </Link>
            
            <Link href="/dashboard/commissions" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '24px' }}>💰</span>
              <div>
                <div style={{ fontWeight: '500' }}>Комиссии</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Начисления и выплаты</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

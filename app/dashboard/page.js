'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuthClient } from '@/lib/supabase';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalSales: 0, totalNominal: 0, totalCommission: 0 });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const agentData = JSON.parse(localStorage.getItem('agent_data') || '{}');
      if (!agentData.id) { setLoading(false); return; }

      const client = getAuthClient();
      const { data } = await client
        .from('sales')
        .select('id, sale_date, client_name, product_name, amount, currency, commission_usd')
        .eq('agent_id', agentData.id)
        .order('sale_date', { ascending: false });

      const all = data || [];
      setRecentSales(all.slice(0, 5));
      setStats({
        totalSales: all.length,
        totalNominal: all.reduce((sum, s) => sum + Number(s.amount || 0), 0),
        totalCommission: all.reduce((sum, s) => sum + Number(s.commission_usd || 0), 0),
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>Добро пожаловать! 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Обзор вашей партнёрской активности</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Всего продаж', value: loading ? '...' : stats.totalSales, icon: '📊', color: 'var(--accent-blue)' },
          { label: 'Общий номинал', value: loading ? '...' : `$${stats.totalNominal.toLocaleString()}`, icon: '💵', color: 'var(--accent-purple)' },
          { label: 'Комиссия', value: loading ? '...' : `$${stats.totalCommission.toLocaleString()}`, icon: '💰', color: 'var(--success)' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px' }}>{stat.icon}</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.color, marginTop: '6px' }} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent sales */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>📋 Последние сделки</h2>
            <Link href="/dashboard/sales" style={{ fontSize: '14px', color: 'var(--accent-blue)' }}>Все →</Link>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Загрузка...</p>
          ) : recentSales.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Сделок пока нет</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentSales.map(sale => (
                <div key={sale.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px'
                }}>
                  <div style={{ width: '60px', fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {sale.sale_date}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sale.client_name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sale.product_name}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--success)', flexShrink: 0 }}>
                    ${Number(sale.commission_usd).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>⚡ Быстрые действия</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { href: '/dashboard/products', icon: '📦', title: 'Смотреть продукты', desc: 'Витрина доступных продуктов' },
              { href: '/dashboard/sales', icon: '💼', title: 'Мои продажи', desc: 'История ваших сделок' },
              { href: '/dashboard/commissions', icon: '💰', title: 'Комиссии', desc: 'Начисления по сделкам' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                background: 'var(--bg-secondary)', borderRadius: '8px',
                textDecoration: 'none', color: 'var(--text-primary)'
              }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: '500' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

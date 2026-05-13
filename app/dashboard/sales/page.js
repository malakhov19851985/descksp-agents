'use client';

import { useState, useEffect } from 'react';
import { getAuthClient } from '@/lib/supabase';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const agentData = JSON.parse(localStorage.getItem('agent_data') || '{}');
      const client = getAuthClient();
      const { data } = await client
        .from('sales')
        .select('id, sale_date, client_name, product_name, amount, currency')
        .eq('agent_id', agentData.id)
        .order('sale_date', { ascending: false });
      setSales(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>💼 Мои продажи</h1>
        <p style={{ color: 'var(--text-secondary)' }}>История ваших сделок</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Загрузка...</div>
      ) : sales.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Сделок пока нет
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                {['Дата', 'Клиент', 'Продукт', 'Сумма'].map(h => (
                  <th key={h} style={{ padding: '16px', textAlign: 'left', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>{sale.sale_date}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{sale.client_name}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{sale.product_name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>
                    {Number(sale.amount).toLocaleString()} {sale.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

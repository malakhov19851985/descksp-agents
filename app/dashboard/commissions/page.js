'use client';

import { useState, useEffect } from 'react';
import { getAuthClient } from '@/lib/supabase';

export default function CommissionsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const agentData = JSON.parse(localStorage.getItem('agent_data') || '{}');
      if (!agentData.id) { setLoading(false); return; }

      const client = getAuthClient();
      const [salesRes, ratesRes] = await Promise.all([
        client.from('sales').select('id, sale_date, product_name, sisin, amount, currency').eq('agent_id', agentData.id).order('sale_date', { ascending: false }).limit(500),
        client.from('agent_commissions').select('sisin, commission_rate').eq('agent_id', agentData.id),
      ]);

      const rateMap = {};
      (ratesRes.data || []).forEach(r => { rateMap[r.sisin] = r.commission_rate; });

      const computed = (salesRes.data || []).map(s => {
        const rate = rateMap[s.sisin] ?? null;
        const commission = rate !== null ? (Number(s.amount) * rate / 100) : null;
        return { ...s, rate, commission };
      });

      setRows(computed);
      setLoading(false);
    }
    load();
  }, []);

  const totalCommission = rows.reduce((sum, r) => sum + (r.commission || 0), 0);
  const hasRates = rows.some(r => r.rate !== null);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>💰 Комиссии</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Начисления по вашим сделкам</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>💰 Всего комиссии</div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--success)' }}>
            {hasRates ? `$${totalCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—'}
          </div>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>📊 Количество сделок</div>
          <div style={{ fontSize: '36px', fontWeight: '700' }}>{rows.length}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Загрузка...</div>
      ) : rows.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Сделок пока нет</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                {['Дата', 'Продукт', 'SISIN', 'Сумма', 'Ставка', 'Комиссия'].map(h => (
                  <th key={h} style={{ padding: '16px', textAlign: 'left', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>{r.sale_date}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{r.product_name}</td>
                  <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{r.sisin || '—'}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>
                    {Number(r.amount).toLocaleString()} {r.currency}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {r.rate !== null ? `${r.rate}%` : <span style={{ color: '#f59e0b' }}>не задана</span>}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700', color: r.commission !== null ? 'var(--success)' : 'var(--text-muted)' }}>
                    {r.commission !== null ? `$${r.commission.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—'}
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

'use client';

import { useState, useEffect } from 'react';

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, paid: 0 });

  useEffect(() => {
    setTimeout(() => {
      const data = [
        { id: 1, date: '2024-12-15', product: 'AUTOCALL Tech Giants', saleAmount: 50000, rate: 0.5, amount: 250, status: 'pending' },
        { id: 2, date: '2024-12-10', product: 'FIXRATE Note 8%', saleAmount: 100000, rate: 0.5, amount: 500, status: 'pending' },
        { id: 3, date: '2024-11-20', product: 'AUTOCALL Banks', saleAmount: 75000, rate: 0.5, amount: 375, status: 'paid', paidDate: '2024-12-01' },
        { id: 4, date: '2024-10-15', product: 'FIXRATE Note 8%', saleAmount: 200000, rate: 0.5, amount: 1000, status: 'paid', paidDate: '2024-11-01' },
      ];
      setCommissions(data);
      setStats({
        pending: data.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0),
        paid: data.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0)
      });
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
          💰 Комиссии
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Начисления и выплаты
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            ⏳ К выплате
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--warning)' }}>
            ${stats.pending.toLocaleString()}
          </div>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            ✅ Выплачено (всего)
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--success)' }}>
            ${stats.paid.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Загрузка...
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Дата</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Продукт</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Сумма сделки</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Ставка</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Комиссия</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Статус</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map(c => (
                <tr key={c.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{c.date}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{c.product}</td>
                  <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right' }}>
                    ${c.saleAmount.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right' }}>
                    {c.rate}%
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right', fontWeight: '600', color: 'var(--success)' }}>
                    ${c.amount}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: c.status === 'paid' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: c.status === 'paid' ? 'var(--success)' : 'var(--warning)'
                    }}>
                      {c.status === 'paid' ? `Выплачено ${c.paidDate}` : 'Ожидает'}
                    </span>
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

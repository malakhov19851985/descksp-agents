'use client';

import { useState, useEffect } from 'react';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setSales([
        { id: 1, date: '2024-12-15', client: 'Иванов И.И.', product: 'AUTOCALL Tech Giants', amount: 50000, currency: 'USD', status: 'Active', commission: 250 },
        { id: 2, date: '2024-12-10', client: 'Петров П.П.', product: 'FIXRATE Note 8%', amount: 100000, currency: 'USD', status: 'Active', commission: 500 },
        { id: 3, date: '2024-11-20', client: 'Сидоров С.С.', product: 'AUTOCALL Banks', amount: 75000, currency: 'USD', status: 'Active', commission: 375 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
          💼 Мои продажи
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          История ваших сделок
        </p>
      </div>

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
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Клиент</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Продукт</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Сумма</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Статус</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Комиссия</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{sale.date}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{sale.client}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{sale.product}</td>
                  <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right', fontWeight: '600' }}>
                    ${sale.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      color: 'var(--success)'
                    }}>
                      {sale.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right', color: 'var(--success)', fontWeight: '600' }}>
                    ${sale.commission}
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

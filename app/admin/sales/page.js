'use client';

import { useEffect, useState } from 'react';
import { getAuthClient } from '@/lib/supabase';

export default function AdminSalesPage() {
  const [sales, setSales] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAgent, setFilterAgent] = useState('all');
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const client = getAuthClient();
    const [salesRes, agentsRes] = await Promise.all([
      client.from('sales').select('id, sale_date, client_name, product_name, sisin, amount, currency, commission_pct, commission_usd, agent_id').order('sale_date', { ascending: false }).limit(500),
      client.from('agents').select('id, full_name, contact_email').eq('portal_role', 'agent').eq('status', 'active'),
    ]);
    if (salesRes.data) setSales(salesRes.data);
    if (agentsRes.data) setAgents(agentsRes.data);
    setLoading(false);
  }

  async function assignAgent(saleId, agentId) {
    setSaving(saleId);
    const client = getAuthClient();
    await client.from('sales').update({ agent_id: agentId || null }).eq('id', saleId);
    setSales(prev => prev.map(s => s.id === saleId ? { ...s, agent_id: agentId || null } : s));
    setSaving(null);
  }

  const filtered = sales.filter(s => {
    const matchSearch = !search ||
      s.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.product_name?.toLowerCase().includes(search.toLowerCase());
    const matchAgent = filterAgent === 'all' ||
      (filterAgent === 'unassigned' && !s.agent_id) ||
      s.agent_id === filterAgent;
    return matchSearch && matchAgent;
  });

  const agentName = (id) => agents.find(a => a.id === id)?.full_name || '—';

  return (
    <div style={{ padding: '32px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Продажи</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Назначайте агентов к сделкам</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Поиск по клиенту или продукту..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field"
          style={{ flex: 1 }}
        />
        <select
          value={filterAgent}
          onChange={e => setFilterAgent(e.target.value)}
          className="input-field"
          style={{ width: '220px' }}
        >
          <option value="all">Все сделки</option>
          <option value="unassigned">Без агента</option>
          {agents.map(a => (
            <option key={a.id} value={a.id}>{a.full_name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Загрузка...</p>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', fontSize: '13px', color: 'var(--text-muted)' }}>
            Показано {filtered.length} из {sales.length} сделок
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Дата', 'Клиент', 'Продукт', 'SISIN', 'Сумма', 'Комиссия', 'Агент'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(sale => (
                <tr key={sale.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {sale.sale_date}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{sale.client_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{sale.product_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{sale.sisin || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    {Number(sale.amount).toLocaleString()} {sale.currency}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--success)', whiteSpace: 'nowrap' }}>
                    {Number(sale.commission_usd).toLocaleString()} USD
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={sale.agent_id || ''}
                      onChange={e => assignAgent(sale.id, e.target.value)}
                      disabled={saving === sale.id}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '13px',
                        color: sale.agent_id ? 'var(--text-primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        minWidth: '160px',
                      }}
                    >
                      <option value="">— Не назначен —</option>
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>{a.full_name}</option>
                      ))}
                    </select>
                    {saving === sale.id && (
                      <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>...</span>
                    )}
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

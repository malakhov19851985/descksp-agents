'use client';

import { useEffect, useState } from 'react';
import { getAuthClient } from '@/lib/supabase';

const STATUS_LABELS = {
  new: { label: 'Новый', color: '#3b82f6' },
  converted: { label: 'Создан агент', color: '#22c55e' },
  rejected: { label: 'Отклонён', color: '#ef4444' },
};

const AGENT_STATUS_LABELS = {
  pending: { label: 'Ожидает активации', color: '#f59e0b' },
  active: { label: 'Активен', color: '#22c55e' },
  rejected: { label: 'Отклонён', color: '#ef4444' },
  blocked: { label: 'Заблокирован', color: '#6b7280' },
};

export default function AdminAgentsPage() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('leads');

  // Создание агента
  const [createModal, setCreateModal] = useState(null);
  const [createForm, setCreateForm] = useState({ name: '', phone: '', email: '' });
  const [createState, setCreateState] = useState('idle');
  const [createError, setCreateError] = useState('');

  // Ставки агента
  const [ratesModal, setRatesModal] = useState(null); // { agentId, agentName }
  const [rates, setRates] = useState([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [newRate, setNewRate] = useState({ sisin: '', commission_rate: '' });
  const [rateSaving, setRateSaving] = useState(false);
  const [rateError, setRateError] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const client = getAuthClient();
    const [leadsRes, agentsRes] = await Promise.all([
      client.from('leads').select('*').order('created_at', { ascending: false }),
      client.from('agents').select('*').eq('portal_role', 'agent').order('created_at', { ascending: false }),
    ]);
    if (leadsRes.data) setLeads(leadsRes.data);
    if (agentsRes.data) setAgents(agentsRes.data);
    setLoading(false);
  }

  function openCreateModal(lead = null) {
    setCreateForm({ name: lead?.name || '', phone: lead?.phone || '', email: lead?.email || '' });
    setCreateModal(lead ? { leadId: lead.id } : { leadId: null });
    setCreateState('idle');
    setCreateError('');
  }

  async function handleCreateAgent(e) {
    e.preventDefault();
    setCreateState('loading');
    setCreateError('');
    const token = localStorage.getItem('agent_token');
    try {
      const res = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...createForm, leadId: createModal?.leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      setCreateState('success');
      setCreateModal(null);
      loadData();
    } catch (err) {
      setCreateError(err.message);
      setCreateState('error');
    }
  }

  async function handleActivate(agentId) {
    const client = getAuthClient();
    await client.from('agents').update({ status: 'active' }).eq('id', agentId);
    loadData();
  }

  async function handleBlock(agentId) {
    const client = getAuthClient();
    await client.from('agents').update({ status: 'blocked' }).eq('id', agentId);
    loadData();
  }

  // --- Ставки ---
  async function openRatesModal(agent) {
    setRatesModal({ agentId: agent.id, agentName: agent.full_name });
    setNewRate({ sisin: '', commission_rate: '' });
    setRateError('');
    setRatesLoading(true);
    const client = getAuthClient();
    const { data } = await client
      .from('agent_commissions')
      .select('*')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: false });
    setRates(data || []);
    setRatesLoading(false);
  }

  async function handleAddRate(e) {
    e.preventDefault();
    if (!newRate.sisin.trim() || !newRate.commission_rate) {
      setRateError('Заполните SISIN и ставку');
      return;
    }
    setRateSaving(true);
    setRateError('');
    const client = getAuthClient();
    const { error } = await client.from('agent_commissions').insert({
      agent_id: ratesModal.agentId,
      sisin: newRate.sisin.trim().toUpperCase(),
      commission_rate: parseFloat(newRate.commission_rate),
    });
    if (error) {
      setRateError(error.message);
    } else {
      setNewRate({ sisin: '', commission_rate: '' });
      const { data } = await client
        .from('agent_commissions')
        .select('*')
        .eq('agent_id', ratesModal.agentId)
        .order('created_at', { ascending: false });
      setRates(data || []);
    }
    setRateSaving(false);
  }

  async function handleDeleteRate(rateId) {
    const client = getAuthClient();
    await client.from('agent_commissions').delete().eq('id', rateId);
    setRates(prev => prev.filter(r => r.id !== rateId));
  }

  const tabStyle = (t) => ({
    padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    fontSize: '14px', fontWeight: '500',
    background: tab === t ? 'var(--accent-blue)' : 'transparent',
    color: tab === t ? '#fff' : 'var(--text-secondary)',
  });

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Управление агентами</h1>
        <button className="btn-primary" style={{ padding: '10px 20px' }} onClick={() => openCreateModal()}>
          + Создать агента
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
        <button style={tabStyle('leads')} onClick={() => setTab('leads')}>
          Заявки {leads.filter(l => l.status === 'new').length > 0 && (
            <span style={{ background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', marginLeft: '6px' }}>
              {leads.filter(l => l.status === 'new').length}
            </span>
          )}
        </button>
        <button style={tabStyle('agents')} onClick={() => setTab('agents')}>Агенты</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Загрузка...</p>
      ) : tab === 'leads' ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          {leads.length === 0 ? (
            <p style={{ padding: '32px', color: 'var(--text-secondary)', textAlign: 'center' }}>Заявок пока нет</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Имя', 'Телефон', 'Email', 'Дата', 'Статус', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>{lead.name}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{lead.phone}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{lead.email}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                        background: STATUS_LABELS[lead.status]?.color + '22',
                        color: STATUS_LABELS[lead.status]?.color,
                      }}>
                        {STATUS_LABELS[lead.status]?.label || lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {lead.status === 'new' && (
                        <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => openCreateModal(lead)}>
                          Создать агента
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {agents.length === 0 ? (
            <p style={{ padding: '32px', color: 'var(--text-secondary)', textAlign: 'center' }}>Агентов пока нет</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Имя', 'Email', 'Телефон', 'Дата', 'Статус', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agents.map(agent => (
                  <tr key={agent.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>{agent.full_name || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{agent.contact_email}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{agent.contact_phone || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {new Date(agent.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                        background: (AGENT_STATUS_LABELS[agent.status]?.color || '#6b7280') + '22',
                        color: AGENT_STATUS_LABELS[agent.status]?.color || '#6b7280',
                      }}>
                        {AGENT_STATUS_LABELS[agent.status]?.label || agent.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '13px' }}
                          onClick={() => openRatesModal(agent)}
                        >
                          Ставки
                        </button>
                        {agent.status === 'pending' && (
                          <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => handleActivate(agent.id)}>
                            Активировать
                          </button>
                        )}
                        {agent.status === 'active' && (
                          <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => handleBlock(agent.id)}>
                            Заблокировать
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal: Создать агента */}
      {createModal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '440px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Создать агента</h2>
            <form onSubmit={handleCreateAgent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Имя', field: 'name', type: 'text', placeholder: 'Иван Иванов' },
                { label: 'Телефон', field: 'phone', type: 'tel', placeholder: '+7 700 000 00 00' },
                { label: 'Email', field: 'email', type: 'email', placeholder: 'ivan@example.com' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</label>
                  <input type={type} required placeholder={placeholder} value={createForm[field]}
                    onChange={e => setCreateForm(f => ({ ...f, [field]: e.target.value }))}
                    className="input-field" style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
              ))}
              {createState === 'error' && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{createError}</p>}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setCreateModal(null)}>Отмена</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }} disabled={createState === 'loading'}>
                  {createState === 'loading' ? 'Создаём...' : 'Создать и отправить приглашение'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ставки агента */}
      {ratesModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '540px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px' }}>Ставки — {ratesModal.agentName}</h2>
              <button onClick={() => setRatesModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {/* Форма добавления */}
            <form onSubmit={handleAddRate} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="SISIN (напр. KZX000005137)"
                value={newRate.sisin}
                onChange={e => setNewRate(r => ({ ...r, sisin: e.target.value }))}
                className="input-field"
                style={{ flex: 2 }}
              />
              <input
                type="number"
                placeholder="Ставка %"
                step="0.01"
                min="0"
                max="100"
                value={newRate.commission_rate}
                onChange={e => setNewRate(r => ({ ...r, commission_rate: e.target.value }))}
                className="input-field"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 16px', whiteSpace: 'nowrap' }} disabled={rateSaving}>
                + Добавить
              </button>
            </form>
            {rateError && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{rateError}</p>}

            {/* Список ставок */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {ratesLoading ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>Загрузка...</p>
              ) : rates.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>Ставок пока нет</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>SISIN</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Ставка</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map(rate => (
                      <tr key={rate.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontSize: '14px', fontFamily: 'monospace' }}>{rate.sisin}</td>
                        <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right', fontWeight: '600', color: 'var(--success)' }}>
                          {rate.commission_rate}%
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDeleteRate(rate.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '16px', lineHeight: 1 }}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

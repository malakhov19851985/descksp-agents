'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const EMPTY_FORM = {
  name: '', product_type: 'AUTOCALL', currency: 'USD',
  coupon_rate_annual: '', duration_months: '', min_investment: '',
  nominal_barrier: '', coupon_barrier: '', autocall_level: '',
  underlyings: '', commission_rate: '', description: ''
};

const STATUS_LABELS = { draft: 'Черновик', active: 'Активен', archived: 'Архив' };
const STATUS_COLORS = {
  draft: 'rgba(245,158,11,0.15)',
  active: 'rgba(34,197,94,0.15)',
  archived: 'rgba(100,100,100,0.15)'
};
const STATUS_TEXT = {
  draft: 'var(--warning)',
  active: 'var(--success)',
  archived: 'var(--text-muted)'
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('agent_products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setProducts(data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  }

  function openEdit(product) {
    setEditProduct(product);
    setForm({
      ...product,
      underlyings: (product.underlyings || []).join(', ')
    });
    setError('');
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.product_type) {
      setError('Заполните название и тип продукта');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      underlyings: form.underlyings ? form.underlyings.split(',').map(s => s.trim()).filter(Boolean) : [],
      coupon_rate_annual: form.coupon_rate_annual || null,
      duration_months: form.duration_months || null,
      min_investment: form.min_investment || null,
      nominal_barrier: form.nominal_barrier || null,
      coupon_barrier: form.coupon_barrier || null,
      autocall_level: form.autocall_level || null,
      commission_rate: form.commission_rate || null,
    };

    let result;
    if (editProduct) {
      result = await supabase.from('agent_products').update(payload).eq('id', editProduct.id);
    } else {
      result = await supabase.from('agent_products').insert([{ ...payload, status: 'draft' }]);
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      setShowForm(false);
      loadProducts();
    }
    setSaving(false);
  }

  async function handlePublish(product) {
    await supabase.from('agent_products')
      .update({ status: 'active', published_at: new Date().toISOString() })
      .eq('id', product.id);
    loadProducts();
  }

  async function handleArchive(product) {
    await supabase.from('agent_products').update({ status: 'archived' }).eq('id', product.id);
    loadProducts();
  }

  async function handleDraft(product) {
    await supabase.from('agent_products').update({ status: 'draft' }).eq('id', product.id);
    loadProducts();
  }

  async function handleDelete(product) {
    if (!confirm(`Удалить продукт "${product.name}"?`)) return;
    await supabase.from('agent_products').delete().eq('id', product.id);
    loadProducts();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>⚙️ Управление продуктами</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Продукты агентского канала</p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ padding: '12px 24px' }}>
          + Добавить продукт
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Загрузка...</div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <p style={{ color: 'var(--text-secondary)' }}>Продуктов пока нет. Добавьте первый!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {products.map(product => (
            <div key={product.id} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>{product.name}</span>
                  <span style={{
                    padding: '2px 10px', borderRadius: '12px', fontSize: '12px',
                    background: STATUS_COLORS[product.status], color: STATUS_TEXT[product.status]
                  }}>
                    {STATUS_LABELS[product.status]}
                  </span>
                  <span style={{
                    padding: '2px 10px', borderRadius: '12px', fontSize: '12px',
                    background: 'var(--bg-secondary)', color: 'var(--text-muted)'
                  }}>
                    {product.product_type}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {product.coupon_rate_annual && <span>Купон: <b>{product.coupon_rate_annual}%</b></span>}
                  {product.duration_months && <span>Срок: <b>{product.duration_months} мес</b></span>}
                  {product.currency && <span>Валюта: <b>{product.currency}</b></span>}
                  {product.commission_rate && <span>Комиссия: <b>{product.commission_rate}%</b></span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => openEdit(product)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Изменить
                </button>
                {product.status === 'draft' && (
                  <button onClick={() => handlePublish(product)} style={{
                    padding: '8px 16px', fontSize: '13px', borderRadius: '8px', border: 'none',
                    background: 'rgba(34,197,94,0.15)', color: 'var(--success)', cursor: 'pointer'
                  }}>
                    Опубликовать
                  </button>
                )}
                {product.status === 'active' && (
                  <button onClick={() => handleArchive(product)} style={{
                    padding: '8px 16px', fontSize: '13px', borderRadius: '8px', border: 'none',
                    background: 'rgba(100,100,100,0.15)', color: 'var(--text-muted)', cursor: 'pointer'
                  }}>
                    Архивировать
                  </button>
                )}
                {product.status === 'archived' && (
                  <button onClick={() => handleDraft(product)} style={{
                    padding: '8px 16px', fontSize: '13px', borderRadius: '8px', border: 'none',
                    background: 'rgba(245,158,11,0.15)', color: 'var(--warning)', cursor: 'pointer'
                  }}>
                    В черновик
                  </button>
                )}
                <button onClick={() => handleDelete(product)} style={{
                  padding: '8px 12px', fontSize: '13px', borderRadius: '8px', border: 'none',
                  background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', cursor: 'pointer'
                }}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Форма создания/редактирования */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} onClick={() => setShowForm(false)}>
          <div className="card" style={{
            maxWidth: '640px', width: '100%', maxHeight: '90vh',
            overflow: 'auto', padding: '32px'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
              {editProduct ? 'Редактировать продукт' : 'Новый продукт'}
            </h2>

            {error && (
              <div style={{
                padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px',
                color: 'var(--danger)', fontSize: '14px', marginBottom: '16px'
              }}>{error}</div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Название *</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Название продукта" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Тип продукта *</label>
                <select className="input" value={form.product_type} onChange={e => setForm({ ...form, product_type: e.target.value })}>
                  {['AUTOCALL', 'FIXRATE', 'CP', 'FTD', 'OTHER'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Валюта</label>
                <select className="input" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                  {['USD', 'EUR', 'KZT'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Купон % годовых</label>
                <input className="input" type="number" value={form.coupon_rate_annual} onChange={e => setForm({ ...form, coupon_rate_annual: e.target.value })} placeholder="12" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Срок (месяцев)</label>
                <input className="input" type="number" value={form.duration_months} onChange={e => setForm({ ...form, duration_months: e.target.value })} placeholder="12" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Мин. инвестиция</label>
                <input className="input" type="number" value={form.min_investment} onChange={e => setForm({ ...form, min_investment: e.target.value })} placeholder="10000" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Комиссия агента %</label>
                <input className="input" type="number" value={form.commission_rate} onChange={e => setForm({ ...form, commission_rate: e.target.value })} placeholder="0.5" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Барьер купона %</label>
                <input className="input" type="number" value={form.coupon_barrier} onChange={e => setForm({ ...form, coupon_barrier: e.target.value })} placeholder="70" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Барьер защиты %</label>
                <input className="input" type="number" value={form.nominal_barrier} onChange={e => setForm({ ...form, nominal_barrier: e.target.value })} placeholder="65" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Autocall уровень %</label>
                <input className="input" type="number" value={form.autocall_level} onChange={e => setForm({ ...form, autocall_level: e.target.value })} placeholder="100" />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Базовые активы (через запятую)</label>
                <input className="input" value={form.underlyings} onChange={e => setForm({ ...form, underlyings: e.target.value })} placeholder="AAPL, GOOGL, MSFT" />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Описание для агента</label>
                <textarea className="input" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Что рассказать клиенту о продукте..." style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ padding: '12px 24px' }}>
                Отмена
              </button>
              <button onClick={handleSave} className="btn-primary" style={{ padding: '12px 24px', opacity: saving ? 0.7 : 1 }} disabled={saving}>
                {saving ? 'Сохранение...' : (editProduct ? 'Сохранить' : 'Создать')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

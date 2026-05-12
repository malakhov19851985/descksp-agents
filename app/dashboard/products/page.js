'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    const { data } = await supabase
      .from('agent_products')
      .select('*')
      .eq('status', 'active')
      .order('published_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  const productTypes = [{ value: 'all', label: 'Все продукты' }, ...
    [...new Set(products.map(p => p.product_type))].map(t => ({ value: t, label: t }))
  ];

  const filteredProducts = filter === 'all' ? products : products.filter(p => p.product_type === filter);

  function getTypeColor(type) {
    const colors = { AUTOCALL: 'var(--accent-blue)', FIXRATE: 'var(--success)', CP: 'var(--accent-purple)', FTD: 'var(--warning)' };
    return colors[type] || 'var(--text-muted)';
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>📦 Витрина продуктов</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Актуальные продукты для предложения клиентам</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {productTypes.map(type => (
          <button key={type.value} onClick={() => setFilter(type.value)} style={{
            padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: filter === type.value ? 'var(--accent-gradient)' : 'var(--bg-card)',
            color: filter === type.value ? 'white' : 'var(--text-secondary)',
            fontSize: '14px', transition: 'all 0.2s'
          }}>
            {type.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Загрузка продуктов...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <p style={{ color: 'var(--text-secondary)' }}>Продуктов пока нет</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="card" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setSelectedProduct(product)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ padding: '4px 12px', background: getTypeColor(product.product_type), borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {product.product_type}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{product.currency}</span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{product.name}</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {product.coupon_rate_annual && (
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>{product.coupon_rate_annual}%</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>годовых</div>
                  </div>
                )}
                {product.duration_months && (
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{product.duration_months}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>месяцев</div>
                  </div>
                )}
              </div>

              {product.underlyings?.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {product.underlyings.map(ticker => (
                    <span key={ticker} style={{ padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {ticker}
                    </span>
                  ))}
                </div>
              )}

              {product.nominal_barrier && (
                <div style={{ display: 'flex', gap: '16px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '12px' }}>
                  {product.coupon_barrier && <div><span style={{ color: 'var(--text-muted)' }}>Купон: </span><span style={{ fontWeight: '600' }}>{product.coupon_barrier}%</span></div>}
                  <div><span style={{ color: 'var(--text-muted)' }}>Защита: </span><span style={{ fontWeight: '600' }}>{product.nominal_barrier}%</span></div>
                </div>
              )}

              <button className="btn-secondary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
                Подробнее →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно продукта */}
      {selectedProduct && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} onClick={() => setSelectedProduct(null)}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <span style={{ padding: '4px 12px', background: getTypeColor(selectedProduct.product_type), borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {selectedProduct.product_type}
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '12px' }}>{selectedProduct.name}</h2>
              </div>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {selectedProduct.coupon_rate_annual && (
                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Купон</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>{selectedProduct.coupon_rate_annual}% год.</div>
                </div>
              )}
              {selectedProduct.duration_months && (
                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Срок</div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>{selectedProduct.duration_months} мес</div>
                </div>
              )}
              {selectedProduct.min_investment && (
                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Мин. инвестиция</div>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>{Number(selectedProduct.min_investment).toLocaleString()} {selectedProduct.currency}</div>
                </div>
              )}
              {selectedProduct.commission_rate && (
                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Ваша комиссия</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-blue)' }}>{selectedProduct.commission_rate}%</div>
                </div>
              )}
            </div>

            {selectedProduct.underlyings?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Базовые активы</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedProduct.underlyings.map(ticker => (
                    <span key={ticker} style={{ padding: '8px 16px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>{ticker}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedProduct.nominal_barrier && (
              <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Барьеры</div>
                <div style={{ display: 'flex', gap: '24px' }}>
                  {selectedProduct.autocall_level && <div><span style={{ color: 'var(--text-secondary)' }}>Autocall: </span><span style={{ fontWeight: '600' }}>{selectedProduct.autocall_level}%</span></div>}
                  {selectedProduct.coupon_barrier && <div><span style={{ color: 'var(--text-secondary)' }}>Купон: </span><span style={{ fontWeight: '600' }}>{selectedProduct.coupon_barrier}%</span></div>}
                  <div><span style={{ color: 'var(--text-secondary)' }}>Защита: </span><span style={{ fontWeight: '600' }}>{selectedProduct.nominal_barrier}%</span></div>
                </div>
              </div>
            )}

            {selectedProduct.description && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>О продукте</div>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{selectedProduct.description}</p>
              </div>
            )}

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Для оформления сделки свяжитесь с менеджером
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

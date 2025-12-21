'use client';

import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    // TODO: Load from API
    // Mock data for now
    setTimeout(() => {
      setProducts([
        {
          sisin: 'N1AC-2024-001',
          internal_name: 'AUTOCALL Tech Giants',
          product_type: 'AUTOCALL',
          currency: 'USD',
          coupon_rate_annual: 12,
          duration_months: 12,
          nominal_barrier: 65,
          coupon_barrier: 70,
          autocall_level: 100,
          underlyings: ['AAPL', 'GOOGL', 'MSFT'],
          status: 'Active',
          start_date: '2024-01-15',
          maturity_date: '2025-01-15'
        },
        {
          sisin: 'N1AC-2024-002',
          internal_name: 'AUTOCALL Banks',
          product_type: 'AUTOCALL',
          currency: 'USD',
          coupon_rate_annual: 15,
          duration_months: 18,
          nominal_barrier: 60,
          coupon_barrier: 65,
          autocall_level: 100,
          underlyings: ['JPM', 'BAC', 'GS'],
          status: 'Active',
          start_date: '2024-02-01',
          maturity_date: '2025-08-01'
        },
        {
          sisin: 'N1FR-2024-001',
          internal_name: 'FIXRATE Note 8%',
          product_type: 'FIXRATE',
          currency: 'USD',
          coupon_rate_annual: 8,
          duration_months: 6,
          status: 'Active',
          start_date: '2024-03-01',
          maturity_date: '2024-09-01'
        },
        {
          sisin: 'N1CP-2024-001',
          internal_name: 'Capital Protection S&P500',
          product_type: 'CP',
          currency: 'USD',
          duration_months: 24,
          participation_rate: 120,
          underlyings: ['SPY'],
          status: 'Active',
          start_date: '2024-01-01',
          maturity_date: '2026-01-01'
        }
      ]);
      setLoading(false);
    }, 500);
  }

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.product_type === filter);

  const productTypes = [
    { value: 'all', label: 'Все продукты' },
    { value: 'AUTOCALL', label: 'AUTOCALL' },
    { value: 'FIXRATE', label: 'FIXRATE' },
    { value: 'CP', label: 'Capital Protection' }
  ];

  function getProductTypeColor(type) {
    switch(type) {
      case 'AUTOCALL': return 'var(--accent-blue)';
      case 'FIXRATE': return 'var(--success)';
      case 'CP': return 'var(--accent-purple)';
      default: return 'var(--text-muted)';
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
            📦 Витрина продуктов
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Доступные для продажи инвестиционные продукты
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px'
      }}>
        {productTypes.map(type => (
          <button
            key={type.value}
            onClick={() => setFilter(type.value)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: filter === type.value ? 'var(--accent-gradient)' : 'var(--bg-card)',
              color: filter === type.value ? 'white' : 'var(--text-secondary)',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Загрузка продуктов...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px'
        }}>
          {filteredProducts.map(product => (
            <div
              key={product.sisin}
              className="card"
              style={{ padding: '24px', cursor: 'pointer' }}
              onClick={() => setSelectedProduct(product)}
            >
              {/* Type badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <span style={{
                  padding: '4px 12px',
                  background: getProductTypeColor(product.product_type),
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {product.product_type}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)'
                }}>
                  {product.sisin}
                </span>
              </div>

              {/* Name */}
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                {product.internal_name}
              </h3>

              {/* Key metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px'
              }}>
                {product.coupon_rate_annual && (
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>
                      {product.coupon_rate_annual}%
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>годовых</div>
                  </div>
                )}
                {product.participation_rate && (
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-purple)' }}>
                      {product.participation_rate}%
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>участие</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {product.duration_months}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>месяцев</div>
                </div>
              </div>

              {/* Underlyings */}
              {product.underlyings && (
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '16px'
                }}>
                  {product.underlyings.map(ticker => (
                    <span key={ticker} style={{
                      padding: '4px 10px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)'
                    }}>
                      {ticker}
                    </span>
                  ))}
                </div>
              )}

              {/* Barriers */}
              {product.nominal_barrier && (
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Барьер купона: </span>
                    <span style={{ fontWeight: '600' }}>{product.coupon_barrier}%</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Барьер защиты: </span>
                    <span style={{ fontWeight: '600' }}>{product.nominal_barrier}%</span>
                  </div>
                </div>
              )}

              {/* Action */}
              <button
                className="btn-secondary"
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px'
                }}
              >
                Подробнее →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '32px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px'
            }}>
              <div>
                <span style={{
                  padding: '4px 12px',
                  background: getProductTypeColor(selectedProduct.product_type),
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {selectedProduct.product_type}
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '12px' }}>
                  {selectedProduct.internal_name}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  {selectedProduct.sisin}
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {selectedProduct.coupon_rate_annual && (
                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Купон</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>
                    {selectedProduct.coupon_rate_annual}% годовых
                  </div>
                </div>
              )}
              <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Срок</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>
                  {selectedProduct.duration_months} мес
                </div>
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Валюта</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>
                  {selectedProduct.currency}
                </div>
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Статус</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>
                  {selectedProduct.status}
                </div>
              </div>
            </div>

            {selectedProduct.underlyings && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Базовые активы
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedProduct.underlyings.map(ticker => (
                    <span key={ticker} style={{
                      padding: '8px 16px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {ticker}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProduct.nominal_barrier && (
              <div style={{
                padding: '16px',
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Барьеры
                </div>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Autocall: </span>
                    <span style={{ fontWeight: '600' }}>{selectedProduct.autocall_level}%</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Купон: </span>
                    <span style={{ fontWeight: '600' }}>{selectedProduct.coupon_barrier}%</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Защита: </span>
                    <span style={{ fontWeight: '600' }}>{selectedProduct.nominal_barrier}%</span>
                  </div>
                </div>
              </div>
            )}

            <p style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              Для оформления сделки свяжитесь с менеджером
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

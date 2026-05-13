'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [formState, setFormState] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLeadSubmit(e) {
    e.preventDefault();
    setFormState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      setFormState('success');
      setForm({ name: '', phone: '', email: '' });
    } catch (err) {
      setErrorMsg(err.message);
      setFormState('error');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 60px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-blue)' }}>N1</span>
          <span style={{ fontSize: '24px', fontWeight: '300', color: 'var(--text-primary)' }}>PRODUCTS</span>
        </div>

        <nav style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <a href="#products" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Продукты</a>
          <a href="#how" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Как это работает</a>
          <a href="#become-agent" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Стать агентом</a>
          <Link href="/login" className="btn-primary" style={{ padding: '10px 20px' }}>
            Войти
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '100px 60px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '24px'
          }}>
            Партнёрская программа<br />
            <span className="gradient-text">N1 Products</span>
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            marginBottom: '40px'
          }}>
            Зарабатывайте с каждой сделки. Готовые инвестиционные продукты
            с доходностью до 18% годовых. Прозрачные комиссии и поддержка на каждом этапе.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/login" className="btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>
              Войти в кабинет
            </Link>
            <a href="#become-agent" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '16px' }}>
              Стать агентом
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '400px',
            height: '300px',
            background: 'var(--accent-gradient)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '120px',
            opacity: '0.9'
          }}>
            💼
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '60px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {[
            { icon: '🛡️', title: 'Надёжность', desc: 'Лицензированный брокер с хранением активов в крупнейших депозитариях' },
            { icon: '📈', title: 'Доходность', desc: 'Инвестиционные продукты с доходностью до 18% годовых' },
            { icon: '💰', title: 'Комиссии', desc: 'Прозрачная система комиссий до 1% от каждой сделки' }
          ].map((item, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{
        padding: '80px 60px',
        background: 'var(--bg-secondary)',
        marginTop: '40px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '60px' }}>
            Как это работает
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px'
          }}>
            {[
              { num: '01', title: 'Заявка', desc: 'Оставьте заявку — менеджер свяжется с вами' },
              { num: '02', title: 'Доступ', desc: 'Получите приглашение в личный кабинет' },
              { num: '03', title: 'Продажи', desc: 'Предлагайте продукты клиентам' },
              { num: '04', title: 'Комиссия', desc: 'Получайте вознаграждение' }
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section id="products" style={{
        padding: '80px 60px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '16px' }}>
          Наши продукты
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '60px' }}>
          Полный каталог доступен в личном кабинете
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {[
            { type: 'AUTOCALL', rate: 'до 15%', term: '6-24 мес', risk: 'Средний' },
            { type: 'FIXRATE', rate: '8-10%', term: '3-12 мес', risk: 'Низкий' },
            { type: 'Capital Protection', rate: 'до 25%', term: '12-36 мес', risk: 'Низкий' }
          ].map((product, i) => (
            <div key={i} className="card" style={{ padding: '32px' }}>
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: 'var(--accent-gradient)',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                {product.type}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{product.rate}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>годовых</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <span>Срок: {product.term}</span>
                <span>Риск: {product.risk}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/login" className="btn-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
            Смотреть все продукты
          </Link>
        </div>
      </section>

      {/* Become Agent */}
      <section id="become-agent" style={{
        padding: '80px 60px',
        background: 'var(--bg-secondary)',
        marginTop: '40px'
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '12px' }}>
            Стать агентом
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '16px' }}>
            Оставьте заявку — менеджер свяжется с вами и откроет доступ к кабинету
          </p>

          {formState === 'success' ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Заявка отправлена</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Мы свяжемся с вами в ближайшее время
              </p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Ваше имя
                </label>
                <input
                  type="text"
                  required
                  placeholder="Иван Иванов"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Телефон
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+7 700 000 00 00"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="input-field"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="ivan@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {formState === 'error' && (
                <p style={{ color: 'var(--accent-red, #ef4444)', fontSize: '14px', margin: 0 }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={formState === 'loading'}
                style={{ padding: '14px', fontSize: '16px', width: '100%' }}
              >
                {formState === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 60px',
        borderTop: '1px solid var(--border-color)',
        marginTop: '60px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-blue)' }}>N1</span>
            <span style={{ fontSize: '20px', fontWeight: '300' }}>PRODUCTS</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            © 2026 N1 Products. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}

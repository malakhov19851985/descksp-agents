'use client';

import Link from 'next/link';

export default function HomePage() {
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
          <a href="#faq" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>FAQ</a>
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
            <a href="#how" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '16px' }}>
              Узнать больше
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
              { num: '01', title: 'Регистрация', desc: 'Получите доступ к личному кабинету' },
              { num: '02', title: 'Обучение', desc: 'Изучите продукты и материалы' },
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

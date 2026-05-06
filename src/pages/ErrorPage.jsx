import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <section style={{ 
      minHeight: '70vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '180px 20px 100px 20px',
      background: '#fafafa'
    }}>
      <div style={{
        fontSize: 'clamp(6rem, 15vw, 12rem)',
        fontWeight: '900',
        color: 'var(--tp-pink)',
        lineHeight: '1',
        marginBottom: '20px',
        letterSpacing: '-2px'
      }}>
        404
      </div>
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        color: 'var(--tp-dark)',
        marginBottom: '20px',
        fontWeight: '700'
      }}>
        Jejda! Tady nic není.
      </h1>
      <p style={{
        fontSize: '1.1rem',
        color: '#666',
        maxWidth: '500px',
        margin: '0 auto 40px auto',
        lineHeight: '1.6'
      }}>
        Stránka, kterou hledáte, se pravděpodobně přesunula, přejmenovala, nebo už zkrátka neexistuje.
      </p>
      <Link to="/" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
        Zpět na úvodní stránku
      </Link>
    </section>
  );
};

export default ErrorPage;

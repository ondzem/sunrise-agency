import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { supabase } from '../supabaseClient';
import './Login.css';

const LoginPage = () => {
  const container = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useGSAP(() => {
    gsap.fromTo('.login-container', 
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.2)' }
    );
  }, { scope: container });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('Špatný e-mail nebo heslo. Pokuste se znovu.');
    } else if (data.session) {
      // Úspěšně přihlášen - Roztřídění cest
      if (email.toLowerCase() === 'ondra.zeman05@gmail.com') {
        navigate('/portal/admin');
      } else {
        navigate('/online');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="login-wrapper" ref={container}>
      <div className="login-blob-1"></div>
      <div className="login-blob-2"></div>
      
      <div className="login-container">
        
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <Link to="/online" className="back-home-link" style={{ marginBottom: 0 }}>
            <span className="material-symbols-outlined">arrow_back</span>
            Zpět na výpis učitelů
          </Link>
        </div>

        <img src="/SLG bez textu logo.webp" alt="Sunrise Logo" className="login-logo" />
        <h1 className="login-title">Sunrise Portál</h1>
        <p className="login-subtitle">Zadejte své přihlašovací údaje</p>

        {errorMsg && <div style={{color: '#e53e3e', marginBottom: '1rem', fontWeight: 'bold'}}>{errorMsg}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Váš E-mail</label>
            <input 
              type="text" 
              id="email" 
              placeholder="jmeno@sunrise-la.cz" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Heslo</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-login" disabled={loading}>
            {loading ? 'Ověřování...' : 'Přihlásit se'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;

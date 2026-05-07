import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CustomModal from '../components/CustomModal';
import './AdminGenerator.css';

const AdminGeneratorPage = () => {
  const navigate = useNavigate();
  const [emailPrefix, setEmailPrefix] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [tutors, setTutors] = useState([]);
  
  // Custom Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    confirmText: '',
    cancelText: ''
  });

  // HARDCODED MASTER ADMIN EMAIL ZÁMEK 
  const MASTER_ADMIN_EMAIL = 'ondra.zeman05@gmail.com';

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || session.user.email !== MASTER_ADMIN_EMAIL) {
      setModal({
        isOpen: true,
        title: 'Přístup Zamítnut',
        message: `PŘÍSTUP ZAMÍTNUT: Tuto stránku může spravovat pouze ${MASTER_ADMIN_EMAIL}.`,
        type: 'danger',
        confirmText: 'Odejít',
        onClose: () => navigate('/portal')
      });
      return;
    }
    
    fetchTutors();
  };

  const fetchTutors = async () => {
    const { data, error } = await supabase.from('tutors').select('*').order('created_at', { ascending: false });
    if (data) setTutors(data);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ text: '', type: '' });

    const fullEmail = `${emailPrefix}@sunrise-la.cz`;

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: fullEmail,
        password: password,
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) {
        throw new Error('Nepodařilo se získat ID nového uživatele.');
      }

      // Explicitně vytvoříme záznam v tabulce tutors pro tohoto nového uživatele
      const { error: insertError } = await supabase.from('tutors').insert([
        { 
          id: userId, 
          name: emailPrefix, // Jako výchozí jméno dáme prefix
          email: fullEmail,  // Zásadní: musíme uložit e-mail, aby lektorovi chodily notifikace!
          is_visible: false // Nový lektor je zpočátku skrytý
        }
      ]);

      if (insertError) {
        console.error("Nepodařilo se vytvořit veřejný profil lektora:", insertError);
        // Nechceme vyhodit chybu, abychom nezablokovali flow, ale zalogujeme to.
      }

      setStatusMsg({ text: `Účet ${fullEmail} úspěšně vytvořen! Systém vás z bezpečnostních důvodů odhlašuje...`, type: 'success' });
      setEmailPrefix('');
      setPassword('');
      
      // Bezpečnostní Fix: Kvůli omezením frontendu Supabase automaticky přihlásí nově vytvořeného uživatele.
      // Abychom zamezili Master Adminovi upravovat kartu cizího lektora, okamžitě odhlásíme nového uživatele.
      setTimeout(async () => {
        await supabase.auth.signOut();
        setModal({
          isOpen: true,
          title: 'Lektor Vytvořen',
          message: `Lektor ${fullEmail} byl úspěšně zaevidován v databázi! Z bezpečnostních důvodů proběhlo odhlášení. Pro tvorbu dalšího lektora se prosím přihlaste znovu jako Master Admin.`,
          type: 'success',
          confirmText: 'Zpět na přihlášení',
          onConfirm: () => navigate('/portal'),
          onClose: () => navigate('/portal')
        });
      }, 1500);

    } catch (error) {
      console.error(error);
      setStatusMsg({ text: 'Chyba při tvorbě lektora: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const triggerDelete = (tutor) => {
    setModal({
      isOpen: true,
      title: 'Vymazat profil lektora?',
      message: `Opravdu chcete kompletně smazat veřejnou vizitku i všechna prezentační data lektora ${tutor.name || 'Neznámý'} (ID: ${tutor.id.substring(0,8)})? Tato akce je nevratná.`,
      type: 'danger',
      confirmText: 'Smazat natrvalo',
      cancelText: 'Zrušit',
      onConfirm: async () => {
        try {
          // Namísto prostého smazání z 'tutors' voláme zabezpečenou databázovou funkci,
          // která zlikviduje jak kartu 'tutors', tak přístupový profil v 'auth.users'.
          const { error } = await supabase.rpc('delete_user_safe', { target_uuid: tutor.id });
          if (error) throw error;
          
          // Smažeme z místního stavu seznamu
          setTutors(tutors.filter(t => t.id !== tutor.id));
          setStatusMsg({ text: `Profil a e-mailový účet lektora ${tutor.name || ''} by kompletně smazán ze systému!`, type: 'success' });
        } catch (error) {
          setModal({
            isOpen: true,
            title: 'Chyba při mazání',
            message: 'Nepodařilo se smazat profil: ' + error.message,
            type: 'danger'
          });
        }
      }
    });
  };

  return (
    <div className="admin-panel-wrapper">
      
      <header className="admin-header">
        <div className="admin-title-box">
          <h1>Master Admin Panel</h1>
          <p>Správa členských přístupů lektorů</p>
        </div>
        <button onClick={handleAdminLogout} className="logout-btn" style={{ cursor: 'pointer', border: 'none' }}>
          <span className="material-symbols-outlined">logout</span> Odhlásit se
        </button>
      </header>

      <main className="admin-grid">

        {/* TOP BANNERS PRO SPRÁVU */}
        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* BANNER 1: Úvodní stránka */}
          <div style={{ padding: '1.5rem', background: 'rgba(28, 156, 115, 0.1)', borderRadius: '12px', border: '1px solid #1C9C73', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#1C9C73', fontSize: '1.25rem' }}>Spravovat úvodní stránku</h3>
            <Link to="/portal/homepage" className="btn btn-admin-green">Spravovat →</Link>
          </div>

          {/* BANNER 2: Profily lektorů */}
          <div style={{ padding: '1.5rem', background: 'rgba(239, 103, 165, 0.1)', borderRadius: '12px', border: '1px solid var(--color-primary)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--color-primary)', fontSize: '1.25rem' }}>Správa profilů lektorů</h3>
            <Link to="/online" className="btn btn-primary" style={{ display: 'inline-block' }}>Spravovat →</Link>
          </div>

          {/* BANNER 3: Spravovat kurzy */}
          <div style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid #f59e0b', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#d97706', fontSize: '1.25rem' }}>Spravovat kurzy</h3>
            <Link to="/kurzy?admin=true" className="btn btn-admin-orange" style={{ display: 'inline-block' }}>Spravovat →</Link>
          </div>

          {/* BANNER 4: Firemní kurzy (Recenze) */}
          <div style={{ padding: '1.5rem', background: 'rgba(43, 108, 176, 0.1)', borderRadius: '12px', border: '1px solid #2b6cb0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2b6cb0', fontSize: '1.25rem' }}>Spravovat recenze – Firemní kurzy</h3>
            <Link to="/portal/company-admin" className="btn btn-admin-blue" style={{ display: 'inline-block' }}>Spravovat →</Link>
          </div>

          {/* BANNER 5: English Club */}
          <div style={{ padding: '1.5rem', background: 'rgba(71, 85, 105, 0.1)', borderRadius: '12px', border: '1px solid #475569', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#475569', fontSize: '1.25rem' }}>Spravovat English Club</h3>
            <Link to="/english-club?admin=true" className="btn btn-admin-gray" style={{ display: 'inline-block', backgroundColor: '#475569', color: 'white', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>Spravovat →</Link>
          </div>

          {/* BANNER 6: Letní program */}
          <div style={{ padding: '1.5rem', background: 'rgba(239, 103, 165, 0.1)', borderRadius: '12px', border: '1px solid var(--color-primary)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--color-primary)', fontSize: '1.25rem' }}>Spravovat letní program</h3>
            <Link to="/letni-program?admin=true" className="btn btn-primary" style={{ display: 'inline-block' }}>Spravovat →</Link>
          </div>
        </div>
        
        {/* LEVÁ ČÁST - Generování */}
        <section className="admin-card">
          <h2><span className="material-symbols-outlined text-magenta">person_add</span> Nový Lektor</h2>
          
          {statusMsg.text && (
            <div style={{
              padding: '1rem', 
              marginBottom: '1.5rem', 
              borderRadius: '8px', 
              backgroundColor: statusMsg.type === 'error' ? '#fff5f5' : '#e6fffa',
              color: statusMsg.type === 'error' ? '#e53e3e' : '#2b6cb0',
              fontWeight: '500'
            }}>
              {statusMsg.text}
            </div>
          )}

          <form className="admin-form" onSubmit={handleGenerate}>
            <div className="form-group">
              <label>Přihlašovací E-mail (Identifikátor)</label>
              <div className="email-input-group">
                <input type="text" value={emailPrefix} onChange={e => setEmailPrefix(e.target.value.toLowerCase().replace(/\s+/g, ''))} placeholder="jan.novak" required />
                <span className="email-addon">@sunrise-la.cz</span>
              </div>
            </div>

            <div className="form-group">
              <label>Nastavit výchozí heslo</label>
              <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Např. Sunrise2026!" minLength="6" required />
            </div>

            <button type="submit" className="btn btn-primary btn-generate" disabled={loading}>
              {loading ? 'Zakládám systémový záznam...' : 'Vytvořit Přístup'}
            </button>
          </form>
        </section>

        {/* PRAVÁ ČÁST - Seznam existujících z DB */}
        <section className="admin-card">
          <h2><span className="material-symbols-outlined text-secondary">group</span> Aktivní přístupy</h2>
          
          <div className="tutor-list">
            {tutors.length === 0 ? (
              <p style={{color: '#888', fontStyle: 'italic'}}>Zatím žádní lektoři v systému.</p>
            ) : (
              tutors.map(tutor => (
                <div className="tutor-list-item" key={tutor.id}>
                  <div className="tli-avatar">{tutor.name ? tutor.name.charAt(0) : '?'}</div>
                  <div className="tli-info" style={{flexGrow: 1}}>
                    <div className="tli-name">{tutor.name || 'Jméno nezadáno'}</div>
                    <div className="tli-email" style={{fontSize: '0.75rem', color: '#999'}}>ID: {tutor.id.substring(0,8)}...</div>
                  </div>
                  <button 
                    onClick={() => triggerDelete(tutor)} 
                    style={{background:'none', border:'none', color:'#e53e3e', padding:'0.5rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'6px', transition:'background 0.2s'}}
                    onMouseOver={(e) => e.target.style.background = '#fff5f5'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                    title="Odstranit profil z veřejného zobrazení"
                  >
                    <span className="material-symbols-outlined" style={{pointerEvents:'none'}}>delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      {/* CUSTOM MODAL */}
      <CustomModal 
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
        onClose={() => {
          setModal({ ...modal, isOpen: false });
          if(modal.onClose) modal.onClose();
        }}
      />
    </div>
  );
};

export default AdminGeneratorPage;

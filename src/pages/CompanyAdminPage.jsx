import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CustomModal from '../components/CustomModal';
import './HomepageAdmin.css';

const CompanyAdminPage = () => {
  const navigate = useNavigate();
  const MASTER_ADMIN_EMAIL = 'ondra.zeman05@gmail.com';
  
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  
  const [testimForm, setTestimForm] = useState({ id: null, author: '', role: '', text: '', order_index: 0 });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });

  useEffect(() => {
    checkAccessAndFetchData();
  }, []);

  const checkAccessAndFetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== MASTER_ADMIN_EMAIL) {
      navigate('/online');
      return;
    }
    
    await fetchTestimonials();
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchTestimonials = async () => {
    const { data } = await supabase.from('company_testimonials').select('*').order('order_index', { ascending: true });
    if (data) setTestimonials(data);
  };

  const saveTestimonial = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        author: testimForm.author,
        role: testimForm.role,
        text: testimForm.text,
        order_index: testimForm.order_index
      };

      if (testimForm.id) {
        const { error } = await supabase.from('company_testimonials').update(payload).eq('id', testimForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('company_testimonials').insert([payload]);
        if (error) throw error;
      }
      
      setTestimForm({ id: null, author: '', role: '', text: '', order_index: 0 });
      await fetchTestimonials();
      setModal({ isOpen: true, title: 'Úspěch', message: 'Uloženo!', type: 'success' });
    } catch (err) {
      console.error(err);
      setModal({ isOpen: true, title: 'Chyba', message: 'Chyba: ' + err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const editTestimonial = (t) => {
    setTestimForm(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteTestimonial = (id) => {
    setModal({
      isOpen: true,
      title: 'Odstranit recenzi?',
      message: 'Opravdu chcete tuto recenzi odstranit?',
      type: 'danger',
      confirmText: 'Smazat',
      cancelText: 'Zrušit',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('company_testimonials').delete().eq('id', id);
          if (error) throw error;
          await fetchTestimonials();
          setModal({ ...modal, isOpen: false });
        } catch (err) {
          console.error(err);
          setModal({ isOpen: true, title: 'Chyba', message: 'Chyba: ' + err.message, type: 'danger' });
        }
      }
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) return <div style={{padding: '3rem', textAlign: 'center'}}>Načítání...</div>;

  return (
    <div className="homepage-admin-wrapper">
      <header className="homepage-admin-header">
        <div className="homepage-admin-title">
          <h1>Správa Firemních Kurzů</h1>
          <p>Úpravy sekce Co říkají firmy z Pardubic</p>
        </div>
        <div className="homepage-admin-actions">
          <Link to="/portal/admin" className="btn-back">
            <span className="material-symbols-outlined">arrow_back</span> Zpět do Master Admin
          </Link>
          <button onClick={handleLogout} className="btn-back" style={{ background: '#fff5f5', color: '#e53e3e', border: 'none', cursor: 'pointer' }}>
            <span className="material-symbols-outlined">logout</span> Odhlásit se
          </button>
        </div>
      </header>

      {/* TESTIMONIALS SECTION */}
      <section className="admin-section" id="testimonials-section">
        <h2><span className="material-symbols-outlined" style={{ color: '#EF67A5' }}>format_quote</span> Správa recenzí</h2>
        <div className="admin-grid-layout">
          <form className="admin-form" onSubmit={saveTestimonial}>
            <h3>{testimForm.id ? 'Upravit recenzi' : 'Přidat novou recenzi'}</h3>
            
            <div className="form-group">
              <label>Jméno a Příjmení</label>
              <input type="text" value={testimForm.author} onChange={e => setTestimForm({...testimForm, author: e.target.value})} required placeholder="Např. Karolína Kopa" />
            </div>
            <div className="form-group">
              <label>Pozice / Firma (Podtitulek)</label>
              <input type="text" value={testimForm.role} onChange={e => setTestimForm({...testimForm, role: e.target.value})} placeholder="Např. HR Specialist, RETIA" />
            </div>
            <div className="form-group">
              <label>Text recenze</label>
              <textarea value={testimForm.text} onChange={e => setTestimForm({...testimForm, text: e.target.value})} required rows="3" placeholder="S Lucií Tomkovou máme ve firmě velmi dobrou zkušenost..." />
            </div>
            <div className="form-group">
              <label>Pořadí zobrazení (číslo pro řazení)</label>
              <input type="number" value={testimForm.order_index} onChange={e => setTestimForm({...testimForm, order_index: parseInt(e.target.value) || 0})} />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {testimForm.id ? 'Uložit změny' : 'Přidat recenzi'}
            </button>
            {testimForm.id && (
              <button type="button" onClick={() => setTestimForm({ id: null, author: '', role: '', text: '', order_index: 0 })} style={{background: 'none', border: 'none', color: '#666', marginTop: '1rem', width: '100%', cursor: 'pointer'}}>Zrušit úpravy</button>
            )}
          </form>

          <div className="admin-list">
            {testimonials.length === 0 ? <p style={{color: '#888'}}>Zatím žádné recenze</p> : testimonials.map(t => (
              <div className="admin-list-item" key={t.id}>
                <div className="item-main-row">
                  <div className="item-avatar">{getInitials(t.author)}</div>
                  <div className="item-info">
                    <div className="item-title">{t.author}</div>
                    <div className="item-subtitle">{t.role}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#444', fontStyle: 'italic', margin: '15px 0', borderLeft: '3px solid #eee', paddingLeft: '10px' }}>
                  "{t.text.length > 80 ? t.text.substring(0, 80) + '...' : t.text}"
                </p>
                <div className="item-actions">
                  <button onClick={() => editTestimonial(t)} className="btn-icon edit" title="Upravit"><span className="material-symbols-outlined">edit</span></button>
                  <button onClick={() => deleteTestimonial(t.id)} className="btn-icon delete" title="Smazat"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CustomModal 
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
};

export default CompanyAdminPage;

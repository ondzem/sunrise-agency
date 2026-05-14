import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CustomModal from '../components/CustomModal';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/canvasUtils';
import './HomepageAdmin.css';

const HomepageAdminPage = () => {
  const navigate = useNavigate();
  const MASTER_ADMIN_EMAIL = 'info@sunrise-la.cz';
  
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [news, setNews] = useState([]);

  
  // Forms State
  const [teamForm, setTeamForm] = useState({ id: null, name: '', qualifications: '', description: '', teaching_focus: '', image_url: '', order_index: 0 });
  const [teamImageFile, setTeamImageFile] = useState(null);
  const [teamImagePreview, setTeamImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [testimForm, setTestimForm] = useState({ id: null, author: '', role: '', text: '', order_index: 0 });

  // News State
  const [newsForm, setNewsForm] = useState({ id: null, title: '', content: '', banner_text: '', image_url: '', is_visible: true, is_main: false });
  const [newsImageFile, setNewsImageFile] = useState(null);
  const [newsImagePreview, setNewsImagePreview] = useState(null);
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [isNewsDragging, setIsNewsDragging] = useState(false);

  // Crop image states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState(null); // 'news' or 'team'

  const [badgeTop, setBadgeTop] = useState('Letní Program');
  const [badgeBottom, setBadgeBottom] = useState('10. srpna 2026');
  const [isSavingBadge, setIsSavingBadge] = useState(false);

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
    
    await fetchTeam();
    await fetchTestimonials();
    await fetchNews();
    await fetchBadge();
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchTeam = async () => {
    const { data } = await supabase.from('homepage_team').select('*').order('order_index', { ascending: true });
    if (data) setTeam(data);
  };

  const fetchTestimonials = async () => {
    const { data } = await supabase.from('homepage_testimonials').select('*').order('order_index', { ascending: true });
    if (data) setTestimonials(data);
  };

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (data) setNews(data);
  };

  const fetchBadge = async () => {
    const { data } = await supabase.from('courses_config').select('*').eq('option_id', 'homepage_badge').single();
    if (data) {
      if (data.price) setBadgeTop(data.price);
      if (data.time) setBadgeBottom(data.time);
    }
  };

  const saveBadge = async (e) => {
    e.preventDefault();
    setIsSavingBadge(true);
    try {
      const payload = {
        option_id: 'homepage_badge',
        price: badgeTop,
        time: badgeBottom
      };
      const { error } = await supabase.from('courses_config').upsert(payload);
      if (error) throw error;
      setModal({ isOpen: true, title: 'Úspěch', message: 'Štítek byl úspěšně uložen.', type: 'success' });
    } catch (err) {
      setModal({ isOpen: true, title: 'Chyba', message: 'Chyba: ' + err.message, type: 'danger' });
    } finally {
      setIsSavingBadge(false);
    }
  };

  // --- TEAM LOGIC ---
  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const handleTeamImageDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setCropTarget('team');
      setIsCropModalOpen(true);
    }
  };
  const handleTeamImageSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setCropTarget('team');
      setIsCropModalOpen(true);
      e.target.value = null;
    }
  };

  const saveTeamMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = teamForm.image_url;

      if (teamImageFile) {
        const fileExt = teamImageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `team/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('homepage_images').upload(filePath, teamImageFile);
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('homepage_images').getPublicUrl(filePath);
        finalImageUrl = publicUrl;
      }

      const payload = {
        name: teamForm.name,
        qualifications: teamForm.qualifications,
        description: teamForm.description,
        teaching_focus: teamForm.teaching_focus,
        image_url: finalImageUrl,
        order_index: teamForm.order_index
      };

      if (teamForm.id) {
        await supabase.from('homepage_team').update(payload).eq('id', teamForm.id);
      } else {
        await supabase.from('homepage_team').insert([payload]);
      }
      
      setTeamForm({ id: null, name: '', qualifications: '', description: '', teaching_focus: '', image_url: '', order_index: 0 });
      setTeamImageFile(null);
      setTeamImagePreview(null);
      await fetchTeam();      setModal({ isOpen: true, title: 'Úspěch', message: 'Uloženo!', type: 'success' });
      fetchTeam();
    } catch (err) {
      console.error(err);
      setModal({ isOpen: true, title: 'Chyba', message: 'Chyba: ' + err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const editTeamMember = (t) => {
    setTeamForm(t);
    setTeamImagePreview(t.image_url);
    setTeamImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteTeamMember = (id) => {
    setModal({
      isOpen: true,
      title: 'Odstranit lektora?',
      message: 'Opravdu chcete tohoto lektora odstranit z domovské stránky?',
      type: 'danger',
      confirmText: 'Smazat',
      cancelText: 'Zrušit',
      onConfirm: async () => {
        await supabase.from('homepage_team').delete().eq('id', id);
        await fetchTeam();
        setModal({ ...modal, isOpen: false });
      }
    });
  };

  // --- NEWS LOGIC ---
  const handleNewsImageDrop = async (e) => {
    e.preventDefault();
    setIsNewsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setCropTarget('news');
      setIsCropModalOpen(true);
    }
  };
  
  const handleNewsImageSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setCropTarget('news');
      setIsCropModalOpen(true);
      e.target.value = null; // reset
    }
  };

  const showCroppedImage = async () => {
    try {
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      const res = await fetch(croppedImageBase64);
      const blob = await res.blob();
      
      if (cropTarget === 'news') {
        const file = new File([blob], "cropped_news.jpg", { type: "image/jpeg" });
        setNewsImageFile(file);
        setNewsImagePreview(croppedImageBase64);
      } else if (cropTarget === 'team') {
        const file = new File([blob], "cropped_team.jpg", { type: "image/jpeg" });
        setTeamImageFile(file);
        setTeamImagePreview(croppedImageBase64);
      }
      
      setIsCropModalOpen(false);
      setCropTarget(null);
    } catch (e) {
      console.error(e);
      setModal({ isOpen: true, title: 'Chyba', message: 'Chyba při ořezávání obrázku.', type: 'danger' });
    }
  };

  const saveNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = newsForm.image_url;

      if (newsImageFile) {
        const fileExt = newsImageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('news-images').upload(filePath, newsImageFile);
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(filePath);
        finalImageUrl = publicUrl;
      }

      // If set as main, disable main on others
      if (newsForm.is_main) {
        await supabase.from('news').update({ is_main: false }).neq('id', '00000000-0000-0000-0000-000000000000');
      }

      const payload = {
        title: newsForm.title,
        content: newsForm.content,
        banner_text: newsForm.banner_text,
        image_url: finalImageUrl,
        is_visible: newsForm.is_visible,
        is_main: newsForm.is_main
      };

      if (newsForm.id) {
        await supabase.from('news').update(payload).eq('id', newsForm.id);
      } else {
        await supabase.from('news').insert([payload]);
      }
      
      setNewsForm({ id: null, title: '', content: '', banner_text: '', is_visible: true, is_main: false, image_url: '' });
      setIsEditingNews(false);
      setModal({ isOpen: true, title: 'Úspěch', message: 'Aktualita uložena!', type: 'success' });
      fetchNews();
    } catch (err) {
      console.error(err);
      setModal({ isOpen: true, title: 'Chyba', message: 'Chyba: ' + err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const editNewsItem = (n) => {
    setNewsForm(n);
    setNewsImagePreview(n.image_url);
    setNewsImageFile(null);
    setIsEditingNews(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteNewsItem = (id) => {
    setModal({
      isOpen: true,
      title: 'Odstranit aktualitu?',
      message: 'Opravdu chcete tuto aktualitu smazat?',
      type: 'danger',
      confirmText: 'Smazat',
      cancelText: 'Zrušit',
      onConfirm: async () => {
        await supabase.from('news').delete().eq('id', id);
        await fetchNews();
        setModal({ ...modal, isOpen: false });
      }
    });
  };

  const resetNewsForm = () => {
    setNewsForm({ id: null, title: '', content: '', banner_text: '', image_url: '', is_visible: true, is_main: false });
    setNewsImageFile(null);
    setNewsImagePreview(null);
    setIsEditingNews(false);
  };

  // --- TESTIMONIALS LOGIC ---
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
        const { error } = await supabase.from('homepage_testimonials').update(payload).eq('id', testimForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('homepage_testimonials').insert([payload]);
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
    window.scrollTo({ top: document.getElementById('testimonials-section').offsetTop, behavior: 'smooth' });
  };

  const deleteTestimonial = (id) => {
    setModal({
      isOpen: true,
      title: 'Odstranit recenzi?',
      message: 'Opravdu chcete tuto recenzi odstranit z domovské stránky?',
      type: 'danger',
      confirmText: 'Smazat',
      cancelText: 'Zrušit',
      onConfirm: async () => {
        await supabase.from('homepage_testimonials').delete().eq('id', id);
        await fetchTestimonials();
        setModal({ ...modal, isOpen: false });
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

  if (loading && team.length === 0) return <div style={{padding: '3rem', textAlign: 'center'}}>Načítání...</div>;

  return (
    <div className="homepage-admin-wrapper">
      <header className="homepage-admin-header">
        <div className="homepage-admin-title">
          <h1>Správa Úvodní Stránky</h1>
          <p>Úpravy sekcí Naši lektoři a Co říkají klienti</p>
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

      {/* SECTION HERO BADGE */}
      <section className="admin-section" style={{ marginBottom: '40px' }}>
        <h2><span className="material-symbols-outlined" style={{ color: '#EF67A5' }}>edit_attributes</span> Sekce: Úvodní Štítek (Plovoucí karta)</h2>
        <form className="admin-form full-width" onSubmit={saveBadge} style={{ background: '#f9fafb', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: '700' }}>Horní text</label>
              <input type="text" value={badgeTop} onChange={e => setBadgeTop(e.target.value)} placeholder="Např. Letní Program" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', width: '100%' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: '700' }}>Spodní text (Datum/Popis)</label>
              <input type="text" value={badgeBottom} onChange={e => setBadgeBottom(e.target.value)} placeholder="Např. 10. srpna - 15. srpna" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', width: '100%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" disabled={isSavingBadge} style={{ background: 'var(--color-primary)', padding: '12px 32px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
              {isSavingBadge ? 'Ukládám...' : 'Uložit štítek'}
            </button>
          </div>
        </form>
      </section>

      {/* SECTION NEWS */}
      <section className="admin-section" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2><span className="material-symbols-outlined" style={{ color: '#EF67A5' }}>campaign</span> Sekce: Aktuality</h2>
          {!isEditingNews && (
            <button onClick={() => setIsEditingNews(true)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              + Přidat novou aktualitu
            </button>
          )}
        </div>

        {isEditingNews ? (
          <form className="admin-form full-width" onSubmit={saveNews} style={{ background: '#f9fafb', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
              <button type="button" onClick={resetNewsForm} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>arrow_back</span> Zpět na seznam
              </button>
              <h3 style={{ margin: 0 }}>{newsForm.id ? 'Upravit aktualitu' : 'Nová aktualita'}</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <label style={{ fontWeight: '700', marginBottom: '5px', display: 'block' }}>Viditelná na webu?</label>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Pokud vypnete, skryje se z veřejného webu.</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={newsForm.is_visible} onChange={e => setNewsForm({...newsForm, is_visible: e.target.checked})} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <label style={{ fontWeight: '700', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>Hlavní oznámení <span style={{ background: 'var(--color-primary)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>BANNER</span></label>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Nastaví tuto aktualitu do horní lišty.</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={newsForm.is_main} onChange={e => setNewsForm({...newsForm, is_main: e.target.checked})} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '25px' }}>
              <div className="form-group">
                <label style={{ fontWeight: '700' }}>Text do růžové lišty (Banner)</label>
                <input type="text" value={newsForm.banner_text} onChange={e => setNewsForm({...newsForm, banner_text: e.target.value})} placeholder="Např. Rušíme páteční lekci 15.6." style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', width: '100%' }} />
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '25px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Detail Aktuality (Stránka)</h4>
              <div className="form-group">
                <label style={{ fontWeight: '700' }}>Hlavní nadpis</label>
                <input type="text" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} placeholder="Nadpis aktuality..." required style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', width: '100%' }} />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: '700' }}>Text aktuality</label>
                <textarea value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} placeholder="Detailní popis..." style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', width: '100%', minHeight: '150px' }} />
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <label style={{ fontWeight: '700', margin: 0 }}>Fotografie k aktualitě</label>
                {(newsImagePreview || newsForm.image_url) && (
                  <button type="button" onClick={() => { setNewsImageFile(null); setNewsImagePreview(null); setNewsForm({...newsForm, image_url: ''}); }} style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Odstranit fotku</button>
                )}
              </div>
              <div 
                className={`image-upload-zone ${isNewsDragging ? 'drag-active' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsNewsDragging(true); }}
                onDragLeave={() => setIsNewsDragging(false)}
                onDrop={handleNewsImageDrop}
                onClick={() => document.getElementById('newsImgInput').click()}
                style={{ width: '100%', maxWidth: '100%', height: newsImagePreview ? 'auto' : '200px', padding: newsImagePreview ? '0' : '20px' }}
              >
                {newsImagePreview ? (
                  <img src={newsImagePreview} alt="Preview" style={{ width: '100%', maxWidth: '300px', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '8px', margin: '0 auto', display: 'block' }} />
                ) : (
                  <div>
                    <span className="material-symbols-outlined" style={{fontSize: '2rem', color: '#ccc'}}>cloud_upload</span>
                    <p>Klikněte nebo přetáhněte fotku sem</p>
                  </div>
                )}
                <input type="file" id="newsImgInput" style={{display: 'none'}} accept="image/*" onChange={handleNewsImageSelect} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => window.open('/aktuality', '_blank')} className="btn-outline" style={{ padding: '12px 24px', borderRadius: '8px' }}>
                Zobrazit web ↗
              </button>
              <button type="submit" className="btn-primary" disabled={loading} style={{ background: 'var(--color-primary)', padding: '12px 32px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold' }}>
                {loading ? 'Ukládám...' : 'Uložit změny'}
              </button>
            </div>
          </form>
        ) : (
          <div className="admin-list" style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {news.length === 0 ? <p style={{color: '#888'}}>Žádné aktuality k zobrazení.</p> : news.map(n => (
              <div className="admin-list-item" key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 20px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: n.is_visible ? '#10b981' : '#ccc' }} title={n.is_visible ? 'Viditelné' : 'Skryté'}></div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {n.title || 'Bez názvu'} 
                      {n.is_main && <span style={{ background: 'var(--color-primary)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px' }}>BANNER</span>}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '4px' }}>
                      {n.content ? (n.content.length > 60 ? n.content.substring(0, 60) + '...' : n.content) : (n.banner_text || 'Bez textu')}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => editNewsItem(n)} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Upravit</button>
                  <button onClick={() => deleteNewsItem(n.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '600', cursor: 'pointer' }}>Smazat</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION TEAM */}
      <section className="admin-section" style={{ display: 'none' }}>
        <h2><span className="material-symbols-outlined">school</span> Sekce: Naši lektoři</h2>
        <div className="admin-grid-layout">
          <form className="admin-form" onSubmit={saveTeamMember}>
            <h3>{teamForm.id ? 'Upravit lektora' : 'Přidat nového lektora'}</h3>
            
            <div className="form-group">
              <label>Jméno lektora</label>
              <input type="text" value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Titul / Vystudoval (např. Mgr. anglická filozofie)</label>
              <input type="text" value={teamForm.qualifications} onChange={e => setTeamForm({...teamForm, qualifications: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Co učí</label>
              <input type="text" value={teamForm.teaching_focus} onChange={e => setTeamForm({...teamForm, teaching_focus: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Krátký popis</label>
              <textarea value={teamForm.description} onChange={e => setTeamForm({...teamForm, description: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label>Profilová fotka</label>
              <div 
                className={`image-upload-zone ${isDragging ? 'drag-active' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleTeamImageDrop}
                onClick={() => document.getElementById('teamImgInput').click()}
              >
                {teamImagePreview ? (
                  <img src={teamImagePreview} alt="Preview" className="preview-img" />
                ) : (
                  <div>
                    <span className="material-symbols-outlined" style={{fontSize: '2rem', color: '#ccc'}}>cloud_upload</span>
                    <p>Klikněte nebo přetáhněte fotku sem</p>
                  </div>
                )}
                <input type="file" id="teamImgInput" style={{display: 'none'}} accept="image/*" onChange={handleTeamImageSelect} />
              </div>
            </div>

            <div className="form-group">
              <label>Pořadí (číslo pro řazení)</label>
              <input type="number" value={teamForm.order_index} onChange={e => setTeamForm({...teamForm, order_index: parseInt(e.target.value) || 0})} />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Ukládám...' : 'Uložit lektora'}
            </button>
            {teamForm.id && (
              <button type="button" onClick={() => { setTeamForm({ id: null, name: '', qualifications: '', description: '', teaching_focus: '', image_url: '', order_index: 0 }); setTeamImagePreview(null); }} style={{background: 'none', border: 'none', color: '#666', marginTop: '1rem', width: '100%', cursor: 'pointer'}}>Zrušit úpravy</button>
            )}
          </form>

          <div className="admin-list">
            {team.length === 0 ? <p style={{color: '#888'}}>Žádní lektoři</p> : team.map(t => (
              <div className="admin-list-item" key={t.id}>
                <div className="item-main-row">
                  {t.image_url ? (
                    <img src={t.image_url} alt="avatar" className="item-avatar" />
                  ) : (
                    <div className="item-avatar">{getInitials(t.name)}</div>
                  )}
                  <div className="item-info">
                    <div className="item-title">{t.name}</div>
                    <div className="item-subtitle">{t.qualifications}</div>
                  </div>
                </div>
                <div className="item-actions">
                  <button onClick={() => editTeamMember(t)} className="btn-icon edit" title="Upravit"><span className="material-symbols-outlined">edit</span></button>
                  <button onClick={() => deleteTeamMember(t.id)} className="btn-icon delete" title="Smazat"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION TESTIMONIALS */}
      <section className="admin-section" id="testimonials-section">
        <h2><span className="material-symbols-outlined">forum</span> Sekce: Co říkají naši klienti</h2>
        <div className="admin-grid-layout">
          <form className="admin-form" onSubmit={saveTestimonial}>
            <h3>{testimForm.id ? 'Upravit recenzi' : 'Přidat novou recenzi'}</h3>
            
            <div className="form-group">
              <label>Jméno autora</label>
              <input type="text" value={testimForm.author} onChange={e => setTestimForm({...testimForm, author: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Kontext / Odkud je (např. Game night)</label>
              <input type="text" value={testimForm.role} onChange={e => setTestimForm({...testimForm, role: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Text recenze</label>
              <textarea value={testimForm.text} onChange={e => setTestimForm({...testimForm, text: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Pořadí (číslo pro řazení)</label>
              <input type="number" value={testimForm.order_index} onChange={e => setTestimForm({...testimForm, order_index: parseInt(e.target.value) || 0})} />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Ukládám...' : 'Uložit recenzi'}
            </button>
            {testimForm.id && (
              <button type="button" onClick={() => setTestimForm({ id: null, author: '', role: '', text: '', order_index: 0 })} style={{background: 'none', border: 'none', color: '#666', marginTop: '1rem', width: '100%', cursor: 'pointer'}}>Zrušit úpravy</button>
            )}
          </form>

          <div className="admin-list">
            {testimonials.length === 0 ? <p style={{color: '#888'}}>Žádné recenze</p> : testimonials.map(t => (
              <div className="admin-list-item" key={t.id}>
                <div className="item-main-row">
                  <div className="item-avatar" style={{backgroundColor: '#1C9C73'}}>{getInitials(t.author)}</div>
                  <div className="item-info">
                    <div className="item-title">{t.author} <span style={{fontWeight: 'normal', fontSize: '0.85rem', color: '#888'}}>({t.role})</span></div>
                    <div className="item-subtitle">{t.text.length > 60 ? t.text.substring(0, 60) + '...' : t.text}</div>
                  </div>
                </div>
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

      {/* CROPPER MODAL (Nahrávání fotky) */}
      {isCropModalOpen && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.85)', zIndex:99999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
          <div style={{position:'relative', width:'90%', maxWidth:'500px', height:'500px', background:'#fff', borderRadius:'8px 8px 0 0', overflow:'hidden'}}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={cropTarget === 'team' ? 1/1 : 3/4}
              cropShape={cropTarget === 'team' ? "round" : "rect"}
              onCropChange={setCrop}
              onCropComplete={(cA, cAP) => setCroppedAreaPixels(cAP)}
              onZoomChange={setZoom}
            />
          </div>
          <div style={{padding:'1.5rem', background:'#fff', borderRadius:'0 0 8px 8px', width:'90%', maxWidth:'500px'}}>
            <label style={{fontSize:'0.8rem', fontWeight:'bold', color:'#333'}}>Přiblížení (Zoom)</label>
            <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} style={{width:'100%', margin:'0.5rem 0 1.5rem'}} />
            <button onClick={showCroppedImage} style={{padding:'1rem', width:'100%', background:'var(--color-primary)', color:'white', border:'none', borderRadius:'8px', fontWeight:'800', cursor:'pointer', textTransform:'uppercase'}}>Vyříznout a uložit</button>
            <button onClick={() => { setIsCropModalOpen(false); setCropTarget(null); }} style={{padding:'0.5rem 1rem', width:'100%', background:'transparent', color:'#888', border:'none', cursor:'pointer', marginTop:'0.5rem', fontWeight:'bold'}}>Zrušit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageAdminPage;

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './NewsPage.css';

const formatTextWithLinks = (text) => {
  if (!text) return '';
  // Záchyt odkazů s http/https i těch, které začínají www. nebo jen doménou
  const urlRegex = /(https?:\/\/[^\s]+|(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
  
  let formattedText = text.replace(urlRegex, (url) => {
    // Pokud odkaz nezačíná http nebo https, automaticky ho přidáme pro href, aby správně fungoval
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    
    // Vyčistíme případnou tečku nebo čárku na konci URL (když je odkaz na konci věty)
    const cleanUrl = url.replace(/[.,;!?]$/, '');
    const cleanHref = href.replace(/[.,;!?]$/, '');
    
    return `<a href="${cleanHref}" target="_blank" rel="noopener noreferrer" style="color: var(--tp-pink); text-decoration: underline; font-weight: 600;">${cleanUrl}</a>`;
  });
  
  return formattedText.replace(/\n/g, '<br/>');
};

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllNews();
  }, []);

  const fetchAllNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_visible', true)
        .order('is_main', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setNewsList(data);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="news-page-container"><p style={{textAlign: 'center', marginTop: '150px'}}>Načítání aktualit...</p></div>;
  if (!newsList || newsList.length === 0) return <div className="news-page-container"><p style={{textAlign: 'center', marginTop: '150px'}}>Aktuálně zde nejsou žádná hlavní oznámení.</p></div>;

  return (
    <div className="news-page-container fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
        {newsList.map((news) => {
          const hasImage = !!news.image_url;
          return (
            <div key={news.id} style={{ paddingBottom: '80px', borderBottom: '1px solid #eee' }}>
              {hasImage ? (
                <div className="news-layout-split">
                  <div className="news-text-content">
                    <h2 className="news-page-title">{news.title}</h2>
                    <div className="news-body" dangerouslySetInnerHTML={{ __html: formatTextWithLinks(news.content) }} />
                  </div>
                  <div className="news-image-content">
                    <img src={news.image_url} alt={news.title} loading="lazy" />
                  </div>
                </div>
              ) : (
                <div className="news-layout-centered">
                  <h2 className="news-page-title">{news.title}</h2>
                  <div className="news-body" dangerouslySetInnerHTML={{ __html: formatTextWithLinks(news.content) }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsPage;

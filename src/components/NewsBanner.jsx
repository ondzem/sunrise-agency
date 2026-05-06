import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './NewsBanner.css';

const NewsBanner = () => {
  const [news, setNews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMainNews();
  }, []);

  const fetchMainNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_visible', true)
        .eq('is_main', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data) {
        setNews(data);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  if (!news || !news.banner_text) return null;

  return (
    <div className="news-banner">
      <div className="news-banner-content">
        <span className="news-banner-text">{news.banner_text}</span>
        <button className="news-banner-btn" onClick={() => navigate('/aktuality')}>
          Zjistit více
        </button>
      </div>
    </div>
  );
};

export default NewsBanner;

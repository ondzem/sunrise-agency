import React, { Suspense, lazy } from 'react';
import Hero from '../components/Hero';

// Líné načítání (lazy loading) pro všechny sekce pod foldem
const Services = lazy(() => import('../components/Services'));
const SunriseOnline = lazy(() => import('../components/SunriseOnline'));
const Team = lazy(() => import('../components/Team'));
const Sponsors = lazy(() => import('../components/Sponsors'));
const SummerCamps = lazy(() => import('../components/SummerCamps'));
const Testimonials = lazy(() => import('../components/Testimonials'));

const HomePage = () => {
  return (
    <main>
      <Hero /> {/* Načte se okamžitě pro nejlepší UX (LCP) */}
      
      <Suspense fallback={<div style={{ minHeight: '100vh' }}></div>}>
        <Services />
        <SunriseOnline />
        <Team />
        <Sponsors />
        <SummerCamps />
        <Testimonials />
      </Suspense>
    </main>
  );
};

export default HomePage;

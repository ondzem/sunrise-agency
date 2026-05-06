import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FooterCTA from './components/FooterCTA';
import HomePage from './pages/HomePage';
import OnlinePage from './pages/OnlinePage';
import TutorProfilePage from './pages/TutorProfilePage';
import CompanyCoursesPage from './pages/CompanyCoursesPage';
import EnglishClubPage from './pages/EnglishClubPage';
import SummerProgramPage from './pages/SummerProgramPage';
import ContactPage from './pages/ContactPage';
import NewsPage from './pages/NewsPage';
import ErrorPage from './pages/ErrorPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ScrollToTop from './components/ScrollToTop';
import NewsBanner from './components/NewsBanner';
import CookieBanner from './components/CookieBanner';

/* CMS Portal Stránky (Bez Navbaru a Patičky) */
import LoginPage from './pages/LoginPage';
import AdminGeneratorPage from './pages/AdminGeneratorPage';
import HomepageAdminPage from './pages/HomepageAdminPage';
import CompanyAdminPage from './pages/CompanyAdminPage';
import LektorEditorPage from './pages/LektorEditorPage';
import CoursesPage from './pages/CoursesPage';

const GlobalLayout = ({ children }) => {
  const location = useLocation();
  
  React.useEffect(() => {
    const titles = {
      '/': 'Sunrise Language Agency',
      '/kurzy': 'Sunrise Language Agency | Kurzy',
      '/online': 'Sunrise Language Agency | Online',
      '/firemni-kurzy': 'Sunrise Language Agency | Firemní kurzy',
      '/english-club': 'Sunrise Language Agency | English Club',
      '/letni-program': 'Sunrise Language Agency | Letní program',
      '/kontakt': 'Sunrise Language Agency | Kontakt',
      '/aktuality': 'Sunrise Language Agency | Aktuality',
      '/obchodni-podminky': 'Sunrise Language Agency | Obchodní podmínky',
      '/ochrana-osobnich-udaju': 'Sunrise Language Agency | Ochrana osobních údajů',
    };

    let title = titles[location.pathname];
    if (!title && location.pathname.startsWith('/lektor/')) {
      title = 'Sunrise Language Agency | Lektor';
    }
    
    document.title = title || 'Sunrise Language Agency';
  }, [location]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {location.pathname !== '/aktuality' && <NewsBanner />}
      <div style={{ position: 'relative', flexGrow: 1 }}>
        <Navbar />
        {children}
        <FooterCTA />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div style={{ position: 'relative' }}>
        <Routes>
          {/* VEŘEJNÉ STRÁNKY WEBU */}
          <Route path="/" element={<GlobalLayout><HomePage /></GlobalLayout>} />
          <Route path="/online" element={<GlobalLayout><OnlinePage /></GlobalLayout>} />
          <Route path="/kurzy" element={<GlobalLayout><CoursesPage /></GlobalLayout>} />
          <Route path="/firemni-kurzy" element={<GlobalLayout><CompanyCoursesPage /></GlobalLayout>} />
          <Route path="/english-club" element={<GlobalLayout><EnglishClubPage /></GlobalLayout>} />
          <Route path="/letni-program" element={<GlobalLayout><SummerProgramPage /></GlobalLayout>} />
          <Route path="/kontakt" element={<GlobalLayout><ContactPage /></GlobalLayout>} />
          <Route path="/lektor/:id" element={<GlobalLayout><TutorProfilePage /></GlobalLayout>} />
          <Route path="/aktuality" element={<GlobalLayout><NewsPage /></GlobalLayout>} />
          <Route path="/obchodni-podminky" element={<GlobalLayout><TermsPage /></GlobalLayout>} />
          <Route path="/ochrana-osobnich-udaju" element={<GlobalLayout><PrivacyPage /></GlobalLayout>} />

          {/* ADMIN CMS PORTÁL ZE ZÁKULISÍ */}
          <Route path="/portal" element={<LoginPage />} />
          <Route path="/portal/admin" element={<AdminGeneratorPage />} />
          <Route path="/portal/homepage" element={<HomepageAdminPage />} />
          <Route path="/portal/company-admin" element={<CompanyAdminPage />} />
          <Route path="/portal/editor" element={<LektorEditorPage />} />

          <Route path="*" element={<GlobalLayout><ErrorPage /></GlobalLayout>} />
        </Routes>
        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;

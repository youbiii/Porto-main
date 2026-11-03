
import React, { useState, useEffect } from 'react';

import { PortfolioProvider } from './context/PortfolioContext';

import { Navbar } from './components/Navbar';
import { CinematicHero } from './components/CinematicHero';
import { SelectedWorks } from './components/SelectedWorks';
import { Skills } from './components/Skills';
import { TimelineSection } from './components/TimelineSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminPage } from './components/admin/AdminPage';

import NeonPreloader from './components/NeonPreloader';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAdminRoute =
    pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdminRoute) {
    return (
      <PortfolioProvider>
        <AdminPage />
      </PortfolioProvider>
    );
  }

  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-[#171A1D] text-white selection:bg-[#F5B301] selection:text-[#1E2328]">

        {/* Loading neon tampil sebentar saat website dibuka */}
        {isLoading && (
          <NeonPreloader
            duration={1800}
            onComplete={() => setIsLoading(false)}
          />
        )}

        {/* Navbar */}
        <Navbar activeSection={activeSection} />

        {/* Konten utama website */}
        <main>
          <CinematicHero />

          <SelectedWorks />

          <Skills />

          {/* Projects dinonaktifkan agar tidak duplikat */}
          {/* <Projects /> */}

          <TimelineSection />

          <Contact />
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </PortfolioProvider>
  );
}

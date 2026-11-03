
import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Code2,
  User,
  Sparkles,
  FolderGit2,
  Briefcase,
  Send,
} from 'lucide-react';

interface NavbarProps {
  activeSection: string;
}

const navLinks = [
  { name: 'Home', href: '#home', icon: User },
  { name: 'About', href: '#about', icon: Sparkles },
    { name: 'Projects', href: '#selected-works', icon: FolderGit2 },
  { name: 'Skills', href: '#skills', icon: Code2 },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Contact', href: '#contact', icon: Send },
];

const getSectionId = (href: string) =>
  href.replace(/^#/, '').toLowerCase();

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [currentSection, setCurrentSection] = useState(
    getSectionId(activeSection || 'home')
  );

  // Sinkronisasi indikator saat halaman digulir.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Ikuti perubahan activeSection dari komponen induk,
  // kecuali jika perubahan tersebut sudah sama dengan state lokal.
  useEffect(() => {
    if (!activeSection) return;

    const nextSection = getSectionId(activeSection);

    setCurrentSection((current) =>
      current === nextSection ? current : nextSection
    );
  }, [activeSection]);

  // Deteksi section aktif berdasarkan posisi halaman.
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((element): element is HTMLElement => {
        return element instanceof HTMLElement;
      });

    if (sections.length === 0) return;

    let animationFrame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        // Garis acuan berada sekitar 30% dari atas viewport.
        const referenceY = window.innerHeight * 0.3;

        let closestSection: HTMLElement | null = null;
        let smallestDistance = Infinity;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();

          // Abaikan section yang belum mencapai garis acuan
          // atau sudah berada sepenuhnya di atas viewport.
          if (rect.top > referenceY || rect.bottom <= referenceY) {
            return;
          }

          const distance = Math.abs(rect.top - referenceY);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestSection = section;
          }
        });

        if (closestSection) {
          setCurrentSection((current) =>
            current === closestSection!.id
              ? current
              : closestSection!.id
          );
        } else if (window.scrollY < 50) {
          setCurrentSection('home');
        }
      });
    };

    window.addEventListener('scroll', updateActiveSection, {
      passive: true,
    });

    window.addEventListener('resize', updateActiveSection);

    updateActiveSection();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  // Klik menu: perbarui indikator dan gulir ke section tujuan.
  const scrollTo = (href: string) => {
    const id = getSectionId(href);
    const element = document.getElementById(id);

    setMobileMenuOpen(false);
    setCurrentSection(id);

    if (!element) {
      console.warn(
        `Navbar: elemen dengan id="${id}" tidak ditemukan.`
      );
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    window.history.replaceState(null, '', `#${id}`);
  };

  const renderNavLink = (
    link: (typeof navLinks)[number],
    mobile = false
  ) => {
    const Icon = link.icon;

    const isActive =
      currentSection === getSectionId(link.href);

    return (
      <a
        key={link.name}
        href={link.href}
        aria-current={isActive ? 'location' : undefined}
        onClick={(event) => {
          event.preventDefault();
          scrollTo(link.href);
        }}
        className={
          mobile
            ? `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-[#F5B301] text-[#1E2328] font-bold shadow-md'
                  : 'text-gray-300 hover:bg-[#3B3F46]/60 hover:text-white'
              }`
            : `px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#F5B301] text-[#1E2328] font-semibold shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-[#3B3F46]/50'
              }`
        }
      >
        {mobile && <Icon className="w-4 h-4" />}
        <span>{link.name}</span>
      </a>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#1E2328]/90 backdrop-blur-md border-b border-[#3B3F46] py-3 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
          {/* Logo */}
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              scrollTo('#home');
            }}
            className="group flex items-center justify-center transition-transform hover:scale-105"
            title="Catur Nurul Huda"
          >
            <span className="w-10 h-10 rounded-xl bg-[#2A2E34] border-2 border-[#F5B301]/80 hover:border-[#F5B301] flex items-center justify-center text-[#F5B301] font-bold font-sora text-sm shadow-md transition-all">
              CNH
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-1 bg-[#2A2E34]/70 p-1.5 rounded-full border border-[#3B3F46]"
          >
            {navLinks.map((link) => renderNavLink(link))}
          </nav>

          {/* Penyeimbang layout desktop agar navigasi tetap di tengah */}
          <div className="hidden md:block w-10" aria-hidden="true" />

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((open) => !open)
              }
              className="p-2 rounded-lg bg-[#2A2E34] border border-[#3B3F46] text-gray-300 hover:text-white hover:border-[#F5B301] transition-colors"
              aria-label={
                mobileMenuOpen
                  ? 'Tutup menu navigasi'
                  : 'Buka menu navigasi'
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#F5B301]" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2A2E34] border-b border-[#3B3F46] px-4 pt-3 pb-6 space-y-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="text-xs text-gray-400 font-medium px-3 py-1 uppercase tracking-wider">
              Navigasi Portofolio
            </div>

            {navLinks.map((link) =>
              renderNavLink(link, true)
            )}
          </div>
        )}
      </header>
    </>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'motion/react';
import Lenis from 'lenis';
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  MapPin,
  Building2,
  ChevronDown,
  Github,
} from 'lucide-react';

import { usePortfolio } from '../context/PortfolioContext';
import { LanyardCard } from './LanyardCard';

/* =========================================================
   TIPE DATA SELECTED WORKS
========================================================= */

type ProjectCategory = 'Web' | 'IoT';
type ProjectFilter = 'All' | ProjectCategory;

type Project = {
  id: string;
  number: string;
  title: string;
  category: ProjectCategory;
  subtitle: string;
  description: string;
  solution: string;
  technologies: string[];
  year: string;
  status: string;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
};

const FILTERS: ProjectFilter[] = ['All', 'Web', 'IoT'];

/* =========================================================
   SELECTED WORKS (TERHUBUNG KE DATABASE VIA CONTEXT)
========================================================= */

function SelectedWorks() {
  const { selectedWorks } = usePortfolio();
  const [filter, setFilter] = useState<ProjectFilter>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Normalisasi data yang diambil dari database
  const projects: Project[] = (selectedWorks && selectedWorks.length > 0 ? selectedWorks : []).map(
    (item: any, index: number) => ({
      id: String(item.id || `work-${index + 1}`),
      number: String(item.number || index + 1).padStart(2, '0'),
      title: item.title || 'Untitled Project',
      category: item.category === 'IoT' ? 'IoT' : 'Web',
      subtitle: item.subtitle || (item.category === 'IoT' ? 'IoT Solution' : 'Web Application'),
      description: item.description || '',
      solution: item.solution || item.description || '',
      technologies: Array.isArray(item.technologies)
        ? item.technologies
        : typeof item.technologies === 'string'
        ? item.technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [],
      year: String(item.year || '2026'),
      status: item.status || 'Project',
      image: item.image || '',
      liveUrl: item.liveUrl || item.demo || item.link || '',
      githubUrl: item.githubUrl || item.github || '',
    })
  );

  // Hilangkan entri proyek yang sama dari respons context/database.
  // Prioritas identitas: ID; jika ID berbeda/kosong, gunakan judul yang dinormalisasi.
  const uniqueProjects = projects.filter((project, index, allProjects) => {
    const normalizedTitle = project.title.trim().toLowerCase().replace(/\s+/g, ' ');
    return allProjects.findIndex((candidate) => {
      const candidateTitle = candidate.title.trim().toLowerCase().replace(/\s+/g, ' ');
      return candidate.id === project.id || candidateTitle === normalizedTitle;
    }) === index;
  });

  const visibleProjects = uniqueProjects.filter(
    (project) => filter === 'All' || project.category === filter
  );

  function changeFilter(nextFilter: ProjectFilter) {
    setFilter(nextFilter);
    setExpandedId(null);
  }

  return (
    <section
      id="projects"
      aria-labelledby="selected-works-title"
      className="relative overflow-hidden rounded-t-[32px] bg-[#171A1D] px-5 py-20 text-white sm:rounded-t-[40px] sm:px-8 sm:py-24 lg:px-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-[#F5B301]/[0.06] blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header Seksi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#F5B301]">
              Portfolio / Selected Works
            </p>

            <h2
              id="selected-works-title"
              className="font-sora text-4xl font-black uppercase leading-[1] tracking-tight sm:text-6xl"
            >
              Selected
              <br />
              <span className="text-[#F5B301]">Works.</span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
              A collection of web applications and IoT projects.
            </p>
          </div>

          <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
            Explore projects <span className="text-[#F5B301]">↘</span>
          </p>
        </motion.div>

        {/* Filter Kategori */}
        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter projects"
        >
          {FILTERS.map((item) => {
            const active = filter === item;

            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => changeFilter(item)}
                className={[
                  'min-h-10 rounded-full border px-5 py-2 cursor-pointer',
                  'text-sm font-semibold transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B301]',
                  active
                    ? 'border-[#F5B301] bg-[#F5B301] text-[#171A1D]'
                    : 'border-[#3A3F45] text-gray-300 hover:border-[#F5B301] hover:text-white',
                ].join(' ')}
              >
                {item}
                {item === 'All' && (
                  <span className="ml-2 text-xs opacity-70">
                    {uniqueProjects.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Grid Kartu Proyek */}
        {visibleProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#353B43] p-10 text-center">
            <p className="text-lg font-bold">Belum ada data di database.</p>
            <p className="mt-2 text-sm text-gray-400">
              Tambahkan proyek melalui tab Selected Works di Admin Management Console.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleProjects.map((project, index) => {
              const expanded = expandedId === project.id;
              const detailsId = `details-${project.id}`;

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                  }}
                  className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#353B43] bg-[#20252B] transition-colors duration-300 hover:border-[#F5B301]/60"
                >
                  {/* Gambar Proyek */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#252B32]">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`Preview ${project.title}`}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.visibility = 'hidden';
                        }}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : null}

                    {!project.image && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#20252B]">
                        <span className="font-mono text-5xl font-bold text-[#F5B301]/70">
                          {project.number}
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          {project.category} Project
                        </span>
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171A1D]/50 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#171A1D]/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
                      {project.category}
                    </span>

                    <span className="absolute bottom-4 right-4 font-mono text-xs text-white/80">
                      {project.number} / {String(uniqueProjects.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Informasi Proyek */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B301]">
                        {project.subtitle}
                      </p>

                      <span className="shrink-0 text-xs text-gray-500">
                        {project.year}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-white">
                      {project.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-md border border-[#414750] px-2.5 py-1.5 text-[11px] text-gray-300"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>

                    {/* Akordion Solusi Lipat */}
                    <div className="mt-auto pt-5">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={detailsId}
                        onClick={() =>
                          setExpandedId(expanded ? null : project.id)
                        }
                        className="flex min-h-11 w-full items-center justify-between border-t border-[#353B43] pt-4 text-left text-sm font-semibold text-white transition-colors hover:text-[#F5B301] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B301] cursor-pointer"
                      >
                        <span>
                          {expanded ? 'Tutup detail' : 'Lihat detail'}
                        </span>

                        <ChevronDown
                          size={18}
                          aria-hidden="true"
                          className={`text-[#F5B301] transition-transform duration-300 ${
                            expanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <motion.div
                        id={detailsId}
                        initial={false}
                        animate={{
                          height: expanded ? 'auto' : 0,
                          opacity: expanded ? 1 : 0,
                        }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                        aria-hidden={!expanded}
                      >
                        <div className="space-y-4 pt-4">
                          <p className="text-sm leading-6 text-gray-400">
                            {project.solution || project.description}
                          </p>

                          {project.status && (
                            <span className="inline-block rounded-md bg-[#F5B301]/10 px-3 py-1.5 font-mono text-xs text-[#F5B301]">
                              {project.status}
                            </span>
                          )}

                          <div className="flex flex-wrap gap-4">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#F5B301] hover:text-[#FCD053]"
                              >
                                <Github size={15} />
                                Source code
                                <ArrowUpRight size={15} />
                              </a>
                            )}

                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#F5B301] hover:text-[#FCD053]"
                              >
                                Live demo
                                <ArrowUpRight size={15} />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* Footer Seksi Selected Works */}
        <div className="mt-10 flex flex-col gap-4 border-t border-[#353B43] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-400">
            Thoughtful design. Practical engineering.
          </p>

          <a
            href="#contact"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#F5B301] transition-colors hover:text-[#FCD053] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B301]"
          >
            Contact me
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CINEMATIC HERO (DENGAN BACKGROUND ART DARI DATABASE)
========================================================= */

export const CinematicHero: React.FC = () => {
  const { personalInfo, profile } = usePortfolio() as any;
  const containerRef = useRef<HTMLDivElement>(null);

  const data = personalInfo || profile || {};
  const name = data.name || 'Catur Nurul Huda';
  const role = data.role || data.title || 'Software, Web & IoT Developer';
  const university = data.university || data.campus || 'Universitas Pahlawan Tuanku Tambusai';
  const location = data.location || data.domicile || 'Kampar, Riau, Indonesia';
  const bio =
    data.bio ||
    data.about ||
    data.description ||
    'Halo, saya Catur Nurul Huda — Mahasiswa S1 Teknik Informatika, Fakultas Teknik, Universitas Pahlawan Tuanku Tambusai.';
  const major = data.fullTitle || data.major || data.studyProgram || 'S1 Teknik Informatika';
  const degree = data.degree ? ` • ${data.degree}` : '';
  const gpa = data.gpa || '3.82';
  const projectCount = data.projectCount || data.projectsCount || '5+';
  const focus = data.focus || data.techFocus || 'Web + IoT';
  const cvUrl = data.cvUrl || data.cv || '';

  // Tema animasi latar belakang tersimpan di database
  const bgArt = data.bgArt || 'solarsystem';

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const leftColY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const leftColOpacity = useTransform(smoothProgress, [0, 0.7], [1, 0.25]);
  const rightColY = useTransform(smoothProgress, [0, 1], [0, 45]);
  const rightColScale = useTransform(smoothProgress, [0, 1], [1, 1.04]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || 'Catur';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div
      ref={containerRef}
      className="relative bg-[#171A1D] text-white selection:bg-[#F5B301] selection:text-[#171A1D]"
    >
      {/* SEKSI HERO UTAMA */}
      <section
        id="home"
        className="relative flex min-h-[92vh] items-center overflow-hidden py-24 sm:py-28"
      >
        {/* Glow Ambient Latar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-[#F5B301]/[0.08] blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-[#F5B301]/[0.06] blur-[120px]"
        />

        {/* ========================================================================= */}
        {/* LAPISAN ANIMASI BACKGROUND HERO FULL SECTION                             */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none">
          
          {/* 1. HUD ORBIT TATA SURYA (MULTI-PLANET) */}
          {(bgArt === 'solarsystem' || bgArt === 'target') && (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-60">
              <div className="relative w-[1100px] h-[1100px] flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#F5B301] to-[#FCD053] shadow-[0_0_45px_#F5B301] z-10 flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-white/40 blur-[2px]" />
                </div>

                <div className="absolute w-[200px] h-[200px] rounded-full border border-white/20 animate-[spin_12s_linear_infinite]">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200 shadow-[0_0_8px_#fff] absolute top-1/2 -left-1.5" />
                </div>

                <div className="absolute w-[300px] h-[300px] rounded-full border border-white/20 animate-[spin_20s_linear_infinite_reverse]">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#E5B887] shadow-[0_0_10px_#E5B887] absolute -top-2 left-1/2" />
                </div>

                <div className="absolute w-[440px] h-[440px] rounded-full border border-[#F5B301]/30 animate-[spin_28s_linear_infinite]">
                  <div className="relative w-5 h-5 rounded-full bg-[#4A90E2] shadow-[0_0_14px_#4A90E2] absolute top-1/2 -right-2.5 flex items-center justify-center">
                    <div className="absolute w-8 h-8 rounded-full border border-white/30 animate-[spin_4s_linear_infinite]">
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute -top-1 left-1/2" />
                    </div>
                  </div>
                </div>

                <div className="absolute w-[580px] h-[580px] rounded-full border border-white/20 animate-[spin_38s_linear_infinite]">
                  <div className="w-4 h-4 rounded-full bg-[#E25A38] shadow-[0_0_12px_#E25A38] absolute -bottom-2 left-1/2" />
                </div>

                <div className="absolute w-[740px] h-[740px] rounded-full border border-dashed border-[#F5B301]/30 animate-[spin_55s_linear_infinite_reverse]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C99059] to-[#E8C59A] shadow-[0_0_20px_#C99059] absolute top-1/3 -left-4 flex items-center justify-center">
                    <div className="w-2 h-1 bg-[#8C3A27] rounded-full" />
                  </div>
                </div>

                <div className="absolute w-[900px] h-[900px] rounded-full border border-white/20 animate-[spin_75s_linear_infinite]">
                  <div className="relative w-8 h-8 flex items-center justify-center absolute bottom-1/4 -right-4">
                    <div className="w-6 h-6 rounded-full bg-[#E2BF7D] shadow-[0_0_16px_#E2BF7D]" />
                    <div className="absolute w-14 h-4 rounded-[50%] border-2 border-[#E2BF7D] -rotate-[28deg] shadow-[0_0_8px_rgba(226,191,125,0.7)]" />
                  </div>
                </div>

                <div className="absolute w-[1050px] h-[1050px] rounded-full border border-white/10 animate-[spin_95s_linear_infinite_reverse]">
                  <div className="w-5 h-5 rounded-full bg-[#70D6FF] shadow-[0_0_12px_#70D6FF] absolute top-1/4 left-8" />
                </div>
              </div>
            </div>
          )}

          {/* 2. DOODLE ASTRONOT PUTIH */}
          {(bgArt === 'doodle_astronaut' || bgArt === 'doodle') && (
            <div className="absolute inset-0 w-full h-full opacity-65 text-white">
              <motion.div
                animate={{ y: [0, -18, 0, 18, 0], rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-[6%] sm:left-[10%] top-[20%] sm:top-[26%] w-36 sm:w-48"
              >
                <svg viewBox="0 0 100 120" className="w-full h-full stroke-white fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  <line x1="25" y1="15" x2="48" y2="60" />
                  <polygon points="25,15 5,28 20,42" fill="white" fillOpacity="0.15" />
                  <circle cx="58" cy="35" r="22" />
                  <rect x="44" y="24" width="26" height="18" rx="8" fill="white" fillOpacity="0.9" />
                  <path d="M 46 55 C 38 65, 38 85, 48 95" />
                  <path d="M 68 55 C 76 65, 76 85, 68 95" />
                  <path d="M 48 95 Q 40 105 48 112 Q 56 108 55 98" />
                  <path d="M 64 95 Q 72 105 66 112 Q 58 108 60 98" />
                  <rect x="74" y="44" width="10" height="28" rx="3" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ x: [0, 12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-[4%] sm:left-[8%] bottom-[10%] sm:bottom-[15%] w-28 sm:w-36"
              >
                <svg viewBox="0 0 80 50" className="w-full h-full stroke-white fill-none stroke-[2] stroke-linecap-round">
                  <rect x="15" y="15" width="45" height="18" rx="4" />
                  <circle cx="20" cy="38" r="7" />
                  <circle cx="40" cy="38" r="7" />
                  <circle cx="60" cy="38" r="7" />
                  <line x1="45" y1="15" x2="52" y2="5" />
                  <ellipse cx="56" cy="5" rx="5" ry="3" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0, 10, 0], rotate: [0, 8, 0, -8, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-[6%] sm:right-[12%] top-[14%] sm:top-[18%] w-24 sm:w-32"
              >
                <svg viewBox="0 0 100 80" className="w-full h-full stroke-white fill-none stroke-[2] stroke-linecap-round">
                  <rect x="42" y="25" width="16" height="30" rx="3" />
                  <circle cx="50" cy="40" r="3" />
                  <line x1="50" y1="15" x2="50" y2="25" />
                  <ellipse cx="50" cy="15" rx="10" ry="4" />
                  <line x1="20" y1="40" x2="42" y2="40" />
                  <rect x="8" y="32" width="22" height="16" strokeDasharray="6 3" />
                  <line x1="58" y1="40" x2="80" y2="40" />
                  <rect x="70" y="32" width="22" height="16" strokeDasharray="6 3" />
                </svg>
              </motion.div>

              <div className="absolute left-[20%] top-[18%] animate-ping text-white text-sm">✦</div>
              <div className="absolute left-[45%] top-[25%] animate-pulse text-white text-base">✧</div>
              <div className="absolute right-[36%] top-[16%] animate-ping text-white text-sm">★</div>
              <div className="absolute right-[25%] bottom-[20%] animate-pulse text-white text-base">✦</div>
            </div>
          )}

          {/* 3. DOODLE ROKET & UFO */}
          {bgArt === 'doodle_galaxy' && (
            <div className="absolute inset-0 w-full h-full opacity-65 text-white">
              <motion.div
                animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-[8%] sm:left-[14%] top-[25%] sm:top-[30%] w-28 sm:w-36 -rotate-12"
              >
                <svg viewBox="0 0 80 120" className="w-full h-full stroke-white fill-none stroke-[2.2] stroke-linecap-round">
                  <path d="M 40 10 C 25 35 25 75 25 85 L 55 85 C 55 75 55 35 40 10 Z" />
                  <circle cx="40" cy="45" r="7" />
                  <path d="M 25 65 Q 10 75 12 95 Q 24 90 25 85" />
                  <path d="M 55 65 Q 70 75 68 95 Q 56 90 55 85" />
                  <path d="M 30 85 Q 40 115 50 85 Q 44 100 38 85" strokeDasharray="4 2" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ x: [0, -18, 0, 18, 0], y: [0, 10, 0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-[8%] sm:right-[15%] bottom-[12%] sm:bottom-[18%] w-28 sm:w-40"
              >
                <svg viewBox="0 0 100 80" className="w-full h-full stroke-white fill-none stroke-[2] stroke-linecap-round">
                  <path d="M 35 30 C 35 15, 65 15, 65 30" fill="white" fillOpacity="0.2" />
                  <ellipse cx="50" cy="32" rx="42" ry="12" />
                  <circle cx="28" cy="36" r="2.5" fill="white" />
                  <circle cx="50" cy="38" r="2.5" fill="white" />
                  <circle cx="72" cy="36" r="2.5" fill="white" />
                  <line x1="38" y1="44" x2="22" y2="78" strokeDasharray="4 4" />
                  <line x1="62" y1="44" x2="78" y2="78" strokeDasharray="4 4" />
                </svg>
              </motion.div>
            </div>
          )}

          {/* 4. DOODLE KOSMIK & HUJAN KOMET */}
          {bgArt === 'doodle_deepspace' && (
            <div className="absolute inset-0 w-full h-full opacity-65 text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                className="absolute left-[8%] sm:left-[14%] top-[25%] sm:top-[32%] w-32 sm:w-44"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[2] stroke-linecap-round">
                  <circle cx="50" cy="50" r="10" fill="white" fillOpacity="0.4" />
                  <path d="M 50 20 Q 80 20 80 50 Q 80 80 50 80 Q 20 80 20 50 Q 20 30 40 30" strokeDasharray="6 4" />
                  <path d="M 50 10 Q 95 10 95 50 Q 95 95 50 95 Q 5 95 5 50 Q 5 20 30 20" strokeDasharray="8 6" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ x: [0, 40, 0], y: [0, 20, 0], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-[10%] sm:right-[18%] top-[12%] sm:top-[18%] w-36 sm:w-48"
              >
                <svg viewBox="0 0 100 50" className="w-full h-full stroke-white fill-none stroke-[2] stroke-linecap-round">
                  <circle cx="85" cy="25" r="9" fill="white" fillOpacity="0.3" />
                  <path d="M 78 18 Q 40 20 5 12" />
                  <path d="M 76 25 Q 35 28 2 25" />
                  <path d="M 78 32 Q 40 34 8 40" />
                </svg>
              </motion.div>
            </div>
          )}

          {/* 5. ATOM ORBIT REACT */}
          {bgArt === 'atom' && (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-60">
              <div className="absolute w-[980px] lg:w-[1300px] h-[420px] lg:h-[520px] rounded-[50%] border border-[#F5B301]/20 -rotate-[15deg] animate-[spin_40s_linear_infinite]">
                <div className="w-3 h-3 rounded-full bg-[#F5B301] shadow-[0_0_15px_#F5B301] absolute top-4 left-1/4" />
              </div>

              <div className="absolute right-0 lg:right-[-60px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[750px] sm:h-[750px] flex items-center justify-center">
                <div className="absolute w-8 h-8 rounded-full bg-[#F5B301]/70 shadow-[0_0_35px_#F5B301] animate-ping" />
                <div className="absolute w-4 h-4 rounded-full bg-[#F5B301] shadow-[0_0_20px_#F5B301]" />

                <div className="absolute w-[500px] sm:w-[620px] h-[190px] sm:h-[230px] rounded-[50%] border-2 border-[#F5B301]/40 shadow-[0_0_20px_rgba(245,179,1,0.2)] animate-[spin_18s_linear_infinite]">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F5B301] shadow-[0_0_12px_#F5B301] absolute -top-1.5 left-1/2 -translate-x-1/2" />
                </div>
                <div className="absolute w-[500px] sm:w-[620px] h-[190px] sm:h-[230px] rounded-[50%] border-2 border-[#F5B301]/35 rotate-[60deg] shadow-[0_0_20px_rgba(245,179,1,0.2)] animate-[spin_24s_linear_infinite_reverse]">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FCD053] shadow-[0_0_12px_#FCD053] absolute -top-1.5 left-1/2 -translate-x-1/2" />
                </div>
                <div className="absolute w-[500px] sm:w-[620px] h-[190px] sm:h-[230px] rounded-[50%] border-2 border-[#F5B301]/35 rotate-[120deg] shadow-[0_0_20px_rgba(245,179,1,0.2)] animate-[spin_30s_linear_infinite]">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F5B301] shadow-[0_0_12px_#F5B301] absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                </div>
              </div>
            </div>
          )}

          {/* 6. CYBER GRID 3D */}
          {bgArt === 'grid' && (
            <div className="absolute inset-0 w-full h-full opacity-45">
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(245, 179, 1, 0.12) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(245, 179, 1, 0.12) 1px, transparent 1px)
                  `,
                  backgroundSize: '48px 48px',
                }}
              />
              <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-[#F5B301]/25 to-transparent animate-[bounce_7s_ease-in-out_infinite]" />
            </div>
          )}

          {/* 7. IOT CONSTELLATION NODES */}
          {bgArt === 'nodes' && (
            <div className="absolute inset-0 w-full h-full opacity-55">
              <svg className="w-full h-full">
                <g stroke="rgba(245, 179, 1, 0.3)" strokeWidth="1.2">
                  <line x1="10%" y1="20%" x2="25%" y2="45%" strokeDasharray="4 4" />
                  <line x1="25%" y1="45%" x2="45%" y2="30%" />
                  <line x1="45%" y1="30%" x2="65%" y2="55%" strokeDasharray="3 3" />
                  <line x1="65%" y1="55%" x2="85%" y2="35%" />
                  <line x1="85%" y1="35%" x2="95%" y2="70%" />
                  <line x1="25%" y1="45%" x2="35%" y2="75%" />
                  <line x1="65%" y1="55%" x2="70%" y2="85%" />
                </g>
                <circle cx="10%" cy="20%" r="3.5" fill="#F5B301" />
                <circle cx="25%" cy="45%" r="4.5" fill="#FCD053" />
                <circle cx="45%" cy="30%" r="3.5" fill="#F5B301" />
                <circle cx="65%" cy="55%" r="5.5" fill="#F5B301" />
                <circle cx="85%" cy="35%" r="4.5" fill="#FCD053" />
                <circle cx="95%" cy="70%" r="3.5" fill="#F5B301" />
                <circle cx="35%" cy="75%" r="4" fill="#FCD053" />
                <circle cx="70%" cy="85%" r="4.5" fill="#F5B301" />
              </svg>
            </div>
          )}

        </div>

        {/* Konten Depan Hero */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            
            {/* Kolom Kiri: Profil & Teks */}
            <motion.div
              style={{
                y: leftColY,
                opacity: leftColOpacity,
              }}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6 lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#353B43] bg-[#20252B] px-4 py-2 text-xs font-semibold text-[#F5B301]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#F5B301]" />
                <span>{major}{degree}</span>
              </div>

              <div>
                <h1 className="font-sora text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                  {firstName}{' '}
                  <span className="text-[#F5B301]">{lastName}</span>
                </h1>

                <p className="mt-3 font-sora text-xl font-bold text-gray-200 sm:text-2xl">
                  {role}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs font-semibold text-gray-300">
                <div className="flex items-center gap-2 rounded-xl border border-[#353B43] bg-[#20252B] px-3.5 py-2.5">
                  <Building2 className="h-4 w-4 text-[#F5B301]" />
                  <span>{university}</span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[#353B43] bg-[#20252B] px-3.5 py-2.5">
                  <MapPin className="h-4 w-4 text-[#F5B301]" />
                  <span>{location}</span>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
                {bio}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => scrollTo('#projects')}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#F5B301] px-6 py-3 font-semibold text-[#171A1D] transition-colors hover:bg-[#FCD053] cursor-pointer"
                >
                  Lihat Proyek
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('#contact')}
                  className="min-h-12 rounded-xl border border-[#414750] bg-[#20252B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#F5B301] cursor-pointer"
                >
                  Hubungi Saya
                </button>

                {cvUrl && (
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#414750] bg-[#20252B] p-3 text-gray-300 transition-colors hover:text-[#F5B301]"
                    aria-label="Buka CV"
                  >
                    <Download size={20} />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-[#353B43] pt-6">
                <div className="rounded-xl border border-[#353B43] bg-[#20252B] p-3 sm:p-4">
                  <p className="text-lg font-black text-[#F5B301] sm:text-2xl">
                    {gpa}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                    IPK Kumulatif
                  </p>
                </div>

                <div className="rounded-xl border border-[#353B43] bg-[#20252B] p-3 sm:p-4">
                  <p className="text-lg font-black text-[#F5B301] sm:text-2xl">
                    {projectCount}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                    Proyek Terdaftar
                  </p>
                </div>

                <div className="rounded-xl border border-[#353B43] bg-[#20252B] p-3 sm:p-4">
                  <p className="text-lg font-black text-[#F5B301] sm:text-2xl">
                    {focus}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                    Fokus Teknologi
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Kolom Kanan: Kartu Lanyard Interaktif */}
            <motion.div
              style={{
                y: rightColY,
                scale: rightColScale,
              }}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative z-10 flex items-center justify-center lg:col-span-5"
            >
              <LanyardCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Selected Works sengaja tidak dirender di sini agar tidak duplikat. */}
    </div>
  );
};
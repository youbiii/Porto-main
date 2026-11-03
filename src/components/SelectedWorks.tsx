import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Github,
  ImagePlus,
  ArrowRight,
  X,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

type CategoryFilter = 'All' | 'Web' | 'IoT';

type WorkItem = {
  id?: string;
  _id?: string;
  title: string;
  category: 'Web' | 'IoT';
  subtitle?: string;
  description: string;
  technologies?: string[];
  year?: string;
  status?: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
};

export const SelectedWorks: React.FC = () => {
  const { selectwork } = usePortfolio();
  const [items, setItems] = useState<WorkItem[]>([]);
  const [filter, setFilter] = useState<CategoryFilter>('All');
  const [selectedDetail, setSelectedDetail] = useState<WorkItem | null>(null);

  useEffect(() => {
    if (Array.isArray(selectwork) && selectwork.length > 0) {
      setItems(selectwork);
    } else {
      try {
        const saved = localStorage.getItem('selected_works_projects');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        }
      } catch (e) {
        console.error('Gagal membaca data Selected Works:', e);
      }
    }
  }, [selectwork]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedDetail(null);
    };
    if (selectedDetail) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDetail]);

  const counts = {
    all: items.length,
    web: items.filter((w) => w.category === 'Web').length,
    iot: items.filter((w) => w.category === 'IoT').length,
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'All') return true;
    return item.category?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <section id="selected-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2B3038] pb-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#F5B301] mb-2">
            PORTFOLIO / SELECTED WORKS
          </p>
          <h2 className="text-4xl sm:text-6xl font-black font-sora text-white tracking-tight">
            SELECTED <br />
            <span className="text-[#F5B301]">WORKS.</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-lg">
            Kumpulan proyek pilihan berbasis Web Application dan IoT Engineering yang telah dirancang & diimplementasikan.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#171A1D] p-1.5 rounded-2xl border border-[#2B3038]">
          {(['All', 'Web', 'IoT'] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                filter === cat
                  ? 'bg-[#F5B301] text-[#141619] shadow-[0_0_15px_rgba(245,179,1,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-[#20252B]'
              }`}
            >
              <span>{cat}</span>
              {cat === 'All' && (
                <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-md font-mono">
                  {counts.all}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Card List */}
      {filteredItems.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-[#2F353E] bg-[#141619]/40 p-16 text-center">
          <p className="text-lg font-bold text-white">Belum ada proyek di kategori ini.</p>
          <p className="text-xs text-gray-500 mt-2">
            Tambahkan atau ubah kategori proyek melalui Admin Management Console.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((work) => (
            <article
              key={work.id || work._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#2B3038] bg-[#1A1D21] transition-all duration-300 hover:border-[#F5B301]/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
            >
              {/* Thumbnail Media */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#121417]">
                {work.image ? (
                  <img
                    src={work.image}
                    alt={work.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-600">
                    <ImagePlus size={36} />
                    <span className="text-xs font-mono">Belum ada preview</span>
                  </div>
                )}

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#F5B301] border border-white/10 shadow-lg">
                    {work.category}
                  </span>
                  {work.status && (
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-gray-300 border border-white/10">
                      {work.status}
                    </span>
                  )}
                </div>

                {/* Live Demo Link Overlay */}
                {work.liveUrl && (
                  <div className="absolute top-3 right-3 opacity-90 transition">
                    <a
                      href={work.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Live Demo"
                      className="h-8 w-8 rounded-full bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#F5B301] hover:border-[#F5B301] transition"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono tracking-wider text-[#F5B301] uppercase">
                    {work.subtitle || work.category}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    {work.year || '2026'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#F5B301] transition-colors leading-snug">
                  {work.title}
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-gray-400 line-clamp-2">
                  {work.description}
                </p>

                {/* Tech Pills */}
                {Array.isArray(work.technologies) && work.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {work.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-[#2B3038] bg-[#141619] px-2.5 py-1 text-[10px] font-mono text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {work.technologies.length > 4 && (
                      <span className="rounded-lg border border-[#2B3038] bg-[#141619] px-2 py-1 text-[10px] font-mono text-gray-500">
                        +{work.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Card: Tombol Source Code (GitHub) & Read More */}
                <div className="mt-auto pt-5 border-t border-[#262B32] flex items-center justify-between mt-6">
                  {/* Tombol Source Code dengan logo GitHub di sisi kiri */}
                  {work.githubUrl ? (
                    <a
                      href={work.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition group/gh"
                    >
                      <Github size={15} className="text-gray-400 group-hover/gh:text-white transition" />
                      <span>Source Code</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-xs text-gray-600 cursor-not-allowed">
                      <Github size={15} />
                      <span>Source Code</span>
                    </span>
                  )}

                  {/* Tombol Read More di sisi kanan */}
                  <button
                    type="button"
                    onClick={() => setSelectedDetail(work)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F5B301] hover:text-[#FCD053] transition group/btn"
                  >
                    <span>Read More</span>
                    <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal Popup Read More (Detail Lengkap) */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#2F353E] bg-[#171A1E] text-white shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedDetail(null)}
              className="absolute top-5 right-5 rounded-full p-2 bg-[#20252B] text-gray-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Tutup detail"
            >
              <X size={18} />
            </button>

            {selectedDetail.image && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#121417] mb-6 border border-[#2B3038]">
                <img
                  src={selectedDetail.image}
                  alt={selectedDetail.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="rounded-full bg-[#F5B301]/10 px-3 py-1 text-xs font-bold text-[#F5B301] border border-[#F5B301]/30">
                {selectedDetail.category}
              </span>
              {selectedDetail.status && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={13} />
                  {selectedDetail.status}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-mono ml-auto">
                <Calendar size={13} />
                {selectedDetail.year || '2026'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-sora text-white">
              {selectedDetail.title}
            </h3>
            {selectedDetail.subtitle && (
              <p className="text-sm font-mono text-[#F5B301] mt-1">
                {selectedDetail.subtitle}
              </p>
            )}

            <div className="mt-6 border-t border-[#262B32] pt-4">
              <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-2">
                Project Overview
              </h4>
              <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">
                {selectedDetail.description}
              </p>
            </div>

            {Array.isArray(selectedDetail.technologies) && selectedDetail.technologies.length > 0 && (
              <div className="mt-6 border-t border-[#262B32] pt-4">
                <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                  <Layers size={14} className="text-[#F5B301]" />
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDetail.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-[#2F353E] bg-[#121417] px-3 py-1.5 text-xs text-gray-200 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3 border-t border-[#262B32] pt-6">
              {selectedDetail.githubUrl && (
                <a
                  href={selectedDetail.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#2F353E] bg-[#20252B] px-4 py-2.5 text-xs font-bold text-white hover:border-[#F5B301] hover:text-[#F5B301] transition"
                >
                  <Github size={16} />
                  Lihat Repository
                </a>
              )}
              {selectedDetail.liveUrl && (
                <a
                  href={selectedDetail.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5B301] px-4 py-2.5 text-xs font-bold text-[#171A1D] hover:bg-[#FCD053] transition shadow-lg shadow-[#F5B301]/20"
                >
                  <ExternalLink size={16} />
                  Kunjungi Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
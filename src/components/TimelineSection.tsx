import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  GraduationCap,
  Briefcase,
  Calendar,
  Building2,
  Award,
  Layers,
} from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const { timeline: contextTimeline } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<'all' | 'education' | 'experience'>('all');

  // Normalisasi data timeline agar kompatibel dengan data admin maupun data awal
  const timelineList = (contextTimeline && contextTimeline.length > 0 ? contextTimeline : []).map(
    (item: any, index: number) => {
      const type = String(item.type || item.category || 'experience').toLowerCase();
      const isEducation = type.includes('edu') || type.includes('pendidikan') || type.includes('kuliah');

      return {
        id: item.id || `timeline-${index + 1}`,
        type: isEducation ? 'education' : 'experience',
        title: item.title || item.role || item.position || 'Pengalaman / Pendidikan',
        institution: item.institution || item.company || item.university || item.place || '',
        period: item.period || item.year || item.date || '2021 - Sekarang',
        description: item.description || item.desc || '',
        highlights: Array.isArray(item.highlights)
          ? item.highlights
          : Array.isArray(item.tasks)
          ? item.tasks
          : typeof item.highlights === 'string'
          ? item.highlights.split(',').map((h: string) => h.trim()).filter(Boolean)
          : [],
      };
    }
  );

  const filteredTimeline =
    activeFilter === 'all'
      ? timelineList
      : timelineList.filter((item) => item.type === activeFilter);

  return (
    <section id="experience" className="py-20 md:py-28 relative z-20 bg-[#171A1D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Seksi */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20252B] border border-[#2B3038] text-[11px] font-semibold text-[#F5B301] uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Pendidikan & Pengalaman</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-sora text-white tracking-tight">
            Rekam Jejak <span className="text-[#F5B301]">Akademik & Karir</span>
          </h2>
          <div className="w-16 h-1.5 bg-[#F5B301] mx-auto mt-3 rounded-full" />
          <p className="text-sm sm:text-base text-gray-400 mt-4 leading-relaxed font-normal">
            Perjalanan studi di Universitas Pahlawan Tuanku Tambusai serta pengalaman organisasi dan magang di bidang teknologi informasi.
          </p>

          {/* Filter Tab */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'education', label: 'Pendidikan' },
              { id: 'experience', label: 'Pengalaman & Karir' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#F5B301] text-[#1E2328] font-bold shadow-md shadow-[#F5B301]/20 scale-105'
                    : 'bg-[#20252B] text-gray-300 hover:text-white border border-[#2B3038] hover:border-[#3E454F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Line Container */}
        {filteredTimeline.length === 0 ? (
          <div className="text-center py-16 bg-[#20252B]/40 rounded-2xl border border-dashed border-[#2B3038] max-w-md mx-auto">
            <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">Belum ada riwayat untuk kategori ini.</p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-10 border-l-2 border-[#F5B301]/40 ml-4 sm:ml-8 space-y-8">
            <AnimatePresence>
              {filteredTimeline.map((item, index) => {
                const isEdu = item.type === 'education';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="relative group"
                  >
                    {/* Node Titik Kuning di Garis Timeline */}
                    <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-4 h-4 rounded-full bg-[#171A1D] border-2 border-[#F5B301] flex items-center justify-center group-hover:scale-125 transition-transform">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F5B301] animate-ping" />
                    </div>

                    {/* Kartu Konten */}
                    <div className="bg-[#20252B] border border-[#2B3038] hover:border-[#F5B301]/60 p-6 rounded-2xl transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1">
                      {/* Badge Kategori & Periode Tahun */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                            isEdu
                              ? 'bg-[#F5B301]/10 text-[#F5B301] border-[#F5B301]/30'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {isEdu ? <GraduationCap className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                          <span>{isEdu ? 'Education' : 'Experience'}</span>
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                          <Calendar className="w-3.5 h-3.5 text-[#F5B301]" />
                          <span>{item.period}</span>
                        </div>
                      </div>

                      {/* Judul & Institusi */}
                      <h3 className="text-lg sm:text-xl font-bold font-sora text-white group-hover:text-[#F5B301] transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {item.institution && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#F5B301] font-medium mt-1.5">
                          <Building2 className="w-4 h-4 shrink-0" />
                          <span>{item.institution}</span>
                        </div>
                      )}

                      {/* Deskripsi */}
                      {item.description && (
                        <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed font-normal">
                          {item.description}
                        </p>
                      )}

                      {/* Poin-Poin Pencapaian / Highlights */}
                      {item.highlights.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#2B3038]/70 space-y-2">
                          {item.highlights.map((point: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                              <Award className="w-3.5 h-3.5 text-[#F5B301] shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{point}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
};
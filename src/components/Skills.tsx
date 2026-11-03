import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Code,
  FileCode,
  Atom,
  Database,
  Server,
  Wrench,
  Palette,
  Terminal,
  Cpu,
  Layers,
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { skills: contextSkills } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools & Design', 'Language'];

  // Normalisasi data skills dari Context (mendukung format flat array maupun format bertingkat/kategori)
  let skillList: any[] = [];

  if (Array.isArray(contextSkills)) {
    // Jika formatnya kategori yang punya sub-array "items" atau "skills"
    if (contextSkills.length > 0 && (contextSkills[0].items || contextSkills[0].skills)) {
      contextSkills.forEach((catGroup: any) => {
        const groupCatName = catGroup.category || catGroup.name || 'Frontend';
        const subItems = catGroup.items || catGroup.skills || [];
        subItems.forEach((item: any, idx: number) => {
          skillList.push({
            id: item.id || `${groupCatName}-${idx}`,
            name: item.name || item.title || 'Skill',
            description: item.description || item.desc || '',
            category: item.category || groupCatName,
            level: item.level || item.percentage || 85,
            icon: item.icon || '',
          });
        });
      });
    } else {
      // Jika formatnya flat array dari Admin Tab
      skillList = contextSkills.map((item: any, idx: number) => ({
        id: item.id || `skill-${idx}`,
        name: item.name || item.title || 'Skill',
        description: item.description || item.desc || '',
        category: item.category || 'Frontend',
        level: item.level || item.percentage || 85,
        icon: item.icon || '',
      }));
    }
  }

  // Helper untuk menentukan icon yang cocok berdasarkan nama/kategori
  const getSkillIcon = (name: string, category: string) => {
    const n = name.toLowerCase();
    const c = category.toLowerCase();

    if (n.includes('html') || n.includes('css')) return <Code className="w-5 h-5 text-[#F5B301]" />;
    if (n.includes('script') || n.includes('js') || n.includes('ts')) return <FileCode className="w-5 h-5 text-[#F5B301]" />;
    if (n.includes('react')) return <Atom className="w-5 h-5 text-[#F5B301]" />;
    if (c.includes('database') || n.includes('sql') || n.includes('mongo')) return <Database className="w-5 h-5 text-[#F5B301]" />;
    if (c.includes('backend') || n.includes('node') || n.includes('php') || n.includes('laravel')) return <Server className="w-5 h-5 text-[#F5B301]" />;
    if (c.includes('design') || n.includes('figma') || n.includes('ui')) return <Palette className="w-5 h-5 text-[#F5B301]" />;
    if (c.includes('tool') || n.includes('git') || n.includes('docker')) return <Wrench className="w-5 h-5 text-[#F5B301]" />;
    if (c.includes('iot') || n.includes('esp') || n.includes('arduino')) return <Cpu className="w-5 h-5 text-[#F5B301]" />;
    return <Terminal className="w-5 h-5 text-[#F5B301]" />;
  };

  // Filter skills sesuai tombol yang aktif
  const filteredSkills =
    activeCategory === 'All'
      ? skillList
      : skillList.filter((s) => {
          const cat = String(s.category).toLowerCase();
          const target = activeCategory.toLowerCase();
          if (target === 'tools & design') return cat.includes('tool') || cat.includes('design');
          return cat === target;
        });

  return (
    <section id="skills" className="py-20 md:py-28 relative z-20 bg-[#171A1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Seksi */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20252B] border border-[#2B3038] text-[11px] font-semibold text-[#F5B301] uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Keahlian & Penguasaan</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-sora text-white tracking-tight">
            Tech Stack <span className="text-[#F5B301]">& Skills</span>
          </h2>
          <div className="w-16 h-1.5 bg-[#F5B301] mx-auto mt-3 rounded-full" />
          <p className="text-sm sm:text-base text-gray-400 mt-4 leading-relaxed font-normal">
            Kombinasi teknologi frontend, backend, manajemen basis data, dan tools pengembangan yang saya kuasai dalam pembuatan aplikasi.
          </p>

          {/* Tombol Filter Kategori */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#F5B301] text-[#1E2328] font-bold shadow-md shadow-[#F5B301]/20 scale-105'
                      : 'bg-[#20252B] text-gray-300 hover:text-white border border-[#2B3038] hover:border-[#3E454F]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Kartu Skills */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-16 bg-[#20252B]/40 rounded-2xl border border-dashed border-[#2B3038] max-w-md mx-auto">
            <Layers className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">Belum ada keahlian untuk kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#20252B] border border-[#2B3038] hover:border-[#F5B301]/60 p-6 rounded-2xl flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group"
                >
                  <div>
                    {/* Header Kartu: Ikon & Badge Kategori */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#171A1D] border border-[#2B3038] flex items-center justify-center group-hover:scale-110 transition-transform">
                        {getSkillIcon(skill.name, skill.category)}
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-[#171A1D] border border-[#2B3038] text-[10px] font-mono text-gray-400">
                        {skill.category}
                      </span>
                    </div>

                    {/* Judul & Deskripsi Skill */}
                    <h3 className="text-base sm:text-lg font-bold font-sora text-white group-hover:text-[#F5B301] transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-normal min-h-[36px]">
                      {skill.description}
                    </p>
                  </div>

                  {/* Bar Persentase Tingkat Penguasaan */}
                  <div className="mt-6 pt-4 border-t border-[#2B3038]/70">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-gray-400">Tingkat Penguasaan</span>
                      <span className="text-[#F5B301] font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#171A1D] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-[#F5B301] to-[#FCD053] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
};
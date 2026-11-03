import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Github, FolderGit2 } from 'lucide-react';

export const Projects: React.FC = () => {
  const { projects: contextProjects } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Web App', 'IoT & System', 'AI & System', 'Design / UI'];

  const projectList = (contextProjects && contextProjects.length > 0 ? contextProjects : []).map(
    (item: any, index: number) => {
      let category = item.category || 'Web App';
      const catLower = String(category).toLowerCase();
      if (catLower.includes('iot') || catLower.includes('hardware')) {
        category = 'IoT & System';
      } else if (catLower.includes('ai') || catLower.includes('machine')) {
        category = 'AI & System';
      } else if (catLower.includes('design') || catLower.includes('ui')) {
        category = 'Design / UI';
      } else if (catLower.includes('web')) {
        category = 'Web App';
      }

      let tags: string[] = [];
      if (Array.isArray(item.tags)) {
        tags = item.tags;
      } else if (Array.isArray(item.technologies)) {
        tags = item.technologies;
      } else if (typeof item.tags === 'string') {
        tags = item.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      } else if (typeof item.technologies === 'string') {
        tags = item.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
      }

      return {
        id: item.id || `project-${index + 1}`,
        title: item.title || item.name || 'Projek Tanpa Tajuk',
        description: item.description || 'Penerangan projek belum ditambah.',
        category,
        tags,
        image: item.image || item.imageUrl || '',
        demo: item.demo || item.liveUrl || item.link || '',
        github: item.github || item.githubUrl || '',
      };
    }
  );

  const filteredProjects =
    activeCategory === 'All'
      ? projectList
      : projectList.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 md:py-28 relative z-20 bg-[#171A1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tajuk Bahagian */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-black font-sora text-white tracking-tight">
            Proyek <span className="text-[#F5B301]">Pilihan</span>
          </h2>
          <div className="w-16 h-1.5 bg-[#F5B301] mx-auto mt-3 rounded-full" />
          <p className="text-sm sm:text-base text-gray-400 mt-4 leading-relaxed font-normal">
            Beberapa aplikasi web dan sistem informasi yang telah saya kembangkan selama masa perkuliahan dan magang.
          </p>

          {/* Butang Penapis Kategori */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
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

        {/* Grid Kad Projek */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-[#20252B]/40 rounded-2xl border border-dashed border-[#2B3038] max-w-md mx-auto">
            <FolderGit2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">Belum ada projek untuk kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="group rounded-2xl bg-[#20252B] border border-[#2B3038] hover:border-[#F5B301]/60 transition-all duration-300 overflow-hidden flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1B1E22]">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#20252B] to-[#171A1D] text-gray-600">
                        <FolderGit2 className="w-12 h-12 text-[#F5B301]/40 mb-2" />
                        <span className="text-xs uppercase font-mono tracking-widest text-gray-500">
                          {project.category}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-mono font-bold text-[#F5B301] border border-[#F5B301]/30 shadow-md">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-sora text-white group-hover:text-[#F5B301] transition-colors leading-snug">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-400 mt-2.5 leading-relaxed font-normal">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#2B3038]/70 flex flex-col gap-4">
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md bg-[#171A1D] border border-[#2B3038] text-[10px] sm:text-[11px] text-[#F5B301] font-mono font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {(project.demo || project.github) && (
                        <div className="flex items-center gap-4 pt-1 text-xs font-semibold">
                          {project.demo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#F5B301] hover:text-[#FCD053] transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Live Preview</span>
                            </a>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
                            >
                              <Github className="w-4 h-4" />
                              <span>Source Code</span>
                            </a>
                          )}
                        </div>
                      )}
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
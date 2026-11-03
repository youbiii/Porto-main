
import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  Database,
  GalleryHorizontal,
} from 'lucide-react';

import { ProfileTab } from './tabs/ProfileTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import SelectworkTab from './tabs/SelectworkTab';
import { SkillsTab } from './tabs/SkillsTab';
import { TimelineTab } from './tabs/TimelineTab';
import { DatabaseTab } from './tabs/DatabaseTab';

import { usePortfolio } from '../../context/PortfolioContext';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab =
  | 'profile'
  | 'projects'
  | 'selectwork'
  | 'skills'
  | 'timeline'
  | 'database';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');

  const { dbStatus } = usePortfolio();

  // Matikan scroll halaman belakang saat modal terbuka
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Tutup modal dengan tombol Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    {
      id: 'profile',
      label: 'Profil & Lanyard',
      icon: User,
    },
    {
      id: 'projects',
      label: 'Proyek & Galeri',
      icon: FolderGit2,
    },
    {
      id: 'selectwork',
      label: 'Selected Works',
      icon: GalleryHorizontal,
    },
    {
      id: 'skills',
      label: 'Keahlian',
      icon: Cpu,
    },
    {
      id: 'timeline',
      label: 'Riwayat',
      icon: Briefcase,
    },
  ] as const;

  return (
    <div
      data-lenis-prevent
      onWheel={(event) => event.stopPropagation()}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-6"
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label="Admin Management Console"
        className="relative z-10 flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#2F353E] bg-[#141619] text-white shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-[#2B3038] bg-[#1A1D21] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#F5B301] shadow-[0_0_10px_#F5B301]" />

            <h2 className="truncate text-sm font-bold font-sora sm:text-base">
              Admin Management Console
            </h2>

            <div className="ml-1 hidden items-center gap-1.5 rounded-full border border-[#2B3038] bg-[#20252B] px-2.5 py-1 font-mono text-[11px] text-gray-300 sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${
                  dbStatus.connected
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                }`}
              />

              <span>
                {dbStatus.connected
                  ? 'MongoDB Online'
                  : 'Fallback Active'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup admin"
            className="ml-3 shrink-0 rounded-lg p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Navigation */}
        <nav
          aria-label="Navigasi admin"
          className="flex shrink-0 select-none items-center gap-1 overflow-x-auto border-b border-[#2B3038] bg-[#121417] px-3 sm:gap-2 sm:px-6"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-t-xl border-x px-3 py-3.5 text-xs font-bold transition-all sm:gap-2.5 sm:px-4 ${
                  isActive
                    ? 'border-[#2B3038] border-t-2 border-t-[#F5B301] bg-[#171A1E] text-[#F5B301]'
                    : 'border-transparent text-gray-400 hover:bg-[#1E2328]/40 hover:text-gray-200'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-[#F5B301]' : 'text-gray-400'
                  }`}
                />

                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Database */}
          <button
            type="button"
            onClick={() => setActiveTab('database')}
            aria-current={
              activeTab === 'database' ? 'page' : undefined
            }
            className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] transition-all ${
              activeTab === 'database'
                ? 'border border-[#F5B301] bg-[#F5B301]/10 text-[#F5B301]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Database</span>
          </button>
        </nav>

        {/* Tab content */}
        <main
          data-lenis-prevent
          tabIndex={0}
          className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2B3038] flex-1 overflow-y-auto overscroll-contain bg-[#141619] p-4 focus:outline-none sm:p-6"
        >
          {activeTab === 'profile' && <ProfileTab />}

          {activeTab === 'projects' && <ProjectsTab />}

          {activeTab === 'selectwork' && <SelectworkTab />}

          {activeTab === 'skills' && <SkillsTab />}

          {activeTab === 'timeline' && <TimelineTab />}

          {activeTab === 'database' && <DatabaseTab />}
        </main>
      </div>
    </div>
  );
};

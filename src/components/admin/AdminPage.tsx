import React, { useState } from 'react';
import {
  Lock,
  ArrowLeft,
  LogOut,
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

type AdminTab =
  | 'profile'
  | 'projects'
  | 'selectwork'
  | 'skills'
  | 'timeline'
  | 'database';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('portfolio_admin_auth') === 'true';
  });
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');

  const { dbStatus } = usePortfolio();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setError(false);
      setPin('');
      sessionStorage.setItem('portfolio_admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('portfolio_admin_auth');
    setIsAuthenticated(false);
    setPin('');
  };

  const goHome = () => {
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141619] p-4 text-white">
        <div className="w-full max-w-sm rounded-2xl bg-[#1E2328] border border-[#3B3F46] p-6 shadow-2xl relative">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F5B301]/10 flex items-center justify-center text-[#F5B301]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-sora">Admin Access</h1>
              <p className="text-xs text-gray-400 mt-1">
                Masukkan 4-digit PIN keamanan portofolio
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-[0.5em] py-2.5 rounded-xl bg-[#2A2E34] border border-[#3B3F46] focus:border-[#F5B301] focus:outline-none text-white font-mono"
                autoFocus
              />

              {error && (
                <p className="text-xs text-red-400 font-medium">
                  PIN salah, silakan coba lagi.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F5B301] hover:bg-[#FCD053] text-[#1E2328] font-bold text-sm transition cursor-pointer"
              >
                Masuk Dashboard
              </button>
            </form>

            <button
              type="button"
              onClick={goHome}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#F5B301] transition pt-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen flex flex-col bg-[#141619] text-white">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-[#2B3038] bg-[#1A1D21] px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-3 w-3 shrink-0 rounded-full bg-[#F5B301] shadow-[0_0_10px_#F5B301]" />

          <h1 className="truncate text-sm font-bold font-sora sm:text-base">
            Admin Management Console
          </h1>

          <div className="ml-1 hidden items-center gap-1.5 rounded-full border border-[#2B3038] bg-[#20252B] px-2.5 py-1 font-mono text-[11px] text-gray-300 sm:flex">
            <span
              className={`h-2 w-2 rounded-full ${
                dbStatus.connected ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />

            <span>
              {dbStatus.connected ? 'MongoDB Online' : 'Fallback Active'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#2B3038] bg-[#20252B] px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-[#F5B301] hover:text-white cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Lihat Website</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Keluar dari admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav
        aria-label="Navigasi admin"
        className="flex shrink-0 select-none items-center gap-1 overflow-x-auto border-b border-[#2B3038] bg-[#121417] px-3 sm:gap-2 sm:px-8"
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
              className={`flex shrink-0 items-center gap-2 rounded-t-xl border-x px-3 py-3.5 text-xs font-bold transition-all cursor-pointer sm:gap-2.5 sm:px-4 ${
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
          aria-current={activeTab === 'database' ? 'page' : undefined}
          className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] transition-all cursor-pointer ${
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
      <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-8">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'selectwork' && <SelectworkTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'database' && <DatabaseTab />}
      </main>
    </div>
  );
};


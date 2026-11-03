import React from 'react';
import { PERSONAL_INFO } from '../data';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E2328] py-5 border-t border-[#3B3F46] relative z-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
          <span className="text-xs font-bold font-sora text-white">
            {PERSONAL_INFO.name}
          </span>
          <span className="text-xs text-[#F5B301]">•</span>
          <span className="text-xs text-gray-300">
            {PERSONAL_INFO.degree}
          </span>
          <span className="text-xs text-[#F5B301] hidden sm:inline">•</span>
          <span className="text-xs text-gray-400 hidden sm:inline">
            {PERSONAL_INFO.university}
          </span>
        </div>
        <p className="text-xs text-gray-400 font-mono">
          © {new Date().getFullYear()} Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
};

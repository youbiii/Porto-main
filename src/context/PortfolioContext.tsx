import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Data from '../data';

const rawData = Data as Record<string, any>;
const defaultProfile = rawData.PERSONAL_INFO || rawData.initialProfile || rawData.profile || {};
const defaultProjects = rawData.PROJECTS || rawData.initialProjects || rawData.projects || [];
const defaultSelectwork = rawData.SELECTED_WORKS || rawData.initialSelectwork || rawData.selectwork || [];
const defaultSkills = rawData.SKILLS || rawData.SKILL_CATEGORIES || rawData.skills || [];
const defaultTimeline = rawData.TIMELINE || rawData.initialTimeline || rawData.timeline || rawData.EXPERIENCES || [];

interface PortfolioContextType {
  personalInfo: any;
  profile: any;
  projects: any[];
  selectwork: any[];
  skills: any[];
  timeline: any[];
  dbStatus: { connected: boolean; mode: 'mongodb' | 'fallback'; latency?: number };
  isSaving: boolean;
  updatePersonalInfo: (data: any) => Promise<void>;
  saveProjects: (data: any[]) => Promise<void>;
  saveSelectwork: (data: any[]) => Promise<void>;
  saveSkills: (data: any[]) => Promise<void>;
  saveTimeline: (data: any[]) => Promise<void>;
  uploadImageFile: (file: File) => Promise<string>;
  syncToMongo: () => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState(() => {
    const saved = localStorage.getItem('porto_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('porto_projects');
    return saved ? JSON.parse(saved) : defaultProjects;
  });
  const [selectwork, setSelectwork] = useState(() => {
    const saved = localStorage.getItem('selected_works_projects');
    return saved ? JSON.parse(saved) : defaultSelectwork;
  });
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('porto_skills');
    return saved ? JSON.parse(saved) : defaultSkills;
  });
  const [timeline, setTimeline] = useState(() => {
    const saved = localStorage.getItem('porto_timeline');
    return saved ? JSON.parse(saved) : defaultTimeline;
  });

  const [dbStatus, setDbStatus] = useState<{ connected: boolean; mode: 'mongodb' | 'fallback'; latency?: number }>({
    connected: false,
    mode: 'fallback',
  });
  const [isSaving, setIsSaving] = useState(false);

  const checkStatusAndFetch = async () => {
    try {
      const res = await fetch('/api/status');
      const status = await res.json();
      setDbStatus(status);

      if (status.connected) {
        const dataRes = await fetch('/api/portfolio');
        const data = await dataRes.json();
        if (data.profile) setPersonalInfo(data.profile);
        if (data.projects) setProjects(data.projects);
        if (data.selectwork && data.selectwork.length > 0) {
          setSelectwork(data.selectwork);
          localStorage.setItem('selected_works_projects', JSON.stringify(data.selectwork));
        }
        if (data.skills) setSkills(data.skills);
        if (data.timeline) setTimeline(data.timeline);
      }
    } catch {
      setDbStatus({ connected: false, mode: 'fallback' });
    }
  };

  useEffect(() => {
    checkStatusAndFetch();
  }, []);

  const uploadImageFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const updatePersonalInfo = async (newProfile: any) => {
    setIsSaving(true);
    try {
      setPersonalInfo(newProfile);
      localStorage.setItem('porto_profile', JSON.stringify(newProfile));

      if (dbStatus.connected) {
        await fetch('/api/portfolio/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProfile),
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const saveProjects = async (updatedProjects: any[]) => {
    setIsSaving(true);
    try {
      setProjects(updatedProjects);
      localStorage.setItem('porto_projects', JSON.stringify(updatedProjects));

      if (dbStatus.connected) {
        await fetch('/api/database/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: personalInfo, projects: updatedProjects, selectwork, skills, timeline }),
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const saveSelectwork = async (updatedSelectwork: any[]) => {
    setIsSaving(true);
    try {
      setSelectwork(updatedSelectwork);
      localStorage.setItem('selected_works_projects', JSON.stringify(updatedSelectwork));

      if (dbStatus.connected) {
        await fetch('/api/database/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: personalInfo, projects, selectwork: updatedSelectwork, skills, timeline }),
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const saveSkills = async (updatedSkills: any[]) => {
    setIsSaving(true);
    try {
      setSkills(updatedSkills);
      localStorage.setItem('porto_skills', JSON.stringify(updatedSkills));

      if (dbStatus.connected) {
        await fetch('/api/database/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: personalInfo, projects, selectwork, skills: updatedSkills, timeline }),
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const saveTimeline = async (updatedTimeline: any[]) => {
    setIsSaving(true);
    try {
      setTimeline(updatedTimeline);
      localStorage.setItem('porto_timeline', JSON.stringify(updatedTimeline));

      if (dbStatus.connected) {
        await fetch('/api/database/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: personalInfo, projects, selectwork, skills, timeline: updatedTimeline }),
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const syncToMongo = async () => {
    try {
      const res = await fetch('/api/database/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: personalInfo, projects, selectwork, skills, timeline }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        personalInfo,
        profile: personalInfo,
        projects,
        selectwork,
        skills,
        timeline,
        dbStatus,
        isSaving,
        updatePersonalInfo,
        saveProjects,
        saveSelectwork,
        saveSkills,
        saveTimeline,
        uploadImageFile,
        syncToMongo,
        refreshData: checkStatusAndFetch,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
};
export const usePortfolioData = usePortfolio;
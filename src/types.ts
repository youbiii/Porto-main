export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools & Design' | 'Language';
  level: number; // 0-100
  iconName: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: 'Web App' | 'IoT & System' | 'AI & System' | 'Design / UI';
  tags: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  highlights: string[];
}

export interface TimelineItem {
  id: string;
  type: 'Education' | 'Experience' | 'Organization';
  title: string;
  institution: string;
  period: string;
  description: string;
  achievements?: string[];
}

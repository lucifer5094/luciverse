// Site configuration and content management utilities
import { useState, useEffect } from 'react';

export interface SiteConfig {
  meta: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    url: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
    spacing: 'compact' | 'comfortable' | 'spacious';
  };
  navigation: {
    items: Array<{
      name: string;
      href: string;
      visible: boolean;
      order: number;
    }>;
  };
  content: {
    hero: {
      title: string;
      subtitle: string;
      backgroundGradient: string;
      ctaText: string;
      ctaLink: string;
    };
    about: {
      title: string;
      description: string;
      image: string;
      skills: string[];
    };
    projects: {
      featured: Array<{
        id: string;
        title: string;
        description: string;
        tech: string[];
        gradient: string;
        icon: string;
        visible: boolean;
        order: number;
        link?: string;
        github?: string;
        image?: string;
      }>;
    };
    contact: {
      title: string;
      description: string;
      email: string;
      social: Array<{
        platform: string;
        url: string;
        visible: boolean;
      }>;
    };
  };
  features: {
    darkMode: boolean;
    animations: boolean;
    ownerMode: boolean;
    analytics: boolean;
  };
}

// Default site configuration
export const defaultSiteConfig: SiteConfig = {
  meta: {
    title: 'Luciverse - Universe of Code & Creativity',
    description: 'Dive into my universe of development, design, and digital experiments',
    keywords: ['developer', 'portfolio', 'web development', 'design', 'creative'],
    author: 'Lucifer',
    url: 'https://luciverse.dev',
  },
  theme: {
    primaryColor: '#8b5cf6',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter',
    borderRadius: '1rem',
    spacing: 'comfortable',
  },
  navigation: {
    items: [
      { name: 'Home', href: '/', visible: true, order: 1 },
      { name: 'About', href: '/about', visible: true, order: 2 },
      { name: 'Projects', href: '/projects', visible: true, order: 3 },
      { name: 'Lab', href: '/lab', visible: true, order: 4 },
      { name: 'Logs', href: '/logs', visible: true, order: 5 },
      { name: 'Contact', href: '/contact', visible: true, order: 6 },
    ],
  },
  content: {
    hero: {
      title: 'Welcome to Luciverse',
      subtitle: 'Dive into my universe of development, design, and digital experiments',
      backgroundGradient: 'from-light-background via-white to-gray-50',
      ctaText: 'Explore My Work',
      ctaLink: '/projects',
    },
    about: {
      title: 'Meet the Creator',
      description: "I'm a passionate developer crafting digital experiences that blend creativity with cutting-edge technology. From web applications to experimental projects, I explore the boundaries of what's possible.",
      image: '/assets/profile.jpg',
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'UI/UX Design'],
    },
    projects: {
      featured: [
        {
          id: 'ai-web-app',
          title: 'AI-Powered Web App',
          description: 'A sophisticated web application leveraging machine learning to provide intelligent user experiences.',
          tech: ['React', 'Python', 'TensorFlow'],
          gradient: 'from-blue-500 to-purple-600',
          icon: '🤖',
          visible: true,
          order: 1,
        },
        {
          id: 'ecommerce',
          title: 'E-Commerce Platform',
          description: 'Full-stack e-commerce solution with modern design and seamless user experience.',
          tech: ['Next.js', 'Node.js', 'PostgreSQL'],
          gradient: 'from-green-500 to-teal-600',
          icon: '🛒',
          visible: true,
          order: 2,
        },
        {
          id: 'data-viz',
          title: 'Data Visualization Tool',
          description: 'Interactive dashboard for complex data analysis and beautiful visualizations.',
          tech: ['D3.js', 'React', 'MongoDB'],
          gradient: 'from-orange-500 to-red-600',
          icon: '📊',
          visible: true,
          order: 3,
        },
      ],
    },
    contact: {
      title: "Let's Connect",
      description: "Ready to collaborate on something amazing? Let's discuss your ideas and bring them to life together.",
      email: 'hello@luciverse.dev',
      social: [
        { platform: 'GitHub', url: 'https://github.com/lucifer', visible: true },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/lucifer', visible: true },
        { platform: 'Twitter', url: 'https://twitter.com/lucifer', visible: true },
      ],
    },
  },
  features: {
    darkMode: true,
    animations: true,
    ownerMode: true,
    analytics: false,
  },
};

// Site configuration management functions
export const siteConfigManager = {
  // Get current configuration
  getConfig: (): SiteConfig => {
    if (typeof window === 'undefined') return defaultSiteConfig;
    
    const stored = localStorage.getItem('siteConfig');
    return stored ? { ...defaultSiteConfig, ...JSON.parse(stored) } : defaultSiteConfig;
  },

  // Update configuration
  updateConfig: (updates: Partial<SiteConfig>): void => {
    if (typeof window === 'undefined') return;
    
    const current = siteConfigManager.getConfig();
    const updated = { ...current, ...updates };
    localStorage.setItem('siteConfig', JSON.stringify(updated));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('siteConfigUpdated', { detail: updated }));
  },

  // Reset to defaults
  resetConfig: (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('siteConfig');
    window.dispatchEvent(new CustomEvent('siteConfigUpdated', { detail: defaultSiteConfig }));
  },

  // Export configuration
  exportConfig: (): string => {
    return JSON.stringify(siteConfigManager.getConfig(), null, 2);
  },

  // Import configuration
  importConfig: (configString: string): boolean => {
    try {
      const config = JSON.parse(configString);
      siteConfigManager.updateConfig(config);
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  },

  // Add new project
  addProject: (project: SiteConfig['content']['projects']['featured'][0]): void => {
    const config = siteConfigManager.getConfig();
    config.content.projects.featured.push(project);
    siteConfigManager.updateConfig(config);
  },

  // Update project
  updateProject: (projectId: string, updates: Partial<SiteConfig['content']['projects']['featured'][0]>): void => {
    const config = siteConfigManager.getConfig();
    const projectIndex = config.content.projects.featured.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      config.content.projects.featured[projectIndex] = {
        ...config.content.projects.featured[projectIndex],
        ...updates,
      };
      siteConfigManager.updateConfig(config);
    }
  },

  // Delete project
  deleteProject: (projectId: string): void => {
    const config = siteConfigManager.getConfig();
    config.content.projects.featured = config.content.projects.featured.filter(p => p.id !== projectId);
    siteConfigManager.updateConfig(config);
  },

  // Reorder projects
  reorderProjects: (projectIds: string[]): void => {
    const config = siteConfigManager.getConfig();
    const reordered = projectIds.map((id, index) => {
      const project = config.content.projects.featured.find(p => p.id === id);
      return project ? { ...project, order: index + 1 } : null;
    }).filter(Boolean) as SiteConfig['content']['projects']['featured'];
    
    config.content.projects.featured = reordered;
    siteConfigManager.updateConfig(config);
  },
};

// React hook for using site configuration
export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);

  useEffect(() => {
    // Load initial config
    setConfig(siteConfigManager.getConfig());

    // Listen for updates
    const handleConfigUpdate = (event: CustomEvent<SiteConfig>) => {
      setConfig(event.detail);
    };

    window.addEventListener('siteConfigUpdated', handleConfigUpdate as EventListener);
    return () => window.removeEventListener('siteConfigUpdated', handleConfigUpdate as EventListener);
  }, []);

  return {
    config,
    updateConfig: siteConfigManager.updateConfig,
    resetConfig: siteConfigManager.resetConfig,
    exportConfig: siteConfigManager.exportConfig,
    importConfig: siteConfigManager.importConfig,
    addProject: siteConfigManager.addProject,
    updateProject: siteConfigManager.updateProject,
    deleteProject: siteConfigManager.deleteProject,
    reorderProjects: siteConfigManager.reorderProjects,
  };
};

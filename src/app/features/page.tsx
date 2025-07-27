'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface Feature {
  name: string;
  subfeatures: string[];
}

interface Category {
  icon: string;
  description: string;
  features: Feature[];
}

interface FeatureData {
  [key: string]: Category;
}

const featuresData: { implemented: FeatureData; todo: FeatureData } = {
  implemented: {
    "Overview": {
      icon: '📊',
      description: 'A high-level overview of the Luciverse project, showing the distribution of all implemented features.',
      features: []
    },
    "Main Pages/Sections": {
      icon: '📄',
      description: 'Core pages that form the main user-facing sections of the website.',
      features: [
        { name: 'Home Page (/)', subfeatures: ['Hero section with editable title & subtitle', 'Interactive navigation cards to other sections', 'Animated background elements', 'Statistics display (projects, years, technologies, achievements)', 'Dynamic highlights section', 'Owner editing capabilities', 'Floating particle animations', 'Scroll-based parallax effects', 'Real-time content editing', 'Card hover animations', 'Responsive design'] },
        { name: 'About Page (/about)', subfeatures: ['Personal introduction & story with inline editing', 'Interactive tabs: Overview, Journey, Philosophy', 'Skills section with animated progress bars', 'Personal interests showcase', 'Music preferences section with sound effects', 'Core beliefs & philosophy section', 'Professional journey timeline', 'Fun facts section', 'Resume download link', 'GitHub profile link', 'Sound effects for interactions', 'Favorite section marking', 'Scroll-to-top functionality', 'Intersection observer animations', 'Local storage for preferences', 'Responsive media queries', 'Professional platform links', 'Enhanced skills visualization'] },
        { name: 'Projects Page (/projects)', subfeatures: ['Project showcase with advanced filtering', 'Real-time search functionality', 'Category filters (AI/ML, Web Dev, Hardware, College)', 'Status filters (Completed, Ongoing, Notable)', 'Project cards with detailed information', 'Technology stack display with tags', 'Live demo & GitHub links', 'Editable content sections', 'Project image optimization', 'Responsive grid layout', 'Performance optimizations', 'Project statistics'] },
        { name: 'Achievements Page (/achievements)', subfeatures: ['Achievement showcase with categories', 'Advanced category filtering (Certifications, Awards, Competitions, Academic, etc.)', 'Real-time search functionality', 'Certificate viewing and download', 'Date-based sorting and organization', 'External links to achievement sources', 'Grid/List view toggle', 'Achievement statistics', 'Bulk management capabilities', 'Export functionality', 'Achievement verification'] },
        { name: 'Vault Page (/vault)', subfeatures: ['Advanced document management system', 'Private/Public document toggle', 'Powerful search & filter functionality', 'Document type categorization', 'File upload/download capabilities', 'Tag-based organization system', 'JSON import/export functionality', 'Document versioning', 'Bulk operations', 'Security features', 'File type validation', 'Storage optimization', 'Document metadata'] },
        { name: 'Contact Page (/contact)', subfeatures: ['Contact form with real-time validation', 'Social media links integration', 'Email integration system', 'Form submission handling', 'Contact information display', 'Interactive hover effects', 'Response status indicators', 'Anti-spam protection', 'Contact analytics'] },
        { name: 'Logs Page (/logs)', subfeatures: ['GeeksforGeeks chapter updates tracking', 'Milestone tracking system', 'Achievement timeline', 'Future plans section', 'Owner-editable content', 'Entry management system', 'Category-based filtering', 'Importance level indicators', 'Tag system', 'Date-based organization', 'Add/Edit/Delete functionality', 'Timeline visualization'] },
        { name: 'Lab Page (/lab)', subfeatures: ['Interactive experiments playground', 'Color palette tool', 'CSS animations showcase', 'Component testing area', 'Live code demonstrations', 'Performance testing tools', 'UI component gallery', 'Technical demos', 'Experimental features testing'] },
        { name: 'Performance Demo Page (/performance-demo)', subfeatures: ['Performance & UX showcase', 'Loading states demonstration', 'Image optimization examples', 'Error boundary testing', 'Search functionality demo', 'PWA features showcase', 'Technical metrics display'] },
        { name: 'Test Pages (/test-*)', subfeatures: ['Hydration testing', 'Simple component testing', 'Development debugging tools', 'Feature validation'] },
        { name: 'Interview Prep Hub (/interview-prep)', subfeatures: ['System to add and manage interview problems with solutions', 'Filterable by topic, company, and difficulty', 'Practice timer and tracking', 'Solution explanations and notes', 'Progress tracking and statistics', 'Local storage persistence', 'Grid and list view modes', 'Comprehensive problem management', 'Real-time search functionality', 'Difficulty-based color coding', 'Session tracking and analytics'] },
        {
          name: 'GFG Campus Chapter Page (/gfg-chapter)',
          subfeatures: [
            'Hero section with dynamic chapter name',
            'Sticky tab-based navigation (About, Team, Events, etc.)',
            'Detailed "About Us" section with vision and mission',
            'Core Team showcase with roles and social links',
            'Dynamic "Coming Soon" placeholders for Events',
            'Dynamic "Coming Soon" placeholders for Achievements',
            'Dynamic "Coming Soon" placeholders for Partnerships',
            'Dynamic "Coming Soon" placeholders for Testimonials',
            'Responsive design for mobile and desktop',
            'Framer Motion for smooth animations and transitions',
            'Lucide-react for clean and consistent icons',
          ]
        }
      ]
    },
    "Admin & Management": {
      icon: '🔧',
      description: 'Backend features for site administration, content management, and security.',
      features: [
        { name: 'Admin Dashboard (/admin)', subfeatures: ['Comprehensive authentication system', 'Advanced content management', 'Vault document management', 'Achievement management', 'Site content editing', 'Real-time analytics dashboard', 'Bulk operations support', 'Statistics overview', 'User interaction tracking', 'Edit history logging', 'Export/Import capabilities', 'System health monitoring'] },
        { name: 'Admin Authentication (/admin-auth)', subfeatures: ['Secure login system with bcrypt', 'Session management', 'Access control & authorization', 'Development mode detection', 'Session expiration handling', 'Logout functionality'] },
        { name: 'Secret Edit Page (/secret-edit)', subfeatures: ['Advanced content editing interface', 'Theme customization tools', 'Navigation management', 'Site settings configuration', 'Custom CSS/JavaScript editor', 'Real-time preview', 'Project management', 'Design system controls'] }
      ]
    },
    "Core Components": {
      icon: '🧩',
      description: 'Fundamental building blocks that power the entire application.',
      features: [
        { name: 'Navigation & Layout', subfeatures: ['Responsive Navbar with theme toggle', 'Footer with contact info & links', 'Client-side layout management', 'Mobile-responsive design', 'Breadcrumb navigation', 'Loading state indicators'] },
        { name: 'UI/UX Components', subfeatures: ['Advanced Loading States: Skeleton loaders, spinners, pulse loaders', 'Error Boundaries: Graceful error handling with fallbacks', 'Notifications: Toast notification system', 'Modal System: Various modal types', 'Button components with variants', 'Form validation components'] },
        { name: 'Interactive Features', subfeatures: ['Theme System: Light/Dark mode with system preference', 'Sound Effects: Comprehensive hover/click audio feedback', 'Animations: Framer Motion powered animations', 'Intersection Observers: Scroll-based animations', 'Local Storage: User preference persistence', 'PWA Install Prompt: App installation guidance'] },
        { name: 'Content Management', subfeatures: ['Inline Editing: Real-time content editing system', 'Owner Controls: Admin access features', 'Live Preview: Content preview system', 'Owner Access Banner: Admin notification system', 'Owner Dashboard: Comprehensive admin interface', 'Owner Floating Controls: Quick access tools'] },
        { name: 'Performance & Optimization', subfeatures: ['Optimized Images: Lazy loading with progressive enhancement', 'Client-Only Components: Hydration optimization', 'Error Recovery: Automatic error boundary recovery', 'Performance Monitoring: UX metrics tracking', 'Reload Prevention: Development stability tools'] }
      ]
    },
    "PWA & Offline Features": {
      icon: '📱',
      description: 'Progressive Web App features for enhanced user experience.',
      features: [
        { name: 'PWA Core Features', subfeatures: ['Service Worker: Comprehensive offline support', 'App Manifest: Full installability configuration', 'Offline Indicator: Real-time connection status', 'Background Sync: Data synchronization', 'Caching Strategy: Smart resource caching', 'App Shortcuts: Quick action access'] },
        { name: 'Installation & Updates', subfeatures: ['PWA Install Prompt: User-friendly installation guide', 'Update notifications', 'App icon and splash screens', 'Cross-platform compatibility', 'Standalone app experience'] }
      ]
    },
    "Analytics & Tracking": {
      icon: '📈',
      description: 'Comprehensive analytics and user tracking systems.',
      features: [
        { name: 'User Analytics', subfeatures: ['Real-time user interaction tracking', 'Page view analytics', 'User behavior analysis', 'Session management', 'Performance metrics', 'Custom event tracking'] },
        { name: 'Analytics Dashboard', subfeatures: ['Simple Analytics Dashboard: Real-time metrics', 'Analytics Test Button: Testing functionality', 'User interaction statistics', 'Page popularity metrics', 'Activity timeline', 'Export analytics data'] },
        { name: 'Content Analytics', subfeatures: ['Edit history tracking', 'Content modification logs', 'User engagement metrics', 'Search query analytics', 'Feature usage statistics'] }
      ]
    },
    "Search & Data Systems": {
      icon: '🔍',
      description: 'Advanced search functionality and data management systems.',
      features: [
        { name: 'Enhanced Search', subfeatures: ['Fuzzy search with Levenshtein distance', 'Real-time search result highlighting', 'Debounced search for performance', 'Batch processing for large datasets', 'Web Worker support for heavy searches', 'Configurable search threshold and options', 'Quick search components'] },
        { name: 'Data Management', subfeatures: ['JSON-based content storage', 'File upload/download system', 'Document versioning', 'Data validation', 'Backup/restore functionality', 'API-based data access', 'Real-time data synchronization'] },
        { name: 'Content APIs', subfeatures: ['RESTful API endpoints', 'Data CRUD operations', 'Authentication middleware', 'Error handling', 'Content validation', 'Timestamp management'] }
      ]
    },
    "Security & Authentication": {
      icon: '🔒',
      description: 'Security features and authentication systems.',
      features: [
        { name: 'Authentication System', subfeatures: ['Secure admin authentication', 'Session-based authentication', 'Password hashing with bcrypt', 'Development mode security', 'Session expiration handling', 'Logout functionality'] },
        { name: 'Security Features', subfeatures: ['Authentication guards', 'Access control middleware', 'Input validation', 'XSS protection', 'Secure file handling', 'Environment-based security', 'CSRF protection'] },
        { name: 'Authorization', subfeatures: ['Role-based access control', 'Owner-only features', 'Protected routes', 'Development-only access', 'Session validation'] }
      ]
    },
    "Development & Debugging": {
      icon: '🛠️',
      description: 'Development tools and debugging features.',
      features: [
        { name: 'Development Tools', subfeatures: ['Hot reload prevention system', 'Cache clearing utilities', 'Error logging system', 'Development mode detection', 'Debug components', 'Test pages for feature validation'] },
        { name: 'Performance Tools', subfeatures: ['Performance monitoring', 'UX metrics tracking', 'Loading state optimization', 'Bundle analysis', 'Error boundary testing'] },
        { name: 'Utilities', subfeatures: ['Favicon generation scripts', 'Emergency reload stop', 'Reload count tracking', 'Cache management', 'Configuration utilities'] }
      ]
    }
  },
  todo: {
    "Gaming & Entertainment": {
      icon: '🎮',
      description: 'A personal hub for all gaming activities and entertainment.',
      features: [
        {
          name: 'Gamezone Hub',
          subfeatures: [
            'Static library of favorite games with personal ratings',
            'Dynamic "Currently Playing" status from Steam/PSN API',
            'Showcase of total playtime and recent achievements',
            '"My Top 5 Games" ranked list',
            'Section for PC specs and gaming setup',
            'Embedded Twitch/YouTube channel feed'
          ]
        },
        {
          name: 'Clash of Clans Stats Dashboard',
          subfeatures: [
            'API integration with developer.clashofclans.com',
            'Fetch live clan data using Clan Tag',
            'Display core clan stats (Level, Members, War Wins)',
            'Live list of all clan members with their roles',
            'Clan Capital and War League information',
            'Real-time data refresh mechanism'
          ]
        }
      ]
    },
    "Enhanced Productivity": {
      icon: '🚀',
      description: 'Advanced features to boost personal productivity and workflow management.',
      features: [
        { name: 'Advanced Kanban Board', subfeatures: ['Trello-like board with drag & drop', 'Custom columns and workflows', 'Task dependencies and priorities', 'Due dates and reminders', 'Team collaboration features', 'Time tracking integration'] },
        { name: 'Smart Notes & Journal', subfeatures: ['Rich text editor with markdown support', 'Tagging and categorization system', 'Search across all notes', 'Daily journal templates', 'Mood tracking integration', 'Export to various formats'] },
        { name: 'Time Management Suite', subfeatures: ['Pomodoro timer with customizable intervals', 'Task time estimation and tracking', 'Focus session analytics', 'Break reminders', 'Productivity insights dashboard'] }
      ]
    },
    "Enhanced Branding & Showcase": {
      icon: '✨',
      description: 'Advanced features for personal branding and professional showcase.',
      features: [
        { name: 'Professional Blog Platform', subfeatures: ['Full-fledged blog with SEO optimization', 'Rich content editor with code highlighting', 'Comment system and engagement metrics', 'Newsletter integration', 'Social media auto-posting', 'RSS feed generation'] },
        { name: 'Advanced Code Snippets Library', subfeatures: ['Personal library with syntax highlighting', 'Code categorization and tagging', 'Search and filter functionality', 'Version control for snippets', 'Sharing and embedding features', 'Import from GitHub gists'] },
        { name: 'Intelligent Bookmark Manager', subfeatures: ['AI-powered categorization', 'Web page screenshots and previews', 'Content extraction and summaries', 'Duplicate detection', 'Backup and sync across devices', 'Browser extension integration'] },
        { name: 'Comprehensive Uses Page', subfeatures: ['Hardware and software inventory', 'Tool recommendations and reviews', 'Setup photos and descriptions', 'Cost tracking and ROI analysis', 'Integration with affiliate programs'] },
        { name: 'Portfolio Enhancement', subfeatures: ['Advanced project showcases with 3D previews', 'Interactive demos and prototypes', 'Client testimonials and reviews', 'Case study templates', 'Project timeline visualization'] }
      ]
    },
    "Personalization & Engagement": {
      icon: '🎨',
      description: 'Features to make the digital hub more personal, engaging, and interactive.',
      features: [
        { name: 'Gamification System', subfeatures: ['Achievement badges and points system', 'Progress tracking for goals', 'Leaderboards and challenges', 'Reward unlocking system', 'Social sharing of achievements', 'Custom goal setting'] },
        { name: 'Advanced GitHub Integration', subfeatures: ['Live contribution graph with animations', 'Repository showcase with metrics', 'Commit activity visualization', 'Language usage statistics', 'Contribution streaks tracking', 'Code review highlights'] },
        { name: 'Comprehensive Habit Tracker', subfeatures: ['Visual habit tracking with streak counters', 'Custom habit creation with goals', 'Habit analytics and insights', 'Reminder system with notifications', 'Habit correlation analysis', 'Export data for analysis'] },
        { name: 'Advanced Customization', subfeatures: ['Theme builder with live preview', 'Custom CSS/JS injection', 'Layout customization options', 'Font and color scheme editor', 'Animation preferences', 'Accessibility options'] }
      ]
    },
    "AI & Advanced Features": {
      icon: '🤖',
      description: 'AI-powered and advanced technological features.',
      features: [
        { name: 'AI Assistant Integration', subfeatures: ['Personal AI chatbot for visitors', 'Natural language site navigation', 'Automated content suggestions', 'Smart search with semantic understanding', 'Content generation assistance'] },
        { name: 'Advanced Analytics', subfeatures: ['Machine learning insights on user behavior', 'Predictive analytics for content performance', 'A/B testing framework', 'Heat map generation', 'Conversion funnel analysis'] },
        { name: 'Voice & Accessibility', subfeatures: ['Voice navigation and commands', 'Text-to-speech for content', 'Screen reader optimization', 'Keyboard navigation enhancements', 'Multi-language support'] }
      ]
    },
    "Social & Community": {
      icon: '👥',
      description: 'Features to build community and social engagement.',
      features: [
        { name: 'Community Features', subfeatures: ['Guest book with moderation', 'Comment system across pages', 'Visitor analytics and insights', 'Social media integration hub', 'Live chat support'] },
        { name: 'Collaboration Tools', subfeatures: ['Project collaboration invites', 'Shared workspace for visitors', 'Real-time collaborative editing', 'Feedback collection system', 'Mentorship program integration'] },
        { name: 'Networking Hub', subfeatures: ['Professional connections showcase', 'Recommendation system', 'Event calendar integration', 'Speaking engagement tracker', 'Industry news aggregation'] }
      ]
    },
    "Business & Monetization": {
      icon: '💼',
      description: 'Features for business development and potential monetization.',
      features: [
        { name: 'Service Showcase', subfeatures: ['Consulting services presentation', 'Service booking system', 'Client project gallery', 'Pricing calculator', 'Contract management'] },
        { name: 'E-commerce Integration', subfeatures: ['Digital product sales', 'Course creation platform', 'Subscription management', 'Payment processing', 'Revenue analytics'] },
        { name: 'Professional Tools', subfeatures: ['Invoice generation', 'Time tracking for clients', 'Project proposal templates', 'Client communication portal', 'Business metrics dashboard'] }
      ]
    }
  }
};

export default function FeaturesPage() {
  const [currentView, setCurrentView] = useState<'implemented' | 'todo'>('implemented');
  const [currentCategory, setCurrentCategory] = useState<string>('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [totalFeatures, setTotalFeatures] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const implementedCount = Object.values(featuresData.implemented)
      .reduce((sum, category) => sum + category.features.length, 0) - 0; // Subtract 0 for Overview
    const todoCount = Object.values(featuresData.todo)
      .reduce((sum, category) => sum + category.features.length, 0);
    const total = implementedCount + todoCount;
    const completion = total > 0 ? Math.round((implementedCount / total) * 100) : 0;

    setTotalFeatures(total);
    setCompletionRate(completion);
  };

  const toggleFeatureExpansion = (featureName: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureName)) {
      newExpanded.delete(featureName);
    } else {
      newExpanded.add(featureName);
    }
    setExpandedFeatures(newExpanded);
  };

  const filteredFeatures = (features: Feature[]) => {
    return features.filter(feature => {
      const matchesSearch = searchTerm === '' ||
        feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.subfeatures.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  };

  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalImplemented: Object.values(featuresData.implemented).reduce((sum, cat) => sum + cat.features.length, 0),
        totalPlanned: Object.values(featuresData.todo).reduce((sum, cat) => sum + cat.features.length, 0),
        categories: {
          implemented: Object.keys(featuresData.implemented).length,
          planned: Object.keys(featuresData.todo).length
        }
      },
      implemented: featuresData.implemented,
      todo: featuresData.todo
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luciverse-features-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentData = featuresData[currentView];
  const currentCategoryData = currentData[currentCategory];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-white dark:bg-gray-800 p-4 border-r border-stone-200 dark:border-gray-700 flex-shrink-0 flex flex-col">
          <h1 className="font-bold text-2xl text-sky-600 dark:text-sky-400 mb-2">Luciverse</h1>
          <p className="text-sm text-stone-500 dark:text-gray-400 mb-6">Feature Dashboard</p>

          {/* View Toggle */}
          <div className="flex bg-stone-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <button
              onClick={() => {
                setCurrentView('implemented');
                setCurrentCategory('Overview');
              }}
              className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${currentView === 'implemented'
                ? 'bg-white dark:bg-gray-600 text-sky-600 dark:text-sky-400 shadow'
                : 'text-stone-500 dark:text-gray-400'
                }`}
            >
              Implemented
            </button>
            <button
              onClick={() => {
                setCurrentView('todo');
                setCurrentCategory(Object.keys(featuresData.todo)[0]);
              }}
              className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${currentView === 'todo'
                ? 'bg-white dark:bg-gray-600 text-sky-600 dark:text-sky-400 shadow'
                : 'text-stone-500 dark:text-gray-400'
                }`}
            >
              Roadmap
            </button>
          </div>

          {/* Search and Stats */}
          <div className="mb-6">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border-2 border-stone-200 dark:border-gray-600 rounded-lg text-stone-800 dark:text-gray-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400"
              />
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold text-stone-400 dark:text-gray-500 uppercase tracking-wider mb-2">Quick Stats</p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-sky-50 dark:bg-sky-900/30 p-2 rounded-lg">
                  <div className="text-lg font-bold text-sky-600 dark:text-sky-400">{totalFeatures}</div>
                  <p className="text-xs text-stone-500 dark:text-gray-400">Total Features</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{completionRate}%</div>
                  <p className="text-xs text-stone-500 dark:text-gray-400">Progress</p>
                </div>
              </div>
            </div>

            <button
              onClick={exportData}
              className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Summary
            </button>
          </div>

          {/* Navigation */}
          <div className="overflow-y-auto flex-grow">
            <h2 className="text-xs font-semibold text-stone-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-4">
              {currentView === 'implemented' ? 'Implemented Features' : 'To-Do Roadmap'}
            </h2>
            <nav className="space-y-1">
              {Object.keys(currentData).map((category) => {
                const categoryData = currentData[category];
                const featureCount = categoryData.features.length;

                return (
                  <button
                    key={category}
                    onClick={() => setCurrentCategory(category)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${currentCategory === category
                      ? 'bg-sky-500 text-white shadow'
                      : 'text-stone-600 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2">{categoryData.icon}</span>
                        <span className="text-sm">{category}</span>
                      </span>
                      {featureCount > 0 && (
                        <span className={`text-xs px-2 py-1 rounded-full ${currentCategory === category
                          ? 'bg-white/20 text-white'
                          : currentView === 'implemented'
                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                          }`}>
                          {featureCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-4xl font-bold text-stone-800 dark:text-gray-100 flex items-center gap-3">
                  <span className="text-5xl">{currentCategoryData.icon}</span>
                  {currentCategory}
                </h2>
                <div className="text-right">
                  <p className="text-sm text-stone-500 dark:text-gray-400">Features in this category</p>
                  <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{currentCategoryData.features.length}</p>
                </div>
              </div>
              <p className="text-lg text-stone-600 dark:text-gray-300">{currentCategoryData.description}</p>
              <div className="mt-4">
                <div className="w-full bg-stone-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${currentView === 'implemented' ? '100' : '0'}%` }}
                  ></div>
                </div>
                <p className="text-xs text-stone-500 dark:text-gray-400 mt-1">
                  {currentView === 'implemented' ? 'Completed' : 'Planned'}
                </p>
              </div>
            </div>

            {/* Features Grid */}
            {currentCategoryData.features.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFeatures(currentCategoryData.features).map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => toggleFeatureExpansion(feature.name)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-stone-800 dark:text-gray-100 text-lg">
                        {feature.name}
                      </h3>
                      {expandedFeatures.has(feature.name) ? (
                        <ChevronUp className="w-5 h-5 text-stone-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-stone-500 dark:text-gray-400" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${currentView === 'implemented'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                        {currentView === 'implemented' ? 'Implemented' : 'To-Do'}
                      </span>
                      <span className="text-xs bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 px-3 py-1 rounded-full">
                        {feature.subfeatures.length} features
                      </span>
                    </div>

                    {expandedFeatures.has(feature.name) && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold text-stone-700 dark:text-gray-300 mb-2">Sub-features:</h4>
                        <ul className="space-y-1">
                          {feature.subfeatures.map((subfeature, subIndex) => (
                            <li
                              key={subIndex}
                              className="text-sm text-stone-600 dark:text-gray-400 flex items-start gap-2"
                            >
                              <span className="text-sky-500 dark:text-sky-400 mt-1">•</span>
                              <span>{subfeature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">{currentCategoryData.icon}</div>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-gray-100 mb-2">Overview Section</h3>
                <p className="text-stone-600 dark:text-gray-300">This section provides a high-level view of the project structure and feature distribution.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

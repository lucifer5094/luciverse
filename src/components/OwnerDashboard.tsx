'use client';

import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated } from '@/utils/auth';
import { Edit, Settings, Eye, Users, FileText, BarChart3, Save, Plus, Trash2, Image, Link, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyticsAPI } from '@/utils/analyticsAPI';

interface OwnerDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

interface EditableSection {
  id: string;
  page: string;
  title: string;
  content: string;
  type: 'text' | 'textarea' | 'image' | 'link';
  lastModified: Date;
}

export default function OwnerDashboard({ isVisible, onClose }: OwnerDashboardProps) {
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editableSections, setEditableSections] = useState<EditableSection[]>([]);
  const [stats, setStats] = useState({
    totalSections: 0,
    recentEdits: 0,
    pageViews: 0,
    lastUpdate: new Date().toLocaleDateString()
  });

  const loadEditableSections = useCallback(async () => {
    // Load actual editable sections from local storage or content files
    const savedSections = localStorage.getItem('editableSections');
    let sections: EditableSection[] = [];
    
    if (savedSections) {
      sections = JSON.parse(savedSections);
    } else {
      // Default sections if none exist
      sections = [
        {
          id: '1',
          page: 'Home',
          title: 'Hero Title',
          content: 'Welcome to Luciverse',
          type: 'text',
          lastModified: new Date()
        },
        {
          id: '2',
          page: 'About',
          title: 'Page Title',
          content: 'About Me',
          type: 'text',
          lastModified: new Date()
        },
        {
          id: '3',
          page: 'Projects',
          title: 'Page Description',
          content: 'Showcasing all completed, ongoing, and notable works...',
          type: 'textarea',
          lastModified: new Date()
        }
      ];
      // Save initial sections to localStorage
      localStorage.setItem('editableSections', JSON.stringify(sections));
    }
    
    setEditableSections(sections);
    
    // Load real analytics data
    try {
      const [analyticsStats, userInteractions] = await Promise.all([
        analyticsAPI.getAnalyticsStats(),
        analyticsAPI.getUserInteractions(undefined, 1000)
      ]);
      
      // Calculate real page views from interactions
      const pageViewCount = userInteractions.interactions?.filter(
        (interaction: any) => interaction.action === 'page_view'
      ).length || 0;
      
      setStats(prevStats => ({
        ...prevStats,
        totalSections: sections.length,
        recentEdits: sections.filter(s => 
          new Date().getTime() - new Date(s.lastModified).getTime() < 24 * 60 * 60 * 1000
        ).length,
        pageViews: pageViewCount,
        lastUpdate: new Date().toLocaleDateString()
      }));
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      // Fallback to basic stats without analytics
      setStats(prevStats => ({
        ...prevStats,
        totalSections: sections.length,
        recentEdits: sections.filter(s => 
          new Date().getTime() - new Date(s.lastModified).getTime() < 24 * 60 * 60 * 1000
        ).length,
        pageViews: 0,
        lastUpdate: new Date().toLocaleDateString()
      }));
    }
  }, []);

  useEffect(() => {
    setIsOwner(isAuthenticated());
    // Load editable sections from localStorage or API
    loadEditableSections();
  }, [loadEditableSections]);

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = editableSections.filter(s => s.id !== sectionId);
    setEditableSections(updatedSections);
    localStorage.setItem('editableSections', JSON.stringify(updatedSections));
  };

  const saveEditableSections = (sections: EditableSection[]) => {
    setEditableSections(sections);
    localStorage.setItem('editableSections', JSON.stringify(sections));
  };

  const handleExportData = () => {
    const data = {
      sections: editableSections,
      stats,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'luciverse-content-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOwner || !isVisible) return null;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'content', name: 'Content', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Owner Dashboard
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage all website content and settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
              <div className="p-4">
                <nav className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Website Overview
                  </h3>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Editable Sections</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSections}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                          <Edit className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Recent Edits</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recentEdits}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Page Views</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pageViews}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                          <Eye className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Last Update</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lastUpdate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button className="p-4 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Edit className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white">Edit Content</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Modify page content</p>
                    </button>
                    
                    <button 
                      onClick={handleExportData}
                      className="p-4 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Save className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white">Export Data</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Download content backup</p>
                    </button>
                    
                    <button className="p-4 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white">Site Settings</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Configure website</p>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Editable Content
                    </h3>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <Plus className="h-4 w-4" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editableSections.map(section => (
                      <div key={section.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                              {section.type === 'text' && <Type className="h-4 w-4" />}
                              {section.type === 'textarea' && <FileText className="h-4 w-4" />}
                              {/* eslint-disable-next-line jsx-a11y/alt-text */}
                              {section.type === 'image' && <Image className="h-4 w-4" />}
                              {section.type === 'link' && <Link className="h-4 w-4" />}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {section.page} - {section.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-md">
                                {section.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {section.lastModified.toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => handleDeleteSection(section.id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Analytics
                  </h3>
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Analytics dashboard coming soon!
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Settings
                  </h3>
                  <div className="text-center py-12">
                    <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Settings panel coming soon!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

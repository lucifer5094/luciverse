'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';
import { dataAPI } from '@/utils/dataAPI';
import { Edit3, Plus, Save, X, Image, Type, Layout, Palette, Settings, Monitor, Smartphone, Tablet, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Notification from './Notification';

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutContent: string;
  contactInfo: any;
  projectsTitle: string;
  projectsSubtitle: string;
  projectsDescription: string;
  labTitle: string;
  labSubtitle: string;
  labDescription: string;
  contactTitle: string;
  contactSubtitle: string;
  logsTitle: string;
  logsSubtitle: string;
  logsDescription: string;
  adminTitle: string;
  adminSubtitle: string;
  adminDescription: string;
  highlights: any[];
  stats: any;
  lastUpdated: string;
}

interface OwnerEditPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function OwnerEditPanel({ isVisible, onClose }: OwnerEditPanelProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isEditing, setIsEditing] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#8b5cf6',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter',
    borderRadius: '1rem',
    spacing: 'comfortable',
  });

  const tabs = [
    { id: 'content', name: 'Content', icon: Type },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'media', name: 'Media', icon: Image },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const previewModes = [
    { id: 'desktop', name: 'Desktop', icon: Monitor },
    { id: 'tablet', name: 'Tablet', icon: Tablet },
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
  ];

  // Load site content on component mount
  useEffect(() => {
    const loadSiteContent = async () => {
      try {
        const content = await dataAPI.getSiteContent();
        setSiteContent(content as SiteContent);
        if (content.lastUpdated) {
          const date = new Date(content.lastUpdated);
          setLastSaved(date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }));
        }
      } catch (error) {
        console.error('Failed to load site content:', error);
      }
    };

    if (isVisible) {
      loadSiteContent();
    }
  }, [isVisible]);

  const handleSaveChanges = async () => {
    if (!siteContent) return;
    
    setIsSaving(true);
    setNotification({ message: '', type: 'info', isVisible: false });
    
    try {
      await dataAPI.updateSiteContent(siteContent);
      
      // Update the last saved timestamp
      const now = new Date();
      const formattedTime = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      setLastSaved(formattedTime);
      setIsEditing(false);
      setNotification({
        message: 'Content saved successfully! ✨',
        type: 'success',
        isVisible: true
      });
      
    } catch (error) {
      console.error('Failed to save content:', error);
      setNotification({
        message: 'Failed to save content. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateContent = (field: string, value: string) => {
    if (!siteContent) return;
    
    setSiteContent(prev => prev ? ({
      ...prev,
      [field]: value
    } as SiteContent) : null);
    setIsEditing(true);
  };

  const handleUpdateHighlight = (index: number, field: string, value: any) => {
    if (!siteContent) return;
    
    setSiteContent(prev => prev ? ({
      ...prev,
      highlights: prev.highlights.map((highlight: any, i: number) => 
        i === index ? { ...highlight, [field]: value } : highlight
      )
    } as SiteContent) : null);
    setIsEditing(true);
  };

  const handleAddSection = () => {
    // This would add a new highlight or content section
    console.log('Add new section functionality');
  };

  const handleDeleteSection = (sectionId: string) => {
    // This would remove a content section
    console.log('Delete section:', sectionId);
  };

  if (!isVisible) return null;

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
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
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Edit3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Content Management
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Edit your website content and design</span>
                  {lastSaved && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Last saved: {lastSaved}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Preview Mode Selector */}
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {previewModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setPreviewMode(mode.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      previewMode === mode.id
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <mode.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{mode.name}</span>
                  </button>
                ))}
              </div>

              {/* Save/Close Buttons */}
              <div className="flex items-center space-x-2">
                {isEditing && (
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-900 text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4 space-y-4">
                {activeTab === 'content' && siteContent && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Site Content
                    </h3>

                    {/* Hero Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Hero Section</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hero Title
                          </label>
                          <input
                            type="text"
                            value={siteContent.heroTitle}
                            onChange={(e) => handleUpdateContent('heroTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hero Subtitle
                          </label>
                          <textarea
                            value={siteContent.heroSubtitle}
                            onChange={(e) => handleUpdateContent('heroSubtitle', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">About Section</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            About Title
                          </label>
                          <input
                            type="text"
                            value={siteContent.aboutTitle}
                            onChange={(e) => handleUpdateContent('aboutTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            About Content
                          </label>
                          <textarea
                            value={siteContent.aboutContent}
                            onChange={(e) => handleUpdateContent('aboutContent', e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Highlights Section */}
                    {siteContent.highlights && siteContent.highlights.length > 0 && (
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Highlights</h4>
                        {siteContent.highlights.map((highlight: any, index: number) => (
                          <div key={highlight.id || index} className="mb-4 p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={highlight.title}
                                  onChange={(e) => handleUpdateHighlight(index, 'title', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={highlight.description}
                                  onChange={(e) => handleUpdateHighlight(index, 'description', e.target.value)}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'design' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Theme Settings
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={themeSettings.primaryColor}
                            onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                            className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={themeSettings.primaryColor}
                            onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={themeSettings.secondaryColor}
                            onChange={(e) => setThemeSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={themeSettings.secondaryColor}
                            onChange={(e) => setThemeSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Font Family
                        </label>
                        <select
                          value={themeSettings.fontFamily}
                          onChange={(e) => setThemeSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Lato">Lato</option>
                          <option value="Montserrat">Montserrat</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Border Radius
                        </label>
                        <select
                          value={themeSettings.borderRadius}
                          onChange={(e) => setThemeSettings(prev => ({ ...prev, borderRadius: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="0.25rem">Small</option>
                          <option value="0.5rem">Medium</option>
                          <option value="1rem">Large</option>
                          <option value="1.5rem">Extra Large</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'layout' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Layout Options
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Layout customization features coming soon...
                    </div>
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Media Library
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Media management features coming soon...
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Site Settings
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Advanced settings coming soon...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto">
              <div className={`h-full ${
                previewMode === 'mobile' ? 'max-w-sm mx-auto' :
                previewMode === 'tablet' ? 'max-w-4xl mx-auto' :
                'w-full'
              }`}>
                <div className="h-full bg-white dark:bg-gray-800 rounded-lg m-4 shadow-lg overflow-auto">
                  <div className="p-8">
                    {siteContent && (
                      <>
                        <div className="text-center mb-8">
                          <h1 className="text-4xl font-bold mb-4" style={{ color: themeSettings.primaryColor }}>
                            {siteContent.heroTitle}
                          </h1>
                          <p className="text-lg text-gray-600 dark:text-gray-400">
                            {siteContent.heroSubtitle}
                          </p>
                        </div>

                        <div className="grid gap-6">
                          <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">{siteContent.aboutTitle}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                              {siteContent.aboutContent}
                            </p>
                          </div>
                          
                          {siteContent.highlights && siteContent.highlights.length > 0 && (
                            <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                              <h3 className="text-lg font-semibold mb-2">Highlights</h3>
                              <div className="space-y-2">
                                {siteContent.highlights.map((highlight: any, index: number) => (
                                  <div key={index} className="text-sm">
                                    <strong>{highlight.title}</strong>
                                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                      {highlight.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    </>
  );
}

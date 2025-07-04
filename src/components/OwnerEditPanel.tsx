'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';
import { Edit3, Plus, Save, X, Image, Type, Layout, Palette, Settings, Monitor, Smartphone, Tablet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentSection {
  id: string;
  type: 'hero' | 'about' | 'project' | 'contact' | 'navigation' | 'footer';
  title: string;
  content: any;
  editable: boolean;
}

interface OwnerEditPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function OwnerEditPanel({ isVisible, onClose }: OwnerEditPanelProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isEditing, setIsEditing] = useState(false);
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    {
      id: 'hero',
      type: 'hero',
      title: 'Hero Section',
      content: {
        title: 'Welcome to Luciverse',
        subtitle: 'Dive into my universe of development, design, and digital experiments',
        backgroundGradient: 'from-light-background via-white to-gray-50',
      },
      editable: true,
    },
    {
      id: 'navigation',
      type: 'navigation',
      title: 'Navigation Menu',
      content: {
        items: [
          { name: 'Home', href: '/', visible: true },
          { name: 'About', href: '/about', visible: true },
          { name: 'Projects', href: '/projects', visible: true },
          { name: 'Contact', href: '/contact', visible: true },
        ]
      },
      editable: true,
    },
    {
      id: 'projects',
      type: 'project',
      title: 'Featured Projects',
      content: {
        projects: [
          {
            title: 'AI-Powered Web App',
            description: 'A sophisticated web application leveraging machine learning to provide intelligent user experiences.',
            tech: ['React', 'Python', 'TensorFlow'],
            gradient: 'from-blue-500 to-purple-600',
            icon: '🤖',
            visible: true,
          },
          {
            title: 'E-Commerce Platform',
            description: 'Full-stack e-commerce solution with modern design and seamless user experience.',
            tech: ['Next.js', 'Node.js', 'PostgreSQL'],
            gradient: 'from-green-500 to-teal-600',
            icon: '🛒',
            visible: true,
          },
        ]
      },
      editable: true,
    },
  ]);

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

  const handleSaveChanges = () => {
    // Here you would typically save to a database or CMS
    console.log('Saving changes...', { contentSections, themeSettings });
    setIsEditing(false);
    // Show success notification
  };

  const handleAddSection = () => {
    const newSection: ContentSection = {
      id: `section_${Date.now()}`,
      type: 'project',
      title: 'New Section',
      content: { title: 'New Section', description: 'Edit this content...' },
      editable: true,
    };
    setContentSections([...contentSections, newSection]);
    setIsEditing(true);
  };

  const handleUpdateSection = (sectionId: string, newContent: any) => {
    setContentSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, ...newContent } }
          : section
      )
    );
    setIsEditing(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    setContentSections(sections => sections.filter(section => section.id !== sectionId));
    setIsEditing(true);
  };

  if (!isVisible) return null;

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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Edit your website content and design
                </p>
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
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
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
                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Content Sections
                      </h3>
                      <button
                        onClick={handleAddSection}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    </div>

                    {contentSections.map(section => (
                      <div
                        key={section.id}
                        className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {section.title}
                          </h4>
                          <button
                            onClick={() => handleDeleteSection(section.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {section.type === 'hero' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={section.content.title}
                                onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Subtitle
                              </label>
                              <textarea
                                value={section.content.subtitle}
                                onChange={(e) => handleUpdateSection(section.id, { subtitle: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                        )}

                        {section.type === 'navigation' && (
                          <div className="space-y-2">
                            {section.content.items.map((item: any, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={item.visible}
                                  onChange={(e) => {
                                    const newItems = [...section.content.items];
                                    newItems[index].visible = e.target.checked;
                                    handleUpdateSection(section.id, { items: newItems });
                                  }}
                                  className="rounded"
                                />
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => {
                                    const newItems = [...section.content.items];
                                    newItems[index].name = e.target.value;
                                    handleUpdateSection(section.id, { items: newItems });
                                  }}
                                  className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
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
                    <div className="text-center mb-8">
                      <h1 className="text-4xl font-bold mb-4" style={{ color: themeSettings.primaryColor }}>
                        {contentSections.find(s => s.id === 'hero')?.content.title || 'Welcome to Luciverse'}
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        {contentSections.find(s => s.id === 'hero')?.content.subtitle || 'Preview your changes here'}
                      </p>
                    </div>

                    <div className="grid gap-6">
                      {contentSections.map(section => (
                        <div
                          key={section.id}
                          className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                          <p className="text-sm text-gray-500">Section preview</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

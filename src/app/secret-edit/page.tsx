'use client';

import AuthGuard from '@/components/AuthGuard';
import { logout } from '@/utils/auth';
import { useSiteConfig } from '@/utils/siteConfig';
import { Settings, Users, FileText, BarChart3, LogOut, Shield, Edit, Plus, Download, Upload, Palette, Layout, Type, Image, Globe, Code, Database, Save } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SecretEditPage() {
  const { config, updateConfig, exportConfig, importConfig, addProject, updateProject, deleteProject } = useSiteConfig();
  const [activeSection, setActiveSection] = useState('overview');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const sections = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'content', name: 'Content', icon: Type },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'media', name: 'Media', icon: Image },
    { id: 'navigation', name: 'Navigation', icon: Globe },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'code', name: 'Advanced', icon: Code },
  ];

  const handleSaveChanges = () => {
    // Save changes logic here
    setHasUnsavedChanges(false);
    // Show success notification
  };

  const handleExportConfig = () => {
    const configData = exportConfig();
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'luciverse-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importConfig(content)) {
          setHasUnsavedChanges(true);
          // Show success notification
        } else {
          // Show error notification
        }
      };
      reader.readAsText(file);
    }
  };
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Luciverse Control Center
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Complete website management and content editing
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {hasUnsavedChanges && (
                  <motion.button
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={handleSaveChanges}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </motion.button>
                )}
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportConfig}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  
                  <label className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Import</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportConfig}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <a
                  href="/"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  View Site
                </a>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span>{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow">
              {activeSection === 'overview' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Website Overview
                  </h2>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'Projects', value: config.content.projects.featured.length.toString(), icon: FileText, color: 'green' },
                      { label: 'Status', value: 'Active', icon: Settings, color: 'emerald' },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                            <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { title: 'Edit Hero Section', desc: 'Update main page content', action: () => setActiveSection('content'), icon: Edit },
                      { title: 'Manage Projects', desc: 'Add or edit portfolio items', action: () => setActiveSection('content'), icon: Plus },
                      { title: 'Theme Settings', desc: 'Customize site appearance', action: () => setActiveSection('design'), icon: Palette },
                      { title: 'Navigation Menu', desc: 'Configure site navigation', action: () => setActiveSection('navigation'), icon: Globe },
                      { title: 'Site Settings', desc: 'General site configuration', action: () => setActiveSection('settings'), icon: Settings },
                      { title: 'Advanced Code', desc: 'Custom CSS and JavaScript', action: () => setActiveSection('code'), icon: Code },
                    ].map((action, index) => (
                      <motion.button
                        key={action.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={action.action}
                        className="p-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <action.icon className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{action.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{action.desc}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'content' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Content Management
                  </h2>
                  
                  {/* Hero Section Edit */}
                  <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hero Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Main Title
                        </label>
                        <input
                          type="text"
                          value={config.content.hero.title}
                          onChange={(e) => {
                            updateConfig({
                              content: {
                                ...config.content,
                                hero: { ...config.content.hero, title: e.target.value }
                              }
                            });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subtitle
                        </label>
                        <textarea
                          value={config.content.hero.subtitle}
                          onChange={(e) => {
                            updateConfig({
                              content: {
                                ...config.content,
                                hero: { ...config.content.hero, subtitle: e.target.value }
                              }
                            });
                            setHasUnsavedChanges(true);
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Projects Management */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Projects</h3>
                      <button
                        onClick={() => {
                          const newProject = {
                            id: `project_${Date.now()}`,
                            title: 'New Project',
                            description: 'Project description...',
                            tech: ['Technology'],
                            gradient: 'from-blue-500 to-purple-600',
                            icon: '🚀',
                            visible: true,
                            order: config.content.projects.featured.length + 1,
                          };
                          addProject(newProject);
                          setHasUnsavedChanges(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {config.content.projects.featured.map((project, index) => (
                        <div key={project.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={project.title}
                                onChange={(e) => {
                                  updateProject(project.id, { title: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Icon
                              </label>
                              <input
                                type="text"
                                value={project.icon}
                                onChange={(e) => {
                                  updateProject(project.id, { icon: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                              </label>
                              <textarea
                                value={project.description}
                                onChange={(e) => {
                                  updateProject(project.id, { description: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div className="flex items-center justify-between md:col-span-2">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={project.visible}
                                  onChange={(e) => {
                                    updateProject(project.id, { visible: e.target.checked });
                                    setHasUnsavedChanges(true);
                                  }}
                                  className="rounded"
                                />
                                <label className="text-sm text-gray-700 dark:text-gray-300">Visible</label>
                              </div>
                              <button
                                onClick={() => {
                                  deleteProject(project.id);
                                  setHasUnsavedChanges(true);
                                }}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'design' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Design & Theme
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={config.theme.primaryColor}
                            onChange={(e) => {
                              updateConfig({
                                theme: { ...config.theme, primaryColor: e.target.value }
                              });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.theme.primaryColor}
                            onChange={(e) => {
                              updateConfig({
                                theme: { ...config.theme, primaryColor: e.target.value }
                              });
                              setHasUnsavedChanges(true);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={config.theme.secondaryColor}
                            onChange={(e) => {
                              updateConfig({
                                theme: { ...config.theme, secondaryColor: e.target.value }
                              });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={config.theme.secondaryColor}
                            onChange={(e) => {
                              updateConfig({
                                theme: { ...config.theme, secondaryColor: e.target.value }
                              });
                              setHasUnsavedChanges(true);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Font Family
                      </label>
                      <select
                        value={config.theme.fontFamily}
                        onChange={(e) => {
                          updateConfig({
                            theme: { ...config.theme, fontFamily: e.target.value }
                          });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Other sections would go here */}
              {activeSection !== 'overview' && activeSection !== 'content' && activeSection !== 'design' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {sections.find(s => s.id === activeSection)?.name || 'Section'}
                  </h2>
                  <div className="text-center py-12">
                    <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      This section is under development. More features coming soon!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

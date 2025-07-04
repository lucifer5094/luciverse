'use client';

import { useState, useEffect } from 'react';
import { useSiteConfig } from '@/utils/siteConfig';
import { isAuthenticated } from '@/utils/auth';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LivePreviewProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function LivePreview({ isVisible, onToggle }: LivePreviewProps) {
  const [isOwner, setIsOwner] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { config } = useSiteConfig();

  useEffect(() => {
    setIsMounted(true);
    setIsOwner(isAuthenticated());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (!isMounted || !isOwner) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-6 z-30 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{ width: '400px', height: '600px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900 dark:text-white">Live Preview</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Preview Mode Selector */}
              <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-1">
                {[
                  { id: 'desktop', width: 'w-4 h-3' },
                  { id: 'tablet', width: 'w-3 h-4' },
                  { id: 'mobile', width: 'w-2 h-4' },
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setPreviewMode(mode.id as any)}
                    className={`p-1 rounded transition-colors ${
                      previewMode === mode.id
                        ? 'bg-white dark:bg-gray-800 text-purple-600'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <div className={`${mode.width} bg-current rounded-sm`}></div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleRefresh}
                className={`p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              >
                <RefreshCw className="h-4 w-4" />
              </button>

              <button
                onClick={onToggle}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-4 h-full overflow-auto bg-gray-100 dark:bg-gray-900">
            <div 
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full overflow-auto transition-all duration-300 ${
                previewMode === 'mobile' ? 'max-w-sm mx-auto' :
                previewMode === 'tablet' ? 'max-w-md mx-auto' :
                'w-full'
              }`}
              style={{
                transform: previewMode === 'mobile' ? 'scale(0.6)' : 
                          previewMode === 'tablet' ? 'scale(0.8)' : 
                          'scale(0.5)',
                transformOrigin: 'top left',
              }}
            >
              {/* Mini Homepage Preview */}
              <div className="p-8">
                {/* Hero Section */}
                <div className="text-center mb-8">
                  <h1 
                    className="text-4xl font-bold mb-4"
                    style={{ color: config.theme.primaryColor }}
                  >
                    {config.content.hero.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {config.content.hero.subtitle}
                  </p>
                  <button 
                    className="px-6 py-3 rounded-full text-white font-semibold"
                    style={{ 
                      background: `linear-gradient(135deg, ${config.theme.primaryColor}, ${config.theme.secondaryColor})` 
                    }}
                  >
                    {config.content.hero.ctaText}
                  </button>
                </div>

                {/* Navigation Preview */}
                <div className="flex justify-center space-x-4 mb-8 text-sm">
                  {config.navigation.items
                    .filter(item => item.visible)
                    .sort((a, b) => a.order - b.order)
                    .map(item => (
                      <span 
                        key={item.name} 
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
                      >
                        {item.name}
                      </span>
                    ))}
                </div>

                {/* Projects Preview */}
                <div className="grid grid-cols-1 gap-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    Featured Projects
                  </h2>
                  {config.content.projects.featured
                    .filter(project => project.visible)
                    .slice(0, 3)
                    .map(project => (
                      <div 
                        key={project.id} 
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{project.icon}</span>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {project.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {project.description.substring(0, 80)}...
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {project.tech.slice(0, 3).map(tech => (
                            <span 
                              key={tech}
                              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Contact Preview */}
                <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg text-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {config.content.contact.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {config.content.contact.description.substring(0, 60)}...
                  </p>
                  <div className="flex justify-center space-x-2">
                    {config.content.contact.social
                      .filter(social => social.visible)
                      .slice(0, 3)
                      .map(social => (
                        <span 
                          key={social.platform}
                          className="px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded"
                        >
                          {social.platform}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Preview Mode: {previewMode}</span>
              <span>Font: {config.theme.fontFamily}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';
import { Edit3, Settings, Eye, EyeOff, Palette, Layout, Plus, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LivePreview from './LivePreview';

interface OwnerControlsProps {
  onOpenEditor: () => void;
}

export default function OwnerControls({ onOpenEditor }: OwnerControlsProps) {
  const [isOwner, setIsOwner] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsOwner(isAuthenticated());
  }, []);

  if (!isMounted || !isOwner) return null;

  const quickActions = [
    {
      icon: Edit3,
      label: 'Edit Content',
      action: onOpenEditor,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Monitor,
      label: 'Live Preview',
      action: () => setShowPreview(!showPreview),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: Palette,
      label: 'Design Settings',
      action: () => onOpenEditor(),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: Plus,
      label: 'Add Section',
      action: () => onOpenEditor(),
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-40"
        >
          {/* Main Floating Action Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowTooltip(!showTooltip)}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Settings className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              
              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 animate-ping opacity-20"></div>
            </motion.button>

            {/* Quick Actions Menu */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute bottom-20 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-64"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Owner Controls
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage your website
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={action.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={action.action}
                        className={`flex flex-col items-center p-3 rounded-xl text-white transition-all duration-200 ${action.color}`}
                      >
                        <action.icon className="h-5 w-5 mb-2" />
                        <span className="text-xs font-medium">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <button
                      onClick={() => setIsVisible(false)}
                      className="flex items-center justify-center w-full p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Controls
                    </button>
                  </div>

                  {/* Arrow pointing to button */}
                  <div className="absolute bottom-2 right-6 w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Visibility Button (when hidden) */}
          {!isVisible && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVisible(true)}
              className="w-12 h-12 bg-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <Eye className="h-5 w-5" />
            </motion.button>
          )}
        </motion.div>
        )}
      </AnimatePresence>

    {/* Live Preview Component */}
    <LivePreview 
      isVisible={showPreview} 
      onToggle={() => setShowPreview(!showPreview)} 
    />
    </>
  );
}

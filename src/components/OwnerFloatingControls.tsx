'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';
import { Settings, Edit, Eye, EyeOff, BarChart3, Save, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OwnerDashboard from './OwnerDashboard';
import LivePreview from './LivePreview';

export default function OwnerFloatingControls() {
  const [isOwner, setIsOwner] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsOwner(isAuthenticated());
  }, []);

  if (!isMounted || !isOwner) return null;

  const quickActions = [
    {
      icon: BarChart3,
      label: 'Dashboard',
      action: () => {
        setShowDashboard(true);
        setIsMenuOpen(false);
      },
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: Edit,
      label: 'Edit Mode',
      action: () => {
        // Toggle edit mode for all InlineEdit components
        document.body.classList.toggle('owner-edit-mode');
        setIsMenuOpen(false);
      },
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: showPreview ? EyeOff : Eye,
      label: showPreview ? 'Hide Preview' : 'Live Preview',
      action: () => {
        setShowPreview(!showPreview);
        setIsMenuOpen(false);
      },
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: FileText,
      label: 'Content Manager',
      action: () => {
        // Navigate to content management page
        window.open('/secret-edit', '_blank');
        setIsMenuOpen(false);
      },
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2"
            >
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    scale: 1,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: 20, 
                    scale: 0.8,
                    transition: { delay: (quickActions.length - index - 1) * 0.05 }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.action}
                  className={`w-12 h-12 ${action.color} text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 group relative`}
                >
                  <action.icon className="h-5 w-5" />
                  
                  {/* Tooltip */}
                  <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {action.label}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
            isMenuOpen ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Settings className="h-6 w-6" />
          </motion.div>
        </motion.button>

        {/* Ripple Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20 scale-150 animate-ping pointer-events-none" />
      </div>

      {/* Background Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Dashboard Modal */}
      <OwnerDashboard 
        isVisible={showDashboard} 
        onClose={() => setShowDashboard(false)} 
      />

      {/* Live Preview */}
      <LivePreview 
        isVisible={showPreview} 
        onToggle={() => setShowPreview(!showPreview)} 
      />
    </>
  );
}

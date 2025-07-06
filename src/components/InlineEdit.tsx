'use client';

import { useState, useEffect, useRef } from 'react';
import { isAuthenticated } from '@/utils/auth';
import { Edit2, Check, X, Type, Image, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyticsAPI } from '@/utils/analyticsAPI';

interface InlineEditProps {
  children: React.ReactNode;
  type?: 'text' | 'textarea' | 'image' | 'link';
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  placeholder?: string;
  maxLength?: number;
  inline?: boolean; // New prop to determine if it should render inline
  fieldName?: string; // For analytics tracking
  section?: string; // For analytics tracking
}

export default function InlineEdit({ 
  children, 
  type = 'text', 
  value, 
  onSave, 
  className = '',
  placeholder = 'Enter text...',
  maxLength,
  inline = false,
  fieldName = 'unknown',
  section = 'unknown'
}: InlineEditProps) {
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setIsOwner(isAuthenticated());
  }, []);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text') {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, type]);

  const handleStartEdit = () => {
    if (!isOwner) return;
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editValue.trim() !== value.trim()) {
      // Log the edit before saving (only in development)
      try {
        await analyticsAPI.logEdit({
          page: window.location.pathname,
          section,
          fieldName,
          oldValue: value,
          newValue: editValue.trim(),
          userAgent: navigator.userAgent
        });
      } catch (error) {
        console.error('Failed to log edit:', error);
      }
    }
    
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type === 'text') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && e.ctrlKey && type === 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isMounted || !isOwner) {
    return <span className={className}>{children}</span>;
  }

  const getIcon = () => {
    switch (type) {
      case 'image': return Image;
      case 'link': return Link;
      default: return Type;
    }
  };

  const IconComponent = getIcon();
  const WrapperElement = inline ? 'span' : 'div';

  return (
    <WrapperElement 
      className={`relative group inline-edit-wrapper ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        inline ? (
          // Inline editing mode - keeps the original element structure
          <span className="relative inline-block">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type === 'link' ? 'url' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder={placeholder}
              maxLength={maxLength}
              className="bg-transparent border-b-2 border-purple-500 outline-none text-inherit font-inherit inline-edit-input"
              style={{ minWidth: '200px' }}
            />
          </span>
        ) : (
          // Block editing mode - original behavior
          <div className="relative">
            {type === 'textarea' ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full p-2 border-2 border-purple-500 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 inline-edit-input"
                rows={4}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={type === 'link' ? 'url' : 'text'}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full p-2 border-2 border-purple-500 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 inline-edit-input"
              />
            )}
            
            {/* Edit Controls for block mode */}
            <div className="absolute -right-2 -top-2 flex items-center space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
              >
                <Check className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Character Count */}
            {maxLength && (
              <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
                {editValue.length}/{maxLength}
              </div>
            )}
          </div>
        )
      ) : (
        <WrapperElement 
          onClick={handleStartEdit}
          className="relative cursor-pointer"
        >
          {children}
          
          {/* Edit Overlay */}
          <AnimatePresence>
            {isHovered && !inline && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-purple-500/10 border-2 border-dashed border-purple-500 rounded-lg flex items-center justify-center backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-purple-500 text-white p-2 rounded-full shadow-lg"
                >
                  <IconComponent className="h-4 w-4" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Button */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleStartEdit}
                className={`absolute ${inline ? '-top-1 -right-1 w-4 h-4' : '-top-2 -right-2 w-6 h-6'} bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors z-10`}
              >
                <Edit2 className={`${inline ? 'h-2 w-2' : 'h-3 w-3'}`} />
              </motion.button>
            )}
          </AnimatePresence>
        </WrapperElement>
      )}
    </WrapperElement>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { isAuthenticated, logout } from '@/utils/auth';
import { Shield, LogOut } from 'lucide-react';

export default function OwnerAccessBanner() {
  const [isOwner, setIsOwner] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsOwner(isAuthenticated());
  }, []);

  if (!isMounted || !isOwner) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Owner Mode Active</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="/secret-edit" 
            className="text-sm hover:underline"
          >
            Edit Dashboard
          </a>
          
          <button
            onClick={logout}
            className="flex items-center space-x-1 text-sm hover:underline"
          >
            <LogOut className="h-3 w-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

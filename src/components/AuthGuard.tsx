'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuthed(authenticated);
      
      if (!authenticated) {
        // Redirect to admin auth page
        router.push('/admin-auth');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isAuthed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  // Show fallback or redirect if not authenticated
  if (!isAuthed) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}

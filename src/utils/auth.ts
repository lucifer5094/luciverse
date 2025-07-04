// Authentication utilities for managing owner sessions

export const AUTH_TOKEN_KEY = 'owner-auth';

// Check if user is authenticated (client-side only)
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token === 'true';
};

// Set authentication status
export const setAuthenticated = (status: boolean): void => {
  if (typeof window === 'undefined') return;
  
  if (status) {
    localStorage.setItem(AUTH_TOKEN_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// Clear authentication
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.location.href = '/';
};

// Validate password with backend
export const validatePassword = async (password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/validate-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};

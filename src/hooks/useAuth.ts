import { useState, useEffect } from 'react';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Initializing auth hook');
    
    // Check for existing user in localStorage
    const checkAuth = () => {
      console.log('useAuth: Checking localStorage for existing user');
      try {
        const storedUser = localStorage.getItem('qwell_user');
        if (storedUser) {
          console.log('useAuth: Found stored user data');
          setUser(JSON.parse(storedUser));
        } else {
          console.log('useAuth: No stored user found');
        }
      } catch (error) {
        console.error('useAuth: Error parsing user data:', error);
        localStorage.removeItem('qwell_user');
      }
      console.log('useAuth: Setting loading to false');
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const handleStorageChange = (e: StorageEvent) => {
      console.log('useAuth: Storage change event:', e.key);
      if (e.key === 'qwell_user') {
        if (e.newValue) {
          try {
            console.log('useAuth: New user data from storage');
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error('useAuth: Error parsing user data from storage:', error);
            setUser(null);
          }
        } else {
          console.log('useAuth: User data removed from storage');
          setUser(null);
        }
      }
    };

    const handleAuthSuccess = () => {
      console.log('useAuth: Auth success event received');
      const storedUser = localStorage.getItem('qwell_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          console.log('useAuth: User set from auth success');
        } catch (error) {
          console.error('useAuth: Error parsing user data on auth success:', error);
        }
      }
    };

    const handleLogout = () => {
      console.log('useAuth: Logout event received');
      setUser(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('qwell_login_success', handleAuthSuccess);
    window.addEventListener('qwell_logout_success', handleLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('qwell_login_success', handleAuthSuccess);
      window.removeEventListener('qwell_logout_success', handleLogout);
    };
  }, []);

  const logout = () => {
    console.log('useAuth: Logout function called');
    if (window.googleLogout) {
      console.log('useAuth: Using Google logout');
      window.googleLogout();
    } else {
      console.log('useAuth: Manual logout, removing from localStorage');
      localStorage.removeItem('qwell_user');
      setUser(null);
    }
  };

  console.log('useAuth: Returning state:', { user: !!user, isLoading, isAuthenticated: !!user });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
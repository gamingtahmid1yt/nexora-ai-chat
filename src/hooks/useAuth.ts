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
    // Check for existing user in localStorage
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('nexora_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('nexora_user');
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nexora_user') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Error parsing user data:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    const handleAuthSuccess = () => {
      const storedUser = localStorage.getItem('nexora_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('nexora_login_success', handleAuthSuccess);
    window.addEventListener('nexora_logout_success', handleLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('nexora_login_success', handleAuthSuccess);
      window.removeEventListener('nexora_logout_success', handleLogout);
    };
  }, []);

  const logout = () => {
    if (window.googleLogout) {
      window.googleLogout();
    } else {
      localStorage.removeItem('nexora_user');
      setUser(null);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
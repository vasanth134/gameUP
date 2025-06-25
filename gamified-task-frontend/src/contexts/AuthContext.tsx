import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'parent' | 'child';
  parent_id?: number;
  total_xp?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  getChildren: () => Promise<User[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('gameup_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Validate the session by checking if user still exists
          try {
            const response = await fetch(`http://localhost:5000/api/users/${userData.id}`);
            if (response.ok) {
              const validatedUser = await response.json();
              setUser(validatedUser);
              setIsAuthenticated(true);
              // Update localStorage with fresh data
              localStorage.setItem('gameup_user', JSON.stringify(validatedUser));
            } else {
              // User no longer exists, clear session
              localStorage.removeItem('gameup_user');
            }
          } catch (error) {
            console.error('Error validating session:', error);
            // Network error, use stored data anyway
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('gameup_user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoading(false);
    localStorage.setItem('gameup_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    localStorage.removeItem('gameup_user');
  };

  const getChildren = async (): Promise<User[]> => {
    if (!user || user.role !== 'parent') {
      return [];
    }

    try {
      // This would be an API call to get children for the parent
      // For now, return mock data based on the parent ID
      const response = await fetch(`http://localhost:5000/api/users/parent/${user.id}/children`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching children:', error);
      return [];
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getChildren,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

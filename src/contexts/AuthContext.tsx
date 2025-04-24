import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  name?: string;
  email?: string;
  picture?: string;
  user_type?: 'reguser' | 'contractor';
  user_id?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (profile?: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  // Check for existing auth state on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (profile?: UserProfile) => {
    setIsAuthenticated(true);
    if (profile) {
      // Set user_id based on user_type
      const userWithId = {
        ...profile,
        user_id: profile.user_type === 'contractor' ? 2 : 1,
        user_type: profile.user_type || 'reguser' // Ensure user_type is always set
      };
      setUser(userWithId);
      localStorage.setItem('user', JSON.stringify(userWithId));
    }
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/auth?mode=login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
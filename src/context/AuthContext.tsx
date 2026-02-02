import { createContext, useContext, ReactNode, FC } from 'react';
import { User } from '../lib/api';
import { useGetMe } from '../hooks/useAuth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: user, isLoading } = useGetMe();
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

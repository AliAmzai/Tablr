import { useNavigate, Navigate } from 'react-router-dom';
import { FC } from 'react';
import AuthScreen from '../components/AuthScreen';
import { Button } from '../components/ui/button';
import { ChevronLeft, Calendar, Moon, Sun, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';

const Login: FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-black via-black to-black'
        : 'bg-gradient-to-br from-white via-slate-50 to-slate-100'
    }`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 transition mb-6 ${
            isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </button>
        
        <div className="flex items-center gap-3 justify-center mb-6">
          <Calendar className="w-8 h-8 text-indigo-500" />
          <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Tablr</span>
        </div>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-md">
        <AuthScreen />
      </div>
    </div>
  );
};

export default Login;

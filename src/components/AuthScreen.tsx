import { useState, FC } from 'react';
import { Button } from './ui/button';
import { useLogin, useSignup } from '../hooks/useAuth';
import { Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';

const AuthScreen: FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const login = useLogin();
  const signup = useSignup();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error('Please fill in all fields');
        return;
      }
      login.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      if (!formData.email || !formData.password || !formData.name) {
        toast.error('Please fill in all fields');
        return;
      }
      signup.mutate({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
    }
  };

  const isLoading = login.isPending || signup.isPending;

  return (
    <div className={`w-full rounded-lg shadow-xl p-8 backdrop-blur-sm transition-colors duration-300 ${
      isDark
        ? 'bg-black/50 border border-gray-800'
        : 'bg-white/50 border border-slate-300'
    }`}>
      <h2 className={`text-3xl font-bold text-center mb-8 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-slate-700'
            }`}>
              Full Name
            </label>
            <div className="relative">
              <UserIcon className={`absolute left-3 top-3 w-5 h-5 ${
                isDark ? 'text-gray-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  isDark
                    ? 'bg-black/30 border border-gray-800 text-white placeholder-gray-500'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                placeholder="John Doe"
              />
            </div>
          </div>
        )}

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-slate-700'
          }`}>
            Email Address
          </label>
          <div className="relative">
            <Mail className={`absolute left-3 top-3 w-5 h-5 ${
              isDark ? 'text-gray-500' : 'text-slate-400'
            }`} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                isDark
                  ? 'bg-black/30 border border-gray-800 text-white placeholder-gray-500'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-slate-700'
          }`}>
            Password
          </label>
          <div className="relative">
            <Lock className={`absolute left-3 top-3 w-5 h-5 ${
              isDark ? 'text-gray-500' : 'text-slate-400'
            }`} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                isDark
                  ? 'bg-black/30 border border-gray-800 text-white placeholder-gray-500'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isLogin ? 'Logging in...' : 'Creating account...'}
            </>
          ) : (
            isLogin ? 'Login' : 'Create Account'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-slate-600'
        }`}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-500 hover:text-indigo-600 font-semibold transition"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;

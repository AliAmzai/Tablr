import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FC } from 'react';
import { ArrowRight, Calendar, Moon, Sun, LayoutGrid, Users, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';


const Home: FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-950' 
        : 'bg-slate-50'
    }`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 border-b transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold">Tablr</span>
          </div>
          <div className="flex gap-3 items-center">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Restaurant Table Management
          </h1>
          <p className={`text-xl md:text-2xl mb-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Streamline your restaurant operations with intelligent table management, real-time reservations, and seamless floor planning.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="px-8 py-6 text-lg flex items-center gap-2"
            >
              <LayoutGrid className="w-5 h-5" />
              View Demo
            </Button>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'} hover:shadow-xl transition-shadow`}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mb-4">
                  <LayoutGrid className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Visual Floor Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Interactive drag-and-drop floor plan editor to organize your restaurant layout with ease
                </p>
              </CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'} hover:shadow-xl transition-shadow`}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Manage bookings effortlessly with real-time table availability and automated notifications
                </p>
              </CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'} hover:shadow-xl transition-shadow`}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Track customer preferences and dining history to provide personalized experiences
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="mt-16">
            <h3 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Everything You Need to Manage Your Restaurant
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Real-time Updates</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔒</div>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Secure & Reliable</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Mobile Friendly</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Analytics Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t mt-20 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-indigo-600 text-white">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold">Tablr</span>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Modern restaurant management made simple.
              </p>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Features</a></li>
                <li><a href="#" className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Pricing</a></li>
                <li><a href="#" className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>About</a></li>
                <li><a href="#" className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Contact</a></li>
                <li><a href="#" className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t text-center text-sm ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
            © 2026 Tablr. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

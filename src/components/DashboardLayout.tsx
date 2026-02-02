import { FC, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Calendar, LayoutDashboard, Home, Moon, Sun, LogOut, TableProperties, Users, Settings, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLogout } from '../hooks/useAuth';
import { useAuthContext } from '../context/AuthContext';
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '../components/ui/sidebar';

const DashboardLayout: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const logout = useLogout();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: TableProperties, label: 'Tables', path: '/tables' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <SidebarProvider>
      <div className={`min-h-screen w-full flex transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="w-full">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Calendar className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Tablr</span>
                    <span className="text-xs">Restaurant Manager</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.path)}
                        isActive={location.pathname === item.path}
                        tooltip={item.label}
                      >
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/')} tooltip="Home">
                  <Home className="size-4" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleTheme} tooltip="Toggle Theme">
                  {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  <span>Toggle Theme</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} tooltip="Logout">
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col w-full">
          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

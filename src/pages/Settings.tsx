import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings: FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Settings</h2>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Manage your restaurant settings and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
          <CardHeader>
            <CardTitle>Restaurant Information</CardTitle>
            <CardDescription>Update your restaurant details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input id="name" placeholder="Enter restaurant name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" placeholder="contact@restaurant.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
            <CardDescription>Set your restaurant operating hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <SettingsIcon className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-300'}`} />
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Configure your operating hours here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

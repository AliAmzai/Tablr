import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, TableProperties } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Tables: FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Tables</h2>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Manage your restaurant tables and floor plan</p>
      </div>

      <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Table Management</CardTitle>
            <CardDescription>View and manage all your tables</CardDescription>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Table
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TableProperties className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-300'}`} />
            <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              No tables configured yet
            </p>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Add your first table to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tables;

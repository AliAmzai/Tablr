import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Users, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useRestaurants } from '../hooks/useRestaurants';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../hooks/useEmployees';
import { toast } from 'sonner';

const Employees: FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // State management
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'waiter',
  });

  // API hooks
  const { data: restaurants = [], isLoading: restaurantsLoading } = useRestaurants();
  const { data: employees = [], isLoading: employeesLoading } = useEmployees(selectedRestaurantId || undefined);
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  // Set first restaurant as selected
  useState(() => {
    if (restaurants.length > 0 && !selectedRestaurantId) {
      setSelectedRestaurantId(restaurants[0].id);
    }
  });

  const handleOpenDialog = (employee?: any) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || 'waiter',
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'waiter',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'waiter',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRestaurantId) {
      toast.error('Please select a restaurant first');
      return;
    }

    try {
      if (editingEmployee) {
        await updateEmployee.mutateAsync({
          id: editingEmployee.id,
          ...formData,
        });
        toast.success('Employee updated successfully');
      } else {
        await createEmployee.mutateAsync({
          restaurantId: selectedRestaurantId,
          ...formData,
        });
        toast.success('Employee created successfully');
      }
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save employee');
    }
  };

  const handleDelete = async (employeeId: number) => {
    if (!selectedRestaurantId) return;
    
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee.mutateAsync({
          id: employeeId,
          restaurantId: selectedRestaurantId,
        });
        toast.success('Employee deleted successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to delete employee');
      }
    }
  };

  if (restaurantsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="p-8">
        <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
          <CardContent className="text-center py-12">
            <Users className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-300'}`} />
            <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              No restaurants found
            </p>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Create a restaurant first to manage employees
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Employees
        </h2>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Manage your restaurant staff and assign them to tables
        </p>
      </div>

      {/* Restaurant Selector */}
      {restaurants.length > 1 && (
        <Card className={`mb-6 ${isDark ? 'bg-slate-900 border-slate-800' : ''}`}>
          <CardHeader>
            <CardTitle>Select Restaurant</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedRestaurantId?.toString()}
              onValueChange={(value) => setSelectedRestaurantId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a restaurant" />
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                    {restaurant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Employees List */}
      <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>
              {selectedRestaurantId 
                ? `Employees at ${restaurants.find(r => r.id === selectedRestaurantId)?.name}`
                : 'Select a restaurant to view employees'}
            </CardDescription>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            disabled={!selectedRestaurantId}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </CardHeader>
        <CardContent>
          {employeesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12">
              <Users className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-300'}`} />
              <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                No employees yet
              </p>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Add your first employee to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {employee.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {employee.role}
                    </p>
                    {employee.email && (
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {employee.email}
                      </p>
                    )}
                    {employee.phone && (
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {employee.phone}
                      </p>
                    )}
                    {employee.tables && employee.tables.length > 0 && (
                      <p className={`text-sm mt-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        Assigned to {employee.tables.length} table(s)
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(employee)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Employee Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            <DialogDescription>
              {editingEmployee 
                ? 'Update employee information below'
                : 'Add a new employee to your restaurant'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter employee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiter">Waiter</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="host">Host</SelectItem>
                    <SelectItem value="bartender">Bartender</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="employee@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createEmployee.isPending || updateEmployee.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {(createEmployee.isPending || updateEmployee.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingEmployee ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;

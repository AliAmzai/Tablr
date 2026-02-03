import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Settings as SettingsIcon, Plus, Store, Trash2, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useRestaurants, useCreateRestaurant, useUpdateRestaurant, useDeleteRestaurant } from '../hooks/useRestaurants';
import { toast } from 'sonner';

const Settings: FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // State management
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  });

  // API hooks
  const { data: restaurants = [], isLoading: restaurantsLoading } = useRestaurants();
  const createRestaurant = useCreateRestaurant();
  const updateRestaurant = useUpdateRestaurant();
  const deleteRestaurant = useDeleteRestaurant();

  // Set first restaurant as selected
  useEffect(() => {
    if (restaurants.length > 0 && !selectedRestaurantId) {
      setSelectedRestaurantId(restaurants[0].id);
    }
  }, [restaurants, selectedRestaurantId]);

  // Update form when selected restaurant changes
  useEffect(() => {
    const restaurant = restaurants.find(r => r.id === selectedRestaurantId);
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        description: restaurant.description || '',
        contactEmail: restaurant.contactEmail || '',
        contactPhone: restaurant.contactPhone || '',
      });
    }
  }, [selectedRestaurantId, restaurants]);

  const handleOpenDialog = () => {
    setFormData({
      name: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newRestaurant = await createRestaurant.mutateAsync(formData);
      setSelectedRestaurantId(newRestaurant.id);
      toast.success('Restaurant created successfully');
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create restaurant');
    }
  };

  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRestaurantId) return;

    try {
      await updateRestaurant.mutateAsync({
        id: selectedRestaurantId,
        ...formData,
      });
      toast.success('Restaurant updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update restaurant');
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!selectedRestaurantId) return;
    
    if (restaurants.length === 1) {
      toast.error('Cannot delete your only restaurant');
      return;
    }

    if (confirm('Are you sure you want to delete this restaurant? This will delete all floors, tables, and employees.')) {
      try {
        await deleteRestaurant.mutateAsync(selectedRestaurantId);
        setSelectedRestaurantId(null);
        toast.success('Restaurant deleted successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to delete restaurant');
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

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Settings</h2>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Manage your restaurant settings and preferences</p>
        </div>
        <Button
          onClick={handleOpenDialog}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Restaurant
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Restaurant Selector */}
        {restaurants.length > 1 && (
          <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
            <CardHeader>
              <CardTitle>Select Restaurant</CardTitle>
              <CardDescription>Choose which restaurant to manage</CardDescription>
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

        {/* Restaurant Information */}
        {selectedRestaurantId && (
          <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Restaurant Information</CardTitle>
                <CardDescription>Update your restaurant details</CardDescription>
              </div>
              {restaurants.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteRestaurant}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateRestaurant} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter restaurant name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your restaurant"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="contact@restaurant.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={updateRestaurant.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {updateRestaurant.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* All Restaurants List */}
        <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
          <CardHeader>
            <CardTitle>Your Restaurants</CardTitle>
            <CardDescription>Manage all your restaurant venues</CardDescription>
          </CardHeader>
          <CardContent>
            {restaurants.length === 0 ? (
              <div className="text-center py-8">
                <Store className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-300'}`} />
                <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  No restaurants yet
                </p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Create your first restaurant to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedRestaurantId === restaurant.id
                        ? isDark
                          ? 'bg-indigo-900/30 border-indigo-600'
                          : 'bg-indigo-50 border-indigo-300'
                        : isDark
                        ? 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedRestaurantId(restaurant.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {restaurant.name}
                        </h3>
                        {restaurant.description && (
                          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {restaurant.description}
                          </p>
                        )}
                        <div className={`text-sm mt-2 space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {restaurant.contactEmail && <p>📧 {restaurant.contactEmail}</p>}
                          {restaurant.contactPhone && <p>📞 {restaurant.contactPhone}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          {restaurant.floors?.length || 0} floor(s)
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          {restaurant.employees?.length || 0} employee(s)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Restaurant Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Restaurant</DialogTitle>
            <DialogDescription>
              Create a new restaurant or venue to manage
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateRestaurant}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Restaurant Name *</Label>
                <Input
                  id="new-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter restaurant name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-description">Description</Label>
                <Textarea
                  id="new-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Contact Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@restaurant.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-phone">Phone Number</Label>
                <Input
                  id="new-phone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
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
                disabled={createRestaurant.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {createRestaurant.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Restaurant
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;


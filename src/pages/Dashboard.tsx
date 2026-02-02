import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { FC } from 'react';
import React, { useState } from 'react';
import { useReservations, useDeleteReservation, useCreateReservation } from '../hooks/useReservations';
import { Loader2, Calendar, Plus, Trash2, Clock, AlertCircle, CheckCircle2, Edit2, LayoutGrid } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { FloorPlan, type Table, type TableStatus } from '../components/floor-plan';
import { AddTableDialog } from '../components/add-table-dialog';
import { ReservationPanel } from '../components/reservation-panel';
import { StatusLegend } from '../components/status-legend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useFloors, useCreateFloor, useDeleteFloor } from '../hooks/useFloors';
import { useTables, useCreateTable, useUpdateTable, useDeleteTable } from '../hooks/useTables';
import { useRestaurant, useCreateRestaurant } from '../hooks/useRestaurants';

const Dashboard: FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { data: reservations, isLoading, error } = useReservations();
  const deleteReservation = useDeleteReservation();
  const createReservation = useCreateReservation();
  
  // Restaurant state management
  const { data: restaurant, isLoading: restaurantLoading, error: restaurantError } = useRestaurant();
  const createRestaurant = useCreateRestaurant();
  const [showRestaurantSetup, setShowRestaurantSetup] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  
  // Floors state management
  const { data: floors = [], isLoading: floorsLoading } = useFloors();
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const createFloor = useCreateFloor();
  const deleteFloor = useDeleteFloor();
  
  // Set first floor as selected when floors load
  React.useEffect(() => {
    if (floors.length > 0 && !selectedFloorId) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  // Show setup dialog if no restaurant
  React.useEffect(() => {
    if (!restaurantLoading && restaurantError && !showRestaurantSetup) {
      setShowRestaurantSetup(true);
    }
  }, [restaurantLoading, restaurantError, showRestaurantSetup]);

  // Tables state management
  const { data: tables = [], isLoading: tablesLoading } = useTables(selectedFloorId);
  const [localTables, setLocalTables] = useState<any[]>([]);
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const deleteTableMutation = useDeleteTable();

  // Sync backend tables to local state
  React.useEffect(() => {
    setLocalTables(tables);
  }, [tables]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
  });

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');

  const selectedTable = localTables.find(t => t.id === selectedTableId) || null;

  const handleAddTable = (table: { name: string; shape: any; capacity: number }) => {
    if (!selectedFloorId) return;
    
    const tableNumber = localTables.length + 1;
    const tableName = `T${tableNumber}`;
    
    createTable.mutate({
      floorId: selectedFloorId,
      name: tableName,
      tableNumber,
      shape: table.shape,
      capacity: table.capacity,
      status: 'available',
      x: Math.random() * 70 + 15,
      y: Math.random() * 70 + 15,
      width: 8,
      height: 8,
    });
  };

  const handleTableClick = (table: any) => {
    setSelectedTableId(table.id);
  };

  const handleTableMove = (tableId: string, x: number, y: number) => {
    // Update local state immediately (optimistic update)
    setLocalTables(localTables.map(t => 
      t.id === tableId ? { ...t, x, y } : t
    ));
    
    // Save to backend
    updateTable.mutate({
      tableId,
      data: { x, y },
    });
  };

  const handleTableDelete = (tableId: string) => {
    // Remove from local state immediately
    setLocalTables(localTables.filter(t => t.id !== tableId));
    // Delete from backend
    deleteTableMutation.mutate(tableId);
    if (selectedTableId === tableId) {
      setSelectedTableId(null);
    }
  };

  const handleUpdateStatus = (tableId: string, status: any, reservation?: any) => {
    updateTable.mutate({
      tableId,
      data: { status },
    });
  };

  const handleAddFloor = () => {
    if (newFloorName.trim()) {
      createFloor.mutate(newFloorName, {
        onSuccess: () => {
          setNewFloorName('');
        },
      });
    }
  };

  const handleDeleteFloor = (floorId: string) => {
    if (floors.length <= 1) {
      alert('You must have at least one floor');
      return;
    }
    if (confirm(`Delete this floor?`)) {
      deleteFloor.mutate(floorId, {
        onSuccess: () => {
          if (selectedFloorId === floorId) {
            setSelectedFloorId(floors[0].id === floorId ? floors[1].id : floors[0].id);
          }
        },
      });
    }
  };

  const handleCreateRestaurant = () => {
    if (restaurantName.trim()) {
      createRestaurant.mutate(restaurantName, {
        onSuccess: () => {
          setShowRestaurantSetup(false);
          setRestaurantName('');
        },
      });
    }
  };

  const tableCounts = {
    available: localTables.filter((t: any) => t.status === 'available').length,
    occupied: localTables.filter((t: any) => t.status === 'occupied').length,
    reserved: localTables.filter((t: any) => t.status === 'reserved').length,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createReservation.mutate(formData, {
      onSuccess: () => {
        setFormData({ title: '', description: '', startTime: '', endTime: '' });
        setShowForm(false);
      },
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      deleteReservation.mutate(id);
    }
  };

  const confirmed = reservations?.filter(r => r.status === 'confirmed').length || 0;
  const cancelled = reservations?.filter(r => r.status === 'cancelled').length || 0;

  // Show restaurant setup dialog if no restaurant exists
  if (showRestaurantSetup) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <Card className={`w-full max-w-md ${isDark ? 'bg-slate-900 border-slate-800' : ''}`}>
          <CardHeader>
            <CardTitle>Welcome to Tablr!</CardTitle>
            <CardDescription>Set up your restaurant to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : ''}`}>
                Restaurant Name
              </label>
              <Input
                type="text"
                placeholder="My Restaurant"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateRestaurant}
              disabled={createRestaurant.isPending || !restaurantName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {createRestaurant.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Restaurant'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (restaurantLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dashboard</h2>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Manage your restaurant operations and view real-time data</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="floorplan" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Floor Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Total Reservations</span>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reservations?.length || 0}</div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                All time reservations
              </p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Confirmed</span>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{confirmed}</div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                Confirmed bookings
              </p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Cancelled</span>
                <AlertCircle className="w-4 h-4 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{cancelled}</div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                Cancelled bookings
              </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Panel */}
          <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Reservations</CardTitle>
              <CardDescription>Create and manage your reservations</CardDescription>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {showForm ? 'Cancel' : 'New Reservation'}
            </Button>
          </CardHeader>

          {/* Create Form */}
          {showForm && (
            <CardContent className={`border-t pt-6 ${isDark ? 'border-slate-800' : ''}`}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-200' : ''}`}>
                      Title
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Meeting with Team"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-200' : ''}`}>
                      Description
                    </label>
                    <Input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional description"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-200' : ''}`}>
                      Start Time
                    </label>
                    <Input
                      type="datetime-local"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-200' : ''}`}>
                      End Time
                    </label>
                    <Input
                      type="datetime-local"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={createReservation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {createReservation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Reservation'
                  )}
                </Button>
              </form>
            </CardContent>
          )}

          {/* Reservations List */}
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-500" />
                <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading reservations...</p>
              </div>
            ) : error ? (
              <div className={`text-center py-12 text-red-500`}>
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                Error loading reservations
              </div>
            ) : reservations && reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      isDark
                        ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {reservation.title}
                        </h3>
                        {reservation.description && (
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {reservation.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          reservation.status === 'confirmed'
                            ? 'default'
                            : reservation.status === 'cancelled'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {reservation.status}
                      </Badge>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Start:</p>
                          <p>{new Date(reservation.startTime).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="font-medium">End:</p>
                          <p>{new Date(reservation.endTime).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleDelete(reservation.id)}
                        disabled={deleteReservation.isPending}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-300'}`} />
                <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  No reservations yet
                </p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Create your first reservation to get started!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="floorplan" className="space-y-6">
          {/* Floors Management */}
          <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Floors</span>
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                  onClick={() => setNewFloorName('temp')}
                >
                  <Plus className="w-4 h-4" />
                  New Floor
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {floorsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="flex flex-wrap gap-2 mb-4">
                  {floors.map((floor: any) => (
                    <div
                      key={floor.id}
                      className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
                        selectedFloorId === floor.id
                          ? 'bg-indigo-600 text-white'
                          : isDark
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                      onClick={() => setSelectedFloorId(floor.id)}
                    >
                      <span className="font-medium">{floor.name || `Floor ${floor.floorNumber}`}</span>
                      {isEditMode && floors.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFloor(floor.id);
                          }}
                          className="ml-2 hover:opacity-70"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add New Floor Input */}
              {newFloorName && (
                <div className="flex gap-2 mt-4">
                  <Input
                    type="text"
                    placeholder="Floor name (e.g., Ground Floor)"
                    value={newFloorName}
                    onChange={(e) => setNewFloorName(e.target.value)}
                  />
                  <Button
                    onClick={handleAddFloor}
                    disabled={createFloor.isPending || !newFloorName.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createFloor.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                  </Button>
                  <Button
                    onClick={() => setNewFloorName('')}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Floor Plan Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedFloorId ? `${floors.find((f: any) => f.id === selectedFloorId)?.name || 'Floor'}` : 'Select a Floor'}
              </h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Manage tables and seating arrangements</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsEditMode(!isEditMode)}
                variant={isEditMode ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {isEditMode ? 'Done Editing' : 'Edit Mode'}
              </Button>
              {isEditMode && (
                <Button
                  onClick={() => setOpenAddDialog(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Table
                </Button>
              )}
            </div>
          </div>

          {/* Status Legend */}
          <Card className={isDark ? 'bg-slate-900 border-slate-800' : ''}>
            <CardContent className="p-4">
              <StatusLegend counts={tableCounts} />
            </CardContent>
          </Card>

          {/* Floor Plan and Reservation Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Floor Plan */}
            <div className="lg:col-span-2">
              <Card className={`h-[600px] ${isDark ? 'bg-slate-900 border-slate-800' : ''}`}>
                <CardContent className="p-0 h-full">
                  {tablesLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    </div>
                  ) : !selectedFloorId ? (
                    <div className="h-full flex items-center justify-center">
                      <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Select a floor to view tables</p>
                    </div>
                  ) : (
                    <FloorPlan
                      tables={localTables}
                      onTableClick={handleTableClick}
                      selectedTableId={selectedTableId}
                      isEditMode={isEditMode}
                      onTableMove={handleTableMove}
                      onTableDelete={handleTableDelete}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Reservation Panel */}
            <div>
              <Card className={`h-[600px] overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : ''}`}>
                <ReservationPanel
                  selectedTable={selectedTable}
                  onUpdateStatus={handleUpdateStatus}
                  onClose={() => setSelectedTableId(null)}
                />
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Table Dialog */}
      <AddTableDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onAddTable={handleAddTable}
      />
    </div>
  );
};

export default Dashboard;

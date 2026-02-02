import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export interface Floor {
  id: string;
  restaurantId: string;
  floorNumber: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  tables?: Table[];
}

export interface Table {
  id: string;
  floorId: string;
  name: string;
  tableNumber: number;
  shape: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  x: number;
  y: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

// Get all floors for the user's restaurant
export const useFloors = () => {
  return useQuery({
    queryKey: ['floors'],
    queryFn: async () => {
      const { data } = await apiClient.get<Floor[]>('/floors');
      return data;
    },
  });
};

// Get a specific floor with its tables
export const useFloor = (floorId: string) => {
  return useQuery({
    queryKey: ['floor', floorId],
    queryFn: async () => {
      const { data } = await apiClient.get<Floor>(`/floors/${floorId}`);
      return data;
    },
    enabled: !!floorId,
  });
};

// Create a new floor
export const useCreateFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await apiClient.post<Floor>('/floors', { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
    },
  });
};

// Update a floor
export const useUpdateFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ floorId, name }: { floorId: string; name: string }) => {
      const { data } = await apiClient.put<Floor>(`/floors/${floorId}`, { name });
      return data;
    },
    onSuccess: (_, { floorId }) => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      queryClient.invalidateQueries({ queryKey: ['floor', floorId] });
    },
  });
};

// Delete a floor
export const useDeleteFloor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (floorId: string) => {
      await apiClient.delete(`/floors/${floorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
    },
  });
};

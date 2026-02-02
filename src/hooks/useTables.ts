import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

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

// Get all tables for a floor
export const useTables = (floorId: string | null) => {
  return useQuery({
    queryKey: ['tables', floorId],
    queryFn: async () => {
      const { data } = await apiClient.get<Table[]>(`/tables/floor/${floorId}`);
      return data;
    },
    enabled: !!floorId,
  });
};

// Create a new table
export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tableData: Omit<Table, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await apiClient.post<Table>('/tables', tableData);
      return data;
    },
    onSuccess: (_, tableData) => {
      queryClient.invalidateQueries({ queryKey: ['tables', tableData.floorId] });
    },
  });
};

// Update a table
export const useUpdateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tableId, data }: { tableId: string; data: Partial<Omit<Table, 'id' | 'createdAt' | 'updatedAt'>> }) => {
      const response = await apiClient.put<Table>(`/tables/${tableId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

// Delete a table
export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tableId: string) => {
      await apiClient.delete(`/tables/${tableId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

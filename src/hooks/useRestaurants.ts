import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export interface Restaurant {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  floors?: any[];
}

// Get user's restaurant
export const useRestaurant = () => {
  return useQuery({
    queryKey: ['restaurant'],
    queryFn: async () => {
      const { data } = await apiClient.get<Restaurant>('/restaurants');
      return data;
    },
  });
};

// Create restaurant (for users without one)
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await apiClient.post<Restaurant>('/restaurants', { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
      queryClient.invalidateQueries({ queryKey: ['floors'] });
    },
  });
};

// Update restaurant
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await apiClient.put<Restaurant>('/restaurants', { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
    },
  });
};

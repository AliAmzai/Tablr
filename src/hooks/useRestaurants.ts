import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Restaurant } from '@/lib/api';

// Get all user's restaurants
export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data } = await apiClient.get<Restaurant[]>('/restaurants');
      return data;
    },
  });
};

// Get single restaurant by ID
export const useRestaurant = (id?: number) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await apiClient.get<Restaurant>(`/restaurants?id=${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create restaurant (allows multiple per user)
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (restaurantData: { 
      name: string;
      description?: string;
      contactEmail?: string;
      contactPhone?: string;
    }) => {
      const { data } = await apiClient.post<Restaurant>('/restaurants', restaurantData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
      queryClient.invalidateQueries({ queryKey: ['floors'] });
    },
  });
};

// Update restaurant
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      ...data 
    }: { 
      id: number;
      name?: string;
      description?: string;
      contactEmail?: string;
      contactPhone?: string;
    }) => {
      const { data: restaurant } = await apiClient.put<Restaurant>(`/restaurants/${id}`, data);
      return restaurant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
    },
  });
};

// Delete restaurant
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete<{ message: string }>(`/restaurants/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
    },
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesAPI, Employee, CreateEmployeeData, UpdateEmployeeData } from '@/lib/api';

// Get all employees for a restaurant
export const useEmployees = (restaurantId?: number) => {
  return useQuery({
    queryKey: ['employees', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const { data } = await employeesAPI.getAll(restaurantId);
      return data;
    },
    enabled: !!restaurantId,
  });
};

// Get single employee
export const useEmployee = (id?: number) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await employeesAPI.getOne(id);
      return data;
    },
    enabled: !!id,
  });
};

// Create employee
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeData: CreateEmployeeData) => {
      const { data } = await employeesAPI.create(employeeData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees', data.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};

// Update employee
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateEmployeeData & { id: number }) => {
      const { data: employee } = await employeesAPI.update(id, data);
      return employee;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees', data.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
    },
  });
};

// Delete employee
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, restaurantId }: { id: number; restaurantId: number }) => {
      const { data } = await employeesAPI.delete(id);
      return { ...data, restaurantId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees', data.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};

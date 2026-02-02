import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reservationsAPI, Reservation, CreateReservationData, UpdateReservationData } from '../lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const RESERVATIONS_KEY = ['reservations'];

export const useReservations = () => {
  return useQuery<Reservation[], AxiosError<{ error: string }>>({
    queryKey: RESERVATIONS_KEY,
    queryFn: () => reservationsAPI.getAll().then(res => res.data),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useReservation = (id?: number) => {
  return useQuery<Reservation, AxiosError<{ error: string }>>({
    queryKey: ['reservations', id],
    queryFn: () => id ? reservationsAPI.getOne(id).then(res => res.data) : Promise.reject('No ID provided'),
    enabled: !!id,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; reservation: Reservation },
    AxiosError<{ error: string }>,
    CreateReservationData
  >({
    mutationFn: (data) => reservationsAPI.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEY });
      toast.success('Reservation created successfully!');
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.error || 'Failed to create reservation';
      toast.error(errorMsg);
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; reservation: Reservation },
    AxiosError<{ error: string }>,
    { id: number; data: UpdateReservationData }
  >({
    mutationFn: ({ id, data }) => reservationsAPI.update(id, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ['reservations', id] });
      toast.success('Reservation updated successfully!');
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.error || 'Failed to update reservation';
      toast.error(errorMsg);
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    AxiosError<{ error: string }>,
    number
  >({
    mutationFn: (id) => reservationsAPI.delete(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVATIONS_KEY });
      toast.success('Reservation deleted successfully!');
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.error || 'Failed to delete reservation';
      toast.error(errorMsg);
    },
  });
};

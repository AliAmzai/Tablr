import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI, AuthResponse, SignupData, LoginData, User } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useSignup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError<{ error: string }>, SignupData>({
    mutationFn: (data) => authAPI.signup(data).then(res => res.data),
    onSuccess: (response) => {
      const { token, user } = response;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      queryClient.setQueryData(['auth', 'me'], user); // Update cache
      toast.success('Account created successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.error || 'Signup failed';
      toast.error(errorMsg);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError<{ error: string }>, LoginData>({
    mutationFn: (data) => authAPI.login(data).then(res => res.data),
    onSuccess: (response) => {
      const { token, user } = response;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      queryClient.setQueryData(['auth', 'me'], user); // Update cache
      toast.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.error || 'Login failed';
      toast.error(errorMsg);
    },
  });
};

export const useGetMe = () => {
  return useQuery<User | null, AxiosError<{ error: string }>>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return null;
      }
      try {
        const response = await authAPI.getMe();
        return response.data;
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    queryClient.clear(); // Clear all cached queries
    toast.success('Logged out successfully');
    navigate('/login');
  };
};

import apiClient from './apiClient';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Reservation {
  id: number;
  userId: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export interface UpdateReservationData {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  status?: 'confirmed' | 'cancelled' | 'completed';
}

// Auth API calls
export const authAPI = {
  signup: (data: SignupData) => apiClient.post<AuthResponse>('/auth/signup', data),
  login: (data: LoginData) => apiClient.post<AuthResponse>('/auth/login', data),
  getMe: () => apiClient.get<User>('/auth/me'),
};

// Reservations API calls
export const reservationsAPI = {
  create: (data: CreateReservationData) => apiClient.post<{ message: string; reservation: Reservation }>('/reservations', data),
  getAll: () => apiClient.get<Reservation[]>('/reservations'),
  getOne: (id: number) => apiClient.get<Reservation>(`/reservations/${id}`),
  update: (id: number, data: UpdateReservationData) => apiClient.put<{ message: string; reservation: Reservation }>(`/reservations/${id}`, data),
  delete: (id: number) => apiClient.delete<{ message: string }>(`/reservations/${id}`),
};

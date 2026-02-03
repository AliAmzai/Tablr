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

// Employee types
export interface Employee {
  id: number;
  restaurantId: number;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  tables?: Array<{
    id: number;
    name: string;
    capacity?: number;
  }>;
}

export interface CreateEmployeeData {
  restaurantId: number;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface UpdateEmployeeData {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

// Restaurant types
export interface Restaurant {
  id: number;
  userId: number;
  name: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
  floors?: Floor[];
  employees?: Employee[];
  locations?: Location[];
}

export interface Floor {
  id: number;
  restaurantId: number;
  name: string;
  floorNumber: number;
  createdAt: string;
  updatedAt: string;
  tables?: Table[];
}

export interface Table {
  id: number;
  floorId: number;
  name: string;
  shape: string;
  capacity: number;
  status: string;
  x: number;
  y: number;
  width: number;
  height: number;
  workerId?: number;
  worker?: {
    id: number;
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: number;
  restaurantId: number;
  name: string;
  address: string;
  phone: string;
  city?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

// Employees API calls
export const employeesAPI = {
  create: (data: CreateEmployeeData) => apiClient.post<Employee>('/employees', data),
  getAll: (restaurantId: number) => apiClient.get<Employee[]>(`/employees?restaurantId=${restaurantId}`),
  getOne: (id: number) => apiClient.get<Employee>(`/employees/${id}`),
  update: (id: number, data: UpdateEmployeeData) => apiClient.put<Employee>(`/employees/${id}`, data),
  delete: (id: number) => apiClient.delete<{ message: string }>(`/employees/${id}`),
};


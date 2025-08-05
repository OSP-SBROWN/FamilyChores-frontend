import axios from 'axios';
import type { Timezone, CreateTimezoneDto, UpdateTimezoneDto, ApiResponse } from '../types/timezone';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token if needed
api.interceptors.request.use((config) => {
  // Add auth token here when implementing authentication
  // const token = localStorage.getItem('authToken');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const timezoneService = {
  async getAll(): Promise<Timezone[]> {
    const response = await api.get<ApiResponse<Timezone[]>>('/timezones');
    return response.data.data;
  },

  async getById(id: string): Promise<Timezone> {
    const response = await api.get<ApiResponse<Timezone>>(`/timezones/${id}`);
    return response.data.data;
  },

  async create(timezone: CreateTimezoneDto): Promise<Timezone> {
    const response = await api.post<ApiResponse<Timezone>>('/timezones', timezone);
    return response.data.data;
  },

  async update(id: string, timezone: Partial<UpdateTimezoneDto>): Promise<Timezone> {
    const response = await api.put<ApiResponse<Timezone>>(`/timezones/${id}`, timezone);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/timezones/${id}`);
  },

  async updateOrder(timezones: Pick<Timezone, 'id' | 'order'>[]): Promise<Timezone[]> {
    const response = await api.put<ApiResponse<Timezone[]>>('/timezones/reorder', { timezones });
    return response.data.data;
  },
};

export default api;

import axios from 'axios';
import { Timezone, CreateTimezoneDto, UpdateTimezoneDto, ApiResponse } from '../types/timezone';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class TimezoneService {
  static async getAll(): Promise<Timezone[]> {
    const response = await api.get<ApiResponse<Timezone[]>>('/timezones');
    return response.data.data;
  }

  static async getById(id: string): Promise<Timezone> {
    const response = await api.get<ApiResponse<Timezone>>(`/timezones/${id}`);
    return response.data.data;
  }

  static async create(data: CreateTimezoneDto): Promise<Timezone> {
    const response = await api.post<ApiResponse<Timezone>>('/timezones', data);
    return response.data.data;
  }

  static async update(id: string, data: UpdateTimezoneDto): Promise<Timezone> {
    const response = await api.put<ApiResponse<Timezone>>(`/timezones/${id}`, data);
    return response.data.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/timezones/${id}`);
  }

  static async updateOrder(timezones: { id: string; sortOrder: number }[]): Promise<void> {
    // Update multiple timezones with new sort orders
    await Promise.all(
      timezones.map(({ id, sortOrder }) =>
        api.put(`/timezones/${id}`, { sortOrder })
      )
    );
  }
}

export default TimezoneService;

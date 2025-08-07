import { api } from './api';
import type { Timezone, CreateTimezoneDto, UpdateTimezoneDto, ApiResponse } from '../types/timezone';

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

  static async updateOrder(timezones: { id: string; display_order: number }[]): Promise<void> {
    // Use the reorder endpoint
    await api.post('/timezones/reorder', { timezones });
  }
}

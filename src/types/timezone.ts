export interface Timezone {
  id: string;
  name: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimezoneDto {
  name: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  sortOrder?: number;
}

export interface UpdateTimezoneDto {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

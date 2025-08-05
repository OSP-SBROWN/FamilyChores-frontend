export interface Timezone {
  id: string;
  name: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimezoneDto {
  name: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateTimezoneDto extends Partial<CreateTimezoneDto> {
  id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

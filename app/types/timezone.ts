export interface Timezone {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  created_at: string;
}

export interface CreateTimezoneDto {
  name: string;
  description?: string;
}

export interface UpdateTimezoneDto {
  name?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  timestamp?: string;
}

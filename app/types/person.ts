// Types for Person management based on database schema
export interface Person {
  id: string;
  name: string;
  date_of_birth?: string; // Date as ISO string from API
  color_code: string;
  workload_weighting: number;
  photo_url?: string;
  created_by?: string;
  created_at: string; // Date as ISO string from API
  updated_at: string; // Date as ISO string from API
}

export interface CreatePersonDto {
  name: string;
  date_of_birth?: string; // Optional date as ISO string
  color_code: string;
  workload_weighting?: number; // Default to 1.00 if not provided
  photo_url?: string;
}

export interface UpdatePersonDto {
  id: string;
  name?: string;
  date_of_birth?: string;
  color_code?: string;
  workload_weighting?: number;
  photo_url?: string;
}

// Form data type for the UI
export interface PersonFormData {
  name: string;
  date_of_birth: string; // Date input value
  color_code: string;
  workload_weighting: string; // String for input field
  photo_url: string;
}

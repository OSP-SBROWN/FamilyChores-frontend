export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Person {
  id: string;
  name: string;
  dateOfBirth?: Date;
  colorCode: string;
  workloadWeighting: number;
  photoUrl?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Timezone {
  id: string;
  name: string;
  displayOrder: number;
  description?: string;
  createdAt: Date;
}

export interface DayType {
  id: string;
  name: string;
  displayName: string;
}

export interface Chore {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  estimatedMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChoreAssignment {
  id: string;
  choreId: string;
  assignedTo: string;
  helperId?: string;
  scheduledDate: Date;
  timezoneId: string;
  status: 'pending' | 'completed' | 'skipped' | 'deferred';
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonAvailability {
  id: string;
  personId: string;
  dayTypeId: string;
  timezoneId: string;
  isAvailable: boolean;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreatePersonDto {
  name: string;
  dateOfBirth?: Date;
  colorCode: string;
  workloadWeighting?: number;
  photoUrl?: string;
}

export interface CreateChoreDto {
  name: string;
  description?: string;
  frequency: string;
  estimatedMinutes?: number;
}

export interface CreateTimezoneDto {
  name: string;
  displayOrder: number;
  description?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AssignmentFilters {
  personId?: string;
  choreId?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  timezoneId?: string;
}

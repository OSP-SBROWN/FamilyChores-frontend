export interface Chore {
  id: string;
  title: string;
  description?: string;
  timezoneId?: string | null;
  timezoneName?: string;
  isTimeSensitive: boolean;
  assignmentType: ChoreAssignmentType;
  status: ChoreStatus;
  frequency: ChoreFrequency;
  createdAt: string;
  updatedAt: string;
  isRewardBased: boolean;
  rewardAmount?: number;
}

export interface ChoreAssignment {
  id: string;
  choreId: string;
  personId: string | null; // null if assigned to everyone or anyone
  assignmentType: ChoreAssignmentType;
  status: ChoreAssignmentStatus;
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
}

export interface ChoreWithAssignments extends Chore {
  assignments: ChoreAssignment[];
}

export enum ChoreAssignmentType {
  SINGLE = "SINGLE",        // Assigned to a specific person
  ANY = "ANY",              // Assigned to a group, any one can complete
  ALL = "ALL",              // Assigned to a group, all must complete
  ANYONE = "ANYONE",        // Anyone in household can do it
  EVERYONE = "EVERYONE"     // Everyone must do it
}

export enum ChoreStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  COMPLETED = "COMPLETED",
  DELETED = "DELETED"
}

export enum ChoreAssignmentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  OVERDUE = "OVERDUE",
  SKIPPED = "SKIPPED"
}

export enum ChoreFrequency {
  ONCE = "ONCE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  CUSTOM = "CUSTOM"
}

export interface ChoreWithCapablePersons extends Chore {
  capablePersons: string[]; // Array of person IDs who are capable of doing this chore
}

export interface ChoreCreateDto {
  title: string;
  description?: string;
  timezoneId?: string;
  isTimeSensitive: boolean;
  assignmentType: ChoreAssignmentType;
  frequency: ChoreFrequency;
  capablePersonIds: string[];
  isRewardBased: boolean;
  rewardAmount?: number;
}

export interface ChoreUpdateDto {
  id: string;
  title?: string;
  description?: string;
  timezoneId?: string | null;
  isTimeSensitive?: boolean;
  assignmentType?: ChoreAssignmentType;
  status?: ChoreStatus;
  frequency?: ChoreFrequency;
  capablePersonIds?: string[];
  isRewardBased?: boolean;
  rewardAmount?: number;
}

export interface ChoreAssignmentCreateDto {
  choreId: string;
  personId: string | null; 
  assignmentType: ChoreAssignmentType;
  dueDate?: string;
}

export interface ChoreAssignmentUpdateDto {
  id: string;
  status?: ChoreAssignmentStatus;
  completedAt?: string;
  completedBy?: string;
}

/**
 * Types for chore scheduling system
 */

/**
 * Schedule types for chores
 */
export enum ScheduleType {
  ONCE = 'once',               // One-time chore
  DAILY = 'daily',             // Every day
  WEEKLY = 'weekly',           // Weekly on specific days
  MONTHLY = 'monthly',         // Monthly on specific days
  CUSTOM = 'custom'            // Custom recurrence pattern
}

/**
 * Month-based recurrence types
 */
export enum MonthlyRecurrenceType {
  DAY_OF_MONTH = 'day_of_month',       // E.g., 15th of each month
  DAY_OF_WEEK = 'day_of_week',         // E.g., 3rd Tuesday
  LAST_OF_MONTH = 'last_of_month',     // E.g., Last day of month
  LAST_WEEKDAY = 'last_weekday',       // E.g., Last weekday of month
  FIRST_OF_MONTH = 'first_of_month',   // E.g., First day of month
}

/**
 * Rule application types
 */
export enum RuleType {
  INCLUDE = 'include',         // Add dates based on rule
  EXCLUDE = 'exclude'          // Exclude dates based on rule
}

/**
 * Schedule exception types
 */
export enum ExceptionType {
  SKIP = 'skip',               // Skip an occurrence
  RESCHEDULE = 'reschedule',   // Change the date of an occurrence
  CHANGE_ASSIGNEE = 'change_assignee' // Change who is assigned
}

/**
 * Main chore schedule configuration
 */
export interface ChoreSchedule {
  id: string;
  choreId: string;
  scheduleType: ScheduleType;
  startDate?: Date;            // When to start recurring
  endDate?: Date;              // When to end recurring (optional)
  recurrenceInterval?: number; // E.g., every 2 weeks
  
  // For weekly schedules
  daysOfWeek?: number[];       // 0=Sunday, 1=Monday, etc.
  
  // For monthly schedules
  monthlyRecurrenceType?: MonthlyRecurrenceType;
  dayOfMonth?: number;         // 1-31
  weekOfMonth?: number;        // 1=first, 2=second, etc., -1=last
  dayOfWeek?: number;          // 0=Sunday, 1=Monday, etc.
  
  // For custom schedules
  description?: string;        // Human-readable description
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schedule rule for complex recurrence patterns
 */
export interface ScheduleRule {
  id: string;
  choreId: string;
  name: string;               // Display name of the rule
  ruleType: RuleType;         // Include or exclude
  priority: number;           // Higher number = higher priority for conflict resolution
  
  // Rule conditions (examples)
  condition: {
    type: string;             // "weekday", "weekend", "school_day", "holiday", etc.
    parameters?: any;         // Additional parameters for the rule
    expression?: string;      // For complex conditions (e.g., "dayOfWeek === 1 && isHoliday === false")
  };
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Exception for specific schedule occurrences
 */
export interface ScheduleException {
  id: string;
  choreId: string;
  exceptionType: ExceptionType;
  originalDate: Date;         // Original occurrence date
  
  // For reschedule exceptions
  newDate?: Date;             // New date for the occurrence
  
  // For change_assignee exceptions
  personId?: string;          // New person assigned
  
  reason?: string;            // Optional reason for the exception
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Reusable schedule template
 */
export interface ScheduleTemplate {
  id: string;
  name: string;               // Display name
  description?: string;       // Optional description
  
  // Core schedule settings
  scheduleType: ScheduleType;
  recurrenceInterval?: number;
  daysOfWeek?: number[];
  monthlyRecurrenceType?: MonthlyRecurrenceType;
  dayOfMonth?: number;
  weekOfMonth?: number;
  dayOfWeek?: number;
  
  // Rules attached to this template
  rules?: Partial<ScheduleRule>[];
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schedule occurrence for displaying in calendar
 */
export interface ScheduleOccurrence {
  date: Date;
  choreId: string;
  personId?: string;          // Person assigned to this occurrence
  status?: string;            // "pending", "completed", "missed", etc.
  isException?: boolean;      // Whether this is an exception occurrence
  exceptionId?: string;       // Reference to exception if applicable
}

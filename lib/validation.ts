import Joi from 'joi';

export const userRegistrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'member').default('member')
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const personSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  dateOfBirth: Joi.date().iso().optional(),
  colorCode: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
  workloadWeighting: Joi.number().min(0.1).max(5.0).default(1.0),
  photoUrl: Joi.string().uri().optional()
});

export const choreSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().optional(),
  frequency: Joi.string().valid(
    'daily', 
    'multiple_daily',
    'weekdays_only', 
    'weekend', 
    'weekly', 
    'monthly', 
    'quarterly', 
    'twice_yearly', 
    'annually', 
    'ad_hoc'
  ).required(),
  estimatedMinutes: Joi.number().min(1).max(480).optional()
});

export const timezoneSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  displayOrder: Joi.number().integer().min(1).required(),
  description: Joi.string().optional()
});

export const assignmentSchema = Joi.object({
  choreId: Joi.string().uuid().required(),
  assignedTo: Joi.string().uuid().required(),
  helperId: Joi.string().uuid().optional(),
  scheduledDate: Joi.date().iso().required(),
  timezoneId: Joi.string().uuid().required(),
  status: Joi.string().valid('pending', 'completed', 'skipped', 'deferred').default('pending'),
  notes: Joi.string().optional()
});

export const updateAssignmentSchema = Joi.object({
  status: Joi.string().valid('pending', 'completed', 'skipped', 'deferred').optional(),
  notes: Joi.string().optional(),
  completedAt: Joi.date().iso().optional()
});

export const availabilitySchema = Joi.object({
  personId: Joi.string().uuid().required(),
  dayTypeId: Joi.string().uuid().required(),
  timezoneId: Joi.string().uuid().required(),
  isAvailable: Joi.boolean().required()
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
});

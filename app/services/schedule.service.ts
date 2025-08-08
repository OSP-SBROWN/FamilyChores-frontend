import { api } from './api';
import { ChoreSchedule, ScheduleTemplate, ScheduleRule, ScheduleException } from '../types/schedule';

/**
 * Service for managing chore schedules
 */
export const scheduleService = {
  /**
   * Get a chore's schedule by chore ID
   */
  getChoreSchedule: async (choreId: string): Promise<ChoreSchedule> => {
    const response = await api.get(`/chores/${choreId}/schedule`);
    return response.data.data;
  },

  /**
   * Update a chore's schedule
   */
  updateChoreSchedule: async (choreId: string, scheduleData: Partial<ChoreSchedule>): Promise<ChoreSchedule> => {
    const response = await api.put(`/chores/${choreId}/schedule`, scheduleData);
    return response.data.data;
  },

  /**
   * Generate occurrences for a chore's schedule
   */
  generateOccurrences: async (choreId: string, count = 10): Promise<Date[]> => {
    const response = await api.get(`/chores/${choreId}/schedule/occurrences`, {
      params: { count }
    });
    return response.data.data;
  },

  /**
   * Get schedule rules for a chore
   */
  getChoreRules: async (choreId: string): Promise<ScheduleRule[]> => {
    const response = await api.get(`/chores/${choreId}/schedule/rules`);
    return response.data.data;
  },

  /**
   * Create a new schedule rule for a chore
   */
  createChoreRule: async (choreId: string, rule: Partial<ScheduleRule>): Promise<ScheduleRule> => {
    const response = await api.post(`/chores/${choreId}/schedule/rules`, rule);
    return response.data.data;
  },

  /**
   * Update an existing schedule rule
   */
  updateChoreRule: async (choreId: string, ruleId: string, rule: Partial<ScheduleRule>): Promise<ScheduleRule> => {
    const response = await api.put(`/chores/${choreId}/schedule/rules/${ruleId}`, rule);
    return response.data.data;
  },

  /**
   * Delete a schedule rule
   */
  deleteChoreRule: async (choreId: string, ruleId: string): Promise<void> => {
    await api.delete(`/chores/${choreId}/schedule/rules/${ruleId}`);
  },

  /**
   * Get schedule exceptions for a chore
   */
  getChoreExceptions: async (choreId: string): Promise<ScheduleException[]> => {
    const response = await api.get(`/chores/${choreId}/schedule/exceptions`);
    return response.data.data;
  },

  /**
   * Create a new schedule exception for a chore
   */
  createChoreException: async (choreId: string, exception: Partial<ScheduleException>): Promise<ScheduleException> => {
    const response = await api.post(`/chores/${choreId}/schedule/exceptions`, exception);
    return response.data.data;
  },

  /**
   * Update an existing schedule exception
   */
  updateChoreException: async (choreId: string, exceptionId: string, exception: Partial<ScheduleException>): Promise<ScheduleException> => {
    const response = await api.put(`/chores/${choreId}/schedule/exceptions/${exceptionId}`, exception);
    return response.data.data;
  },

  /**
   * Delete a schedule exception
   */
  deleteChoreException: async (choreId: string, exceptionId: string): Promise<void> => {
    await api.delete(`/chores/${choreId}/schedule/exceptions/${exceptionId}`);
  },

  /**
   * Get all schedule templates
   */
  getScheduleTemplates: async (): Promise<ScheduleTemplate[]> => {
    const response = await api.get('/chores/schedule/templates');
    return response.data.data;
  },

  /**
   * Get a specific schedule template
   */
  getScheduleTemplate: async (templateId: string): Promise<ScheduleTemplate> => {
    const response = await api.get(`/chores/schedule/templates/${templateId}`);
    return response.data.data;
  },

  /**
   * Create a new schedule template
   */
  createScheduleTemplate: async (template: Partial<ScheduleTemplate>): Promise<ScheduleTemplate> => {
    const response = await api.post('/chores/schedule/templates', template);
    return response.data.data;
  },

  /**
   * Update an existing schedule template
   */
  updateScheduleTemplate: async (templateId: string, template: Partial<ScheduleTemplate>): Promise<ScheduleTemplate> => {
    const response = await api.put(`/chores/schedule/templates/${templateId}`, template);
    return response.data.data;
  },

  /**
   * Delete a schedule template
   */
  deleteScheduleTemplate: async (templateId: string): Promise<void> => {
    await api.delete(`/chores/schedule/templates/${templateId}`);
  },

  /**
   * Apply a template to a chore's schedule
   */
  applyTemplateToChore: async (choreId: string, templateId: string): Promise<ChoreSchedule> => {
    const response = await api.post(`/chores/${choreId}/schedule/apply-template`, { templateId });
    return response.data.data;
  }
};

export default scheduleService;

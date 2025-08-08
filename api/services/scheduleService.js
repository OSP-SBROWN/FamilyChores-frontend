/**
 * Chore Scheduling Service
 * 
 * Handles the generation, calculation, and management of chore schedules
 */
const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for some cloud databases like Heroku
  }
});

class ScheduleService {
  /**
   * Generate the next occurrences of a chore based on its schedule
   * @param {string} choreId - UUID of the chore
   * @param {number} count - Number of occurrences to generate
   * @returns {Array} - Array of occurrence objects
   */
  async generateOccurrences(choreId, count = 10) {
    try {
      // Get chore with schedule information
      const chore = await this.getChoreWithSchedule(choreId);
      if (!chore) {
        throw new Error(`Chore with ID ${choreId} not found`);
      }

      // Get rules and exceptions
      const rules = await this.getChoreRules(choreId);
      const exceptions = await this.getChoreExceptions(choreId);
      
      // Generate occurrences based on schedule type
      let occurrences = [];
      
      switch (chore.schedule_type) {
        case 'SIMPLE':
          occurrences = await this.generateSimpleOccurrences(chore, count);
          break;
        case 'RECURRING':
          occurrences = await this.generateRecurringOccurrences(chore, count);
          break;
        case 'CONDITIONAL':
          occurrences = await this.generateConditionalOccurrences(chore, rules, count);
          break;
        case 'CUSTOM':
          occurrences = await this.generateCustomOccurrences(chore, rules, count);
          break;
        default:
          occurrences = await this.generateSimpleOccurrences(chore, count);
      }
      
      // Apply exceptions
      occurrences = this.applyExceptions(occurrences, exceptions);
      
      // Update chore with next occurrence date if we have occurrences
      if (occurrences.length > 0) {
        const nextOccurrence = occurrences[0];
        if (!nextOccurrence.is_cancelled) {
          await this.updateChoreNextOccurrence(choreId, nextOccurrence.date);
        }
      }
      
      return occurrences;
    } catch (error) {
      console.error('Error generating chore occurrences:', error);
      throw error;
    }
  }

  /**
   * Get chore with schedule information
   * @param {string} choreId - UUID of the chore
   * @returns {Object} - Chore object with schedule information
   */
  async getChoreWithSchedule(choreId) {
    const query = `
      SELECT * FROM chores 
      WHERE id = $1 AND status != 'DELETED'
    `;
    
    const result = await pool.query(query, [choreId]);
    return result.rows[0] || null;
  }

  /**
   * Get rules for a chore
   * @param {string} choreId - UUID of the chore
   * @returns {Array} - Array of rule objects
   */
  async getChoreRules(choreId) {
    const query = `
      SELECT * FROM chore_schedule_rules
      WHERE chore_id = $1
      ORDER BY priority
    `;
    
    const result = await pool.query(query, [choreId]);
    return result.rows || [];
  }

  /**
   * Get exceptions for a chore
   * @param {string} choreId - UUID of the chore
   * @returns {Array} - Array of exception objects
   */
  async getChoreExceptions(choreId) {
    const query = `
      SELECT * FROM chore_schedule_exceptions
      WHERE chore_id = $1
    `;
    
    const result = await pool.query(query, [choreId]);
    return result.rows || [];
  }

  /**
   * Update chore's next occurrence date
   * @param {string} choreId - UUID of the chore
   * @param {Date} nextOccurrence - Next occurrence date
   */
  async updateChoreNextOccurrence(choreId, nextOccurrence) {
    const query = `
      UPDATE chores
      SET next_occurrence = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    
    await pool.query(query, [nextOccurrence, choreId]);
  }

  /**
   * Generate occurrences for simple schedules
   * @param {Object} chore - Chore object
   * @param {number} count - Number of occurrences to generate
   * @returns {Array} - Array of occurrence objects
   */
  async generateSimpleOccurrences(chore, count) {
    const occurrences = [];
    
    // Start date defaults to today if not set
    const startDate = chore.start_date ? new Date(chore.start_date) : new Date();
    
    // If one-time chore (no recurrence pattern)
    if (!chore.recurrence_pattern) {
      occurrences.push({
        date: startDate,
        chore_id: chore.id,
        is_time_sensitive: chore.is_time_sensitive,
        time_of_day: chore.time_of_day
      });
      return occurrences;
    }
    
    // For recurring simple patterns
    const intervalValue = chore.interval_value || 1;
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < count; i++) {
      // Skip if we've passed the end date
      if (chore.end_date && currentDate > new Date(chore.end_date)) {
        break;
      }
      
      occurrences.push({
        date: new Date(currentDate),
        chore_id: chore.id,
        is_time_sensitive: chore.is_time_sensitive,
        time_of_day: chore.time_of_day
      });
      
      // Advance to next occurrence based on recurrence pattern
      switch (chore.recurrence_pattern) {
        case 'DAILY':
          currentDate.setDate(currentDate.getDate() + intervalValue);
          break;
        case 'WEEKLY':
          currentDate.setDate(currentDate.getDate() + (7 * intervalValue));
          break;
        case 'BIWEEKLY':
          currentDate.setDate(currentDate.getDate() + (14 * intervalValue));
          break;
        case 'MONTHLY':
          currentDate.setMonth(currentDate.getMonth() + intervalValue);
          break;
        case 'YEARLY':
          currentDate.setFullYear(currentDate.getFullYear() + intervalValue);
          break;
        default:
          currentDate.setDate(currentDate.getDate() + intervalValue);
      }
    }
    
    return occurrences;
  }

  /**
   * Generate occurrences for recurring schedules
   * @param {Object} chore - Chore object
   * @param {number} count - Number of occurrences to generate
   * @returns {Array} - Array of occurrence objects
   */
  async generateRecurringOccurrences(chore, count) {
    const occurrences = [];
    
    // Start date defaults to today if not set
    const startDate = chore.start_date ? new Date(chore.start_date) : new Date();
    let currentDate = new Date(startDate);
    
    // Process based on recurrence pattern and specific settings
    if (chore.recurrence_pattern === 'WEEKLY' && chore.weekdays && chore.weekdays.length) {
      // For weekly recurrence with specific days
      const weekdays = chore.weekdays.sort((a, b) => a - b); // Sort days 0-6
      let occurrenceCount = 0;
      
      // Keep going until we have enough occurrences or hit end date
      while (occurrenceCount < count && (!chore.end_date || currentDate <= new Date(chore.end_date))) {
        const currentDay = currentDate.getDay(); // 0-6 (Sunday-Saturday)
        
        // Find the next day that's in our weekdays array
        let found = false;
        for (const day of weekdays) {
          if ((day >= currentDay && currentDate.getDay() !== day) || 
              (occurrenceCount === 0 && currentDate.getDay() === day)) {
            const daysToAdd = day >= currentDay ? day - currentDay : (7 - currentDay) + day;
            const nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + (daysToAdd === 0 ? 0 : daysToAdd));
            
            // Add this occurrence if it doesn't exceed end date
            if (!chore.end_date || nextDate <= new Date(chore.end_date)) {
              occurrences.push({
                date: nextDate,
                chore_id: chore.id,
                is_time_sensitive: chore.is_time_sensitive,
                time_of_day: chore.time_of_day
              });
              occurrenceCount++;
              found = true;
              if (occurrenceCount >= count) break;
            }
          }
        }
        
        // If we processed all days in current week, move to next week
        if (!found || occurrenceCount >= count) {
          // Move to first day of next week
          currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay()));
        }
      }
    } else if (chore.recurrence_pattern === 'MONTHLY' && chore.month_days && chore.month_days.length) {
      // For monthly recurrence with specific days
      let occurrenceCount = 0;
      const monthDays = chore.month_days.sort((a, b) => a - b); // Sort days 1-31
      
      // Keep going until we have enough occurrences or hit end date
      while (occurrenceCount < count && (!chore.end_date || currentDate <= new Date(chore.end_date))) {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Check each day in the month_days array
        for (const day of monthDays) {
          // Skip days that don't exist in this month
          const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
          if (day > lastDayOfMonth) continue;
          
          // If current day is past the specified day, move to next month
          if (currentDate.getDate() > day) continue;
          
          // Create occurrence for this day
          const occurrenceDate = new Date(currentYear, currentMonth, day);
          
          // Skip if before start date
          if (occurrenceDate < startDate) continue;
          
          // Add this occurrence
          if (!chore.end_date || occurrenceDate <= new Date(chore.end_date)) {
            occurrences.push({
              date: occurrenceDate,
              chore_id: chore.id,
              is_time_sensitive: chore.is_time_sensitive,
              time_of_day: chore.time_of_day
            });
            occurrenceCount++;
            if (occurrenceCount >= count) break;
          }
        }
        
        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1); // Reset to first day of month
      }
    } else {
      // Default case: fall back to simple recurrence
      return this.generateSimpleOccurrences(chore, count);
    }
    
    return occurrences;
  }

  /**
   * Generate occurrences for conditional schedules
   * @param {Object} chore - Chore object
   * @param {Array} rules - Array of rule objects
   * @param {number} count - Number of occurrences to generate
   * @returns {Array} - Array of occurrence objects
   */
  async generateConditionalOccurrences(chore, rules, count) {
    // First generate a set of candidate dates
    let candidateDates = [];
    const startDate = chore.start_date ? new Date(chore.start_date) : new Date();
    let currentDate = new Date(startDate);
    
    // Generate enough candidate dates (3x requested count to ensure we have enough after filtering)
    for (let i = 0; i < count * 3; i++) {
      if (chore.end_date && currentDate > new Date(chore.end_date)) {
        break;
      }
      
      candidateDates.push(new Date(currentDate));
      
      // Advance to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Apply each rule to filter the candidate dates
    for (const rule of rules) {
      candidateDates = await this.applyRule(rule, candidateDates, chore);
    }
    
    // Convert to occurrence objects
    const occurrences = candidateDates.slice(0, count).map(date => ({
      date,
      chore_id: chore.id,
      is_time_sensitive: chore.is_time_sensitive,
      time_of_day: chore.time_of_day
    }));
    
    return occurrences;
  }

  /**
   * Generate occurrences for custom schedules
   * @param {Object} chore - Chore object
   * @param {Array} rules - Array of rule objects
   * @param {number} count - Number of occurrences to generate
   * @returns {Array} - Array of occurrence objects
   */
  async generateCustomOccurrences(chore, rules, count) {
    // Custom schedules use the same mechanism as conditional, but with more complex rules
    return this.generateConditionalOccurrences(chore, rules, count);
  }

  /**
   * Apply a rule to filter candidate dates
   * @param {Object} rule - Rule object
   * @param {Array} candidateDates - Array of candidate dates
   * @param {Object} chore - Chore object
   * @returns {Array} - Filtered array of dates
   */
  async applyRule(rule, candidateDates, chore) {
    switch (rule.rule_type) {
      case 'DAY_OF_WEEK':
        return candidateDates.filter(date => {
          const allowedDays = rule.rule_value?.days || [];
          return allowedDays.includes(date.getDay());
        });
        
      case 'DAY_OF_MONTH':
        return candidateDates.filter(date => {
          const allowedDays = rule.rule_value?.days || [];
          return allowedDays.includes(date.getDate());
        });
        
      case 'LAST_OF_MONTH':
        return candidateDates.filter(date => {
          return this.isLastOfMonth(date, rule.rule_value);
        });
        
      case 'SCHOOL_DAY':
        // Fetch school day information from database or external source
        const schoolDays = await this.getSchoolDays();
        return candidateDates.filter(date => {
          const dateStr = this.formatDate(date);
          return schoolDays.includes(dateStr);
        });
        
      case 'WORKDAY':
        return candidateDates.filter(date => {
          // Default: Mon-Fri are work days
          const day = date.getDay();
          return day >= 1 && day <= 5; // Monday to Friday
        });
        
      case 'EXCLUDE_DAYS':
        return candidateDates.filter(date => {
          const excludedDays = rule.rule_value?.days || [];
          return !excludedDays.includes(date.getDay());
        });
        
      case 'INTERVAL':
        // Start from reference date and include every Nth day
        const refDate = rule.rule_value?.reference_date 
          ? new Date(rule.rule_value.reference_date) 
          : new Date(chore.start_date);
        const interval = rule.rule_value?.interval || 1;
        
        return candidateDates.filter(date => {
          const diffTime = Math.abs(date - refDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays % interval === 0;
        });
        
      default:
        return candidateDates;
    }
  }

  /**
   * Check if a date is the last of the month according to specified criteria
   * @param {Date} date - Date to check
   * @param {Object} config - Rule configuration
   * @returns {boolean} - Whether the date matches the criteria
   */
  isLastOfMonth(date, config) {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    // Check if it's the last day of the month
    if (config?.type === 'LAST_DAY') {
      return date.getDate() === lastDay;
    }
    
    // Check if it's the last working day of the month
    if (config?.type === 'LAST_WORKDAY') {
      // If it's the last day and it's a workday
      if (date.getDate() === lastDay) {
        const day = date.getDay();
        return day >= 1 && day <= 5; // Monday to Friday
      }
      
      // If it's not the last day, check if all subsequent days are weekends
      const dayOfMonth = date.getDate();
      for (let i = dayOfMonth + 1; i <= lastDay; i++) {
        const nextDate = new Date(date.getFullYear(), date.getMonth(), i);
        const day = nextDate.getDay();
        // If any subsequent day is a workday, this is not the last workday
        if (day >= 1 && day <= 5) {
          return false;
        }
      }
      
      // If we got here, all subsequent days are weekends, so this is the last workday
      const day = date.getDay();
      return day >= 1 && day <= 5; // Must also be a workday itself
    }
    
    return false;
  }

  /**
   * Get school days from database or calendar
   * @returns {Array} - Array of school day dates as strings (YYYY-MM-DD)
   */
  async getSchoolDays() {
    // This should be implemented to fetch school days from a database table or external calendar
    // For now, return an empty array
    return [];
  }

  /**
   * Apply exceptions to occurrences
   * @param {Array} occurrences - Array of occurrence objects
   * @param {Array} exceptions - Array of exception objects
   * @returns {Array} - Updated array of occurrence objects
   */
  applyExceptions(occurrences, exceptions) {
    return occurrences.map(occurrence => {
      // Find exception for this date
      const exception = exceptions.find(e => 
        this.isSameDay(new Date(e.exception_date), occurrence.date));
      
      if (exception) {
        if (exception.rescheduled_date) {
          // Reschedule to new date
          return { 
            ...occurrence, 
            original_date: new Date(occurrence.date),
            date: new Date(exception.rescheduled_date),
            is_rescheduled: true,
            reason: exception.reason
          };
        } else {
          // Mark as cancelled
          return { 
            ...occurrence, 
            is_cancelled: true,
            reason: exception.reason
          };
        }
      }
      
      return occurrence;
    });
  }

  /**
   * Check if two dates are the same day
   * @param {Date} date1 - First date
   * @param {Date} date2 - Second date
   * @returns {boolean} - Whether the dates are the same day
   */
  isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  /**
   * Format date as YYYY-MM-DD
   * @param {Date} date - Date to format
   * @returns {string} - Formatted date string
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Add a schedule rule for a chore
   * @param {string} choreId - UUID of the chore
   * @param {Object} rule - Rule object
   * @returns {Object} - Created rule
   */
  async addRule(choreId, rule) {
    const query = `
      INSERT INTO chore_schedule_rules 
      (chore_id, rule_type, rule_value, priority, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const values = [
      choreId,
      rule.rule_type,
      rule.rule_value,
      rule.priority || 1
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update a schedule rule
   * @param {string} ruleId - UUID of the rule
   * @param {Object} rule - Updated rule object
   * @returns {Object} - Updated rule
   */
  async updateRule(ruleId, rule) {
    const query = `
      UPDATE chore_schedule_rules
      SET rule_type = $1,
          rule_value = $2,
          priority = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    
    const values = [
      rule.rule_type,
      rule.rule_value,
      rule.priority || 1,
      ruleId
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a schedule rule
   * @param {string} ruleId - UUID of the rule
   * @returns {boolean} - Whether the deletion was successful
   */
  async deleteRule(ruleId) {
    const query = `
      DELETE FROM chore_schedule_rules
      WHERE id = $1
    `;
    
    await pool.query(query, [ruleId]);
    return true;
  }

  /**
   * Add a schedule exception for a chore
   * @param {string} choreId - UUID of the chore
   * @param {Object} exception - Exception object
   * @returns {Object} - Created exception
   */
  async addException(choreId, exception) {
    const query = `
      INSERT INTO chore_schedule_exceptions 
      (chore_id, exception_date, rescheduled_date, reason, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const values = [
      choreId,
      exception.exception_date,
      exception.rescheduled_date || null,
      exception.reason || null
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update a schedule exception
   * @param {string} exceptionId - UUID of the exception
   * @param {Object} exception - Updated exception object
   * @returns {Object} - Updated exception
   */
  async updateException(exceptionId, exception) {
    const query = `
      UPDATE chore_schedule_exceptions
      SET exception_date = $1,
          rescheduled_date = $2,
          reason = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    
    const values = [
      exception.exception_date,
      exception.rescheduled_date || null,
      exception.reason || null,
      exceptionId
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a schedule exception
   * @param {string} exceptionId - UUID of the exception
   * @returns {boolean} - Whether the deletion was successful
   */
  async deleteException(exceptionId) {
    const query = `
      DELETE FROM chore_schedule_exceptions
      WHERE id = $1
    `;
    
    await pool.query(query, [exceptionId]);
    return true;
  }

  /**
   * Create a schedule template
   * @param {Object} template - Template object
   * @returns {Object} - Created template
   */
  async createTemplate(template) {
    const query = `
      INSERT INTO schedule_templates 
      (name, description, schedule_type, schedule_config, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const values = [
      template.name,
      template.description || null,
      template.schedule_type,
      template.schedule_config
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get all schedule templates
   * @returns {Array} - Array of template objects
   */
  async getTemplates() {
    const query = `
      SELECT * FROM schedule_templates
      ORDER BY name
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Apply a schedule template to a chore
   * @param {string} choreId - UUID of the chore
   * @param {string} templateId - UUID of the template
   * @returns {Object} - Updated chore
   */
  async applyTemplate(choreId, templateId) {
    // Get the template
    const templateQuery = `
      SELECT * FROM schedule_templates
      WHERE id = $1
    `;
    
    const templateResult = await pool.query(templateQuery, [templateId]);
    const template = templateResult.rows[0];
    
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    
    // Update the chore with template settings
    const choreQuery = `
      UPDATE chores
      SET schedule_type = $1,
          recurrence_pattern = $2,
          interval_value = $3,
          weekdays = $4,
          month_days = $5,
          months = $6,
          is_time_sensitive = $7,
          time_of_day = $8,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
    
    const config = template.schedule_config;
    const values = [
      template.schedule_type,
      config.recurrence_pattern || null,
      config.interval_value || null,
      config.weekdays || null,
      config.month_days || null,
      config.months || null,
      config.is_time_sensitive || false,
      config.time_of_day || null,
      choreId
    ];
    
    const choreResult = await pool.query(choreQuery, values);
    const chore = choreResult.rows[0];
    
    // If template has rules, add them to the chore
    if (config.rules && Array.isArray(config.rules)) {
      // First, delete any existing rules
      await pool.query(`DELETE FROM chore_schedule_rules WHERE chore_id = $1`, [choreId]);
      
      // Then add the new rules from the template
      for (const rule of config.rules) {
        await this.addRule(choreId, rule);
      }
    }
    
    return chore;
  }

  /**
   * Get a list of chores that need to be scheduled today
   * @returns {Array} - Array of chores to schedule
   */
  async getChoresDueToday() {
    const today = new Date();
    const todayStr = this.formatDate(today);
    
    const query = `
      SELECT c.* FROM chores c
      WHERE c.next_occurrence::date = $1
      AND c.status = 'ACTIVE'
      ORDER BY c.name
    `;
    
    const result = await pool.query(query, [todayStr]);
    return result.rows;
  }

  /**
   * Get chores for a specific date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} - Array of chores with occurrence dates
   */
  async getChoresForDateRange(startDate, endDate) {
    const startStr = this.formatDate(startDate);
    const endStr = this.formatDate(endDate);
    
    // First, get all active chores
    const choresQuery = `
      SELECT * FROM chores
      WHERE status = 'ACTIVE'
    `;
    
    const choresResult = await pool.query(choresQuery);
    const chores = choresResult.rows;
    
    // For each chore, generate occurrences within the date range
    const results = [];
    
    for (const chore of chores) {
      // Generate occurrences for this chore
      const occurrences = await this.generateOccurrences(chore.id, 100); // Get enough occurrences
      
      // Filter to only include occurrences in the date range
      const filteredOccurrences = occurrences.filter(o => {
        const occurrenceDate = new Date(o.date);
        return occurrenceDate >= startDate && occurrenceDate <= endDate;
      });
      
      // If there are occurrences in this range, add to results
      if (filteredOccurrences.length > 0) {
        results.push({
          ...chore,
          occurrences: filteredOccurrences
        });
      }
    }
    
    return results;
  }
}

module.exports = new ScheduleService();

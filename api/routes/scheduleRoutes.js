/**
 * Chore Scheduling API Routes
 */
const express = require('express');
const router = express.Router();
const scheduleService = require('../services/scheduleService');

/**
 * Get chore schedule
 * GET /api/chores/:id/schedule
 */
router.get('/:id/schedule', async (req, res) => {
  try {
    const choreId = req.params.id;
    const count = req.query.count ? parseInt(req.query.count) : 10;
    
    const occurrences = await scheduleService.generateOccurrences(choreId, count);
    
    res.json({
      success: true,
      data: occurrences,
      count: occurrences.length,
      message: 'Schedule generated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating schedule:', error);
    res.status(500).json({
      success: false,
      message: `Error generating schedule: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Update chore schedule
 * PUT /api/chores/:id/schedule
 */
router.put('/:id/schedule', async (req, res) => {
  try {
    const choreId = req.params.id;
    const scheduleData = req.body;
    
    // Get chore from database
    const chore = await scheduleService.getChoreWithSchedule(choreId);
    if (!chore) {
      return res.status(404).json({
        success: false,
        message: `Chore with ID ${choreId} not found`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Update chore schedule in database
    const query = `
      UPDATE chores
      SET schedule_type = $1,
          recurrence_pattern = $2,
          interval_value = $3,
          weekdays = $4,
          month_days = $5,
          months = $6,
          start_date = $7,
          end_date = $8,
          time_of_day = $9,
          is_time_sensitive = $10,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `;
    
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    const values = [
      scheduleData.schedule_type || 'SIMPLE',
      scheduleData.recurrence_pattern || null,
      scheduleData.interval_value || null,
      scheduleData.weekdays || null,
      scheduleData.month_days || null,
      scheduleData.months || null,
      scheduleData.start_date || null,
      scheduleData.end_date || null,
      scheduleData.time_of_day || null,
      scheduleData.is_time_sensitive || false,
      choreId
    ];
    
    const result = await pool.query(query, values);
    const updatedChore = result.rows[0];
    
    // Generate new occurrences based on updated schedule
    const occurrences = await scheduleService.generateOccurrences(choreId, 10);
    
    res.json({
      success: true,
      data: {
        chore: updatedChore,
        occurrences
      },
      message: 'Schedule updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({
      success: false,
      message: `Error updating schedule: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get chore schedule rules
 * GET /api/chores/:id/schedule/rules
 */
router.get('/:id/schedule/rules', async (req, res) => {
  try {
    const choreId = req.params.id;
    const rules = await scheduleService.getChoreRules(choreId);
    
    res.json({
      success: true,
      data: rules,
      count: rules.length,
      message: 'Rules retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving rules:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving rules: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Add a schedule rule
 * POST /api/chores/:id/schedule/rules
 */
router.post('/:id/schedule/rules', async (req, res) => {
  try {
    const choreId = req.params.id;
    const rule = req.body;
    
    const newRule = await scheduleService.addRule(choreId, rule);
    
    res.status(201).json({
      success: true,
      data: newRule,
      message: 'Rule added successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding rule:', error);
    res.status(500).json({
      success: false,
      message: `Error adding rule: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Update a schedule rule
 * PUT /api/chores/:id/schedule/rules/:ruleId
 */
router.put('/:id/schedule/rules/:ruleId', async (req, res) => {
  try {
    const ruleId = req.params.ruleId;
    const rule = req.body;
    
    const updatedRule = await scheduleService.updateRule(ruleId, rule);
    
    if (!updatedRule) {
      return res.status(404).json({
        success: false,
        message: `Rule with ID ${ruleId} not found`,
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: updatedRule,
      message: 'Rule updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating rule:', error);
    res.status(500).json({
      success: false,
      message: `Error updating rule: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Delete a schedule rule
 * DELETE /api/chores/:id/schedule/rules/:ruleId
 */
router.delete('/:id/schedule/rules/:ruleId', async (req, res) => {
  try {
    const ruleId = req.params.ruleId;
    
    await scheduleService.deleteRule(ruleId);
    
    res.json({
      success: true,
      message: 'Rule deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting rule:', error);
    res.status(500).json({
      success: false,
      message: `Error deleting rule: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get chore schedule exceptions
 * GET /api/chores/:id/schedule/exceptions
 */
router.get('/:id/schedule/exceptions', async (req, res) => {
  try {
    const choreId = req.params.id;
    const exceptions = await scheduleService.getChoreExceptions(choreId);
    
    res.json({
      success: true,
      data: exceptions,
      count: exceptions.length,
      message: 'Exceptions retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving exceptions:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving exceptions: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Add a schedule exception
 * POST /api/chores/:id/schedule/exceptions
 */
router.post('/:id/schedule/exceptions', async (req, res) => {
  try {
    const choreId = req.params.id;
    const exception = req.body;
    
    const newException = await scheduleService.addException(choreId, exception);
    
    res.status(201).json({
      success: true,
      data: newException,
      message: 'Exception added successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding exception:', error);
    res.status(500).json({
      success: false,
      message: `Error adding exception: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Update a schedule exception
 * PUT /api/chores/:id/schedule/exceptions/:exceptionId
 */
router.put('/:id/schedule/exceptions/:exceptionId', async (req, res) => {
  try {
    const exceptionId = req.params.exceptionId;
    const exception = req.body;
    
    const updatedException = await scheduleService.updateException(exceptionId, exception);
    
    if (!updatedException) {
      return res.status(404).json({
        success: false,
        message: `Exception with ID ${exceptionId} not found`,
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: updatedException,
      message: 'Exception updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating exception:', error);
    res.status(500).json({
      success: false,
      message: `Error updating exception: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Delete a schedule exception
 * DELETE /api/chores/:id/schedule/exceptions/:exceptionId
 */
router.delete('/:id/schedule/exceptions/:exceptionId', async (req, res) => {
  try {
    const exceptionId = req.params.exceptionId;
    
    await scheduleService.deleteException(exceptionId);
    
    res.json({
      success: true,
      message: 'Exception deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting exception:', error);
    res.status(500).json({
      success: false,
      message: `Error deleting exception: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get chore schedule occurrences
 * GET /api/chores/:id/schedule/occurrences
 */
router.get('/:id/schedule/occurrences', async (req, res) => {
  try {
    const choreId = req.params.id;
    const count = req.query.count ? parseInt(req.query.count) : 10;
    
    const occurrences = await scheduleService.generateOccurrences(choreId, count);
    
    res.json({
      success: true,
      data: occurrences,
      count: occurrences.length,
      message: 'Occurrences generated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating occurrences:', error);
    res.status(500).json({
      success: false,
      message: `Error generating occurrences: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get schedule templates
 * GET /api/schedule/templates
 */
router.get('/templates', async (req, res) => {
  try {
    const templates = await scheduleService.getTemplates();
    
    res.json({
      success: true,
      data: templates,
      count: templates.length,
      message: 'Templates retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving templates:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving templates: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Create a schedule template
 * POST /api/schedule/templates
 */
router.post('/templates', async (req, res) => {
  try {
    const template = req.body;
    
    const newTemplate = await scheduleService.createTemplate(template);
    
    res.status(201).json({
      success: true,
      data: newTemplate,
      message: 'Template created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      message: `Error creating template: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Apply a schedule template to a chore
 * POST /api/chores/:id/schedule/apply-template/:templateId
 */
router.post('/:id/schedule/apply-template/:templateId', async (req, res) => {
  try {
    const choreId = req.params.id;
    const templateId = req.params.templateId;
    
    const updatedChore = await scheduleService.applyTemplate(choreId, templateId);
    
    // Generate occurrences based on the new schedule
    const occurrences = await scheduleService.generateOccurrences(choreId, 10);
    
    res.json({
      success: true,
      data: {
        chore: updatedChore,
        occurrences
      },
      message: 'Template applied successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error applying template:', error);
    res.status(500).json({
      success: false,
      message: `Error applying template: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get chores due today
 * GET /api/chores/due/today
 */
router.get('/due/today', async (req, res) => {
  try {
    const chores = await scheduleService.getChoresDueToday();
    
    res.json({
      success: true,
      data: chores,
      count: chores.length,
      message: 'Chores due today retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving chores due today:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving chores due today: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get chores for date range
 * GET /api/chores/due/range
 */
router.get('/due/range', async (req, res) => {
  try {
    // Default to one week if not specified
    const startDateStr = req.query.start_date || new Date().toISOString().split('T')[0];
    const endDateStr = req.query.end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    const chores = await scheduleService.getChoresForDateRange(startDate, endDate);
    
    res.json({
      success: true,
      data: chores,
      count: chores.length,
      message: 'Chores for date range retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving chores for date range:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving chores for date range: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

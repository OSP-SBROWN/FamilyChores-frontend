# Chore Scheduling System

## Overview

The Chore Scheduling System is a flexible and powerful system for managing recurring chores with complex scheduling rules. It supports various recurrence patterns, exceptions, and templates for easy reuse.

## Features

- **Flexible Schedule Types**:
  - One-time chores
  - Daily recurrence (every X days)
  - Weekly recurrence (specific days of the week)
  - Monthly recurrence (day of month, day of week, etc.)
  - Custom schedules with rule-based logic

- **Advanced Monthly Options**:
  - Specific day of month (e.g., 15th of each month)
  - Specific day of week in month (e.g., 3rd Tuesday)
  - Last day of month
  - Last weekday of month
  - First day of month

- **Rule-Based Scheduling**:
  - Include or exclude dates based on conditions
  - Support for weekdays, weekends, specific days
  - Priority-based rule application
  - Custom expression evaluation

- **Exception Handling**:
  - Skip specific occurrences
  - Reschedule occurrences to different dates
  - Change assignees for specific occurrences

- **Schedule Templates**:
  - Save and reuse common schedules
  - Apply templates to multiple chores
  - Includes schedule settings and rules

## Architecture

### Database Tables

- **Chore Table Extensions**:
  - Added schedule fields to the `chores` table
  - Includes schedule type, recurrence pattern, etc.

- **Schedule Rules**:
  - `chore_schedule_rules` table for custom rules
  - Supports include/exclude logic with priorities

- **Schedule Exceptions**:
  - `chore_schedule_exceptions` table for exceptions
  - Manages skips, reschedules, and assignee changes

- **Schedule Templates**:
  - `schedule_templates` table for reusable templates
  - Contains complete schedule configurations

### API Endpoints

#### Schedules

- `GET /api/chores/:id/schedule` - Get a chore's schedule
- `PUT /api/chores/:id/schedule` - Update a chore's schedule
- `GET /api/chores/:id/schedule/occurrences` - Generate future occurrences

#### Rules

- `GET /api/chores/:id/schedule/rules` - Get all rules for a chore
- `POST /api/chores/:id/schedule/rules` - Create a new rule
- `PUT /api/chores/:id/schedule/rules/:ruleId` - Update a rule
- `DELETE /api/chores/:id/schedule/rules/:ruleId` - Delete a rule

#### Exceptions

- `GET /api/chores/:id/schedule/exceptions` - Get all exceptions for a chore
- `POST /api/chores/:id/schedule/exceptions` - Create a new exception
- `PUT /api/chores/:id/schedule/exceptions/:exceptionId` - Update an exception
- `DELETE /api/chores/:id/schedule/exceptions/:exceptionId` - Delete an exception

#### Templates

- `GET /api/chores/schedule/templates` - Get all schedule templates
- `GET /api/chores/schedule/templates/:templateId` - Get a specific template
- `POST /api/chores/schedule/templates` - Create a new template
- `PUT /api/chores/schedule/templates/:templateId` - Update a template
- `DELETE /api/chores/schedule/templates/:templateId` - Delete a template
- `POST /api/chores/:id/schedule/apply-template` - Apply a template to a chore

## Frontend Components

The system includes React components for schedule management:

- `ScheduleBuilder`: Component for creating and editing schedules
- `SchedulePage`: Page for managing a chore's schedule

## Development

### Setup

1. Ensure the database schema is updated with the scheduling tables
2. Install dependencies: `npm install`
3. Create `.env.api` file with database connection details
4. Run the API: `npm run api:dev`
5. Run the frontend: `npm run dev`

### Docker Setup

1. Build and start the containers: `docker-compose up -d`
2. API will be available at http://localhost:3001
3. Frontend will be available at http://localhost:3000

## Examples

### Weekly Schedule

```json
{
  "scheduleType": "weekly",
  "startDate": "2023-07-01T00:00:00Z",
  "recurrenceInterval": 1,
  "daysOfWeek": [1, 3, 5] // Monday, Wednesday, Friday
}
```

### Monthly Schedule (15th of each month)

```json
{
  "scheduleType": "monthly",
  "startDate": "2023-07-01T00:00:00Z",
  "recurrenceInterval": 1,
  "monthlyRecurrenceType": "day_of_month",
  "dayOfMonth": 15
}
```

### Monthly Schedule (Last Friday of each month)

```json
{
  "scheduleType": "monthly",
  "startDate": "2023-07-01T00:00:00Z",
  "recurrenceInterval": 1,
  "monthlyRecurrenceType": "day_of_week",
  "weekOfMonth": -1,
  "dayOfWeek": 5
}
```

### Custom Rule (Exclude Holidays)

```json
{
  "name": "Exclude Holidays",
  "ruleType": "exclude",
  "priority": 10,
  "condition": {
    "type": "expression",
    "expression": "isHoliday === true"
  }
}
```

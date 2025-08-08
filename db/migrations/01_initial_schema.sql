-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS family_chores;

-- Connect to the database
\c family_chores;

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create timezones table
CREATE TABLE IF NOT EXISTS timezones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  offset VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  timezone_id UUID REFERENCES timezones(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create people table
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  timezone_id UUID REFERENCES timezones(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create day_types table (e.g., Weekday, Weekend, Holiday, School Day)
CREATE TABLE IF NOT EXISTS day_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create people_calendar_defaults table
CREATE TABLE IF NOT EXISTS people_calendar_defaults (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id),
  day_type_id UUID NOT NULL REFERENCES day_types(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(person_id, day_of_week)
);

-- Create calendar_overrides table
CREATE TABLE IF NOT EXISTS calendar_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id),
  day_type_id UUID NOT NULL REFERENCES day_types(id),
  override_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(person_id, override_date)
);

-- Create people_availability table
CREATE TABLE IF NOT EXISTS people_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id),
  day_type_id UUID NOT NULL REFERENCES day_types(id),
  availability INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(person_id, day_type_id)
);

-- Create chores table
CREATE TABLE IF NOT EXISTS chores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_minutes INTEGER,
  timezone_id UUID REFERENCES timezones(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chore_timezones table (many-to-many)
CREATE TABLE IF NOT EXISTS chore_timezones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chore_id UUID NOT NULL REFERENCES chores(id),
  timezone_id UUID NOT NULL REFERENCES timezones(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chore_id, timezone_id)
);

-- Create chore_person_abilities table (many-to-many with ability score)
CREATE TABLE IF NOT EXISTS chore_person_abilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chore_id UUID NOT NULL REFERENCES chores(id),
  person_id UUID NOT NULL REFERENCES people(id),
  ability_score INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chore_id, person_id)
);

-- Create chore_assignments table
CREATE TABLE IF NOT EXISTS chore_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chore_id UUID NOT NULL REFERENCES chores(id),
  person_id UUID REFERENCES people(id),
  assigned_date DATE NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL DEFAULT 'assigned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create workload_history table
CREATE TABLE IF NOT EXISTS workload_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id),
  week_starting DATE NOT NULL,
  total_minutes INTEGER NOT NULL DEFAULT 0,
  chore_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(person_id, week_starting)
);

-- Insert default timezones
INSERT INTO timezones (name, offset) VALUES
  ('UTC', '+00:00'),
  ('America/New_York', '-05:00'),
  ('America/Chicago', '-06:00'),
  ('America/Denver', '-07:00'),
  ('America/Los_Angeles', '-08:00'),
  ('Europe/London', '+00:00'),
  ('Europe/Paris', '+01:00'),
  ('Asia/Tokyo', '+09:00'),
  ('Australia/Sydney', '+10:00')
ON CONFLICT DO NOTHING;

-- Insert default day types
INSERT INTO day_types (name, color) VALUES
  ('Weekday', '#4CAF50'),
  ('Weekend', '#2196F3'),
  ('Holiday', '#F44336'),
  ('School Day', '#FF9800')
ON CONFLICT DO NOTHING;

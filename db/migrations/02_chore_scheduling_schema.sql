-- Alter chores table to add schedule fields
ALTER TABLE chores
ADD COLUMN IF NOT EXISTS schedule_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS recurrence_interval INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS days_of_week INTEGER[], -- Array of integers (0=Sunday, 1=Monday, etc.)
ADD COLUMN IF NOT EXISTS monthly_recurrence_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS day_of_month INTEGER,
ADD COLUMN IF NOT EXISTS week_of_month INTEGER,
ADD COLUMN IF NOT EXISTS day_of_week INTEGER,
ADD COLUMN IF NOT EXISTS schedule_description TEXT;

-- Create schedule rules table
CREATE TABLE IF NOT EXISTS chore_schedule_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chore_id UUID NOT NULL REFERENCES chores(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  rule_type VARCHAR(50) NOT NULL, -- 'include' or 'exclude'
  priority INTEGER DEFAULT 1,
  condition JSONB NOT NULL, -- JSON object with condition details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create schedule exceptions table
CREATE TABLE IF NOT EXISTS chore_schedule_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chore_id UUID NOT NULL REFERENCES chores(id) ON DELETE CASCADE,
  exception_type VARCHAR(50) NOT NULL, -- 'skip', 'reschedule', 'change_assignee'
  original_date DATE NOT NULL,
  new_date DATE,
  person_id UUID REFERENCES people(id),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chore_id, original_date)
);

-- Create schedule templates table
CREATE TABLE IF NOT EXISTS schedule_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  schedule_type VARCHAR(50) NOT NULL,
  recurrence_interval INTEGER DEFAULT 1,
  days_of_week INTEGER[],
  monthly_recurrence_type VARCHAR(50),
  day_of_month INTEGER,
  week_of_month INTEGER,
  day_of_week INTEGER,
  rules JSONB, -- Simplified rules in JSON format
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_chore_schedules_type ON chores(schedule_type);
CREATE INDEX IF NOT EXISTS idx_schedule_rules_chore_id ON chore_schedule_rules(chore_id);
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_chore_id ON chore_schedule_exceptions(chore_id);
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_original_date ON chore_schedule_exceptions(original_date);

-- Update chore_assignments table to add link to schedule exceptions
ALTER TABLE chore_assignments
ADD COLUMN IF NOT EXISTS exception_id UUID REFERENCES chore_schedule_exceptions(id);

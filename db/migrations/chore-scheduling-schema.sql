-- Chore Scheduling Framework - Database Schema Updates

-- Add new scheduling-related fields to chores table
ALTER TABLE chores 
ADD COLUMN schedule_type VARCHAR(50) NOT NULL DEFAULT 'SIMPLE', -- SIMPLE, RECURRING, CONDITIONAL, CUSTOM
ADD COLUMN recurrence_pattern VARCHAR(50) NULL, -- DAILY, WEEKLY, BIWEEKLY, MONTHLY, YEARLY
ADD COLUMN interval_value INTEGER NULL, -- For every X days/weeks/months
ADD COLUMN weekdays INTEGER[] NULL, -- Array of weekdays (0-6, where 0 is Sunday)
ADD COLUMN month_days INTEGER[] NULL, -- Array of days in month (1-31)
ADD COLUMN months INTEGER[] NULL, -- Array of months (1-12)
ADD COLUMN start_date DATE NULL, -- When the schedule starts
ADD COLUMN end_date DATE NULL, -- Optional end date
ADD COLUMN time_of_day TIME NULL, -- Optional specific time
ADD COLUMN is_time_sensitive BOOLEAN NOT NULL DEFAULT false, -- Must be done at specific time
ADD COLUMN last_occurrence DATE NULL, -- Last time the chore was scheduled
ADD COLUMN next_occurrence DATE NULL, -- Next time the chore should be scheduled
ADD COLUMN is_reward_based BOOLEAN NOT NULL DEFAULT false, -- If this chore has a reward
ADD COLUMN reward_amount NUMERIC(10, 2) NULL, -- Amount of reward if applicable
ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE'; -- ACTIVE, INACTIVE, DELETED

-- Create a new table for custom schedule rules
CREATE TABLE chore_schedule_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chore_id UUID NOT NULL REFERENCES chores(id) ON DELETE CASCADE,
    rule_type VARCHAR(50) NOT NULL, -- DAY_OF_WEEK, SCHOOL_DAY, WORKDAY, LAST_OF_MONTH, etc.
    rule_value JSONB NULL, -- Flexible JSON field for rule-specific parameters
    priority INTEGER NOT NULL DEFAULT 1, -- For rule precedence
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
);

-- Create a table for chore schedule exceptions
CREATE TABLE chore_schedule_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chore_id UUID NOT NULL REFERENCES chores(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    rescheduled_date DATE NULL, -- NULL means cancelled, otherwise rescheduled
    reason TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
);

-- Create a table for schedule templates that can be reused
CREATE TABLE schedule_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    schedule_type VARCHAR(50) NOT NULL,
    schedule_config JSONB NOT NULL, -- Store all schedule parameters
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_chore_schedule_rules_chore_id ON chore_schedule_rules(chore_id);
CREATE INDEX idx_chore_schedule_exceptions_chore_id ON chore_schedule_exceptions(chore_id);
CREATE INDEX idx_chore_next_occurrence ON chores(next_occurrence);
CREATE INDEX idx_chores_status ON chores(status);

-- Ensure all updated_at fields are properly set with triggers
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_chore_schedule_rules_timestamp
BEFORE UPDATE ON chore_schedule_rules
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_chore_schedule_exceptions_timestamp
BEFORE UPDATE ON chore_schedule_exceptions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_schedule_templates_timestamp
BEFORE UPDATE ON schedule_templates
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Make sure chores table has an updated_at trigger if it doesn't already
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_chores_timestamp') THEN
        CREATE TRIGGER update_chores_timestamp
        BEFORE UPDATE ON chores
        FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    END IF;
END $$;

/*
  # Add Employee ID and Update Schema

  1. Changes
    - Add employee_id field to both managers and employees tables
    - Add view_count to leave_requests for analytics
*/

-- Add employee_id to managers
ALTER TABLE managers
ADD COLUMN employee_id TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid();

-- Add employee_id to employees
ALTER TABLE employees
ADD COLUMN employee_id TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid();

-- Add view_count to leave_requests for analytics
ALTER TABLE leave_requests
ADD COLUMN view_count INTEGER DEFAULT 0;
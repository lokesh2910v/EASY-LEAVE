/*
  # Update Employee ID Field

  1. Changes
    - Modify employee_id field to be manually entered
    - Add check constraint for 7-digit format
    - Handle existing data by updating non-compliant IDs
*/

-- Function to generate a random 7-digit number
-- CREATE OR REPLACE FUNCTION generate_seven_digit_id() 
-- RETURNS text AS $$
-- BEGIN
--   RETURN LPAD(FLOOR(RANDOM() * 9000000 + 1000000)::text, 7, '0');
-- END;
-- $$ LANGUAGE plpgsql;

-- Update existing employee_id values in managers table that don't match the format
DO $$
DECLARE
  manager_record RECORD;
BEGIN
  FOR manager_record IN 
    SELECT id FROM managers 
    WHERE employee_id !~ '^[0-9]{7}$' OR employee_id IS NULL
  LOOP
    -- Keep generating until we find a unique ID
    WHILE TRUE LOOP
      DECLARE
        new_id text := generate_seven_digit_id();
      BEGIN
        UPDATE managers 
        SET employee_id = new_id 
        WHERE id = manager_record.id 
        AND NOT EXISTS (
          SELECT 1 FROM managers WHERE employee_id = new_id
          UNION
          SELECT 1 FROM employees WHERE employee_id = new_id
        );
        IF FOUND THEN
          EXIT;
        END IF;
      END;
    END LOOP;
  END LOOP;
END $$;

-- Update existing employee_id values in employees table that don't match the format
DO $$
DECLARE
  employee_record RECORD;
BEGIN
  FOR employee_record IN 
    SELECT id FROM employees 
    WHERE employee_id !~ '^[0-9]{7}$' OR employee_id IS NULL
  LOOP
    -- Keep generating until we find a unique ID
    WHILE TRUE LOOP
      DECLARE
        new_id text := generate_seven_digit_id();
      BEGIN
        UPDATE employees 
        SET employee_id = new_id 
        WHERE id = employee_record.id 
        AND NOT EXISTS (
          SELECT 1 FROM managers WHERE employee_id = new_id
          UNION
          SELECT 1 FROM employees WHERE employee_id = new_id
        );
        IF FOUND THEN
          EXIT;
        END IF;
      END;
    END LOOP;
  END LOOP;
END $$;

-- Update managers table
ALTER TABLE managers
ALTER COLUMN employee_id DROP DEFAULT,
ALTER COLUMN employee_id SET NOT NULL;

-- Update employees table
ALTER TABLE employees
ALTER COLUMN employee_id DROP DEFAULT,
ALTER COLUMN employee_id SET NOT NULL;

-- Add check constraints for 7-digit format
ALTER TABLE managers
ADD CONSTRAINT managers_employee_id_format CHECK (employee_id ~ '^[0-9]{7}$');

ALTER TABLE employees
ADD CONSTRAINT employees_employee_id_format CHECK (employee_id ~ '^[0-9]{7}$');

-- Drop the temporary function
-- DROP FUNCTION generate_seven_digit_id();
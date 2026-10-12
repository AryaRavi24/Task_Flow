-- Migration script: Add due_date column to tasks table
-- Run this query in your MySQL client if you already have the tasks table created.

ALTER TABLE tasks
ADD COLUMN due_date DATETIME NULL AFTER description;

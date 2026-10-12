-- Create database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS task_manager_db;
USE task_manager_db;

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  due_date DATETIME NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional: Sample initial tasks for testing
INSERT INTO tasks (title, description, due_date, is_completed) VALUES
  ('Welcome to your Task Manager', 'This is a sample task to verify your database connection is working.', DATE_ADD(NOW(), INTERVAL 2 DAY), FALSE),
  ('Explore the REST API', 'Test GET, POST, PUT, PATCH, and DELETE endpoints.', DATE_ADD(NOW(), INTERVAL 5 DAY), FALSE);

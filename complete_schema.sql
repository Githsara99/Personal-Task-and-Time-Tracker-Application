-- ============================================
-- TASK TRACKER - COMPLETE DATABASE SCHEMA
-- ============================================
-- This script creates all tables from scratch
-- Run this on a fresh MySQL installation
-- ============================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS task_tracker;
USE task_tracker;

-- ============================================
-- TABLE 1: USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 2: CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#6c63ff' COMMENT 'Hex color code for UI',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraint
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Unique constraint: user can't have duplicate category names
  UNIQUE KEY unique_category_per_user (user_id, name),
  
  -- Indexes for performance
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 3: TASKS
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'completed') DEFAULT 'pending',
  category_id INT DEFAULT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  tags TEXT COMMENT 'Comma-separated tags',
  due_date DATE DEFAULT NULL,
  total_time INT DEFAULT 0 COMMENT 'Total time tracked in seconds',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Indexes for query performance
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_category (category_id),
  INDEX idx_due_date (due_date),
  INDEX idx_created_at (created_at),
  INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 4: TIME_LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS time_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME DEFAULT NULL,
  duration INT DEFAULT NULL COMMENT 'Duration in seconds',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraint
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  
  -- Indexes for query performance
  INDEX idx_task_id (task_id),
  INDEX idx_start_time (start_time),
  INDEX idx_end_time (end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT CATEGORIES
-- ============================================
-- Note: This will insert default categories for all existing users
-- If running on a fresh database, these will be empty until users register

DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS insert_default_categories()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE user_id_var INT;
  DECLARE cur CURSOR FOR SELECT id FROM users;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur;

  read_loop: LOOP
    FETCH cur INTO user_id_var;
    IF done THEN
      LEAVE read_loop;
    END IF;

    -- Insert default categories for each user
    INSERT IGNORE INTO categories (user_id, name, color) VALUES
      (user_id_var, 'Work', '#2196f3'),
      (user_id_var, 'Personal', '#4caf50'),
      (user_id_var, 'Urgent', '#f44336');
  END LOOP;

  CLOSE cur;
END$$

DELIMITER ;

-- Run the procedure to insert default categories
CALL insert_default_categories();

-- Drop the procedure after use
DROP PROCEDURE IF EXISTS insert_default_categories;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Display all tables
SELECT '=== DATABASE TABLES ===' as '';
SHOW TABLES;

-- Display table structures
SELECT '=== USERS TABLE STRUCTURE ===' as '';
DESCRIBE users;

SELECT '=== CATEGORIES TABLE STRUCTURE ===' as '';
DESCRIBE categories;

SELECT '=== TASKS TABLE STRUCTURE ===' as '';
DESCRIBE tasks;

SELECT '=== TIME_LOGS TABLE STRUCTURE ===' as '';
DESCRIBE time_logs;

-- Display table relationships
SELECT '=== FOREIGN KEY RELATIONSHIPS ===' as '';
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    TABLE_SCHEMA = 'task_tracker'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Display indexes
SELECT '=== TABLE INDEXES ===' as '';
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    INDEX_TYPE
FROM
    INFORMATION_SCHEMA.STATISTICS
WHERE
    TABLE_SCHEMA = 'task_tracker'
ORDER BY
    TABLE_NAME, INDEX_NAME;

-- Success message
SELECT '========================================' as '';
SELECT '✅ Database schema created successfully!' as STATUS;
SELECT '========================================' as '';
SELECT 'Tables created: users, categories, tasks, time_logs' as TABLES;
SELECT 'Bonus features enabled: Categories, Tags, Priorities, Due Dates' as FEATURES;
SELECT '========================================' as '';

-- ============================================
-- OPTIONAL: INSERT SAMPLE DATA FOR TESTING
-- ============================================
-- Uncomment the section below to insert sample data

/*
-- Sample User (password is 'password123' hashed with bcrypt)
INSERT INTO users (email, password) VALUES
('demo@example.com', '$2b$10$rKvvlSKHvCxBvFj0p3mXLOxDdkU.HF7XxYKGKqM5jFPfYBm4yGWaG');

-- Get the user ID
SET @user_id = LAST_INSERT_ID();

-- Sample Categories
INSERT INTO categories (user_id, name, color) VALUES
(@user_id, 'Work', '#2196f3'),
(@user_id, 'Personal', '#4caf50'),
(@user_id, 'Health', '#ff9800');

-- Sample Tasks
INSERT INTO tasks (user_id, title, description, status, category_id, priority, tags, due_date, total_time) VALUES
(@user_id, 'Complete Project Report', 'Finish the Q4 project documentation', 'pending', 1, 'high', 'work,report,q4', '2025-02-20', 3600),
(@user_id, 'Grocery Shopping', 'Buy vegetables and fruits', 'pending', 2, 'medium', 'shopping,personal', '2025-02-15', 0),
(@user_id, 'Gym Workout', 'Cardio and strength training', 'completed', 3, 'low', 'health,exercise', NULL, 5400);

-- Sample Time Logs
INSERT INTO time_logs (task_id, start_time, end_time, duration) VALUES
(1, '2025-02-10 10:00:00', '2025-02-10 11:00:00', 3600),
(3, '2025-02-10 07:00:00', '2025-02-10 08:30:00', 5400);

SELECT 'Sample data inserted successfully!' as STATUS;
*/

-- ============================================
-- END OF SCHEMA
-- ============================================

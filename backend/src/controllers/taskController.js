import pool from '../config/db.js';

// Helper to normalize task object (e.g. ensure is_completed is a true boolean)
const formatTask = (task) => ({
  ...task,
  is_completed: Boolean(task.is_completed),
});

// 1. Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.status(200).json(rows.map(formatTask));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

// 2. Get single task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    }

    res.status(200).json(formatTask(rows[0]));
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
};

// 3. Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const trimmedTitle = title.trim();
    const taskDescription = description ? description.trim() : null;

    let taskDueDate = null;
    if (due_date) {
      const parsed = new Date(due_date);
      if (!isNaN(parsed.getTime())) {
        taskDueDate = parsed;
      }
    }

    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, due_date, is_completed) VALUES (?, ?, ?, FALSE)',
      [trimmedTitle, taskDescription, taskDueDate]
    );

    // Retrieve the newly created task to return full database row with timestamps
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

    res.status(201).json(formatTask(rows[0]));
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// 4. Update an existing task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, is_completed } = req.body;

    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    // Check if task exists first
    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    }

    const current = existing[0];
    const updatedTitle = title !== undefined ? title.trim() : current.title;
    const updatedDescription = description !== undefined ? (description ? description.trim() : null) : current.description;
    const updatedStatus = is_completed !== undefined ? Boolean(is_completed) : Boolean(current.is_completed);

    let updatedDueDate = current.due_date;
    if (due_date !== undefined) {
      if (due_date) {
        const parsed = new Date(due_date);
        updatedDueDate = !isNaN(parsed.getTime()) ? parsed : null;
      } else {
        updatedDueDate = null;
      }
    }

    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, due_date = ?, is_completed = ? WHERE id = ?',
      [updatedTitle, updatedDescription, updatedDueDate, updatedStatus, id]
    );

    const [updatedRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.status(200).json(formatTask(updatedRows[0]));
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

// 5. Toggle task completion status
export const toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists
    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    }

    const newStatus = !existing[0].is_completed;

    await pool.query('UPDATE tasks SET is_completed = ? WHERE id = ?', [newStatus, id]);

    const [updatedRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.status(200).json(formatTask(updatedRows[0]));
  } catch (error) {
    console.error('Error toggling task status:', error);
    res.status(500).json({ message: 'Failed to toggle task status', error: error.message });
  }
};

// 6. Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Task with id ${id} not found` });
    }

    res.status(200).json({ message: 'Task deleted successfully', id: Number(id) });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

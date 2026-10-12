// Base API URL:
// In production (e.g. Vercel), VITE_API_URL points to the hosted backend (e.g. https://your-backend.onrender.com)
// In local development, if VITE_API_URL is empty or undefined, it defaults to relative '/api' which Vite proxies to localhost:5000
const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const API_BASE = `${rawBaseUrl.replace(/\/$/, '')}/api/tasks`;

// Helper to handle API response and parse JSON or extract error message
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const api = {
  // 1. Get all tasks
  getAll: async () => {
    const res = await fetch(API_BASE);
    return handleResponse(res);
  },

  // 2. Get task by ID
  getById: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`);
    return handleResponse(res);
  },

  // 3. Create a new task
  create: async ({ title, description, due_date }) => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, due_date }),
    });
    return handleResponse(res);
  },

  // 4. Update an existing task
  update: async (id, { title, description, due_date, is_completed }) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, due_date, is_completed }),
    });
    return handleResponse(res);
  },

  // 5. Toggle completion status
  toggleStatus: async (id) => {
    const res = await fetch(`${API_BASE}/${id}/toggle`, {
      method: 'PATCH',
    });
    return handleResponse(res);
  },

  // 6. Delete a task
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
};

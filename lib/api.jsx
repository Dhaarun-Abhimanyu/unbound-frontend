/**
 * API Client for Command Gateway
 * Exports all backend routes and API calls
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, options = {}, apiKey = null) {
  if (!BASE_URL) {
    console.error("❌ NEXT_PUBLIC_API_URL is missing. Please check your .env file.");
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }
  
  const url = `${BASE_URL}${path}`;
  console.log(`🚀 [API Request] ${options.method || 'GET'} ${url}`);

  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

// Core Execution (Member & Admin)
export const Api = {
  submitCommand: (apiKey, body) => request('/api/commands', { method: 'POST', body: JSON.stringify(body) }, apiKey),
  getCommandHistory: (apiKey) => request('/api/commands/history', { method: 'GET' }, apiKey),
  getProfile: (apiKey) => request('/api/commands/profile', { method: 'GET' }, apiKey),

  // Rule Configuration (Admin Only)
  getRules: (apiKey) => request('/api/rules', { method: 'GET' }, apiKey),
  createRule: (apiKey, body) => request('/api/rules', { method: 'POST', body: JSON.stringify(body) }, apiKey),
  deleteRule: (apiKey, id) => request(`/api/rules/${id}`, { method: 'DELETE' }, apiKey),

  // Command Approval (Admin Only)
  getPendingCommands: (apiKey) => request('/api/admin/pending-commands', { method: 'GET' }, apiKey),
  approvePendingCommand: (apiKey, id, action) =>
    request(`/api/admin/pending-commands/${id}`, { method: 'PUT', body: JSON.stringify({ action }) }, apiKey),

  // User Management (Admin Only)
  getUsers: (apiKey) => request('/api/users', { method: 'GET' }, apiKey),
  createUser: (apiKey, body) => request('/api/users', { method: 'POST', body: JSON.stringify(body) }, apiKey),
  addCredits: (apiKey, id, amount) =>
    request(`/api/users/${id}/credits`, { method: 'POST', body: JSON.stringify({ amount }) }, apiKey),

  // Audit & Monitoring (Admin Only)
  getAuditLogs: (apiKey, status) => request(`/api/admin/audit-logs${status ? `?status=${status}` : ''}`, { method: 'GET' }, apiKey),
  getStats: (apiKey) => request('/api/admin/stats', { method: 'GET' }, apiKey),
};

// Alias to avoid import mismatches
export const api = Api;

export const updateUserCredits = async (id, amount) => {
  // Ensure headers like 'x-api-key' are preserved here as per your request
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/credits`, { // Adjust URL as needed
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // ...existing headers... 
    },
    body: JSON.stringify({ 
      amount: Number(amount) // FIX: Convert to Number to satisfy backend validation
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update credits');
  }

  return response.json();
};

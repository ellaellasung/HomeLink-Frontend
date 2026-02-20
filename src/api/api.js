const API_BASE_URL = 'http://localhost:4000/api'; // Change to your backend URL

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API error');
  }
  return data;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
};

// =========================
// Auth
// =========================
export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

// =========================
// Devices
// =========================
export async function getAllDevices() {
  const response = await fetch(`${API_BASE_URL}/devices`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function getDeviceById(id) {
  const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function createDevice({ name, type, config }) {
  const response = await fetch(`${API_BASE_URL}/devices`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, type, config }),
  });
  return handleResponse(response);
}

export async function updateDevice(id, { name, type, config }) {
  const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, type, config }),
  });
  return handleResponse(response);
}

export async function deleteDevice(id) {
  const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}
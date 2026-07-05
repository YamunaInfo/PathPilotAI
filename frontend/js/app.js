const API_BASE = window.location.protocol === 'file:' ? 'http://127.0.0.1:5000' : '';

function showLoader() {
  document.getElementById('loader')?.classList.add('show');
}

function hideLoader() {
  document.getElementById('loader')?.classList.remove('show');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function getToken() {
  return localStorage.getItem('pathpilot_token');
}

function isAuthenticated() {
  return Boolean(getToken());
}

function setAuthToken(token) {
  localStorage.setItem('pathpilot_token', token);
}

function clearAuth() {
  localStorage.removeItem('pathpilot_token');
  localStorage.removeItem('pathpilot_user');
}

function saveUser(user) {
  localStorage.setItem('pathpilot_user', JSON.stringify(user));
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('pathpilot_user') || '{}');
  } catch {
    return {};
  }
}

async function apiRequest(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (isAuthenticated()) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function redirectToDashboard() {
  if (window.location.pathname.includes('dashboard.html')) return;
  window.location.href = 'dashboard.html';
}

function ensureAuth() {
  const protectedPages = ['dashboard.html', 'process.html', 'chat.html', 'profile.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (protectedPages.includes(currentPage) && !isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

function initializeTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = toggle.querySelector('i');
    icon.className = document.body.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  ensureAuth();
  initializeTheme();
});

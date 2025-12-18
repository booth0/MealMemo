// /src/js/auth.js
// Complete authentication module

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

// ========== Token Management ==========

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ========== User Management ==========

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
}

// ========== Authentication Checks ==========

export function isAuthenticated() {
  return !!getToken();
}

export function hasRole(role) {
  const user = getUser();
  return user && user.role === role;
}

export function isAdmin() {
  return hasRole('admin');
}

export function isContributor() {
  const user = getUser();
  return user && (user.role === 'contributor' || user.role === 'admin');
}

// ========== Logout ==========

export function logout() {
  removeToken();
  removeUser();
  window.location.href = '/';
}

// ========== Route Protection ==========

export function requireAuth() {
  if (!isAuthenticated()) {
    const currentPath = window.location.pathname;
    window.location.href = `/login/index.html?redirect=${encodeURIComponent(currentPath)}`;
    return false;
  }
  return true;
}

export function requireRole(role) {
  if (!requireAuth()) return false;
  
  if (!hasRole(role)) {
    alert('You do not have permission to access this page');
    window.location.href = '/';
    return false;
  }
  
  return true;
}

export function requireContributor() {
  if (!requireAuth()) return false;
  
  if (!isContributor()) {
    alert('You need Contributor or Admin access to view this page');
    window.location.href = '/';
    return false;
  }
  return true;
}

export function requireAdmin() {
  if (!requireAuth()) return false;
  
  if (!isAdmin()) {
    alert('You need Admin access to view this page');
    window.location.href = '/';
    return false;
  }
  
  return true;
}
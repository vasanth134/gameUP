// Frontend logout utilities for GameUP
import { NavigateFunction } from 'react-router-dom';

/**
 * Simple logout function that clears storage and redirects to home
 */
export const logoutUser = (): void => {
  localStorage.removeItem('parent');
  localStorage.removeItem('child');
  localStorage.removeItem('role');
  localStorage.removeItem('token');
  window.location.href = '/'; // Redirect to home
};

/**
 * Logout function with navigation that redirects based on role
 */
export const logout = (navigate: NavigateFunction): void => {
  const role = localStorage.getItem('role');
  
  // Clear all auth data
  localStorage.clear();
  
  // Navigate based on previous role
  if (role === 'parent') {
    navigate('/auth/parent-login');
  } else if (role === 'child') {
    navigate('/auth/child-login');
  } else {
    navigate('/');
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const role = localStorage.getItem('role');
  const user = localStorage.getItem(role === 'parent' ? 'parent' : 'child');
  return !!(role && user);
};

/**
 * Get current user data
 */
export const getCurrentUser = (): any | null => {
  const role = localStorage.getItem('role');
  if (!role) return null;
  
  const userData = localStorage.getItem(role);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Get current user role
 */
export const getCurrentRole = (): string | null => {
  return localStorage.getItem('role');
};

// src/utils/auth.js
import { jwtDecode } from 'jwt-decode';

export function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    // decoded deve conter algo como { role: 'ADMIN', exp: 169xxx }
    if (Date.now() / 1000 > decoded.exp) {
      localStorage.removeItem('token'); // token expirou
      return null;
    }
    return decoded;
  } catch (e) {
    return null;
  }
}



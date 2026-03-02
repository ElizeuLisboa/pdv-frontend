// src/utils/authHelpers.js

// ✅ Verifica se usuário tem uma role específica
export function hasRole(usuario, rolesPermitidos = []) {
  if (!usuario || !usuario.role) return false;
  return rolesPermitidos.includes(usuario.role);
}

// ✅ Verifica se NÃO é admin/superuser
export function isBasicUser(usuario) {
  if (!usuario || !usuario.role) return true;
  return !["ADMIN", "SUPERUSER"].includes(usuario.role);
}

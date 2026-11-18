export const ADMIN_EMAIL = "admin@rkcontrol.com";
export const ADMIN_PASSWORD = "Admin@123";

const LOCAL_STORAGE_KEY = "rk-control-admin-auth";
const SESSION_STORAGE_KEY = "rk-control-admin-session";

export interface AdminSession {
  email: string;
  role: string;
  loggedInAt: string;
}

function readStorage(key: string, storage: Storage | undefined) {
  if (!storage) {
    return null;
  }

  const value = storage.getItem(key);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AdminSession;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function storeAdminSession() {
  if (typeof window === "undefined") {
    return;
  }

  const payload: AdminSession = {
    email: ADMIN_EMAIL,
    role: "Control Supervisor",
    loggedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
}

export function clearAdminSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getAdminSession() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    readStorage(SESSION_STORAGE_KEY, window.sessionStorage) ??
    readStorage(LOCAL_STORAGE_KEY, window.localStorage)
  );
}

export function isAdminAuthenticated() {
  return Boolean(getAdminSession());
}

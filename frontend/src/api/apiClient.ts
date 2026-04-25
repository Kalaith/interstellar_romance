import axios from 'axios';

// Determine the base URL from the environment or the deployed Vite base path.
const APP_BASE_URL = import.meta.env.BASE_URL || '/';
const DEFAULT_API_BASE_URL = APP_BASE_URL === '/' ? '' : APP_BASE_URL.replace(/\/$/, '');
const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

/**
 * Standardized Web Hatchery Axios Instance
 * Automatically handles Bearer tokens and 401 Unauthorized redirects.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  config => {
    // We intentionally interact directly with localStorage here to avoid
    // reactivity issues or circular dependencies when initializing Axios outside of React.
    try {
      const authStorageStr = localStorage.getItem('auth-storage');
      if (authStorageStr) {
        const authData = JSON.parse(authStorageStr);
        // Zustand persist wraps state in a `state` object.
        const token = authData?.state?.token;
        const isGuestToken = Boolean(authData?.state?.user?.is_guest || authData?.state?.isGuest);
        if (token && !isGuestToken) {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        }
      }

      const guestStorageStr = localStorage.getItem('interstellar-romance-guest-session');
      if (guestStorageStr) {
        const guestData = JSON.parse(guestStorageStr);
        if (guestData?.token) {
          config.headers.Authorization = `Bearer ${guestData.token}`;
          return config;
        }
      }

      if (authStorageStr) {
        const authData = JSON.parse(authStorageStr);
        const token = authData?.state?.token;
        const isGuestToken = Boolean(authData?.state?.user?.is_guest || authData?.state?.isGuest);
        if (token && isGuestToken) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn('Failed to parse auth token from local storage', error);
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401s and standardize errors
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Intercept 401 Unauthorized and redirect to central login
    if (error.response?.status === 401) {
      const loginUrl =
        error.response?.data?.login_url || import.meta.env.VITE_WEB_HATCHERY_LOGIN_URL;

      if (loginUrl) {
        try {
          const raw = localStorage.getItem('auth-storage');
          const parsed = raw ? JSON.parse(raw) : {};
          const state = parsed?.state ?? {};
          const next = {
            ...parsed,
            state: {
              ...state,
              loginUrl,
            },
          };
          localStorage.setItem('auth-storage', JSON.stringify(next));
          window.dispatchEvent(
            new CustomEvent('webhatchery:login-required', { detail: { loginUrl } })
          );
        } catch (storageError) {
          console.warn('Failed to persist login URL to auth storage', storageError);
        }
      }
    }
    return Promise.reject(error);
  }
);

import axios from 'axios';

/**
 * LegalLens API Client
 * - Proxied via Vite → http://localhost:5000/api
 * - Automatically attaches Bearer token from localStorage to headers
 * - Auto-redirects to /auth/signin on 401
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Attach Bearer Token ───────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 Session Expiry ─────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Unauthorized → clear token and redirect to sign in if not on auth page
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';

      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/auth')) {
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

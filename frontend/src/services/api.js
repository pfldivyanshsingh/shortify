import axios from 'axios';

/**
 * Get or create a persistent guest session ID stored in localStorage.
 * This ID is sent with every API request so the backend can associate
 * data with this browser session — no login required.
 */
const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach access token OR guest session ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Guest mode: send session ID so backend can identify this user
      config.headers['X-Session-ID'] = getOrCreateSessionId();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token refresh (only for logged-in users)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt token refresh if user has a refresh token (i.e., is logged in)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });

        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        // Refresh failed — clear tokens but DON'T redirect to login
        // User will simply continue in guest mode
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

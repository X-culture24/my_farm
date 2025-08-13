import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const newToken = await refreshAuthToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        handleAuthError();
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    handleApiError(error);
    return Promise.reject(error);
  }
);

// Utility functions
export const getAuthToken = (): string | null => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    }
  } catch (error) {
    console.error('Error parsing auth storage:', error);
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      parsed.state.token = token;
      localStorage.setItem('auth-storage', JSON.stringify(parsed));
    }
  } catch (error) {
    console.error('Error updating auth storage:', error);
  }
};

export const removeAuthToken = (): void => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      delete parsed.state.token;
      localStorage.setItem('auth-storage', JSON.stringify(parsed));
    }
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    
    if (response.data.success && response.data.data?.token) {
      const newToken = response.data.data.token;
      setAuthToken(newToken);
      return newToken;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  return null;
};

export const handleAuthError = (): void => {
  removeAuthToken();
  // Redirect to login page
  window.location.href = '/login';
};

export const handleApiError = (error: AxiosError): void => {
  let message = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data as any;
    
    switch (status) {
      case 400:
        message = data.message || 'Bad request';
        break;
      case 401:
        message = 'Unauthorized access';
        break;
      case 403:
        message = 'Access forbidden';
        break;
      case 404:
        message = 'Resource not found';
        break;
      case 422:
        message = data.message || 'Validation error';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Internal server error';
        break;
      case 502:
        message = 'Bad gateway';
        break;
      case 503:
        message = 'Service unavailable';
        break;
      default:
        message = data.message || `Error ${status}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    message = 'No response from server. Please check your connection.';
  } else {
    // Something else happened
    message = error.message || 'Network error';
  }
  
  // Show error toast
  toast.error(message);
};

// API response wrapper for consistent error handling
export const apiRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    // Error is already handled by interceptor
    throw error;
  }
};

// Retry mechanism for failed requests
export const apiRequestWithRetry = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  retries: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> => {
  try {
    return await apiRequest(requestFn);
  } catch (error) {
    if (retries > 0 && shouldRetry(error as AxiosError)) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return apiRequestWithRetry(requestFn, retries - 1);
    }
    throw error;
  }
};

const shouldRetry = (error: AxiosError): boolean => {
  // Retry on network errors or 5xx server errors
  return !error.response || (error.response.status >= 500 && error.response.status < 600);
};

export default apiClient;

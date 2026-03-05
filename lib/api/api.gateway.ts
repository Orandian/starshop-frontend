/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/types/api/api-response";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStore } from "@/store/useAuthStore";
import {
   logout,
  getToken,
} from "./auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
// const BASE_URL = "http://localhost:8080/api/v1";

/**
 * Custom error class for API requests
 * @param status - HTTP status code
 * @param data - Error data
 * @param message - Error message
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Axios instance for API requests with default configuration
 * @param baseURL - Base URL for API requests
 * @param timeout - Request timeout in milliseconds (default: 60 seconds)
 * @param headers - Request headers
 * @param withCredentials - Whether to send cookies/auth ( default: true)
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

/**
 * Request interceptor for auth tokens
 * @param config - Axios request configuration
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
apiClient.interceptors.request.use(
  async (config) => {
    const tokenValue = await getToken();
    if (tokenValue) config.headers.Authorization = `Bearer ${tokenValue}`;
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor for error handling
 * @param response - Axios response
 * @param error - Axios error
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      const message =
        (data as any)?.errors || (data as any)?.message || error.message;

      if (status === 401 || status === 403)
        if (typeof window !== "undefined") {
          logout();
          useUserStore.setState({ user: null, token: null });
          localStorage.clear(); 
           sessionStorage.clear();

          window.location.href = "/login";
        }

      return Promise.reject(new ApiError(message, status, data));
    }
    return Promise.reject(new ApiError(error.message || "An error occurred"));
  },
);

/**
 * Generic API request function
 * @template T - Request payload type
 * @template R - Response data type
 * @param config - Axios request configuration
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
export const apiRequest = async <T, R>(
  config: AxiosRequestConfig<T>,
): Promise<R> => {
  try {
    const response: AxiosResponse<R> = await apiClient.request<
      T,
      AxiosResponse<R>
    >(config);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
};

/**
 * Helper methods for common HTTP methods
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
export const api = {
  get: <R>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<never, ApiResponse<R>>({ ...config, method: "GET", url }),

  post: <T, R>(url: string, data?: T, config?: AxiosRequestConfig<T>) =>
    apiRequest<T, R>({ ...config, method: "POST", url, data }),

  put: <T, R>(url: string, data?: T, config?: AxiosRequestConfig<T>) =>
    apiRequest<T, R>({ ...config, method: "PUT", url, data }),

  delete: <R>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<never, R>({ ...config, method: "DELETE", url }),

  patch: <T, R>(url: string, data?: T, config?: AxiosRequestConfig<T>) =>
    apiRequest<T, R>({ ...config, method: "PATCH", url, data }),
};

/**
 * Example usage of the API client
 * @GET /users (example)
 * @POST /users (example)
 * @PUT /users (example)
 * @DELETE /users (example)
 * @PATCH /users (example)
 * @author Paing Sett Kyaw
 * @created 2025-11-06
 * @updated ****-**-**
 */
/*
//! GET request
const fetchUsers = async () => {
  try {
    return await api.get<User[]>('/users');
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

//! POST request
interface CreateUserData {
  name: string;
  email: string;
}

const createUser = async (userData: CreateUserData) => {
  try {
    return await api.post<CreateUserData, User>('/users', userData, {
      headers: { 'Custom-Header': 'value' }
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

//! PUT request
const updateUser = async (userId: string, userData: UpdateUserData) => {
  try {
    return await api.put<UpdateUserData, User>(`/users/${userId}`, userData);
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};

//! DELETE request
const deleteUser = async (userId: string) => {
  try {
    return await api.delete<User>(`/users/${userId}`);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

//! PATCH request
const updateUserPartial = async (userId: string, userData: Partial<UserData>) => {
  try {
    return await api.patch<UserData, User>(`/users/${userId}`, userData);
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};
*/

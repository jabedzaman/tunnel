import axios from "axios";
import { useAuthStore } from "~/store";

/**
 * @description Axios instance for making HTTP requests to the backend
 */
export const publicHttp = axios.create({
  baseURL: "http://localhost:8080/v1",
  withCredentials: true, // Send cookies with requests
});

// logout handler
const handleLogout = async () => {
  try {
    await axios.post(
      "http://localhost:8080/v1/auth/logout",
      {},
      { withCredentials: true }
    );
    // Clear the access token in the auth store
    useAuthStore.getState().setAccessToken(undefined);
    useAuthStore.getState().setUser(null);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// add request interceptor
publicHttp.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
publicHttp.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const is401 = error?.response?.status === 401;
    const isNotRefresh = !originalRequest.url.includes("/auth/refresh");

    if (is401 && isNotRefresh && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post<{ accessToken: string }>(
          "http://localhost:8080/v1/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        if (!newToken) {
          await handleLogout();
        } else {
          // update auth store and retry original request
          useAuthStore.getState().setAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return publicHttp(originalRequest);
      } catch (refreshError) {
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

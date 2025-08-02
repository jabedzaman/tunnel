import axios from "axios";
import { useAuthStore } from "~/store";

/**
 * @description Axios instance for making HTTP requests to the backend
 */
export const http = axios.create({
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
  } catch (error) {
    console.error("Error logging out:", error);
  } finally {
    // clear auth state from store
    const { setUser, setAccessToken } = useAuthStore.getState();
    setUser(null);
    setAccessToken(undefined);

    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
};

// add request interceptor
http.interceptors.request.use(
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
http.interceptors.response.use(
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
        if (!newToken)
          throw new Error("No token returned from refresh endpoint");

        // update auth store and retry original request
        useAuthStore.getState().setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return http(originalRequest);
      } catch (refreshError) {
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

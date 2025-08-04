import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8080/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

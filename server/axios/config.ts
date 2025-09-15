import axios from "axios";

// Create Axios instance with default configuration
export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth headers
apiClient.interceptors.request.use(
  (config) => {
    // Add any additional headers here if needed
    // For example, if you need to add auth tokens in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access");
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error(
        "Server error:",
        error.response?.data?.error || error.message
      );
    }

    return Promise.reject(error);
  }
);

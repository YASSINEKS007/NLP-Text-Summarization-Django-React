import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_HOST,
});

// Request interceptor for adding Authorization header
api.interceptors.request.use(
  (config) => {
    if (!config.url.includes("token/") && !config.url.includes("register/")) {
      const token = localStorage.getItem("accessToken");

      if (token) {
        console.log("Adding access token to headers for:", config.url);
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No access token found for:", config.url);
      }
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors and refreshing token
let isRefreshing = false;
let failedRequestsQueue = [];

const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedRequestsQueue = [];
};

api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.config.url);
    return response; // Pass through successful responses
  },
  async (error) => {
    const originalRequest = error.config;

    // Log the error for debugging purposes
    console.error("Response error:", error.response ? error.response.status : error.message);

    // Handle 401 errors
    if (error.response && error.response.status === 401) {
      console.warn("401 Unauthorized error for:", originalRequest.url);

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        isRefreshing = true; // Prevent multiple refresh attempts

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            console.warn("No refresh token available. Logging out user.");
            logoutUser();
            return Promise.reject(error);
          }

          console.log("Refreshing access token...");
          const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_HOST}/auth/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const newAccessToken = data.access;
          const newRefreshToken = data.refresh;

          console.log("Token refreshed successfully.");
          
          // Store new tokens
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Update Authorization header for the original request
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

          // Process any failed requests in the queue
          processQueue(null, newAccessToken);

          return api(originalRequest); // Retry the original request
        } catch (err) {
          console.error("Error refreshing token:", err.message);
          logoutUser();
          return Promise.reject(err);
        } finally {
          isRefreshing = false; // Reset the refresh flag
        }
      } else if (isRefreshing) {
        // If a refresh is in progress, queue the request
        console.log("Token refresh in progress, queuing request:", originalRequest.url);
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return api(originalRequest); // Retry the original request
        });
      }
    }

    return Promise.reject(error);
  }
);

const logoutUser = () => {
  console.log("Logging out user and redirecting to login page...");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login"; // Redirect to login
};

export default api;
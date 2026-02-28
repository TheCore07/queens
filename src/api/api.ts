import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for handling token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Avoid infinite loop if refresh itself fails or if it's already a retry
        if (
            error.response?.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url.includes('/auth/refresh') &&
            !originalRequest.url.includes('/auth/login')
        ) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                await axios.post('http://localhost:3000/auth/refresh', {}, { withCredentials: true });
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, the user needs to login again
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

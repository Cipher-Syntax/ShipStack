import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops if refresh fails
        if (
            error.response?.status === 401 &&
            originalRequest.url.includes("/login/refresh/")
        ) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${api.defaults.baseURL}/api/accounts/login/refresh/`,
                        {
                            refresh: refreshToken,
                        },
                    );

                    const newAccessToken = response.data.access;
                    localStorage.setItem("access_token", newAccessToken);

                    originalRequest.headers["Authorization"] =
                        `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/login";
                    return Promise.reject(err);
                }
            } else {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default api;

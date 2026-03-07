import axios from "axios"
import getCookie from "@/utils/get-cookie";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN"
});

api.interceptors.request.use((config) => {
    const token = getCookie("XSRF-TOKEN");

    if (token) {
        config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }
    return config;
});

export default api;
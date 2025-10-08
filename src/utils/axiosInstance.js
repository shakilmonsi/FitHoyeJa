import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://skywalker-api.mtscorporate.com/api/v1",
  // withCredentials: true, // enable only if your backend uses same-site cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Do NOT override Authorization if caller already set it (e.g., regToken for verify-otp)
    if (!config.headers) config.headers = {};
    const cookieToken = Cookies.get("token");
    if (cookieToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${cookieToken}`;
    }
    if (!config.headers.Accept) {
      config.headers.Accept = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: just log auth errors, do NOT clear token globally
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;
    if (status === 401 || status === 419) {
      console.warn(
        "[AXIOS] Auth error",
        status,
        "on",
        url,
        "→ token NOT cleared globally",
      );
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

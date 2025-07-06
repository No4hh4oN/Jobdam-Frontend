import axios from "axios";

const AxiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 필요 없는 요청
const publicUrls = [
  "/auth/login",
  "/auth/signup",
  "/auth/emailCode",
  "/auth/verifyNum",
];

AxiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const isPublic = publicUrls.some((url) => config.url?.startsWith(url));

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default AxiosClient;

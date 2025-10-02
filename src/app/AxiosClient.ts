import axios from "axios";

const AxiosClient = axios.create({
  baseURL: "http://218.49.229.112:9090",
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 필요 없는 요청
const publicUrls = [
  "/login",
  "/join/register",
  "/join/sendAuthEmail",
  "/join/chkUserId",
  "/join/authEmail"
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
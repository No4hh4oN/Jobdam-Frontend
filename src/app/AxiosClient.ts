import axios from "axios";

const AxiosClient = axios.create({
  baseURL: "https://sw2.gyoseung.me/",
});

// 토큰 필요 없는 요청
const publicUrls = [
  "/login",
  "/join/register",
  "/join/sendAuthEmail",
  "/join/sendChangeEmail",
  "/join/chgUserPassword",
  "/join/chkUserId",
  "/join/authEmail",
  "/scenario/random",
  // "/conversation/start",
  // "/gpt/ask",
  // "/conversation"
];

AxiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  const isPublic = publicUrls.some((url) => config.url?.startsWith(url));

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default AxiosClient;
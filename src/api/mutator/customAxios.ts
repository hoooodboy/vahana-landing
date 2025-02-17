import LocalStorage from "@/src/local-storage";
import tokens, { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN, setRefreshToken } from "@/src/tokens";
import { refreshToken } from "@/src/utils/tokenRefresh";
import Axios, { AxiosRequestConfig } from "axios";

const { VITE_APP_API_HOST } = import.meta.env;

export const axiosInstance = Axios.create({
  baseURL: VITE_APP_API_HOST,
  timeout: 15 * 1000,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = LocalStorage.get(KEY_ACCESS_TOKEN);
    const refreshToken = LocalStorage.get(KEY_REFRESH_TOKEN);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      config.headers.Refresh = `Bearer ${refreshToken}`;
    }
    console.log(config.headers, "config.headers");
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  async (response) => {
    const newAccessToken = response.headers["authorization"];
    const newRefreshToken = response.headers["refresh"];

    if (newAccessToken || newRefreshToken) {
      try {
        if (newAccessToken) {
          await tokens.setAccessToken(newAccessToken);
        }
        if (newRefreshToken) {
          await setRefreshToken(newRefreshToken);
          refreshToken(newAccessToken);
        }
        console.info("토큰이 갱신되었습니다.");
      } catch (err) {
        console.error("토큰 갱신 중 오류 발생", err);
      }
    }

    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.error("인증되지 않았습니다. - 401 STATUS");
      await setRefreshToken(""); // refresh token 제거
    }
    return Promise.reject(error);
  },
);

export const customAxios = <T>(config: AxiosRequestConfig): Promise<T> => {
  const beginAt = new Date().getTime();
  const method = config.method ?? "GET";
  const url = config.url;

  console.log(method, url);

  return axiosInstance({
    ...config,
  }).then((response) => {
    const endAt = new Date().getTime();
    const diff = (endAt - beginAt) / 1000;

    console.group("(", diff, ")", method, url);
    console.log("response", response);
    console.log("data", response.data);
    console.log("config", response.config);
    console.log("request", response.request);
    console.groupEnd();

    return response.data as T;
  });
};

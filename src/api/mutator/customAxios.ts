import Axios, { AxiosError, AxiosRequestConfig } from "axios";
// import { ApiResponse } from '../model';
import tokens, { setRefreshToken } from "@/src/tokens";
import { refreshToken } from "@/src/utils/tokenRefresh";
const { VITE_APP_API_HOST } = import.meta.env;

export const axiosInstance = Axios.create({
  baseURL: VITE_APP_API_HOST,
  // baseURL: 'http://localhost:4200',
  // baseURL: VITE_API_URL,
  timeout: 15 * 1000,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    if (tokens.accessToken) {
      config.headers.Authorization = `${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  async (response) => {
    // 응답 헤더에서 토큰 확인 (헤더 키는 소문자로 변환되어 있을 수 있음)
    const newAccessToken = response.headers["authorization"];
    const newRefreshToken = response.headers["refresh"];

    if (newAccessToken || newRefreshToken) {
      try {
        // 두 토큰 모두 존재하면 동시에 갱신
        if (newAccessToken && newRefreshToken) {
          await tokens.setTokens(newAccessToken, newRefreshToken);
        } else if (newAccessToken) {
          await tokens.setAccessToken(newAccessToken);
        } else if (newRefreshToken) {
          // refresh 로직입니다.
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
    // 401 에러 발생 시 토큰 갱신 또는 재인증 로직 실행

    if (error.response?.status === 401) {
      console.error("인증되지 않았습니다. - 401 STATUS");
      await setRefreshToken("");
    }
    return Promise.reject(error);
  }
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

export class unsecretError<T> extends AxiosError<T> {}

export interface ErrorType<Error> extends unsecretError<Error> {}

export type CustomErrorType = unsecretError<any>;

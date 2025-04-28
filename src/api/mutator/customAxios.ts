import LocalStorage from "@/src/local-storage";
import tokens, { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN } from "@/src/tokens";
import { refreshToken } from "@/src/utils/tokenRefresh";
import Axios, { AxiosRequestConfig } from "axios";

const { VITE_APP_API_HOST } = import.meta.env;

export const axiosInstance = Axios.create({
  baseURL: VITE_APP_API_HOST,
  timeout: 15 * 1000,
});

// 로그아웃 처리 함수
const handleLogout = () => {
  // 모든 토큰 제거
  tokens.clearTokens();

  // 로그인 페이지로 이동
  window.location.href = "/login";
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = tokens.accessToken;
    const refreshToken = tokens.refreshToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      config.headers.Refresh = `Bearer ${refreshToken}`;
    }
    console.log(config.headers, "config.headers");
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("RESPONSE", response);
    const newAccessToken = response.headers["authorization"];
    const newRefreshToken = response.headers["refresh"];

    if (newAccessToken || newRefreshToken) {
      try {
        if (newAccessToken) {
          const accessTokenValue = newAccessToken.split(" ")[1];
          tokens.setAccessToken(accessTokenValue);
        }
        if (newRefreshToken) {
          const refreshTokenValue = newRefreshToken.split(" ")[1];

          // 직접 localStorage에 저장 (tokens.setRefreshToken이 없을 경우)
          LocalStorage.set(KEY_REFRESH_TOKEN, refreshTokenValue);

          // tokens 모듈에 setRefreshToken이 있다면 사용
          if (typeof tokens["setRefreshToken"] === "function") {
            // @ts-ignore - 타입 오류 무시
            tokens.setRefreshToken(refreshTokenValue);
          }

          // 리프레시 토큰 업데이트
          if (newAccessToken) {
            refreshToken(newAccessToken.split(" ")[1]);
          }
        }
        console.info("토큰이 갱신되었습니다.");
      } catch (err) {
        console.error("토큰 갱신 중 오류 발생", err);
        // 토큰 갱신 중 오류가 발생한 경우에도 로그아웃 처리
        handleLogout();
      }
    }

    return response;
  },
  async (error) => {
    console.log("ERR", error);
    // 토큰 관련 에러 처리
    if (error.response?.status === 401) {
      console.error(
        "인증 오류 발생:",
        error.response?.data?.message || error.message
      );

      // 현재 가지고 있는 리프레시 토큰으로 갱신 시도
      try {
        const currentRefreshToken = tokens.refreshToken;
        if (currentRefreshToken) {
          // 리프레시 토큰으로 새 엑세스 토큰 요청 로직
          const refreshResponse = await axiosInstance.post("/auth/refresh", {
            refreshToken: currentRefreshToken,
          });

          if (refreshResponse.data?.accessToken) {
            tokens.setAccessToken(refreshResponse.data.accessToken);

            if (refreshResponse.data?.refreshToken) {
              // 리프레시 토큰도 갱신
              LocalStorage.set(
                KEY_REFRESH_TOKEN,
                refreshResponse.data.refreshToken
              );

              // tokens 모듈에 setRefreshToken이 있다면 사용
              if (typeof tokens["setRefreshToken"] === "function") {
                // @ts-ignore - 타입 오류 무시
                tokens.setRefreshToken(refreshResponse.data.refreshToken);
              }
            }

            // 원래 요청 재시도
            const originalRequest = error.config;
            return axiosInstance(originalRequest);
          } else {
            throw new Error("리프레시 토큰 갱신 실패");
          }
        } else {
          throw new Error("리프레시 토큰이 없음");
        }
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        handleLogout();
      }
    } else {
      return Promise.reject(error);
    }
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

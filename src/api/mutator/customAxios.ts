import LocalStorage from "@/src/local-storage";
import tokens, { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN } from "@/src/tokens";
import { setupTokenRefreshTimer } from "@/src/utils/tokenRefresh";
import Axios, { AxiosRequestConfig } from "axios";

const { VITE_APP_API_HOST } = import.meta.env;

export const axiosInstance = Axios.create({
  baseURL: VITE_APP_API_HOST,
  timeout: 15 * 1000,
  withCredentials: true, // 쿠키 포함
});

// 로그아웃 처리 함수
const handleLogout = () => {
  // 현재 경로 저장 (로그인 후 리다이렉트를 위해)
  const currentPath = window.location.pathname;
  if (currentPath !== "/login" && currentPath !== "/signup") {
    LocalStorage.set("redirectAfterLogin", currentPath);
  }

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

    // 토큰이 있을 경우에만 헤더에 추가
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      config.headers.Refresh = `Bearer ${refreshToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    // 헤더에 새 토큰이 있는지 확인
    const newAccessToken = response.headers["authorization"];
    const newRefreshToken = response.headers["refresh"];

    if (newAccessToken || newRefreshToken) {
      try {
        if (newAccessToken) {
          // "Bearer " 접두사 확인 및 제거
          const tokenValue = newAccessToken.startsWith("Bearer ")
            ? newAccessToken.split(" ")[1]
            : newAccessToken;

          tokens.setAccessToken(tokenValue);
        }

        if (newRefreshToken) {
          // "Bearer " 접두사 확인 및 제거
          const tokenValue = newRefreshToken.startsWith("Bearer ")
            ? newRefreshToken.split(" ")[1]
            : newRefreshToken;

          // tokens 모듈의 리프레시 토큰 설정 함수 확인
          if (typeof tokens.setRefreshToken === "function") {
            tokens.setRefreshToken(tokenValue);
          } else {
            // 직접 localStorage에 저장
            LocalStorage.set(KEY_REFRESH_TOKEN, tokenValue);
          }
        }

        // 토큰이 갱신되었다면 만료 타이머도 재설정
        if (newAccessToken) {
          setupTokenRefreshTimer();
        }
      } catch (err) {
        console.error("토큰 갱신 중 오류 발생", err);
      }
    }

    return response;
  },
  async (error) => {
    // 요청 설정 저장 (재시도를 위해)
    const originalRequest = error.config;

    // 401 에러(인증 실패) 처리
    if (error.response?.status === 401) {
      // 이미 재시도한 경우는 다시 시도하지 않음
      if (originalRequest._retry) {
        console.error("토큰 갱신 후에도 인증 실패, 로그아웃 처리");
        handleLogout();
        return Promise.reject(error);
      }

      // 리프레시 토큰이 있는지 확인
      const currentRefreshToken = tokens.refreshToken;
      if (!currentRefreshToken) {
        console.error("리프레시 토큰이 없어 인증 갱신 불가");
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // 재시도 플래그 설정
        originalRequest._retry = true;

        // 토큰 갱신 요청
        const response = await axiosInstance.post(
          "/auth/refresh",
          {
            refreshToken: currentRefreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: tokens.accessToken
                ? `Bearer ${tokens.accessToken}`
                : "",
              Refresh: `Bearer ${currentRefreshToken}`,
            },
          }
        );

        // 새 토큰 저장
        if (response.data?.accessToken) {
          tokens.setAccessToken(response.data.accessToken);

          if (response.data?.refreshToken) {
            if (typeof tokens.setRefreshToken === "function") {
              tokens.setRefreshToken(response.data.refreshToken);
            } else {
              LocalStorage.set(KEY_REFRESH_TOKEN, response.data.refreshToken);
            }
          }

          // 토큰 갱신 타이머 재설정
          setupTokenRefreshTimer();

          // 원래 요청 헤더 업데이트
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          if (response.data.refreshToken) {
            originalRequest.headers.Refresh = `Bearer ${response.data.refreshToken}`;
          }

          // 원래 요청 재시도
          return axiosInstance(originalRequest);
        } else {
          throw new Error("리프레시 토큰 응답에 새 액세스 토큰이 없습니다");
        }
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // 다른 에러는 그대로 전달
    return Promise.reject(error);
  }
);

export const customAxios = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance({
    ...config,
  }).then((response) => {
    return response.data as T;
  });
};

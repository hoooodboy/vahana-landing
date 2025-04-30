import LocalStorage from "@/src/local-storage";
import tokens, { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN } from "@/src/tokens";
import {
  setupTokenRefreshTimer,
  attemptTokenRefresh,
} from "@/src/utils/tokenRefresh";
import Axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const { VITE_APP_API_HOST } = import.meta.env;

// Axios 설정에 사용자 정의 속성을 추가하기 위한 타입 확장
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: number;
    _networkRetry?: number;
    _serverErrorRetry?: number;
  }
}

export const axiosInstance = Axios.create({
  baseURL: VITE_APP_API_HOST,
  timeout: 30 * 1000, // 타임아웃 증가 (15초 -> 30초)
  withCredentials: true, // 쿠키 포함
});

// 토큰 리프레시 중인지 추적
let isRefreshing = false;
// 토큰 리프레시 완료 후 재시도할 요청 큐
let refreshQueue: Array<(token: string) => void> = [];

// 큐에 있는 요청들을 새 토큰으로 재시도
const processQueue = (error: any, token: string | null = null) => {
  refreshQueue.forEach((callback) => {
    if (error) {
      // 갱신 실패 시 각 요청에 오류 전달
      // callback(Promise.reject(error));
    } else if (token) {
      // 갱신 성공 시 새 토큰으로 요청 재시도
      callback(token);
    }
  });

  // 큐 비우기
  refreshQueue = [];
};

// 로그아웃 처리 함수
const handleLogout = (reason: string = "세션 만료") => {
  // 이미 로그인 페이지인 경우 처리하지 않음
  if (
    window.location.pathname === "/login" ||
    window.location.pathname === "/signup"
  ) {
    return;
  }

  // 현재 경로 저장 (로그인 후 리다이렉트를 위해)
  const currentPath = window.location.pathname;
  LocalStorage.set("redirectAfterLogin", currentPath);

  // 모든 토큰 제거
  tokens.clearTokens();

  // 로그아웃 알림
  console.log(`로그아웃 처리: ${reason}`);

  // 경고 표시 (추가 기능)
  alert(`자동 로그아웃되었습니다. ${reason}`);

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
  (response: AxiosResponse) => {
    // 헤더에 새 토큰이 있는지 확인
    const newAccessToken =
      response.headers["authorization"] || response.headers["Authorization"];
    const newRefreshToken =
      response.headers["refresh"] || response.headers["Refresh"];

    if (newAccessToken || newRefreshToken) {
      try {
        if (newAccessToken) {
          // "Bearer " 접두사 확인 및 제거
          const tokenValue =
            typeof newAccessToken === "string" &&
            newAccessToken.startsWith("Bearer ")
              ? newAccessToken.split(" ")[1]
              : newAccessToken;

          tokens.setAccessToken(tokenValue);
          console.log("API 응답에서 새 액세스 토큰을 찾아 설정했습니다.");
        }

        if (newRefreshToken) {
          // "Bearer " 접두사 확인 및 제거
          const tokenValue =
            typeof newRefreshToken === "string" &&
            newRefreshToken.startsWith("Bearer ")
              ? newRefreshToken.split(" ")[1]
              : newRefreshToken;

          // tokens 모듈의 리프레시 토큰 설정 함수 확인
          if (typeof tokens.setRefreshToken === "function") {
            tokens.setRefreshToken(tokenValue);
          } else {
            // 직접 localStorage에 저장
            LocalStorage.set(KEY_REFRESH_TOKEN, tokenValue);
          }
          console.log("API 응답에서 새 리프레시 토큰을 찾아 설정했습니다.");
        }

        // 토큰이 갱신되었다면 만료 타이머도 재설정
        if (newAccessToken) {
          setupTokenRefreshTimer();
        }
      } catch (err) {
        console.error("응답에서 토큰 갱신 중 오류 발생", err);
      }
    }

    // 응답 데이터에 새 토큰이 있는지 확인 (백엔드 구현에 따라 다를 수 있음)
    if (
      response.data &&
      (response.data.accessToken || response.data.refreshToken)
    ) {
      try {
        if (response.data.accessToken) {
          tokens.setAccessToken(response.data.accessToken);
          console.log(
            "API 응답 데이터에서 새 액세스 토큰을 찾아 설정했습니다."
          );
        }

        if (response.data.refreshToken) {
          if (typeof tokens.setRefreshToken === "function") {
            tokens.setRefreshToken(response.data.refreshToken);
          } else {
            LocalStorage.set(KEY_REFRESH_TOKEN, response.data.refreshToken);
          }
          console.log(
            "API 응답 데이터에서 새 리프레시 토큰을 찾아 설정했습니다."
          );
        }

        // 토큰이 갱신되었다면 만료 타이머도 재설정
        if (response.data.accessToken) {
          setupTokenRefreshTimer();
        }
      } catch (err) {
        console.error("응답 데이터에서 토큰 갱신 중 오류 발생", err);
      }
    }

    return response;
  },
  async (error: AxiosError) => {
    // 요청 설정 저장 (재시도를 위해)
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 401 에러(인증 실패) 처리
    if (error.response?.status === 401) {
      // URL이 이미 refresh 엔드포인트인 경우 무한 루프 방지
      if (originalRequest.url?.includes("/auth/refresh")) {
        console.error("리프레시 토큰 요청이 실패했습니다. 로그아웃 처리.");
        handleLogout("리프레시 토큰이 만료되었습니다.");
        return Promise.reject(error);
      }

      // 이미 재시도 최대 횟수를 초과한 경우
      if (originalRequest._retry >= 2) {
        console.error("토큰 갱신 후에도 인증 실패, 로그아웃 처리");
        handleLogout("인증을 여러 번 시도했으나 실패했습니다.");
        return Promise.reject(error);
      }

      // 재시도 카운터 초기화
      if (originalRequest._retry === undefined) {
        originalRequest._retry = 0;
      } else {
        originalRequest._retry++;
      }

      // 리프레시 토큰이 있는지 확인
      const currentRefreshToken = tokens.refreshToken;
      if (!currentRefreshToken) {
        console.error("리프레시 토큰이 없어 인증 갱신 불가");
        handleLogout("인증 정보가 없습니다.");
        return Promise.reject(error);
      }

      // 이미 리프레시 중인 경우, 큐에 추가하고 완료될 때까지 대기
      if (isRefreshing) {
        console.log("토큰 갱신 중... 요청을 큐에 추가합니다.");
        return new Promise((resolve, reject) => {
          refreshQueue.push((token: any) => {
            if (typeof token === "string") {
              // 토큰 갱신 성공 시 원래 요청 재시도
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            } else {
              // 토큰 갱신 실패 시 오류 반환
              reject(token);
            }
          });
        });
      }

      // 리프레시 상태 설정
      isRefreshing = true;

      try {
        console.log("액세스 토큰 갱신 시도 중...");

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
          const newToken = response.data.accessToken;
          tokens.setAccessToken(newToken);

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
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          if (response.data.refreshToken) {
            originalRequest.headers.Refresh = `Bearer ${response.data.refreshToken}`;
          }

          // 큐에 있는 요청들 처리
          processQueue(null, newToken);

          // 리프레시 상태 초기화
          isRefreshing = false;

          // 원래 요청 재시도
          return axiosInstance(originalRequest);
        } else {
          const refreshError = new Error(
            "리프레시 토큰 응답에 새 액세스 토큰이 없습니다"
          );
          processQueue(refreshError);
          isRefreshing = false;
          throw refreshError;
        }
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);

        // 큐에 있는 요청들에 에러 전달
        processQueue(refreshError);

        // 리프레시 상태 초기화
        isRefreshing = false;

        // 새로운 시도: 직접 토큰 갱신 함수 호출
        try {
          await attemptTokenRefresh(0);

          // 갱신 성공 시 원래 요청 재시도
          const newToken = tokens.accessToken;
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (attemptError) {
          console.error("추가 토큰 갱신 시도 실패:", attemptError);
        }

        // 모든 시도 실패 시 로그아웃
        handleLogout("인증 갱신에 실패했습니다.");
        return Promise.reject(refreshError);
      }
    }

    // 네트워크 오류 처리 (서버 연결 문제)
    if (
      !error.response &&
      error.message &&
      (error.message.includes("timeout") ||
        error.message.includes("Network Error") ||
        error.message.includes("network"))
    ) {
      console.error("네트워크 오류:", error.message);

      // 재시도 횟수가 있으면 증가, 없으면 초기화
      if (!originalRequest._networkRetry) {
        originalRequest._networkRetry = 1;
      } else if (originalRequest._networkRetry < 2) {
        // 최대 2번 재시도
        originalRequest._networkRetry++;
      } else {
        return Promise.reject(error);
      }

      // 지수 백오프로 재시도 (1초, 2초, 4초...)
      const delay = Math.pow(2, originalRequest._networkRetry - 1) * 1000;
      console.log(
        `네트워크 오류로 ${delay}ms 후 재시도 (${originalRequest._networkRetry}/2)...`
      );

      return new Promise((resolve) => {
        setTimeout(() => resolve(axiosInstance(originalRequest)), delay);
      });
    }

    // 서버 오류(500번대) 처리
    if (error.response?.status >= 500 && error.response?.status < 600) {
      // 재시도 횟수가 있으면 증가, 없으면 초기화
      if (!originalRequest._serverErrorRetry) {
        originalRequest._serverErrorRetry = 1;
      } else if (originalRequest._serverErrorRetry < 2) {
        // 최대 2번 재시도
        originalRequest._serverErrorRetry++;
      } else {
        return Promise.reject(error);
      }

      // 지수 백오프로 재시도
      const delay = Math.pow(2, originalRequest._serverErrorRetry - 1) * 1000;
      console.log(
        `서버 오류(${error.response.status})로 ${delay}ms 후 재시도 (${originalRequest._serverErrorRetry}/2)...`
      );

      return new Promise((resolve) => {
        setTimeout(() => resolve(axiosInstance(originalRequest)), delay);
      });
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

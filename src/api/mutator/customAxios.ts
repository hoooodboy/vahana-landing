import LocalStorage from "@/src/local-storage";
import tokens, { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN, setRefreshToken } from "@/src/tokens";
import { refreshToken } from "@/src/utils/tokenRefresh";
import Axios, { AxiosRequestConfig } from "axios";

const { VITE_APP_API_HOST } = import.meta.env;

export const axiosInstance = Axios.create({
  baseURL: VITE_APP_API_HOST,
  timeout: 15 * 1000,
});

// 로그아웃 처리 함수
const handleLogout = async () => {
  // 모든 토큰 제거
  await tokens.setAccessToken("");
  await setRefreshToken("");

  // 로컬 스토리지에서 사용자 관련 정보 제거
  LocalStorage.remove(KEY_ACCESS_TOKEN);
  LocalStorage.remove(KEY_REFRESH_TOKEN);

  // 로그인 페이지로 이동
  window.location.href = "/login";
};

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
    console.log("RESPONSE", response);
    const newAccessToken = response.headers["authorization"];
    const newRefreshToken = response.headers["refresh"];

    if (newAccessToken || newRefreshToken) {
      try {
        if (newAccessToken) {
          await tokens.setAccessToken(newAccessToken.split(" ")[1]);
        }
        if (newRefreshToken) {
          await setRefreshToken(newRefreshToken.split(" ")[1]);
          refreshToken(newAccessToken.split(" ")[1]);
        }
        console.info("토큰이 갱신되었습니다.");
      } catch (err) {
        console.error("토큰 갱신 중 오류 발생", err);
        // 토큰 갱신 중 오류가 발생한 경우에도 로그아웃 처리
        await handleLogout();
      }
    }

    return response;
  },
  async (error) => {
    console.log("ERR", error);
    // 토큰 관련 에러 처리
    // 401 Unauthorized: 액세스 토큰이 유효하지 않거나 만료됨
    // 403 Forbidden: 권한 없음 (리프레시 토큰 문제일 수 있음)
    // if (
    //   error.response?.status === 401 ||
    //   error.response?.status === 403 ||
    //   error.response?.data?.message?.includes("token") ||
    //   error.response?.data?.message?.includes("Token") ||
    //   error.response?.data?.message?.includes("refresh")
    // ) {
    //   console.error("인증 오류 발생:", error.response?.data?.message || error.message);

    //   // 리프레시 토큰 관련 에러인 경우 로그아웃 처리
    //   if (error.response?.data?.message?.includes("refresh") || error.response?.data?.message?.includes("Refresh") || error.response?.status === 403) {
    //     console.error("리프레시 토큰 오류로 로그아웃 처리합니다.");
    //     await handleLogout();
    //   } else if (error.response?.status === 401) {
    //     // 401 에러는 일단 리프레시 토큰만 제거
    //     console.error("인증되지 않았습니다. - 401 STATUS");
    //     await setRefreshToken("");
    //   }
    // }
    if (error.response.status === 401) {
      // 로컬 스토리지에서 사용자 관련 정보 제거
      LocalStorage.remove(KEY_ACCESS_TOKEN);
      LocalStorage.remove(KEY_REFRESH_TOKEN);

      // 로그인 페이지로 이동
      // return (window.location.href = "/login");
    } else {
      return Promise.reject(error);
    }
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

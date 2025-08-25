import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { refreshSubscribeToken } from "./subscribeAuth";

// 구독 서비스용 API 클라이언트
class SubscribeApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: Array<(token: string) => void> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://alpha.vahana.kr",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 요청 인터셉터
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("subscribeAccessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        if (!originalRequest) {
          return Promise.reject(error);
        }

        // 401 에러(토큰 만료) 처리
        if (error.response?.status === 401) {
          // 이미 리프레시 중인 경우, 큐에 추가
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.refreshQueue.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem("subscribeRefreshToken");
            if (!refreshToken) {
              throw new Error("리프레시 토큰이 없습니다.");
            }

            console.log("🔄 구독 서비스 토큰 자동 리프레시 시도...");

            const response = await refreshSubscribeToken(refreshToken);

            if (response.token) {
              // 새 토큰 저장
              localStorage.setItem(
                "subscribeAccessToken",
                response.token.access_token
              );
              localStorage.setItem(
                "subscribeRefreshToken",
                response.token.refresh_token
              );

              // 만료 시간 설정
              const expiryTime =
                Math.floor(Date.now() / 1000) + response.token.expires_in;
              localStorage.setItem(
                "subscribeTokenExpiry",
                expiryTime.toString()
              );

              console.log("✅ 구독 서비스 토큰 리프레시 성공");

              // 큐에 있는 요청들 처리
              this.refreshQueue.forEach((callback) =>
                callback(response.token.access_token)
              );
              this.refreshQueue = [];

              // 원래 요청 재시도
              originalRequest.headers.Authorization = `Bearer ${response.token.access_token}`;
              return this.axiosInstance(originalRequest);
            } else {
              throw new Error("토큰 리프레시 응답에 토큰이 없습니다.");
            }
          } catch (refreshError) {
            console.error("❌ 구독 서비스 토큰 리프레시 실패:", refreshError);

            // 큐에 있는 요청들에 에러 전달
            this.refreshQueue.forEach((callback) => callback(""));
            this.refreshQueue = [];

            // 로그아웃 처리
            this.handleLogout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private handleLogout() {
    // 구독 서비스 토큰들 삭제
    localStorage.removeItem("subscribeAccessToken");
    localStorage.removeItem("subscribeRefreshToken");
    localStorage.removeItem("subscribeTokenExpiry");
    localStorage.removeItem("subscribeIdentityVerified");

    // 자동 리다이렉트 제거 - 사용자가 직접 로그인 페이지로 이동하도록 함
    console.log("로그인이 만료되었습니다. 다시 로그인해주세요.");
  }

  // GET 요청
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  // POST 요청
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  // PUT 요청
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  // DELETE 요청
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // PATCH 요청
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }
}

// 싱글톤 인스턴스 생성
export const subscribeApiClient = new SubscribeApiClient();

// 편의 함수들
export const subscribeApi = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    subscribeApiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    subscribeApiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    subscribeApiClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    subscribeApiClient.delete<T>(url, config),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    subscribeApiClient.patch<T>(url, data, config),
};

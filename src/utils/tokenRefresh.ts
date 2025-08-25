import { refreshSubscribeToken } from "@/src/api/subscribeAuth";

// 토큰 만료 시간을 확인하는 함수 (여유 시간 포함)
export const isTokenExpiringSoon = (
  expiresIn: number,
  bufferMinutes: number = 5
): boolean => {
  const now = Math.floor(Date.now() / 1000);
  const expirationTime = expiresIn;
  const bufferTime = bufferMinutes * 60; // 5분을 초로 변환

  return expirationTime - now <= bufferTime;
};

// 토큰 자동 갱신 함수
export const refreshTokenIfNeeded = async (): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem("subscribeAccessToken");
    const refreshToken = localStorage.getItem("subscribeRefreshToken");
    const tokenExpiry = localStorage.getItem("subscribeTokenExpiry");

    if (!accessToken || !refreshToken) {
      return false;
    }

    // 토큰 만료 시간이 없으면 현재 시간 + 24시간으로 설정 (기본값)
    let expiryTime = tokenExpiry
      ? parseInt(tokenExpiry)
      : Math.floor(Date.now() / 1000) + 86400;

    // 토큰이 곧 만료되는지 확인 (5분 여유)
    if (isTokenExpiringSoon(expiryTime, 5)) {
      console.log("토큰이 곧 만료됩니다. 갱신을 시도합니다...");

      const response = await refreshSubscribeToken(refreshToken);

      if (response.token) {
        // 새로운 토큰 저장
        localStorage.setItem(
          "subscribeAccessToken",
          response.token.access_token
        );
        localStorage.setItem(
          "subscribeRefreshToken",
          response.token.refresh_token
        );

        // 만료 시간 계산 및 저장 (현재 시간 + expires_in)
        const newExpiryTime =
          Math.floor(Date.now() / 1000) + response.token.expires_in;
        localStorage.setItem("subscribeTokenExpiry", newExpiryTime.toString());

        console.log("토큰이 성공적으로 갱신되었습니다.");
        return true;
      }
    }

    return true; // 토큰이 아직 유효함
  } catch (error) {
    console.error("토큰 갱신 실패:", error);

    // 토큰 갱신 실패 시 로그아웃 처리
    localStorage.removeItem("subscribeAccessToken");
    localStorage.removeItem("subscribeRefreshToken");
    localStorage.removeItem("subscribeTokenExpiry");

    // 로그인 페이지로 리다이렉트
    if (
      window.location.pathname.includes("/subscribe") &&
      !window.location.pathname.includes("/login")
    ) {
      window.location.href = "/subscribe/login";
    }

    return false;
  }
};

// 토큰 저장 함수 (로그인 시 사용)
export const saveTokens = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) => {
  localStorage.setItem("subscribeAccessToken", accessToken);
  localStorage.setItem("subscribeRefreshToken", refreshToken);

  // 만료 시간 계산 및 저장
  const expiryTime = Math.floor(Date.now() / 1000) + expiresIn;
  localStorage.setItem("subscribeTokenExpiry", expiryTime.toString());
};

// 주기적 토큰 갱신 설정 (API 호출 시 자동 리프레시로 대체)
export const setupTokenRefresh = () => {
  console.log("🔄 API 호출 시 자동 토큰 리프레시 설정 완료");
  // 주기적 체크 대신 API 호출 시 자동으로 토큰 리프레시 처리
  return null;
};

// 기존 코드와의 호환성을 위한 함수들
export const setupTokenRefreshTimer = () => {
  return setupTokenRefresh();
};

export const attemptTokenRefresh = async (retryCount: number = 0) => {
  return await refreshTokenIfNeeded();
};

// URL 파라미터에서 토큰 처리하는 함수 (기존 코드 호환성)
export const handleAccessToken = () => {
  // 구독 서비스에서는 URL 파라미터로 토큰을 받지 않으므로 빈 함수로 구현
  console.log(
    "handleAccessToken called - not implemented for subscribe service"
  );
};

// window에 토큰 타이머 프로퍼티 타입 추가
declare global {
  interface Window {
    tokenRefreshTimer: ReturnType<typeof setTimeout> | undefined;
  }
}

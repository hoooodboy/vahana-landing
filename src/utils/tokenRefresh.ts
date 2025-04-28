import LocalStorage from "../local-storage";
import tokens from "../tokens";
import isNullOrUndefined from "../utils/isNullOrUndefined";

// refreshToken 함수 수정 - 문자열 매개변수 받도록 변경
export function refreshToken(accessToken: string | null) {
  const loginMethod = LocalStorage.get("loginMethod");

  if (isNullOrUndefined(accessToken)) {
    console.error("액세스 토큰이 제공되지 않았습니다.");
    return;
  }

  if (loginMethod === "google") {
    location.href = `${getAPIHost()}/auth/google`;
    return;
  }

  if (loginMethod === "kakao") {
    location.href = `${getAPIHost()}/auth/kakao`;
    return;
  }

  if (loginMethod === "test") {
    location.href = `${getAPIHost()}/auth/admin`;
    return;
  }

  // 자동으로 토큰 만료 확인 및 갱신 타이머 설정
  setupTokenRefreshTimer();
}

// 토큰 만료 타이머 설정
export function setupTokenRefreshTimer() {
  // 기존 타이머가 있다면 제거
  if (window.tokenRefreshTimer) {
    clearTimeout(window.tokenRefreshTimer);
  }

  const accessTokenExpired = tokens.accessTokenExpired;
  if (!accessTokenExpired) return;

  // 현재 시간과 만료 시간의 차이 계산
  const now = Date.now();
  const timeToExpire = accessTokenExpired - now;

  // 만료 5분 전에 갱신 시도
  const refreshOffset = 5 * 60 * 1000; // 5분
  const timeToRefresh = Math.max(0, timeToExpire - refreshOffset);

  if (timeToExpire <= 0) {
    // 이미 만료됐으면 즉시 갱신 시도
    attemptTokenRefresh();
  } else if (timeToExpire <= refreshOffset) {
    // 만료 5분 이내면 즉시 갱신 시도
    attemptTokenRefresh();
  } else {
    // 만료 5분 전에 타이머 설정
    window.tokenRefreshTimer = setTimeout(attemptTokenRefresh, timeToRefresh);
    console.log(
      `토큰 갱신 타이머 설정됨: ${Math.floor(timeToRefresh / 1000)}초 후`
    );
  }
}

// 토큰 갱신 시도 함수
async function attemptTokenRefresh() {
  try {
    const refreshToken = tokens.refreshToken;
    if (!refreshToken) {
      throw new Error("리프레시 토큰이 없습니다");
    }

    // API 엔드포인트로 리프레시 토큰 요청
    const response = await fetch(`${getAPIHost()}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`토큰 갱신 실패: ${response.status}`);
    }

    const data = await response.json();

    // 새 토큰 저장
    if (data.accessToken) {
      tokens.setAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
      // 리프레시 토큰 설정
      // 기존 tokens 모듈에 setRefreshToken 메서드가 없으므로 refreshToken을 직접 설정
      setRefreshTokenSafely(data.refreshToken);
    }

    console.log("토큰이 성공적으로 갱신되었습니다");

    // 새 타이머 설정
    setupTokenRefreshTimer();
  } catch (error) {
    console.error("토큰 갱신 오류:", error);
    // 갱신 실패 시 로그아웃 처리를 위해 이벤트 발생
    const logoutEvent = new CustomEvent("tokenRefreshFailed");
    window.dispatchEvent(logoutEvent);
  }
}

// 리프레시 토큰을 안전하게 설정하는 함수
// tokens 모듈에 setRefreshToken이 없을 경우를 대비
function setRefreshTokenSafely(token: string) {
  // 먼저 tokens 모듈에 setRefreshToken이 있는지 확인
  if (typeof tokens["setRefreshToken"] === "function") {
    // @ts-ignore - 타입 오류 무시
    tokens.setRefreshToken(token);
  } else {
    // 없으면 직접 로컬 스토리지에 저장
    LocalStorage.set("refreshToken", token);
    // 토큰 모듈 상태 갱신을 위한 이벤트 발생 (옵션)
    const event = new CustomEvent("refreshTokenUpdated", { detail: { token } });
    window.dispatchEvent(event);
  }
}

// URL 파라미터에서 토큰 처리하는 함수
export function handleAccessToken() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const access: string | null = urlParams.get("accessToken");
  const refresh: string | null = urlParams.get("refreshToken");
  const expiredAt: string | null = urlParams.get("expiredAt");

  if (access) {
    tokens.setAccessToken(access);

    if (refresh) {
      setRefreshTokenSafely(refresh);
    }

    if (expiredAt) {
      const expiredAtNumber: number = parseInt(expiredAt, 10);
      if (!isNaN(expiredAtNumber)) {
        // 만료 시간을 밀리초 단위로 저장
        LocalStorage.set("expiredAt", (expiredAtNumber * 1000).toString());

        // 토큰 갱신 타이머 설정
        setupTokenRefreshTimer();
      }
    }

    // URL에서 토큰 정보 제거
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    // 홈 또는 원래 이동하려던 페이지로 리다이렉트
    const redirectTo = LocalStorage.get("redirectAfterLogin") || "/";
    LocalStorage.remove("redirectAfterLogin");
    location.href = redirectTo;
  }
}

// API 호스트 가져오기
function getAPIHost() {
  return import.meta.env.VITE_APP_API_HOST || "";
}

// window에 타이머 프로퍼티 타입 추가
declare global {
  interface Window {
    tokenRefreshTimer: ReturnType<typeof setTimeout> | undefined;
  }
}

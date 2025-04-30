import LocalStorage from "../local-storage";
import tokens, { KEY_REFRESH_TOKEN } from "../tokens";
import isNullOrUndefined from "../utils/isNullOrUndefined";
import axios from "axios";

// refreshToken 함수 수정 - 일관성 있게 처리
export function refreshToken(accessToken) {
  const loginMethod = LocalStorage.get("loginMethod");

  if (isNullOrUndefined(accessToken)) {
    console.error("액세스 토큰이 제공되지 않았습니다.");
    return;
  }

  // 소셜 로그인 관련 리다이렉트 처리
  if (
    loginMethod === "google" ||
    loginMethod === "kakao" ||
    loginMethod === "test"
  ) {
    const redirectUrl = `${getAPIHost()}/auth/${loginMethod}`;
    console.log(`소셜 로그인 리다이렉트: ${redirectUrl}`);
    // 현재 경로 저장
    const currentPath = window.location.pathname;
    LocalStorage.set("redirectAfterLogin", currentPath);
    location.href = redirectUrl;
    return;
  }

  // 자동으로 토큰 만료 확인 및 갱신 타이머 설정
  setupTokenRefreshTimer();
}

// 토큰 만료 타이머 설정 - 로직 강화
export function setupTokenRefreshTimer() {
  // 기존 타이머가 있다면 제거
  if (window.tokenRefreshTimer) {
    clearTimeout(window.tokenRefreshTimer);
    window.tokenRefreshTimer = undefined;
  }

  const accessToken = tokens.accessToken;
  if (!accessToken) {
    console.log("액세스 토큰이 없어 타이머를 설정하지 않습니다");
    return;
  }

  // 만료 시간 확인 (저장된 값 또는 토큰에서 추출)
  let accessTokenExpired = tokens.accessTokenExpired;

  // 저장된 만료 시간이 없으면 토큰에서 다시 추출 시도
  if (!accessTokenExpired && accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      if (payload && payload.exp) {
        accessTokenExpired = payload.exp * 1000;
        console.log(
          `토큰에서 만료 시간 추출: ${new Date(accessTokenExpired).toLocaleString()}`
        );
        // 만료 시간 저장
        LocalStorage.set("expiredAt", accessTokenExpired.toString());
      }
    } catch (e) {
      console.error("토큰에서 만료 시간 추출 실패:", e);
    }
  }

  if (!accessTokenExpired) {
    console.log(
      "토큰 만료 시간 정보가 없습니다. 안전을 위해 30분 후에 갱신을 시도합니다."
    );
    // 만료 시간을 알 수 없는 경우, 30분 후 갱신 시도
    window.tokenRefreshTimer = setTimeout(
      () => attemptTokenRefresh(0),
      30 * 60 * 1000
    );
    return;
  }

  // 현재 시간과 만료 시간의 차이 계산
  const now = Date.now();
  const timeToExpire = accessTokenExpired - now;

  // 만료 10분 전에 갱신 시도 (더 여유있게 변경)
  const refreshOffset = 10 * 60 * 1000; // 10분
  const timeToRefresh = Math.max(0, timeToExpire - refreshOffset);

  if (timeToExpire <= 0) {
    // 이미 만료됐으면 즉시 갱신 시도
    console.log("토큰이 이미 만료되었습니다. 즉시 갱신을 시도합니다.");
    attemptTokenRefresh(0);
  } else if (timeToExpire <= refreshOffset) {
    // 만료 10분 이내면 즉시 갱신 시도
    console.log(
      `토큰이 곧 만료됩니다(${Math.floor(timeToExpire / 1000)}초 후). 즉시 갱신을 시도합니다.`
    );
    attemptTokenRefresh(0);
  } else {
    // 만료 10분 전에 타이머 설정
    console.log(
      `토큰 갱신 타이머 설정됨: ${Math.floor(timeToRefresh / 1000)}초 후 (${new Date(now + timeToRefresh).toLocaleString()})`
    );
    window.tokenRefreshTimer = setTimeout(
      () => attemptTokenRefresh(0),
      timeToRefresh
    );

    // 백업 타이머: 만약 메인 타이머가 실패할 경우를 대비한 안전장치
    const backupTime = Math.max(0, timeToExpire - refreshOffset / 2); // 만료 5분 전
    setTimeout(() => {
      // 이미 토큰이 갱신되었는지 확인
      const currentToken = tokens.accessToken;
      const currentExpiry = tokens.accessTokenExpired;

      // 토큰이 여전히 같고 만료가 임박했다면 갱신 시도
      if (
        currentToken === accessToken &&
        currentExpiry &&
        currentExpiry - Date.now() < refreshOffset / 2
      ) {
        console.log("백업 타이머: 토큰 갱신이 필요합니다.");
        attemptTokenRefresh(0);
      }
    }, backupTime);
  }
}

// 토큰 갱신 시도 함수 - 에러 처리 강화 및 재시도 로직 추가
export async function attemptTokenRefresh(retryCount = 0) {
  try {
    const refreshToken = tokens.refreshToken;
    if (!refreshToken) {
      throw new Error("리프레시 토큰이 없습니다");
    }

    console.log(`토큰 갱신 시도 중... (시도 ${retryCount + 1})`);

    // 모든 가능한 방법으로 토큰 갱신 시도 (더 강화된 방식)
    try {
      // 1. Axios를 이용한 방식 (axiosInstance가 설정된 경우)
      if (typeof axios !== "undefined") {
        const response = await axios({
          method: "POST",
          url: `${getAPIHost()}/auth/refresh`,
          headers: {
            "Content-Type": "application/json",
            Authorization: tokens.accessToken
              ? `Bearer ${tokens.accessToken}`
              : "",
            Refresh: `Bearer ${refreshToken}`,
          },
          data: { refreshToken },
          withCredentials: true, // 쿠키 포함
        });

        if (response.data) {
          handleTokenRefreshResponse(response.data);
          return;
        }
      }
    } catch (axiosError) {
      console.warn(
        "Axios를 이용한 토큰 갱신 실패, fetch로 시도합니다",
        axiosError
      );
    }

    // 2. Fetch API를 이용한 방식
    const response = await fetch(`${getAPIHost()}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokens.accessToken ? `Bearer ${tokens.accessToken}` : "",
        Refresh: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
      credentials: "include", // 쿠키 포함
    });

    // 응답 처리
    if (!response.ok) {
      // 응답 상태코드에 따른 처리
      if (response.status === 401) {
        // 401 오류이지만 토큰이 있는 경우, 재시도
        if (retryCount < 2) {
          console.log(`인증 오류(401), ${retryCount + 1}번째 재시도...`);
          setTimeout(() => attemptTokenRefresh(retryCount + 1), 2000);
          return;
        }
        throw new Error("인증 만료: 리프레시 토큰이 유효하지 않습니다");
      } else if (response.status >= 500) {
        // 서버 오류인 경우 재시도
        if (retryCount < 3) {
          const delay = Math.min(2000 * (retryCount + 1), 10000); // 지수 백오프
          console.log(
            `서버 오류(${response.status}), ${retryCount + 1}번째 재시도... ${delay}ms 후`
          );
          setTimeout(() => attemptTokenRefresh(retryCount + 1), delay);
          return;
        }
      }
      throw new Error(`토큰 갱신 실패: ${response.status}`);
    }

    // 응답 데이터 처리
    const data = await response.json();
    handleTokenRefreshResponse(data);
  } catch (error) {
    console.error("토큰 갱신 오류:", error.message);

    // 일정 시간 후 다시 시도 (재시도 횟수 제한)
    if (
      retryCount < 3 &&
      !error.message.includes("리프레시 토큰이 유효하지 않습니다")
    ) {
      const delay = Math.min(2000 * (retryCount + 1), 10000); // 지수 백오프
      console.log(
        `토큰 갱신 실패, ${retryCount + 1}번째 재시도... ${delay}ms 후`
      );
      setTimeout(() => attemptTokenRefresh(retryCount + 1), delay);
      return;
    }

    // 모든 재시도 실패 시 이벤트 발생 (상세 정보 포함)
    const failEvent = new CustomEvent("tokenRefreshFailed", {
      detail: {
        retryCount,
        error: error.message,
      },
    });
    window.dispatchEvent(failEvent);
  }
}

// 토큰 갱신 응답 처리 함수
function handleTokenRefreshResponse(data) {
  // 새 액세스 토큰 처리
  if (data.accessToken) {
    tokens.setAccessToken(data.accessToken);
    console.log("새 액세스 토큰이 설정되었습니다");
  }

  // 새 리프레시 토큰 처리
  if (data.refreshToken) {
    if (typeof tokens.setRefreshToken === "function") {
      tokens.setRefreshToken(data.refreshToken);
    } else {
      LocalStorage.set(KEY_REFRESH_TOKEN, data.refreshToken);
    }
    console.log("새 리프레시 토큰이 설정되었습니다");
  }

  // 만료 시간 명시적으로 제공된 경우
  if (data.expiredAt) {
    const expiredAt =
      typeof data.expiredAt === "number"
        ? data.expiredAt * 1000 // 초 단위로 제공된 경우 밀리초로 변환
        : parseInt(data.expiredAt, 10);

    if (!isNaN(expiredAt)) {
      LocalStorage.set("expiredAt", expiredAt.toString());
      console.log(`만료 시간 설정: ${new Date(expiredAt).toLocaleString()}`);
    }
  }

  console.log("토큰이 성공적으로 갱신되었습니다");

  // 사용자 정보도 함께 제공된 경우
  if (data.userInfo) {
    tokens.updateUserInfo(data.userInfo);
    console.log("사용자 정보가 업데이트되었습니다");
  }

  // 새 타이머 설정
  setupTokenRefreshTimer();

  // 토큰 갱신 성공 이벤트 발생
  const successEvent = new CustomEvent("tokenRefreshSuccess");
  window.dispatchEvent(successEvent);
}

// URL 파라미터에서 토큰 처리하는 함수 - 수정하여 더 명확하게
export function handleAccessToken() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const access = urlParams.get("accessToken");
  const refresh = urlParams.get("refreshToken");
  const expiredAt = urlParams.get("expiredAt");

  if (!access) {
    // URL에 액세스 토큰이 없으면 처리하지 않음
    return;
  }

  console.log("URL에서 액세스 토큰을 찾았습니다. 토큰을 설정합니다.");

  // 액세스 토큰 설정
  tokens.setAccessToken(access);

  // 리프레시 토큰 설정
  if (refresh) {
    if (typeof tokens.setRefreshToken === "function") {
      tokens.setRefreshToken(refresh);
    } else {
      LocalStorage.set(KEY_REFRESH_TOKEN, refresh);
    }
  }

  // 만료 시간 설정
  if (expiredAt) {
    const expiredAtNumber = parseInt(expiredAt, 10);
    if (!isNaN(expiredAtNumber)) {
      // 만료 시간을 밀리초 단위로 저장
      const expiredAtMs = expiredAtNumber * 1000;
      LocalStorage.set("expiredAt", expiredAtMs.toString());
      console.log(`만료 시간 설정: ${new Date(expiredAtMs).toLocaleString()}`);
    }
  }

  // URL에서 토큰 정보 제거
  const cleanUrl = window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);

  // 타이머 설정
  setupTokenRefreshTimer();

  // 리다이렉트 처리
  const redirectTo = LocalStorage.get("redirectAfterLogin") || "/";
  LocalStorage.remove("redirectAfterLogin");
  console.log(`로그인 성공. 다음 경로로 리다이렉트: ${redirectTo}`);

  // 즉시 리다이렉트하지 않고 약간 지연시켜 토큰 저장 완료 보장
  setTimeout(() => {
    window.location.href = redirectTo;
  }, 100);
}

// API 호스트 가져오기
function getAPIHost() {
  return import.meta.env.VITE_APP_API_HOST || "";
}

// 토큰 중복 갱신 방지를 위한 디바운스 처리
let refreshInProgress = false;
let refreshQueue = [];

// window에 타이머 프로퍼티 타입 추가
declare global {
  interface Window {
    tokenRefreshTimer: ReturnType<typeof setTimeout> | undefined;
  }
}

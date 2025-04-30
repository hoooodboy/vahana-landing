import { useEffect } from "react";
import tokens from "../tokens";
import {
  setupTokenRefreshTimer,
  handleAccessToken,
  attemptTokenRefresh,
} from "../utils/tokenRefresh";
import LocalStorage from "../local-storage";

/**
 * 토큰 체크 및 갱신 로직을 관리하는 컴포넌트
 * App.tsx에 포함시켜 사용
 */
const TokenChecker = () => {
  useEffect(() => {
    // 앱 시작 시 토큰 초기화
    tokens.init();

    // URL 파라미터에서 토큰 처리 (소셜 로그인 등의 리다이렉트 처리)
    handleAccessToken();

    // 토큰 갱신 타이머 설정
    setupTokenRefreshTimer();

    // LocalStorage 변경 감지를 위한 이벤트 리스너
    const handleStorageChange = (e) => {
      if (
        e.key === "accessToken" ||
        e.key === "refreshToken" ||
        e.key === "expiredAt"
      ) {
        console.log("다른 탭에서 토큰 정보가 변경되었습니다.");
        tokens.init(); // 토큰 상태 갱신
        setupTokenRefreshTimer(); // 타이머 재설정
      }
    };

    // 다른 탭과의 동기화를 위해 storage 이벤트 리스너 추가
    window.addEventListener("storage", handleStorageChange);

    // 토큰 갱신 실패 이벤트 리스너 설정 - 더 유연한 처리 추가
    const handleTokenRefreshFailed = (e) => {
      // 사용자 지정 데이터가 있는지 확인
      const detail = e.detail || {};
      const { retryCount, error } = detail;

      console.log(
        `토큰 갱신 실패 (시도: ${retryCount || "알 수 없음"})`,
        error
      );

      // 최대 재시도 횟수 초과 시에만 로그아웃 처리
      if (retryCount >= 3) {
        console.log("최대 재시도 횟수 초과, 로그아웃 처리");

        // 현재 경로를 저장 (로그인 후 리다이렉트를 위해)
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/signup") {
          LocalStorage.set("redirectAfterLogin", currentPath);
        }

        // 토큰 제거
        tokens.clearTokens();

        // 로그인 페이지로 이동
        window.location.href = "/login";
      } else {
        // 재시도 횟수가 초과되지 않았다면 다시 한번 시도
        console.log("토큰 갱신 재시도...");
        setTimeout(
          () => attemptTokenRefresh(retryCount ? retryCount + 1 : 1),
          2000
        );
      }
    };

    window.addEventListener("tokenRefreshFailed", handleTokenRefreshFailed);

    // 페이지 활성화될 때마다 토큰 상태 확인
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("페이지가 활성화되었습니다. 토큰 상태 검사 중...");

        // 토큰 상태 재확인
        tokens.init();

        // 토큰이 있고 만료되었거나 곧 만료될 예정인 경우에만 갱신 시도
        if (
          tokens.accessToken &&
          (tokens.isTokenExpired() || tokens.isTokenExpiringSoon(10))
        ) {
          console.log("토큰이 만료되었거나 곧 만료됩니다. 갱신 시도 중...");
          attemptTokenRefresh(0);
        } else if (tokens.accessToken) {
          // 유효한 토큰이 있으면 타이머 재설정
          setupTokenRefreshTimer();
        }
      }
    };

    // 페이지 활성화/비활성화 감지
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 정기적으로 토큰 상태 확인 (1분마다)
    const tokenCheckInterval = setInterval(() => {
      const accessToken = tokens.accessToken;
      if (!accessToken) return;

      // 토큰이 만료되었거나 10분 이내에 만료될 예정인 경우
      if (tokens.isTokenExpired() || tokens.isTokenExpiringSoon(10)) {
        console.log(
          "토큰이 곧 만료되거나 이미 만료되었습니다. 갱신을 시도합니다."
        );
        attemptTokenRefresh(0); // 명시적으로 토큰 갱신 시도
      }
    }, 60000); // 1분마다 확인

    // 사용자 활동 감지를 위한 이벤트
    const userActivityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    let userActivityTimeout;

    // 사용자 활동 감지 시 토큰 상태 확인
    const handleUserActivity = () => {
      // 디바운싱: 짧은 시간에 여러 번 이벤트가 발생해도 한 번만 실행
      if (userActivityTimeout) clearTimeout(userActivityTimeout);

      userActivityTimeout = setTimeout(() => {
        const accessToken = tokens.accessToken;
        if (
          accessToken &&
          (tokens.isTokenExpired() || tokens.isTokenExpiringSoon(15))
        ) {
          console.log("사용자 활동 감지, 토큰 상태 확인 중...");
          attemptTokenRefresh(0);
        }
      }, 3000); // 3초 후 실행
    };

    // 사용자 활동 이벤트 등록
    userActivityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // 초기 실행: 페이지 로드 시 즉시 토큰 상태 확인
    if (
      tokens.accessToken &&
      (tokens.isTokenExpired() || tokens.isTokenExpiringSoon(10))
    ) {
      console.log("페이지 로드 시 토큰 상태 확인, 갱신 시도 중...");
      attemptTokenRefresh(0);
    }

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 및 타이머 정리
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "tokenRefreshFailed",
        handleTokenRefreshFailed
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // 사용자 활동 이벤트 제거
      userActivityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });

      clearInterval(tokenCheckInterval);
      if (userActivityTimeout) clearTimeout(userActivityTimeout);

      // 토큰 갱신 타이머 제거
      if (window.tokenRefreshTimer) {
        clearTimeout(window.tokenRefreshTimer);
      }
    };
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
};

export default TokenChecker;

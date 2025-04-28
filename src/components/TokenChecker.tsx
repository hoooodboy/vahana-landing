import { useEffect } from "react";
import tokens from "../tokens";
import {
  setupTokenRefreshTimer,
  handleAccessToken,
} from "../utils/tokenRefresh";

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

    // 토큰 갱신 실패 이벤트 리스너 설정
    const handleTokenRefreshFailed = () => {
      console.log("토큰 갱신 실패, 로그아웃 처리");

      // 현재 경로를 저장 (로그인 후 리다이렉트를 위해)
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/signup") {
        localStorage.setItem("redirectAfterLogin", currentPath);
      }

      // 토큰 제거
      tokens.clearTokens();

      // 로그인 페이지로 이동
      window.location.href = "/login";
    };

    window.addEventListener("tokenRefreshFailed", handleTokenRefreshFailed);

    // 정기적으로 토큰 상태 확인 (1분마다)
    const tokenCheckInterval = setInterval(() => {
      const accessToken = tokens.accessToken;
      if (!accessToken) return;

      // 토큰이 만료되었거나 5분 이내에 만료될 예정인 경우
      if (tokens.isTokenExpired() || tokens.isTokenExpiringSoon(5)) {
        console.log(
          "토큰이 곧 만료되거나 이미 만료되었습니다. 갱신을 시도합니다."
        );
        setupTokenRefreshTimer(); // 이 함수는 필요한 경우 즉시 갱신을 시도함
      }
    }, 60000); // 1분마다 확인

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 및 타이머 정리
      window.removeEventListener(
        "tokenRefreshFailed",
        handleTokenRefreshFailed
      );
      clearInterval(tokenCheckInterval);

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

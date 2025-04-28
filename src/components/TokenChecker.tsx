import { useEffect } from "react";
import tokens from "../tokens";
import { setupTokenRefreshTimer } from "../utils/tokenRefresh";

// 토큰 체크 및 갱신 로직을 관리하는 컴포넌트
// App.tsx에 포함시켜 사용

const TokenChecker = () => {
  useEffect(() => {
    // 앱 시작 시 토큰 초기화 및 만료 타이머 설정
    tokens.init();
    setupTokenRefreshTimer();

    // 토큰 갱신 실패 이벤트 리스너 설정
    const handleTokenRefreshFailed = () => {
      // 토큰 갱신 실패 시 로그아웃 처리
      tokens.clearTokens();
      window.location.href = "/login";
    };

    window.addEventListener("tokenRefreshFailed", handleTokenRefreshFailed);

    // 정기적으로 토큰 상태 확인 (30초마다)
    const tokenCheckInterval = setInterval(() => {
      // 액세스 토큰이 만료된 경우 토큰 갱신 시도
      const now = Date.now();
      const tokenExpired = tokens.accessTokenExpired;

      if (tokenExpired && now >= tokenExpired) {
        console.log("토큰이 만료되었습니다. 갱신을 시도합니다.");
        setupTokenRefreshTimer();
      }
    }, 30000);

    return () => {
      window.removeEventListener(
        "tokenRefreshFailed",
        handleTokenRefreshFailed
      );
      clearInterval(tokenCheckInterval);
    };
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
};

export default TokenChecker;

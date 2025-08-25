// 토큰 만료 테스트를 위한 유틸리티 함수들

export const testUtils = {
  // 구독 서비스 토큰 만료 시뮬레이션
  expireSubscribeTokens: () => {
    localStorage.removeItem("subscribeAccessToken");
    localStorage.removeItem("subscribeRefreshToken");
    localStorage.removeItem("subscribeTokenExpiry");
    localStorage.removeItem("subscribeIdentityVerified");
    console.log("✅ 구독 서비스 토큰 만료 완료");
  },

  // 메인 서비스 토큰 만료 시뮬레이션
  expireMainTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiry");
    console.log("✅ 메인 서비스 토큰 만료 완료");
  },

  // 모든 토큰 만료 시뮬레이션
  expireAllTokens: () => {
    const keysToRemove = [
      "subscribeAccessToken",
      "subscribeRefreshToken",
      "subscribeTokenExpiry",
      "subscribeIdentityVerified",
      "accessToken",
      "refreshToken",
      "tokenExpiry",
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    console.log("✅ 모든 토큰 만료 완료");
  },

  // 토큰 만료 시간을 과거로 설정
  setPastExpiry: () => {
    const pastTime = Date.now() - 60 * 60 * 1000; // 1시간 전
    localStorage.setItem("subscribeTokenExpiry", pastTime.toString());
    localStorage.setItem("tokenExpiry", pastTime.toString());
    console.log("✅ 토큰 만료 시간을 과거로 설정 완료");
  },

  // 토큰 만료 시간을 10초 후로 설정 (즉시 테스트용)
  setExpiryIn10Seconds: () => {
    const futureTime = Date.now() + 10 * 1000; // 10초 후
    localStorage.setItem("subscribeTokenExpiry", futureTime.toString());
    localStorage.setItem("tokenExpiry", futureTime.toString());
    console.log("✅ 토큰 만료 시간을 10초 후로 설정 완료");
  },

  // 잘못된 토큰으로 설정
  setInvalidTokens: () => {
    localStorage.setItem("subscribeAccessToken", "invalid_token_123");
    localStorage.setItem("accessToken", "invalid_token_456");
    console.log("✅ 잘못된 토큰 설정 완료");
  },

  // 현재 토큰 상태 확인
  checkTokenStatus: () => {
    const subscribeToken = localStorage.getItem("subscribeAccessToken");
    const mainToken = localStorage.getItem("accessToken");
    const subscribeExpiry = localStorage.getItem("subscribeTokenExpiry");
    const mainExpiry = localStorage.getItem("tokenExpiry");

    console.log("🔍 현재 토큰 상태:");
    console.log("구독 토큰:", subscribeToken ? "존재함" : "없음");
    console.log("메인 토큰:", mainToken ? "존재함" : "없음");
    console.log(
      "구독 만료:",
      subscribeExpiry
        ? new Date(parseInt(subscribeExpiry)).toLocaleString()
        : "없음"
    );
    console.log(
      "메인 만료:",
      mainExpiry ? new Date(parseInt(mainExpiry)).toLocaleString() : "없음"
    );
  },
};

// 전역 객체로 등록 (브라우저 콘솔에서 사용 가능)
if (typeof window !== "undefined") {
  (window as any).testUtils = testUtils;
  console.log("🧪 테스트 유틸리티가 전역 객체에 등록되었습니다.");
  console.log("사용법: testUtils.expireAllTokens()");
}

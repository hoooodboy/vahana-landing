import { getAPIHost } from "../api";
import LocalStorage from "../local-storage";

interface Token {
  value: string;
  expiredAt: string;
}

// 예시로 만료 시간을 5분으로 설정합니다.
const expirationThreshold = 5 * 60 * 1000; // 밀리초 단위로 변환

export function refreshToken(token: Token) {
  if (LocalStorage.get("loginMethod") === "google") {
    location.href = `${getAPIHost()}/auth/google`;
    handleAccessToken();
    console.log("토큰이 갱신되었습니다.");
    return;
  }

  if (LocalStorage.get("loginMethod") === "kakao") {
    location.href = `${getAPIHost()}/auth/google`;
    handleAccessToken();
    console.log("토큰이 갱신되었습니다.");
    return;
  }

  if (LocalStorage.get("loginMethod") === "test") {
    location.href = `${getAPIHost()}/auth/admin`;
    handleAccessToken();
    console.log("토큰이 갱신되었습니다.");
    return;
  }
}

async function handleAccessToken() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const access: string | null = urlParams.get("accessToken");
  const expiredAt: string | null = urlParams.get("expiredAt");

  if (access) {
    const expiredAtNumber: number = parseInt(expiredAt || "", 10);

    if (!isNaN(expiredAtNumber)) {
      LocalStorage.set("accessToken", access);
      LocalStorage.set("expiredAt", (expiredAtNumber * 1000).toString());
      location.href = "/";
    } else {
      console.error("Invalid expiresIn format");
    }
  }
}

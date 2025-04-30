import LocalStorage from "../local-storage";
import { parseJwt } from "../utils";

export const KEY_ACCESS_TOKEN = "accessToken";
export const KEY_REFRESH_TOKEN = "refreshToken";
export const KEY_USER_INFO = "userInfo";
export const KEY_EXPIRED_AT = "expiredAt";
export const KEY_LAST_ACTIVITY = "lastActivity"; // 마지막 활동 시간 추적용 키 추가

// JWT 토큰 페이로드 인터페이스 정의
interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: any; // 다른 모든 속성을 허용
}

// 사용자 정보 인터페이스
interface UserInfo {
  id: string;
  name: string;
  phone: string;
  role: string;
}

type SessionState = {
  accessToken: string | null;
  accessTokenExpired: number | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
};

const _state: SessionState = {
  accessToken: null,
  accessTokenExpired: null,
  refreshToken: null,
  userInfo: null,
};

// 현재 사용자 활동 시간 갱신
function updateLastActivity() {
  LocalStorage.set(KEY_LAST_ACTIVITY, Date.now().toString());
}

// 토큰으로부터 만료 시간 계산 - 오류 처리 강화
function extractExpirationTime(token: string): number | null {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("유효하지 않은 JWT 형식입니다.");
      return null;
    }

    // base64 디코딩 및 JSON 파싱
    try {
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );

      // exp 필드가 있는지 확인
      if (typeof payload.exp === "number") {
        return payload.exp * 1000; // 초 -> 밀리초 변환
      } else {
        console.warn("토큰에 만료 시간(exp)이 없습니다.");
        return null;
      }
    } catch (e) {
      console.error("토큰 페이로드 파싱 실패:", e);
      return null;
    }
  } catch (error) {
    console.error("토큰에서 만료 시간을 추출하는 중 오류 발생:", error);
    return null;
  }
}

// JWT에서 사용자 정보 추출 (타입 안전하게)
function extractUserInfoFromToken(token: string): UserInfo | null {
  try {
    const payload = parseJwt(token) as JwtPayload;
    if (!payload) return null;

    // JWT 토큰의 실제 속성은 백엔드 구현에 따라 다를 수 있음
    // 여기서는 가능한 모든 속성을 확인하고 기본값 제공
    return {
      id: String(payload.sub || payload.userId || payload.id || ""),
      name: String(payload.name || payload.username || payload.userName || ""),
      phone: String(payload.phone || payload.phoneNumber || ""),
      // role은 문자열이나 배열일 수 있음
      role: Array.isArray(payload.role)
        ? payload.role[0] || ""
        : String(payload.role || payload.roles || payload.authorities || ""),
    };
  } catch (error) {
    console.error("토큰에서 사용자 정보 추출 실패:", error);
    return null;
  }
}

// 초기화 함수 - 더 강력한 에러 처리 추가
function initializeTokens() {
  try {
    const storedAccessToken = LocalStorage.get(KEY_ACCESS_TOKEN);
    const storedRefreshToken = LocalStorage.get(KEY_REFRESH_TOKEN);
    const storedUserInfo = LocalStorage.get(KEY_USER_INFO);
    const storedExpiredAt = LocalStorage.get(KEY_EXPIRED_AT);

    if (storedAccessToken) {
      _state.accessToken = storedAccessToken;

      // 만료 시간 설정: 토큰에서 추출 또는 저장된 값 사용
      const tokenExpiry = extractExpirationTime(storedAccessToken);

      if (tokenExpiry) {
        _state.accessTokenExpired = tokenExpiry;
        // 저장된 만료 시간과 토큰에서 추출한 시간이 다르면 업데이트
        if (
          storedExpiredAt &&
          Math.abs(parseInt(storedExpiredAt, 10) - tokenExpiry) > 1000
        ) {
          LocalStorage.set(KEY_EXPIRED_AT, tokenExpiry.toString());
          console.log("만료 시간 정보가 불일치하여 업데이트하였습니다.");
        }
      } else if (storedExpiredAt) {
        _state.accessTokenExpired = parseInt(storedExpiredAt, 10);
      } else {
        // 만료 시간을 추출할 수 없고 저장된 값도 없는 경우, 안전하게 1시간 후로 설정
        const safeExpiry = Date.now() + 60 * 60 * 1000; // 1시간
        _state.accessTokenExpired = safeExpiry;
        LocalStorage.set(KEY_EXPIRED_AT, safeExpiry.toString());
        console.log(
          "만료 시간을 결정할 수 없어 안전하게 1시간으로 설정했습니다."
        );
      }

      // 사용자 정보 설정 (토큰 또는 저장된 값에서)
      let userInfo = null;

      // 저장된 사용자 정보가 있으면 먼저 사용
      if (storedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          if (parsedUserInfo && typeof parsedUserInfo === "object") {
            userInfo = parsedUserInfo as UserInfo;
          }
        } catch (e) {
          console.error("저장된 사용자 정보 파싱 실패:", e);
        }
      }

      // 저장된 정보가 없거나 파싱 실패 시 토큰에서 추출
      if (!userInfo) {
        userInfo = extractUserInfoFromToken(storedAccessToken);
        // 추출 성공 시 저장
        if (userInfo) {
          LocalStorage.setJson(KEY_USER_INFO, userInfo);
        }
      }

      _state.userInfo = userInfo;
    }

    if (storedRefreshToken) {
      _state.refreshToken = storedRefreshToken;
    }

    // 마지막 활동 시간 업데이트
    updateLastActivity();
  } catch (error) {
    console.error("토큰 초기화 실패:", error);
    // 초기화 실패 시 기존 데이터는 유지하되 로그 기록
  }
}

// 액세스 토큰 설정 함수
function setAccessToken(token: string | null) {
  try {
    if (token) {
      LocalStorage.set(KEY_ACCESS_TOKEN, token);
      _state.accessToken = token;

      // 토큰에서 만료 시간 추출
      const expireTime = extractExpirationTime(token);
      if (expireTime) {
        _state.accessTokenExpired = expireTime;
        LocalStorage.set(KEY_EXPIRED_AT, expireTime.toString());
      } else {
        // 만료 시간을 추출할 수 없는 경우, 안전하게 1시간 후로 설정
        const safeExpiry = Date.now() + 60 * 60 * 1000; // 1시간
        _state.accessTokenExpired = safeExpiry;
        LocalStorage.set(KEY_EXPIRED_AT, safeExpiry.toString());
        console.log(
          "토큰에서 만료 시간을 추출할 수 없어 안전하게 1시간으로 설정했습니다."
        );
      }

      // 토큰에서 사용자 정보 추출
      const userInfo = extractUserInfoFromToken(token);
      if (userInfo) {
        LocalStorage.setJson(KEY_USER_INFO, userInfo);
        _state.userInfo = userInfo;
      }

      // 마지막 활동 시간 업데이트
      updateLastActivity();
    } else {
      // 토큰 제거
      LocalStorage.remove(KEY_ACCESS_TOKEN);
      LocalStorage.remove(KEY_EXPIRED_AT);
      LocalStorage.remove(KEY_USER_INFO);
      _state.accessToken = null;
      _state.accessTokenExpired = null;
      _state.userInfo = null;
    }
  } catch (error) {
    console.error("액세스 토큰 설정 실패:", error);
    throw error;
  }
}

// 리프레시 토큰 설정 함수
function setRefreshToken(token: string | null) {
  try {
    if (token) {
      LocalStorage.set(KEY_REFRESH_TOKEN, token);
      // 마지막 활동 시간 업데이트
      updateLastActivity();
    } else {
      LocalStorage.remove(KEY_REFRESH_TOKEN);
    }
    _state.refreshToken = token;
  } catch (error) {
    console.error("리프레시 토큰 설정 실패:", error);
    throw error;
  }
}

// 초기화 함수 실행
initializeTokens();

// 사용자 활동 추적
function setupActivityTracking() {
  const events = ["mousedown", "keydown", "touchstart", "scroll"];

  // 디바운스를 위한 타이머
  let activityTimer: ReturnType<typeof setTimeout> | null = null;

  const activityHandler = () => {
    if (activityTimer) {
      clearTimeout(activityTimer);
    }

    // 300ms 디바운스 적용
    activityTimer = setTimeout(() => {
      updateLastActivity();
    }, 300);
  };

  // 이벤트 리스너 등록
  events.forEach((event) => {
    window.addEventListener(event, activityHandler, { passive: true });
  });

  // 페이지 로드/활성화 시 업데이트
  updateLastActivity();

  // 페이지 가시성 변경 시 처리
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      updateLastActivity();
    }
  });
}

// 활동 추적 설정 실행
setupActivityTracking();

// 토큰 관련 모듈 내보내기
const tokens = {
  // 수동 초기화 함수
  init() {
    initializeTokens();
  },

  // 모든 토큰 설정
  setTokens(accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  },

  // 개별 토큰 설정
  setAccessToken,
  setRefreshToken,

  // 사용자 정보 업데이트
  updateUserInfo(userInfo: Partial<UserInfo>) {
    try {
      const currentUserInfo = _state.userInfo;
      if (currentUserInfo) {
        const updatedUserInfo = { ...currentUserInfo, ...userInfo };
        LocalStorage.setJson(KEY_USER_INFO, updatedUserInfo);
        _state.userInfo = updatedUserInfo;
        // 사용자 정보 업데이트 시 마지막 활동 시간도 업데이트
        updateLastActivity();
      }
    } catch (error) {
      console.error("사용자 정보 업데이트 실패:", error);
      throw error;
    }
  },

  // 모든 토큰 삭제
  clearTokens() {
    LocalStorage.remove(KEY_ACCESS_TOKEN);
    LocalStorage.remove(KEY_REFRESH_TOKEN);
    LocalStorage.remove(KEY_USER_INFO);
    LocalStorage.remove(KEY_EXPIRED_AT);
    LocalStorage.remove(KEY_LAST_ACTIVITY);
    _state.accessToken = null;
    _state.accessTokenExpired = null;
    _state.refreshToken = null;
    _state.userInfo = null;
  },

  // 토큰 정보 가져오기
  get accessToken() {
    // 요청 시 마지막 활동 시간 업데이트
    updateLastActivity();
    return _state.accessToken;
  },

  get accessTokenExpired() {
    return _state.accessTokenExpired;
  },

  get refreshToken() {
    // 요청 시 마지막 활동 시간 업데이트
    updateLastActivity();
    return _state.refreshToken;
  },

  get userInfo() {
    return _state.userInfo;
  },

  // 토큰 만료 여부 확인
  isTokenExpired() {
    const expireTime = _state.accessTokenExpired;
    if (!expireTime) return true;
    return Date.now() >= expireTime;
  },

  // 토큰이 곧 만료되는지 확인 (기본값: 5분)
  isTokenExpiringSoon(minutes = 5) {
    const expireTime = _state.accessTokenExpired;
    if (!expireTime) return true;
    return expireTime - Date.now() <= minutes * 60 * 1000;
  },

  // 마지막 활동 시간 가져오기
  getLastActivity() {
    const lastActivity = LocalStorage.get(KEY_LAST_ACTIVITY);
    return lastActivity ? parseInt(lastActivity, 10) : null;
  },

  // 비활성 시간 확인(분 단위)
  getInactivityTime() {
    const lastActivity = this.getLastActivity();
    if (!lastActivity) return Infinity;
    return Math.floor((Date.now() - lastActivity) / (60 * 1000));
  },

  // 일정 시간 동안 비활성 상태인지 확인
  isInactive(minutes = 30) {
    return this.getInactivityTime() >= minutes;
  },
};

export default tokens;

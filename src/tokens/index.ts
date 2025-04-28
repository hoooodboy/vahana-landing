import LocalStorage from "../local-storage";
import { parseJwt } from "../utils";

export const KEY_ACCESS_TOKEN = "accessToken";
export const KEY_REFRESH_TOKEN = "refreshToken";
export const KEY_USER_INFO = "userInfo";
export const KEY_EXPIRED_AT = "expiredAt";

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

// 토큰으로부터 만료 시간 계산
function extractExpirationTime(token: string): number | null {
  try {
    const parsedJwt = parseJwt(token) as JwtPayload;
    return parsedJwt && parsedJwt.exp ? parsedJwt.exp * 1000 : null;
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

// 초기화 함수
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
      } else if (storedExpiredAt) {
        _state.accessTokenExpired = parseInt(storedExpiredAt, 10);
      }

      // 사용자 정보 설정
      const userInfo = extractUserInfoFromToken(storedAccessToken);
      if (userInfo) {
        _state.userInfo = userInfo;
      }
    }

    if (storedRefreshToken) {
      _state.refreshToken = storedRefreshToken;
    }

    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        if (parsedUserInfo && typeof parsedUserInfo === "object") {
          _state.userInfo = parsedUserInfo as UserInfo;
        }
      } catch (e) {
        console.error("저장된 사용자 정보 파싱 실패:", e);
      }
    }
  } catch (error) {
    console.error("토큰 초기화 실패:", error);
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
      }

      // 토큰에서 사용자 정보 추출
      const userInfo = extractUserInfoFromToken(token);
      if (userInfo) {
        LocalStorage.setJson(KEY_USER_INFO, userInfo);
        _state.userInfo = userInfo;
      }
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
    _state.accessToken = null;
    _state.accessTokenExpired = null;
    _state.refreshToken = null;
    _state.userInfo = null;
  },

  // 토큰 정보 가져오기
  get accessToken() {
    return _state.accessToken;
  },

  get accessTokenExpired() {
    return _state.accessTokenExpired;
  },

  get refreshToken() {
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
};

export default tokens;

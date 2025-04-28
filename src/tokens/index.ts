import LocalStorage from "../local-storage";
import { parseJwt } from "../utils";

export const KEY_ACCESS_TOKEN = "accessToken";
export const KEY_REFRESH_TOKEN = "refreshToken";
export const KEY_USER_INFO = "userInfo";

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

// 초기화 함수를 즉시 실행하여 localStorage의 값을 가져옴
(() => {
  try {
    const storedAccessToken = LocalStorage.get(KEY_ACCESS_TOKEN);
    const storedRefreshToken = LocalStorage.get(KEY_REFRESH_TOKEN);
    const storedUserInfo = LocalStorage.get(KEY_USER_INFO);

    if (storedAccessToken) {
      const parsedJwt = parseJwt(storedAccessToken);
      _state.accessToken = storedAccessToken;
      _state.accessTokenExpired = parsedJwt ? parsedJwt.exp * 1000 : null;

      if (parsedJwt) {
        _state.userInfo = parsedJwt as any;
      }
    }

    if (storedRefreshToken) {
      _state.refreshToken = storedRefreshToken;
    }

    if (storedUserInfo) {
      _state.userInfo = LocalStorage.getJson(KEY_USER_INFO);
    }

    // console.log("Tokens and user info initialized:", _state);
  } catch (error) {
    console.error("Initialization failed:", error);
  }
})();

const setAccessToken = function setAccessToken(token: string | null) {
  try {
    if (token !== null) {
      LocalStorage.set(KEY_ACCESS_TOKEN, token);
      _state.accessToken = token;
      const parsedJwt = parseJwt(token) as any;
      _state.accessTokenExpired = parsedJwt ? parsedJwt.exp * 1000 : null;
      console.log("parsedJwt ", parsedJwt);

      if (parsedJwt) {
        const userInfo = {
          id: parsedJwt.sub,
          name: parsedJwt.name,
          phone: parsedJwt.phone,
          role: parsedJwt.role,
        };
        LocalStorage.setJson(KEY_USER_INFO, userInfo);
        _state.userInfo = userInfo;
      }
    } else {
      LocalStorage.remove(KEY_ACCESS_TOKEN);
      LocalStorage.remove(KEY_USER_INFO);
      _state.accessToken = null;
      _state.accessTokenExpired = null;
      _state.userInfo = null;
    }
    console.log("Access token and user info updated:", _state);
  } catch (error) {
    console.error("Failed to set access token:", error);
    throw error;
  }
};

// refreshToken을 설정하는 함수 - tokens 모듈에 추가 필요
function setRefreshToken(token: string | null) {
  if (token !== null) {
    LocalStorage.set(KEY_REFRESH_TOKEN, token);
  } else {
    LocalStorage.remove(KEY_REFRESH_TOKEN);
  }
  _state.refreshToken = token;
}

const tokens = {
  init() {
    const accessToken = LocalStorage.get(KEY_ACCESS_TOKEN);
    const refreshToken = LocalStorage.get(KEY_REFRESH_TOKEN);
    setAccessToken(accessToken);
    if (refreshToken) {
      _state.refreshToken = refreshToken;
    }
  },

  setTokens(accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  },

  setAccessToken,

  // setRefreshToken 함수 추가
  setRefreshToken,

  updateUserInfo(userInfo: Partial<UserInfo>) {
    try {
      const currentUserInfo = _state.userInfo;
      if (currentUserInfo) {
        const updatedUserInfo = { ...currentUserInfo, ...userInfo };
        LocalStorage.setJson(KEY_USER_INFO, updatedUserInfo);
        _state.userInfo = updatedUserInfo;
        console.log("User info updated:", updatedUserInfo);
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
      throw error;
    }
  },

  clearTokens() {
    LocalStorage.remove(KEY_ACCESS_TOKEN);
    LocalStorage.remove(KEY_REFRESH_TOKEN);
    LocalStorage.remove(KEY_USER_INFO);
    _state.accessToken = null;
    _state.accessTokenExpired = null;
    _state.refreshToken = null;
    _state.userInfo = null;
  },

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
};

export default tokens;

import LocalStorage from "../local-storage";
import { parseJwt } from "../utils";

export const KEY_ACCESS_TOKEN = "accessToken";
export const KEY_REFRESH_TOKEN = "refreshToken";

type SessionState = {
  accessToken: string | null;
  accessTokenExpired: number | null;
  refreshToken: string | null;
};

const _state: SessionState = {
  accessToken: null,
  accessTokenExpired: null,
  refreshToken: null,
};

// 초기화 함수를 즉시 실행하여 localStorage의 값을 가져옴
(async () => {
  try {
    const storedAccessToken = await LocalStorage.get("accessToken");
    const storedRefreshToken = await LocalStorage.get("refreshToken");

    if (storedAccessToken) {
      const parsedJwt = parseJwt(storedAccessToken);
      _state.accessToken = storedAccessToken;
      _state.accessTokenExpired = parsedJwt ? parsedJwt.exp * 1000 : null;
    }

    if (storedRefreshToken) {
      _state.refreshToken = storedRefreshToken;
    }

    console.log("Tokens initialized:", _state);
  } catch (error) {
    console.error("Token initialization failed:", error);
  }
})();

const setAccessToken = async function setAccessToken(token: string | null) {
  try {
    if (token !== null) {
      await LocalStorage.set("accessToken", token);
      _state.accessToken = token;
      const parsedJwt = parseJwt(token);
      _state.accessTokenExpired = parsedJwt ? parsedJwt.exp * 1000 : null;
    } else {
      await LocalStorage.remove("accessToken");
      _state.accessToken = null;
      _state.accessTokenExpired = null;
    }
    console.log("Access token updated:", _state.accessToken);
  } catch (error) {
    console.error("Failed to set access token:", error);
    throw error;
  }
};

export const setRefreshToken = async function setRefreshToken(token: string | null) {
  if (token !== null) {
    await LocalStorage.set(KEY_REFRESH_TOKEN, token);
  }
  _state.refreshToken = token;
};

const tokens = {
  async init() {
    const [accessToken, refreshToken] = await Promise.all([LocalStorage.get(KEY_ACCESS_TOKEN), LocalStorage.get(KEY_REFRESH_TOKEN)]);
    await Promise.all([setAccessToken(accessToken), setRefreshToken(refreshToken)]);
  },
  async setTokens(accessToken: string, refreshToken: string) {
    await Promise.all([setAccessToken(accessToken), setRefreshToken(refreshToken)]);
  },

  setAccessToken,

  async clearTokens() {
    await Promise.all([LocalStorage.remove(KEY_ACCESS_TOKEN), LocalStorage.remove(KEY_REFRESH_TOKEN)]);
    _state.accessToken = null;
    _state.accessTokenExpired = null;
    _state.refreshToken = null;
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
};

export default tokens;

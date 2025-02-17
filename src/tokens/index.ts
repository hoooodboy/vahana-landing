import LocalStorage from "../local-storage";
import { parseJwt } from "../utils";

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

export const setRefreshToken = async function setRefreshToken(
  token: string | null
) {
  try {
    if (token !== null) {
      await LocalStorage.set("refreshToken", token);
      _state.refreshToken = token;
    } else {
      await LocalStorage.remove("refreshToken");
      _state.refreshToken = null;
    }
    console.log("Refresh token updated:", _state.refreshToken);
  } catch (error) {
    console.error("Failed to set refresh token:", error);
    throw error;
  }
};

const tokens = {
  async init() {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        LocalStorage.get("accessToken"),
        LocalStorage.get("refreshToken"),
      ]);

      if (accessToken) {
        await setAccessToken(accessToken);
      }
      if (refreshToken) {
        await setRefreshToken(refreshToken);
      }

      console.log("Tokens re-initialized:", _state);
      return _state;
    } catch (error) {
      console.error("Failed to initialize tokens:", error);
      throw error;
    }
  },

  async setTokens(accessToken: string, refreshToken: string) {
    try {
      await Promise.all([
        setAccessToken(accessToken),
        setRefreshToken(refreshToken),
      ]);
      console.log("Tokens set successfully:", _state);
    } catch (error) {
      console.error("Failed to set tokens:", error);
      throw error;
    }
  },

  setAccessToken,

  async clearTokens() {
    try {
      await Promise.all([
        LocalStorage.remove("accessToken"),
        LocalStorage.remove("refreshToken"),
      ]);
      _state.accessToken = null;
      _state.accessTokenExpired = null;
      _state.refreshToken = null;
      console.log("Tokens cleared");
    } catch (error) {
      console.error("Failed to clear tokens:", error);
      throw error;
    }
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

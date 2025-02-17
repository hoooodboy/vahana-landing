import Storage from "@/src/utils/storage";
import { parseJwt } from "../utils";

const KEY_ACCESS_TOKEN = "accessToken";
const KEY_REFRESH_TOKEN = "refreshToken";

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

const setAccessToken = async function setAccessToken(token: string | null) {
  if (token !== null) {
    await Storage.set(KEY_ACCESS_TOKEN, token);
  }
  _state.accessToken = token;
  const parsedJwt = token === null ? null : parseJwt(token);
  // console.log('parsedJwt', parsedJwt);
  _state.accessTokenExpired = parsedJwt === null ? null : parsedJwt.exp * 1000;
};

export const setRefreshToken = async function setRefreshToken(
  token: string | null
) {
  if (token !== null) {
    await Storage.set(KEY_REFRESH_TOKEN, token);
  }
  _state.refreshToken = token;
};

const tokens = {
  async init() {
    const [accessToken, refreshToken] = await Promise.all([
      Storage.get(KEY_ACCESS_TOKEN),
      Storage.get(KEY_REFRESH_TOKEN),
    ]);
    await Promise.all([
      setAccessToken(accessToken),
      setRefreshToken(refreshToken),
    ]);
  },
  async setTokens(accessToken: string, refreshToken: string) {
    await Promise.all([
      setAccessToken(accessToken),
      setRefreshToken(refreshToken),
    ]);
  },
  setAccessToken,
  async clearTokens() {
    await Promise.all([
      Storage.remove(KEY_ACCESS_TOKEN),
      Storage.remove(KEY_REFRESH_TOKEN),
    ]);
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

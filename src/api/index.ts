import axios from "axios";
import LocalStorage from "../local-storage";
import { jwtDecode } from "jwt-decode";

const { VITE_APP_API_HOST } = import.meta.env;

export const getAPIHost = () => {
  return "/api";
  // 엥?
  // return VITE_APP_API_HOST + "/api";
};

export const getSocketHost = () => {
  return VITE_APP_API_HOST;
};

export const api = axios.create({
  baseURL: getAPIHost(),
  withCredentials: true,
});

export const setToken = (cookies) => {
  if (!cookies?.access_token) {
    localStorage.setItem("token", "");
    return "";
  }

  const { access_token } = cookies;
  if (access_token) {
    // @ts-ignore
    api.store_data = {
      access_token,
    };
    // @ts-ignore
    localStorage.setItem("token", JSON.stringify(api.store_data));
    window?.opener?.postMessage("reload_token", "*");
    // @ts-ignore
    return api.store_data;
  }
};

let refreshTokenPromise;
const refreshAccessToken = async (callLogout: boolean) => {
  try {
    const access = LocalStorage.get("accessToken");
    const cur = Date.now();

    const decode = jwtDecode(access);
    if (decode && cur > decode.exp * 1e3 && !callLogout) {
      const response = await axios.post(
        `${getAPIHost()}/auth/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
          withCredentials: true,
        },
      );
      const { result } = response.data;

      if (result) {
        const { accessToken } = result;
        LocalStorage.set("accessToken", accessToken);
        return accessToken;
      } else {
        await axios.post(
          `${getAPIHost()}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
            withCredentials: true,
          },
        );

        localStorage.clear();
        LocalStorage.setBool("SPLASH_TOKEN", true);
        location.reload();
      }
    }
    return access;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

api.interceptors.request.use(async (request) => {
  try {
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshAccessToken(request.url === `${getAPIHost()}/auth/logout`);
    }

    const accessToken = await refreshTokenPromise;
    request.headers.authorization = `Bearer ${accessToken}`;
  } catch (error) {
    console.error("Error intercepting request:", error);
    throw error;
  } finally {
    refreshTokenPromise = null;
  }

  return request;
});

export default api;

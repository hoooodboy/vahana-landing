import { getUserInfo } from "../api/user";
import LocalStorage from "../local-storage";

const userLang = () => {
  const lang = LocalStorage.get("lang");
  const accessToken = LocalStorage.get("accessToken");

  if (!lang && !accessToken) {
    LocalStorage.set("lang", "ko");
    return "ko";
  }

  if (!lang) {
    getUserInfo().then((res) => {
      LocalStorage.set("lang", res.result.lang);
      return res.result.lang;
    });
  }

  return lang;
};

export default userLang;

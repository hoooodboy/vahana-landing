import { getUserInfo } from "../api/user";
import LocalStorage from "../local-storage";

const checkUserLang = () => {
  let lang = LocalStorage.get("lang");
  // const accessToken = LocalStorage.get("accessToken");

  getUserInfo().then((res) => {
    LocalStorage.set("lang", res.result.lang);
    lang = res.result.lang;
    return res.result.lang;
  });
  return lang;
};

export default checkUserLang;

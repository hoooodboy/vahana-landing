import { getUserInfo, setUserInfo } from "../api/user";
import LocalStorage from "../local-storage";

const userCurrency = () => {
  let currency = LocalStorage.get("currency");

  if (!LocalStorage.get("currency")) {
    getUserInfo().then((res) => {
      LocalStorage.set("currency", res.result.currency);
      currency = res.result.currency;
    });
  }

  if (currency === "KRW") {
    LocalStorage.set("currency", "KRW");
    return "₩";
  }
  if (currency === "USD") {
    LocalStorage.set("currency", "USD");
    return "$";
  }
  if (currency === "YEN") {
    LocalStorage.set("currency", "YEN");
    return "円";
  }
  if (currency === "JPY") {
    LocalStorage.set("currency", "JPY");
    return "元";
  }
};

export default userCurrency;

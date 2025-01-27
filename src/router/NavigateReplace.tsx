import { Navigate } from "react-router-dom";
import LocalStorage from "../local-storage";

function NavigateReplace({ to }: { to: string }) {
  LocalStorage.set("NAV", "home");
  return <Navigate replace to={to} />;
}

export default NavigateReplace;

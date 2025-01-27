import { Buffer } from "buffer";

// type JwtRole = 'AccessToken' | 'Authenticated' | 'AppGuidAuthenticated';
type ParsedJwt = {
  exp: number;
  iat: number;
  nameid: string;
  nbf: number;
  username: string;
  // role: JwtRole[];
  PrpnsExpDt: string;
  PrpnsGrade: string;
};
function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload) as ParsedJwt;
}

export default parseJwt;

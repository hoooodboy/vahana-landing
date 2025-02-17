import { Buffer } from 'buffer';

type JwtRole = 'AccessToken' | 'Authenticated' | 'AppGuidAuthenticated';
type ParsedJwt = {
  exp: number;
  iat: number;
  nameid: string;
  nbf: number;
  role: JwtRole[];
  PrpnsExpDt: string;
  PrpnsGrade: string;
};
function parseJwt(token: string) {
  console.log('token', token);
  const base64 = token.split('.')[1];
  const jsonPayload = Buffer.from(base64, 'base64');

  return JSON.parse(jsonPayload.toString()) as ParsedJwt;
}

export default parseJwt;

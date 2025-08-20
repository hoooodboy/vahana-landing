// Minimal subscribe auth API wrappers

const BASE_URL = "https://alpha.vahana.kr";

export type SubscribeLoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export async function subscribeLogin(email: string, password: string) {
  // Uses provided endpoint: POST https://alpha.vahana.kr/accounts { email, password }
  const res = await fetch(`${BASE_URL}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Login failed: ${res.status}`);
  }
  // Response shape:
  // { code, user, message, token: { access_token, refresh_token, expires_in } }
  const data = await res.json();
  const accessToken: string | undefined = data?.token?.access_token;
  const refreshToken: string | undefined = data?.token?.refresh_token;
  if (!accessToken) {
    throw new Error("No access_token in response");
  }
  return { accessToken, refreshToken } as SubscribeLoginResponse;
}

export async function subscribeKakaoExchange(code: string) {
  const res = await fetch(`${BASE_URL}/accounts/kakao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Kakao exchange failed: ${res.status}`);
  }
  const data = await res.json();
  // 구독 액세스 토큰 형태에 맞게 파싱
  const accessToken: string | undefined =
    data?.token?.access_token || data?.accessToken;
  const refreshToken: string | undefined =
    data?.token?.refresh_token || data?.refreshToken;
  if (!accessToken) {
    throw new Error("No access_token in response");
  }
  return { accessToken, refreshToken } as SubscribeLoginResponse;
}

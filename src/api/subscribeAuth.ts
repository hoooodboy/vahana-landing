// import { getAPIHost } from "../utils/getApiHost";

const BASE_URL = "https://alpha.vahana.kr";

export type SubscribeLoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

// 에러 처리 헬퍼 함수
const handleApiError = (status: number, message?: string) => {
  switch (status) {
    case 401:
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    case 403:
      return "접근 권한이 없습니다.";
    case 404:
      return "요청한 리소스를 찾을 수 없습니다.";
    // case 400:
    //   return "잘못된 요청입니다.";
    case 409:
      return "이미 존재하는 이메일입니다.";
    case 429:
      return "너무 많은 요청입니다. 잠시 후 다시 시도해주세요.";
    case 410:
      return "인증 코드가 만료되었습니다.";
    default:
      return message || "인증 처리 중 오류가 발생했습니다.";
  }
};

export async function subscribeLogin(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorMessage = handleApiError(res.status);
    throw new Error(errorMessage);
  }

  const data = await res.json();
  const accessToken: string | undefined = data?.token?.access_token;
  const refreshToken: string | undefined = data?.token?.refresh_token;

  if (!accessToken) {
    throw new Error("No access_token in response");
  }

  return { accessToken, refreshToken } as SubscribeLoginResponse;
}

export async function subscribeKakaoExchange(code: string) {
  const cleanCode = code.replace(/^code=/, "");

  console.log("API 요청 코드:", cleanCode);
  console.log("API 요청 URL:", `${BASE_URL}/accounts/kakao`);

  const res = await fetch(`${BASE_URL}/accounts/kakao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: cleanCode }),
  });

  if (!res.ok) {
    const errorMessage = handleApiError(res.status);
    throw new Error(errorMessage);
  }

  const data = await res.json();
  const accessToken: string | undefined =
    data?.token?.access_token || data?.accessToken;
  const refreshToken: string | undefined =
    data?.token?.refresh_token || data?.refreshToken;

  if (!accessToken) {
    throw new Error("No access_token in response");
  }

  return { accessToken, refreshToken } as SubscribeLoginResponse;
}

// 이메일 인증 코드 발송
export async function sendVerificationCode(email: string) {
  const res = await fetch(`${BASE_URL}/accounts/send-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "email",
      target: email,
    }),
  });

  if (!res.ok) {
    const errorMessage = handleApiError(res.status);
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data;
}

// 이메일 인증 코드 확인
export async function verifyEmailCode(email: string, code: string) {
  const res = await fetch(`${BASE_URL}/accounts/verify-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target: email,
      verification_code: code,
    }),
  });

  if (!res.ok) {
    const errorMessage = handleApiError(res.status);
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data;
}

// 회원가입 응답 타입
export interface SubscribeSignupResponse {
  code: number;
  user: {
    id: number;
    email: string;
    mobile: string;
    name: string;
    username: string;
    ci_verified: boolean;
    birthday: string | null;
    gender: string | null;
    profile_image: string;
    referral_code: string;
    last_access: string;
    created_at: string;
    modified_at: string;
  };
  message: string;
  token: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

// 회원가입
export async function subscribeSignup(
  name: string,
  mobile: string,
  email: string,
  password: string,
  referrerPhone?: string
): Promise<SubscribeSignupResponse> {
  const signupData: any = {
    name,
    mobile,
    email,
    password,
  };

  if (referrerPhone && referrerPhone.trim()) {
    signupData.referrerPhone = referrerPhone.trim();
  }

  const res = await fetch(`${BASE_URL}/accounts/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signupData),
  });

  if (!res.ok) {
    const errorMessage = handleApiError(res.status);
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data;
}

// 토큰 갱신
export async function refreshSubscribeToken(
  refreshToken: string
): Promise<SubscribeSignupResponse> {
  const response = await fetch(`${BASE_URL}/accounts/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Token refresh failed: ${response.status}`);
  }

  return response.json();
}

// 로그아웃
export async function logoutSubscribe(accessToken: string) {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorMessage = handleApiError(res.status);
    throw new Error(errorMessage);
  }

  return res.json();
}

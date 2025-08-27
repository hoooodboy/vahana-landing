const { VITE_API_URL } = import.meta.env;

export const getApiHost = () => {
  // 개발 환경에서는 프록시 사용, 프로덕션에서는 상대 경로 사용
  if (import.meta.env.DEV) {
    return "/api";
  }
  return "https://api.vahana.kr/api";
};

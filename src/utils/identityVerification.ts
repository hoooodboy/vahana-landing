// 본인인증 상태 관리 유틸리티

const IDENTITY_VERIFIED_KEY = "subscribeIdentityVerified";

/**
 * 로컬스토리지에서 본인인증 상태 확인
 * @returns boolean - 인증 완료 여부
 */
export const isIdentityVerified = (): boolean => {
  return localStorage.getItem(IDENTITY_VERIFIED_KEY) === "true";
};

/**
 * 본인인증 완료 상태를 로컬스토리지에 저장
 */
export const setIdentityVerified = (): void => {
  localStorage.setItem(IDENTITY_VERIFIED_KEY, "true");
};

/**
 * 본인인증 상태 초기화 (로그아웃 시 사용)
 */
export const clearIdentityVerification = (): void => {
  localStorage.removeItem(IDENTITY_VERIFIED_KEY);
};

/**
 * 서버 API와 로컬스토리지를 모두 고려한 인증 상태 확인
 * @param serverVerified - 서버에서 받은 ci_verified 값
 * @returns boolean - 최종 인증 상태
 */
export const getFinalVerificationStatus = (
  serverVerified: boolean
): boolean => {
  // 서버에서 인증됨이면 무조건 true
  if (serverVerified) {
    setIdentityVerified(); // 로컬스토리지도 업데이트
    return true;
  }

  // 서버에서 미인증이면 로컬스토리지 확인
  return isIdentityVerified();
};

/**
 * 인증 모달 표시 여부 결정
 * @param serverVerified - 서버에서 받은 ci_verified 값
 * @returns boolean - 모달 표시 여부
 */
export const shouldShowIdentityModal = (serverVerified: boolean): boolean => {
  // 서버에서 인증됨이면 모달 안 보임
  if (serverVerified) {
    return false;
  }

  // 서버에서 미인증이면 로컬스토리지 확인
  return !isIdentityVerified();
};

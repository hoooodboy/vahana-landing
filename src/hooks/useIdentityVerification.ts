import { useState, useEffect } from "react";
import {
  shouldShowIdentityModal,
  setIdentityVerified,
} from "@/src/utils/identityVerification";

interface UseIdentityVerificationProps {
  serverVerified: boolean | undefined;
  isLoading?: boolean;
}

export const useIdentityVerification = ({
  serverVerified,
  isLoading = false,
}: UseIdentityVerificationProps) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 로딩 중이거나 서버 상태가 아직 불확실하면 모달 안 보임
    if (isLoading || serverVerified === undefined) {
      setShowModal(false);
      return;
    }

    // 서버에서 인증됨이면 모달 안 보임
    if (serverVerified) {
      setShowModal(false);
      return;
    }

    // 서버에서 미인증이면 로컬스토리지 확인해서 모달 표시 여부 결정
    const shouldShow = shouldShowIdentityModal(serverVerified);
    setShowModal(shouldShow);
  }, [serverVerified, isLoading]);

  const handleVerificationComplete = () => {
    setIdentityVerified();
    setShowModal(false);
    // 페이지 새로고침으로 서버 상태 동기화
    window.location.reload();
  };

  return {
    showModal,
    handleVerificationComplete,
  };
};

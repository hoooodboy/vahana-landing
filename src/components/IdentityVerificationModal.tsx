import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

interface IdentityVerificationModalProps {
  isVisible: boolean;
  onVerificationComplete?: () => void;
}

const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({
  isVisible,
  onVerificationComplete,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);

  // PortOne V2 SDK 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.portone.io/v2/browser-sdk.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://cdn.portone.io/v2/browser-sdk.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handlePortOneVerification = async () => {
    const token = localStorage.getItem("subscribeAccessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setIsVerifying(true);
      // window.PortOne 객체가 있는지 확인
      const { PortOne } = window;
      if (!PortOne) {
        toast.error("PortOne SDK가 로드되지 않았습니다.");
        return;
      }

      // 본인인증 요청
      const response = await PortOne.requestIdentityVerification({
        // 고객사 storeId로 변경해주세요.
        storeId: "store-3994153d-0f8c-46ef-bea0-9237d4dc101b",
        identityVerificationId: `identity-verification-${crypto.randomUUID()}`,
        // 연동 정보 메뉴의 채널 관리 탭에서 확인 가능합니다.
        channelKey: "channel-key-1149864d-6a99-45f5-ae45-cac497973f23",
        redirectUrl: `${window.location.origin}${window.location.pathname}`,
      });

      // 응답 처리
      if (response.code !== undefined) {
        // 오류 발생
        toast.error(`본인인증 실패: ${response.message}`);
        return;
      }

      // 성공 시 서버로 인증 ID 전송
      const serverResponse = await fetch(
        "https://alpha.vahana.kr/accounts/portone",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            identity_code: response.identityVerificationId,
          }),
        }
      );

      if (serverResponse.ok) {
        // 로컬스토리지에 인증 완료 저장
        localStorage.setItem("subscribeIdentityVerified", "true");
        toast.success("본인인증이 완료되었습니다!");
        onVerificationComplete?.();
      } else {
        // 서버 에러 응답 파싱
        const errorData = await serverResponse.json();
        const errorMessage =
          errorData?.message || "본인인증 처리에 실패했습니다.";
        console.error(
          "본인인증 서버 처리 실패:",
          serverResponse.status,
          errorMessage
        );
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("본인인증 오류:", error);
      toast.error("본인인증 중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isVisible) return null;

  return (
    <ModalOverlay>
      <Modal>
        <Title>본인인증이 필요합니다</Title>
        <Desc>안전한 서비스 이용을 위해 본인인증을 완료해주세요.</Desc>
        <Actions>
          <Button onClick={handlePortOneVerification} disabled={isVerifying}>
            {isVerifying ? "인증 진행중..." : "본인인증 진행하기"}
          </Button>
        </Actions>
        <Note>인증 완료 전까지 이 창은 닫을 수 없습니다.</Note>
      </Modal>
    </ModalOverlay>
  );
};

// 스타일 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Modal = styled.div`
  width: calc(100% - 48px);
  max-width: 420px;
  background: #111;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 24px;
  color: #fff;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 8px;
`;

const Desc = styled.p`
  font-size: 14px;
  color: #c7c4c4;
  margin: 0 0 16px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #8cff20 0%, #7aff1a 100%);
  color: #000;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Note = styled.div`
  margin-top: 12px;
  font-size: 12px;
  color: #c7c4c4;
  text-align: center;
`;

// TypeScript 타입 선언
declare global {
  interface Window {
    PortOne: any;
  }
}

export default IdentityVerificationModal;

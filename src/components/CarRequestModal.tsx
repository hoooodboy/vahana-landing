import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { requestCarModel } from "@/src/api/subscribeUser";

interface CarRequestModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CarRequestModal: React.FC<CarRequestModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [modelName, setModelName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!modelName.trim()) {
      toast.error("차량 모델명을 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("subscribeAccessToken");
    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      await requestCarModel(token, modelName.trim());
      toast.success("차량 요청이 완료되었습니다!");
      setModelName("");
      onClose();
    } catch (error: any) {
      console.error("차량 요청 실패:", error);
      toast.error(error.message || "차량 요청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!isVisible) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>원하는 차량을 요청해보세요</Title>
        <Description>
          구독하고 싶은 차량이 없다면 요청해주세요.
          <br />
          검토 후 서비스에 추가될 예정입니다.
        </Description>

        <InputGroup>
          <InputLabel>차량 모델명 *</InputLabel>
          <Input
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="예: 우라칸, 911 GT3 RS, M4 CSL..."
            disabled={isSubmitting}
          />
        </InputGroup>

        <ButtonGroup>
          <CancelButton onClick={onClose} disabled={isSubmitting}>
            취소
          </CancelButton>
          <SubmitButton
            onClick={handleSubmit}
            disabled={isSubmitting || !modelName.trim()}
          >
            {isSubmitting ? "요청 중..." : "차량 요청하기"}
          </SubmitButton>
        </ButtonGroup>
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
  margin: 0 0 12px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 14px;
  color: #c7c4c4;
  margin: 0 0 24px;
  text-align: center;
  line-height: 1.5;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  border: 2px solid #333;
  border-radius: 16px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
    border-color: #8cff20;
    background: rgba(140, 255, 32, 0.05);
  }

  &:disabled {
    background: #2f2f2f;
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled.button`
  flex: 1;
  height: 48px;
  border: 2px solid #333;
  border-radius: 12px;
  background: transparent;
  color: #c7c4c4;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: #666;
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: ${(props) =>
    props.disabled
      ? "#333"
      : "linear-gradient(135deg, #8cff20 0%, #7aff1a 100%)"};
  color: ${(props) => (props.disabled ? "#666" : "#000")};
  font-size: 16px;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(140, 255, 32, 0.3);
  }
`;

export default CarRequestModal;

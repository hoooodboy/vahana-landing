import React, { useState } from "react";
import styled from "styled-components";
import { usePostApiCarsIdInventory } from "@/src/api/endpoints/cars/cars";
import PCModal from "@/src/components/PCModal";
import { useQueryClient } from "@tanstack/react-query";

interface AddCarInventoryModalProps {
  isOpen: boolean;
  carId: number;
  onCancel: () => void;
  onComplete: () => void;
}

const AddCarInventoryModal: React.FC<AddCarInventoryModalProps> = ({
  isOpen,
  carId,
  onCancel,
  onComplete,
}) => {
  // QueryClient 초기화
  const queryClient = useQueryClient();

  // 차량 재고 추가 Mutation
  const addCarInventoryMutation = usePostApiCarsIdInventory({
    mutation: {
      onSuccess: () => {
        // 차량 상세 정보 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: [`/api/cars/${carId}`],
        });

        // 성공 메시지 표시 (선택사항)
        alert("차량 번호가 성공적으로 추가되었습니다.");

        // 완료 콜백 호출
        onComplete();
      },
      onError: (error) => {
        // 에러 처리
        console.error("차량 재고 추가 실패:", error);
        alert("차량 번호 추가에 실패했습니다.");
      },
    },
  });

  // 새 차량 재고 폼 데이터
  const [formData, setFormData] = useState({
    registration_number: "",
  });

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // 차량 재고 추가 핸들러
  const handleAddInventory = async () => {
    // 입력 유효성 검사
    if (!formData.registration_number) {
      alert("차량 번호를 입력해주세요.");
      return;
    }

    // 차량 번호 형식 검사 (기본적인 한국 자동차 번호판 형식)
    const registrationNumberRegex = /^\d{2,3}[가-힣]\s?\d{4}$/;
    if (
      !registrationNumberRegex.test(
        formData.registration_number.replace(/\s/g, "")
      )
    ) {
      alert("올바른 차량 번호 형식이 아닙니다. (예: 123가 4567)");
      return;
    }

    setIsSubmitting(true);

    try {
      // 차량 재고 추가 뮤테이션 실행
      await addCarInventoryMutation.mutateAsync({
        id: carId.toString(),
        data: {
          registration_number: formData.registration_number,
        },
      });
    } catch (error) {
      // 에러 처리는 mutation onError에서 처리
      setIsSubmitting(false);
    }
  };

  return (
    <PCModal
      isOpen={isOpen}
      setIsOpen={() => (isSubmitting ? null : onCancel())}
    >
      <ModalContent>
        <ModalHeader>
          <h3>차량 번호 추가</h3>
          <CloseButton onClick={() => (isSubmitting ? null : onCancel())}>
            ×
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label htmlFor="registration_number">차량 번호</Label>
            <Input
              id="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="예: 123가 4567"
              disabled={isSubmitting}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CancelButton
            onClick={() => (isSubmitting ? null : onCancel())}
            disabled={isSubmitting}
          >
            취소
          </CancelButton>
          <SubmitButton
            onClick={handleAddInventory}
            disabled={isSubmitting || !formData.registration_number}
          >
            {isSubmitting ? "추가 중..." : "추가"}
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </PCModal>
  );
};

// Styled Components
const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;

  h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #adb5bd;

  &:hover {
    color: #495057;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #495057;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #e9ecef;
  gap: 12px;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: #f1f3f5;
  color: #495057;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #3e4730;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #2b331f;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default AddCarInventoryModal;

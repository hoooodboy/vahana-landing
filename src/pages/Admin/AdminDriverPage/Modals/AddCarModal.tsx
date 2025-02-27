import React, { useState, useRef } from "react";
import styled from "styled-components";
import { usePostApiCars } from "@/src/api/endpoints/cars/cars";
import { usePostApiUpload } from "@/src/api/endpoints/upload/upload";
import PCModal from "@/src/components/PCModal";
import { toast } from "react-toastify";
import { imgView } from "@/src/utils/upload";

interface AddCarModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onComplete: () => void;
}

const AddCarModal: React.FC<AddCarModalProps> = ({
  isOpen,
  onCancel,
  onComplete,
}) => {
  // 차량 이미지 업로드 Mutation
  const uploadMutation = usePostApiUpload({
    mutation: {
      onSuccess: (response: any) => {
        // 업로드된 이미지 URL 설정
        setFormData((prev) => ({
          ...prev,
          image: response.result,
        }));
      },
      onError: () => {
        toast.error("이미지 업로드에 실패했습니다.");
      },
    },
  });

  // 차량 모델 추가 Mutation
  const addCarMutation = usePostApiCars({
    mutation: {
      onSuccess: () => {
        alert("차량이 성공적으로 추가되었습니다.");
        onComplete();
      },
      onError: () => {
        alert("차량 추가에 실패했습니다.");
        setIsSubmitting(false);
      },
    },
  });

  // 새 차량 폼 데이터
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    seats: 4,
    seat_capacity: 4,
  });

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 파일 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "seats" || id === "seat_capacity") {
      // 숫자 필드 처리
      setFormData({
        ...formData,
        [id]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 이미지 업로드 뮤테이션 실행
      uploadMutation.mutate({
        data: {
          image: file,
        },
      });
    }
  };

  // 차량 추가 핸들러
  const handleAddCar = async () => {
    // 유효성 검사
    if (!formData.name) {
      toast.error("차량명을 입력해주세요.");
      return;
    }

    if (!formData.image) {
      toast.error("차량 이미지를 업로드해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addCarMutation.mutateAsync({
        data: {
          ...formData,
        },
      });
    } catch (error) {
      // 에러 처리는 mutation의 onError에서 수행
    }
  };

  return (
    <PCModal
      isOpen={isOpen}
      setIsOpen={() => (isSubmitting ? null : onCancel())}
    >
      <ModalContent>
        <ModalHeader>
          <h3>차량 추가</h3>
          <CloseButton onClick={() => (isSubmitting ? null : onCancel())}>
            ×
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label htmlFor="name">차량명</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="차량명을 입력하세요."
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label>차량 이미지</Label>
            <ImageUploadContainer
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              {formData.image ? (
                <PreviewImage src={imgView(formData.image)} alt="차량 이미지" />
              ) : (
                <PlaceholderText>이미지 업로드</PlaceholderText>
              )}
              <HiddenInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting}
              />
            </ImageUploadContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="seats">좌석 수</Label>
            <Input
              id="seats"
              type="number"
              value={formData.seats}
              onChange={handleChange}
              min={1}
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="seat_capacity">탑승 인원</Label>
            <Input
              id="seat_capacity"
              type="number"
              value={formData.seat_capacity}
              onChange={handleChange}
              min={1}
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
            onClick={handleAddCar}
            disabled={isSubmitting || !formData.name || !formData.image}
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

const ImageUploadContainer = styled.div<{ disabled?: boolean }>`
  width: 100%;
  height: 200px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background-color: #f8f9fa;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const PlaceholderText = styled.span`
  color: #868e96;
  font-size: 14px;
`;

const HiddenInput = styled.input`
  display: none;
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

export default AddCarModal;

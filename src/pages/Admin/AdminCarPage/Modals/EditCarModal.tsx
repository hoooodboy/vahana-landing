import React, { useState, useRef } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import { usePatchApiCarsId } from "@/src/api/endpoints/cars/cars";
import { usePostApiUpload } from "@/src/api/endpoints/upload/upload";
import { toast } from "react-toastify";
import { imgView } from "@/src/utils/upload";

const EditCarModal = ({ isOpen, car, onCancel, onComplete }) => {
  const [formData, setFormData] = useState({
    name: car?.name || "",
    image: car?.image || "",
    seats: car?.seats || 4,
    seat_capacity: car?.seat_capacity || 4,
    status: car?.status || "AVAILABLE",
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // 이미지 업로드 뮤테이션
  const uploadMutation = usePostApiUpload({
    mutation: {
      onSuccess: (response: any) => {
        // 업로드된 이미지 URL 설정
        setFormData((prev) => ({
          ...prev,
          image: response.result,
        }));
        toast.success("이미지가 업로드되었습니다.");
      },
      onError: () => {
        toast.error("이미지 업로드에 실패했습니다.");
      },
    },
  });

  // 차량 업데이트 뮤테이션
  const updateCarMutation = usePatchApiCarsId({
    mutation: {
      onSuccess: () => {
        toast.success("차량 정보가 성공적으로 수정되었습니다.");
        onComplete();
      },
      onError: (error) => {
        console.error("차량 수정 실패:", error);
        toast.error("차량 정보 수정에 실패했습니다.");
        setLoading(false);
      },
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "seats" || name === "seat_capacity"
          ? parseInt(value, 10)
          : value,
    });
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
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

  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.name.trim()) {
      toast.error("차량명을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      await updateCarMutation.mutateAsync({
        id: car.id.toString(),
        data: {
          name: formData.name,
          image: formData.image,
          seats: formData.seats,
          seat_capacity: formData.seat_capacity,
          status: formData.status,
        },
      });
    } catch (error) {
      // 에러는 mutation에서 처리됨
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <PCModal isOpen={isOpen} setIsOpen={() => (loading ? null : onCancel())}>
      <ModalContent>
        <ModalHeader>
          <h3>차량 정보 수정</h3>
          <CloseButton onClick={() => (loading ? null : onCancel())}>
            ×
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label htmlFor="name">차량명</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="차량명을 입력하세요"
              disabled={loading}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>차량 이미지</Label>
            <ImageUploadContainer
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
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
                disabled={loading}
              />
            </ImageUploadContainer>
          </FormGroup>

          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="seats">좌석 수</Label>
              <Input
                type="number"
                id="seats"
                name="seats"
                value={formData.seats}
                onChange={handleInputChange}
                min="1"
                max="10"
                disabled={loading}
              />
            </FormGroup>

            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="seat_capacity">좌석 용량</Label>
              <Input
                type="number"
                id="seat_capacity"
                name="seat_capacity"
                value={formData.seat_capacity}
                onChange={handleInputChange}
                min="1"
                max="10"
                disabled={loading}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="status">상태</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="AVAILABLE">사용 가능</option>
              <option value="UNAVAILABLE">사용 불가</option>
            </Select>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CancelButton
            onClick={() => (loading ? null : onCancel())}
            disabled={loading}
          >
            취소
          </CancelButton>
          <SubmitButton
            onClick={handleSubmit}
            disabled={loading || !formData.name}
          >
            {loading ? "처리 중..." : "수정"}
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </PCModal>
  );
};

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 480px;
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

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #e9ecef;
  gap: 12px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
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

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;

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

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f1f3f5;
  border: 1px solid #ddd;
  color: #495057;

  &:hover:not(:disabled) {
    background: #e9ecef;
  }
`;

const SubmitButton = styled(Button)`
  background: #3e4730;
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background: #2b331f;
  }
`;

export default EditCarModal;

import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { usePostApiDrivers } from "@/src/api/endpoints/drivers/drivers";
import PCModal from "@/src/components/PCModal";

interface DriverAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const DriverAddModal: React.FC<DriverAddModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  // 드라이버 등록 Mutation
  const addDriverMutation = usePostApiDrivers({
    mutation: {
      onSuccess: () => {
        toast("드라이버가 성공적으로 추가되었습니다.");
        onComplete();
      },
      onError: () => {
        toast("드라이버 추가에 실패했습니다.");
      },
    },
  });

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력 필드 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 드라이버 추가 핸들러
  const handleAddDriver = async () => {
    // 유효성 검사
    if (!formData.name) {
      toast("이름을 입력해주세요.");
      return;
    }

    if (!formData.phone) {
      toast("전화번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDriverMutation.mutateAsync({
        data: {
          ...formData,
          fixed_schedule: "",
        },
      });
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <PCModal isOpen={isOpen} setIsOpen={onClose}>
      <ModalContent>
        <ModalHeader>
          <h3>드라이버 정보 수정</h3>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력해주세요."
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="전화번호를 입력해주세요."
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="address">자택</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="자택 정보를 입력해주세요."
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="note">특이사항</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="특이사항을 입력해주세요."
              disabled={isSubmitting}
            />
          </FormGroup>

          {/* <WorkHoursSection>
            <Label>고정 근무 시간</Label>
            {WORK_HOURS.map((workHour) => (
              <WorkHourRow key={workHour.day}>
                <DayLabel>{workHour.day}</DayLabel>
                <TimeLabel>{workHour.time}</TimeLabel>
              </WorkHourRow>
            ))}
          </WorkHoursSection> */}
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose} disabled={isSubmitting}>
            취소
          </CancelButton>
          <SaveButton
            onClick={handleAddDriver}
            disabled={isSubmitting || !formData.name || !formData.phone}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </SaveButton>
        </ModalFooter>
      </ModalContent>
    </PCModal>
  );
};

// Styled Components
const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 500px;
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
  font-size: 24px;
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
  font-weight: 600;
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

const Textarea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;
  resize: none;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const WorkHoursSection = styled.div`
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
`;

const WorkHourRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const DayLabel = styled.span`
  font-size: 14px;
  color: #495057;
`;

const TimeLabel = styled.span`
  font-size: 14px;
  color: #868e96;
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

const SaveButton = styled.button`
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

export default DriverAddModal;

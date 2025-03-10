import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import PCModal from "@/src/components/PCModal";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "대기" },
  { value: "CONFIRMED", label: "확정" },
  { value: "CANCELLED", label: "취소" },
];

interface StatusChangeModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  reservation: any;
  onCancel: () => void;
  onSave: (status: string) => Promise<void>;
}

const InfoChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  setIsOpen,
  reservation,
  onCancel,
  onSave,
}) => {
  // 현재 예약 상태를 기본값으로 설정
  const [selectedStatus, setSelectedStatus] = useState(
    reservation?.status || "PENDING"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 상태 변경 핸들러
  const handleStatusChange = async () => {
    if (selectedStatus === reservation?.status) {
      toast.info("변경된 상태가 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(selectedStatus);
      toast("예약 상태가 성공적으로 변경되었습니다.");
    } catch (error) {
      toast("예약 상태 변경에 실패했습니다.");
      console.error("Status change error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PCModal
      isOpen={isOpen}
      setIsOpen={() => (isSubmitting ? null : setIsOpen(false))}
    >
      <ModalContent>
        <ModalHeader>
          <h3>예약 상태 변경</h3>
          <CloseButton
            onClick={() => (isSubmitting ? null : onCancel())}
            disabled={isSubmitting}
          >
            ×
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>현재 예약 상태</Label>
            <StatusContainer>
              {STATUS_OPTIONS.map((status) => (
                <StatusOption
                  key={status.value}
                  selected={selectedStatus === status.value}
                  onClick={() =>
                    !isSubmitting && setSelectedStatus(status.value)
                  }
                  disabled={isSubmitting}
                >
                  {status.label}
                </StatusOption>
              ))}
            </StatusContainer>
          </FormGroup>

          <DetailsSection>
            <DetailItem>
              <Label>예약 ID</Label>
              <Value>{reservation?.id}</Value>
            </DetailItem>
            <DetailItem>
              <Label>고객명</Label>
              <Value>{reservation?.name}</Value>
            </DetailItem>
            <DetailItem>
              <Label>예약 날짜</Label>
              <Value>{formatDate(reservation?.reserved_date)}</Value>
            </DetailItem>
          </DetailsSection>
        </ModalBody>

        <ModalFooter>
          <CancelButton
            onClick={() => (isSubmitting ? null : onCancel())}
            disabled={isSubmitting}
          >
            취소
          </CancelButton>
          <SaveButton
            onClick={handleStatusChange}
            disabled={isSubmitting || selectedStatus === reservation?.status}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </SaveButton>
        </ModalFooter>
      </ModalContent>
    </PCModal>
  );
};

// 날짜 포맷팅 헬퍼 함수
function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

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

  &:hover:not(:disabled) {
    color: #495057;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #495057;
  font-weight: 600;
`;

const StatusContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const StatusOption = styled.button<{
  selected?: boolean;
  disabled?: boolean;
}>`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid ${(props) => (props.selected ? "#3E4730" : "#e9ecef")};
  background-color: ${(props) => (props.selected ? "#3E4730" : "white")};
  color: ${(props) => (props.selected ? "white" : "#868e96")};
  border-radius: 4px;
  font-size: 14px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.selected ? "#2B331F" : "#f8f9fa")};
  }
`;

const DetailsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Value = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 500;
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

export default InfoChangeModal;

import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { usePatchApiReservationsId } from "@/src/api/endpoints/reservations/reservations";
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
  status: string;
  onCancel: () => void;
  onSave: (status: string) => Promise<void>;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  setIsOpen,
  reservation,
  status,
  onCancel,
  onSave,
}) => {
  // 현재 예약 상태를 기본값으로 설정
  const [selectedStatus, setSelectedStatus] = useState(() => {
    // console.log('Reservation in modal:', reservation);
    return status || "PENDING";
  });

  // 상태 변경 핸들러
  const handleStatusChange = async () => {
    if (selectedStatus === reservation?.status) {
      onCancel();
      return;
    }

    await onSave(selectedStatus);
  };

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalHeader>
          <h3>예약 상태 변경</h3>
          <CloseButton onClick={onCancel}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <StatusContainer>
            {STATUS_OPTIONS.map((status) => (
              <StatusButton
                key={status.value}
                $selected={selectedStatus === status.value}
                onClick={() => setSelectedStatus(status.value)}
              >
                {status.label}
              </StatusButton>
            ))}
          </StatusContainer>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onCancel}>취소</CancelButton>
          <SaveButton
            onClick={handleStatusChange}
            disabled={selectedStatus === reservation?.status}
          >
            저장
          </SaveButton>
        </ModalFooter>
      </ModalContent>
    </PCModal>
  );
};

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

const StatusContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const StatusButton = styled.button<{ $selected?: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid ${(props) => (props.$selected ? "#3E4730" : "#e9ecef")};
  background-color: ${(props) => (props.$selected ? "#3E4730" : "white")};
  color: ${(props) => (props.$selected ? "white" : "#868e96")};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$selected ? "#2B331F" : "#f8f9fa")};
  }

  &:disabled {
    opacity: 0.5;
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

export default StatusChangeModal;

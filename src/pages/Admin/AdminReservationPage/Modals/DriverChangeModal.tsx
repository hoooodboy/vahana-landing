import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import { useGetApiDrivers } from "@/src/api/endpoints/drivers/drivers";

interface DriverChangeModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  reservation: any;
  onCancel: () => void;
  onSave: (driverId: number) => void;
}

const DriverChangeModal: React.FC<DriverChangeModalProps> = ({
  isOpen,
  setIsOpen,
  reservation,
  onCancel,
  onSave,
}) => {
  // 선택된 기사 ID를 상태로 관리
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch drivers from API
  const {
    data: driversData,
    isLoading: driversLoading,
    refetch,
  } = useGetApiDrivers({
    query: {
      enabled: isOpen, // Only fetch when modal is open
      refetchOnWindowFocus: false,
    },
  });

  // 모달이 열릴 때마다 선택된 기사 초기화 및 기사 목록 새로고침
  useEffect(() => {
    if (isOpen) {
      // 기존 데이터가 있으면 해당 driver_id로 설정
      setSelectedDriverId(reservation?.driver_id || null);
      refetch(); // Refetch drivers when modal opens
    }
  }, [isOpen, reservation, refetch]);

  // 기사 목록이 로드된 후, driver 이름으로 ID 찾기 (reservation.driver가 이름인 경우)
  useEffect(() => {
    if (
      isOpen &&
      driversData?.result &&
      !selectedDriverId &&
      reservation?.driver
    ) {
      // 이미 driver_id가 있으면 사용하지 않음
      if (reservation.driver_id) return;

      // driver 이름으로 ID 찾기 시도
      const driverByName = driversData.result.find(
        (driver) => driver.name === reservation.driver
      );

      if (driverByName) {
        setSelectedDriverId(driverByName.id);
      }
    }
  }, [driversData, isOpen, reservation, selectedDriverId]);

  // 선택한 기사가 변경될 때마다 상태 업데이트
  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDriverId(value ? parseInt(value, 10) : null);
  };

  // 적용 버튼 클릭 시
  const handleSave = () => {
    if (selectedDriverId === null) {
      // 선택된 기사가 없는 경우 처리
      alert("기사를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 선택된 기사 ID로 저장
      onSave(selectedDriverId);
      // onSave 함수 내에서 closeDriverModal을 호출하므로 여기선 추가 처리 불필요
    } catch (error) {
      console.error("기사 정보 저장 중 오류 발생:", error);
      setIsSubmitting(false);
    }
  };

  // 현재 선택된 기사의 이름 찾기
  const getSelectedDriverName = () => {
    if (!selectedDriverId || !driversData?.result) return "";

    const selectedDriver = driversData.result.find(
      (driver) => driver.id === selectedDriverId
    );
    return selectedDriver ? selectedDriver.name : "";
  };

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>기사관리</ModalTitle>
        <SelectWrapper>
          {driversLoading ? (
            <LoadingText>기사 목록을 불러오는 중...</LoadingText>
          ) : (
            <Select
              id="driverSelect"
              value={selectedDriverId || ""}
              onChange={handleDriverChange}
              disabled={driversLoading || isSubmitting}
            >
              <option value="">기사를 선택해주세요</option>
              {driversData?.result?.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              )) || (
                <>
                  <option value="1">홍길동</option>
                  <option value="2">김기사</option>
                  <option value="3">이기사</option>
                </>
              )}
            </Select>
          )}
        </SelectWrapper>
        {selectedDriverId && (
          <SelectedInfo>
            선택된 기사: <span>{getSelectedDriverName()}</span>
          </SelectedInfo>
        )}
        <ModalButtons>
          <CancelButton onClick={onCancel} disabled={isSubmitting}>
            취소
          </CancelButton>
          <ConfirmButton
            onClick={handleSave}
            disabled={
              driversLoading || isSubmitting || selectedDriverId === null
            }
          >
            {isSubmitting ? "저장 중..." : "적용"}
          </ConfirmButton>
        </ModalButtons>
      </ModalContent>
    </PCModal>
  );
};

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
`;

const SelectWrapper = styled.div`
  margin-bottom: 16px;
`;

const SelectedInfo = styled.div`
  margin-bottom: 24px;
  font-size: 14px;
  color: #495057;

  span {
    font-weight: 600;
    color: #3e4730;
  }
`;

const LoadingText = styled.div`
  padding: 12px;
  color: #6c757d;
  font-size: 14px;
  text-align: center;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f1f3f5;
  color: #495057;
  border: none;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #3e4730;
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background-color: #2b331f;
  }
`;

export default DriverChangeModal;

import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import { useGetApiCars } from "@/src/api/endpoints/cars/cars";
import { customAxios } from "@/src/api/mutator/customAxios";

interface VehicleChangeModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  reservation: any;
  onCancel: () => void;
  onSave: any;
}

interface CombinedVehicle {
  inventory_id: number;
  car_id: number;
  car_name: string;
  registration_number: string;
}

const VehicleChangeModal: React.FC<VehicleChangeModalProps> = ({
  isOpen,
  setIsOpen,
  reservation,
  onCancel,
  onSave,
}) => {
  // 선택된 차량 ID를 상태로 관리
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [combinedVehicles, setCombinedVehicles] = useState<CombinedVehicle[]>(
    []
  );
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch vehicles from API
  const {
    data: carsData,
    isLoading: carsLoading,
    refetch: refetchCars,
  } = useGetApiCars({
    query: {
      enabled: isOpen, // Only fetch when modal is open
      refetchOnWindowFocus: false,
    },
  });

  // 차량 상세 정보를 가져오는 함수
  const fetchCarDetails = useCallback(async (carId: number) => {
    try {
      const response = await customAxios({
        url: `/api/cars/${carId}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error(`Error fetching details for car ${carId}:`, error);
      return null;
    }
  }, []);

  // 모든 차량의 상세 정보를 가져오는 함수
  const fetchAllCarDetails = useCallback(async () => {
    if (!carsData?.result || carsData.result.length === 0) return;

    setIsLoadingDetails(true);
    try {
      const allVehicles: CombinedVehicle[] = [];

      // 모든 차량에 대해 상세 정보 조회
      const detailPromises = carsData.result.map((car) =>
        fetchCarDetails(car.id)
      );
      const detailsResults = await Promise.all(detailPromises);

      // 결과 처리
      carsData.result.forEach((car, index) => {
        const detailData = detailsResults[index] as any;
        if (detailData?.result && Array.isArray(detailData.result)) {
          // 각 인벤토리 항목과 차량 정보 결합
          detailData.result.forEach((inventory: any) => {
            allVehicles.push({
              inventory_id: inventory.id,
              car_id: car.id,
              car_name: car.name,
              registration_number: inventory.registration_number,
            });
          });
        }
      });

      setCombinedVehicles(allVehicles);
    } catch (error) {
      console.error("Failed to fetch car details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [carsData, fetchCarDetails]);

  // 모달이 열릴 때마다 선택된 차량 초기화 및 차량 목록 새로고침
  useEffect(() => {
    if (isOpen) {
      // 기존에 car_inventory_id가 있으면 해당 ID로 설정
      if (reservation?.car_inventory_id) {
        setSelectedInventoryId(reservation.car_inventory_id);
      } else {
        setSelectedInventoryId(null);
      }
      refetchCars(); // Refetch cars when modal opens
    } else {
      // 모달이 닫힐 때 데이터 초기화
      setCombinedVehicles([]);
    }
  }, [isOpen, reservation, refetchCars]);

  // 차량 목록이 로드된 후 각 차량의 상세 정보 가져오기
  useEffect(() => {
    if (carsData?.result && isOpen) {
      fetchAllCarDetails();
    }
  }, [carsData, isOpen, fetchAllCarDetails]);

  // 선택한 차량이 변경될 때마다 상태 업데이트
  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedInventoryId(value ? parseInt(value, 10) : null);
  };

  // 적용 버튼 클릭 시
  const handleSave = () => {
    if (selectedInventoryId === null) {
      // 선택된 차량이 없는 경우 처리
      alert("차량을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 선택된 인벤토리 ID로 저장
      onSave(selectedInventoryId);
      // onSave 함수 내에서 closeVehicleModal을 호출하므로 여기선 추가 처리 불필요
    } catch (error) {
      console.error("차량 정보 저장 중 오류 발생:", error);
      setIsSubmitting(false);
    }
  };

  // 현재 선택된 차량 정보 표시 - 예약 데이터에서 직접 가져오기
  const getCurrentVehicleInfo = () => {
    // 이미 reservation에 차량 이름과 등록번호가 있는 경우 사용
    if (reservation?.car_name && reservation?.registration_number) {
      return `${reservation.car_name} - ${reservation.registration_number}`;
    }

    // 그렇지 않은 경우 combinedVehicles에서 찾기
    if (selectedInventoryId && combinedVehicles.length > 0) {
      const selected = combinedVehicles.find(
        (vehicle) => vehicle.inventory_id === selectedInventoryId
      );
      if (selected) {
        return `${selected.car_name} - ${selected.registration_number}`;
      }
    }

    return "";
  };

  const isLoading = carsLoading || isLoadingDetails;

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>차량관리</ModalTitle>

        {/* 현재 선택된 차량 정보 표시 */}
        {(reservation?.car_inventory_id || selectedInventoryId) && (
          <CurrentVehicle>
            현재 차량: <span>{getCurrentVehicleInfo()}</span>
          </CurrentVehicle>
        )}

        <SelectWrapper>
          {isLoading ? (
            <LoadingText>차량 목록을 불러오는 중...</LoadingText>
          ) : (
            <Select
              id="vehicleSelect"
              value={selectedInventoryId || ""}
              onChange={handleVehicleChange}
              disabled={isLoading || isSubmitting}
            >
              <option value="">차량을 선택해주세요</option>
              {combinedVehicles.length > 0 ? (
                combinedVehicles.map((vehicle) => (
                  <option
                    key={vehicle.inventory_id}
                    value={vehicle.inventory_id}
                  >
                    {vehicle.car_name} - {vehicle.registration_number}
                  </option>
                ))
              ) : (
                <>
                  <option value="1">ALPHARD - 123가 4567</option>
                  <option value="2">LM 500h ROYAL - 111가 1111</option>
                  <option value="3">LM 500h EXECUTIVE - 222가 2222</option>
                </>
              )}
            </Select>
          )}
        </SelectWrapper>

        <ModalButtons>
          <CancelButton onClick={onCancel} disabled={isSubmitting}>
            취소
          </CancelButton>
          <ConfirmButton
            onClick={handleSave}
            disabled={isLoading || isSubmitting || selectedInventoryId === null}
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
  /* width: 400px; */
  max-width: 100%;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
`;

const CurrentVehicle = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  color: #495057;

  span {
    font-weight: 600;
    color: #3e4730;
  }
`;

const SelectWrapper = styled.div`
  margin-bottom: 24px;
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

export default VehicleChangeModal;

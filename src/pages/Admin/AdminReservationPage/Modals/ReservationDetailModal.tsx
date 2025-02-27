import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import { useGetApiDrivers } from "@/src/api/endpoints/drivers/drivers";

interface ReservationDetailModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  reservation: any;
  onCancel: () => void;
  onSave: (formData: any) => void;
  formatPhoneNumber: (phone: string) => string;
}

interface FormState {
  name: string;
  phone: string;
  pickup_time: string;
  pickup_location: string;
  dropoff_location: string;
  ride_purpose: string;
  luggage_count: number;
  passenger_count: number;
}

const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  isOpen,
  setIsOpen,
  reservation,
  onCancel,
  onSave,
  formatPhoneNumber,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    phone: "",
    pickup_time: "",
    pickup_location: "",
    dropoff_location: "",
    ride_purpose: "",
    luggage_count: 0,
    passenger_count: 0,
  });

  // 원본 데이터를 저장하는 상태 추가
  const [originalData, setOriginalData] = useState<FormState>({
    name: "",
    phone: "",
    pickup_time: "",
    pickup_location: "",
    dropoff_location: "",
    ride_purpose: "",
    luggage_count: 0,
    passenger_count: 0,
  });

  // 기사 데이터 가져오기
  const {
    data: driversData,
    isLoading: driversLoading,
    refetch: refetchDrivers,
  } = useGetApiDrivers({
    query: {
      enabled: isOpen, // Only fetch when modal is open
      refetchOnWindowFocus: false,
    },
  });

  // 모달이 열릴 때마다 폼 데이터 초기화 및 기사 목록 새로고침
  useEffect(() => {
    if (isOpen && reservation) {
      const initialData = {
        name: reservation.name || "",
        phone: formatPhoneNumber(reservation.phone) || "",
        pickup_time: formatDateTimeForInput(reservation.pickup_time) || "",
        pickup_location: reservation.pickup_location || "",
        dropoff_location: reservation.dropoff_location || "",
        driver: reservation.driver || "",
        ride_purpose: reservation.ride_purpose || "",
        luggage_count: reservation.luggage_count || 0,
        passenger_count: reservation.passenger_count || 0,
      };

      setFormData(initialData);
      setOriginalData(initialData);
      refetchDrivers(); // Refetch drivers when modal opens
    }
  }, [isOpen, reservation, refetchDrivers, formatPhoneNumber]);

  // 입력 필드 변경 처리
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;

    // 숫자 필드에 대한 처리
    if (id === "luggage_count" || id === "passenger_count") {
      const numValue = parseInt(value) || 0;
      setFormData((prev) => ({
        ...prev,
        [id]: numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // 변경된 필드만 추출
      const changedFields: Record<string, any> = {};

      // reservation_detail API에 필요한 필드 매핑
      const fieldMapping: { [key: string]: string } = {
        // 예: formData의 'key' => API가 원하는 'key'
        pickup_time: "pickup_time",
        pickup_location: "pickup_location",
        dropoff_location: "dropoff_location",
        ride_purpose: "ride_purpose",
        luggage_count: "luggage_count",
        passenger_count: "passenger_count",
      };

      // 필드 매핑에 있는 키만 확인
      Object.keys(fieldMapping).forEach((key) => {
        // 숫자 타입인 경우
        if (typeof formData[key as keyof FormState] === "number") {
          if (
            formData[key as keyof FormState] !==
            originalData[key as keyof FormState]
          ) {
            changedFields[fieldMapping[key]] = formData[key as keyof FormState];
          }
        }
        // 문자열 타입인 경우
        else if (typeof formData[key as keyof FormState] === "string") {
          // pickup_time 특별 처리 (포맷 변환)
          if (key === "pickup_time") {
            const formattedTime = formatBackendDateTime(formData.pickup_time);
            if (
              formattedTime !== formatBackendDateTime(originalData.pickup_time)
            ) {
              changedFields[fieldMapping[key]] = formattedTime;
            }
          } else if (
            formData[key as keyof FormState] !==
            originalData[key as keyof FormState]
          ) {
            changedFields[fieldMapping[key]] = formData[key as keyof FormState];
          }
        }
      });

      // driver_id는 별도로 처리 (driver 이름이 아닌 ID를 보내야 할 수 있음)
      //   if (formData.driver !== originalData.driver) {
      //     const driverObj = driversData?.result?.find(d => d.name === formData.driver);
      //     if (driverObj) {
      //       changedFields['driver_id'] = driverObj.id;
      //     } else if (formData.driver === "") {
      //       // 기사 선택 해제 시 null로 처리
      //       changedFields['driver_id'] = null;
      //     }
      //   }

      console.log("변경된 필드만 전송:", changedFields);

      // 변경된 필드가 있을 때만 저장 요청
      if (Object.keys(changedFields).length > 0) {
        await onSave(changedFields);
      } else {
        // 변경된 필드가 없으면 취소와 동일하게 처리
        onCancel();
      }
    } catch (error) {
      console.error("예약 정보 저장 중 오류 발생:", error);
      setIsSubmitting(false);
    }
  };

  // 백엔드가 원하는 형식으로 날짜/시간 포맷 변환
  const formatBackendDateTime = (dateTimeStr: string): string => {
    if (!dateTimeStr) return "";

    // "2025-02-24T20:20" -> "2025-02-24 20:20"
    return dateTimeStr.replace("T", " ");
  };

  // 탑승 목적 옵션
  const ridePurposeOptions = [
    { value: "", label: "선택해주세요" },
    { value: "영업", label: "영업" },
    { value: "출장", label: "출장" },
    { value: "관광", label: "관광" },
    { value: "행사", label: "행사" },
    { value: "공항", label: "공항" },
    { value: "기타", label: "기타" },
  ];

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent wide>
        <ModalTitle>예약 정보 수정</ModalTitle>
        <FormGrid>
          <FormGroup>
            <Label htmlFor="name">이름</Label>
            <ReadOnlyInput value={formData.name} disabled={true} readOnly />
            <FieldNote>이름은 변경할 수 없습니다.</FieldNote>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">전화번호</Label>
            <ReadOnlyInput value={formData.phone} disabled={true} readOnly />
            <FieldNote>전화번호는 변경할 수 없습니다.</FieldNote>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="pickup_time">출발 시간</Label>
            <Input
              id="pickup_time"
              type="datetime-local"
              value={formData.pickup_time}
              onChange={handleChange}
              placeholder="출발 시간을 입력하세요"
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="pickup_location">출발지</Label>
            <Input
              id="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="출발지를 입력해주세요."
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="dropoff_location">도착지</Label>
            <Input
              id="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              placeholder="도착지를 입력해주세요"
              disabled={isSubmitting}
            />
          </FormGroup>
          {/* <FormGroup>
            <Label htmlFor="driver">기사</Label>
            <Select 
              id="driver" 
              value={formData.driver}
              onChange={handleChange}
              disabled={driversLoading || isSubmitting}
            >
              <option value="">선택해주세요</option>
              {driversData?.result?.map((driver) => (
                <option key={driver.id} value={driver.name}>
                  {driver.name}
                </option>
              )) || (
                <>
                  <option value="홍길동">홍길동</option>
                  <option value="김기사">김기사</option>
                  <option value="이기사">이기사</option>
                </>
              )}
            </Select>
          </FormGroup> */}
          <FormGroup>
            <Label htmlFor="ride_purpose">탑승 목적</Label>
            <Select
              id="ride_purpose"
              value={formData.ride_purpose}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {ridePurposeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="passenger_count">승객 수</Label>
            <Input
              id="passenger_count"
              type="number"
              min="1"
              max="20"
              value={formData.passenger_count}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="luggage_count">수하물 수</Label>
            <Input
              id="luggage_count"
              type="number"
              min="0"
              max="20"
              value={formData.luggage_count}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormGroup>
        </FormGrid>
        <ModalButtons>
          <CancelButton onClick={onCancel} disabled={isSubmitting}>
            취소
          </CancelButton>
          <ConfirmButton onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : "적용"}
          </ConfirmButton>
        </ModalButtons>
      </ModalContent>
    </PCModal>
  );
};

// Helper function to format datetime for input
function formatDateTimeForInput(dateTimeString: string | undefined): string {
  if (!dateTimeString) return "";

  // Check if the string is already in ISO format or has a 'T' separator
  if (dateTimeString.includes("T")) {
    const date = new Date(dateTimeString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  // Parse string like "2025-02-24 16:13"
  const [datePart, timePart] = dateTimeString.split(" ");
  if (datePart && timePart) {
    return `${datePart}T${timePart}`;
  }

  return "";
}

const ModalContent = styled.div<{ wide?: boolean }>`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: ${(props) => (props.wide ? "700px" : "400px")};
  max-width: 90%;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
  color: #495057;
`;

const Input = styled.input`
  padding: 12px;
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

const ReadOnlyInput = styled(Input)`
  background-color: #f8f9fa;
  color: #6c757d;
`;

const FieldNote = styled.span`
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
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

export default ReservationDetailModal;

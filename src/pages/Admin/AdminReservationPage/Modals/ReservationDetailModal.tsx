import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import {
  useGetApiReservationsId,
  usePatchApiReservationsIdDetail,
} from "@/src/api/endpoints/reservations/reservations";
import { useGetApiDrivers } from "@/src/api/endpoints/drivers/drivers";
import { toast } from "react-toastify";

interface ReservationDetailModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  reservationId: string;
  onSuccess: () => void;
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
  special_requests: string;
}

const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  isOpen,
  setIsOpen,
  reservationId,
  onSuccess,
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
    special_requests: "",
  });

  // 예약 상세 정보 조회 API
  const {
    data: reservationDetailData,
    isLoading: reservationLoading,
    refetch: refetchReservation,
    error: reservationError,
  } = useGetApiReservationsId(reservationId, {
    query: {
      enabled: isOpen && !!reservationId, // Only fetch when modal is open and reservationId exists
      refetchOnWindowFocus: false,
    },
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

  // 예약 상세 정보 수정 API
  const { mutate: updateReservationDetail, isPending: isUpdating } =
    usePatchApiReservationsIdDetail({
      mutation: {
        onSuccess: () => {
          toast("예약 정보가 성공적으로 업데이트되었습니다.");
          setIsSubmitting(false);
          setIsOpen(false);
          onSuccess();
        },
        onError: (error) => {
          toast("예약 정보 업데이트에 실패했습니다.");
          console.error("예약 상세 정보 수정 실패:", error);
          setIsSubmitting(false);
        },
      },
    });

  // 모달이 열릴 때마다 폼 데이터 초기화 및 기사 목록 새로고침
  useEffect(() => {
    if (isOpen && reservationId) {
      console.log("모달 열림, 예약 ID:", reservationId);
      refetchReservation();
      refetchDrivers();
    }
  }, [isOpen, reservationId, refetchReservation, refetchDrivers]);

  // 예약 상세 데이터가 로드되면 폼 데이터 초기화
  useEffect(() => {
    if (reservationDetailData?.result) {
      console.log("예약 상세 데이터 로드됨:", reservationDetailData.result);
      const reservation = reservationDetailData.result;
      const initialData = {
        name: reservation.name || "",
        phone: reservation.phone || "",
        pickup_time: formatDateTimeForInput(reservation.pickup_time) || "",
        pickup_location: reservation.pickup_location || "",
        dropoff_location: reservation.dropoff_location || "",
        ride_purpose: reservation.ride_purpose || "",
        luggage_count: reservation.luggage_count || 0,
        passenger_count: reservation.passenger_count || 0,
        special_requests: reservation.special_requests || "",
      };

      setFormData(initialData);
    } else if (reservationError) {
      console.error("예약 상세 데이터 로드 실패:", reservationError);
      toast("예약 정보를 불러오는데 실패했습니다.");
    }
  }, [reservationDetailData, reservationError]);

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
      // 백엔드에 보낼 전체 데이터 준비
      const dataToSend = {
        name: formData.name,
        phone: formData.phone,
        pickup_time: formatBackendDateTime(formData.pickup_time),
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location,
        ride_purpose: formData.ride_purpose,
        luggage_count: formData.luggage_count,
        passenger_count: formData.passenger_count,
        special_requests: formData.special_requests,
      };

      console.log("전체 데이터 전송:", dataToSend);

      // 데이터 보내기
      updateReservationDetail({
        id: reservationId,
        data: dataToSend,
      });
    } catch (error) {
      console.error("예약 정보 저장 중 오류 발생:", error);
      toast("예약 정보 저장 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
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
    { value: "hospital", label: "병원" },
    { value: "golf", label: "골프" },
    { value: "school", label: "통학" },
    { value: "vip", label: "의전" },
    { value: "private", label: "프라이빗" },
    { value: "moving", label: "이동" },
    { value: "airport", label: "공항" },
    { value: "hotel", label: "호텔" },
    { value: "wedding", label: "웨딩" },
    { value: "etc", label: "기타" },
  ];

  const isLoading = reservationLoading || driversLoading || isUpdating;

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>예약 정보 수정</ModalTitle>
        {isLoading && !formData.name ? (
          <LoadingMessage>데이터를 불러오는 중입니다...</LoadingMessage>
        ) : (
          <>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  disabled={isSubmitting}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="전화번호를 입력하세요"
                  disabled={isSubmitting}
                />
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

            {/* 요청사항 필드 (전체 너비 차지) */}
            <FullWidthFormGroup>
              <Label htmlFor="special_requests">요청사항</Label>
              <TextArea
                id="special_requests"
                value={formData.special_requests}
                // onChange={handleChange}
                placeholder="특별 요청사항을 입력해주세요"
                disabled={true}
                rows={4}
              />
            </FullWidthFormGroup>

            <ModalButtons>
              <CancelButton onClick={handleCancel} disabled={isSubmitting}>
                취소
              </CancelButton>
              <ConfirmButton onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "적용"}
              </ConfirmButton>
            </ModalButtons>
          </>
        )}
      </ModalContent>
    </PCModal>
  );
};

// Helper function to format datetime for input
function formatDateTimeForInput(dateTimeString: string | undefined): string {
  if (!dateTimeString) return "";

  // Check if the string is already in ISO format or has a 'T' separator
  if (dateTimeString.includes("T")) {
    return dateTimeString;
  }

  // Parse string like "2025-02-24 16:13"
  const [datePart, timePart] = dateTimeString.split(" ");
  if (datePart && timePart) {
    return `${datePart}T${timePart}`;
  }

  return "";
}

const ModalContent = styled.div<{ wide?: boolean }>`
  width: 100%;
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  /* width: ${(props) => (props.wide ? "700px" : "400px")}; */
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

const FullWidthFormGroup = styled(FormGroup)`
  grid-column: 1 / -1;
  margin-bottom: 24px;
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

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #6c757d;
  font-size: 16px;
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

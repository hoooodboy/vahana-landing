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

interface ViaLocation {
  time: string;
  location: string;
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
  via_locations: ViaLocation[];
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
    via_locations: [],
  });

  // 원본 예약 데이터 저장용 state
  const [originalReservation, setOriginalReservation] = useState<any>(null);

  // 경유지 수정 관련 state
  const [showViaLocationEditor, setShowViaLocationEditor] = useState(false);
  const [currentViaLocationIndex, setCurrentViaLocationIndex] = useState<
    number | null
  >(null);
  const [viaLocationForm, setViaLocationForm] = useState<ViaLocation>({
    time: "",
    location: "",
  });

  // 예약 상세 정보 조회 API
  const {
    data: reservationDetailData,
    isLoading: reservationLoading,
    refetch: refetchReservation,
    error: reservationError,
  } = useGetApiReservationsId(reservationId, {
    query: {
      enabled: isOpen && !!reservationId,
      refetchOnWindowFocus: false,
    },
  });

  // 드라이버 데이터 가져오기
  const {
    data: driversData,
    isLoading: driversLoading,
    refetch: refetchDrivers,
  } = useGetApiDrivers({
    query: {
      enabled: isOpen,
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

  // 모달이 열릴 때마다 폼 데이터 초기화 및 드라이버 목록 새로고침
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

      // 원본 예약 데이터 저장
      setOriginalReservation(reservation);

      // API 응답 형식에 맞게 경유지 데이터 설정
      // 로그를 추가하여 via_locations 확인
      console.log("경유지 데이터:", reservation.via_locations);
      const viaLocations = Array.isArray(reservation.via_locations)
        ? [...reservation.via_locations] // 얕은 복사를 수행하여 원본 데이터 유지
        : [];
      console.log("파싱된 경유지 데이터:", viaLocations);

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
        via_locations: viaLocations as any,
      };

      console.log("초기화된 폼 데이터:", initialData);
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

  // 경유지 폼 필드 변경 처리
  const handleViaLocationFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setViaLocationForm((prev) => ({
      ...prev,
      [id.replace("via_", "")]: value,
    }));
  };

  // 새 경유지 추가
  const handleAddViaLocation = () => {
    setViaLocationForm({ time: "", location: "" });
    setCurrentViaLocationIndex(null);
    setShowViaLocationEditor(true);
  };

  // 경유지 수정
  const handleEditViaLocation = (index: number) => {
    const viaLocation = formData.via_locations[index];
    console.log("수정할 경유지 데이터:", viaLocation);

    // 경유지 데이터가 없는 경우 예외 처리
    if (!viaLocation) {
      console.error("유효하지 않은 경유지 인덱스:", index);
      toast("경유지 정보를 불러올 수 없습니다.");
      return;
    }

    // input 형식에 맞게 시간 변환
    const formattedTime = formatDateTimeForInput(viaLocation.time);
    console.log("경유지 시간 변환 결과:", formattedTime);

    setViaLocationForm({
      time: formattedTime,
      location: viaLocation.location || "",
    });

    setCurrentViaLocationIndex(index);
    setShowViaLocationEditor(true);
  };

  // 경유지 삭제
  const handleDeleteViaLocation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      via_locations: prev.via_locations.filter((_, i) => i !== index),
    }));
  };

  // 경유지 저장
  const handleSaveViaLocation = () => {
    // 유효성 검사
    if (!viaLocationForm.location) {
      toast("경유지를 입력해주세요.");
      return;
    }

    console.log("저장할 경유지 폼 데이터:", viaLocationForm);

    const newViaLocations = [...formData.via_locations];

    // 날짜/시간 처리
    let timeValue = "";
    if (viaLocationForm.time) {
      // 입력된 시간이 있으면 백엔드가 기대하는 ISO 형식으로 변환
      try {
        // datetime-local에서 받은 "2025-04-28T18:56" 형식을 ISO 형식으로 변환
        const dateObj = new Date(viaLocationForm.time);
        if (!isNaN(dateObj.getTime())) {
          timeValue = dateObj.toISOString(); // "2025-04-28T18:56:00.000Z" 형식
        } else {
          timeValue = viaLocationForm.time; // 파싱 실패 시 원본 값 사용
        }
      } catch (error) {
        console.error("시간 변환 오류:", error);
        timeValue = viaLocationForm.time; // 오류 발생 시 원본 값 사용
      }
    }

    console.log("변환된 시간 값:", timeValue);

    const newViaLocation = {
      time: timeValue,
      location: viaLocationForm.location,
    };

    if (currentViaLocationIndex !== null) {
      // 기존 경유지 수정
      console.log("경유지 수정:", currentViaLocationIndex, newViaLocation);
      newViaLocations[currentViaLocationIndex] = newViaLocation;
    } else {
      // 새 경유지 추가
      console.log("새 경유지 추가:", newViaLocation);
      newViaLocations.push(newViaLocation);
    }

    // 경유지 시간 기준으로 정렬 (시간이 있는 경우)
    newViaLocations.sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

    console.log("최종 경유지 목록:", newViaLocations);

    setFormData((prev) => ({
      ...prev,
      via_locations: newViaLocations,
    }));

    setShowViaLocationEditor(false);
    setViaLocationForm({ time: "", location: "" });
    setCurrentViaLocationIndex(null);
  };

  // 경유지 추가/수정 취소
  const handleCancelViaLocation = () => {
    setShowViaLocationEditor(false);
    setViaLocationForm({ time: "", location: "" });
    setCurrentViaLocationIndex(null);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // via_locations 형식이 백엔드 API가 기대하는 형식과 일치하는지 확인
      // API 응답/요청 양식은 동일한 형식 { time: string, location: string }[] 사용
      console.log("저장할 경유지 데이터:", formData.via_locations);

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
        via_locations: formData.via_locations,
      };

      console.log("전체 데이터 전송:", dataToSend);

      // 데이터 보내기
      updateReservationDetail({
        id: reservationId,
        data: dataToSend as any, // Type assertion을 통해 타입 오류 회피
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

  // 시간 포맷팅
  const formatTime = (timeString: string) => {
    if (!timeString) return "-";

    console.log("포맷할 시간 문자열:", timeString);

    try {
      // ISO 8601 형식 (yyyy-MM-ddTHH:mm:ss.sssZ) 처리
      if (timeString.includes("T")) {
        const date = new Date(timeString);
        if (isNaN(date.getTime())) {
          console.error("Invalid date from ISO string:", timeString);
          return timeString; // 파싱 실패 시 원본 반환
        }

        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
        console.log("ISO 변환 결과:", formattedDate);
        return formattedDate;
      }

      // 이미 "yyyy-MM-dd HH:mm" 형식인 경우
      if (timeString.includes(" ") && timeString.split(" ").length === 2) {
        return timeString;
      }

      // 그 외 형식은 그대로 반환
      return timeString;
    } catch (error) {
      console.error("시간 포맷팅 오류:", error);
      return timeString; // 오류 발생 시 원본 반환
    }
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

  // 경유지 정보 표시
  const renderViaLocations = () => {
    console.log(
      "renderViaLocations 호출됨, 경유지 데이터:",
      formData.via_locations
    );

    if (
      !formData.via_locations ||
      !Array.isArray(formData.via_locations) ||
      formData.via_locations.length === 0
    ) {
      return <EmptyMessage>등록된 경유지가 없습니다.</EmptyMessage>;
    }

    return (
      <ViaLocationsList>
        {formData.via_locations.map((location, index) => (
          <ViaLocationItem key={index}>
            <LocationIcon>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 14S3 9.5 3 6.5C3 3.6 5.2 1.5 8 1.5S13 3.6 13 6.5C13 9.5 8 14 8 14z"
                  stroke="#2196F3"
                  strokeWidth="1.5"
                />
                <circle
                  cx="8"
                  cy="6.5"
                  r="2"
                  stroke="#2196F3"
                  strokeWidth="1.5"
                />
              </svg>
            </LocationIcon>
            <LocationDetails>
              {location && location.time && (
                <LocationTime>{formatTime(location.time)}</LocationTime>
              )}
              <LocationAddress>
                {location && location.location
                  ? location.location
                  : "위치 정보 없음"}
              </LocationAddress>
            </LocationDetails>
            <LocationActions>
              <ActionButton onClick={() => handleEditViaLocation(index)}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    stroke="#4B5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke="#4B5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </ActionButton>
              <ActionButton onClick={() => handleDeleteViaLocation(index)}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6h18"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 11v6M14 11v6"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </ActionButton>
            </LocationActions>
          </ViaLocationItem>
        ))}
      </ViaLocationsList>
    );
  };

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

            {/* 경유지 정보 표시 */}
            <ViaLocationsSection>
              <SectionTitleBar>
                <SectionTitle>경유지 정보</SectionTitle>
                <AddButton
                  onClick={handleAddViaLocation}
                  disabled={isSubmitting || showViaLocationEditor}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  경유지 추가
                </AddButton>
              </SectionTitleBar>

              {showViaLocationEditor ? (
                <ViaLocationEditor>
                  <FormGroup>
                    <Label htmlFor="via_time">경유 시간 (선택사항)</Label>
                    <Input
                      id="via_time"
                      type="datetime-local"
                      value={viaLocationForm.time}
                      onChange={handleViaLocationFormChange}
                      placeholder="경유 시간을 입력하세요"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="via_location">경유지</Label>
                    <Input
                      id="via_location"
                      value={viaLocationForm.location}
                      onChange={handleViaLocationFormChange}
                      placeholder="경유지를 입력하세요"
                    />
                  </FormGroup>
                  <ViaLocationButtonGroup>
                    <SecondaryButton onClick={handleCancelViaLocation}>
                      취소
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSaveViaLocation}>
                      {currentViaLocationIndex !== null ? "수정" : "추가"}
                    </PrimaryButton>
                  </ViaLocationButtonGroup>
                </ViaLocationEditor>
              ) : (
                renderViaLocations()
              )}
            </ViaLocationsSection>

            {/* 요청사항 필드 (전체 너비 차지) */}
            <FullWidthFormGroup>
              <Label htmlFor="special_requests">요청사항</Label>
              <TextArea
                id="special_requests"
                value={formData.special_requests}
                onChange={handleChange}
                placeholder="특별 요청사항을 입력해주세요"
                disabled={isSubmitting}
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

  console.log("input 형식으로 포맷할 시간:", dateTimeString);

  try {
    // ISO 8601 형식 처리 ("2025-04-28T09:56:00.000Z")
    if (dateTimeString.includes("T")) {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date from ISO string:", dateTimeString);
        return ""; // 파싱 실패 시 빈 문자열 반환
      }

      // datetime-local input 요소에 맞는 형식으로 변환 (YYYY-MM-DDTHH:MM)
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      console.log("ISO -> input 형식 변환 결과:", formattedDate);
      return formattedDate;
    }

    // "2025-02-24 16:13" 형식 처리
    if (dateTimeString.includes(" ")) {
      const [datePart, timePart] = dateTimeString.split(" ");
      if (datePart && timePart) {
        const formattedDate = `${datePart}T${timePart}`;
        console.log("문자열 -> input 형식 변환 결과:", formattedDate);
        return formattedDate;
      }
    }

    console.warn("지원되지 않는 날짜 형식:", dateTimeString);
    return "";
  } catch (error) {
    console.error("날짜/시간 변환 오류:", error);
    return "";
  }
}

const ModalContent = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 12px;
  padding: 28px;
  max-width: 100%;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #333;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
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
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3e4730;
    box-shadow: 0 0 0 2px rgba(62, 71, 48, 0.1);
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3e4730;
    box-shadow: 0 0 0 2px rgba(62, 71, 48, 0.1);
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ViaLocationsSection = styled.div`
  margin-bottom: 24px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  background-color: #fcfcfc;
`;

const SectionTitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #495057;
`;

const ViaLocationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ViaLocationItem = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: white;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #eaeaea;
`;

const LocationIcon = styled.div`
  margin-right: 12px;
  margin-top: 2px;
`;

const LocationDetails = styled.div`
  flex: 1;
`;

const LocationActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f3f5;
  }
`;

const LocationTime = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
`;

const LocationAddress = styled.div`
  font-size: 14px;
  color: #333;
`;

const ViaLocationEditor = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ViaLocationButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled.button`
  background-color: #3e4730;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2b331f;
  }
`;

const SecondaryButton = styled.button`
  background-color: #f1f3f5;
  color: #495057;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e9ecef;
  }
`;

const EmptyMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #6c757d;
  font-size: 14px;
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
  border-radius: 6px;
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3e4730;
    box-shadow: 0 0 0 2px rgba(62, 71, 48, 0.1);
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
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f1f3f5;
  color: #495057;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #3e4730;
  color: white;
  box-shadow: 0 2px 4px rgba(62, 71, 48, 0.1);

  &:hover:not(:disabled) {
    background-color: #2b331f;
    box-shadow: 0 2px 6px rgba(62, 71, 48, 0.2);
  }
`;

export default ReservationDetailModal;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import Modal from "@/src/components/Modal";
import styled from "styled-components";

// 경유지 타입 정의
interface ViaLocation {
  location: string;
  time: string;
}

interface FormDataType {
  car_id: number | null;
  name: string;
  phone: string;
  pickup_location: string;
  pickup_time: string;
  via_locations: ViaLocation[]; // 경유지 배열
  dropoff_location: string;
  ride_purpose: string;
  luggage_count: number;
  passenger_count: number;
  special_requests: string;
}

interface FirstStepProps {
  formData: FormDataType;
  selectedDate: string;
  selectedCar: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateFormData: (data: Partial<FormDataType>) => void; // formData 전체 업데이트 함수
}

const ReservationFirstStep: React.FC<FirstStepProps> = ({
  formData,
  selectedDate,
  selectedCar,
  handleChange,
  updateFormData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPickupAddressOpen, setIsPickupAddressOpen] = useState(false);
  const [isDropoffAddressOpen, setIsDropoffAddressOpen] = useState(false);

  // 직접 입력 텍스트 상태
  const [customPickupLocation, setCustomPickupLocation] = useState("");
  const [customDropoffLocation, setCustomDropoffLocation] = useState("");

  // 경유지 관련 상태
  const [currentStopoverIndex, setCurrentStopoverIndex] = useState<number>(-1);
  const [isStopoverAddressOpen, setIsStopoverAddressOpen] = useState(false);
  const [customStopoverLocation, setCustomStopoverLocation] = useState("");

  // 주소 검색 모드 (일반 주소 검색 또는 직접 입력)
  const [pickupSearchMode, setPickupSearchMode] = useState<
    "address" | "direct"
  >("address");
  const [dropoffSearchMode, setDropoffSearchMode] = useState<
    "address" | "direct"
  >("address");
  const [stopoverSearchMode, setStopoverSearchMode] = useState<
    "address" | "direct"
  >("address");

  // via_locations 초기화
  useEffect(() => {
    if (!formData.via_locations) {
      updateFormData({ via_locations: [] });
    }
  }, []);

  // 다음 단계로 진행
  const onNext = () => {
    if (isFormValid()) {
      navigate("/reservation/second", {
        state: {
          selectedCar: {
            id: selectedCar.id,
            name: selectedCar.name,
            seatCapacity: selectedCar.seatCapacity,
            maxSeats: selectedCar.maxSeats,
            image: selectedCar.image,
          },
          selectedDate: selectedDate,
        },
      });
    } else {
      // 폼이 유효하지 않을 때 사용자에게 알림
      alert(
        "모든 필수 항목을 입력해주세요. 경유지를 추가한 경우 경유지 주소와 시간도 입력해야 합니다."
      );
    }
  };

  const handlePickupComplete = (data: any) => {
    const fullAddress = data.address;
    const event = {
      target: {
        name: "pickup_location",
        value: fullAddress,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
    setIsPickupAddressOpen(false);
  };

  const handleDropoffComplete = (data: any) => {
    const fullAddress = data.address;
    const event = {
      target: {
        name: "dropoff_location",
        value: fullAddress,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
    setIsDropoffAddressOpen(false);
  };

  const handleStopoverComplete = (data: any) => {
    const fullAddress = data.address;
    updateStopoverLocation(currentStopoverIndex, fullAddress);
    setIsStopoverAddressOpen(false);
  };

  // 직접 입력한 장소 저장 처리
  const handleCustomLocationConfirm = (
    locationType: "pickup" | "dropoff" | "stopover"
  ) => {
    let location = "";

    if (locationType === "pickup") {
      location = customPickupLocation;
      if (!location.trim()) {
        alert("장소를 입력해주세요.");
        return;
      }
      const event = {
        target: {
          name: "pickup_location",
          value: location,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(event);
      setIsPickupAddressOpen(false);
      setCustomPickupLocation("");
    } else if (locationType === "dropoff") {
      location = customDropoffLocation;
      if (!location.trim()) {
        alert("장소를 입력해주세요.");
        return;
      }
      const event = {
        target: {
          name: "dropoff_location",
          value: location,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(event);
      setIsDropoffAddressOpen(false);
      setCustomDropoffLocation("");
    } else if (locationType === "stopover") {
      location = customStopoverLocation;
      if (!location.trim()) {
        alert("장소를 입력해주세요.");
        return;
      }
      updateStopoverLocation(currentStopoverIndex, location);
      setIsStopoverAddressOpen(false);
      setCustomStopoverLocation("");
    }
  };

  // 경유지 추가
  const addStopover = () => {
    if (formData.via_locations && formData.via_locations.length >= 5) {
      alert("경유지는 최대 5개까지 추가할 수 있습니다.");
      return;
    }

    const newViaLocation: ViaLocation = {
      location: "",
      time: "",
    };

    const updatedViaLocations = [
      ...(formData.via_locations || []),
      newViaLocation,
    ];
    updateFormData({ via_locations: updatedViaLocations });
  };

  // 경유지 삭제
  const removeStopover = (index: number) => {
    if (formData.via_locations) {
      const updatedViaLocations = [...formData.via_locations];
      updatedViaLocations.splice(index, 1);
      updateFormData({ via_locations: updatedViaLocations });
    }
  };

  // 경유지 위치 업데이트
  const updateStopoverLocation = (index: number, location: string) => {
    if (
      formData.via_locations &&
      index >= 0 &&
      index < formData.via_locations.length
    ) {
      const updatedViaLocations = [...formData.via_locations];
      updatedViaLocations[index] = {
        ...updatedViaLocations[index],
        location,
      };
      updateFormData({ via_locations: updatedViaLocations });
    }
  };

  // 경유지 시간 업데이트
  const updateStopoverTime = (index: number, time: string) => {
    if (
      formData.via_locations &&
      index >= 0 &&
      index < formData.via_locations.length
    ) {
      // 날짜 형식 생성
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      // ISO 형식의 날짜 문자열 생성 (YYYY-MM-DDTHH:mm:ss.sssZ)
      const isoDateTime = new Date(
        `${year}-${month}-${day}T${time}:00`
      ).toISOString();

      const updatedViaLocations = [...formData.via_locations];
      updatedViaLocations[index] = {
        ...updatedViaLocations[index],
        time: isoDateTime,
      };
      updateFormData({ via_locations: updatedViaLocations });
    }
  };

  const openStopoverModal = (index: number) => {
    setCurrentStopoverIndex(index);
    setIsStopoverAddressOpen(true);
  };

  const isFormValid = () => {
    const baseValid =
      formData.name.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.pickup_location.trim() !== "" &&
      formData.pickup_time.trim() !== "" &&
      formData.dropoff_location.trim() !== "";

    // 경유지가 있다면 모든 경유지에 위치와 시간이 입력되어 있어야 함
    const viaLocationsValid =
      !formData.via_locations ||
      formData.via_locations.length === 0 ||
      formData.via_locations.every(
        (location) =>
          location.location.trim() !== "" && location.time.trim() !== ""
      );

    return baseValid && viaLocationsValid;
  };

  // 출발 시간 변경 핸들러
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = e.target.value; // HH:mm 형식

    // selectedDate를 YYYY-MM-DD 형식으로 변환
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // YYYY-MM-DD HH:mm 형식으로 결합
    const formattedDateTime = `${year}-${month}-${day} ${selectedTime}`;

    const event = {
      target: {
        name: "pickup_time",
        value: formattedDateTime,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const phoneNumber = value.replace(/[^\d]/g, "");

    // 02로 시작하는 경우 (서울)
    if (phoneNumber.startsWith("02")) {
      if (phoneNumber.length < 3) {
        return phoneNumber;
      } else if (phoneNumber.length < 6) {
        return `${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2)}`;
      } else if (phoneNumber.length < 10) {
        return `${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5)}`;
      } else {
        return `${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    }
    // 휴대폰 번호인 경우
    else {
      if (phoneNumber.length < 4) {
        return phoneNumber;
      } else if (phoneNumber.length < 7) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      } else if (phoneNumber.length < 11) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
      } else {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    const event = {
      target: {
        name: "phone",
        value: formattedPhone,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  // 시간만 추출하는 헬퍼 함수
  const extractTimeOnly = (dateTimeString: string) => {
    if (!dateTimeString) return "";

    // ISO 형식의 날짜인 경우
    if (dateTimeString.includes("T")) {
      const date = new Date(dateTimeString);
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }

    // 공백으로 구분된 날짜/시간 형식인 경우
    const parts = dateTimeString.split(" ");
    return parts.length > 1 ? parts[1] : "";
  };

  return (
    <Container>
      <Form>
        <InputGroup>
          <Label>이름</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력해주세요."
          />
        </InputGroup>

        <InputGroup>
          <Label>전화번호</Label>
          <Input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            maxLength={13}
            placeholder="전화번호를 입력해주세요."
          />
        </InputGroup>

        <InputGroup>
          <Label>출발 시간</Label>
          <Input
            type="time"
            name="pickup_time"
            value={extractTimeOnly(formData.pickup_time)}
            onChange={handleTimeChange}
            placeholder="출발 시간을 입력해주세요."
          />
        </InputGroup>

        <InputGroup>
          <Label>출발지</Label>
          <Input
            type="text"
            name="pickup_location"
            value={formData.pickup_location}
            onClick={() => setIsPickupAddressOpen(true)}
            readOnly
            placeholder="출발지를 입력해주세요."
          />
        </InputGroup>

        {/* 경유지 섹션 */}
        {formData.via_locations && formData.via_locations.length > 0 && (
          <StopoverSection>
            {formData.via_locations.map((location, index) => (
              <StopoverItem key={index}>
                <FlexContainer>
                  <InputGroup $flex={0.65}>
                    <Label>경유지</Label>
                    <Input
                      type="text"
                      value={location.location}
                      onClick={() => openStopoverModal(index)}
                      readOnly
                      placeholder="경유지를 입력해주세요."
                    />
                  </InputGroup>
                  <InputGroup $flex={0.35}>
                    <Label>출발 시간</Label>
                    <Input
                      type="time"
                      value={extractTimeOnly(location.time)}
                      onChange={(e) =>
                        updateStopoverTime(index, e.target.value)
                      }
                      placeholder="시간 선택"
                    />
                  </InputGroup>
                </FlexContainer>
                <RemoveButton onClick={() => removeStopover(index)}>
                  -
                </RemoveButton>
              </StopoverItem>
            ))}
          </StopoverSection>
        )}

        {/* 경유지 추가 버튼 */}
        {(!formData.via_locations || formData.via_locations.length < 5) && (
          <StopoverToggleContainer>
            <StopoverToggleButton type="button" onClick={addStopover}>
              경유지 +
            </StopoverToggleButton>
          </StopoverToggleContainer>
        )}

        <InputGroup>
          <Label>목적지</Label>
          <Input
            type="text"
            name="dropoff_location"
            value={formData.dropoff_location}
            onClick={() => setIsDropoffAddressOpen(true)}
            readOnly
            placeholder="목적지를 입력해주세요."
          />
        </InputGroup>
      </Form>

      {/* 출발지 주소 검색 모달 */}
      <Modal isOpen={isPickupAddressOpen} setIsOpen={setIsPickupAddressOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>출발지 주소 검색</ModalTitle>
            <CloseButton onClick={() => setIsPickupAddressOpen(false)}>
              ×
            </CloseButton>
          </ModalHeader>

          <SearchTypeContainer>
            <SearchTypeButton
              onClick={() => setPickupSearchMode("address")}
              $active={pickupSearchMode === "address"}
            >
              주소로 검색
            </SearchTypeButton>
            <SearchTypeButton
              onClick={() => setPickupSearchMode("direct")}
              $active={pickupSearchMode === "direct"}
            >
              직접 입력
            </SearchTypeButton>
          </SearchTypeContainer>

          {pickupSearchMode === "direct" ? (
            <DirectInputContainer>
              <KeywordInput
                type="text"
                value={customPickupLocation}
                onChange={(e) => setCustomPickupLocation(e.target.value)}
                placeholder="출발지를 직접 입력하세요"
              />
              <ConfirmButton
                onClick={() => handleCustomLocationConfirm("pickup")}
                disabled={!customPickupLocation.trim()}
              >
                확인
              </ConfirmButton>
            </DirectInputContainer>
          ) : (
            <DaumPostcode
              onComplete={handlePickupComplete}
              autoClose={false}
              onClose={() => setIsPickupAddressOpen(false)}
            />
          )}
        </ModalContent>
      </Modal>

      {/* 경유지 주소 검색 모달 */}
      <Modal
        isOpen={isStopoverAddressOpen}
        setIsOpen={setIsStopoverAddressOpen}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>경유지 주소 검색</ModalTitle>
            <CloseButton onClick={() => setIsStopoverAddressOpen(false)}>
              ×
            </CloseButton>
          </ModalHeader>

          <SearchTypeContainer>
            <SearchTypeButton
              onClick={() => setStopoverSearchMode("address")}
              $active={stopoverSearchMode === "address"}
            >
              주소로 검색
            </SearchTypeButton>
            <SearchTypeButton
              onClick={() => setStopoverSearchMode("direct")}
              $active={stopoverSearchMode === "direct"}
            >
              직접 입력
            </SearchTypeButton>
          </SearchTypeContainer>

          {stopoverSearchMode === "direct" ? (
            <DirectInputContainer>
              <KeywordInput
                type="text"
                value={customStopoverLocation}
                onChange={(e) => setCustomStopoverLocation(e.target.value)}
                placeholder="경유지를 직접 입력하세요"
              />
              <ConfirmButton
                onClick={() => handleCustomLocationConfirm("stopover")}
                disabled={!customStopoverLocation.trim()}
              >
                확인
              </ConfirmButton>
            </DirectInputContainer>
          ) : (
            <DaumPostcode
              onComplete={handleStopoverComplete}
              autoClose={false}
              onClose={() => setIsStopoverAddressOpen(false)}
            />
          )}
        </ModalContent>
      </Modal>

      {/* 목적지 주소 검색 모달 */}
      <Modal isOpen={isDropoffAddressOpen} setIsOpen={setIsDropoffAddressOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>목적지 주소 검색</ModalTitle>
            <CloseButton onClick={() => setIsDropoffAddressOpen(false)}>
              ×
            </CloseButton>
          </ModalHeader>

          <SearchTypeContainer>
            <SearchTypeButton
              onClick={() => setDropoffSearchMode("address")}
              $active={dropoffSearchMode === "address"}
            >
              주소로 검색
            </SearchTypeButton>
            <SearchTypeButton
              onClick={() => setDropoffSearchMode("direct")}
              $active={dropoffSearchMode === "direct"}
            >
              직접 입력
            </SearchTypeButton>
          </SearchTypeContainer>

          {dropoffSearchMode === "direct" ? (
            <DirectInputContainer>
              <KeywordInput
                type="text"
                value={customDropoffLocation}
                onChange={(e) => setCustomDropoffLocation(e.target.value)}
                placeholder="목적지를 직접 입력하세요"
              />
              <ConfirmButton
                onClick={() => handleCustomLocationConfirm("dropoff")}
                disabled={!customDropoffLocation.trim()}
              >
                확인
              </ConfirmButton>
            </DirectInputContainer>
          ) : (
            <DaumPostcode
              onComplete={handleDropoffComplete}
              autoClose={false}
              onClose={() => setIsDropoffAddressOpen(false)}
            />
          )}
        </ModalContent>
      </Modal>

      <ButtonContainer>
        <NextButton
          onClick={isFormValid() ? onNext : undefined}
          $isActive={isFormValid()}
        >
          다음
        </NextButton>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding: 16px;
  padding-bottom: 152px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

const InputGroup = styled.div<{ $flex?: number }>`
  display: flex;
  flex-direction: column;
  flex: ${(props) => props.$flex || 1};
`;

const Label = styled.label`
  color: #666;
  font-size: 14px;
  font-weight: 600;
  padding: 8px;
`;

const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid ${(props) => (props.$error ? "#ff0000" : "#c7c7c7")};
  background: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: #666;
  }
  &:disabled {
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
    border-color: ${(props) => (props.$error ? "#ff0000" : "#3e4730")};
  }
`;

// 경유지 관련 스타일
const StopoverSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StopoverItem = styled.div`
  position: relative;
  padding-right: 30px;
  display: flex;
`;

const RemoveButton = styled.button`
  position: absolute;
  right: 0;
  /* top: 50%;
  transform: translateY(-50%); */
  bottom: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f0f0f0;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background: #e0e0e0;
  }
`;

const StopoverToggleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -16px;
`;

const StopoverToggleButton = styled.button`
  background: none;
  border: none;
  color: #3e4730;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    outline: none;
  }
`;

const NextButton = styled.div<{ $isActive: boolean }>`
  width: 100%;
  height: 48px;
  border-radius: 22px;
  background: ${(props) => (props.$isActive ? "#3e4730" : "#c7c7c7")};
  cursor: ${(props) => (props.$isActive ? "pointer" : "not-allowed")};
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  transition: background-color 0.3s ease;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  width: 100%;
  height: 100%;
  min-height: 460px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #adb5bd;
  line-height: 1;

  &:hover {
    color: #495057;
  }
`;

const SearchTypeContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
`;

const SearchTypeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  background: ${(props) => (props.$active ? "#3e4730" : "#f8f9fa")};
  color: ${(props) => (props.$active ? "#ffffff" : "#495057")};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? "#3e4730" : "#e9ecef")};
  }
`;

const DirectInputContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  gap: 16px;
`;

const KeywordInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 10px 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }
`;

const ConfirmButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  background: ${(props) => (props.disabled ? "#c7c7c7" : "#3e4730")};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: 500;
  transition: background-color 0.3s ease;
  align-self: flex-end;
  &:hover {
    background: ${(props) => (props.disabled ? "#c7c7c7" : "#2b331f")};
  }
`;

export default ReservationFirstStep;

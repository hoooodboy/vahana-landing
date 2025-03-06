import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import Modal from "@/src/components/Modal";
import styled from "styled-components";

interface FirstStepProps {
  formData: {
    car_id: number | null;
    name: string;
    phone: string;
    pickup_location: string;
    pickup_time: string;
    dropoff_location: string;
    ride_purpose: string;
    luggage_count: number;
    passenger_count: number;
    special_requests: string;
  };
  selectedDate: string;
  selectedCar: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ReservationFirstStep: React.FC<FirstStepProps> = ({
  formData,
  selectedDate,
  selectedCar,
  handleChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPickupAddressOpen, setIsPickupAddressOpen] = useState(false);
  const [isDropoffAddressOpen, setIsDropoffAddressOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // 직접 입력 텍스트 상태
  const [customPickupLocation, setCustomPickupLocation] = useState("");
  const [customDropoffLocation, setCustomDropoffLocation] = useState("");

  // 주소 검색 모드 (일반 주소 검색 또는 직접 입력)
  const [pickupSearchMode, setPickupSearchMode] = useState<
    "address" | "direct"
  >("address");
  const [dropoffSearchMode, setDropoffSearchMode] = useState<
    "address" | "direct"
  >("address");

  console.log("selectedCar.seats", selectedCar.seats);

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

  // 직접 입력한 장소 저장 처리
  const handleCustomLocationConfirm = (isPickup: boolean) => {
    const location = isPickup ? customPickupLocation : customDropoffLocation;

    if (!location.trim()) {
      alert("장소를 입력해주세요.");
      return;
    }

    const event = {
      target: {
        name: isPickup ? "pickup_location" : "dropoff_location",
        value: location,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(event);

    if (isPickup) {
      setIsPickupAddressOpen(false);
      setCustomPickupLocation("");
    } else {
      setIsDropoffAddressOpen(false);
      setCustomDropoffLocation("");
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.pickup_location.trim() !== "" &&
      formData.pickup_time.trim() !== "" &&
      formData.dropoff_location.trim() !== ""
    );
  };

  // handleTimeChange 함수를 수정
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

        <InputGroup>
          <Label>출발시간</Label>
          <Input
            type="time"
            name="pickup_time"
            value={formData.pickup_time.split(" ")[1] || ""}
            onChange={handleTimeChange}
            placeholder="출발 시간을 입력해주세요."
          />
        </InputGroup>

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
                onClick={() => handleCustomLocationConfirm(true)}
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
                onClick={() => handleCustomLocationConfirm(false)}
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

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
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

const KeywordSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  flex: 1;
  overflow: hidden;
`;

const DirectInputContainer = styled.div`
  /* height: 100%; */
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  gap: 16px;
`;

const SearchInputContainer = styled.div`
  display: flex;
  gap: 8px;
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

const SearchButton = styled.button`
  padding: 0 16px;
  background: #3e4730;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #2b331f;
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

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
`;

const ResultItem = styled.div`
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const ResultTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: #212529;
`;

const ResultAddress = styled.div`
  font-size: 14px;
  color: #6c757d;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: #6c757d;
`;

export default ReservationFirstStep;

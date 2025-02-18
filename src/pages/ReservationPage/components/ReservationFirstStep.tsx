import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import DaumPostcode from "react-daum-postcode";
import Modal from "@/src/components/Modal";

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

  console.log("selectedCar", selectedCar);

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
            maxLength={13} // 하이픈 포함 최대 길이 (02-xxxx-xxxx 또는 010-xxxx-xxxx)
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
            value={formData.pickup_time.split(" ")[1] || ""} // HH:mm 부분만 표시
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

      <Modal isOpen={isPickupAddressOpen} setIsOpen={setIsPickupAddressOpen}>
        <ModalContent>
          <DaumPostcode
            onComplete={handlePickupComplete}
            autoClose={false}
            onClose={() => setIsPickupAddressOpen(false)}
          />
          {/* <CloseButton onClick={() => setIsPickupAddressOpen(false)}>
            닫기
          </CloseButton> */}
        </ModalContent>
      </Modal>

      <Modal isOpen={isDropoffAddressOpen} setIsOpen={setIsDropoffAddressOpen}>
        <ModalContent>
          <DaumPostcode
            onComplete={handleDropoffComplete}
            autoClose={false}
            onClose={() => setIsDropoffAddressOpen(false)}
          />
          {/* <CloseButton onClick={() => setIsDropoffAddressOpen(false)}>
            닫기
          </CloseButton> */}
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
  padding: 20px;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #3e4730;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default ReservationFirstStep;

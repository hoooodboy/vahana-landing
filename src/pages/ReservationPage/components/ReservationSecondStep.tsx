import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import tokens from "@/src/tokens";
import { usePostApiUsersIdReservations } from "@/src/api/endpoints/users/users";
import { CreateReservationDto } from "@/src/api/model";

interface FirstStepProps {
  formData: CreateReservationDto;
  selectedCar: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ReservationSecondStep: React.FC<FirstStepProps> = ({
  formData,
  selectedCar,
  handleChange,
}) => {
  const navigate = useNavigate();
  const { userInfo } = tokens;

  const { mutate: postReservation } = usePostApiUsersIdReservations({
    mutation: {
      onSuccess: () => {
        navigate("/reservation/third");
      },
      onError: (error) => {
        console.error("예약 실패:", error);
      },
    },
  });

  const purposeOptions = [
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

  const luggageOptions = Array.from({ length: 5 }, (_, i) => ({
    value: i,
    label: `${i}개`,
  }));

  const passengerOptions = Array.from(
    { length: selectedCar?.maxSeats + 1 },
    (_, i) => ({
      value: i,
      label: `${i}명`,
    })
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const event = {
      target: {
        name: e.target.name,
        value: e.target.value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const event = {
      target: {
        name: e.target.name,
        value: e.target.value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const isFormValid = () => {
    return (
      formData.ride_purpose !== "" &&
      formData.luggage_count >= 0 &&
      formData.passenger_count > 0
    );
  };

  const onNext = () => {
    if (isFormValid() && userInfo) {
      postReservation({
        id: String(userInfo.id),
        data: formData,
      });
    }
  };

  return (
    <Container>
      <Form>
        <InputGroup>
          <Label>이용 목적</Label>
          <Select
            name="ride_purpose"
            value={formData.ride_purpose}
            onChange={handleSelectChange}
          >
            {purposeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>수하물 개수</Label>
          <Select
            name="luggage_count"
            value={formData.luggage_count}
            onChange={handleSelectChange}
          >
            {luggageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>인원 수</Label>
          <Select
            name="passenger_count"
            value={formData.passenger_count}
            onChange={handleSelectChange}
          >
            {passengerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>요청사항</Label>
          <TextArea
            name="special_requests"
            value={formData.special_requests}
            onChange={handleTextAreaChange}
            placeholder="추가 요청사항을 입력해 주세요."
          />
        </InputGroup>
      </Form>

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

const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #c7c7c7;
  background: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #c7c7c7;
  background: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  resize: none;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
    border-color: #3e4730;
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

export default ReservationSecondStep;

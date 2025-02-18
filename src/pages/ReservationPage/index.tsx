import React, { useState, useEffect, useRef } from "react";
import IcChevronRight from "@/src/assets/ic-chevron-right.svg";
import IcChevronLeft from "@/src/assets/ic-chevron-right.svg";
import styled from "styled-components";

import royal1 from "@/src/assets/royal-1.jpg";
import executive1 from "@/src/assets/executive-1.jpg";
import alphard1 from "@/src/assets/alphard-1.jpg";
import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import { useGetApiCars, useGetApiCarsId } from "@/src/api/endpoints/cars/cars";
import { imgView } from "@/src/utils/upload";
import { useLocation, useNavigate } from "react-router-dom";

interface CarOption {
  name: string;
  seats: string;
  image: string;
  available: boolean;
}

const ReservationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state;
  const selectedCar = locationState?.selectedCar;

  // 선택된 차량 정보가 없으면 예약 페이지로 리다이렉트
  useEffect(() => {
    if (!selectedCar) {
      navigate("/reservation");
    }
  }, [selectedCar, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    id: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    referrerCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          {selectedCar.name}
          <br />
          예약하기
        </Title>
        차량 예약
      </TitleContainer>
      <Form>
        <InputGroup>
          <Label>이름</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="김아무개"
          />
        </InputGroup>
      </Form>
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  padding-top: 56px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 46px 16px 82px;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 16px;
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

const ErrorMessage = styled.span`
  color: #ff0000;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 8px;
`;

const SubmitButton = styled.button<{ $isValid: boolean }>`
  width: 100%;
  height: 48px;
  background: ${(props) => {
    if (props.disabled) return "#e0e0e0";
    return props.$isValid ? "#3e4730" : "#c6c6c6";
  }};
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 40px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;

  &:hover {
    background: ${(props) => {
      if (props.disabled) return "#e0e0e0";
      return props.$isValid ? "#2e3520" : "#b5b5b5";
    }};
  }
`;

const Devider = styled.div`
  height: 150px;
`;

export default ReservationPage;

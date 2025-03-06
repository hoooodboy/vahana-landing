import React, { useState, useMemo } from "react";
import styled from "styled-components";

import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import { useLocation, useParams } from "react-router-dom";
import ReservationFirstStep from "./components/ReservationFirstStep";
import ReservationSecondStep from "./components/ReservationSecondStep";
import ReservationThirdStep from "./components/ReservationThirdStep";

interface CarOption {
  name: string;
  seats: string;
  image: string;
  available: boolean;
}

const ReservationPage: React.FC = () => {
  const location = useLocation();

  const locationState = location.state;
  const selectedDate = locationState?.selectedDate;
  const selectedCar = locationState?.selectedCar;

  // 선택된 차량 정보가 없으면 예약 페이지로 리다이렉트
  // useEffect(() => {
  //   if (!selectedCar) {
  //     navigate("/calendar");
  //   }
  // }, [selectedCar, navigate]);

  const [formData, setFormData] = useState({
    car_id: selectedCar?.id,
    name: "",
    phone: "",
    pickup_location: "",
    pickup_time: "",
    dropoff_location: "",
    ride_purpose: "",
    luggage_count: 0,
    passenger_count: 0,
    special_requests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const params = useParams();

  const __step = params?.step === "first" ? 30 : 100;

  const onStep = () => {
    if (params?.step === "first") return 30;
    if (params?.step === "second") return 75;
  };

  const step = useMemo(() => {
    return {
      key: params?.step ?? "first",
      value: onStep(),
    };
  }, [params, __step]);

  console.log("formData", formData);

  return (
    <Container>
      <Header />
      {step.key !== "third" && (
        <ProgressBarConatiner>
          <ProgressBar>
            <ProgressValue value={step?.value} />
          </ProgressBar>
        </ProgressBarConatiner>
      )}

      {step.key !== "third" && (
        <TitleContainer>
          <Title>
            {selectedCar?.name}
            <br />
            예약하기
          </Title>
          차량 예약
        </TitleContainer>
      )}

      {step.key === "first" && (
        <ReservationFirstStep
          formData={formData}
          selectedDate={selectedDate}
          selectedCar={selectedCar}
          handleChange={handleChange}
        />
      )}
      {step.key === "second" && (
        <ReservationSecondStep
          formData={formData}
          selectedCar={selectedCar}
          handleChange={handleChange}
        />
      )}
      {step.key === "third" && <ReservationThirdStep formData={formData} />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  padding-top: 56px;
  padding-bottom: 261px;
  min-height: 100vh;
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

const ProgressBarConatiner = styled.div`
  width: 100%;
  padding: 0 16px;
  position: absolute;
  top: 56px;
  left: 0;
  z-index: 100;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  /* border-radius: 5px; */
  overflow: hidden;
  position: relative;
  background: #d9d9d9;
  overflow: none;
`;

const ProgressValue = styled.div<{ value: number }>`
  width: ${(p) => (p.value ? `${p.value}%` : "0%")};
  border-radius: 2px;
  max-width: 100%;
  height: 100%;
  position: absolute;
  background: #76865f;
  left: 0;
  top: 0;
  transition: ease-in 0.3s;
`;

export default ReservationPage;

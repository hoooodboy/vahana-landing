import React from "react";
import styled from "styled-components";
import IcCheck from "@/src/assets/ic-check-large.svg";
import { useNavigate } from "react-router-dom";

interface ThirdStepProps {
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
}

const ReservationThirdStep: React.FC<ThirdStepProps> = ({ formData }) => {
  const navigate = useNavigate();

  const handleReservation = () => {
    navigate("/");
  };

  return (
    <Container>
      <IconContainer>
        <img src={IcCheck} alt="check" />
      </IconContainer>
      <Title>예약 신청 완료</Title>
      <SubTitle>
        바하나에서 예약내역 확인 후<br />
        문자로 상세 안내 드립니다.
      </SubTitle>

      <ReservationDetails>
        <InfoItem>
          <Label>이름</Label>
          <Value>{formData.name}</Value>
        </InfoItem>
        <InfoItem>
          <Label>전화번호</Label>
          <Value>{formData.phone}</Value>
        </InfoItem>
        <InfoItem>
          <Label>출발 시간</Label>
          <Value>{formData.pickup_time}</Value>
        </InfoItem>
        <InfoItem>
          <Label>출발지</Label>
          <Value>{formData.pickup_location}</Value>
        </InfoItem>
        <InfoItem>
          <Label>목적지</Label>
          <Value>{formData.dropoff_location}</Value>
        </InfoItem>
        <InfoItem>
          <Label>사용 목적</Label>
          <Value>{formData.ride_purpose}</Value>
        </InfoItem>
        <InfoItem>
          <Label>짐 개수</Label>
          <Value>{formData.luggage_count}개</Value>
        </InfoItem>
        <InfoItem>
          <Label>인원수</Label>
          <Value>{formData.passenger_count}명</Value>
        </InfoItem>
        <InfoItem>
          <Label>특이사항</Label>
          <Value>
            {((formData.special_requests || "-").length > 10
              ? formData.special_requests.slice(0, 10) + "..."
              : formData.special_requests) || "-"}
          </Value>
        </InfoItem>
      </ReservationDetails>

      <HomeButton onClick={handleReservation}>홈으로 가기</HomeButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 52px;
  padding: 0 16px;
  padding-bottom: 152px;

  position: relative;
  flex: 1;
`;

const IconContainer = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  color: #000;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin-top: 28px;
`;

const SubTitle = styled.p`
  color: #000;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
`;

const ReservationDetails = styled.div`
  width: 100%;
  border-top: 1px solid #666;
  padding: 16px 0;
  margin-bottom: 56px;
  margin-top: 42px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  color: #666;
  font-size: 14px;
  font-weight: 600;
`;

const Value = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  text-align: right;
`;

const HomeButton = styled.button`
  width: 100%;
  height: 48px;
  background: #3e4730;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #4a5539;
  }
`;

export default ReservationThirdStep;

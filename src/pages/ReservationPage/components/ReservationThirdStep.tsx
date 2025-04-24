import React from "react";
import styled from "styled-components";
import IcCheck from "@/src/assets/ic-check-large.svg";
import { useNavigate } from "react-router-dom";

// 경유지 타입 정의 추가
interface ViaLocation {
  location: string;
  time: string;
}

interface ThirdStepProps {
  formData: {
    car_id: number | null;
    name: string;
    phone: string;
    pickup_location: string;
    pickup_time: string;
    via_locations?: ViaLocation[]; // 경유지 배열 추가 (선택적)
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

  // 시간 포맷팅 함수
  const formatTime = (timeString: string) => {
    if (!timeString) return "-";

    try {
      // ISO 형식인 경우 (YYYY-MM-DDTHH:mm:ss.sssZ)
      if (timeString.includes("T")) {
        const date = new Date(timeString);
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      }

      // 공백으로 구분된 날짜/시간 형식인 경우
      if (timeString.includes(" ")) {
        return timeString.split(" ")[1];
      }

      // 이미 포맷된 경우
      return timeString;
    } catch (e) {
      return timeString;
    }
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
        <SectionTitle>기본 정보</SectionTitle>
        <InfoItem>
          <Label>이름</Label>
          <Value>{formData.name}</Value>
        </InfoItem>
        <InfoItem>
          <Label>전화번호</Label>
          <Value>{formData.phone}</Value>
        </InfoItem>

        <SectionTitle>이동 정보</SectionTitle>
        <LocationItem>
          <LocationHeader>
            <LocationIcon $type="start">출발</LocationIcon>
            <LocationTime>{formatTime(formData.pickup_time)}</LocationTime>
          </LocationHeader>
          <LocationAddress>{formData.pickup_location}</LocationAddress>
        </LocationItem>

        {/* 경유지 정보 표시 */}
        {formData.via_locations && formData.via_locations.length > 0 && (
          <>
            {formData.via_locations.map((stopover, index) => (
              <LocationItem key={index}>
                <LocationHeader>
                  <LocationIcon $type="via">경유 {index + 1}</LocationIcon>
                  <LocationTime>{formatTime(stopover.time)}</LocationTime>
                </LocationHeader>
                <LocationAddress>{stopover.location}</LocationAddress>
              </LocationItem>
            ))}
          </>
        )}

        <LocationItem>
          <LocationHeader>
            <LocationIcon $type="end">도착</LocationIcon>
          </LocationHeader>
          <LocationAddress>{formData.dropoff_location}</LocationAddress>
        </LocationItem>

        <SectionTitle>추가 정보</SectionTitle>
        <InfoItem>
          <Label>사용 목적</Label>
          <Value>{formData.ride_purpose || "-"}</Value>
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
          <Value>{formData.special_requests || "-"}</Value>
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

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;

  &:first-of-type {
    margin-top: 0;
  }
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

// 위치 정보 관련 스타일
const LocationItem = styled.div`
  margin-bottom: 20px;
  position: relative;

  &:not(:last-child):after {
    content: "";
    position: absolute;
    left: 8px;
    top: 32px;
    bottom: -14px;
    width: 2px;
    background: #ddd;
  }
`;

const LocationHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const LocationIcon = styled.div<{ $type: "start" | "via" | "end" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
  color: white;
  background-color: ${(props) =>
    props.$type === "start"
      ? "#3E4730"
      : props.$type === "via"
        ? "#76865F"
        : "#AEBF9A"};
`;

const LocationTime = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const LocationAddress = styled.div`
  margin-left: 20px;
  padding-left: 18px;
  font-size: 15px;
  color: #333;
  line-height: 1.4;
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

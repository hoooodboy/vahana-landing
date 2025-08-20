import React, { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import Header from "@/src/components/Header";
import tokens from "@/src/tokens";
import { useGetApiUsersIdReservationsReservationId } from "@/src/api/endpoints/users/users";

const ScheduleOperationPage = () => {
  const { userInfo } = tokens;
  const params = useParams();
  // const [isOpen, setIsOpen] = useState(true);
  const isOpen = true;

  const { data: reservationDetail } = useGetApiUsersIdReservationsReservationId(
    userInfo.id,
    params.id,
    {
      query: {
        enabled: !!(userInfo?.id && params.id),
      },
    }
  );

  const formatPickupTime = (pickupTime) => {
    if (!pickupTime) return "-";

    const date = new Date(pickupTime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR");
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    try {
      const date = new Date(timeString);
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch (e) {
      return timeString;
    }
  };

  // reservationDetail.result를 통해 데이터 접근
  const reservationData = reservationDetail?.result;

  // const toggleItem = () => {
  //   setIsOpen(!isOpen);
  // };

  const getPurposeText = (purpose) => {
    const purposeMap = {
      hospital: "병원",
      golf: "골프",
      school: "등하교",
      business: "비즈니스",
      airport: "공항",
      etc: "기타",
    };
    return purposeMap[purpose] || purpose;
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          SCHEDULED
          <br />
          OPERATION
        </Title>
        운행 예약
      </TitleContainer>

      <ContentContainer>
        {!reservationData ? (
          <EmptyState>예약 정보를 불러오는 중입니다...</EmptyState>
        ) : (
          <ReservationItem>
            <ReservationHeader isOpen={isOpen}>
              {/* <ReservationHeader onClick={toggleItem} isOpen={isOpen}> */}
              <HeaderLeft>
                <HeaderDate>
                  {formatDate(reservationData.pickup_time)}
                </HeaderDate>
                <HeaderCar>{reservationData.name}</HeaderCar>
              </HeaderLeft>
              {/* <HeaderIcon>
                {isOpen ? (
                  <ChevronIcon style={{ transform: "rotate(180deg)" }}>
                    ▼
                  </ChevronIcon>
                ) : (
                  <ChevronIcon>▼</ChevronIcon>
                )}
              </HeaderIcon> */}
            </ReservationHeader>

            <ReservationDetails isOpen={isOpen}>
              <Section>
                <SectionTitle>이동 정보</SectionTitle>
                <TripSection>
                  <LocationItem>
                    <LocationHeader>
                      <LocationIcon type="start">출발</LocationIcon>
                      <LocationTime>
                        {formatTime(reservationData.pickup_time)}
                      </LocationTime>
                    </LocationHeader>
                    <LocationAddress>
                      {reservationData.pickup_location}
                    </LocationAddress>
                  </LocationItem>

                  <LocationItem>
                    <LocationHeader>
                      <LocationIcon type="end">도착</LocationIcon>
                    </LocationHeader>
                    <LocationAddress>
                      {reservationData.dropoff_location}
                    </LocationAddress>
                  </LocationItem>
                </TripSection>
              </Section>

              <Section>
                <SectionTitle>기본 정보</SectionTitle>
                <DetailRow>
                  <DetailLabel>이름</DetailLabel>
                  <DetailValue>{reservationData.name}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>전화번호</DetailLabel>
                  <DetailValue>{reservationData.phone}</DetailValue>
                </DetailRow>
              </Section>

              <Section>
                <SectionTitle>추가 정보</SectionTitle>
                <DetailRow>
                  <DetailLabel>사용 목적</DetailLabel>
                  <DetailValue>
                    {getPurposeText(reservationData.ride_purpose)}
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>짐 개수</DetailLabel>
                  <DetailValue>{reservationData.luggage_count}개</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>인원수</DetailLabel>
                  <DetailValue>{reservationData.passenger_count}명</DetailValue>
                </DetailRow>
                {reservationData.special_requests && (
                  <DetailRow>
                    <DetailLabel>특이사항</DetailLabel>
                    <DetailValue>
                      {reservationData.special_requests}
                    </DetailValue>
                  </DetailRow>
                )}
              </Section>

              <StatusBar status="confirmed">예약 확정</StatusBar>
            </ReservationDetails>
          </ReservationItem>
        )}
        <Notice>
          • 운행 일정 변경시 1:1문의 또는 취소 후 재예약 부탁드립니다.
        </Notice>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 !important;
  background: #fff;
  position: relative;
  padding-top: 56px;
  padding-bottom: 338px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 46px 16px 40px;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
  padding-bottom: 40px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #666;
  font-size: 16px;
`;

const ReservationItem = styled.div`
  border-radius: 12px;
  border: 1px solid #eee;
  margin-bottom: 16px;
  overflow: hidden;
`;

const ReservationHeader = styled.div<{ isOpen?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.isOpen ? "#f9f9f9" : "white")};
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeaderDate = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #000000;
`;

const HeaderCar = styled.div`
  font-size: 14px;
  color: #666;
`;

const HeaderIcon = styled.div``;

const ChevronIcon = styled.div`
  color: #666;
  font-size: 12px;
`;

const ReservationDetails = styled.div<{ isOpen?: boolean }>`
  max-height: ${(props) => (props.isOpen ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  padding: ${(props) => (props.isOpen ? "0 16px 16px 16px" : "0")};
`;

const Section = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #3e4730;
  margin: 16px 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #eee;
`;

const TripSection = styled.div`
  margin-bottom: 8px;
`;

const LocationItem = styled.div`
  margin-bottom: 16px;
  position: relative;

  &:not(:last-child):after {
    content: "";
    position: absolute;
    left: 6px;
    top: 24px;
    bottom: -8px;
    width: 2px;
    background: #ddd;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const LocationHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

const LocationIcon = styled.div<{ type?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  margin-right: 8px;
  color: white;
  background-color: ${(props) =>
    props.type === "start"
      ? "#3E4730"
      : props.type === "via"
        ? "#76865F"
        : "#AEBF9A"};
`;

const LocationTime = styled.span`
  font-size: 13px;
  color: #666;
`;

const LocationAddress = styled.div`
  margin-left: 16px;
  font-size: 14px;
  color: #333;
  line-height: 1.3;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 6px 0;
`;

const DetailLabel = styled.div`
  width: 100px;
  font-size: 14px;
  color: #666666;
`;

const DetailValue = styled.div`
  flex: 1;
  font-size: 14px;
  color: #000000;
`;

const StatusBar = styled.div<{ status?: string }>`
  text-align: center;
  padding: 8px;
  margin-top: 16px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  background-color: ${(props) =>
    props.status === "confirmed"
      ? "#EDF7EE"
      : props.status === "pending"
        ? "#FFF9DB"
        : "#FFF0F0"};
  color: ${(props) =>
    props.status === "confirmed"
      ? "#2B8A3E"
      : props.status === "pending"
        ? "#F59F00"
        : "#E03131"};
`;

const Notice = styled.div`
  margin-top: 24px;
  color: #666666;
  font-size: 12px;
`;

export default ScheduleOperationPage;

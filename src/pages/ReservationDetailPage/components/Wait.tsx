import React, { useState } from "react";
import styled from "styled-components";
import IcChevronDown from "@/src/assets/ic-chevron-down.svg";

const Wait = ({ reservations }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // via_locations가 유효한지 확인하는 함수
  const hasValidViaLocations = (viaLocations) => {
    if (!viaLocations || !Array.isArray(viaLocations)) return false;
    if (viaLocations.length === 0) return false;

    // 빈 배열의 배열인지 확인 (예: [[],[]])
    if (viaLocations.every((item) => Array.isArray(item) && item.length === 0))
      return false;

    // 실제 유효한 데이터가 있는지 확인
    return true;
  };

  // 사용 목적 표시 텍스트 변환
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

  // 시간 포맷팅 함수
  const formatTime = (timeString) => {
    if (!timeString) return "-";

    try {
      // YYYY/MM/DD HH:MM 형식
      if (timeString.includes("/")) {
        const parts = timeString.split(" ");
        return parts.length > 1 ? parts[1] : timeString;
      }

      const date = new Date(timeString);
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch (e) {
      return timeString;
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      // YYYY/MM/DD HH:MM 형식
      if (dateString.includes("/")) {
        return dateString.split(" ")[0];
      }

      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Container>
      {reservations.length === 0 ? (
        <EmptyState>확정 대기 중인 예약이 없습니다.</EmptyState>
      ) : (
        reservations?.map((reservation) => (
          <ReservationItem key={reservation.id}>
            <ReservationHeader
              onClick={() => toggleItem(reservation.id)}
              isOpen={openItems.includes(reservation.id)}
            >
              <HeaderLeft>
                <HeaderDate>{formatDate(reservation.pickup_time)}</HeaderDate>
                <HeaderCar>{reservation.car_name}</HeaderCar>
              </HeaderLeft>
              <HeaderIcon>
                {openItems.includes(reservation.id) ? (
                  <img
                    src={IcChevronDown}
                    style={{ transform: "rotate(180deg)" }}
                  />
                ) : (
                  <img src={IcChevronDown} />
                )}
              </HeaderIcon>
            </ReservationHeader>

            <ReservationDetails isOpen={openItems.includes(reservation.id)}>
              <Section>
                <SectionTitle>이동 정보</SectionTitle>
                <TripSection>
                  {/* 출발지 */}
                  <LocationItem>
                    <LocationHeader>
                      <LocationIcon type="start">출발</LocationIcon>
                      <LocationTime>
                        {formatTime(reservation.pickup_time)}
                      </LocationTime>
                    </LocationHeader>
                    <LocationAddress>
                      {reservation.pickup_location}
                    </LocationAddress>
                  </LocationItem>

                  {/* 경유지는 데이터가 유효할 때만 표시 */}
                  {hasValidViaLocations(reservation.via_locations) && (
                    <LocationItem>
                      <LocationHeader>
                        <LocationIcon type="via">경유</LocationIcon>
                      </LocationHeader>
                      <LocationAddress>경유지 정보</LocationAddress>
                    </LocationItem>
                  )}

                  {/* 도착지 */}
                  <LocationItem>
                    <LocationHeader>
                      <LocationIcon type="end">도착</LocationIcon>
                    </LocationHeader>
                    <LocationAddress>
                      {reservation.dropoff_location}
                    </LocationAddress>
                  </LocationItem>
                </TripSection>
              </Section>

              <Section>
                <SectionTitle>기본 정보</SectionTitle>
                <DetailRow>
                  <DetailLabel>이름</DetailLabel>
                  <DetailValue>{reservation.name}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>전화번호</DetailLabel>
                  <DetailValue>{reservation.phone}</DetailValue>
                </DetailRow>
              </Section>

              <Section>
                <SectionTitle>추가 정보</SectionTitle>
                <DetailRow>
                  <DetailLabel>사용 목적</DetailLabel>
                  <DetailValue>
                    {getPurposeText(reservation.ride_purpose)}
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>짐 개수</DetailLabel>
                  <DetailValue>{reservation.luggage_count}개</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>인원수</DetailLabel>
                  <DetailValue>{reservation.passenger_count}명</DetailValue>
                </DetailRow>
                {reservation.special_requests && (
                  <DetailRow>
                    <DetailLabel>특이사항</DetailLabel>
                    <DetailValue>{reservation.special_requests}</DetailValue>
                  </DetailRow>
                )}
              </Section>

              <StatusBar $status="pending">확정 대기</StatusBar>
            </ReservationDetails>
          </ReservationItem>
        ))
      )}
      <Notice>
        • 운행 일정 변경시 1:1문의 또는 취소 후 재예약 부탁드립니다.
      </Notice>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 0;
  padding-bottom: 152px;
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

const ReservationHeader = styled.div<{ isOpen: boolean }>`
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

const HeaderIcon = styled.div`
  color: #666666;
`;

const ReservationDetails = styled.div<{ isOpen: boolean }>`
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

const StatusBar = styled.div<{ $status: string }>`
  text-align: center;
  padding: 8px;
  margin-top: 16px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  background-color: ${(props) =>
    props.$status === "confirmed"
      ? "#EDF7EE"
      : props.$status === "pending"
        ? "#FFF9DB"
        : "#FFF0F0"};
  color: ${(props) =>
    props.$status === "confirmed"
      ? "#2B8A3E"
      : props.$status === "pending"
        ? "#F59F00"
        : "#E03131"};
`;

const Notice = styled.div`
  margin-top: 24px;
  color: #666666;
  font-size: 12px;
`;

export default Wait;

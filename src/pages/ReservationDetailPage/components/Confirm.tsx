import React, { useState } from "react";
import styled from "styled-components";
import IcChevronDown from "@/src/assets/ic-chevron-down.svg";

const Confirm = ({ reservations }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <Container>
      {reservations?.map((reservation) => (
        <ReservationItem key={reservation.id}>
          <ReservationHeader
            onClick={() => toggleItem(reservation.id)}
            isOpen={openItems.includes(reservation.id)}
          >
            <HeaderDate>{formatDate(reservation.pickup_time)}</HeaderDate>
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
            <DetailRow>
              <DetailLabel>이름</DetailLabel>
              <DetailValue>{reservation.name}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>전화번호</DetailLabel>
              <DetailValue>{reservation.phone}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>출발 시간</DetailLabel>
              <DetailValue>{formatTime(reservation.pickup_time)}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>출발지</DetailLabel>
              <DetailValue>{reservation.pickup_location}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>목적지</DetailLabel>
              <DetailValue>{reservation.dropoff_location}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>사용 목적</DetailLabel>
              <DetailValue>{reservation.ride_purpose}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>짐 개수</DetailLabel>
              <DetailValue>{reservation.luggage_count}개</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>인원수</DetailLabel>
              <DetailValue>{reservation.passenger_count}명</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>차량</DetailLabel>
              <DetailValue>{reservation.car_name}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>특이사항</DetailLabel>
              <DetailValue>{reservation.special_requests || "-"}</DetailValue>
            </DetailRow>
          </ReservationDetails>
        </ReservationItem>
      ))}
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

const ReservationItem = styled.div`
  border-bottom: 1px solid #eeeeee;
`;

const ReservationHeader = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
`;

const HeaderDate = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
`;

const HeaderIcon = styled.div`
  color: #666666;
`;

const ReservationDetails = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  padding: ${(props) => (props.isOpen ? "0 0 16px 0" : "0")};
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
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

const Notice = styled.div`
  margin-top: 24px;
  color: #666666;
  font-size: 12px;
`;

export default Confirm;

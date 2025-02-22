import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import Header from "@/src/components/Header";
import tokens from "@/src/tokens";
import { useGetApiUsersIdReservationsReservationId } from "@/src/api/endpoints/users/users";

const ScheduleOperationPage = () => {
  const { userInfo } = tokens;
  const params = useParams();

  const { data: reservationDetail } = useGetApiUsersIdReservationsReservationId(
    userInfo.id,
    params.id,
    {
      query: {
        enabled: !!(userInfo?.id && params.id),
      },
    }
  );

  const formatPickupTime = (pickupTime: string) => {
    if (!pickupTime) return "-";

    const date = new Date(pickupTime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // reservationDetail.result를 통해 데이터 접근
  const reservationData = reservationDetail?.result as any;

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
        <ContainertTitle>{reservationData?.car_name}</ContainertTitle>
        <ContentBlock>
          <ContentWrapper>
            <ContentTitle>이름</ContentTitle>
            {reservationData?.name}
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>전화번호</ContentTitle>
            {reservationData?.phone}
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>출발 시간</ContentTitle>
            {formatPickupTime(reservationData?.pickup_time)}
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>출발지</ContentTitle>
            {reservationData?.pickup_location}
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>목적지</ContentTitle>
            {reservationData?.dropoff_location}
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>사용목적</ContentTitle>
            {reservationData?.ride_purpose}
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>짐 개수</ContentTitle>
            {reservationData?.luggage_count}개
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>인원 수</ContentTitle>
            {reservationData?.passenger_count}명
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>특이사항</ContentTitle>
            {reservationData?.special_requests || "-"}
          </ContentWrapper>
        </ContentBlock>
      </ContentContainer>
      <Notice>
        * 운행 일정 변경시 1:1문의 또는 취소 후 재예약 부탁드립니다.
      </Notice>
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
  padding-bottom: 215px;
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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 16px;
`;

const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ContainertTitle = styled.div`
  color: #000;
  font-size: 20px;
  font-weight: 700;
`;

const ContentTitle = styled.div`
  width: 100px;
  color: #666;
  font-size: 16px;
  font-weight: 500;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #000;
  font-size: 16px;
  font-weight: 400;
`;

const Notice = styled.div`
  margin-top: 68px;
  padding: 0 16px 152px 16px;
  color: #666;
  font-size: 12px;
  font-weight: 500;
`;

export default ScheduleOperationPage;

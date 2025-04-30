import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import Header from "@/src/components/Header";
import tokens from "@/src/tokens";
import {
  useGetApiUsersId,
  useGetApiUsersIdReservationsReservationId,
} from "@/src/api/endpoints/users/users";

const UserPage = () => {
  const { userInfo } = tokens;
  const params = useParams();

  const { data: userData, refetch } = useGetApiUsersId(userInfo.id);

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "-";

    // 숫자만 추출
    const number = phone.replace(/[^0-9]/g, "");

    // 지역번호 (02, 03x, 04x, 05x, 06x) 확인
    const isAreaCode = /^(02|0[3-6][1-5])/.test(number);

    if (isAreaCode) {
      // 지역번호가 02인 경우
      if (number.startsWith("02")) {
        return number.length === 9
          ? number.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3")
          : number.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
      }
      // 다른 지역번호의 경우
      return number.length === 10
        ? number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        : number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }

    // 휴대폰 번호
    return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          USER
          <br />
          INFO
        </Title>
        정보 관리
      </TitleContainer>

      <ContentContainer>
        <ContainertTitle>기본 정보</ContainertTitle>
        <ContentBlock>
          <ContentWrapper>
            <ContentTitle>이름</ContentTitle>
            {userData?.result?.name}
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>전화번호</ContentTitle>
            {formatPhoneNumber(userData?.result?.phone)}
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>운행 횟수</ContentTitle>
            {userData?.result?.reservations}
          </ContentWrapper>

          <ContentWrapper>
            <ContentTitle>잔여 티켓</ContentTitle>
            {userData?.result?.tickets}
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
  padding-bottom: 317px;
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

export default UserPage;

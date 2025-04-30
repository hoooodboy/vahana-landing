import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Header from "@/src/components/Header";
import tokens from "@/src/tokens";
import { useGetApiUsersIdReservations } from "@/src/api/endpoints/users/users";
import Confirm from "./components/Confirm";
import Wait from "./components/Wait";
import Cancle from "./components/Cancle";

const RESERVATION_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
};

const NAV_MAP = {
  "확정 대기": RESERVATION_STATUS.PENDING,
  "예약 확정": RESERVATION_STATUS.CONFIRMED,
  취소: RESERVATION_STATUS.CANCELLED,
};

const ReservationDetailPage = () => {
  const { userInfo } = tokens;
  const [activeNav, setActiveNav] = useState("확정 대기");

  const { data: reservationData } = useGetApiUsersIdReservations(
    userInfo.id,
    {
      status: NAV_MAP[activeNav],
    },
    {
      query: {
        enabled: !!userInfo?.id,
      },
    }
  );

  const NAV_LIST = [
    {
      title: "확정 대기",
      contents: <Wait reservations={reservationData?.result || []} />,
    },
    {
      title: "예약 확정",
      contents: <Confirm reservations={reservationData?.result || []} />,
    },
    {
      title: "취소",
      contents: <Cancle reservations={reservationData?.result || []} />,
    },
  ];

  const onActiveNav = (item: string) => {
    setActiveNav(item);
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

      <NavBlock>
        {NAV_LIST?.map((nav, index) => (
          <Nav
            key={index}
            isActive={activeNav === nav.title}
            onClick={() => onActiveNav(nav.title)}
          >
            {nav.title}
          </Nav>
        ))}
      </NavBlock>

      {NAV_LIST?.map((nav, index) => (
        <NavContents isActive={nav.title === activeNav} key={index}>
          {nav.contents}
        </NavContents>
      ))}
    </Container>
  );
};

// Styled components...
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

const NavBlock = styled.div`
  width: 100%;
  display: flex;
  box-sizing: border-box;
  border-bottom: 2px solid #c7c7c7;
  background: #fff;
`;

const Nav = styled.div<{ isActive: boolean }>`
  width: 100%;
  /* max-width: 130px; */
  padding: 8px;
  color: ${(p) => (p.isActive ? "#3E4730" : "#C7C7C7")};
  border-bottom: 2px solid ${(p) => (p.isActive ? "#3E4730" : "transparent")};
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  position: relative;
  bottom: -2px;
  cursor: pointer;
  transition: 0.1s all ease-in;
`;

const NavContents = styled.div<{ isActive: boolean }>`
  display: ${(p) => (p.isActive ? "flex" : "none")};
  width: 100%;
  flex: 1;
  position: relative;
  padding: 0 16px;
`;

export default ReservationDetailPage;

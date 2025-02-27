import React, { useEffect, useState } from "react";
import styled from "styled-components";

import LogoImg from "@/src/assets/ic-vahana-white.png";
import LmImg from "@/src/assets/img-lm500h.png";
import { Link } from "react-router-dom";

const Cancle = () => {
  const menuData = [
    {
      title: "회원 관리",
      link: "/admin/user",
    },
    {
      title: "예약 관리",
      link: "/admin/reservation",
    },
    {
      title: "차량 관리",
      link: "/admin/cars",
    },
    {
      title: "드라이버 관리",
      link: "/admin/driver",
    },
  ];

  return <Container>Cancle</Container>;
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  position: relative;
  display: flex;
`;

export default Cancle;

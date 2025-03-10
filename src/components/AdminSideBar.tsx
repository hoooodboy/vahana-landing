import React from "react";
import styled from "styled-components";

import LogoImg from "@/src/assets/ic-vahana-white.png";
import { Link } from "react-router-dom";

const AdminSideBar = () => {
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
      title: "차량 예약 관리",
      link: "/admin/car-calendar",
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

  return (
    <SideBarContainer>
      <Logo src={LogoImg} />
      <MenuBlock>
        {menuData.map((menu) => (
          <Menu
            to={menu.link}
            isActive={window.location.pathname === menu.link}
          >
            {menu.title}
          </Menu>
        ))}
      </MenuBlock>
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
  width: 250px;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #151711;
  padding: 50px 0;
`;

const MenuBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 180px;
`;

const Menu = styled(Link)<{ isActive?: boolean }>`
  background: ${(p) => p.isActive && "rgba(255, 255, 255, 0.15)"};

  width: 100%;
  height: 46px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  border-top: 1px solid #fff;
  text-decoration: none;
  color: #fff;
  font-size: 18px;
  font-weight: 300;

  &:last-child {
    border-bottom: 1px solid #fff;
  }
`;

const Logo = styled.img`
  width: 160px;
  height: 28px;
`;

export default AdminSideBar;

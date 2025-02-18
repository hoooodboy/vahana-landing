import React, { useEffect, useState } from "react";
import styled from "styled-components";

import LogoImg from "@/src/assets/ic-vahana-white.png";
import LmImg from "@/src/assets/img-lm500h.png";
import { Link } from "react-router-dom";
import Confirm from "./components/Confirm";
import Wait from "./components/Wait";
import Cancle from "./components/Cancle";
import { useGetApiAdminUsers } from "@/src/api/endpoints/users/users";

const AdminHomePage = () => {
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

  const NAV_LIST = [
    {
      title: "예약 확정",
      contents: <Confirm />,
    },
    {
      title: "확정 대기",
      contents: <Wait />,
    },
    {
      title: "취소",
      contents: <Cancle />,
    },
  ];

  const [activeNav, setActiveNav] = useState("예약 확정");
  const onActiveNav = (item: string) => {
    setActiveNav(item);
  };

  return (
    <Container>
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
      <Section>
        <SectionTitle>예약 관리</SectionTitle>
        <NavBlock>
          {NAV_LIST?.map((nav: any, index: number) => (
            <Nav
              key={index}
              isActive={activeNav === nav.title}
              onClick={() => onActiveNav(nav.title)}
            >
              {/* {nav.value} */}
              {/* <NavTitle isActive={activeNav === nav.title}> */}
              {nav.title}
              {/* </NavTitle> */}
            </Nav>
          ))}
        </NavBlock>

        {NAV_LIST?.map((nav: any, index: number) => (
          <NavContents isActive={nav.title === activeNav} key={index}>
            {nav.contents}
          </NavContents>
        ))}
      </Section>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fffbf1;
  position: relative;
  display: flex;
`;

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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 !important;

  min-height: 200vh;
  padding: 60px;
`;

const SectionTitle = styled.div`
  color: #000;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 100px;
`;

const NavBlock = styled.div`
  width: 100%;
  display: flex;

  /* padding: 0 16px; */
  box-sizing: border-box;
  border-bottom: 2px solid #c7c7c7;

  background: #fff;
`;

const Nav = styled.div<{ isActive: boolean }>`
  width: 130px;
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
`;

export default AdminHomePage;

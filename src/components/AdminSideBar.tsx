import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import LogoImg from "@/src/assets/ic-vahana-white.png";

// 타입 정의
interface MenuItemProps {
  title: string;
  link: string;
}

interface StyledProps {
  $isActive?: boolean;
}

const AdminSideBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const menuData: MenuItemProps[] = [
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <SideBarContainer>
      <SideBarHeader>
        <Link to="/">
          <Logo src={LogoImg} alt="Vahana Logo" />
        </Link>
        <HamburgerButton onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </HamburgerButton>
      </SideBarHeader>

      <MenuBlock $isOpen={menuOpen}>
        {menuData.map((menu, index) => (
          <Menu
            key={index}
            to={menu.link}
            $isActive={window.location.pathname === menu.link}
            onClick={closeMenu}
          >
            {menu.title}
          </Menu>
        ))}
      </MenuBlock>
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
  min-width: 250px;
  width: 250px;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: #151711;
  padding: 50px 0;

  @media (max-width: 768px) {
    min-width: 100%;
    width: 100%;
    height: auto;
    position: fixed;
    padding: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const SideBarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 100%;

  @media (max-width: 768px) {
    justify-content: space-between;
    padding: 15px 20px;
  }
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: none;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MenuBlock = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 180px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    margin-top: 0;
    display: ${(props) => (props.$isOpen ? "flex" : "none")};
  }
`;

const Menu = styled(Link)<StyledProps>`
  background: ${(props) =>
    props.$isActive ? "rgba(255, 255, 255, 0.15)" : "transparent"};
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
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:last-child {
    border-bottom: 1px solid #fff;
  }

  @media (max-width: 768px) {
    height: 50px;
    font-size: 16px;
  }
`;

const Logo = styled.img`
  width: 160px;
  height: 28px;

  @media (max-width: 768px) {
    width: 120px;
    height: 21px;
  }
`;

export default AdminSideBar;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LogoImg from "@/src/assets/ic-vahana-white.png";
import LogoDarkImg from "@/src/assets/ic-vahana-black.png";
import icBurgerSvg from "@/src/assets/ic-burger.svg";
import icBurgerBlackSvg from "@/src/assets/ic-burger-black.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LocalStorage from "../local-storage";
import { useRootPage } from "../contexts/RootPageContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleRootPage, isUck } = useRootPage();

  const isLoggedIn = LocalStorage.get("accessToken");
  const isHomePage = location.pathname === "/";
  const isScrolledOrMenuOpen = scrolled || isMenuOpen;
  const isWhite = isHomePage && !scrolled;

  // 현재 페이지에 따른 selectedIndex 계산
  const getSelectedIndex = () => {
    if (location.pathname === "/info") return 0;
    if (location.pathname === "/cars") return 1;
    if (location.pathname === "/faqs") return 2;
    return -1;
  };

  const selectedIndex = getSelectedIndex();

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setScrolled(scrollY >= 500);
    const progress = Math.min(scrollY / 500, 1);
    setScrollProgress(progress);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleToggleRoot = () => {
    toggleRootPage();
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  // 현재 도메인에서 subscribe 서브도메인으로 이동
  const goToSubscribe = () => {
    const { host, protocol } = window.location;
    const base = host.replace(/^([^.]+\.)?/, "subscribe.");
    window.location.href = `${protocol}//${base}/#/cars`;
  };

  return (
    <>
      <StyledContainer $scrolled={scrolled} $isMenuOpen={isMenuOpen}>
        <HeaderContainer>
          {/* 상단 56px 영역 */}
          <TopRow>
            <LogoLink to="/cars">
              <Logo src={isWhite ? LogoImg : LogoDarkImg} $isWhite={isWhite} />
            </LogoLink>
            <TopRightSection>
              <ToggleTab $isWhite={isWhite}>
                <ToggleButton active={false} onClick={goToSubscribe}>
                  구독
                </ToggleButton>
                <ToggleButton active={true} onClick={() => {}}>
                  의전
                </ToggleButton>
              </ToggleTab>
              {/* <BurgerButton onClick={toggleMenuOpen} $isWhite={isWhite}>
                <BurgerIcon
                  src={isWhite ? icBurgerSvg : icBurgerBlackSvg}
                  alt="menu"
                />
              </BurgerButton> */}
            </TopRightSection>
          </TopRow>

          {/* 하단 30px 영역 */}
          <BottomRow>
            <MenuContainer>
              <StyledMenuItem
                to="/"
                $scrolled={isScrolledOrMenuOpen}
                $isWhite={isWhite}
                $isActive={selectedIndex === 0}
              >
                서비스 소개
              </StyledMenuItem>
              <StyledMenuItem
                to="/cars"
                $scrolled={isScrolledOrMenuOpen}
                $isWhite={isWhite}
                $isActive={selectedIndex === 1}
              >
                차고
              </StyledMenuItem>
              <StyledMenuItem
                to="/pricing"
                $scrolled={isScrolledOrMenuOpen}
                $isWhite={isWhite}
                $isActive={selectedIndex === 2}
              >
                가격
              </StyledMenuItem>
              <StyledMenuItem
                to="/calendar"
                $scrolled={isScrolledOrMenuOpen}
                $isWhite={isWhite}
                $isActive={selectedIndex === 2}
              >
                예약
              </StyledMenuItem>
              <StyledMenuItem
                to="/my"
                $scrolled={isScrolledOrMenuOpen}
                $isWhite={isWhite}
                $isActive={selectedIndex === 2}
              >
                마이
              </StyledMenuItem>
            </MenuContainer>
          </BottomRow>
        </HeaderContainer>

        {isMenuOpen && (
          <MobileMenuContainer>
            <StyledMenuItem
              to="/cars"
              $scrolled={isScrolledOrMenuOpen}
              $isWhite={isWhite}
            >
              Vehicles
            </StyledMenuItem>
            <StyledMenuItem
              to="/calendar"
              $scrolled={isScrolledOrMenuOpen}
              $isWhite={isWhite}
            >
              Reservation
            </StyledMenuItem>
            <StyledMenuItem
              to="/pricing"
              $scrolled={isScrolledOrMenuOpen}
              $isWhite={isWhite}
            >
              Pricing
            </StyledMenuItem>
            <StyledMenuItem
              to="/my"
              $scrolled={isScrolledOrMenuOpen}
              $isWhite={isWhite}
            >
              {!!isLoggedIn ? "My" : "Login"}
            </StyledMenuItem>
          </MobileMenuContainer>
        )}
      </StyledContainer>
    </>
  );
};

// Styled Components
const StyledContainer = styled.div<{
  $scrolled: boolean;
  $isMenuOpen?: boolean;
}>`
  width: 100%;
  max-width: 480px;
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  backdrop-filter: ${(p) =>
    p.$scrolled || p.$isMenuOpen ? "blur(5px)" : "none"};
  transition: 0.2s all ease-in;
  @media (max-width: 768px) {
    max-width: 768px;
  }
`;

const HeaderContainer = styled.div`
  height: 86px;
  width: 100%;
  padding: 0 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopRow = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TopRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BottomRow = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const Logo = styled.img<{ $isWhite: boolean }>`
  height: 20px;
  transition: opacity 0.3s;
`;

const ToggleTab = styled.div<{ $isWhite: boolean }>`
  display: flex;
  width: 120px;
  height: 32px;
  background-color: #e5e5ea;
  border-radius: 999px;
  padding: 2px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  border: none;
  outline: none;
  border-radius: 999px;
  background-color: ${({ active }) => (active ? "#fff" : "transparent")};
  color: ${({ active }) => (active ? "#000" : "#999")};
  font-weight: ${({ active }) => (active ? "700" : "400")};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;

const BurgerButton = styled.button<{ $isWhite: boolean }>`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s;
`;

const BurgerIcon = styled.img<{ $isWhite?: boolean }>`
  width: 24px;
  height: 24px;
  transition: opacity 0.3s;
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const MobileMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  gap: 8px;
  transition: all ease-in 0.3s;
`;

const StyledMenuItem = styled(Link)<{
  $scrolled: boolean;
  $isWhite: boolean;
  $isActive?: boolean;
}>`
  height: 30px;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  padding: 4px 0 14px 0;
  color: ${(p) => {
    if (p.$isActive) {
      return p.$isWhite ? "#fff" : "#000";
    }
    return "#C7C4C4";
  }} !important;
  transition: color 0.3s ease;
`;

export default Header;

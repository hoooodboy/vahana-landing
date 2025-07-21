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
          <Link to="/">
            <Logo src={isWhite ? LogoImg : LogoDarkImg} $isWhite={isWhite} />
          </Link>

          <ButtonContainer>
            <ToggleTab $isWhite={isWhite}>
              <ToggleButton active={false} onClick={goToSubscribe}>
                구독
              </ToggleButton>
              <ToggleButton active={true} onClick={() => {}}>
                의전
              </ToggleButton>
            </ToggleTab>
            {/* 햄버거 버튼은 HomePage일 때만 보이게 */}
            {
              <BurgerButton onClick={toggleMenuOpen} $isWhite={isWhite}>
                <BurgerIcon
                  src={isWhite ? icBurgerSvg : icBurgerBlackSvg}
                  alt="menu"
                />
              </BurgerButton>
            }
          </ButtonContainer>
        </HeaderContainer>

        {isMenuOpen && (
          <MenuContainer>
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
          </MenuContainer>
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
  height: 56px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    max-width: 768px;
  }
`;

const Logo = styled.img<{ $isWhite: boolean }>`
  width: 128px;
  height: 20px;
  /* position: absolute;
  left: 16px;
  top: 21px; */
  transition: opacity 0.3s;
`;

const ButtonContainer = styled.div`
  /* position: absolute;
  right: 16px;
  top: 16px; */
  display: flex;
  align-items: center;
  gap: 8px;
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
  flex-direction: column;
  padding-top: 16px;
  transition: all ease-in 0.3s;
`;

const StyledMenuItem = styled(Link)<{ $scrolled: boolean; $isWhite: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  color: ${(p) => (p.$isWhite ? "#fff" : "#000")} !important;
`;

export default Header;

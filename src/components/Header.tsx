import React, { useEffect, useState } from "react";
import styled from "styled-components";

import LogoImg from "@/src/assets/ic-vahana-white.png";
import LogoDarkImg from "@/src/assets/ic-vahana-black.png";
import icBurgerSvg from "@/src/assets/ic-burger.svg";
import icBurgerBlackSvg from "@/src/assets/ic-burger-black.svg";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    // 스크롤 진행도를 0에서 1 사이의 값으로 계산 (100px를 기준으로)
    const progress = Math.min(scrollY / 100, 1);
    setScrollProgress(progress);
    setScrolled(scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentNav = window.location.pathname;
  const isHome = currentNav === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <Container scrolled={scrolled}>
      <HeaderContainer>
        <Link to="/">
          <Logo
            src={isHome ? LogoImg : LogoDarkImg}
            style={{
              opacity: isHome ? 1 - scrollProgress : 1,
              display: isHome ? "block" : "none",
            }}
          />
        </Link>
        <Link to="/">
          <Logo
            src={LogoDarkImg}
            style={{
              opacity: isHome ? scrollProgress : 1,
              display: isHome ? "block" : "none",
            }}
          />
        </Link>
        {!isHome && (
          <Link to="/">
            <Logo src={LogoDarkImg} />
          </Link>
        )}

        <Burger
          onClick={toggleMenuOpen}
          src={icBurgerSvg}
          style={{
            opacity: isHome ? 1 - scrollProgress : 0,
            display: isHome ? "block" : "none",
          }}
        />
        <Burger
          onClick={toggleMenuOpen}
          src={icBurgerBlackSvg}
          style={{
            opacity: isHome ? scrollProgress : 1,
            display: isHome ? "block" : "none",
          }}
        />
        {!isHome && <Burger onClick={toggleMenuOpen} src={icBurgerBlackSvg} />}
      </HeaderContainer>
      {isMenuOpen && (
        <MenuContainer>
          <MenuItem to="/cars" scrolled={scrolled} isHome={isHome}>
            Vehicles
          </MenuItem>
          <MenuItem to="/calendar" scrolled={scrolled} isHome={isHome}>
            Reservation
          </MenuItem>
          <MenuItem to="/pricing" scrolled={scrolled} isHome={isHome}>
            Pricing
          </MenuItem>
          <MenuItem to="/my" scrolled={scrolled} isHome={isHome}>
            My
          </MenuItem>
        </MenuContainer>
      )}
    </Container>
  );
};

const Container = styled.div<{ scrolled: boolean }>`
  width: 100%;
  max-width: 480px;

  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 1000;

  backdrop-filter: ${(p) => (p.scrolled ? "blur(5px)" : "none")};
  transition: background 0.3s;
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

const Logo = styled.img`
  width: 128px;
  height: 20px;
  position: absolute;
  left: 16px;
  top: 21px;
  /* transform: translate(0, 50%); */
  transition: opacity 0.3s;
`;

const Burger = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 16px;
  top: 16px;
  transition: opacity 0.3s;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;

  transition: all ease-in 0.3s;
`;

const MenuItem = styled(Link)<{ scrolled: boolean; isHome: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  color: ${(p) => (!p.isHome ? "#000" : p.scrolled ? "#000" : "#fff")};
`;

export default Header;

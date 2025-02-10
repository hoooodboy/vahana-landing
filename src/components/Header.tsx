import React, { useEffect, useState } from "react";
import styled from "styled-components";

import LogoImg from "@/src/assets/ic-vahana-white.png";
import LogoDarkImg from "@/src/assets/ic-vahana-black.png";
import icBurgerSvg from "@/src/assets/ic-burger.svg";
import icBurgerBlackSvg from "@/src/assets/ic-burger-black.svg";

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

  return (
    <HeaderContainer scrolled={scrolled} progress={scrollProgress}>
      <Logo
        src={isHome ? LogoImg : LogoDarkImg}
        style={{
          opacity: isHome ? 1 - scrollProgress : 1,
          display: isHome ? "block" : "none",
        }}
      />
      <Logo
        src={LogoDarkImg}
        style={{
          opacity: isHome ? scrollProgress : 1,
          display: isHome ? "block" : "none",
        }}
      />
      {!isHome && <Logo src={LogoDarkImg} />}

      <Burger
        src={icBurgerSvg}
        style={{
          opacity: isHome ? 1 - scrollProgress : 0,
          display: isHome ? "block" : "none",
        }}
      />
      <Burger
        src={icBurgerBlackSvg}
        style={{
          opacity: isHome ? scrollProgress : 1,
          display: isHome ? "block" : "none",
        }}
      />
      {!isHome && <Burger src={icBurgerBlackSvg} />}
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div<{ scrolled: boolean; progress: number }>`
  width: 100%;
  max-width: 480px;
  height: 56px;
  position: fixed;
  top: 0;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  /* background: ${(p) => `rgba(255, 255, 255, ${p.progress * 0.9})`}; */
  backdrop-filter: ${(p) => (p.scrolled ? "blur(5px)" : "none")};
  transition: background 0.3s;
  @media (max-width: 768px) {
    max-width: 768px;
  }
`;

const Logo = styled.img`
  width: 128px;
  height: 20px;
  position: absolute;
  left: 16px;
  transition: opacity 0.3s;
`;

const Burger = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 16px;
  transition: opacity 0.3s;
`;

export default Header;

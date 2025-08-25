import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Logo from "@/src/assets/ic-logo-white.png";
import ScrollToTop from "@/src/components/ScrollToTop";
import Footer from "@/src/components/Footer";
import ImgContact from "@/src/assets/img-contact.png";

function BaseLayout() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    handleResize(); // 초기 세팅
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const leftWidth = Math.max(0, (windowWidth - 480) * 0.75);
  const rightMargin = Math.max(0, (windowWidth - 480) * 0.25);

  // 구독 페이지인지 확인
  const isSubscribePage = location.pathname.startsWith("/subscribe");

  return (
    <Container>
      {/* <LogoContainer width={leftWidth}>
        <LogoImg src={Logo} />
      </LogoContainer> */}
      <Content rightMargin={rightMargin}>
        <Outlet />
        {!isSubscribePage && <Footer />}
        <ScrollToTop />
      </Content>
      <ContactButton
        onClick={() => window.open("http://pf.kakao.com/_yxcxhVn")}
      >
        <img src={ImgContact} />
      </ContactButton>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  background: #000;
  display: flex;
  align-items: flex-start;

  @media (max-width: 768px) {
    padding: 0;
    flex-direction: column;
  }
`;

const LogoContainer = styled.div<{ width: number }>`
  width: ${(p) => `${p.width}px`};
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none; // 클릭 방지 (필요시 제거)

  @media (max-width: 768px) {
    display: none;
  }
`;

const Content = styled.div<{ rightMargin: number }>`
  max-width: 480px;
  width: 100%;
  height: 100%;
  min-height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* margin-left: auto;
  margin-right: ${(p) => `${p.rightMargin}px`}; */
  margin: 0 auto;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.9) 0px 3px 12px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-right: 0;
    max-width: 100%;
  }
`;

const LogoImg = styled.img`
  width: 190px;
  height: auto;
  background-size: cover;
`;

const ContactButton = styled.div`
  width: 48px;
  height: 48px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;

  & > img {
    width: 100%;
    height: 100%;
  }

  border-radius: 100px;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
`;

export default BaseLayout;

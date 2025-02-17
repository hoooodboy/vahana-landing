import { Outlet } from "react-router-dom";

import styled, { css } from "../../themes";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import LocalStorage from "@/src/local-storage";
import Logo from "@/src/assets/ic-logo.png";
import ScrollToTop from "@/src/components/ScrollToTop";

const useDocumentHeight = () => {
  const getHeight = useCallback(
    () =>
      window.visualViewport ? window.visualViewport.height : window.innerHeight,
    []
  );
  const [height, setHeight] = useState<number>(getHeight());

  useEffect(() => {
    const handleResize = (e: Event) => {
      setHeight(getHeight());
    };

    window.addEventListener("resize", handleResize);

    window.addEventListener("orientationchange", handleResize);

    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, [getHeight]);

  return height;
};

function checkMobile() {
  const UA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

  if (UA.indexOf("iphone") > -1 || UA.indexOf("ipad") > -1) {
    //IOS
    return true;
  } else {
    //아이폰, 안드로이드 외
    return false;
  }
}

function BaseLayout() {
  const [agree, setAgree] = useState(true);

  const handleResize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const height2 = useDocumentHeight();

  const pcView =
    window.location.pathname.includes("/publish") ||
    window.location.pathname.includes("/introduce");
  // const termsAgree = LocalStorage.getBool("termsAgree");

  return (
    // <Container style={{ maxHeight: height }}>
    <Container>
      <LogoContainer>
        <LogoImg src={Logo} />
        단순한 이동을 넘어,
        <br />
        도로 위의 시간을 더욱 가치있게
      </LogoContainer>
      <Content>
        {/* <TermsAgree /> */}
        {/* <Logo>adasssasdasd</Logo> */}
        <Outlet />

        {/* <AppNav theme="dark" /> */}
        <ScrollToTop />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  background: #151711;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10%;
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: 36px;
  color: #decda7;
  text-align: center;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 2.2px;
  padding: 42px;
  position: fixed;
  top: 50%;
  left: 10%;
  transform: translate(0, -50%);
  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoImg = styled.img`
  width: 100%;
  height: auto;
  background-size: cover;
`;

const Content = styled.div<{ isIos?: boolean; pcView?: boolean }>`
  max-width: ${(p) => (p.pcView ? "none" : "480px")};
  width: 100%;
  height: 100%;
  /* overflow-y: scroll; */
  /* overflow-x: hidden; */
  min-height: calc(var(--vh) * 100);

  /* height: 100%; */
  display: flex;
  flex: 1 !important;
  max-height: auto;
  justify-content: flex-end;

  /* padding-top: ${(p) => (p.pcView ? "60px" : "48px")}; */
  /* padding-bottom: ${(p) => (p.pcView ? "60px" : "0px")}; */
  /* padding-left: ${(p) => (p.pcView ? "300px" : "0")}; */
  box-sizing: border-box;

  position: relative;

  box-shadow: ${(p) => (p.pcView ? "none" : "rgba(0, 0, 0, 0.9) 0px 3px 12px")};

  @media (max-width: 768px) {
    max-width: 768px;
  }
`;

export default BaseLayout;

import { Outlet, useLocation } from "react-router-dom";

import styled, { css } from "../../themes";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import LocalStorage from "@/src/local-storage";
import Logo from "@/src/assets/ic-logo.png";
import ScrollToTop from "@/src/components/ScrollToTop";
import Footer from "@/src/components/Footer";
import ImgContact from "@/src/assets/img-contact.png";
import { useRootPage } from "@/src/contexts/RootPageContext";

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

  const location = useLocation();
  const { isUck } = useRootPage();
  const isUckPage = location.pathname === "/" && isUck;

  return (
    // <Container style={{ maxHeight: height }}>
    <Container>
      <LogoContainer>
        <LogoBlock>
          <LogoImg src={Logo} />
          이동의 혁신, 품격의 진화
        </LogoBlock>
      </LogoContainer>
      <Content>
        {/* <TermsAgree /> */}
        {/* <Logo>adasssasdasd</Logo> */}
        <Outlet />

        {/* <AppNav theme="dark" /> */}
        {!isUckPage && (
          <>
            <Footer />
            <ScrollToTop />
            <ContactButton
              onClick={() => window.open("http://pf.kakao.com/_yxcxhVn")}
            >
              <img src={ImgContact} />
            </ContactButton>
          </>
        )}
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
  gap: 240px;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const LogoContainer = styled.div`
  position: fixed; /* fixed로 변경 */
  left: 0; /* 왼쪽에서의 위치 */
  top: 50%; /* 상단에서 50% */
  transform: translateY(-50%); /* 자신의 높이의 50%만큼 위로 이동 */
  width: 400px; /* 고정 너비 설정 */
  display: flex;
  flex-direction: column;
  gap: 36px;
  color: #decda7;

  margin-left: calc((100% - 1080px) / 2); /* 중앙 정렬을 위한 마진 계산 */

  @media (max-width: 768px) {
    display: none;
  }
`;

// LogoBlock에서 position: absolute 제거
const LogoBlock = styled.div`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 2.2px;
  padding: 42px;
  gap: 36px;
`;

const Content = styled.div<{ isIos?: boolean; pcView?: boolean }>`
  max-width: ${(p) => (p.pcView ? "none" : "480px")};
  width: 100%;
  height: 100%;
  min-height: calc(var(--vh) * 100);
  display: flex;
  flex: 1 !important;
  max-height: auto;
  justify-content: flex-end;
  box-sizing: border-box;
  position: relative;
  margin-left: 640px; /* LogoContainer 너비 + gap */
  box-shadow: ${(p) => (p.pcView ? "none" : "rgba(0, 0, 0, 0.9) 0px 3px 12px")};

  @media (max-width: 768px) {
    max-width: 768px;
    margin-left: 0;
  }
`;

const LogoImg = styled.img`
  width: 100%;
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

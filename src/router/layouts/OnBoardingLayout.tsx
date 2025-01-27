import { Outlet } from "react-router-dom";

import styled, { css } from "../../themes";
import { AppNav, ScrollToTop } from "../../pages";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import LocalStorage from "@/src/local-storage";

function OnBoardingLayout() {
  const handleResize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET 요청 보내기
        const response = await axios.get(
          "https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location"
        );
        // 응답 데이터 가져오기
        if (response.data.country === "KR") {
          return LocalStorage.set("lang", "ko");
        }
        if (response.data.country === "US") {
          return LocalStorage.set("lang", "en");
        }
        if (response.data.country === "JP") {
          return LocalStorage.set("lang", "jp");
        }
        if (response.data.country === "CN") {
          return LocalStorage.set("lang", "cn");
        }

        LocalStorage.set("lang", "en");
      } catch (error) {
        // 오류 처리
        alert("언어를 가져오지 못했습니다.");
      }
    };

    // 데이터 가져오기 함수 호출
    fetchData();
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  return (
    // <Container style={{ maxHeight: height }}>
    <Content>
      <Outlet />
    </Content>
  );
}

const Content = styled.div<{ isIos?: boolean }>`
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh; /* fallback */
  min-height: calc(var(--vh) * 100);

  height: 100%;
  display: flex;
  flex: 1 !important;

  max-height: auto;
  box-sizing: border-box;

  position: relative;

  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
`;

export default OnBoardingLayout;

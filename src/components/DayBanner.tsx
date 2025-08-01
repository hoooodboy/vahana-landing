import LocalStorage from "@/src/local-storage";
import { useBodyScrollLock } from "@/src/utils/useBodyScrollLock";
import React, { useEffect, useMemo, useState } from "react";
import { styled } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import UAParser from "ua-parser-js";

const DayBanner = ({
  setShowMainPop,
}: {
  setShowMainPop: (show: boolean) => void;
}) => {
  const { lockScroll, openScroll } = useBodyScrollLock();
  const navigate = useNavigate();

  const closePop = () => {
    // setShowMainPop(false);
    openScroll();
    window.location.href = "https://subscribe.vahana.kr/#/cars";
  };

  const closeTodayPop = () => {
    let expires = new Date();
    const expiresTime = expires.setHours(23, 59, 59, 0); //오늘 23시 59분 59초로 설정

    console.log("expiresTime", expiresTime);
    LocalStorage.set("homeVisited", String(expiresTime));
    // 현재 시간의 24시간 뒤의 시간을 homeVisited에 저장
    openScroll();
    setShowMainPop(false);
  };

  const BannerClick = () => {
    // 바하나 앱 다운로드 링크로 이동

    window.location.href = "https://subscribe.vahana.kr/#/cars";
  };

  useEffect(() => {
    lockScroll();
  }, []);

  return (
    <Container>
      <ModalContainer>
        <ContentsContainer onClick={BannerClick}>
          <BannerContent>
            <BannerTitle>바하나 앱 다운로드</BannerTitle>
            <BannerSubtitle>더 편리한 서비스 이용을 위해</BannerSubtitle>
            <BannerSubtitle>앱을 다운로드하세요!</BannerSubtitle>
            <DownloadButton>dd</DownloadButton>
          </BannerContent>
        </ContentsContainer>
        <ButtonWrapper>
          <Button onClick={closeTodayPop}>오늘 하루 열지 않기</Button>
          <Button onClick={closePop}>바로가기</Button>
        </ButtonWrapper>
      </ModalContainer>
      <Background></Background>
    </Container>
  );
};

const Container = styled.div<{ isVisible?: boolean }>`
  width: 100%;
  max-width: 480px;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  /* left: 50%; */
  /* transform: translate(-50%, 0); */
  transition: opacity 0.1s ease-in-out;

  z-index: 100000;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 380px;
  margin: 16px;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  z-index: 10;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-top: 1px solid #d9d9d9;
`;

const Button = styled.div`
  width: 100%;
  min-height: 48px;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  &:first-child {
    border-right: 1px solid #d9d9d9;
  }
`;

const ContentsContainer = styled.div`
  width: 100%;
  padding: 40px 20px;
  position: relative;
  cursor: pointer;
  background: linear-gradient(135deg, #3e4730 0%, #76865f 100%);
  color: white;
  text-align: center;
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const BannerTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
`;

const BannerSubtitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
`;

const DownloadButton = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-top: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const Background = styled.div`
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;

  position: absolute;
  z-index: -1;
  cursor: pointer;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

const BannerBackground = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  top: 0;
  left: 0;
`;

export default DayBanner;

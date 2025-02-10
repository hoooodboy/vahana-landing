import React, { useState } from "react";
import Header from "@/src/components/Header";
import styled from "styled-components";
import Footer from "@/src/components/Footer";

import IcBook from "@/src/assets/ic-book.svg";
import IcProfile from "@/src/assets/ic-profile.svg";
import IcWallet from "@/src/assets/ic-wallet.svg";
import IcChevronRight from "@/src/assets/ic-chevron-right.svg";
import { Link } from "react-router-dom";

const MyPage = () => {
  const LINKS = [
    {
      title: "고객센터",
      contents: [
        {
          title: "자주 묻는 질문",
          link: "/qna",
        },
        {
          title: "1:1 문의",
          link: "/transaction",
        },
        // {
        //   title: "로그아웃",
        //   link: "/logout",
        // },
        // {
        //   title: "회원탈퇴",
        //   link: "/currency",
        // },
      ],
    },
    {
      title: "이용약관",
      contents: [
        {
          title: "개인정보처리방침",
          link: "/privacy-policy",
        },
        {
          title: "이용약관",
          link: "/terms",
        },
      ],
    },
  ];

  const logout = () => {};

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          MY
          <br />
          PAGE
        </Title>
        마이페이지
      </TitleContainer>
      <QuickMenuWrapper>
        <QuickMenuBlock>
          <img src={IcBook} />
          예약내역
        </QuickMenuBlock>
        <QuickMenuBlock>
          <img src={IcWallet} />
          결제내역
        </QuickMenuBlock>
        <QuickMenuBlock>
          <img src={IcProfile} />
          회원정보{" "}
        </QuickMenuBlock>
      </QuickMenuWrapper>
      <HorizontalContainer>
        <SectionTitle>운행 예약</SectionTitle>
        <OperationBlock>
          <OperationInfo>
            <OperationTime>3/13 14:28</OperationTime>
            <Destination>서울시 구로구 경인로53길 90 </Destination>
            <CarInfo>LM 500h EXECUTIVE</CarInfo>
          </OperationInfo>
          <img src={IcChevronRight} />
        </OperationBlock>
      </HorizontalContainer>

      <LinksContainer>
        {LINKS.map((links) => (
          <LinkBlock>
            <LinkTitle>{links.title}</LinkTitle>
            {links.contents.map((link) => (
              <LinkWrapper to={link?.link}>
                {link.title}
                <img src={IcChevronRight} />
              </LinkWrapper>
            ))}
            {links.title === "고객센터" && (
              <LinkWrapper to="" onClick={logout}>
                {"로그아웃"}
                <img src={IcChevronRight} />
              </LinkWrapper>
            )}
            {links.title === "고객센터" && (
              <LinkWrapper to="">
                {"회원 탈퇴"}
                <img src={IcChevronRight} />
              </LinkWrapper>
            )}
          </LinkBlock>
        ))}
      </LinksContainer>
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;

  background: #fff;
  position: relative;
  padding-top: 56px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 46px 16px 82px;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
`;

const QuickMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
`;

const QuickMenuBlock = styled.div`
  width: 100%;
  height: 84px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  gap: 8px;
  cursor: pointer;

  color: #666;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
`;

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const SectionTitle = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 600;
  padding-bottom: 0;
`;

const OperationBlock = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  cursor: pointer;
`;

const OperationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OperationTime = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 400;
`;

const Destination = styled.div`
  color: #000;
  font-size: 16px;
  font-weight: 300;
`;

const CarInfo = styled.div`
  color: #000;
  font-size: 14px;
  font-weight: 500;
`;

const LinksContainer = styled.div`
  display: flex;
  flex: 1 !important;
  flex-direction: column;
  gap: 28px;
  margin-top: 32px;
  padding: 24px 0;
  background: #fff;
  padding-bottom: 150px;
`;

const LinkBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
`;

const LinkWrapper = styled(Link)`
  display: flex;
  height: 42px;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  padding-left: 8px;
`;

const ImgBlock = styled.img`
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
`;

const RecentBlock = styled.div`
  width: 100%;
  gap: 4px;
  display: flex;
  padding: 0 16px;
`;

const RecentCard = styled(Link)`
  width: 140px;
  display: flex;
  flex-direction: column;

  gap: 14px;
  text-decoration: none;
`;

const RecentTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RecentTitle = styled.div`
  color: #000;
  font-size: 14px;
  font-weight: 600;

  width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RecentSubTitle = styled.div`
  color: #818181;
  font-size: 12px;
  font-weight: 400;
`;

const RecentImg = styled.div`
  width: 140px;
  height: 140px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

const LinkTitle = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const PackPublishButton = styled(Link)`
  width: 100%;
  height: 48px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 8px;
  border: 1px solid #ff3d66;
  background: #fff;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.03);

  color: #ff3d66;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.7px;
  text-decoration: none;
`;

export default MyPage;

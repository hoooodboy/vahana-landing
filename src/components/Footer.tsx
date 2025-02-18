import React from "react";
import styled from "styled-components";

import LogoImg from "@/src/assets/ic-vahana-white.png";

const Footer = () => {
  return (
    <FooterContainer>
      <Logo src={LogoImg} />
      <FooterContentsWrapper>
        <FooterContents>대표 | 김해</FooterContents>
        <FooterContents>사업자등록번호 | 691-87-02329</FooterContents>
        <FooterContents>
          주소 | 서울시 구로구 경인로53길 90, 11층 1104호
        </FooterContents>
        <FooterContents>대표문의 | vahana.sun@gmail.com</FooterContents>
      </FooterContentsWrapper>
      @2025 VAHANA. All rights reserved.
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  width: 100%;
  padding: 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: #151711;
  color: #fff;
  font-size: 12px;
  font-weight: 300;
`;

const FooterContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterContents = styled.div`
  color: #fff;
  font-size: 12px;
  font-weight: 300;
`;

const Logo = styled.img`
  width: 128px;
  height: 20px;
`;

export default Footer;

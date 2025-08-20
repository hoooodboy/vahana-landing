import React from "react";
import styled from "styled-components";

import LogoImg from "@/src/assets/ic-vahana-white.png";
import IcFooterInsta from "@/src/assets/ic-footer-insta.png";
import IcFooterBlog from "@/src/assets/ic-footer-blog.png";
import IcFooterKakao from "@/src/assets/ic-footer-kakao.png";
import IcFooterYoutube from "@/src/assets/ic-footer-youtube.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <FooterContainer>
      <Logo src={LogoImg} />
      <FooterContentsWrapper>
        {/* <FooterContents>상호명 | 비티오랩 주식회사</FooterContents> */}
        {/* <FooterContents>대표 | 김해</FooterContents> */}
        {/* <FooterContents>사업자등록번호 | 691-87-02329</FooterContents> */}
        <FooterContents>유선번호 | 010-4824-4562</FooterContents>
        <FooterContents>대표문의 | vahanacop@gmail.com</FooterContents>
        <FooterContents>주소 | 서울시 연세로2다길 20, 205호</FooterContents>
      </FooterContentsWrapper>
      <FooterContentsWrapper2>
        <Link to="/privacy" style={{ color: "#fff !important" }}>
          개인정보 처리방침
        </Link>
        <Link to="/terms" style={{ color: "#fff !important" }}>
          서비스 이용약관
        </Link>
      </FooterContentsWrapper2>
      <LinkContainer>
        <OutLink
          onClick={() =>
            window.open("https://www.instagram.com/vahana.kr/?hl=ko")
          }
        >
          <Icon src={IcFooterInsta} />
        </OutLink>
        <OutLink
          onClick={() => window.open("https://blog.naver.com/vahana_kr")}
        >
          <Icon src={IcFooterBlog} />
        </OutLink>
        <OutLink onClick={() => window.open("http://pf.kakao.com/_yxcxhVn")}>
          <Icon src={IcFooterKakao} />
        </OutLink>
        <OutLink
          onClick={() => window.open("https://www.youtube.com/@vahanacop")}
        >
          <Icon src={IcFooterYoutube} />
        </OutLink>
      </LinkContainer>
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
  position: absolute;
  bottom: 0;
`;

const FooterContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #fff;
  * > {
    color: #fff !important;
  }
`;

const FooterContentsWrapper2 = styled.div`
  display: flex;
  gap: 8px;
  color: #fff;
  & > a {
    color: #fff !important;
    text-decoration: none;
  }
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

const LinkContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const OutLink = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 100%;
  height: 100%;
`;

export default Footer;

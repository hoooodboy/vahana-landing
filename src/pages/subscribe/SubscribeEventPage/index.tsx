import React from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useNavigate } from "react-router-dom";
import useCopyCurrentUrl from "@/src/utils/useCopyCurrentUrl";
import banner from "@/src/assets//event-banner-1.png";

const SubscribeEventPage = () => {
  const navigate = useNavigate();
  const { onShare } = useCopyCurrentUrl();

  const handleReferrerClick = () => {
    navigate("/subscribe/referrer");
  };

  return (
    <Container>
      <Header />
      <Content>
        <Banner>
          <img src={banner} alt="banner" />
        </Banner>

        <ButtonGroup>
          <BackButton onClick={onShare}>공유하기</BackButton>
          <ActionButton onClick={handleReferrerClick}>추천인 입력</ActionButton>
        </ButtonGroup>

        <FooterWrap>
          <Footer />
        </FooterWrap>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding-top: 86px;
  padding-bottom: 338px;
`;

const Content = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 18px 80px;
`;

const Banner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ActionButton = styled.button`
  flex: 1;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #8cff20 0%, #7aff1a 100%);
  color: #000;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(140, 255, 32, 0.3);
  }
`;

const BackButton = styled.button`
  width: 50%;
  height: 56px;
  border: 2px solid #333;
  border-radius: 16px;
  background: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8cff20;
    background: rgba(140, 255, 32, 0.05);
  }
`;

const FooterWrap = styled.div`
  margin-top: 60px;
`;

export default SubscribeEventPage;

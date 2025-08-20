import React from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";

import Img1 from "@/src/assets/sub-car-detail-1.png";
import Img2 from "@/src/assets/sub-car-detail-2.png";
import Img3 from "@/src/assets/sub-car-detail-3.png";

const SubscribeIntroPage = () => {
  return (
    <Container>
      <Header />
      <Content>
        <Images>
          <Img src={Img1} alt="subscribe-intro-1" />
          <Img src={Img2} alt="subscribe-intro-2" />
          <Img src={Img3} alt="subscribe-intro-3" />
        </Images>
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
  padding: 18px;
`;

const Images = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  display: block;
`;

export default SubscribeIntroPage;

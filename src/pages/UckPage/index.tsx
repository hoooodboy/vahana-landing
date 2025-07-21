import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Lottie from "lottie-react";
import loadingLottie from "../../../public/lottie-loading.json";

const UckPage = () => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <Header />
      <Content>
        <IframeContainer>
          <Iframe
            src="https://uck.dothome.co.kr/#/cars"
            title="External Cars Page"
            frameBorder="0"
            allowFullScreen
          />
          {showLoading && (
            <LoadingOverlay>
              <Lottie
                animationData={loadingLottie}
                loop
                style={{ width: 42, height: 42 }}
              />
            </LoadingOverlay>
          )}
        </IframeContainer>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  padding-top: 56px;
  background: #fff;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding-bottom: 100px;
  }
`;

const Content = styled.div`
  width: 100%;
  flex: 1 1 0;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const IframeContainer = styled.div`
  width: 100%;
  height: 100%;
  flex: 1 1 0;
  background: white;
  display: flex;
  position: relative;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export default UckPage;

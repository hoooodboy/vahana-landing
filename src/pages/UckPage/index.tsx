import React from "react";
import styled from "styled-components";
import Header from "../../components/Header";

const UckPage = () => {
  return (
    <Container>
      <Header />
      <Content>
        <IframeContainer>
          <Iframe
            src="https://uck.dothome.co.kr/#/cars"
            title="External Cars Page"
            frameBorder="0"
          />
        </IframeContainer>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh + 480px);
  background: #fff;
`;

const Content = styled.div`
  padding-top: 56px; // 헤더 높이만큼 패딩
  width: 100%;
  height: calc(100vh - 56px);
`;

const IframeContainer = styled.div`
  width: 100%;
  height: 100%;
  background: white;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export default UckPage;

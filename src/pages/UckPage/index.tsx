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
            allowFullScreen
          />
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
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

export default UckPage;

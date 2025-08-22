import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { subscribeKakaoExchange } from "@/src/api/subscribeAuth";
import { saveTokens } from "@/src/utils/tokenRefresh";

const SubscribeKakaoLoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (!code) {
      setError("카카오 코드가 없습니다.");
      return;
    }
    const redirectUri = `${window.location.origin}/subscribe/accounts/kakao`;
    (async () => {
      try {
        const res = await subscribeKakaoExchange(code);
        // 토큰과 만료 시간 저장 (기본 24시간)
        saveTokens(res.accessToken, res.refreshToken, 86400);
        navigate("/subscribe");
      } catch (e: any) {
        setError(e?.message || "카카오 로그인 처리 실패");
      }
    })();
  }, [location.search]);

  return (
    <Container>
      <Header />
      <Card>
        <Spinner />
        <Msg>{error ?? "카카오 로그인 처리 중..."}</Msg>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding-top: 86px;
`;

const Card = styled.div`
  width: calc(100% - 36px);
  margin: 36px 18px 48px;
  background: #202020;
  border-radius: 24px;
  padding: 36px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-top-color: #8cff20;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Msg = styled.div`
  margin-top: 24px;
  font-size: 16px;
  color: #fff;
`;

export default SubscribeKakaoLoadingPage;

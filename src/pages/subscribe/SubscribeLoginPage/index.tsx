import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import {
  subscribeLogin,
  subscribeKakaoExchange,
} from "@/src/api/subscribeAuth";
import IcKakao from "@/src/assets/ic-kakao.png";

const KAKAO_CLIENT_ID = "380f187ca9b2e8a5e562fd259d68708e";
const KAKAO_REDIRECT = "https://www.vahana.kr/subscribe/login/kakao";

const SubscribeLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kakaoLoading, setKakaoLoading] = useState(false);

  // 카카오 로그인 콜백 처리
  useEffect(() => {
    console.log("현재 경로:", location.pathname);
    console.log("현재 search:", location.search);

    // /subscribe/login/kakao 경로인지 확인
    if (location.pathname === "/subscribe/login/kakao") {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const error = params.get("error");

      console.log("카카오 코드:", code);
      console.log("카카오 에러:", error);

      if (error) {
        setError("카카오 로그인에 실패했습니다.");
        return;
      }

      if (code) {
        console.log("카카오 콜백 처리 시작:", code);
        handleKakaoCallback(code);
      } else {
        console.log("카카오 코드가 없습니다.");
      }
    }
  }, [location.pathname, location.search]);

  const handleKakaoCallback = async (code: string) => {
    console.log("카카오 콜백 처리 함수 실행, 코드:", code);
    setKakaoLoading(true);
    setError(null);
    try {
      console.log("API 요청 시작...");
      const res = await subscribeKakaoExchange(code);
      console.log("API 응답:", res);

      localStorage.setItem("subscribeAccessToken", res.accessToken);
      console.log("구독 액세스 토큰 저장됨:", res.accessToken);

      if (res.refreshToken) {
        localStorage.setItem("subscribeRefreshToken", res.refreshToken);
        console.log("리프레시 토큰 저장됨:", res.refreshToken);
      }

      console.log("로그인 성공, 리다이렉트 중...");
      navigate("/subscribe/my");
    } catch (e: any) {
      console.error("카카오 로그인 처리 실패:", e);
      setError(e?.message || "카카오 로그인 처리 실패");
    } finally {
      setKakaoLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await subscribeLogin(email, password);
      localStorage.setItem("subscribeAccessToken", res.accessToken);
      if (res.refreshToken)
        localStorage.setItem("subscribeRefreshToken", res.refreshToken);
      //   alert("구독 로그인 성공");
      navigate("/subscribe/my");
    } catch (e: any) {
      setError(e?.message || "로그인 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const onKakaoLogin = () => {
    setKakaoLoading(true);
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      KAKAO_REDIRECT
    )}&response_type=code`;
    window.location.href = url;
  };

  // 카카오 로그인 콜백 처리 중일 때는 로딩 화면 표시
  if (location.pathname === "/subscribe/login/kakao" && kakaoLoading) {
    return (
      <Container>
        <Header />
        <Content>
          <Title>카카오 로그인 처리 중...</Title>
          <LoadingSpinner />
          <LoadingText>잠시만 기다려주세요.</LoadingText>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Content>
        <Title>로그인</Title>
        {error && <ErrorBox>{error}</ErrorBox>}
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
        <SubmitButton
          disabled={!email || !password || isLoading}
          onClick={onSubmit}
        >
          {isLoading ? "로그인 중..." : "이메일 로그인"}
        </SubmitButton>
        <KakaoButton onClick={onKakaoLogin} disabled={kakaoLoading}>
          <img src={IcKakao} width={36} alt="kakao" />
          {kakaoLoading ? "카카오 로그인 처리 중..." : "카카오 로그인"}
        </KakaoButton>
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
`;

const Content = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 18px 80px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const ErrorBox = styled.div`
  background: #4a1c1c;
  border: 1px solid #6e2c2c;
  border-radius: 12px;
  padding: 12px;
  color: #ffb3b3;
  margin-bottom: 18px;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 0 12px;
  background: #202020;
  color: #fff;
  margin-bottom: 12px;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;
  background: #8cff20;
  color: #000;
  font-weight: 700;
  margin-top: 6px;
`;

const KakaoButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;
  background: ${(props) => (props.disabled ? "#ccc" : "#fddc3f")};
  color: #3a2929;
  font-weight: 700;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-top-color: #8cff20;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 24px auto;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 16px;
  color: #c7c4c4;
  margin-top: 16px;
`;

export default SubscribeLoginPage;

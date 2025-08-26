import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import {
  subscribeLogin,
  subscribeKakaoExchange,
} from "@/src/api/subscribeAuth";
import { saveTokens } from "@/src/utils/tokenRefresh";
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
  const [showPassword, setShowPassword] = useState(false);

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
        console.log("코드 길이:", code.length);
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

      // 토큰과 만료 시간 저장 (기본 24시간)
      saveTokens(res.accessToken, res.refreshToken, 86400);
      console.log("구독 토큰 저장됨:", res.accessToken);

      console.log("로그인 성공, 리다이렉트 중...");
      navigate("/subscribe/my");
    } catch (e: any) {
      console.error("카카오 로그인 처리 실패:", e);

      // 에러 메시지 파싱
      let errorMessage = "카카오 로그인 처리 실패";
      try {
        if (e?.message) {
          const errorData = JSON.parse(e.message);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        }
      } catch (parseError) {
        errorMessage = e?.message || "카카오 로그인 처리 실패";
      }

      setError(errorMessage);
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
      // 토큰과 만료 시간 저장 (기본 24시간)
      saveTokens(res.accessToken, res.refreshToken, 86400);
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
    )}&response_type=code&state=${Date.now()}`;
    console.log("카카오 로그인 URL:", url);
    window.location.href = url;
  };

  // 카카오 로그인 콜백 처리 중일 때는 로딩 화면 표시
  if (location.pathname === "/subscribe/login/kakao" && kakaoLoading) {
    return (
      <Container>
        <Header />
        <Content>
          <p>카카오 로그인 처리 중...</p>
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
        <LogoSection>
          <Logo>로그인</Logo>
          {/* <Subtitle>구독 서비스 로그인</Subtitle> */}
        </LogoSection>

        {error && <ErrorBox>{error}</ErrorBox>}

        <FormSection>
          <InputGroup>
            <InputLabel>이메일</InputLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              type="email"
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>비밀번호</InputLabel>
            <PasswordInputContainer>
              <PasswordInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요"
              />
              <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "숨기기" : "보기"}
              </PasswordToggle>
            </PasswordInputContainer>
          </InputGroup>

          <LoginButton
            disabled={!email || !password || isLoading}
            onClick={onSubmit}
          >
            {isLoading ? "로그인 중..." : "이메일 로그인"}
          </LoginButton>

          <Divider>
            <DividerText>또는</DividerText>
          </Divider>

          <KakaoButton onClick={onKakaoLogin} disabled={kakaoLoading}>
            <KakaoIcon src={IcKakao} alt="kakao" />
            {kakaoLoading ? "카카오 로그인 처리 중..." : "카카오로 로그인"}
          </KakaoButton>
        </FormSection>

        <SignupSection>
          <SignupText>아직 계정이 없으신가요?</SignupText>
          <SignupLink onClick={() => navigate("/subscribe/signup")}>
            회원가입하기
          </SignupLink>
        </SignupSection>

        <ForgotPasswordSection>
          <ForgotPasswordLink
            onClick={() => navigate("/subscribe/forgot-password")}
          >
            비밀번호를 잊으셨나요?
          </ForgotPasswordLink>
        </ForgotPasswordSection>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: #fff;
  padding-top: 86px;
  padding-bottom: 338px;
`;

const Content = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 48px 24px 80px;
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Logo = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  /* background: linear-gradient(135deg, #8cff20 0%, #7aff1a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; */
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #c7c4c4;
  font-weight: 500;
`;

const ErrorBox = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #ff6b6b;
  margin-bottom: 24px;
  font-size: 14px;
`;

const FormSection = styled.div`
  width: 100%;
  margin-bottom: 32px;
`;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  border: 2px solid #333;
  border-radius: 16px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
    border-color: #8cff20;
    background: rgba(140, 255, 32, 0.05);
  }
`;

const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordInput = styled.input`
  width: 100%;
  height: 56px;
  border: 2px solid #333;
  border-radius: 16px;
  padding: 0 20px;
  padding-right: 80px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
    border-color: #8cff20;
    background: rgba(140, 255, 32, 0.05);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #8cff20;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(140, 255, 32, 0.1);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: ${(props) =>
    props.disabled
      ? "#333"
      : "linear-gradient(135deg, #8cff20 0%, #7aff1a 100%)"};
  color: ${(props) => (props.disabled ? "#666" : "#000")};
  font-size: 16px;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  margin-bottom: 24px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(140, 255, 32, 0.3);
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 24px 0;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #333;
  }
`;

const DividerText = styled.span`
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  padding: 0 16px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

const KakaoButton = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: ${(props) => (props.disabled ? "#333" : "#fddc3f")};
  color: ${(props) => (props.disabled ? "#666" : "#3a2929")};
  font-size: 16px;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(253, 220, 63, 0.3);
  }
`;

const KakaoIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const SignupSection = styled.div`
  text-align: center;
  padding: 24px 0;
`;

const SignupText = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const SignupLink = styled.button`
  background: none;
  border: none;
  color: #8cff20;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.3s ease;

  &:hover {
    color: #7aff1a;
  }
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

const ForgotPasswordSection = styled.div`
  text-align: center;
  padding: 16px 0;
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.3s ease;

  &:hover {
    color: #8cff20;
  }
`;

export default SubscribeLoginPage;

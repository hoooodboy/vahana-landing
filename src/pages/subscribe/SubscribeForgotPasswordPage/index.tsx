import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SubscribeForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"identity" | "email">("identity");
  const [isLoading, setIsLoading] = useState(false);
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [identityCode, setIdentityCode] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resetToken, setResetToken] = useState(""); // 비밀번호 재설정 토큰

  // 카운트다운 타이머
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // PortOne V2 SDK 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.portone.io/v2/browser-sdk.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://cdn.portone.io/v2/browser-sdk.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // 본인인증 처리
  const handleIdentityVerification = async () => {
    console.log("=== 본인인증 시작 ===");
    try {
      const { PortOne } = window;
      if (!PortOne) {
        console.error("❌ PortOne SDK가 로드되지 않았습니다.");
        toast.error("PortOne SDK가 로드되지 않았습니다.");
        return;
      }

      console.log("✅ PortOne SDK 로드됨");

      const identityVerificationId = `identity-verification-${crypto.randomUUID()}`;
      console.log("🔑 생성된 identityVerificationId:", identityVerificationId);

      // 본인인증 요청
      console.log("📡 본인인증 요청 시작");
      const response = await PortOne.requestIdentityVerification({
        storeId: "store-3994153d-0f8c-46ef-bea0-9237d4dc101b",
        identityVerificationId: identityVerificationId,
        channelKey: "channel-key-1149864d-6a99-45f5-ae45-cac497973f23",
        redirectUrl: `${window.location.origin}/subscribe/forgot-password`,
      });

      console.log("📡 본인인증 요청 응답:", response);

      if (response.code !== undefined) {
        console.error("❌ 본인인증 실패:", response);
        toast.error(`본인인증 실패: ${response.message}`);
        return;
      }

      console.log("✅ 본인인증 요청 성공!");

      // 본인인증 성공 시 바로 비밀번호 재설정 API 호출
      if (response.identityVerificationId) {
        console.log("🔑 identityVerificationId로 비밀번호 재설정 API 호출");

        const resetResponse = await fetch(
          "https://alpha.vahana.kr/accounts/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identity_code: response.identityVerificationId,
            }),
          }
        );

        const resetData = await resetResponse.json();
        console.log("📡 비밀번호 재설정 API 응답:", resetData);

        if (resetResponse.ok && resetData.token?.access_token) {
          console.log("✅ 토큰 발급 성공, 자동 로그인 및 페이지 이동");

          // 토큰을 로컬스토리지에 저장하고 비밀번호 수정 페이지로 이동
          localStorage.setItem(
            "subscribeAccessToken",
            resetData.token.access_token
          );
          localStorage.setItem(
            "subscribeRefreshToken",
            resetData.token.refresh_token || ""
          );

          toast.success("본인인증이 완료되었습니다. 비밀번호를 변경해주세요.");
          navigate("/subscribe/reset-password");
        } else {
          console.error("❌ 비밀번호 재설정 API 실패:", resetData);
          toast.error(resetData.message || "본인인증 처리에 실패했습니다.");
        }
      } else {
        console.error("❌ identityVerificationId가 없습니다:", response);
        toast.error("본인인증 정보를 가져올 수 없습니다.");
      }
    } catch (error: any) {
      console.error("❌ 본인인증 실패:", error);
      toast.error("본인인증에 실패했습니다.");
    }
  };

  // 이메일 인증코드 발송
  const handleSendCode = async () => {
    if (!email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://alpha.vahana.kr/accounts/send-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "email",
            target: email.trim(),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setIsCodeSent(true);
        setCountdown(180); // 3분 타이머
        toast.success("인증코드가 이메일로 발송되었습니다.");
      } else {
        toast.error(data.message || "인증코드 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("인증코드 발송 실패:", error);
      toast.error("인증코드 발송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 재설정 토큰 발급 (이메일)
  const handleGetResetTokenWithEmail = async () => {
    if (!email.trim() || !verificationCode.trim()) {
      toast.error("이메일과 인증코드를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://alpha.vahana.kr/accounts/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target: email.trim(),
            verification_code: verificationCode.trim(),
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.token?.access_token) {
        // 토큰을 로컬스토리지에 저장하고 비밀번호 수정 페이지로 이동
        localStorage.setItem("subscribeAccessToken", data.token.access_token);
        localStorage.setItem(
          "subscribeRefreshToken",
          data.token.refresh_token || ""
        );
        setResetToken(data.token.access_token);
        toast.success("인증이 완료되었습니다. 비밀번호를 변경해주세요.");
        navigate("/subscribe/reset-password");
      } else {
        toast.error(data.message || "인증에 실패했습니다.");
      }
    } catch (error) {
      console.error("인증 실패:", error);
      toast.error("인증에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <BackIcon>←</BackIcon>
        </BackButton>
        <Title>비밀번호 찾기</Title>
      </Header>

      <Content>
        <TabContainer>
          <TabButton
            active={activeTab === "identity"}
            onClick={() => setActiveTab("identity")}
          >
            본인인증
          </TabButton>
          <TabButton
            active={activeTab === "email"}
            onClick={() => setActiveTab("email")}
          >
            이메일 인증
          </TabButton>
        </TabContainer>

        {activeTab === "identity" && (
          <TabContent>
            <Description>
              본인인증이 완료된 회원만 이용 가능합니다.
              <br />
              본인인증 후 비밀번호 변경 페이지로 이동합니다.
            </Description>

            {!isIdentityVerified ? (
              <VerifyButton onClick={handleIdentityVerification}>
                본인인증하기
              </VerifyButton>
            ) : (
              <SuccessSection>
                <SuccessIcon>✓</SuccessIcon>
                <SuccessText>본인인증이 완료되었습니다</SuccessText>
                <LoadingText>비밀번호 변경 페이지로 이동 중...</LoadingText>
              </SuccessSection>
            )}
          </TabContent>
        )}

        {activeTab === "email" && (
          <TabContent>
            <Description>
              가입한 이메일로 인증코드를 발송합니다.
              <br />
              인증코드 확인 후 비밀번호 변경 페이지로 이동합니다.
            </Description>

            <InputGroup>
              <InputLabel>이메일</InputLabel>
              <EmailInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="가입한 이메일을 입력하세요"
                disabled={isCodeSent}
              />
            </InputGroup>

            {!isCodeSent ? (
              <SendCodeButton
                onClick={handleSendCode}
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? "발송 중..." : "인증코드 발송"}
              </SendCodeButton>
            ) : (
              <>
                <InputGroup>
                  <InputLabel>인증코드</InputLabel>
                  <CodeInput
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="6자리 인증코드를 입력하세요"
                    maxLength={6}
                  />
                  {countdown > 0 && (
                    <CountdownText>
                      {Math.floor(countdown / 60)}:
                      {(countdown % 60).toString().padStart(2, "0")}
                    </CountdownText>
                  )}
                </InputGroup>

                <ButtonGroup>
                  <ResendButton
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                  >
                    {countdown > 0
                      ? `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, "0")}`
                      : "재발송"}
                  </ResendButton>
                  <ResetButton
                    onClick={handleGetResetTokenWithEmail}
                    disabled={isLoading || !verificationCode.trim()}
                  >
                    {isLoading ? "처리 중..." : "비밀번호 변경하기"}
                  </ResetButton>
                </ButtonGroup>
              </>
            )}
          </TabContent>
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #000;
  color: #fff;
  /* padding-top: 86px; */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 18px;
  border-bottom: 1px solid #333;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  margin-right: 16px;
`;

const BackIcon = styled.span`
  font-weight: 300;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
`;

const Content = styled.div`
  padding: 24px 18px;
`;

const TabContainer = styled.div`
  display: flex;
  background: #202020;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.active ? "#8cff20" : "transparent")};
  color: ${(props) => (props.active ? "#000" : "#fff")};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #c7c4c4;
  line-height: 1.5;
  text-align: center;
  margin: 0;
`;

const VerifyButton = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: #8cff20;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #7aff1a;
  }
`;

const SuccessSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #202020;
  border-radius: 16px;
`;

const SuccessIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #8cff20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #000;
  font-weight: bold;
`;

const SuccessText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #8cff20;
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #c7c4c4;
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

const EmailInput = styled.input`
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

  &:disabled {
    background: #2f2f2f;
    color: #666;
  }
`;

const CodeInput = styled.input`
  width: 100%;
  height: 56px;
  border: 2px solid #333;
  border-radius: 16px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 16px;
  text-align: center;
  letter-spacing: 4px;
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

const CountdownText = styled.div`
  font-size: 12px;
  color: #8cff20;
  text-align: center;
  font-weight: 600;
`;

const SendCodeButton = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: ${(props) => (props.disabled ? "#666" : "#8cff20")};
  color: ${(props) => (props.disabled ? "#999" : "#000")};
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #7aff1a;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ResendButton = styled.button`
  flex: 1;
  height: 56px;
  border: 2px solid #333;
  border-radius: 16px;
  background: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #666;
  }

  &:disabled {
    color: #666;
  }
`;

const ResetButton = styled.button`
  flex: 1;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: ${(props) => (props.disabled ? "#666" : "#8cff20")};
  color: ${(props) => (props.disabled ? "#999" : "#000")};
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #7aff1a;
  }
`;

// TypeScript 타입 선언
declare global {
  interface Window {
    PortOne: any;
  }
}

export default SubscribeForgotPasswordPage;

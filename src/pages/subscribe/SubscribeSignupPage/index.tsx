import React, { useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import { useNavigate } from "react-router-dom";
import {
  sendVerificationCode,
  verifyEmailCode,
  subscribeSignup,
  SubscribeSignupResponse,
} from "@/src/api/subscribeAuth";
import { toast } from "react-toastify";

const SubscribeSignupPage = () => {
  const navigate = useNavigate();

  // 폼 상태
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referrerPhone, setReferrerPhone] = useState("");

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 약관 동의 상태
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);

  // 인증 코드 발송
  const handleSendVerificationCode = async () => {
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      setSuccessMessage(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await sendVerificationCode(email.trim());
      setIsVerificationCodeSent(true);
      setSuccessMessage("인증 코드가 발송되었습니다.");
      setError(null);
    } catch (e: any) {
      setError(`인증 코드 발송에 실패했습니다: ${e.message}`);
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 인증
  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      setError("인증 코드를 입력해주세요.");
      setSuccessMessage(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verifyEmailCode(email.trim(), verificationCode.trim());
      setIsEmailVerified(true);
      setSuccessMessage("이메일 인증이 완료되었습니다.");
      setError(null);
    } catch (e: any) {
      setError(`인증 코드가 올바르지 않습니다: ${e.message}`);
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입
  const handleSignup = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await subscribeSignup(
        name.trim(),
        mobile.trim(),
        email.trim(),
        password,
        referrerPhone.trim()
      );

      // 회원가입 성공 시 추천인 추가 API 호출
      if (response.token?.access_token && referrerPhone.trim()) {
        try {
          const referralResponse = await fetch(
            `https://alpha.vahana.kr/users/referrals/${referrerPhone.trim()}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${response.token.access_token}`,
              },
            }
          );

          if (referralResponse.ok) {
            const referralData = await referralResponse.json();
            console.log("추천인 추가 성공:", referralData);
          } else {
            console.error("추천인 추가 실패:", referralResponse.status);
          }
        } catch (referralError) {
          console.error("추천인 추가 실패:", referralError);
          // 추천인 추가 실패는 회원가입 성공에 영향을 주지 않음
        }
      }



      // 회원가입 성공 시 토스트 메시지 표시
      toast.success("회원가입이 완료되었습니다! 🎉");

      setSuccessMessage("회원가입이 완료되었습니다.");
      setTimeout(() => {
        navigate("/subscribe/login");
      }, 2000);
    } catch (e: any) {
      setError(`회원가입에 실패했습니다: ${e.message}`);
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 유효성 검사
  const isFormValid =
    name.trim() &&
    mobile.trim() &&
    isEmailVerified &&
    password === confirmPassword &&
    password.length >= 6 &&
    agreeToTerms &&
    agreeToPrivacy;

  // 약관 열기
  const openTerms = () => {
    window.open(
      "https://www.notion.so/237f3024832f80859d83e8e29cf72dc7?source=copy_link",
      "_blank"
    );
  };

  const openPrivacy = () => {
    window.open(
      "https://www.notion.so/245f3024832f807193ecd6398a195419?source=copy_link",
      "_blank"
    );
  };

  return (
    <Container>
      <Header />
      <Content>
        <LogoSection>
          <Logo>회원가입</Logo>
          {/* <Subtitle>구독 서비스 회원가입</Subtitle> */}
        </LogoSection>

        {error && <ErrorBox>{error}</ErrorBox>}
        {successMessage && <SuccessBox>{successMessage}</SuccessBox>}

        <FormSection>
          {/* 이름 입력 */}
          <InputGroup>
            <InputLabel>이름 *</InputLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
            />
          </InputGroup>

          {/* 전화번호 입력 */}
          <InputGroup>
            <InputLabel>전화번호 *</InputLabel>
            <Input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="전화번호를 입력해주세요"
              type="tel"
            />
          </InputGroup>

          {/* 이메일 입력 및 인증 */}
          <InputGroup>
            <InputLabel>이메일 *</InputLabel>
            <EmailInputContainer>
              <EmailInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요"
                type="email"
                disabled={isEmailVerified}
                verified={isEmailVerified}
              />
              <VerifyButton
                onClick={handleSendVerificationCode}
                disabled={isEmailVerified || isLoading}
              >
                {isLoading
                  ? "발송중..."
                  : isEmailVerified
                    ? "인증완료"
                    : "인증하기"}
              </VerifyButton>
            </EmailInputContainer>
          </InputGroup>

          {/* 인증번호 입력 */}
          {isVerificationCodeSent && !isEmailVerified && (
            <InputGroup>
              <InputLabel>인증번호 *</InputLabel>
              <VerificationInputContainer>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="인증번호를 입력해주세요"
                  type="text"
                />
                <VerifyCodeButton onClick={handleVerifyEmail}>
                  확인
                </VerifyCodeButton>
              </VerificationInputContainer>
            </InputGroup>
          )}

          {/* 비밀번호 입력 */}
          <InputGroup>
            <InputLabel>비밀번호 *</InputLabel>
            <PasswordInputContainer>
              <PasswordInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요 (6자 이상)"
              />
              <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "숨기기" : "보기"}
              </PasswordToggle>
            </PasswordInputContainer>
            {password && password.length < 6 && (
              <ErrorText>비밀번호는 6자 이상이어야 합니다.</ErrorText>
            )}
          </InputGroup>

          {/* 비밀번호 확인 */}
          <InputGroup>
            <InputLabel>비밀번호 확인 *</InputLabel>
            <PasswordInputContainer>
              <PasswordInput
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
              />
              <PasswordToggle
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "숨기기" : "보기"}
              </PasswordToggle>
            </PasswordInputContainer>
            {password && confirmPassword && password !== confirmPassword && (
              <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>
            )}
          </InputGroup>

          {/* 추천인 전화번호 */}
          <InputGroup>
            <InputLabel>추천인 코드 (선택)</InputLabel>
            <Input
              value={referrerPhone}
              onChange={(e) => setReferrerPhone(e.target.value)}
              placeholder="추천인 전화번호를 입력해주세요"
              type="tel"
            />
          </InputGroup>

          {/* 약관 동의 */}
          <TermsSection>
            <TermsTitle>약관 동의</TermsTitle>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <CheckboxLabel>
                <RequiredText>이용약관 (필수)</RequiredText>
                <TermsLink onClick={openTerms}>보기</TermsLink>
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={agreeToPrivacy}
                onChange={(e) => setAgreeToPrivacy(e.target.checked)}
              />
              <CheckboxLabel>
                <RequiredText>개인정보처리방침 (필수)</RequiredText>
                <TermsLink onClick={openPrivacy}>보기</TermsLink>
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={agreeToMarketing}
                onChange={(e) => setAgreeToMarketing(e.target.checked)}
              />
              <CheckboxLabel>마케팅 정보 수신 (선택)</CheckboxLabel>
            </CheckboxItem>
          </TermsSection>

          {/* 회원가입 버튼 */}
          <SignupButton
            disabled={!isFormValid || isLoading}
            onClick={handleSignup}
          >
            {isLoading ? "회원가입 중..." : "회원가입"}
          </SignupButton>
        </FormSection>

        <LoginSection>
          <LoginText>이미 계정이 있으신가요?</LoginText>
          <LoginLink onClick={() => navigate("/subscribe/login")}>
            로그인하기
          </LoginLink>
        </LoginSection>
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
  /* background: linear-gradient(135deg, #8cff20 0%, #7aff1a 100%); */
  color: #fff;
  /* -webkit-background-clip: text;
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

const SuccessBox = styled.div`
  background: rgba(140, 255, 32, 0.1);
  border: 1px solid rgba(140, 255, 32, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #8cff20;
  margin-bottom: 24px;
  font-size: 14px;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
`;

const InputGroup = styled.div`
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmailInputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const EmailInput = styled.input<{ verified?: boolean }>`
  flex: 1;
  height: 56px;
  border: 2px solid ${(props) => (props.verified ? "#8cff20" : "#333")};
  border-radius: 16px;
  padding: 0 20px;
  background: ${(props) =>
    props.verified ? "rgba(140, 255, 32, 0.05)" : "rgba(255, 255, 255, 0.05)"};
  color: ${(props) => (props.verified ? "#8cff20" : "#fff")};
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
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const VerifyButton = styled.button`
  height: 56px;
  padding: 0 20px;
  border: none;
  border-radius: 16px;
  background: ${(props) => (props.disabled ? "#333" : "#8cff20")};
  color: ${(props) => (props.disabled ? "#666" : "#000")};
  font-size: 14px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #7aff1a;
  }
`;

const VerificationInputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const VerifyCodeButton = styled.button`
  height: 56px;
  padding: 0 20px;
  border: none;
  border-radius: 16px;
  background: #8cff20;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: #7aff1a;
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

const ErrorText = styled.div`
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
`;

const TermsSection = styled.div`
  margin: 32px 0;
`;

const TermsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #8cff20;
  margin-top: 2px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  flex: 1;
`;

const RequiredText = styled.span`
  font-weight: 600;
`;

const TermsLink = styled.button`
  background: none;
  border: none;
  color: #8cff20;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin: 0;

  &:hover {
    color: #7aff1a;
  }
`;

const SignupButton = styled.button`
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

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(140, 255, 32, 0.3);
  }
`;

const LoginSection = styled.div`
  text-align: center;
  padding: 24px 0;
`;

const LoginText = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const LoginLink = styled.button`
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

export default SubscribeSignupPage;

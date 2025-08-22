import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import {
  subscribeSignup,
  SubscribeSignupResponse,
} from "@/src/api/subscribeAuth";
import { toast } from "react-toastify";

const SubscribeSignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 폼 상태
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referrerPhone, setReferrerPhone] = useState("");

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 약관 동의 상태
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);

  // 본인인증 상태
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isIdentityVerifying, setIsIdentityVerifying] = useState(false);
  const [identityVerificationId, setIdentityVerificationId] = useState("");

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

  // PortOne 본인인증 리다이렉트 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const identityVerificationId = urlParams.get("identityVerificationId");
    const identityVerificationTxId = urlParams.get("identityVerificationTxId");
    const transactionType = urlParams.get("transactionType");

    // 본인인증 완료 후 리다이렉트인 경우
    if (
      identityVerificationId &&
      identityVerificationTxId &&
      transactionType === "IDENTITY_VERIFICATION"
    ) {
      console.log("PortOne 본인인증 완료 감지");

      // URL 파라미터 제거
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      // 본인인증 완료 처리
      setIsIdentityVerified(true);
      setIdentityVerificationId(identityVerificationId);
      setSuccessMessage("본인인증이 완료되었습니다.");
      setError(null);

      // 서버에서 PortOne 인증 결과를 조회해서 사용자 정보 받아오기
      (async () => {
        try {
          const response = await fetch(
            `https://alpha.vahana.kr/accounts/portone/verify?identityVerificationId=${identityVerificationId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            console.log("PortOne 인증된 사용자 정보:", userData);

            // 서버에서 받은 실제 인증된 정보로 폼 업데이트
            if (userData.name) {
              setName(userData.name);
            }
            if (userData.phone || userData.mobile) {
              const phone = userData.phone || userData.mobile;
              // 전화번호 형식 변환 (하이픈 추가)
              const formattedPhone = formatPhoneNumber(phone);
              setMobile(formattedPhone);
            }

            toast.success("본인인증 정보가 자동으로 입력되었습니다.");
          } else {
            console.log("PortOne 인증 정보 조회 실패, 사용자 입력 정보 사용");
          }
        } catch (error) {
          console.error("PortOne 인증 정보 조회 오류:", error);
          // 오류 발생 시 사용자가 입력한 정보 그대로 사용
        }
      })();
    }
  }, [location.search]);

  // 전화번호 형식 변환 함수
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const phoneNumber = value.replace(/[^\d]/g, "");

    // 02로 시작하는 경우 (서울)
    if (phoneNumber.startsWith("02")) {
      if (phoneNumber.length < 3) {
        return phoneNumber;
      } else if (phoneNumber.length < 6) {
        return `${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2)}`;
      } else if (phoneNumber.length < 10) {
        return `${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5)}`;
      } else {
        return `${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    }
    // 휴대폰 번호인 경우
    else {
      if (phoneNumber.length < 4) {
        return phoneNumber;
      } else if (phoneNumber.length < 7) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      } else if (phoneNumber.length < 11) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
      } else {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
      }
    }
  };

  // 이메일 중복체크
  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      setSuccessMessage(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://alpha.vahana.kr/accounts/check-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      if (response.ok) {
        // 이메일 사용 가능
        setIsEmailVerified(true);
        setSuccessMessage("사용 가능한 이메일입니다.");
        setError(null);
      } else {
        // 이메일 중복
        const errorData = await response.json();
        setError(errorData.message || "이미 사용 중인 이메일입니다.");
        setSuccessMessage(null);
        setIsEmailVerified(false);
      }
    } catch (e: any) {
      setError(`이메일 중복체크에 실패했습니다: ${e.message}`);
      setSuccessMessage(null);
      setIsEmailVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 본인인증 요청
  const handleIdentityVerification = async () => {
    if (!name.trim() || !mobile.trim()) {
      setError("이름과 전화번호를 먼저 입력해주세요.");
      return;
    }

    if (isIdentityVerifying) return;

    setIsIdentityVerifying(true);
    setError(null);

    try {
      const { PortOne } = window;
      if (!PortOne) {
        setError("PortOne SDK가 로드되지 않았습니다.");
        setIsIdentityVerifying(false);
        return;
      }

      const phoneNumberWithoutHyphen = mobile.replace(/-/g, "");

      // 본인인증 요청
      const response = await PortOne.requestIdentityVerification({
        storeId: "store-3994153d-0f8c-46ef-bea0-9237d4dc101b",
        identityVerificationId: `identity-verification-${crypto.randomUUID()}`,
        channelKey: "channel-key-1149864d-6a99-45f5-ae45-cac497973f23",
        redirectUrl: `${window.location.origin}/subscribe/signup`,

        customer: {
          fullName: name.trim(),
          phoneNumber: phoneNumberWithoutHyphen,
        },
      });

      if (response.code !== undefined) {
        setError(`본인인증 실패: ${response.message}`);
        setIsIdentityVerifying(false);
        return;
      }

      // 성공 처리
      setIsIdentityVerified(true);
      setIdentityVerificationId(response.identityVerificationId);
      setSuccessMessage("본인인증이 완료되었습니다.");
      setError(null);
    } catch (error) {
      console.error("본인인증 오류:", error);
      setError("본인인증 중 오류가 발생했습니다.");
    } finally {
      setIsIdentityVerifying(false);
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
        identityVerificationId,
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
      // 즉시 로그인 페이지로 이동 (대기 시간 제거)
      navigate("/subscribe/login");
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
    isIdentityVerified &&
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
            <PhoneInputContainer>
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="전화번호를 입력해주세요"
                type="tel"
                disabled={isIdentityVerified}
                style={{
                  background: isIdentityVerified
                    ? "#2f2f2f"
                    : "rgba(255, 255, 255, 0.05)",
                }}
              />
              <IdentityVerifyButton
                onClick={handleIdentityVerification}
                disabled={
                  !name.trim() ||
                  !mobile.trim() ||
                  isIdentityVerified ||
                  isIdentityVerifying
                }
              >
                {isIdentityVerified
                  ? "인증완료"
                  : isIdentityVerifying
                    ? "인증중..."
                    : "본인인증"}
              </IdentityVerifyButton>
            </PhoneInputContainer>
            {isIdentityVerified && (
              <SuccessText>본인인증이 완료되었습니다.</SuccessText>
            )}
          </InputGroup>

          {/* 이메일 입력 및 중복체크 */}
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
                onClick={handleCheckEmail}
                disabled={isEmailVerified || isLoading}
              >
                {isLoading
                  ? "확인중..."
                  : isEmailVerified
                    ? "사용가능"
                    : "중복체크"}
              </VerifyButton>
            </EmailInputContainer>
          </InputGroup>

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

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Logo = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #c7c4c4;
  margin: 8px 0 0 0;
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
  background: #202020;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
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
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const EmailInput = styled.input<{ verified?: boolean }>`
  width: 100%;
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
  min-width: 90px;

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

const PhoneInputContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const IdentityVerifyButton = styled.button`
  min-width: 90px;
  height: 48px;
  background: #3e4730;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background: #c6c6c6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #2e3520;
  }
`;

const SuccessText = styled.div`
  color: #8cff20;
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
  color: #c7c4c4;
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
  color: #c7c4c4;
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

// TypeScript 타입 선언
declare global {
  interface Window {
    PortOne: any;
  }
}

export default SubscribeSignupPage;

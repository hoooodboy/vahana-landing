import React, { useState } from "react";
import styled from "styled-components";
import { usePostApiAuthForgotPw } from "@/src/api/endpoints/auth/auth";
import { useNavigate } from "react-router-dom";

const FindPW: React.FC = () => {
  const navigate = useNavigate();
  // 폼 데이터 상태
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const { mutate: forgotPwMutate } = usePostApiAuthForgotPw();

  // 휴대폰 번호 포맷팅
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, "");

    if (phoneNumber.length < 4) {
      return phoneNumber;
    } else if (phoneNumber.length < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length < 11) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    } else {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  // 첫 번째 단계 폼 유효성 검사
  const isInfoFormValid = () => {
    return id.trim() !== "" && phone.replace(/[^0-9]/g, "").length >= 10;
  };

  // 모든 입력값 유효성 검사
  const isVerifyFormValid = () => {
    return (
      id.trim() !== "" &&
      phone.replace(/[^0-9]/g, "").length >= 10 &&
      verificationCode.trim().length === 6 &&
      newPassword.trim() !== "" &&
      newPassword === confirmPassword
    );
  };

  // 인증번호 요청
  const handleRequestVerification = () => {
    if (!isInfoFormValid()) {
      setError("아이디와 휴대폰 번호를 정확히 입력해주세요.");
      return;
    }

    setError("");
    setIsSendingCode(true);

    const data = {
      id: id,
      phone: phone.replace(/[^0-9]/g, ""), // 하이픈 제거
    };

    forgotPwMutate({ data } as any, {
      onSuccess: (response) => {
        setIsSendingCode(false);
        setVerificationSent(true);
      },
      onError: (error) => {
        setIsSendingCode(false);
        setError("인증번호 발송에 실패했습니다. 입력 정보를 확인해주세요.");
      },
    });
  };

  // 비밀번호 변경 요청
  const handlePasswordReset = () => {
    if (!isVerifyFormValid()) {
      if (newPassword !== confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
      } else if (verificationCode.trim().length !== 6) {
        setError("올바른 인증번호를 입력해주세요.");
      } else {
        setError("모든 항목을 입력해주세요.");
      }
      return;
    }

    setError("");
    setIsLoading(true);

    const data = {
      id: id,
      phone: phone.replace(/[^0-9]/g, ""),
      code: verificationCode,
      new_password: newPassword,
    };

    forgotPwMutate(
      { data },
      {
        onSuccess: (response) => {
          setIsLoading(false);
          setIsComplete(true);
        },
        onError: (error) => {
          setIsLoading(false);
          setError("비밀번호 변경에 실패했습니다. 인증번호를 확인해주세요.");
        },
      }
    );
  };

  // 처음으로 돌아가기
  const handleReset = () => {
    setId("");
    setPhone("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setVerificationSent(false);
    setIsComplete(false);
    navigate("/login");
  };

  return (
    <Container>
      <Form>
        {!isComplete && (
          <>
            <InputGroup>
              <Label>아이디</Label>
              <Input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="아이디를 입력해주세요."
                disabled={verificationSent}
              />
            </InputGroup>

            <InputGroup>
              <Label>휴대폰 번호</Label>
              <PhoneInputWrapper>
                <PhoneInput
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  placeholder="휴대폰 번호를 입력해주세요."
                  disabled={verificationSent}
                />
                <VerificationButton
                  onClick={handleRequestVerification}
                  disabled={
                    !isInfoFormValid() || isSendingCode || verificationSent
                  }
                >
                  {isSendingCode
                    ? "발송 중..."
                    : verificationSent
                      ? "재발송"
                      : "인증번호 발송"}
                </VerificationButton>
              </PhoneInputWrapper>
            </InputGroup>

            {verificationSent && (
              <VerificationMessage>
                인증번호가 발송되었습니다. 휴대폰을 확인해주세요.
              </VerificationMessage>
            )}

            <InputGroup>
              <Label>인증번호</Label>
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호 6자리를 입력해주세요."
                maxLength={6}
              />
            </InputGroup>

            <InputGroup>
              <Label>새 비밀번호</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력해주세요."
              />
            </InputGroup>

            <InputGroup>
              <Label>새 비밀번호 확인</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호를 다시 입력해주세요."
              />
            </InputGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SubmitButton
              onClick={handlePasswordReset}
              disabled={!isVerifyFormValid() || isLoading}
            >
              {isLoading ? "변경 중..." : "비밀번호 변경"}
            </SubmitButton>
          </>
        )}

        {isComplete && (
          <SuccessContainer>
            <SuccessIcon>✓</SuccessIcon>
            <SuccessTitle>비밀번호 변경 완료</SuccessTitle>
            <SuccessMessage>
              비밀번호가 성공적으로 변경되었습니다.
              <br />
              새로운 비밀번호로 로그인해주세요.
            </SuccessMessage>
            <LoginButton onClick={handleReset}>확인</LoginButton>
          </SuccessContainer>
        )}
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 32px 0;
  padding-bottom: 152px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #666;
  font-size: 14px;
  font-weight: 600;
  padding-left: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #c7c7c7;
  background: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
    border-color: #3e4730;
  }

  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
  }
`;

const PhoneInputWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const PhoneInput = styled(Input)`
  flex: 1;
`;

const VerificationButton = styled.button<{ disabled: boolean }>`
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  background: ${(props) => (props.disabled ? "#c7c7c7" : "#3e4730")};
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  white-space: nowrap;
`;

const VerificationMessage = styled.div`
  font-size: 14px;
  color: #3e4730;
  padding: 8px;
  background-color: #f1f3ed;
  border-radius: 8px;
  margin-top: -8px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #ff3b30;
  font-size: 14px;
  font-weight: 500;
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => (props.disabled ? "#c7c7c7" : "#3e4730")};
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-top: 16px;
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 0;
  margin-top: 16px;
  background-color: #f8f9fa;
  border-radius: 16px;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #3e4730;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 16px;
`;

const SuccessTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #3e4730;
  margin: 0;
`;

const SuccessMessage = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #666;
  text-align: center;
  margin-bottom: 16px;
`;

const LoginButton = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  background: #3e4730;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2b331f;
  }
`;

export default FindPW;

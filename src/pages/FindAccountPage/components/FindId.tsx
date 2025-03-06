import React, { useState } from "react";
import styled from "styled-components";
import { usePostApiAuthForgotId } from "@/src/api/endpoints/auth/auth";

const FindId: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { mutate: forgotIdMutate } = usePostApiAuthForgotId();

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const phoneNumber = value.replace(/[^\d]/g, "");

    // 휴대폰 번호 포맷팅
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const isFormValid = () => {
    return name.trim() !== "" && phone.replace(/[^0-9]/g, "").length >= 10;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      setError("이름과 휴대폰 번호를 정확히 입력해주세요.");
      return;
    }

    setError("");
    setIsLoading(true);

    const data = {
      name: name,
      phone: phone.replace(/[^0-9]/g, ""), // 하이픈 제거
    };

    forgotIdMutate(
      { data },
      {
        onSuccess: (response) => {
          setIsLoading(false);
          setIsSubmitted(true);
        },
        onError: (error) => {
          setIsLoading(false);
          setError("아이디 찾기에 실패했습니다. 입력 정보를 확인해주세요.");
        },
      }
    );
  };

  return (
    <Container>
      {!isSubmitted ? (
        <>
          <Form>
            <InputGroup>
              <Label>이름</Label>
              <Input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="이름을 입력해주세요."
              />
            </InputGroup>

            <InputGroup>
              <Label>휴대폰 번호</Label>
              <Input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={13}
                placeholder="휴대폰 번호를 입력해주세요."
              />
            </InputGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Description>
              회원가입 시 등록한 이름과 휴대폰 번호를 입력하시면,
              <br />
              가입하신 이메일로 전화번호로 발송해 드립니다.
            </Description>

            <SubmitButton
              onClick={handleSubmit}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? "처리중..." : "아이디 찾기"}
            </SubmitButton>
          </Form>
        </>
      ) : (
        <SuccessContainer>
          <SuccessIcon>✓</SuccessIcon>
          <SuccessTitle>아이디 찾기 완료</SuccessTitle>
          <SuccessMessage>
            회원님의 아이디가 가입하신 전화번호로 발송되었습니다.
            <br />
            전화번호로 확인해주세요.
          </SuccessMessage>
          <BackButton onClick={() => setIsSubmitted(false)}>
            다시 찾기
          </BackButton>
        </SuccessContainer>
      )}
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

const Description = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  margin-bottom: 32px;
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
`;

const SuccessMessage = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #666;
  text-align: center;
  margin-bottom: 32px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  background: transparent;
  color: #3e4730;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #3e4730;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

export default FindId;

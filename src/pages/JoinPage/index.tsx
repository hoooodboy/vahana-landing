import { usePostApiAuthSignup } from "@/src/api/endpoints/auth/auth";
import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

const JoinPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const kakaoId = searchParams.get("id");
  const provider = searchParams.get("provider");
  const referrer = searchParams.get("referrer"); // 추가: referrer 파라미터 받기

  const [formData, setFormData] = useState({
    name: "",
    id: kakaoId || "",
    password: "",
    passwordConfirm: "",
    phone: "",
    referrerCode: referrer || "", // 초기값으로 referrer 설정
    provider: provider || "LOCAL",
  });

  console.log("formData", formData);

  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (!kakaoId && formData.password && formData.passwordConfirm) {
      setPasswordError(formData.password !== formData.passwordConfirm);
    }
  }, [formData.password, formData.passwordConfirm, kakaoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    if (kakaoId) {
      return !!(formData.name && formData.id && formData.phone);
    } else {
      return !!(
        formData.name &&
        formData.id &&
        formData.password &&
        formData.passwordConfirm &&
        formData.phone &&
        !passwordError
      );
    }
  };

  const signupMutation = usePostApiAuthSignup({
    mutation: {
      onSuccess: (data) => {
        toast("회원가입 성공");
        navigate("/login");
      },
      onError: (error: any) => {
        toast(error.err);
      },
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation.mutate({
      data: {
        name: formData.name,
        id: formData.id,
        password: formData.password,
        phone: formData.phone,
        referrerCode: formData.referrerCode,
        provider: formData.provider,
      },
    });
  };

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    const event = {
      target: {
        name: "phone",
        value: formattedPhone,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          JOIN
          <br />
          MEMBERSHIP
        </Title>
        회원가입
      </TitleContainer>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>이름</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="김아무개"
          />
        </InputGroup>

        <InputGroup>
          <Label>아이디</Label>
          <Input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="아이디를 입력해주세요."
            disabled={!!kakaoId}
            style={{ background: kakaoId ? "#f5f5f5" : "#fff" }}
          />
        </InputGroup>

        {!kakaoId && (
          <>
            <InputGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요."
                $error={passwordError}
              />
            </InputGroup>

            <InputGroup>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력해주세요."
                $error={passwordError}
              />
              {passwordError && (
                <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
              )}
            </InputGroup>
          </>
        )}

        <InputGroup>
          <Label>전화번호</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="전화번호를 입력해주세요."
          />
        </InputGroup>

        <InputGroup>
          <Label>추천인 코드</Label>
          <Input
            type="text"
            name="referrerCode"
            value={formData.referrerCode}
            onChange={handleChange}
            placeholder="추천인 코드를 입력해주세요"
            disabled={!!referrer}
            style={{ background: referrer ? "#f5f5f5" : "#fff" }}
          />
        </InputGroup>

        <SubmitButton type="submit" $isValid={isFormValid()}>
          {"회원가입"}
        </SubmitButton>
      </Form>
      <Devider />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  padding-top: 56px;
  padding-bottom: 215px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 46px 16px 82px;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #666;
  font-size: 14px;
  font-weight: 600;
  padding: 8px;
`;

const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid ${(props) => (props.$error ? "#ff0000" : "#c7c7c7")};
  background: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: #666;
  }
  &:disabled {
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
    border-color: ${(props) => (props.$error ? "#ff0000" : "#3e4730")};
  }
`;

const ErrorMessage = styled.span`
  color: #ff0000;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 8px;
`;

const SubmitButton = styled.button<{ $isValid: boolean }>`
  width: 100%;
  height: 48px;
  background: ${(props) => {
    if (props.disabled) return "#e0e0e0";
    return props.$isValid ? "#3e4730" : "#c6c6c6";
  }};
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 40px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;

  &:hover {
    background: ${(props) => {
      if (props.disabled) return "#e0e0e0";
      return props.$isValid ? "#2e3520" : "#b5b5b5";
    }};
  }
`;

const Devider = styled.div`
  height: 150px;
`;

export default JoinPage;

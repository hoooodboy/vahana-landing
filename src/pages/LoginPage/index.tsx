import {
  PostApiAuthLoginMutationResult,
  usePostApiAuthLogin,
} from "@/src/api/endpoints/auth/auth";
import IcKakao from "@/src/assets/ic-kakao.png";
import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  const loginMutation = usePostApiAuthLogin({
    mutation: {
      onSuccess: async (data: PostApiAuthLoginMutationResult) => {
        // toast("로그인 성공");
        console.log("data", data);

        // 토큰 저장
        if (data.result.accessToken) {
          localStorage.setItem("accessToken", data.result.accessToken);
        }
        if (data.result.refreshToken) {
          localStorage.setItem("refreshToken", data.result.refreshToken);
        }

        navigate("/");
        return;
      },
      onError: (error) => {
        // toast("로그인 실패");
      },
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      data: {
        id: formData.id,
        password: formData.password,
      },
    });
  };

  const handleKakaoLogin = () => {
    window.location.href = "/api/auth/kakao";
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          Login
          <br />
          Page
        </Title>
        로그인
      </TitleContainer>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>아이디</Label>
          <Input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="아이디를 입력해주세요."
          />
        </InputGroup>

        <InputGroup>
          <Label>비밀번호</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력해주세요."
          />
        </InputGroup>
      </Form>

      <UtilWrapper>
        <Util to="/forgot-password">비밀번호 찾기</Util>
        <Util to="/signup">회원가입</Util>
      </UtilWrapper>

      <ButtonWrapper>
        <SubmitButton type="submit" onClick={handleSubmit}>
          로그인
        </SubmitButton>

        <KakaoLoginButton onClick={handleKakaoLogin}>
          <img src={IcKakao} width={36} alt="kakao" />
          카카오 로그인
        </KakaoLoginButton>
      </ButtonWrapper>

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
  min-height: 100vh;
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
  &::placeholder {
    color: #666;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background: #3e4730;
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const Devider = styled.div`
  height: 150px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  margin-top: 32px;
`;

const KakaoLoginButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  background: #fddc3f;
  border: none;
  border-radius: 24px;
  color: #3a2929;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const UtilWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  justify-content: flex-end;
`;

const Util = styled(Link)`
  color: #666;
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
`;

export default LoginPage;

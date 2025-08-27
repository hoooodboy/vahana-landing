import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SubscribeResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    // 토큰 확인
    const accessToken = localStorage.getItem("subscribeAccessToken");
    if (!accessToken) {
      toast.error("인증이 필요합니다.");
      navigate("/subscribe/forgot-password");
      return;
    }
    setToken(accessToken);
  }, [navigate]);

  const handlePasswordChange = async () => {
    // 입력값 검증
    if (!password.trim()) {
      toast.error("새 비밀번호를 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      toast.error("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://alpha.vahana.kr/accounts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: password.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("비밀번호가 성공적으로 변경되었습니다.");
        // 로그인 페이지로 이동
        navigate("/subscribe/login");
      } else {
        toast.error(data.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      toast.error("비밀번호 변경에 실패했습니다.");
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
        <Title>비밀번호 변경</Title>
      </Header>

      <Content>
        <Description>
          새로운 비밀번호를 입력해주세요.
          <br />
          비밀번호는 6자 이상이어야 합니다.
        </Description>

        <InputGroup>
          <InputLabel>새 비밀번호</InputLabel>
          <PasswordInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호를 입력하세요"
            minLength={6}
          />
        </InputGroup>

        <InputGroup>
          <InputLabel>새 비밀번호 확인</InputLabel>
          <PasswordInput
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="새 비밀번호를 다시 입력하세요"
            minLength={6}
          />
        </InputGroup>

        <ChangeButton
          onClick={handlePasswordChange}
          disabled={isLoading || !password.trim() || !confirmPassword.trim()}
        >
          {isLoading ? "변경 중..." : "비밀번호 변경"}
        </ChangeButton>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #000;
  color: #fff;
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

const PasswordInput = styled.input`
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

const ChangeButton = styled.button`
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

export default SubscribeResetPasswordPage;

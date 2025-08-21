import React, { useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SubscribeReferrerPage = () => {
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!referralCode.trim()) {
      toast.error("추천인 코드를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("subscribeAccessToken");

      if (!accessToken) {
        toast.error("로그인이 필요합니다.");
        navigate("/subscribe/login");
        return;
      }

      const response = await fetch(
        `https://alpha.vahana.kr/users/referrals/${referralCode.trim()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success("추천인 코드가 등록되었습니다! 🎉");
        navigate("/subscribe/my");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "제출에 실패했습니다.");
      }
    } catch (error: any) {
      toast.error(`제출에 실패했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header />
      <Content>
        <LogoSection>
          <Logo>추천인 입력</Logo>
          <Subtitle>추천인 코드를 입력해주세요</Subtitle>
        </LogoSection>

        <FormSection>
          <InputGroup>
            <InputLabel>추천인 코드 *</InputLabel>
            <TextArea
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="추천인 코드를 입력해주세요"
              rows={6}
            />
          </InputGroup>

          <SubmitButton
            disabled={!referralCode.trim() || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "제출 중..." : "제출하기"}
          </SubmitButton>

          <BackButton onClick={() => navigate("/subscribe/event")}>
            뒤로가기
          </BackButton>
        </FormSection>
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
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #c7c4c4;
  font-weight: 500;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border: 2px solid #333;
  border-radius: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
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

const SubmitButton = styled.button`
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
  margin-bottom: 16px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(140, 255, 32, 0.3);
  }
`;

const BackButton = styled.button`
  width: 100%;
  height: 56px;
  border: 2px solid #333;
  border-radius: 16px;
  background: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8cff20;
    background: rgba(140, 255, 32, 0.05);
  }
`;

export default SubscribeReferrerPage;

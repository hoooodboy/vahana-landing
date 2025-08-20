import Header from "@/src/components/Header";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";

const SubscribeSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터에서 결제 정보 가져오기
  const paymentId = searchParams.get("payment_id");
  const amount = searchParams.get("amount");
  const month = searchParams.get("month");
  const carId = searchParams.get("car_id");

  useEffect(() => {
    const submitSubscriptionRequest = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("토큰이 없습니다.");
        }

        // 구독 요청 API 호출
        const response = await fetch(
          `https://alpha.vahana.kr/subscriptions/cars/${carId}/request`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              month: parseInt(month || "1"),
              // coupon_id는 현재 없으므로 제외
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`구독 요청 실패: ${response.status}`);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("구독 요청 에러:", err);
        setError(
          err instanceof Error ? err.message : "구독 요청에 실패했습니다."
        );
        setIsLoading(false);
      }
    };

    if (paymentId && amount && month && carId) {
      submitSubscriptionRequest();
    } else {
      setError("결제 정보가 올바르지 않습니다.");
      setIsLoading(false);
    }
  }, [paymentId, amount, month, carId]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoMyPage = () => {
    navigate("/my");
  };

  if (isLoading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <LoadingText>구독 신청을 처리하고 있습니다...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header />
        <ErrorContainer>
          <ErrorIcon>❌</ErrorIcon>
          <ErrorTitle>구독 신청 실패</ErrorTitle>
          <ErrorText>{error}</ErrorText>
          <ErrorButton onClick={handleGoHome}>홈으로 돌아가기</ErrorButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header />

      <ContentContainer>
        <SuccessIcon>✅</SuccessIcon>
        <SuccessTitle>구독 신청이 완료되었습니다!</SuccessTitle>

        <InfoCard>
          <InfoSection>
            <InfoLabel>결제 ID</InfoLabel>
            <InfoValue>{paymentId}</InfoValue>
          </InfoSection>

          <InfoSection>
            <InfoLabel>결제 금액</InfoLabel>
            <InfoValue>
              {Math.floor(parseInt(amount || "0") / 10000)}만원
            </InfoValue>
          </InfoSection>

          <InfoSection>
            <InfoLabel>구독 기간</InfoLabel>
            <InfoValue>{month}개월</InfoValue>
          </InfoSection>
        </InfoCard>

        <MessageSection>
          <MessageTitle>다음 단계</MessageTitle>
          <MessageText>
            구독 신청이 성공적으로 처리되었습니다. 관리자 승인 후 차량 배송이
            진행됩니다.
          </MessageText>
          <MessageText>
            구독 현황은 마이페이지에서 확인하실 수 있습니다.
          </MessageText>
        </MessageSection>

        <ButtonContainer>
          <HomeButton onClick={handleGoHome}>홈으로 돌아가기</HomeButton>
          <MyPageButton onClick={handleGoMyPage}>마이페이지 보기</MyPageButton>
        </ButtonContainer>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding-top: 86px;
`;

const ContentContainer = styled.div`
  padding: 60px 20px;
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 80px;
  margin-bottom: 24px;
`;

const SuccessTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #8cff20;
`;

const InfoCard = styled.div`
  background: #202020;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
`;

const InfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #333;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #c7c4c4;
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

const MessageSection = styled.div`
  margin-bottom: 40px;
`;

const MessageTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
`;

const MessageText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #c7c4c4;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HomeButton = styled.button`
  width: 100%;
  height: 48px;
  border: 1px solid #333;
  border-radius: 12px;
  background: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
  }
`;

const MyPageButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const LoadingText = styled.div`
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  gap: 16px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 60px;
`;

const ErrorTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #ff6b6b;
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: #c7c4c4;
  margin-bottom: 16px;
`;

const ErrorButton = styled.button`
  padding: 12px 24px;
  border: 1px solid #333;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
  }
`;

export default SubscribeSuccessPage;

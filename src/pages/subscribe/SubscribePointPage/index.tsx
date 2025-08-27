import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setupTokenRefresh } from "@/src/utils/tokenRefresh";
import { clearIdentityVerification } from "@/src/utils/identityVerification";

interface PointTransaction {
  id: number;
  user: number;
  amount: number;
  description: string | null;
  transaction_type: string;
  transaction_id: number;
  created_at: string;
  modified_at: string;
}

const SubscribePointPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 토큰 자동 갱신 설정
  useEffect(() => {
    const interval = setupTokenRefresh();
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  // 사용자 정보와 포인트 내역 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("subscribeAccessToken");
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 사용자 정보 가져오기
        const userResponse = await fetch("https://alpha.vahana.kr/accounts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user info");
        }

        const userData = await userResponse.json();
        setUser(userData.user);

        // 포인트 내역 가져오기
        const transactionsResponse = await fetch(
          "https://alpha.vahana.kr/users/point-transactions",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!transactionsResponse.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);
      } catch (err: any) {
        console.error("Error fetching data:", err);

        // 토큰 만료 에러 체크
        if (err.message && err.message.includes("token_not_valid")) {
          console.log("토큰 만료 감지, 로그아웃 처리");
          clearIdentityVerification();
          localStorage.removeItem("subscribeAccessToken");
          localStorage.removeItem("subscribeRefreshToken");
          localStorage.removeItem("subscribeTokenExpiry");
          setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
          return;
        }

        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      toast.error("쿠폰 코드를 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("subscribeAccessToken");
    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `https://alpha.vahana.kr/users/point-coupons/${couponCode.trim()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("포인트가 성공적으로 추가되었습니다!");
        setCouponCode("");

        // 사용자 정보와 포인트 내역 새로고침
        const userResponse = await fetch("https://alpha.vahana.kr/accounts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
        }

        const transactionsResponse = await fetch(
          "https://alpha.vahana.kr/users/point-transactions",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setTransactions(transactionsData);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "쿠폰 사용에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("Error using coupon:", err);
      toast.error("쿠폰 사용 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case "COUPON":
        return "쿠폰 등록";
      case "PURCHASE":
        return "구매";
      case "REFUND":
        return "환불";
      default:
        return type;
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("ko-KR");
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <Content>
          <LoadingContainer>
            <LoadingText>로딩 중...</LoadingText>
          </LoadingContainer>
        </Content>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header />
        <Content>
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
            <BackButton onClick={() => navigate("/subscribe/mypage")}>
              마이페이지로 돌아가기
            </BackButton>
          </ErrorContainer>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Content>
        <PageTitle>포인트</PageTitle>

        {/* 포인트 정보 카드 */}
        <PointCard>
          <PointTitle>내 포인트</PointTitle>
          <PointAmount>{formatAmount(user?.point || 0)}P</PointAmount>
          <PointDescription>
            포인트는 차량 구독 시 할인으로 사용할 수 있습니다.
          </PointDescription>
        </PointCard>

        {/* 쿠폰 코드 입력 */}
        <CouponCard>
          <CouponTitle>쿠폰 코드 입력</CouponTitle>
          <CouponForm onSubmit={handleCouponSubmit}>
            <CouponInput
              type="text"
              placeholder="쿠폰 코드를 입력하세요"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={submitting}
            />
            <CouponButton type="submit" disabled={submitting}>
              {submitting ? "처리 중..." : "포인트 추가"}
            </CouponButton>
          </CouponForm>
        </CouponCard>

        {/* 포인트 내역 */}
        <TransactionCard>
          <TransactionTitle>
            포인트 내역 ({transactions.length}건)
          </TransactionTitle>

          {transactions.length > 0 ? (
            <TransactionList>
              {transactions.map((transaction) => (
                <TransactionItem key={transaction.id}>
                  <TransactionHeader>
                    <TransactionType>
                      {getTransactionTypeText(transaction.transaction_type)}
                    </TransactionType>
                    <TransactionDate>
                      {new Date(transaction.created_at).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </TransactionDate>
                  </TransactionHeader>

                  <TransactionDetails>
                    <TransactionAmount $positive={transaction.amount > 0}>
                      {transaction.amount > 0 ? "+" : ""}
                      {formatAmount(transaction.amount)}P
                    </TransactionAmount>
                    {transaction.description && (
                      <TransactionDescription>
                        {transaction.description}
                      </TransactionDescription>
                    )}
                  </TransactionDetails>
                </TransactionItem>
              ))}
            </TransactionList>
          ) : (
            <EmptyState>
              <EmptyIcon>💰</EmptyIcon>
              <EmptyTitle>포인트 내역이 없습니다</EmptyTitle>
              <EmptyDescription>
                쿠폰 코드를 입력하여 포인트를 받아보세요!
              </EmptyDescription>
            </EmptyState>
          )}
        </TransactionCard>

        <BackButton onClick={() => navigate("/subscribe/my")}>
          마이페이지로 돌아가기
        </BackButton>
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

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #fff;
`;

const PointCard = styled.div`
  background: #202020;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const PointTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`;

const PointAmount = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
`;

const PointDescription = styled.div`
  font-size: 14px;
  color: #c7c4c4;
  line-height: 1.4;
`;

const CouponCard = styled.div`
  background: #202020;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
`;

const CouponTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
`;

const CouponForm = styled.form`
  display: flex;
  gap: 12px;
`;

const CouponInput = styled.input`
  flex: 1;
  background: #2f2f2f;
  border: 1px solid #3f3f3f;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #fff;
  outline: none;

  &::placeholder {
    color: #c7c4c4;
  }

  &:focus {
    border-color: #8cff20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CouponButton = styled.button`
  background: #8cff20;
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #7aff1a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TransactionCard = styled.div`
  background: #202020;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
`;

const TransactionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TransactionItem = styled.div`
  background: #2f2f2f;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #3f3f3f;
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TransactionType = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #8cff20;
`;

const TransactionDate = styled.div`
  font-size: 12px;
  color: #c7c4c4;
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TransactionAmount = styled.div<{ $positive: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${(p) => (p.$positive ? "#8cff20" : "#ff6b6b")};
`;

const TransactionDescription = styled.div`
  font-size: 12px;
  color: #c7c4c4;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: #2f2f2f;
  border-radius: 16px;
  border: 1px dashed #3f3f3f;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`;

const EmptyDescription = styled.div`
  font-size: 14px;
  color: #c7c4c4;
  line-height: 1.4;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #c7c4c4;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: #c7c4c4;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 18px;
  background: #202020;
  color: #fff;
  font-weight: 700;
  margin-top: 20px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2a2a2a;
  }
`;

export default SubscribePointPage;

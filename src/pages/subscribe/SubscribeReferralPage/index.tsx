import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setupTokenRefresh } from "@/src/utils/tokenRefresh";
import { clearIdentityVerification } from "@/src/utils/identityVerification";

const SubscribeReferralPage = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 토큰 자동 갱신 설정
  useEffect(() => {
    const interval = setupTokenRefresh();
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  // 추천인 리스트 가져오기
  useEffect(() => {
    const fetchReferrals = async () => {
      const token = localStorage.getItem("subscribeAccessToken");
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          "https://alpha.vahana.kr/users/referrals",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch referrals");
        }
        const data = await response.json();
        setReferrals(data);
      } catch (err: any) {
        console.error("Error fetching referrals:", err);

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

        setError("추천현황을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const copyCouponCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("쿠폰 코드가 복사되었습니다!");
    } catch (err) {
      console.error("복사 실패:", err);
      toast.error("복사에 실패했습니다.");
    }
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
        <PageTitle>추천현황</PageTitle>

        {/* 내가 추천한 사람들 */}
        <SectionCard>
          <SectionTitle>
            내가 추천한 사람 ({referrals?.referrals_given?.length || 0}명)
          </SectionTitle>
          <SectionDescription>
            내 추천 코드로 가입한 사람들의 목록입니다.
          </SectionDescription>

          {referrals?.referrals_given?.length > 0 ? (
            <ReferralList>
              {referrals.referrals_given.map((referral: any, index: number) => (
                <ReferralItem key={index}>
                  <ReferralItemHeader>
                    <ReferralItemName>
                      {referral.referree_username}
                    </ReferralItemName>
                    <ReferralItemDate>
                      {new Date(referral.created_at).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </ReferralItemDate>
                  </ReferralItemHeader>

                  <ReferralItemDetails>
                    <DetailRow>
                      <DetailLabel>쿠폰 코드:</DetailLabel>
                      <CouponCodeContainer>
                        <CouponCode>
                          {referral.subscription_coupon_code}
                        </CouponCode>
                        <CopyButton
                          onClick={() =>
                            copyCouponCode(referral.subscription_coupon_code)
                          }
                        >
                          복사
                        </CopyButton>
                      </CouponCodeContainer>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>가입일:</DetailLabel>
                      <DetailValue>
                        {new Date(referral.created_at).toLocaleDateString(
                          "ko-KR"
                        )}
                      </DetailValue>
                    </DetailRow>
                  </ReferralItemDetails>
                </ReferralItem>
              ))}
            </ReferralList>
          ) : (
            <EmptyState>
              <EmptyIcon>👥</EmptyIcon>
              <EmptyTitle>아직 추천한 사람이 없습니다</EmptyTitle>
              <EmptyDescription>
                친구에게 추천 코드를 공유해보세요!
              </EmptyDescription>
            </EmptyState>
          )}
        </SectionCard>

        {/* 나를 추천한 사람들 */}
        <SectionCard>
          <SectionTitle>
            나를 추천한 사람 ({referrals?.referrals_received?.length || 0}명)
          </SectionTitle>
          <SectionDescription>
            다른 사람의 추천 코드로 가입했을 때의 정보입니다.
          </SectionDescription>

          {referrals?.referrals_received?.length > 0 ? (
            <ReferralList>
              {referrals.referrals_received.map(
                (referral: any, index: number) => (
                  <ReferralItem key={index}>
                    <ReferralItemHeader>
                      <ReferralItemName>
                        {referral.referrer_username}
                      </ReferralItemName>
                      <ReferralItemDate>
                        {new Date(referral.created_at).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </ReferralItemDate>
                    </ReferralItemHeader>

                    <ReferralItemDetails>
                      <DetailRow>
                        <DetailLabel>쿠폰 코드:</DetailLabel>
                        <CouponCodeContainer>
                          <CouponCode>
                            {referral.subscription_coupon_code}
                          </CouponCode>
                          <CopyButton
                            onClick={() =>
                              copyCouponCode(referral.subscription_coupon_code)
                            }
                          >
                            복사
                          </CopyButton>
                        </CouponCodeContainer>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>가입일:</DetailLabel>
                        <DetailValue>
                          {new Date(referral.created_at).toLocaleDateString(
                            "ko-KR"
                          )}
                        </DetailValue>
                      </DetailRow>
                    </ReferralItemDetails>
                  </ReferralItem>
                )
              )}
            </ReferralList>
          ) : (
            <EmptyState>
              <EmptyIcon>🎁</EmptyIcon>
              <EmptyTitle>아직 나를 추천한 사람이 없습니다</EmptyTitle>
              <EmptyDescription>
                다른 사람의 추천 코드로 가입하면 쿠폰을 받을 수 있습니다.
              </EmptyDescription>
            </EmptyState>
          )}
        </SectionCard>

        <BackButton onClick={() => navigate("/subscribe/mypage")}>
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

const SectionCard = styled.div`
  background: #202020;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #fff;
`;

const SectionDescription = styled.p`
  font-size: 14px;
  color: #c7c4c4;
  margin-bottom: 20px;
  line-height: 1.4;
`;

const ReferralList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReferralItem = styled.div`
  background: #2f2f2f;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #3f3f3f;
`;

const ReferralItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ReferralItemName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

const ReferralItemDate = styled.div`
  font-size: 12px;
  color: #c7c4c4;
`;

const ReferralItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DetailLabel = styled.div`
  font-size: 13px;
  color: #c7c4c4;
  min-width: 70px;
`;

const DetailValue = styled.div`
  font-size: 13px;
  color: #fff;
  font-weight: 500;
`;

const CouponCodeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const CouponCode = styled.div`
  flex: 1;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #8cff20;
  font-family: "Courier New", monospace;
  letter-spacing: 0.5px;
`;

const CopyButton = styled.button`
  background: #8cff20;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #7aff1a;
  }
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

export default SubscribeReferralPage;

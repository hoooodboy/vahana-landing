import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useNavigate } from "react-router-dom";
import {
  getSubscribeCurrentUser,
  SubscribeUser,
} from "@/src/api/subscribeUser";
import { toast } from "react-toastify";

const SubscribeMyPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SubscribeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<any>(null);
  const [referralsLoading, setReferralsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("subscribeAccessToken");
    if (!token) {
      navigate("/subscribe/login");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const me = await getSubscribeCurrentUser(token);
        setUser(me);
      } catch (e: any) {
        setError(e?.message || "사용자 정보 로드 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 추천인 리스트 가져오기
  useEffect(() => {
    const fetchReferrals = async () => {
      const token = localStorage.getItem("subscribeAccessToken");
      if (!token) return;

      try {
        setReferralsLoading(true);
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
      } catch (err) {
        console.error("Error fetching referrals:", err);
      } finally {
        setReferralsLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const onLogout = () => {
    localStorage.removeItem("subscribeAccessToken");
    localStorage.removeItem("subscribeRefreshToken");
    alert("로그아웃되었습니다");
    navigate("/subscribe");
  };

  const copyReferralCode = async () => {
    if (user?.referralCode) {
      try {
        await navigator.clipboard.writeText(user.referralCode);
        toast.success("레퍼럴 코드가 복사되었습니다!");
      } catch (err) {
        console.error("복사 실패:", err);
        toast.error("복사에 실패했습니다.");
      }
    }
  };

  return (
    <Container>
      <Header />
      <Content>
        {loading ? (
          <Center>로딩 중...</Center>
        ) : error ? (
          <Center>{error}</Center>
        ) : user ? (
          <>
            <Card>
              <Row>
                <Avatar
                  src={user.profileImage || ""}
                  onError={(e: any) => (e.currentTarget.style.display = "none")}
                />
                <Col>
                  <Name>{user.username || user.name || "사용자"}</Name>
                  <Small>{user.email}</Small>
                  <Badge $verified={!!user.ciVerified}>
                    {user.ciVerified ? "인증됨" : "미인증"}
                  </Badge>
                </Col>
              </Row>
            </Card>

            {/* 레퍼럴 코드 블록 */}
            {user.referralCode && (
              <ReferralCard>
                <ReferralTitle>내 추천 코드</ReferralTitle>
                <ReferralCodeRow>
                  <ReferralCode>{user.referralCode}</ReferralCode>
                  <CopyButton onClick={copyReferralCode}>복사</CopyButton>
                </ReferralCodeRow>
                <ReferralDesc>
                  친구에게 이 코드를 공유하면 양쪽 모두 혜택을 받을 수 있습니다
                </ReferralDesc>
              </ReferralCard>
            )}

            {/* 추천인 리스트 */}
            <ReferralListCard>
              <ReferralListTitle>추천 현황</ReferralListTitle>

              {/* 내가 추천한 사람들 */}
              <ReferralSection>
                <ReferralSectionTitle>
                  내가 추천한 사람 ({referrals?.referrals_given?.length || 0}명)
                </ReferralSectionTitle>
                {referralsLoading ? (
                  <ReferralLoadingText>로딩 중...</ReferralLoadingText>
                ) : referrals?.referrals_given?.length > 0 ? (
                  referrals.referrals_given.map(
                    (referral: any, index: number) => (
                      <ReferralItem key={index}>
                        <ReferralItemInfo>
                          <ReferralItemName>
                            {referral.referree_username}
                          </ReferralItemName>
                          <ReferralItemDate>
                            {new Date(referral.created_at).toLocaleDateString(
                              "ko-KR"
                            )}
                          </ReferralItemDate>
                        </ReferralItemInfo>
                        <ReferralCouponCode>
                          {referral.subscription_coupon_code}
                        </ReferralCouponCode>
                      </ReferralItem>
                    )
                  )
                ) : (
                  <ReferralEmptyText>
                    아직 추천한 사람이 없습니다
                  </ReferralEmptyText>
                )}
              </ReferralSection>

              {/* 나를 추천한 사람들 */}
              <ReferralSection>
                <ReferralSectionTitle>
                  나를 추천한 사람 ({referrals?.referrals_received?.length || 0}
                  명)
                </ReferralSectionTitle>
                {referralsLoading ? (
                  <ReferralLoadingText>로딩 중...</ReferralLoadingText>
                ) : referrals?.referrals_received?.length > 0 ? (
                  referrals.referrals_received.map(
                    (referral: any, index: number) => (
                      <ReferralItem key={index}>
                        <ReferralItemInfo>
                          <ReferralItemName>
                            {referral.referrer_username}
                          </ReferralItemName>
                          <ReferralItemDate>
                            {new Date(referral.created_at).toLocaleDateString(
                              "ko-KR"
                            )}
                          </ReferralItemDate>
                        </ReferralItemInfo>
                        <ReferralCouponCode>
                          {referral.subscription_coupon_code}
                        </ReferralCouponCode>
                      </ReferralItem>
                    )
                  )
                ) : (
                  <ReferralEmptyText>
                    아직 나를 추천한 사람이 없습니다
                  </ReferralEmptyText>
                )}
              </ReferralSection>
            </ReferralListCard>
            <Actions>
              <ActionButton onClick={() => navigate("/subscribe/coupons")}>
                쿠폰함 보기
              </ActionButton>
              <ActionButton onClick={onLogout}>로그아웃</ActionButton>
            </Actions>
            <FooterWrap>
              <Footer />
            </FooterWrap>
          </>
        ) : (
          <Center>사용자 정보가 없습니다</Center>
        )}
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

const Center = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c7c4c4;
`;

const Card = styled.div`
  background: #202020;
  border-radius: 20px;
  padding: 18px;
  margin: 12px 0 24px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Avatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 48px;
  background: #2f2f2f;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const Small = styled.div`
  font-size: 13px;
  color: #c7c4c4;
`;

const Badge = styled.span<{ $verified: boolean }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  color: ${(p) => (p.$verified ? "#000" : "#c7c4c4")};
  background: ${(p) => (p.$verified ? "#8cff20" : "#2f2f2f")};
  width: fit-content;
`;

const Button = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 18px;
  background: #202020;
  color: #fff;
  font-weight: 700;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  height: 56px;
  border: none;
  border-radius: 18px;
  background: #202020;
  color: #fff;
  font-weight: 700;
`;

const FooterWrap = styled.div`
  margin-top: 60px;
`;

// 레퍼럴 코드 스타일 컴포넌트
const ReferralCard = styled.div`
  background: #202020;
  border-radius: 20px;
  padding: 18px;
  margin: 12px 0 24px;
`;

const ReferralTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
`;

const ReferralCodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const ReferralCode = styled.div`
  flex: 1;
  background: #2f2f2f;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  color: #8cff20;
  font-family: "Courier New", monospace;
  letter-spacing: 1px;
`;

const CopyButton = styled.button`
  background: #8cff20;
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #7aff1a;
  }
`;

const ReferralDesc = styled.div`
  font-size: 12px;
  color: #c7c4c4;
  line-height: 1.4;
`;

// 추천인 리스트 스타일 컴포넌트
const ReferralListCard = styled.div`
  background: #202020;
  border-radius: 20px;
  padding: 18px;
  margin: 12px 0 24px;
`;

const ReferralListTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
`;

const ReferralSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ReferralSectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #c7c4c4;
`;

const ReferralItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #2f2f2f;
  border-radius: 12px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ReferralItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReferralItemName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

const ReferralItemDate = styled.div`
  font-size: 12px;
  color: #c7c4c4;
`;

const ReferralCouponCode = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #8cff20;
  background: #1a1a1a;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: "Courier New", monospace;
`;

const ReferralLoadingText = styled.div`
  font-size: 12px;
  color: #c7c4c4;
  text-align: center;
  padding: 20px 0;
`;

const ReferralEmptyText = styled.div`
  font-size: 12px;
  color: #c7c4c4;
  text-align: center;
  padding: 20px 0;
  background: #2f2f2f;
  border-radius: 12px;
`;

export default SubscribeMyPage;

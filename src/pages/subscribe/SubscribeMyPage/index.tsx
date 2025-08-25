import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getSubscribeCurrentUser,
  getSubscriptionRequests,
  SubscribeUser,
  SubscriptionRequest,
} from "@/src/api/subscribeUser";
import { toast } from "react-toastify";
import { setupTokenRefresh } from "@/src/utils/tokenRefresh";
import IdentityVerificationModal from "@/src/components/IdentityVerificationModal";
import { useIdentityVerification } from "@/src/hooks/useIdentityVerification";
import { clearIdentityVerification } from "@/src/utils/identityVerification";

const SubscribeMyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<SubscribeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<any>(null);
  const [referralsLoading, setReferralsLoading] = useState(false);
  const [subscriptionRequests, setSubscriptionRequests] = useState<
    SubscriptionRequest[]
  >([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // 인증 모달 관리
  const { showModal, handleVerificationComplete } = useIdentityVerification({
    serverVerified: user?.ciVerified,
    isLoading: loading,
  });

  // PortOne 본인인증 리다이렉트 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const identityVerificationId = urlParams.get("identityVerificationId");
    const identityVerificationTxId = urlParams.get("identityVerificationTxId");
    const transactionType = urlParams.get("transactionType");

    // 본인인증 완료 후 리다이렉트인 경우
    if (
      identityVerificationId &&
      identityVerificationTxId &&
      transactionType === "IDENTITY_VERIFICATION"
    ) {
      console.log("PortOne 본인인증 완료 감지");

      // URL 파라미터 제거
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      // PortOne 인증 완료 처리
      const token = localStorage.getItem("subscribeAccessToken");
      if (token && identityVerificationId) {
        (async () => {
          try {
            // PortOne 인증 ID를 서버로 전송
            const response = await fetch(
              "https://alpha.vahana.kr/accounts/portone",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  identity_code: identityVerificationId,
                }),
              }
            );

            if (response.ok) {
              console.log("PortOne 인증 완료 처리 성공");

              // 서버 응답에서 사용자 정보 받아오기
              const responseData = await response.json();
              console.log("PortOne 인증 응답:", responseData);

              // 로컬스토리지에 인증 완료 저장
              localStorage.setItem("subscribeIdentityVerified", "true");

              // 사용자 정보 새로고침
              const me = await getSubscribeCurrentUser();
              setUser(me);

              toast.success("본인인증이 완료되었습니다!");
            } else {
              const errorData = await response.json();
              console.error("PortOne 인증 처리 실패:", errorData);
              toast.error(errorData.message || "본인인증 처리에 실패했습니다.");
            }
          } catch (e: any) {
            console.error("Error processing PortOne verification:", e);
            toast.error("본인인증 처리 중 오류가 발생했습니다.");
          }
        })();
      }
    }
  }, [location.search]);

  useEffect(() => {
    const token = localStorage.getItem("subscribeAccessToken");
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트하지 않고 로그인 상태만 표시
      setLoading(false);
      setError("로그인이 필요합니다.");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const me = await getSubscribeCurrentUser();
        setUser(me);
      } catch (e: any) {
        console.error("Error fetching user info:", e);

        // 토큰 만료 에러 체크
        if (e.message && e.message.includes("token_not_valid")) {
          console.log("토큰 만료 감지, 로그아웃 처리");
          clearIdentityVerification();
          localStorage.removeItem("subscribeAccessToken");
          localStorage.removeItem("subscribeRefreshToken");
          localStorage.removeItem("subscribeTokenExpiry");
          setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
          return;
        }

        setError(e?.message || "사용자 정보 로드 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      } catch (err: any) {
        console.error("Error fetching referrals:", err);

        // 토큰 만료 에러 체크
        if (err.message && err.message.includes("token_not_valid")) {
          console.log("토큰 만료 감지, 로그아웃 처리");
          clearIdentityVerification();
          localStorage.removeItem("subscribeAccessToken");
          localStorage.removeItem("subscribeRefreshToken");
          localStorage.removeItem("subscribeTokenExpiry");
          console.log("로그인이 만료되었습니다. 다시 로그인해주세요.");
          return;
        }
      } finally {
        setReferralsLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  // 차량 신청 리스트 가져오기
  useEffect(() => {
    const fetchSubscriptionRequests = async () => {
      const token = localStorage.getItem("subscribeAccessToken");
      if (!token) return;

      try {
        setRequestsLoading(true);
        const requests = await getSubscriptionRequests();
        setSubscriptionRequests(requests);
      } catch (err: any) {
        console.error("Error fetching subscription requests:", err);

        // 토큰 만료 에러 체크
        if (err.message && err.message.includes("token_not_valid")) {
          console.log("토큰 만료 감지, 로그아웃 처리");
          clearIdentityVerification();
          localStorage.removeItem("subscribeAccessToken");
          localStorage.removeItem("subscribeRefreshToken");
          localStorage.removeItem("subscribeTokenExpiry");
          console.log("로그인이 만료되었습니다. 다시 로그인해주세요.");
          return;
        }
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchSubscriptionRequests();
  }, [navigate]);

  const onLogout = () => {
    localStorage.removeItem("subscribeAccessToken");
    localStorage.removeItem("subscribeRefreshToken");
    clearIdentityVerification(); // 인증 상태 초기화
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
          <Center>
            {error}
            <br />
            <LoginButton onClick={() => navigate("/subscribe/login")}>
              로그인하기
            </LoginButton>
          </Center>
        ) : user ? (
          <>
            <IdentityVerificationModal
              isVisible={showModal}
              onVerificationComplete={handleVerificationComplete}
            />
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

            {/* 차량 신청 리스트 */}
            <RequestListCard>
              <RequestListTitle>
                내 신청 차량 ({subscriptionRequests.length}대)
              </RequestListTitle>
              {requestsLoading ? (
                <RequestLoadingText>로딩 중...</RequestLoadingText>
              ) : subscriptionRequests.length > 0 ? (
                subscriptionRequests.map((request, index) => (
                  <RequestItem key={request.id}>
                    <RequestItemInfo>
                      <RequestItemTitle>
                        {request.car.model.brand.name} {request.car.model.name}
                      </RequestItemTitle>
                      <RequestItemDetails>
                        <RequestDetail>
                          <RequestDetailLabel>구독 기간:</RequestDetailLabel>
                          <RequestDetailValue>
                            {request.month}개월
                          </RequestDetailValue>
                        </RequestDetail>
                        <RequestDetail>
                          <RequestDetailLabel>신청일:</RequestDetailLabel>
                          <RequestDetailValue>
                            {new Date(request.created_at).toLocaleDateString(
                              "ko-KR"
                            )}
                          </RequestDetailValue>
                        </RequestDetail>
                        {request.coupon && (
                          <RequestDetail>
                            <RequestDetailLabel>사용 쿠폰:</RequestDetailLabel>
                            <RequestDetailValue>
                              {request.coupon.coupon.name} (
                              {request.coupon.coupon.code})
                            </RequestDetailValue>
                          </RequestDetail>
                        )}
                      </RequestItemDetails>
                    </RequestItemInfo>
                    <RequestStatus>
                      {request.coupon ? (
                        <RequestStatusBadge $used={true}>
                          쿠폰 사용됨
                        </RequestStatusBadge>
                      ) : (
                        <RequestStatusBadge $used={false}>
                          신청 완료
                        </RequestStatusBadge>
                      )}
                    </RequestStatus>
                  </RequestItem>
                ))
              ) : (
                <RequestEmptyText>아직 신청한 차량이 없습니다</RequestEmptyText>
              )}
            </RequestListCard>
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

// 차량 신청 리스트 스타일 컴포넌트
const RequestListCard = styled.div`
  background: #202020;
  border-radius: 20px;
  padding: 18px;
  margin: 12px 0 24px;
`;

const RequestListTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
`;

const RequestItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: #2f2f2f;
  border-radius: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RequestItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const RequestItemTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

const RequestItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RequestDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RequestDetailLabel = styled.div`
  font-size: 12px;
  color: #c7c4c4;
  min-width: 60px;
`;

const RequestDetailValue = styled.div`
  font-size: 12px;
  color: #fff;
  font-weight: 500;
`;

const RequestStatus = styled.div`
  display: flex;
  align-items: flex-start;
`;

const RequestStatusBadge = styled.div<{ $used: boolean }>`
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  color: ${(p) => (p.$used ? "#000" : "#fff")};
  background: ${(p) => (p.$used ? "#8cff20" : "#666")};
`;

const RequestLoadingText = styled.div`
  font-size: 12px;
  color: #c7c4c4;
  text-align: center;
  padding: 20px 0;
`;

const RequestEmptyText = styled.div`
  font-size: 12px;
  color: #c7c4c4;
  text-align: center;
  padding: 20px 0;
  background: #2f2f2f;
  border-radius: 12px;
`;

const LoginButton = styled.button`
  background: #8cff20;
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #7aee1a;
  }
`;

export default SubscribeMyPage;

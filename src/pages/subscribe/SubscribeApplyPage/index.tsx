import Header from "@/src/components/Header";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { usePG } from "../../../utils/usePG";
import { postPurchasePrepare } from "../../../api/purchase";

// API 데이터 타입 정의
interface CarData {
  id: number;
  retail_price: number;
  release_date: string;
  mileage: number;
  is_new: boolean;
  subscription_fee_1: number | null;
  subscription_fee_3: number | null;
  subscription_fee_6: number | null;
  subscription_fee_12: number | null;
  images: string[];
}

interface BrandData {
  id: number;
  name: string;
  image: string | null;
}

interface SubscriptionModel {
  id: number;
  brand: BrandData;
  name: string;
  code: string;
  image: string;
  car: CarData[];
}

const SubscribeApplyPage = () => {
  const { id, month } = useParams<{ id: string; month: string }>();
  const navigate = useNavigate();
  const selectedOption = month ? parseInt(month) : 1;

  const [subscriptionData, setSubscriptionData] = useState<SubscriptionModel[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 약관 동의 상태
  const [isAgreed1, setIsAgreed1] = useState(false);
  const [isAgreed2, setIsAgreed2] = useState(false);
  const [isAgreed3, setIsAgreed3] = useState(false);
  const [isAgreed4, setIsAgreed4] = useState(false);
  const [isAgreed5, setIsAgreed5] = useState(false);
  const [isAgreed6, setIsAgreed6] = useState(false);
  const [isAgreed7, setIsAgreed7] = useState(false);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchCarDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://alpha.vahana.kr/subscriptions/models/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSubscriptionData([data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching car detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetail();
  }, [id]);

  // 현재 차량 정보 찾기
  const currentCar = subscriptionData.find((model) => model.id === Number(id));
  const carInfo = currentCar?.car[0];

  // 선택된 옵션의 가격
  const getSelectedPrice = () => {
    if (!carInfo) return 0;
    switch (selectedOption) {
      case 1:
        return carInfo.subscription_fee_1;
      case 3:
        return carInfo.subscription_fee_3;
      case 6:
        return carInfo.subscription_fee_6;
      case 12:
        return carInfo.subscription_fee_12;
      default:
        return carInfo.subscription_fee_6;
    }
  };

  const selectedPrice = getSelectedPrice();

  // 전체 동의 상태
  const isAllAgreed =
    isAgreed1 &&
    isAgreed2 &&
    isAgreed3 &&
    isAgreed4 &&
    isAgreed5 &&
    isAgreed6 &&
    isAgreed7;

  // 전체 동의 처리
  const handleAllAgree = (checked: boolean) => {
    setIsAgreed1(checked);
    setIsAgreed2(checked);
    setIsAgreed3(checked);
    setIsAgreed4(checked);
    setIsAgreed5(checked);
    setIsAgreed6(checked);
    setIsAgreed7(checked);
  };

  // 이용약관 열기
  const handleTerms = () => {
    window.open(
      "https://www.notion.so/237f3024832f80859d83e8e29cf72dc7?source=copy_link",
      "_blank"
    );
  };

  // 모달에서 동의하기
  const handleModalAgree = () => {
    setIsModalOpen(false);
    setIsLoading(true);

    // 구매 준비 API 호출
    postPurchasePrepare({
      packId: id || "",
      price: selectedPrice || 0,
      amount: 1,
      currency: "KRW",
    })
      .then((res) => {
        // usePG 훅 사용
        usePG({
          orderId: `${res.result.id}-${new Date().getTime()}`,
          amount: 1,
          price: selectedPrice || 0,
          userInfo: {
            email: "test@test.com",
            name: "구매자",
            number: "010-1234-5678",
            month: selectedOption,
          },
          name: `${currentCar?.brand.name} ${currentCar?.name} ${selectedOption}개월 구독`, // EUC-KR 인코딩 가능한 한글
          buyer_name: "구매자", // EUC-KR 인코딩 가능한 한글
          buyer_email: "test@test.com",
          setIsLoading,
          setResultCards: (result: any) => {
            console.log("결제 완료:", result);
            alert("구독 신청이 완료되었습니다.");
            navigate("/my");
          },
          setIsOpen: () => {},
          packId: id || "",
          userInfoCurrency: "KRW",
        });
      })
      .catch((err) => {
        console.error("구매 준비 실패:", err);
        alert("구매 준비에 실패했습니다.");
        setIsLoading(false);
      });
  };

  // 구독 신청하기
  const handleSubscribe = () => {
    if (!isAllAgreed) {
      alert("모든 약관에 동의해주세요.");
      return;
    }

    const isLoggedIn = localStorage.getItem("subscribeAccessToken");
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 모달 열기
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <LoadingText>차량 정보를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error || !currentCar || !carInfo) {
    return (
      <Container>
        <Header />
        <ErrorContainer>
          <ErrorText>차량을 찾을 수 없습니다.</ErrorText>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header />

      <ContentContainer>
        <CloseButton onClick={() => navigate(-1)}>
          <CloseIcon>✕</CloseIcon>
        </CloseButton>

        <TitleSection>
          <Title>구독 상품 정보를</Title>
          <Title>확인해주세요</Title>
        </TitleSection>

        <ScrollContainer>
          <Section>
            <SectionTitle>상품 정보</SectionTitle>
            <ProductCard>
              <ProductInfo>
                <BrandName>{currentCar.brand.name}</BrandName>
                <ProductName>
                  {currentCar.name} {selectedOption}개월 구독권
                </ProductName>
              </ProductInfo>
              <PriceInfo>
                <PriceRow>
                  <PriceText>
                    {Math.floor((selectedPrice || 0) / 10000)}만원/월
                  </PriceText>
                </PriceRow>
                <VatText>VAT 포함</VatText>
              </PriceInfo>
            </ProductCard>
          </Section>

          <Section>
            <SectionTitle>이용약관</SectionTitle>
            <TermsLink onClick={handleTerms}>
              <TermsTextSpan>이용약관 확인하기</TermsTextSpan>
              <ArrowIcon>→</ArrowIcon>
            </TermsLink>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={isAllAgreed}
                onChange={(e) => handleAllAgree(e.target.checked)}
              />
              <CheckboxLabelBold>전체동의</CheckboxLabelBold>
            </CheckboxItem>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={isAgreed1}
                onChange={(e) => setIsAgreed1(e.target.checked)}
              />
              <CheckboxLabel>
                정기결제 이용약관에 동의하였음을 확인합니다.
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={isAgreed2}
                onChange={(e) => setIsAgreed2(e.target.checked)}
              />
              <CheckboxLabel>
                자동차 구독 서비스 이용약관에 동의하였음을 확인합니다.
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={isAgreed3}
                onChange={(e) => setIsAgreed3(e.target.checked)}
              />
              <CheckboxLabel>
                구독자동차 반환 시 평가기준에 동의하였음을 확인합니다.
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={isAgreed4}
                onChange={(e) => setIsAgreed4(e.target.checked)}
              />
              <CheckboxLabel>
                위치정보 이용약관에 동의하였음을 확인합니다.
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={isAgreed5}
                onChange={(e) => setIsAgreed5(e.target.checked)}
              />
              <CheckboxLabel>
                전자금융거래 기본약관에 동의하였음을 확인합니다.
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={isAgreed6}
                onChange={(e) => setIsAgreed6(e.target.checked)}
              />
              <CheckboxLabel>
                개인(신용)정보 수집이용에 동의하였음을 확인합니다.
              </CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={isAgreed7}
                onChange={(e) => setIsAgreed7(e.target.checked)}
              />
              <CheckboxLabel>
                개인(신용)정보 제공에 동의하였음을 확인합니다.
              </CheckboxLabel>
            </CheckboxItem>
          </Section>
        </ScrollContainer>
      </ContentContainer>

      <BottomNavigation>
        <SubscribeButton
          onClick={handleSubscribe}
          disabled={!isAllAgreed || isLoading}
        >
          {isLoading ? "처리 중..." : "구독 신청하기"}
        </SubscribeButton>
      </BottomNavigation>

      {/* 약관 동의 모달 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>구독 상품 정보를 확인하고</ModalTitle>
              <ModalTitle>약관에 동의해주세요.</ModalTitle>
            </ModalHeader>

            <ModalContent>
              <InfoSection>
                <InfoLabel>차량명</InfoLabel>
                <InfoValue>
                  {currentCar?.brand.name} {currentCar?.name}
                </InfoValue>
              </InfoSection>

              <InfoSection>
                <InfoLabel>이용기간</InfoLabel>
                <InfoValue>{selectedOption}개월</InfoValue>
              </InfoSection>

              <InfoSection>
                <InfoLabel>구독료</InfoLabel>
                <InfoValue>
                  {Math.floor((selectedPrice || 0) / 10000)}만원/월
                </InfoValue>
              </InfoSection>

              <InfoSection>
                <InfoLabel>구독약관</InfoLabel>
                <InfoValue>이용조건 : 만 26세 이상/면허취득 1년이상</InfoValue>
              </InfoSection>

              <InfoSection>
                <InfoLabel>약정 운행거리</InfoLabel>
                <InfoValue>1000km x {selectedOption}개월</InfoValue>
              </InfoSection>

              <TermsSection>
                <TermsText>
                  전차종 금연차량으로 흡연시 클리닝 비용 및 패널티 비용이
                  부과됩니다.
                </TermsText>
                <TermsText>
                  구독 기간 중 발생한 과태료 및 벌금은 구독자가 지불합니다
                </TermsText>
                <TermsText>
                  구독 기간 종료 전 차량 반납시 잔여 개월에 따른 위약금이
                  발생합니다.
                </TermsText>
              </TermsSection>

              <ModalCheckboxSection>
                <ModalCheckboxItem>
                  <ModalCheckbox
                    type="checkbox"
                    checked={isAgreed1}
                    onChange={(e) => setIsAgreed1(e.target.checked)}
                  />
                  <ModalCheckboxLabel>
                    정기결제 이용약관에 동의하였음을 확인합니다.
                  </ModalCheckboxLabel>
                </ModalCheckboxItem>

                <ModalCheckboxItem>
                  <ModalCheckbox
                    type="checkbox"
                    checked={isAgreed2}
                    onChange={(e) => setIsAgreed2(e.target.checked)}
                  />
                  <ModalCheckboxLabel>
                    자동차 구독 서비스 이용약관에 동의하였음을 확인합니다.
                  </ModalCheckboxLabel>
                </ModalCheckboxItem>

                <ModalCheckboxItem>
                  <ModalCheckbox
                    type="checkbox"
                    checked={isAgreed3}
                    onChange={(e) => setIsAgreed3(e.target.checked)}
                  />
                  <ModalCheckboxLabel>
                    구독자동차 반환 시 평가기준에 동의하였음을 확인합니다.
                  </ModalCheckboxLabel>
                </ModalCheckboxItem>

                <ModalCheckboxItem>
                  <ModalCheckbox
                    type="checkbox"
                    checked={isAgreed4}
                    onChange={(e) => setIsAgreed4(e.target.checked)}
                  />
                  <ModalCheckboxLabel>
                    위치정보 이용약관에 동의하였음을 확인합니다.
                  </ModalCheckboxLabel>
                </ModalCheckboxItem>

                <ModalCheckboxItem>
                  <ModalCheckbox
                    type="checkbox"
                    checked={isAgreed5}
                    onChange={(e) => setIsAgreed5(e.target.checked)}
                  />
                  <ModalCheckboxLabel>
                    전자금융거래 기본약관에 동의하였음을 확인합니다.
                  </ModalCheckboxLabel>
                </ModalCheckboxItem>

                <ModalCheckboxItem>
                  <ModalCheckbox
                    type="checkbox"
                    checked={isAgreed6}
                    onChange={(e) => setIsAgreed6(e.target.checked)}
                  />
                  <ModalCheckboxLabel>
                    개인(신용)정보 수집이용에 동의하였음을 확인합니다.
                  </ModalCheckboxLabel>
                </ModalCheckboxItem>

                <ModalCheckboxItem>
                  <ModalCheckbox
                    type="checkbox"
                    checked={isAgreed7}
                    onChange={(e) => setIsAgreed7(e.target.checked)}
                  />
                  <ModalCheckboxLabel>
                    개인(신용)정보 제공에 동의하였음을 확인합니다.
                  </ModalCheckboxLabel>
                </ModalCheckboxItem>

                <ModalCheckboxItem>
                  <ModalCheckbox
                    type="checkbox"
                    checked={
                      isAgreed1 &&
                      isAgreed2 &&
                      isAgreed3 &&
                      isAgreed4 &&
                      isAgreed5 &&
                      isAgreed6 &&
                      isAgreed7
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setIsAgreed1(true);
                        setIsAgreed2(true);
                        setIsAgreed3(true);
                        setIsAgreed4(true);
                        setIsAgreed5(true);
                        setIsAgreed6(true);
                        setIsAgreed7(true);
                      } else {
                        setIsAgreed1(false);
                        setIsAgreed2(false);
                        setIsAgreed3(false);
                        setIsAgreed4(false);
                        setIsAgreed5(false);
                        setIsAgreed6(false);
                        setIsAgreed7(false);
                      }
                    }}
                  />
                  <ModalCheckboxLabelBold>전체동의</ModalCheckboxLabelBold>
                </ModalCheckboxItem>
              </ModalCheckboxSection>
            </ModalContent>

            <ModalButtons>
              <ModalCancelButton onClick={() => setIsModalOpen(false)}>
                취소
              </ModalCancelButton>
              <ModalAgreeButton
                onClick={handleModalAgree}
                disabled={
                  !(
                    isAgreed1 &&
                    isAgreed2 &&
                    isAgreed3 &&
                    isAgreed4 &&
                    isAgreed5 &&
                    isAgreed6 &&
                    isAgreed7
                  )
                }
              >
                동의하기
              </ModalAgreeButton>
            </ModalButtons>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding-top: 86px;
  position: relative;
  padding-bottom: 338px;
`;

const ContentContainer = styled.div`
  padding: 36px 18px 0;
  height: calc(100vh - 86px - 120px);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 18px;
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
`;

const CloseIcon = styled.span`
  font-weight: 300;
`;

const TitleSection = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
`;

const ScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #c7c4c4;
`;

const ProductCard = styled.div`
  background: #202020;
  border-radius: 12px;
  padding: 18px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BrandName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #c7c4c4;
`;

const ProductName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const PriceText = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #8cff20;
`;

const VatText = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #c7c4c4;
`;

const TermsLink = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  margin-bottom: 12px;
`;

const TermsTextSpan = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

const ArrowIcon = styled.span`
  font-size: 12px;
  font-weight: 700;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #8cff20;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
`;

const CheckboxLabelBold = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  text-decoration: underline;
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 84px;
  background: #000;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  z-index: 1000;
  max-width: 480px;
  margin: 0 auto;
`;

const SubscribeButton = styled.button`
  width: 100%;
  height: 60px;
  border: none;
  border-radius: 16px;
  background: ${(props) => (props.disabled ? "#666" : "#8cff20")};
  color: #000;
  font-size: 18px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
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
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: #ff6b6b;
`;

// 모달 스타일 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background: #202020;
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
`;

const ModalContent = styled.div`
  margin-bottom: 24px;
`;

const InfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #333;
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
  text-align: right;
`;

const TermsSection = styled.div`
  margin: 16px 0;
  padding: 16px;
  background: #333;
  border-radius: 8px;
`;

const TermsText = styled.p`
  font-size: 12px;
  color: #c7c4c4;
  margin: 0 0 8px 0;
  line-height: 1.4;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ModalCheckboxSection = styled.div`
  margin-top: 16px;
`;

const ModalCheckboxItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

const ModalCheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #8cff20;
  margin-top: 2px;
`;

const ModalCheckboxLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  line-height: 1.4;
  flex: 1;
`;

const ModalCheckboxLabelBold = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  text-decoration: underline;
  flex: 1;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ModalCancelButton = styled.button`
  flex: 1;
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

const ModalAgreeButton = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: ${(props) => (props.disabled ? "#666" : "#8cff20")};
  color: #000;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #7aff1a;
  }
`;

export default SubscribeApplyPage;

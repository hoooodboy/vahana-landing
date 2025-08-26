import Header from "@/src/components/Header";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { usePG } from "../../../utils/usePG";
import { postPurchasePrepare } from "../../../api/purchase";

import MainBanner1 from "@/src/assets/sub-car-detail-1.png";
import MainBanner2 from "@/src/assets/sub-car-detail-2.png";
import MainBanner3 from "@/src/assets/sub-car-detail-3.png";
import IcLexus from "@/src/assets/ic-lexus.png";
import IcToyota from "@/src/assets/ic-toyota.png";
import IcBenz from "@/src/assets/ic-benz.png";
import IcGene from "@/src/assets/ic-gene.png";
import IcFerarri from "@/src/assets/ic-ferarri.png";
import IcTesla from "@/src/assets/ic-tesla.png";
import IcHyundai from "@/src/assets/ic-hyundai.png";

import {
  CarouselProvider,
  Dot,
  DotGroup,
  Slide,
  Slider,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import "./styles/style.css";

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
  subscription_fee_24: number | null;
  subscription_fee_36: number | null;
  subscription_fee_48: number | null;
  subscription_fee_60: number | null;
  subscription_fee_72: number | null;
  subscription_fee_84: number | null;
  subscription_fee_96: number | null;
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

const SubscribeCarDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [subscriptionData, setSubscriptionData] = useState<SubscriptionModel[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setSubscriptionData([data]); // 단일 객체를 배열로 변환
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

  // 사용 가능한 구독 옵션들 (개월 수 큰 것 포함)
  const getAvailableOptions = () => {
    if (!carInfo) return [];
    const options: number[] = [];
    if (carInfo.subscription_fee_1) options.push(1);
    if (carInfo.subscription_fee_3) options.push(3);
    if (carInfo.subscription_fee_6) options.push(6);
    if (carInfo.subscription_fee_12) options.push(12);
    if (carInfo.subscription_fee_24) options.push(24);
    if (carInfo.subscription_fee_36) options.push(36);
    if (carInfo.subscription_fee_48) options.push(48);
    if (carInfo.subscription_fee_60) options.push(60);
    if (carInfo.subscription_fee_72) options.push(72);
    if (carInfo.subscription_fee_84) options.push(84);
    if (carInfo.subscription_fee_96) options.push(96);
    return options.sort((a, b) => a - b);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 주행거리 포맷팅 함수
  const formatMileage = (mileage: number) => {
    return `${formatPrice(mileage)}km`;
  };

  // 데이터 로드된 후, 가장 큰 개월 수 기본 선택
  useEffect(() => {
    if (carInfo) {
      const available = getAvailableOptions();
      if (available.length > 0) {
        const lastOption = available[available.length - 1];
        setSelectedOption(lastOption);
      }
    }
  }, [carInfo]);

  // 선택된 옵션의 가격
  const getSelectedPrice = () => {
    if (!carInfo || selectedOption === null) return 0;
    const map: { [k: number]: number | null } = {
      1: carInfo.subscription_fee_1,
      3: carInfo.subscription_fee_3,
      6: carInfo.subscription_fee_6,
      12: carInfo.subscription_fee_12,
      24: carInfo.subscription_fee_24,
      36: carInfo.subscription_fee_36,
      48: carInfo.subscription_fee_48,
      60: carInfo.subscription_fee_60,
      72: carInfo.subscription_fee_72,
      84: carInfo.subscription_fee_84,
      96: carInfo.subscription_fee_96,
    };
    return map[selectedOption] ?? 0;
  };

  const handleSubscribe = () => {
    // 로그인 체크 후 구독 신청 페이지로 이동
    const isLoggedIn = localStorage.getItem("subscribeAccessToken");
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/subscribe/login");
      return;
    }

    // 구독 신청 페이지로 이동
    navigate(`/subscribe/${id}/apply?month=${selectedOption}`);
  };

  const handleKakaoTalk = () => {
    window.open("http://pf.kakao.com/_yxcxhVn/chat", "_blank");
  };

  const handleTerms = () => {
    window.open(
      "https://www.notion.so/237f3024832f80859d83e8e29cf72dc7?source=copy_link",
      "_blank"
    );
  };

  const handleFAQ = () => {
    navigate("/subscribe/faq");
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

  const availableOptions = getAvailableOptions();
  const selectedPrice = getSelectedPrice();

  return (
    <Container>
      <Header />

      {/* 이미지 캐러셀 */}
      <ImageCarousel>
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={100}
          totalSlides={carInfo.images.length}
          infinite={true}
        >
          <Slider>
            {carInfo.images.map((image, index) => (
              <Slide key={index} index={index}>
                <CarImage src={image} alt={`${currentCar.name} ${index + 1}`} />
              </Slide>
            ))}
          </Slider>
          <DotOverlay>
            <DotGroup
              showAsSelectedForCurrentSlideOnly={true}
              totalSlides={carInfo.images.length}
            />
          </DotOverlay>
        </CarouselProvider>
      </ImageCarousel>

      {/* 차량 정보 */}
      <CarInfoSection>
        <BrandName>{currentCar.brand.name}</BrandName>
        <CarName>{currentCar.name}</CarName>
        <CarInfoRow>
          <InfoColumn>
            <InfoLabel>출고일</InfoLabel>
            <InfoValue>{formatDate(carInfo.release_date)}</InfoValue>
          </InfoColumn>
          <InfoColumn>
            <InfoLabel>주행거리</InfoLabel>
            <InfoValue>{formatMileage(carInfo.mileage)}</InfoValue>
          </InfoColumn>
          <InfoColumn>
            <InfoLabel>출고가</InfoLabel>
            <InfoValue>{formatPrice(carInfo.retail_price)}원</InfoValue>
          </InfoColumn>
        </CarInfoRow>
      </CarInfoSection>

      {/* 가격 선택 */}
      <PriceSection>
        <PriceToggle>
          {availableOptions.map((option) => (
            <ToggleButton
              key={option}
              active={selectedOption === option}
              onClick={() => setSelectedOption(option)}
            >
              {option}개월
            </ToggleButton>
          ))}
        </PriceToggle>
        <PriceDisplay>
          <PriceAmount>
            {Math.floor((selectedPrice || 0) / 10000)}만원/월
          </PriceAmount>
          <PriceLabel>VAT 포함</PriceLabel>
        </PriceDisplay>
      </PriceSection>

      {/* 상세 이미지들 */}
      <DetailImages>
        <DetailImage src={MainBanner1} alt="상세 이미지 1" />
        <DetailImage src={MainBanner2} alt="상세 이미지 2" />
        <DetailImage src={MainBanner3} alt="상세 이미지 3" />
      </DetailImages>

      <ActionButtonContainer>
        {/* 이용약관 버튼 */}
        <ActionButton onClick={handleTerms}>
          <ButtonText>이용약관 확인하러 가기</ButtonText>
          <ButtonArrow>→</ButtonArrow>
        </ActionButton>

        {/* FAQ 버튼 */}
        <ActionButton onClick={handleFAQ}>
          <ButtonText>FAQ 확인하러 가기</ButtonText>
          <ButtonArrow>→</ButtonArrow>
        </ActionButton>
      </ActionButtonContainer>

      {/* 하단 네비게이션 */}
      <BottomNavigation>
        <KakaoButton onClick={handleKakaoTalk}>
          <KakaoIcon>💬</KakaoIcon>
        </KakaoButton>
        <SubscribeButton onClick={handleSubscribe}>
          구독 신청하기
        </SubscribeButton>
      </BottomNavigation>
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

const ImageCarousel = styled.div`
  width: 100%;
  height: 100vw;
  max-height: 400px;
  overflow: hidden;
  position: relative;
`;

const CarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DotOverlay = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  .carousel__dot {
    width: 8px !important;
    height: 8px !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.5) !important;
    border: none !important;
    margin: 0 4px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;

    &.carousel__dot--selected {
      background: #8cff20 !important;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.8) !important;
    }
  }
`;

const CarInfoSection = styled.div`
  padding: 24px 18px;
  background: #202020;
`;

const BrandName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #c7c4c4;
  margin-bottom: 6px;
`;

const CarName = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 24px;
`;

const CarInfoRow = styled.div`
  height: 38px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #c7c4c4;
  line-height: 1;
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
`;

const PriceSection = styled.div`
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
`;

const PriceToggle = styled.div`
  display: flex;
  gap: 8px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${(props) => (props.active ? "#8CFF20" : "#333")};
  border-radius: 20px;
  background: ${(props) => (props.active ? "#8CFF20" : "transparent")};
  color: ${(props) => (props.active ? "#000" : "#fff")};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PriceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const PriceAmount = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #8cff20;
`;

const PriceLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #8cff20;
`;

const DetailImages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const DetailImage = styled.img`
  width: 100%;
  height: auto;
`;

const ActionButton = styled.button`
  height: 60px;
  /* margin: 0 18px; */
  width: 100%;
  padding: 0 18px;

  border: none;
  border-radius: 12px;
  background: #202020;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #333;
  }
`;

const ButtonText = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const ButtonArrow = styled.span`
  font-size: 20px;
  font-weight: 700;
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
  gap: 12px;
  align-items: center;
  z-index: 1000;
  max-width: 480px;
  margin: 0 auto;
`;

const KakaoButton = styled.button`
  height: 60px;
  width: 60px;
  border: none;
  border-radius: 16px;
  background: #202020;
  color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: #333;
  }
`;

const KakaoIcon = styled.span`
  font-size: 24px;
`;

const SubscribeButton = styled.button`
  flex: 1;
  height: 60px;
  border: none;
  border-radius: 16px;
  background: #8cff20;
  color: #000;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #7aff1a;
  }
`;

const FAQSection = styled.div`
  padding: 40px 18px;
  background: #202020;
`;

const FAQTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 24px;
  text-align: center;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FAQItem = styled.div`
  padding: 20px;
  background: #000;
  border-radius: 12px;
  border: 1px solid #333;
`;

const FAQQuestion = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #8cff20;
  margin-bottom: 8px;
`;

const FAQAnswer = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #c7c4c4;
  line-height: 1.5;
`;

const ActionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 18px;
  padding-bottom: 36px;
`;

export default SubscribeCarDetailPage;

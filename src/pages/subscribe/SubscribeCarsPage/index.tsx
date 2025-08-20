import Header from "@/src/components/Header";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Footer from "@/src/components/Footer";

import MainBanner1 from "@/src/assets/main-banner-1.png";
import MainBanner2 from "@/src/assets/main-banner-2.png";
import MainBanner3 from "@/src/assets/main-banner-3.png";
import IcLexus from "@/src/assets/ic-lexus.png";
import IcToyota from "@/src/assets/ic-toyota.png";
import IcBenz from "@/src/assets/ic-benz.png";

import IcGene from "@/src/assets/ic-gene.png";
import IcFerarri from "@/src/assets/ic-ferarri.png";
import IcTesla from "@/src/assets/ic-tesla.png";
import IcHyundai from "@/src/assets/ic-hyundai.png";

import lx1 from "@/src/assets/lx-1.png";
import lx2 from "@/src/assets/lx-2.png";
import royal1 from "@/src/assets/royal-1.jpg";
import royal2 from "@/src/assets/royal-2.jpg";
import royal3 from "@/src/assets/royal-3.jpg";
import royal4 from "@/src/assets/royal-4.jpg";
import executive1 from "@/src/assets/executive-1.jpg";
import executive2 from "@/src/assets/executive-2.jpg";
import executive3 from "@/src/assets/executive-3.jpg";
import sprinter1 from "@/src/assets/sprinter-1.png";
import sprinter2 from "@/src/assets/sprinter-2.png";
import sprinter3 from "@/src/assets/sprinter-3.png";
import staria1 from "@/src/assets/staria-1.png";
import staria2 from "@/src/assets/staria-2.png";
import staria3 from "@/src/assets/staria-3.png";
import alphard1 from "@/src/assets/alphard-1.jpg";
import alphard2 from "@/src/assets/alphard-2.jpg";
import alphard3 from "@/src/assets/alphard-3.jpg";
import IcChevronDown from "@/src/assets/ic-chevron-down.svg";
import Gv90 from "@/src/assets/gv90.png";
import Purosan from "@/src/assets/purosan.png";
import Purosan1 from "@/src/assets/purosan-1.png";
import Purosan2 from "@/src/assets/purosan-2.png";
import Purosan3 from "@/src/assets/purosan-3.png";
import Cyber from "@/src/assets/cyber.png";

import { CarouselProvider, Dot, Slide, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

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

const SubscribeCarsPage = () => {
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionModel[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://alpha.vahana.kr/subscriptions/models"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSubscriptionData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching subscription data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

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

  // 브랜드 로고 매핑
  const getBrandLogo = (brandName: string) => {
    const brandLogos: { [key: string]: string } = {
      BMW: IcBenz, // 임시로 IcBenz 사용
      Ferrari: IcFerarri,
      Lamborghini: IcFerarri, // 임시로 IcFerarri 사용
      PORSCHE: IcBenz, // 임시로 IcBenz 사용
      Tesla: IcTesla,
      Toyota: IcToyota,
    };
    return brandLogos[brandName] || IcBenz;
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

  if (error) {
    return (
      <Container>
        <Header />
        <ErrorContainer>
          <ErrorText>데이터를 불러오는데 실패했습니다.</ErrorText>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          클릭 한번으로
          <br />
          슈퍼카를 구독하세요
        </Title>
        <Subtitle>실시간 구독 가능 차량</Subtitle>
      </TitleContainer>

      <CarContainer>
        <CarList>
          {subscriptionData.map((model, index) => {
            const carInfo = model.car[0]; // 첫 번째 차량 정보 사용

            return (
              <CarCard
                key={model.id}
                onClick={() => navigate(`/subscribe/cars/${model.id}`)}
              >
                <CardHeader>
                  <HeaderLeft>
                    <BrandName>{model.brand.name}</BrandName>
                    <CarName>{model.name}</CarName>
                  </HeaderLeft>
                  {carInfo.is_new && <NewTag>NEW</NewTag>}
                </CardHeader>

                <CardImageContainer>
                  <CardImage src={model.image} alt={model.name} />
                </CardImageContainer>

                <CardInfoRow>
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
                </CardInfoRow>

                <PriceSection>
                  {carInfo.subscription_fee_6 && (
                    <PriceText>
                      월 {Math.floor(carInfo.subscription_fee_6 / 10000)}만원
                      부터
                    </PriceText>
                  )}
                </PriceSection>
              </CarCard>
            );
          })}
        </CarList>
      </CarContainer>
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

const TitleContainer = styled.div`
  width: 100%;
  padding: 40px 20px 16px;
  /* text-align: center; */
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #999;
  font-weight: 500;
`;

const CarContainer = styled.div`
  padding: 0 18px 60px;
`;

const CarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CarCard = styled.div`
  height: 444px;
  width: 100%;
  padding: 24px 18px;
  border-radius: 16px;
  background: #202020;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2a2a2a;
  }
`;

const CardHeader = styled.div`
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const BrandName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #c7c4c4;
  line-height: 1;
`;

const CarName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
`;

const NewTag = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #8cff20;
  line-height: 1;
`;

const CardImageContainer = styled.div`
  height: 204px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 36px 0 24px 0;
`;

const CardImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const CardInfoRow = styled.div`
  height: 36px;
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
  height: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const PriceText = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #8cff20;
  line-height: 1;
`;

export default SubscribeCarsPage;

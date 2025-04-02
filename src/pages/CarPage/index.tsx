import Header from "@/src/components/Header";
import React, { useState } from "react";
import styled from "styled-components";
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
import Cyber from "@/src/assets/cyber.png";

import { CarouselProvider, Dot, Slide, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import CarComparisonTable from "./components/CarComparisonTable";

const CarPage = () => {
  // Set to store indices of expanded cards
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const mainData = [
    {
      img: [royal1, royal2, royal3, royal4],
      name: "LM 500h ROYAL",
      subName: "Hybrid ㆍ 4WD",
      label: "4 Seats",
      bg: "#3E4730",
      barndLogo: IcLexus,
      contents: [
        "ㆍ노이즈켄슬링",
        "ㆍ파티션 글라스",
        "ㆍ이중접합유리",
        "ㆍ리어 컴포트 모드",
        "ㆍ오디오 스피커 28개",
        "ㆍ냉장고",
        "ㆍ와이파이",
        'ㆍ48" 모니터',
        "ㆍ180º 리클라이닝",
        "ㆍ체온 추적 에어컨디셔닝",
        "ㆍ4륜",
        "ㆍ마크레빈슨 오디오",
      ],
    },
    {
      img: [executive1, executive2, executive3],
      name: "LM 500h EXECUTIVE",
      subName: "Hybrid ㆍ 4WD",
      label: "6 Seats",
      bg: "#76865F",
      barndLogo: IcLexus,
      contents: [
        "ㆍ이중접합유리",
        "ㆍ리어 컴포트 모드",
        "ㆍ오디오 스피커 23개",
        'ㆍ14" 모니터',
        "ㆍ165º 리클라이닝",
        "ㆍ4륜",
        "ㆍ마크레빈슨 오디오",
      ],
    },
    {
      img: [alphard1, alphard2, alphard3],
      name: "ALPHARD",
      subName: "Hybrid ㆍ 4WD",
      label: "7 Seats",
      bg: "#76865F",
      barndLogo: IcToyota,
      contents: [
        "ㆍ이중접합유리",
        "ㆍ오디오 스피커 14개",
        'ㆍ14" 모니터',
        "ㆍ160º 리클라이닝",
        "ㆍ파트타임 4륜",
        "ㆍJBL 오디오",
      ],
    },
    {
      img: [sprinter1, sprinter2, sprinter3],
      name: "SPRINTER TOURER",
      subName: "Diesel ㆍ RWD",
      label: "7 Seats",
      bg: "#76865F",
      barndLogo: IcBenz,
      contents: [
        "ㆍ컴포트 에어 서스펜션",
        "ㆍ어댑티브 제동",
        'ㆍ40" 격벽 TV',
        "ㆍ미니 냉장고",
        "ㆍ마사지 시트",
      ],
    },
    {
      img: [staria1, staria2, staria3],
      name: "STARIA",
      subName: "Hybrid ㆍ 4WD",
      label: "7 Seats",
      bg: "#76865F",
      barndLogo: IcHyundai,
      contents: [
        "ㆍ스타라이트",
        "ㆍ세라믹 플로어",
        'ㆍ24" 모니터',
        "ㆍ180º 회전 시트",
        "ㆍ무중력시트",
        "ㆍ마사지시트",
      ],
    },
  ];

  const comeingData = [
    {
      img: [Gv90],
      name: "GV90",
      subName: "Full Electric ㆍ AWD",
      label: "4 Seats",
      bg: "#76865F",
      contents: [
        "ㆍ노이즈켄슬링",
        "ㆍ파티션 글라스",
        "ㆍ이중접합유리",
        "ㆍ리어 컴포트 모드",
        "ㆍ오디오 스피커 28개",
        "ㆍ냉장고",
        "ㆍ와이파이",
        'ㆍ48" 모니터',
        "ㆍ180º 리클라이닝",
        "ㆍ체온 추적 에어컨디셔닝",
        "ㆍ4륜",
        "ㆍ마크레빈슨 오디오",
      ],
    },
    {
      img: [Purosan],
      name: "PUROSANGUE",
      subName: "6.5L NA-V12ㆍ 4WD",
      label: "4 Seats",
      bg: "#76865F",
      contents: [
        "ㆍ이중접합유리",
        "ㆍ리어 컴포트 모드",
        "ㆍ오디오 스피커 23개",
        'ㆍ14" 모니터',
        "ㆍ165º 리클라이닝",
        "ㆍ4륜",
        "ㆍ마크레빈슨 오디오",
      ],
    },
    {
      img: [Cyber],
      name: "CYBER TRUCK",
      subName: "Full Electricㆍ 4WD",
      label: "4 Seats",
      bg: "#76865F",
      contents: [
        "ㆍ이중접합유리",
        "ㆍ오디오 스피커 14개",
        'ㆍ14" 모니터',
        "ㆍ160º 리클라이닝",
        "ㆍ파트타임 4륜",
        "ㆍJBL 오디오",
      ],
    },
  ];

  const toggleExpand = (index) => {
    const isCurrentlyExpanded = expandedCards.has(index);
    if (isCurrentlyExpanded) {
      const newExpandedCards = new Set(expandedCards);
      newExpandedCards.delete(index);
      setExpandedCards(newExpandedCards);
      setIsAllExpanded(false);
    } else {
      setExpandedCards(new Set([...expandedCards, index]));
      setIsAllExpanded(expandedCards.size + 1 === mainData.length);
    }
  };

  const toggleAll = () => {
    if (isAllExpanded) {
      setExpandedCards(new Set());
    } else {
      setExpandedCards(new Set(mainData.map((_, index) => index)));
    }
    setIsAllExpanded(!isAllExpanded);
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          VEHICLE
          <br />
          TABLE
        </Title>
        차량 설명
      </TitleContainer>
      <CarContainer>
        {/* <CarSectionTitle>LEXUS LM 500H</CarSectionTitle> */}
        <CarSection>
          {mainData.map((data, index) => (
            <CarBlock key={index}>
              <CarouselContainer>
                <StyledCarouselProvider
                  naturalSlideWidth={100}
                  naturalSlideHeight={76}
                  totalSlides={data.img?.length}
                  infinite={true}
                  isPlaying={true}
                  interval={10000}
                  playDirection="forward"
                  isIntrinsicHeight={true}
                >
                  <StyledSlider>
                    {data.img?.map((img, i) => (
                      <Slide index={i} key={i}>
                        <ImgContainer>
                          <img src={img} alt="car" />
                        </ImgContainer>
                      </Slide>
                    ))}
                  </StyledSlider>
                  <ButtonWrapper>
                    {[...Array(data.img?.length).keys()].map((v, i) => (
                      <Dot slide={i} className="carouselDot2" key={i} />
                    ))}
                  </ButtonWrapper>
                </StyledCarouselProvider>
              </CarouselContainer>
              <ContentsBlock>
                <BrandWrapper>
                  <BrandIcon>
                    <img src={data.barndLogo} alt="lexus" />
                  </BrandIcon>
                  <BrandTitleWrapper>
                    <BrandTitle>{data.name}</BrandTitle>
                    {data.subName}
                  </BrandTitleWrapper>
                </BrandWrapper>
                <SeatButton bg={data.bg}>{data.label}</SeatButton>

                <ContentsList isExpanded={expandedCards.has(index)}>
                  {data.contents.map((content, i) => (
                    <ContentItem key={i}>{content}</ContentItem>
                  ))}
                </ContentsList>

                <ExpandButton onClick={() => toggleExpand(index)}>
                  {expandedCards.has(index) ? (
                    <img src={IcChevronDown} />
                  ) : (
                    <img
                      src={IcChevronDown}
                      style={{ transform: "rotate(180deg)" }}
                    />
                  )}
                </ExpandButton>
              </ContentsBlock>
            </CarBlock>
          ))}
          {comeingData.map((data, index) => (
            <CarBlock key={index}>
              {data.img?.map((img, i) => (
                <ImgContainer>
                  <img src={img} alt="car" />
                </ImgContainer>
              ))}

              <ContentsBlock>
                <BrandWrapper>
                  <BrandIcon>
                    {data.name === "GV90" && <img src={IcGene} alt="Genesis" />}

                    {data.name === "PUROSANGUE" && (
                      <img src={IcFerarri} alt="Ferarri" />
                    )}
                    {data.name === "CYBER TRUCK" && (
                      <img src={IcTesla} alt="Tesla" />
                    )}
                  </BrandIcon>
                  <BrandTitleWrapper>
                    <BrandTitle>{data.name}</BrandTitle>
                    {data.subName}
                  </BrandTitleWrapper>
                </BrandWrapper>
                <SeatButton bg={data.bg}>{data.label}</SeatButton>
              </ContentsBlock>
            </CarBlock>
          ))}
        </CarSection>
      </CarContainer>
      <TableContainer>
        <TableTitle>모델별 비교</TableTitle>
        <CarComparisonTable />
      </TableContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;

  background: #fff;
  position: relative;
  padding-top: 56px;
  padding-bottom: 261px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 46px 16px 82px;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
`;

const CarContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px 150px 16px;
`;

const CarSectionTitle = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 700;
  padding: 12px;
`;

const CarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 54px;
`;

const CarBlock = styled.div`
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CarouselContainer = styled.div`
  position: relative;
  background: #fff;
`;

const StyledCarouselProvider = styled(CarouselProvider)`
  width: 100%;
  height: 100%;
`;

const StyledSlider = styled(Slider)`
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  height: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 14px;
  min-height: 14px;
  gap: 4px;
  position: absolute;
  top: 240px;
  justify-content: center;
  /* left: 50%;
  transform: translate(0, -50%); */
  z-index: 100;
`;

const ImgContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 260px;
  /* filter: brightness(0.5); */
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContentsBlock = styled.div`
  padding: 16px 16px 28px 16px;
`;

const BrandWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 52px;
  background: #fff;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  & > img {
    width: 40px;
  }
`;

const BrandTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

const BrandTitle = styled.div`
  color: #000;
  font-size: 16px;
  font-weight: 700;
`;

const SeatButton = styled.div<{ bg: string }>`
  width: fit-content;
  padding: 6px 16px;
  border-radius: 10px;
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  background: ${(p) => p.bg};
  margin-top: 16px;
`;

const ExpandButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  margin-top: 8px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  position: absolute;
  right: 16px;
  bottom: 28px;
`;

const ContentsList = styled.div<{ isExpanded?: boolean }>`
  max-height: ${(props) => (props.isExpanded ? "100%" : "0")};
  overflow: hidden;
  /* transition: max-height 0.3s ease-in-out; */
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: ${(props) => (props.isExpanded ? "16px" : "0")};
  margin-bottom: ${(props) => (props.isExpanded ? "42px" : "0")};
`;

const ContentItem = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 152px;
  padding: 16px 0;
`;

const TableTitle = styled.div`
  padding-left: 24px;
  color: #666;
  font-size: 14px;
  font-weight: 700;
`;

export default CarPage;

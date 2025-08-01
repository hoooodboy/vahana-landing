import styled from "styled-components";

import MainBanner1 from "@/src/assets/main-banner-1.png";

import VideoThumbImg from "@/src/assets/video-thumb.png";

import CompanyImg from "@/src/assets/img-company-3.png";
import Customer1Img from "@/src/assets/img-customer-1.png";
import Customer2Img from "@/src/assets/img-customer-2.png";
import Customer3Img from "@/src/assets/img-customer-3.png";
import Customer4Img from "@/src/assets/img-customer-4.png";
import Customer5Img from "@/src/assets/img-customer-5.png";
import LmImg from "@/src/assets/img-lm500h.png";
import CalendarImg from "@/src/assets/calendar-sample.png";

import ServiceImg from "@/src/assets/img-service.png";
import Hc1Img from "@/src/assets/main-hc-1.png";
import Hc2Img from "@/src/assets/main-hc-2.png";

import { CarouselProvider, Dot, Slide, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import "./styles/style.css";

import Header from "@/src/components/Header";
// import DayBanner from "@/src/components/DayBanner";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link } from "react-router-dom";
import LocalStorage from "@/src/local-storage";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [showMainPop, setShowMainPop] = useState(false);
  const HOME_VISITED = LocalStorage.get("homeVisited") as any;

  const mainData = [
    {
      img: MainBanner1,
      title: "당신만을 위한 품격 있는\n이동 서비스.",
      contents:
        "고급스러움, 역동성, 맞춤형.\n바하나는 도로 위의 시간을 특별한 순간으로 만듭니다.",
    },
    // {
    //   img: MainBanner2,
    //   title: "222222222",
    //   contents: "2g2g2g2g2gg2g2g2g2g2gg2g2g2g2",
    // },
    // {
    //   img: MainBanner3,
    //   title: "3333333",
    //   contents: "3koi03opjnmkjnoklmasd",
    // },
    // {
    //   img: MainBanner4,
    //   title: "44444",
    //   contents: "asdasdasd",
    // },
  ];

  const AmbassadorData = [
    {
      img: Hc1Img,
      author: "황희찬",
      contents:
        "차량 관리, 차량 감가 외 관리비, 채용 등의 복잡함 없이 어릴 때부터 꿈꿔왔던 차를 운전하며 이동의 즐거움을 느끼고 있습니다. VAHAN의 서비스는 제게 새로운 동기부여를 제공해 줍니다.",
    },
    {
      img: Hc2Img,
      author: "황희찬",
      contents:
        "인터뷰라서 하는 말이 아니라, 가족들이 의전 서비스를 정말 많이 만족하고 있고 저도 그런 모습을 보면서 안정감을 느껴요.",
    },
  ];

  const CustomerData = [
    {
      img: Customer1Img,
      author: "배우 홍수아",
    },
    {
      img: Customer2Img,
      author: "스포츠스타 김영광, 김태균",
    },
    {
      img: Customer3Img,
      author: "스포츠스타 티에리 앙리",
    },
    {
      img: Customer4Img,
      author: "스포츠스타 호나우두",
    },
    {
      img: Customer5Img,
      author: "정치인 트럼프 주니어",
    },
  ];

  useEffect(() => {
    const today = new Date();
    const handleMainPop = () => {
      if (HOME_VISITED && HOME_VISITED > today) {
        // 현재 date가 localStorage의 시간보다 크면 return
        return;
      }
      if (!HOME_VISITED || HOME_VISITED < today) {
        // 저장된 date가 없거나 today보다 작다면 popup 노출
        setShowMainPop(true);
      }
    };
    window.setTimeout(handleMainPop, 1000); // 1초 뒤 실행
  }, [HOME_VISITED]);

  return (
    <Container>
      <Header />
      <Section>
        <CarouselContainer>
          <StyledCarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={76}
            totalSlides={mainData?.length}
            infinite={true}
            isPlaying={true}
            interval={10000}
            playDirection="forward"
            isIntrinsicHeight={true}
          >
            <StyledSlider>
              {mainData?.map((data, i) => (
                <Slide index={i} key={i}>
                  <ImgContainer>
                    <img src={data.img} />
                  </ImgContainer>
                  <MainTitleContainer>
                    <SlideTitle>{data.title}</SlideTitle>
                    {data.contents}
                  </MainTitleContainer>
                </Slide>
              ))}
            </StyledSlider>
            <ButtonWrapper>
              {[...Array(mainData?.length).keys()].map((v: any, i: number) => (
                <Dot slide={i} className="carouselDot2" key={i} />
              ))}
            </ButtonWrapper>
          </StyledCarouselProvider>
        </CarouselContainer>

        {/* <BackgroundImg src={MainBanner1} /> */}
      </Section>
      <SecondSection>
        <SecondTitleContainer>
          반복되는 되고 지루한 이동시간
          <SecondContents>
            고급스러움, 역동성, 맞춤형.
            <br />
            바하나는 도로 위의 시간을
            <br />
            특별한 순간으로 만듭니다.
          </SecondContents>
        </SecondTitleContainer>
      </SecondSection>
      <ThirdSection>
        <TitleConteiner>
          <Title>
            최상의 편안함과
            <br />
            완벽한 이동의 품격
          </Title>
          고객 맞춤형 최첨단 기술과 프리미엄 서비스로 당신의 이동을 특별하게
          만듭니다.
        </TitleConteiner>
        <MainImg>
          <img src={LmImg} />
        </MainImg>
        <Button to="/cars">전체 차량 보기</Button>
      </ThirdSection>
      <ThirdSection>
        <TitleConteiner>
          <Title>
            오직 나만을 위한 순간,
            <br />
            이제 캘린더로 예약하세요.
          </Title>
          전문성 있는 수행 드라이버와 최고급 의전 차량을 제공합니다.
        </TitleConteiner>
        <MainImg2>
          <img src={CalendarImg} />
        </MainImg2>
        <Button to="/calendar">예약하러 가기</Button>
      </ThirdSection>

      <FourthSection>
        <TitleConteiner padding={"0px 16px"}>
          <Title>
            국가대표 축구선수
            <br />
            황희찬
          </Title>
          VAHANA Ambassador
        </TitleConteiner>
        <StyledScrollContainer>
          <FilterWrapper>
            {AmbassadorData?.map((data, i) => (
              <AmbassadorCard key={i}>
                <AmbassadorImg>
                  <img src={data.img} />
                </AmbassadorImg>
                <CardContents>
                  {data.contents}
                  <Author>-{data.author}-</Author>
                </CardContents>
              </AmbassadorCard>
            ))}
          </FilterWrapper>
        </StyledScrollContainer>

        <VideoContainer>
          <VideoBlock>
            <VideoIframe
              src="https://www.youtube.com/embed/7mRPzrI79AA"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoBlock>
        </VideoContainer>
      </FourthSection>

      <FourthSection>
        <TitleConteiner padding={"0px 16px"}>
          <Title>
            바하나와 함께한
            <br />
            VVIP
          </Title>
          VAHANA Customer
        </TitleConteiner>
        <StyledScrollContainer>
          <FilterWrapper>
            {CustomerData?.map((data, i) => (
              <AmbassadorCard2 key={i}>
                <AmbassadorImg2>
                  <img src={data.img} />
                </AmbassadorImg2>

                <Author2>{data.author}</Author2>
              </AmbassadorCard2>
            ))}
          </FilterWrapper>
        </StyledScrollContainer>
      </FourthSection>

      <ThirdSection>
        <TitleConteiner>
          <Title>
            최고 기업들의
            <br />
            후회없는 선택
          </Title>
          유수의 기업들이 바하나의 <br />
          최고급 서비스와 함께하고 있습니다.
        </TitleConteiner>
        <Company>
          <img src={CompanyImg} />
        </Company>
      </ThirdSection>

      <FifthSection>
        <TitleConteiner>
          <Title>
            바하나를
            <br />
            이용하고 싶다면
          </Title>
          아래 버튼들로 자세히 확인해보세요
        </TitleConteiner>
        <MenuContainer>
          <MenuBlock>
            <MenuTitle>서비스 예약</MenuTitle>
            <MenuContents>
              차량 등급별 가격 안내 <br />
              이용 시간 및 거리에 따른
              <br />
              요금을 간편하게 확인하세요.
            </MenuContents>
            <Button to="/calendar">예약하기</Button>
          </MenuBlock>
          <MenuBlock>
            <MenuTitle>가격표 안내</MenuTitle>
            <MenuContents>
              원하시는 일정으로 <br />
              간편하게 예약하고
              <br />
              편안한 이동을 약속드립니다.
            </MenuContents>
            <Button to="/pricing">바로가기</Button>
          </MenuBlock>
        </MenuContainer>
      </FifthSection>

      {/* {showMainPop && <DayBanner setShowMainPop={setShowMainPop} />} */}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fffbf1;
  position: relative;
  padding-bottom: 317px;
`;

const Section = styled.section`
  box-sizing: border-box;
  display: flex;
`;

const Logo = styled.img`
  width: 128px;
  height: 20px;
`;

const Burger = styled.img`
  width: 24px;
  height: 24px;
`;

const BackgroundImg = styled.img`
  width: 100%;
  height: 100%;
  background-size: contain;
  filter: brightness(0.5);
`;

const MainImg = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;

  & > img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const MainImg2 = styled(MainImg)`
  border-radius: 32px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
`;

const Text = styled.div``;

const CarouselContainer = styled.div`
  position: relative;
  background: #000;
`;

const StyledCarouselProvider = styled(CarouselProvider)`
  width: 100%;
`;

const StyledSlider = styled(Slider)`
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  height: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  /* width: 100%; */
  height: 14px;
  min-height: 14px;
  gap: 4px;
  position: absolute;
  bottom: 30px;
  left: 16px;
  z-index: 100;
`;

const ImgContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  filter: brightness(0.5);
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MainTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  color: #fff;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  left: 16px;
  bottom: 68px;
  z-index: 1;

  white-space: pre-wrap;
`;

const SlideTitle = styled.div`
  color: #fbfbfb;
  font-size: 32px;
  font-weight: 700;
`;

const SecondTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  color: #666;
  font-size: 14px;
  font-weight: 700;
`;

const SecondContents = styled.div`
  color: #000;
  font-size: 20px;
  font-weight: 600;
`;

const SecondSection = styled.div`
  width: 100%;
  padding: 82px 16px 162px;
  box-sizing: border-box;
`;

const ThirdSection = styled.div`
  padding: 16px;
  padding-bottom: 132px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 20px;
`;

const TitleConteiner = styled.div<{ padding?: string }>`
  padding: ${(p) => p.padding};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  color: #666;
  font-size: 14px;
  font-weight: 600;
  word-break: keep-all;
`;

const Title = styled.div`
  color: #000;
  font-size: 32px;
  font-weight: 800;
  & > b {
    color: #76865f;
    font-weight: 800;
  }
`;

const Button = styled(Link)`
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 32px;
  border-radius: 100px;

  background: #3e4730;

  color: #fff;
  font-size: 16px;
  font-weight: 400;
  align-self: flex-start;
  text-decoration: none;
  margin-top: 24px;
`;

const FourthSection = styled.section`
  display: flex;
  flex-direction: column;
  /* gap: 42px; */
  padding: 16px 0 132px;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 16px;
  padding: 42px 0;
`;

const AmbassadorCard = styled.div`
  width: 284px;
  min-width: 284px;
  max-width: 284px;
  border-radius: 16px;

  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
`;

const AmbassadorCard2 = styled(AmbassadorCard)`
  background: transparent;
  box-shadow: none;
`;

const AmbassadorImg = styled.div`
  width: 100%;
  height: 220px;
  min-height: 220px;
  overflow: hidden;

  & > img {
    width: 100%;
    background-position: 50% 50%;
  }
`;

const AmbassadorImg2 = styled.div`
  width: 100%;
  padding-top: 130%;
  position: relative;
  /* min-height: 220px; */
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
  & > img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
  }
`;

const CardContents = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  justify-content: space-between;
  color: #000;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  word-break: keep-all;
`;

const Author = styled.div`
  font-size: 12px;
  font-weight: 200;
  line-height: 20px;
`;

const Author2 = styled(Author)`
  text-align: right;
  padding: 12px;
`;

const Company = styled.div`
  width: 100%;
  margin-top: 22px;
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25));
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
  & > img {
    width: 100%;
  }
`;

const VideoContainer = styled.div`
  padding: 0 16px;
`;

const VideoBlock = styled.div`
  width: 100%;
  padding-top: 56.25%;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
`;

const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;
const VideoThumb = styled.img`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const FifthSection = styled.div`
  padding: 16px;
  padding-bottom: 152px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 42px;
`;

const MenuContainer = styled.div`
  width: 100%;
  display: flex;
  /* flex-direction: column; */
  /* gap: 42px; */
`;

const MenuBlock = styled.div`
  width: 100%;
`;

const MenuTitle = styled.div`
  color: #000;
  font-size: 20px;
  font-weight: 800;
`;

const MenuContents = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 500;
  margin: 12px 0 20px 0;
`;

const StyledScrollContainer = styled(ScrollContainer)`
  padding: 0 16px;
`;

export default HomePage;

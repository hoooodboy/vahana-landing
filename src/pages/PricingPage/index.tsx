import React, { useState } from "react";
import Header from "@/src/components/Header";
import styled from "styled-components";
import Footer from "@/src/components/Footer";

import ScrollContainer from "react-indiana-drag-scroll";

const PricingPage = () => {
  const mainData = [
    {
      title: "1\nTICKET",
      price: 1000000,
      priceForOne: 1000000,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      contents: [
        "ㆍ평균 2025년식",
        "ㆍ3,000km 미만 신차",
        "ㆍ파티션 글라스(차음)",
        "ㆍ1등석 시트",
        "ㆍ릴렉세이션 마사지",
        "ㆍ노이즈 캔슬링 모드",
      ],
    },
    {
      title: "1\nTICKET",
      price: 1000000,
      priceForOne: 1000000,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      contents: [
        "ㆍ평균 2025년식",
        "ㆍ3,000km 미만 신차",
        "ㆍ파티션 글라스(차음)",
        "ㆍ1등석 시트",
        "ㆍ릴렉세이션 마사지",
        "ㆍ노이즈 캔슬링 모드",
      ],
    },
    {
      title: "1\nTICKET",
      price: 1000000,
      priceForOne: 1000000,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      contents: [
        "ㆍ평균 2025년식",
        "ㆍ3,000km 미만 신차",
        "ㆍ파티션 글라스(차음)",
        "ㆍ1등석 시트",
        "ㆍ릴렉세이션 마사지",
        "ㆍ노이즈 캔슬링 모드",
      ],
    },
  ];

  const mainData2 = [
    {
      title: "100\nTICKET",
      price: 1000000,
      priceForOne: 1000000,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      contents: [
        "ㆍ평균 2025년식",
        "ㆍ3,000km 미만 신차",
        "ㆍ파티션 글라스(차음)",
        "ㆍ1등석 시트",
        "ㆍ릴렉세이션 마사지",
        "ㆍ노이즈 캔슬링 모드",
      ],
    },
    {
      title: "200\nTICKET",
      price: 1000000,
      priceForOne: 1000000,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      contents: [
        "ㆍ평균 2025년식",
        "ㆍ3,000km 미만 신차",
        "ㆍ파티션 글라스(차음)",
        "ㆍ1등석 시트",
        "ㆍ릴렉세이션 마사지",
        "ㆍ노이즈 캔슬링 모드",
      ],
    },
    {
      title: "300\nTICKET",
      price: 1000000,
      priceForOne: 1000000,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      contents: [
        "ㆍ평균 2025년식",
        "ㆍ3,000km 미만 신차",
        "ㆍ파티션 글라스(차음)",
        "ㆍ1등석 시트",
        "ㆍ릴렉세이션 마사지",
        "ㆍ노이즈 캔슬링 모드",
      ],
    },
  ];

  const TableData = [
    ["차트", "1 TICKET", "3 TICKET", "5 TICKET"],
    [],
    [],
    [],
    [],
  ];

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          PRICING
          <br />
          TABLE
        </Title>
        요금표
      </TitleContainer>
      <PriceContainer>
        <HorizontalContainer>
          <SectionTitle>PREMIUM</SectionTitle>
          <ScrollContainer>
            <CarSection>
              {mainData.map((data, index) => (
                <ContentsContainer>
                  <TicketAmount>{data.title}</TicketAmount>
                  <PriceDetailWrapper>
                    <Price>{data.price.toLocaleString()}₩</Price>1티켓당{" "}
                    {data.priceForOne.toLocaleString()}₩
                  </PriceDetailWrapper>
                  <LabelWrapper>
                    {data.labels.map((label) => (
                      <Label bg={label.bg}>{label.title}</Label>
                    ))}
                  </LabelWrapper>
                  <ContentWrapper>
                    {data.contents.map((content) => (
                      <Content>{content}</Content>
                    ))}
                  </ContentWrapper>
                </ContentsContainer>
              ))}
            </CarSection>
          </ScrollContainer>
        </HorizontalContainer>
        <HorizontalContainer>
          <SectionTitle>MORE SERVICE</SectionTitle>
          <ScrollContainer>
            <CarSection>
              {mainData2.map((data, index) => (
                <ContentsContainer>
                  <TicketAmount>{data.title}</TicketAmount>
                  <PriceDetailWrapper>
                    <Price>{data.price.toLocaleString()}₩</Price>1티켓당{" "}
                    {data.priceForOne.toLocaleString()}₩
                  </PriceDetailWrapper>
                  <LabelWrapper>
                    {data.labels.map((label) => (
                      <Label bg={label.bg}>{label.title}</Label>
                    ))}
                  </LabelWrapper>
                  <ContentWrapper>
                    {data.contents.map((content) => (
                      <Content>{content}</Content>
                    ))}
                  </ContentWrapper>
                </ContentsContainer>
              ))}
            </CarSection>
          </ScrollContainer>
        </HorizontalContainer>
        {/* <HorizontalContainer>
            <SectionTitle>
              플랜 비교
            </SectionTitle>
            <Table>

            </Table>
        </HorizontalContainer> */}
      </PriceContainer>
      <ReservationButton>예약하기</ReservationButton>
      <NoticeWrapper>
        <Notice>65세이상 실버 고객 인증시 50% 할인 혜택을 제공합니다.</Notice>
        <Notice>
          학생, 임산부 (2주차 ~ 38주차), 65세 이상, 장애인 확인시 50% 할인
          혜택을 제공합니다.
        </Notice>
        <Notice>짧은 기록은 본사의 방침에 따라 0.5로 계산됩니다.</Notice>
        <Notice>기사가 없을때 본사의 방침에 따라 0.5로 계산됩니다.</Notice>
      </NoticeWrapper>
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;

  background: #fff;
  position: relative;
  padding-top: 56px;
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

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 700;
  padding: 12px 12px 0 24px;
  padding-bottom: 0;
`;

const CarSection = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px 16px;
`;

const ContentsContainer = styled.div`
  min-width: 290px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 64px 24px 54px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.1);
`;

const TicketAmount = styled.div`
  color: #000;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  white-space: pre-wrap;
`;

const PriceDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
`;

const Price = styled.div`
  color: #000;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Content = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const Label = styled.div<{ bg: string }>`
  padding: 6px 16px;
  border-radius: 24px;
  background: ${(p) => p.bg};
  color: #fff;
  font-size: 10px;
  font-weight: 500;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 82px;
`;

const ReservationButton = styled.div`
  width: 152px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: #3e4730;
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  margin: 16px 24px;
`;

const NoticeWrapper = styled.ul`
  padding: 16px 16px 150px 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Notice = styled.li`
  color: #666;
  font-size: 14px;
  font-weight: 500;
  word-break: keep-all;
`;

export default PricingPage;

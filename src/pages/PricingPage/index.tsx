import React, { useState, useEffect } from "react";
import Header from "@/src/components/Header";
import styled from "styled-components";

import TicketPremium from "@/src/assets/ic-ticket-premium.png";
import TicketMore from "@/src/assets/ic-ticket-more.png";

import CardImg1 from "@/src/assets/price-card-1.png";
import CardImg2 from "@/src/assets/price-card-2.png";
import CardImg3 from "@/src/assets/price-card-3.png";
import CardImg4 from "@/src/assets/price-card-4.png";
import CardImg5 from "@/src/assets/price-card-5.png";
import CardImg6 from "@/src/assets/price-card-6.png";

import ScrollContainer from "react-indiana-drag-scroll";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PricingPage = () => {
  // 현재 날짜부터 한 달간의 이용 가능 기간 계산
  const getMonthlyPeriod = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    };

    return {
      startDate: formatDate(today),
      endDate: formatDate(nextMonth),
    };
  };

  const monthlyPeriod = getMonthlyPeriod();

  // 토스페이먼츠 SDK 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v2/payment";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://js.tosspayments.com/v2/payment"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // 빌링 결과 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const billingResult = urlParams.get("billing");

    if (billingResult === "success") {
      const authKey = urlParams.get("authKey");
      const customerKey = urlParams.get("customerKey");

      if (authKey && customerKey) {
        toast.success("카드 등록이 완료되었습니다! 정기결제가 설정되었습니다.");
        // URL에서 쿼리 파라미터 제거
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    } else if (billingResult === "fail") {
      const errorCode = urlParams.get("errorCode");
      const errorMessage = urlParams.get("errorMessage");

      toast.error(
        `카드 등록에 실패했습니다: ${errorMessage || "알 수 없는 오류"}`
      );
      // URL에서 쿼리 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const mainData = [
    {
      title: "1 TICKET",
      amount: 1,
      price: 1000000,
      priceForOne: 1000000,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      icon: CardImg1,
    },
    {
      title: "6 TICKET",
      amount: 6,
      price: 5000000,
      priceForOne: 833333,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      icon: CardImg2,
    },
    {
      title: "42 TICKET",
      amount: 42,
      price: 30000000,
      priceForOne: 714286,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      icon: CardImg3,
    },
    {
      title: "150 TICKET",
      amount: 150,
      price: 100000000,
      priceForOne: 666667,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      icon: CardImg4,
    },
  ];

  const mainData2 = [
    {
      title: "BLACK",
      amount: 365,
      price: 300000000,
      priceForOne: 821918,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      icon: CardImg5,
    },
    {
      title: "VAHANA",
      amount: 365,
      price: 500000000,
      priceForOne: 1369863,
      labels: [{ title: "학생할인 적용", bg: "#3E4730" }],
      icon: CardImg6,
    },
  ];

  const tableData = [
    {
      title: "전담 드라이버 배정",
      premium: false,
      more: true,
    },
    {
      title: "차량 및 차종",
      premium: "랜덤",
      more: "전용 차량 이용",
    },
    {
      title: "복수차량(2대 이상) 배차",
      premium: false,
      more: true,
    },
    {
      title: "타인 이용(제 3자이용)",
      premium: "직계가족",
      more: "이용자 지정 가능",
    },
    {
      title: "드라이버 스탠바이",
      premium: "최대2박",
      more: "무제한",
    },
    {
      title: "세크러터리(비서) 컨시어지",
      premium: false,
      more: true,
    },
  ];

  const renderValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? "O" : "X";
      // return value ? <CheckIcon>✓</CheckIcon> : <XIcon>×</XIcon>;
    }
    return value;
  };

  const handleKakaoTalk = () => {
    // 카카오톡 앱으로 연결 (모바일) 또는 웹으로 연결 (데스크톱)
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // 모바일에서는 카카오톡 앱으로 연결
      window.location.href = "kakaotalk://";
    } else {
      // 데스크톱에서는 카카오톡 채널 URL로 이동
      window.open("https://open.kakao.com/o/your-channel-id", "_blank");
    }
  };

  const handleTossBilling = async () => {
    try {
      // 토스페이먼츠 SDK가 로드되었는지 확인
      if (typeof window.TossPayments === "undefined") {
        console.error("토스페이먼츠 SDK가 로드되지 않았습니다.");
        return;
      }

      const tossPayments = window.TossPayments(
        "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq"
      );

      // 자동결제(빌링) 카드 등록창 띄우기
      await tossPayments.payment.requestBillingAuth({
        method: "CARD",
        customerName: "바하나 이용자",
        customerEmail: "user@example.com",
        successUrl: `${window.location.origin}/pricing?billing=success`,
        failUrl: `${window.location.origin}/pricing?billing=fail`,
        windowTarget: "self",
      });
    } catch (error) {
      console.error("토스페이먼츠 빌링 요청 실패:", error);
      toast.error("결제창을 열 수 없습니다. 잠시 후 다시 시도해주세요.");
    }
  };

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
          <StyledScrollContainer>
            <CarSection>
              {mainData.map((data, index) => (
                <ContentsContainer>
                  <Card src={data.icon} />
                  {/* <TicketIconBlock>
                    <TicketLabel>{data.amount}</TicketLabel>
                    <TicketIcon src={data.icon} />
                  </TicketIconBlock>
                  <TicketAmount>{data.title}</TicketAmount>
                  <PriceDetailWrapper>
                    <Price>{data.price.toLocaleString()}₩</Price>1티켓당{" "}
                    {data.priceForOne.toLocaleString()}₩
                  </PriceDetailWrapper> */}
                  {/* <LabelWrapper>
                    {data.labels.map((label) => (
                      <Label bg={label.bg}>{label.title}</Label>
                    ))}
                  </LabelWrapper> */}
                </ContentsContainer>
              ))}
            </CarSection>
          </StyledScrollContainer>
        </HorizontalContainer>
        <HorizontalContainer>
          <SectionTitle>MORE SERVICE</SectionTitle>
          <StyledScrollContainer>
            <CarSection>
              {mainData2.map((data, index) => (
                <ContentsContainer>
                  <Card src={data.icon} />
                  {/* <TicketIconBlock>
                    <TicketLabel>{data.amount}</TicketLabel>
                    <TicketIcon src={data.icon} />
                  </TicketIconBlock>
                  <TicketAmount>{data.title}</TicketAmount>
                  <PriceDetailWrapper>
                    <Price>{data.price.toLocaleString()}₩</Price>1티켓당{" "}
                    {data.priceForOne.toLocaleString()}₩
                  </PriceDetailWrapper> */}
                  {/* <LabelWrapper>
                    {data.labels.map((label) => (
                      <Label bg={label.bg}>{label.title}</Label>
                    ))}
                  </LabelWrapper> */}
                </ContentsContainer>
              ))}
            </CarSection>
          </StyledScrollContainer>
        </HorizontalContainer>

        {/* 월 1000만원 이용 안내 섹션 */}
        <HorizontalContainer>
          <SectionTitle>MONTHLY PLAN</SectionTitle>
          <StyledScrollContainer>
            <CarSection>
              <MonthlyPlanCard>
                <MonthlyPlanLeft>
                  {/* <MonthlyPlanIcon>🚗</MonthlyPlanIcon> */}
                  <MonthlyPlanContent>
                    <MonthlyPlanTitle>월 1,000만원 으로</MonthlyPlanTitle>
                    <MonthlyPlanSubtitle>
                      자유롭게 이용해보세요
                    </MonthlyPlanSubtitle>
                    <MonthlyPlanDescription>
                      프리미엄 차량을 월 정액으로 이용할 수 있는 특별한 혜택
                    </MonthlyPlanDescription>
                    <MonthlyPlanPeriod>
                      {monthlyPeriod.startDate} ~ {monthlyPeriod.endDate}까지
                      이용가능
                    </MonthlyPlanPeriod>
                  </MonthlyPlanContent>
                </MonthlyPlanLeft>
              </MonthlyPlanCard>
            </CarSection>
            <MonthlyPlanRight>
              <KakaoTalkButton onClick={handleTossBilling}>
                정기결제 신청
              </KakaoTalkButton>
            </MonthlyPlanRight>
          </StyledScrollContainer>
        </HorizontalContainer>
        {/* <HorizontalContainer>
            <SectionTitle>
              플랜 비교
            </SectionTitle>
            <Table>

            </Table>
        </HorizontalContainer> */}
      </PriceContainer>

      <TableContainer>
        <TableTitle>플랜 비교</TableTitle>
        <Table>
          <thead>
            <tr>
              <Th></Th>
              <Th>Premium</Th>
              <Th>More Service</Th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <Td>{row.title}</Td>
                <Td>{renderValue(row.premium)}</Td>
                <Td>{renderValue(row.more)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
      <ReservationButton
        onClick={() => window.open("http://pf.kakao.com/_yxcxhVn")}
      >
        구매 문의
      </ReservationButton>
      <NoticeWrapper>
        <Notice>65세이상 실버 고객 인증시 50% 할인 혜택을 제공합니다.</Notice>
        <Notice>
          학생, 임산부 (2주차 ~ 38주차), 65세 이상, 장애인 확인시 50% 할인
          혜택을 제공합니다.
        </Notice>
        <Notice>짧은 기록은 본사의 방침에 따라 0.5로 계산됩니다.</Notice>
        <Notice>드라이버가 없을때 본사의 방침에 따라 0.5로 계산됩니다.</Notice>
      </NoticeWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;

  background: #fff;
  position: relative;
  padding-top: 56px;
  padding-bottom: 338px;
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
  padding: 12px 0;
`;

const ContentsContainer = styled.div`
  /* min-width: 290px;
  display: flex;
  flex-direction: column;
  padding: 64px 24px 54px; */

  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.1);
  width: 155px;
  min-width: 155px;
  height: 230px;
`;

const Card = styled.img`
  width: 100%;
  height: 100%;
`;

const TicketAmount = styled.div`
  color: #000;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  white-space: pre-wrap;
  margin-top: 28px;
  margin-bottom: 12px;
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
  text-decoration: none;
  cursor: pointer;
  margin-left: auto;
`;

const NoticeWrapper = styled.ul`
  padding: 16px 16px 150px 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 86px;
`;

const Notice = styled.li`
  color: #666;
  font-size: 12px;
  font-weight: 400;
  word-break: keep-all;
`;

const TicketIconBlock = styled.div`
  width: fit-content;
  position: relative;
  display: flex;
  justify-content: center;
  margin: 0 auto;
`;

const TicketLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  background: #d42828;

  color: #fff;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  top: -14px;
  right: -14px;
  border-radius: 14px;
`;

const TicketIcon = styled.img`
  width: 160px;
`;

const TableContainer = styled.div`
  padding: 0 16px;
  margin-top: 82px;
`;

const TableTitle = styled.div`
  padding: 12px 12px 24px 8px;
  color: #666;
  font-size: 14px;
  font-weight: 700;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  overflow: scroll;
  border-radius: 12px;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  background: #f5f5f5;
  /* border-bottom: 1px solid #e5e5e5; */
  white-space: nowrap;
  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }
`;

const Td = styled.td`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid #e5e5e5;
  color: #333;
  vertical-align: middle;
  /* white-space: nowrap; */
  word-break: keep-all;

  &:first-child {
    font-weight: 500;
  }
`;

const CheckIcon = styled.span`
  color: #3e4730;
  font-size: 16px;
`;

const XIcon = styled.span`
  color: #c7c7c7;
  font-size: 16px;
`;

const StyledScrollContainer = styled(ScrollContainer)`
  padding: 0 16px;
`;

// 월 1000만원 이용 안내 영역 스타일 (가로형)
const MonthlyPlanCard = styled.div`
  width: 100%;
  /* min-width: 400px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-radius: 20px;
  /* background: linear-gradient(135deg, #8cff20 0%, #7aee1a 100%); */
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }
`;

const MonthlyPlanLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
`;

const MonthlyPlanIcon = styled.div`
  font-size: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
`;

const MonthlyPlanContent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const MonthlyPlanTitle = styled.div`
  color: #000;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1.2;
`;

const MonthlyPlanSubtitle = styled.div`
  color: #333;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.3;
`;

const MonthlyPlanDescription = styled.div`
  color: #555;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
`;

const MonthlyPlanPeriod = styled.div`
  color: #3e4730;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  margin-top: 8px;
  padding: 6px 12px;
  background: rgba(62, 71, 48, 0.1);
  border-radius: 8px;
  display: inline-block;
`;

const MonthlyPlanRight = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
`;

const KakaoTalkButton = styled.div`
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
  cursor: pointer;
  transition: all 0.3s ease;
  /* box-shadow: 0 4px 12px rgba(254, 229, 0, 0.3); */
  border: 2px solid transparent;

  /* &:hover {
    background: #fdd835;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(254, 229, 0, 0.4);
    border-color: rgba(0, 0, 0, 0.1);
  } */

  &:active {
    transform: translateY(0);
  }
`;

// 토스페이먼츠 타입 선언
declare global {
  interface Window {
    TossPayments: any;
  }
}

export default PricingPage;

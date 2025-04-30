import React, { useState } from "react";
import styled from "styled-components";
// import { ChevronDown } from "lucide-react";
import Header from "@/src/components/Header";
import IcChevronDown from "@/src/assets/ic-chevron-down.svg";

// FAQ 데이터
const faqData = [
  {
    category: "예약",
    question: "바하나 VIP 의전 서비스는 무엇인가요?",
    answer:
      "바하나 VIP 의전 서비스는 고급 차량과 전문 전문 드라이버를 통해 고객의 편안하고 안전한 이동을 지원하는 서비스입니다.",
  },
  {
    category: "예약",
    question: "이용 가능한 차량은 무엇인가요?",
    answer:
      "Lexus LM500h Rayal, 메르세데스-벤츠 스프린터, 토요타 알파드, 현대 팰리세이드 등 시장내 가장 인기있고 희소하며 의전과 안전한 이동에 최적화된 차량을 보유하고 있습니다.",
  },
  {
    category: "결제",
    question: "결제 방법은 어떻게 구성되어 있나요?",
    answer:
      "온오프라인 카드 결제, 계좌 이체, 현금 결제 모두 가능합니다. 자세한 사항은 고객센터를 통해 안내받을 수 있습니다.",
  },
  {
    category: "결제",
    question: "환불이 가능한가요?",
    answer:
      "서비스 이용 전에 환불 정책을 안내드리며, 예약 및 배차 완료 이후의 환불 요청은 서비스 이용 1일 전까지만 해주시면 됩니다.",
  },
  {
    category: "추천",
    question: "추천인 코드는 어떻게 사용하나요?",
    answer:
      "회원가입 시 추천인 코드를 입력하시면 특별한 혜택을 받으실 수 있습니다.",
  },
  {
    category: "회원",
    question: "멤버십 혜택은 무엇인가요?",
    answer:
      "멤버십 고객에게는 신차 우선이용권, 전용 차량과 드라이버 배정, 우선 예약권, VIP고객 커뮤니티 입장권, 개인 맞춤형 서비스 등이 제공됩니다.",
  },
];

const QnAPage = () => {
  const categories = {
    예약내역: faqData.filter((item) => item.category === "예약"),
    결제내역: faqData.filter((item) => item.category === "결제"),
    추천인: faqData.filter((item) => item.category === "추천"),
    회원정보: faqData.filter((item) => item.category === "회원"),
  };

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
    setActiveItem(null);
  };

  const toggleItem = (itemId) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          Q&A
          <br />
          LIST
        </Title>
        자주 묻는 질문
      </TitleContainer>

      <AccordionContainer>
        {Object.entries(categories).map(([category, items]) => (
          <div key={category}>
            <CategoryButton
              onClick={() => toggleCategory(category)}
              isActive={activeCategory === category}
            >
              <span>{category}</span>
              <ChevronIcon isActive={activeCategory === category}>
                {/* <ChevronDown size={24} /> */}
                <img src={IcChevronDown} style={{ width: 24 }} />
              </ChevronIcon>
            </CategoryButton>

            <ItemsContainer isActive={activeCategory === category}>
              {items.map((item, index) => (
                <QuestionItem key={index}>
                  <QuestionButton
                    onClick={() => toggleItem(`${category}-${index}`)}
                    isActive={activeItem === `${category}-${index}`}
                  >
                    <span>{item.question}</span>
                    <ChevronIcon
                      isActive={activeItem === `${category}-${index}`}
                    >
                      {/* <ChevronDown size={20} /> */}
                      <img src={IcChevronDown} style={{ width: 20 }} />
                    </ChevronIcon>
                  </QuestionButton>
                  <AnswerContainer
                    isActive={activeItem === `${category}-${index}`}
                  >
                    <Answer>{item.answer}</Answer>
                  </AnswerContainer>
                </QuestionItem>
              ))}
            </ItemsContainer>
          </div>
        ))}
      </AccordionContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  flex: 1 !important;
  background: #fff;
  position: relative;
  padding-top: 56px;
  padding-bottom: 317px;
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

const AccordionContainer = styled.div`
  padding: 0 16px;
  height: 100%;
  padding-bottom: 152px;
`;

const CategoryButton = styled.button<{ isActive?: boolean }>`
  width: 100%;
  padding: 16px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #f9f9f9;
  }
`;

const ItemsContainer = styled.div<{ isActive?: boolean }>`
  max-height: ${(props) => (props.isActive ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  margin-bottom: ${(props) => (props.isActive ? "16px" : "0")};
`;

const QuestionItem = styled.div`
  border-bottom: 1px solid #eee;
  background: #fff;
`;

const QuestionButton = styled.button<{ isActive?: boolean }>`
  width: 100%;
  padding: 16px;
  background: transparent;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #f9f9f9;
  }
`;

const AnswerContainer = styled.div<{ isActive?: boolean }>`
  max-height: ${(props) => (props.isActive ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background: #f9f9f9;
`;

const Answer = styled.div`
  padding: 16px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
`;

const ChevronIcon = styled.div<{ isActive?: boolean }>`
  transform: ${(props) => (props.isActive ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.3s ease-in-out;
  display: flex;
  align-items: center;
  color: #666;
`;

export default QnAPage;

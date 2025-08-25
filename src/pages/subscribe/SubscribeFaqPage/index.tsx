import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

type Faq = {
  id: number;
  question: string;
  answer: string;
};

const SubscribeFaqPage = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch("https://alpha.vahana.kr/subscriptions/faqs");
        if (!res.ok) {
          throw new Error(`FAQ API 실패: ${res.status}`);
        }
        const data: Faq[] = await res.json();
        setFaqs(data);
      } catch (e) {
        setError("FAQ를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleOpen = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const launchTalk = () => {
    window.open("http://pf.kakao.com/_yxcxhVn/chat", "_blank");
  };

  const launchTerms = () => {
    window.open(
      "https://www.notion.so/237f3024832f80859d83e8e29cf72dc7?source=copy_link",
      "_blank"
    );
  };

  return (
    <Container>
      <Header />
      <Content>
        <HeaderBlock>
          <Title>궁금한 점이 있으신가요?</Title>
          <Title>자주 묻는 질문들을 확인해 보세요.</Title>
        </HeaderBlock>

        <SectionTitle>자주 묻는 질문들</SectionTitle>

        {loading ? (
          <CenterBox>로딩 중...</CenterBox>
        ) : error ? (
          <CenterBox>{error}</CenterBox>
        ) : faqs.length === 0 ? (
          <CenterBox>등록된 FAQ가 없습니다.</CenterBox>
        ) : (
          <FaqList>
            {faqs.map((f) => (
              <FaqItem key={f.id}>
                <FaqQuestion onClick={() => toggleOpen(f.id)}>
                  <span>{f.question}</span>
                  <Chevron $open={openId === f.id}>▾</Chevron>
                </FaqQuestion>
                {openId === f.id && <FaqAnswer>{f.answer}</FaqAnswer>}
              </FaqItem>
            ))}
          </FaqList>
        )}

        <Block>
          <Title>이용 약관을 확인해 보세요.</Title>
          <SubTitle>이용 약관 확인하러 가기.</SubTitle>
        </Block>
        <ActionRow onClick={launchTerms}>
          <ActionLeft>이용약관</ActionLeft>
          <ActionRight>→</ActionRight>
        </ActionRow>

        <Block>
          <Title>더 궁금하신 점이 있으신가요?</Title>
          <SubTitle>유선으로 연락주시면 친절하게 상담을 해드려요.</SubTitle>
        </Block>
        <ActionRow onClick={launchTalk}>
          <ActionLeft>문의하기</ActionLeft>
          <ActionRight>→</ActionRight>
        </ActionRow>

        {/* <FooterWrap>
          <Footer />
        </FooterWrap> */}
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

const HeaderBlock = styled.div`
  margin: 24px 0;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 6px 0;
`;

const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #c7c4c4;
  margin: 12px 0;
`;

const CenterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  color: #c7c4c4;
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FaqItem = styled.div`
  background: #202020;
  border-radius: 12px;
  padding: 14px 16px;
`;

const FaqQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: inline-block;
  transform: rotate(${(p) => (p.$open ? 180 : 0)}deg);
  transition: transform 0.2s ease;
`;

const FaqAnswer = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #c7c4c4;
  line-height: 1.6;
`;

const Block = styled.div`
  margin: 96px 0 12px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #c7c4c4;
`;

const ActionRow = styled.button`
  height: 60px;
  width: 100%;
  margin: 0 0 12px 0;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: #202020;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const ActionLeft = styled.span`
  font-size: 14px;
`;

const ActionRight = styled.span`
  font-size: 18px;
`;

const FooterWrap = styled.div`
  margin-top: 60px;
`;

export default SubscribeFaqPage;

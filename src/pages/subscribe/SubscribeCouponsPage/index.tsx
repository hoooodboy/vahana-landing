import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";

type Coupon = {
  id: number;
  user: number;
  coupon: {
    id: number;
    code: string;
    name: string;
    description: string;
    discount_type: string;
    discount_rate?: number;
    discount?: number | null;
    min_price: number;
    max_price: number;
    min_month: number;
    max_month: number;
    valid_from: string;
    valid_to: string;
    is_specific: boolean;
  };
  is_active: boolean;
  is_used: boolean;
  is_valid: boolean;
  created_at: string;
  used_at: string | null;
};

const SubscribeCouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("subscribeAccessToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://alpha.vahana.kr/subscriptions/coupons",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(`쿠폰 조회 실패: ${res.status}`);
        const data: Coupon[] = await res.json();
        setCoupons(data);
      } catch (e: any) {
        setError(e?.message || "쿠폰을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Container>
      <Header />
      <Content>
        <Title>내 쿠폰함</Title>
        {loading ? (
          <Center>로딩 중...</Center>
        ) : error ? (
          <Center>{error}</Center>
        ) : coupons.length === 0 ? (
          <Center>보유 중인 쿠폰이 없습니다.</Center>
        ) : (
          <List>
            {coupons.map((item) => (
              <Card key={item.id}>
                <Row>
                  <Name>{item.coupon.name}</Name>
                  <Badge $active={item.is_valid && !item.is_used}>
                    {item.is_used
                      ? "사용됨"
                      : item.is_valid
                        ? "사용 가능"
                        : "만료"}
                  </Badge>
                </Row>
                <Desc>{item.coupon.description}</Desc>
                <Meta>
                  유효기간:{" "}
                  {new Date(item.coupon.valid_from).toLocaleDateString()} ~{" "}
                  {new Date(item.coupon.valid_to).toLocaleDateString()}
                </Meta>
              </Card>
            ))}
          </List>
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
`;

const Content = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 18px 80px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 18px;
`;

const Center = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c7c4c4;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  background: #202020;
  border-radius: 12px;
  padding: 14px 16px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const Badge = styled.span<{ $active: boolean }>`
  padding: 4px 8px;
  border-radius: 999px;
  background: ${(p) => (p.$active ? "#8cff20" : "#2f2f2f")};
  color: ${(p) => (p.$active ? "#000" : "#c7c4c4")};
  font-size: 12px;
  font-weight: 700;
`;

const Desc = styled.div`
  font-size: 13px;
  color: #c7c4c4;
  margin-top: 8px;
`;

const Meta = styled.div`
  font-size: 12px;
  color: #c7c4c4;
  margin-top: 8px;
`;

export default SubscribeCouponsPage;

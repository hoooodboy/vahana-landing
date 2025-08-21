import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import { toast } from "react-toastify";

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
  const [newCode, setNewCode] = useState("");
  const [adding, setAdding] = useState(false);

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

        {/* 쿠폰 코드 입력 */}
        <InputRow>
          <CodeInput
            placeholder="쿠폰 코드를 입력하세요"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
          <AddButton
            disabled={!newCode.trim() || adding}
            onClick={async () => {
              const token = localStorage.getItem("subscribeAccessToken");
              if (!token) {
                toast.error("로그인이 필요합니다.");
                return;
              }
              try {
                setAdding(true);
                const res = await fetch(
                  `https://alpha.vahana.kr/subscriptions/coupons/${newCode.trim()}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (!res.ok) {
                  const txt = await res.text();
                  throw new Error(txt || `쿠폰 추가 실패: ${res.status}`);
                }
                const created: Coupon = await res.json();
                setCoupons((prev) => [created, ...prev]);
                setNewCode("");
                toast.success("쿠폰이 추가되었습니다!");
              } catch (e: any) {
                toast.error(e?.message || "쿠폰 추가에 실패했습니다.");
              } finally {
                setAdding(false);
              }
            }}
          >
            추가
          </AddButton>
        </InputRow>
        {loading ? (
          <Center>로딩 중...</Center>
        ) : error ? (
          <Center>{error}</Center>
        ) : (
          <>
            {(() => {
              const available = coupons.filter((c) => c.is_valid && !c.is_used);
              const used = coupons.filter((c) => c.is_used || !c.is_valid);

              if (coupons.length === 0) {
                return <Center>보유 중인 쿠폰이 없습니다.</Center>;
              }

              return (
                <>
                  <SectionTitle>사용 가능 ({available.length})</SectionTitle>
                  {available.length === 0 ? (
                    <Center>사용 가능한 쿠폰이 없습니다.</Center>
                  ) : (
                    <List>
                      {available.map((item) => (
                        <Card key={item.id}>
                          <Row>
                            <Name>{item.coupon.name}</Name>
                            <Badge $active>사용 가능</Badge>
                          </Row>
                          <Desc>{item.coupon.description}</Desc>
                          <Meta>
                            유효기간:{" "}
                            {new Date(
                              item.coupon.valid_from
                            ).toLocaleDateString()}{" "}
                            ~{" "}
                            {new Date(
                              item.coupon.valid_to
                            ).toLocaleDateString()}
                          </Meta>
                        </Card>
                      ))}
                    </List>
                  )}

                  <SectionTitle style={{ marginTop: 24 }}>
                    사용됨/만료 ({used.length})
                  </SectionTitle>
                  {used.length === 0 ? (
                    <Center>사용됨/만료된 쿠폰이 없습니다.</Center>
                  ) : (
                    <List>
                      {used.map((item) => (
                        <Card key={item.id}>
                          <Row>
                            <Name>{item.coupon.name}</Name>
                            <Badge $active={false}>
                              {item.is_used ? "사용됨" : "만료"}
                            </Badge>
                          </Row>
                          <Desc>{item.coupon.description}</Desc>
                          <Meta>
                            유효기간:{" "}
                            {new Date(
                              item.coupon.valid_from
                            ).toLocaleDateString()}{" "}
                            ~{" "}
                            {new Date(
                              item.coupon.valid_to
                            ).toLocaleDateString()}
                          </Meta>
                        </Card>
                      ))}
                    </List>
                  )}
                </>
              );
            })()}
          </>
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
  padding-bottom: 338px;
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

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const CodeInput = styled.input`
  flex: 1;
  height: 46px;
  border-radius: 12px;
  border: 1px solid #333;
  background: #111;
  color: #fff;
  padding: 0 14px;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #666;
  }
`;

const AddButton = styled.button`
  height: 46px;
  min-width: 74px;
  border: none;
  border-radius: 12px;
  background: ${(p) => (p.disabled ? "#333" : "#8cff20")};
  color: ${(p) => (p.disabled ? "#666" : "#000")};
  font-weight: 700;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  margin: 12px 0;
  color: #c7c4c4;
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

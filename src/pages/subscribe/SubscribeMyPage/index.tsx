import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useNavigate } from "react-router-dom";
import {
  getSubscribeCurrentUser,
  SubscribeUser,
} from "@/src/api/subscribeUser";

const SubscribeMyPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SubscribeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("subscribeAccessToken");
    if (!token) {
      navigate("/subscribe/login");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const me = await getSubscribeCurrentUser(token);
        setUser(me);
      } catch (e: any) {
        setError(e?.message || "사용자 정보 로드 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onLogout = () => {
    localStorage.removeItem("subscribeAccessToken");
    localStorage.removeItem("subscribeRefreshToken");
    alert("로그아웃되었습니다");
    navigate("/subscribe");
  };

  return (
    <Container>
      <Header />
      <Content>
        {loading ? (
          <Center>로딩 중...</Center>
        ) : error ? (
          <Center>{error}</Center>
        ) : user ? (
          <>
            <Card>
              <Row>
                <Avatar
                  src={user.profileImage || ""}
                  onError={(e: any) => (e.currentTarget.style.display = "none")}
                />
                <Col>
                  <Name>{user.username || user.name || "사용자"}</Name>
                  <Small>{user.email}</Small>
                  <Badge $verified={!!user.ciVerified}>
                    {user.ciVerified ? "인증됨" : "미인증"}
                  </Badge>
                </Col>
              </Row>
            </Card>
            <Button onClick={onLogout}>로그아웃</Button>
            <FooterWrap>
              <Footer />
            </FooterWrap>
          </>
        ) : (
          <Center>사용자 정보가 없습니다</Center>
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

const Center = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c7c4c4;
`;

const Card = styled.div`
  background: #202020;
  border-radius: 20px;
  padding: 18px;
  margin: 12px 0 24px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Avatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 48px;
  background: #2f2f2f;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const Small = styled.div`
  font-size: 13px;
  color: #c7c4c4;
`;

const Badge = styled.span<{ $verified: boolean }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  color: ${(p) => (p.$verified ? "#000" : "#c7c4c4")};
  background: ${(p) => (p.$verified ? "#8cff20" : "#2f2f2f")};
  width: fit-content;
`;

const Button = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 18px;
  background: #202020;
  color: #fff;
  font-weight: 700;
`;

const FooterWrap = styled.div`
  margin-top: 60px;
`;

export default SubscribeMyPage;

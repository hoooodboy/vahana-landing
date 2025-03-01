import React from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import { useGetApiAdminUsersIdReferrer } from "@/src/api/endpoints/users/users";

export const ReferrersModal = ({ isOpen, setIsOpen, user }) => {
  // 내가 추천한 회원 목록 조회
  const { data, isLoading, error } = useGetApiAdminUsersIdReferrer(user?.id, {
    query: {
      enabled: !!user?.id && isOpen,
    },
  });

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>추천인 관리</ModalTitle>

        <UserInfo>
          <InfoRow>
            <Label>ID</Label>
            <Value>{user?.id}</Value>
          </InfoRow>
          <InfoRow>
            <Label>이름</Label>
            <Value>{user?.name}</Value>
          </InfoRow>
        </UserInfo>

        {/* 나를 추천한 회원 */}
        <ReferrersSection>
          <SectionTitle>나를 추천한 회원</SectionTitle>

          {!user?.referrer ? (
            <EmptyState>추천인이 없습니다.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>이름</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: "left" }}>{user.referrer}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </ReferrersSection>

        {/* 내가 추천한 회원 목록 */}
        {isLoading ? (
          <LoadingState>로딩 중...</LoadingState>
        ) : error ? (
          <ErrorState>데이터를 불러오는 중 오류가 발생했습니다.</ErrorState>
        ) : (
          <>
            <ReferrersSection>
              <SectionTitle>내가 추천한 회원 목록</SectionTitle>

              {!data?.result || data?.result?.length === 0 ? (
                <EmptyState>추천한 회원이 없습니다.</EmptyState>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>이름</th>
                      <th>전화번호</th>
                      <th>가입일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.result?.map((referee: any, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: "left" }}>{referee.referee}</td>
                        <td>{formatPhoneNumber(referee.referee_phone)}</td>
                        <td>{formatDate(referee.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </ReferrersSection>

            <SummarySection>
              <SummaryItem>
                <strong>총 추천 인원:</strong> {data?.result?.length || 0}명
              </SummaryItem>
            </SummarySection>
          </>
        )}

        <ButtonGroup>
          <CancelButton onClick={() => setIsOpen(false)}>닫기</CancelButton>
        </ButtonGroup>
      </ModalContent>
    </PCModal>
  );
};

// 전화번호 포맷팅 함수
const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: auto;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
`;

const Value = styled.div`
  font-size: 14px;
  color: #333;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 30px;
  color: #e03131;
`;

const ReferrersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;

  th,
  td {
    padding: 12px;
    text-align: right;
    border-bottom: 1px solid #eee;
  }

  th {
    font-weight: 600;
    color: #666;
    font-size: 14px;
    background: #f8f9fa;
  }

  td {
    font-size: 14px;
    color: #333;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
`;

const SummarySection = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const SummaryItem = styled.div`
  margin-bottom: 8px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background: #3e4730;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #2e3520;
  }
`;

import React, { useState } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import { useGetApiUsersIdTickets } from "@/src/api/endpoints/users/users";
import { usePostApiTickets } from "@/src/api/endpoints/tickets/tickets";

export const TicketsModal = ({ isOpen, setIsOpen, user }) => {
  const [ticketCount, setTicketCount] = useState("");
  const [useDate, setUseDate] = useState("");
  const { data: tickets } = useGetApiUsersIdTickets(user?.id, {
    query: {
      enabled: !!user?.id,
    },
  });

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>티켓 관리</ModalTitle>
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

        <TicketHistory>
          <HistoryTitle>티켓 히스토리</HistoryTitle>
          {tickets?.result?.map((ticket) => (
            <HistoryRow key={ticket.id}>
              <Label>{ticket.date}</Label>
              <Value>{ticket.count} 티켓</Value>
            </HistoryRow>
          ))}
        </TicketHistory>

        <AddTicketSection>
          <Label>추가 티켓</Label>
          <Input
            type="number"
            value={ticketCount}
            onChange={(e) => setTicketCount(e.target.value)}
          />
          <Label>사용기한</Label>
          <Input
            type="date"
            value={useDate}
            onChange={(e) => setUseDate(e.target.value)}
          />
        </AddTicketSection>

        <ButtonGroup>
          <CancelButton onClick={() => setIsOpen(false)}>취소</CancelButton>
          <SubmitButton>저장</SubmitButton>
        </ButtonGroup>
      </ModalContent>
    </PCModal>
  );
};

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background: #f1f3f5;
  border: 1px solid #ddd;
  color: #666;
`;

const SubmitButton = styled(Button)`
  background: #3e4730;
  color: #fff;
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

const Value = styled.div`
  font-size: 14px;
  color: #333;
`;

const TicketHistory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
`;

const HistoryTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const HistoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`;

const AddTicketSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

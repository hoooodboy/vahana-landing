import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import {
  useGetApiUsersIdTickets,
  useGetApiAdminUsers,
} from "@/src/api/endpoints/users/users";
import { usePostApiTickets } from "@/src/api/endpoints/tickets/tickets";

export const TicketsModal = ({ isOpen, setIsOpen, user }) => {
  const [ticketCount, setTicketCount] = useState("");
  const [expireDays, setExpireDays] = useState("90"); // 기본값 90일

  const { data: tickets, refetch: refetchTickets } = useGetApiUsersIdTickets(
    user?.id,
    {
      query: {
        enabled: !!user?.id,
      },
    }
  );

  const { refetch: refetchUsers } = useGetApiAdminUsers({
    query: {
      enabled: false,
    },
  });

  const ticketMutation = usePostApiTickets({
    mutation: {
      onSuccess: () => {
        alert("처리가 완료되었습니다.");
        refetchTickets();
        refetchUsers();
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error:", error);
        alert("처리 중 오류가 발생했습니다.");
      },
    },
  });

  const handleSubmit = async () => {
    if (!user?.id) return;

    try {
      await ticketMutation.mutateAsync({
        data: {
          user_id: user.id,
          amount: Number(ticketCount) || 0,
          date: Number(expireDays),
        },
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

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
          <Table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>추가일자</th>
                <th>잔여티켓</th>
                <th>중전티켓</th>
                <th>총 티켓</th>
              </tr>
            </thead>
            <tbody>
              {tickets?.result?.map((ticket, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "left" }}>{ticket.created_at}</td>
                  <td>{ticket.prev_tickets}</td>
                  <td>
                    <Amount isCharge={ticket.type === "CHARGE"}>
                      {ticket.type === "CHARGE" ? "+" : "-"}
                      {ticket.amount}
                    </Amount>
                  </td>
                  <td>{ticket.remaining_tickets}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TicketHistory>

        <AddTicketSection>
          <Label>추가 티켓</Label>
          <Input
            type="number"
            value={ticketCount}
            onChange={(e) => setTicketCount(e.target.value)}
            min="0"
            placeholder="0 입력시 만료일만 변경됩니다"
          />
          <Label>만료 기간 (일)</Label>
          <Select
            value={expireDays}
            onChange={(e) => setExpireDays(e.target.value)}
          >
            <option value="90">90일</option>
            <option value="365">365일</option>
          </Select>
        </AddTicketSection>

        <ButtonGroup>
          <CancelButton onClick={() => setIsOpen(false)}>취소</CancelButton>
          <SubmitButton onClick={handleSubmit}>저장</SubmitButton>
        </ButtonGroup>
      </ModalContent>
    </PCModal>
  );
};

const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #c7c7c7;
  background: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  transition: border-color 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: scroll;
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

// const Select = styled.select`
//   padding: 8px 12px;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   font-size: 14px;
// `;

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

const Type = styled.span<{ isCharge?: boolean }>`
  font-weight: 600;
  color: ${(props) => (props.isCharge ? "#2F9E44" : "#E03131")};
`;

const DateText = styled.span`
  color: #666;
  font-size: 14px;
  margin-left: 8px;
`;

const HistoryInfo = styled.div`
  display: flex;
  align-items: center;
`;

const TicketInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Amount = styled.span<{ isCharge?: boolean }>`
  font-weight: 600;
  color: ${(props) => (props.isCharge ? "#2F9E44" : "#E03131")};
`;

const Remaining = styled.span`
  color: #666;
  font-size: 14px;
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

import React from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import { useGetApiAdminUsersIdReservations } from "@/src/api/endpoints/users/users";

export const OperationsModal = ({ isOpen, setIsOpen, user }) => {
  const { data: operations } = useGetApiAdminUsersIdReservations(user?.id, {
    query: {
      enabled: !!user?.id,
    },
  });

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>운행 횟수</ModalTitle>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>출발지</th>
              <th>목적지</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {operations?.result?.map((operation) => (
              <tr key={operation.id}>
                <Td>{operation.id}</Td>
                <Td>{operation.pickup_location}</Td>
                <Td>{operation.dropoff_location}</Td>
                <td>{operation.created_at}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalContent>
    </PCModal>
  );
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f8f9fa;
    font-weight: 600;
    color: #333;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
`;

const ModalTitle = styled.div`
  color: #000;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Td = styled.td`
  word-break: keep-all;
  white-space: pre-wrap;
`;

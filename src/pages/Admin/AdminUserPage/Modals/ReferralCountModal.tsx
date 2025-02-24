import React, { useState } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import { useGetApiUsersIdReservations } from "@/src/api/endpoints/users/users";

export const ReferralCountModal = ({ isOpen, setIsOpen, user }) => {
  const { data: operations } = useGetApiUsersIdReservations(
    user?.id,
    {},
    {
      query: {
        enabled: !!user?.id,
      },
    }
  );

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
                <td>{operation.id}</td>
                <td>{operation.pickup_location}</td>
                <td>{operation.dropoff_location}</td>
                <td>{operation.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* <CloseButton onClick={onClose}>닫기</CloseButton> */}
      </ModalContent>
    </PCModal>
  );
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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
  text-align: center;
`;

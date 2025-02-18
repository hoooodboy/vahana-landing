import React, { useEffect, useState } from "react";
import styled from "styled-components";

import LogoImg from "@/src/assets/ic-vahana-white.png";
import LmImg from "@/src/assets/img-lm500h.png";
import { Link } from "react-router-dom";
import { useGetApiAdminUsers } from "@/src/api/endpoints/users/users";

const Confirm = () => {
  const { data: users } = useGetApiAdminUsers();

  console.log("users", users);

  return (
    <Container>
      <Table>
        <ThWrapper>
          <Th>이름</Th>
        </ThWrapper>
        <TBody>{users?.result?.map((data) => <Td>{data.name}</Td>)}</TBody>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  position: relative;
  display: flex;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
`;

const ThWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const Th = styled.div``;

const Td = styled.div``;

export default Confirm;

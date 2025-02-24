import React, { useState } from "react";
import styled from "styled-components";
import AdminSideBar from "@/src/components/AdminSideBar";
import { useGetApiAdminUsers } from "@/src/api/endpoints/users/users";
import IcSearch from "@/src/assets/ic-search.svg";
import { UserInfoModal } from "./Modals/UserInfoModal";
import { ReferralCountModal } from "./Modals/ReferralCountModal";
import { OperationsModal } from "./Modals/OperationsModal";
import { TicketsModal } from "./Modals/TicketsModal";
import { VerificationModal } from "./Modals/VerificationModal";

const AdminHomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // 각 모달별 상태 관리
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isReferralCountOpen, setIsReferralCountOpen] = useState(false);
  const [isOperationsOpen, setIsOperationsOpen] = useState(false);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  const { data: users } = useGetApiAdminUsers({
    query: {
      enabled: true,
    },
  });

  const formatPhoneNumber = (phone) => {
    if (!phone) return "-";
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const openModal = (type, user) => {
    setSelectedUser(user);
    switch (type) {
      case "userInfo":
        setIsUserInfoOpen(true);
        break;
      case "referralCount":
        setIsReferralCountOpen(true);
        break;
      case "operations":
        setIsOperationsOpen(true);
        break;
      case "tickets":
        setIsTicketsOpen(true);
        break;
      case "verification":
        setIsVerificationOpen(true);
        break;
    }
  };

  const filteredUsers = users?.result?.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(user.id).includes(searchLower) ||
      user.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Container>
      <AdminSideBar />
      <Section>
        <SectionTitle>회원 관리</SectionTitle>

        <SearchContainer>
          <SearchBox>
            <SearchInput
              placeholder="아이디 or 이름을 입력해주세요."
              value={searchTerm}
              onChange={handleSearch}
            />
            <SearchIcon src={IcSearch} />
          </SearchBox>
        </SearchContainer>

        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>전화번호</th>
                <th>전여 추천 횟수</th>
                <th>추천인</th>
                <th>운행 횟수</th>
                <th>잔여 티켓</th>
                <th>추천인</th>
                <th>관리</th>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user) => (
                <TableRow key={user.id}>
                  <td>{user.id}</td>
                  <td
                    className="clickable"
                    onClick={() => openModal("userInfo", user)}
                  >
                    {user.name}
                  </td>
                  <td>{formatPhoneNumber(user.phone)}</td>
                  <td
                    className="clickable"
                    onClick={() => openModal("referralCount", user)}
                  >
                    {user.invite_limit || 0}
                  </td>
                  <td
                    className="clickable"
                    onClick={() => openModal("referees", user)}
                  >
                    {user.referrer || "-"}
                  </td>
                  <td
                    className="clickable"
                    onClick={() => openModal("operations", user)}
                  >
                    {user.reservations || 0}
                  </td>
                  <td
                    className="clickable"
                    onClick={() => openModal("tickets", user)}
                  >
                    {user.tickets || 0}
                  </td>
                  <td>
                    <ActionButton
                      onClick={() => openModal("verification", user)}
                    >
                      확인하기
                    </ActionButton>
                  </td>
                  <td>
                    <ActionButton
                      onClick={() => openModal("verification", user)}
                    >
                      확인하기
                    </ActionButton>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modals */}
        <UserInfoModal
          isOpen={isUserInfoOpen}
          user={selectedUser}
          setIsOpen={setIsUserInfoOpen}
        />

        <ReferralCountModal
          isOpen={isReferralCountOpen}
          user={selectedUser}
          setIsOpen={setIsReferralCountOpen}
        />

        <OperationsModal
          isOpen={isOperationsOpen}
          user={selectedUser}
          setIsOpen={setIsOperationsOpen}
        />

        <TicketsModal
          isOpen={isTicketsOpen}
          user={selectedUser}
          setIsOpen={setIsTicketsOpen}
        />

        <VerificationModal
          isOpen={isVerificationOpen}
          user={selectedUser}
          setIsOpen={setIsVerificationOpen}
        />
      </Section>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fff;
  position: relative;
  display: flex;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 !important;
  padding: 60px;
`;

const SectionTitle = styled.div`
  color: #000;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchBox = styled.div`
  position: relative;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }
`;

const SearchIcon = styled.img`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #eee;
  }
`;

const TableBody = styled.tbody`
  tr:hover {
    background: #f8f9fa;
  }
`;

const TableRow = styled.tr`
  td {
    padding: 16px;
    border-bottom: 1px solid #eee;

    &.clickable {
      cursor: pointer;
      text-decoration: underline;
      color: #3e4730;

      &:hover {
        color: #2e3520;
      }
    }
  }
`;

const ActionButton = styled.button`
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const Td = styled.td``;

export default AdminHomePage;

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
import { ReferrersModal } from "./Modals/ReferrersModal"; // Import the new modal

const AdminHomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // 각 모달별 상태 관리
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isReferralCountOpen, setIsReferralCountOpen] = useState(false);
  const [isOperationsOpen, setIsOperationsOpen] = useState(false);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isReferrersOpen, setIsReferrersOpen] = useState(false); // Added state for referrers modal

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
      case "referrers": // Added case for referrers
        setIsReferrersOpen(true);
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

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPROVED":
        return "확정";
      case "PENDING":
        return "대기";
      case "REJECTED":
        return "보류";
      case "NOT_SUBMITTED":
        return "미신청";
      default:
        return status;
    }
  };

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
                <th>잔여 추천 횟수</th>
                <th>추천인</th>
                <th>운행 횟수</th>
                <th>잔여 티켓</th>
                <th>관리</th>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user) => (
                <TableRow key={user.id}>
                  <td>{user.id}</td>
                  {/* 이름 */}
                  <td
                    className="clickable"
                    onClick={() => openModal("userInfo", user)}
                  >
                    {user.name}
                  </td>

                  {/* 전화번호 */}
                  <td>{formatPhoneNumber(user.phone)}</td>

                  {/* 잔여 추천 횟수 */}
                  <td
                    className="clickable"
                    onClick={() => openModal("referralCount", user)}
                  >
                    {user.invite_limit || 0}
                  </td>

                  {/* 추천인 */}
                  <td
                    className="clickable"
                    onClick={() => openModal("referrers", user)} // Changed from "referees" to "referrers"
                  >
                    {user.referrer || "-"}
                  </td>

                  {/* 운행 횟수 */}
                  <td
                    className="clickable"
                    onClick={() => openModal("operations", user)}
                  >
                    {user.reservations || 0}
                  </td>

                  {/* 잔여 티켓 */}
                  <td
                    className="clickable"
                    onClick={() => openModal("tickets", user)}
                  >
                    {user.tickets || 0}
                  </td>

                  {/* 관리 */}
                  <td>
                    <StatusBadge
                      status={user?.identity_status}
                      onClick={() => openModal("verification", user)}
                    >
                      {getStatusLabel(user?.identity_status)}
                    </StatusBadge>
                    {/* <ActionButton
                      
                    >
                      확인하기
                    </ActionButton> */}
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
          setIsOpen={setIsReferralCountOpen}
          user={selectedUser}
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

        {/* Added new ReferrersModal */}
        <ReferrersModal
          isOpen={isReferrersOpen}
          user={selectedUser}
          setIsOpen={setIsReferrersOpen}
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

const StatusBadge = styled.span<{ status?: any }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.status) {
      case "APPROVED":
        return "#e6f7ee";
      case "PENDING":
        return "#fff9db";
      case "REJECTED":
        return "#ffe3e3";
      case "NOT_SUBMITTED":
        return "#e9ecef";
      default:
        return "#e9ecef";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "APPROVED":
        return "#0ca678";
      case "PENDING":
        return "#f59f00";
      case "REJECTED":
        return "#fa5252";
      case "NOT_SUBMITTED":
        return "#868e96";
      default:
        return "#868e96";
    }
  }};
`;

export default AdminHomePage;

import React, { useState } from "react";
import styled from "styled-components";
import AdminSideBar from "@/src/components/AdminSideBar";
import {
  useGetApiAdminUsers,
  useDeleteApiAdminUsersId,
} from "@/src/api/endpoints/users/users";
import IcSearch from "@/src/assets/ic-search.svg";
import { UserInfoModal } from "./Modals/UserInfoModal";
import { ReferralCountModal } from "./Modals/ReferralCountModal";
import { OperationsModal } from "./Modals/OperationsModal";
import { TicketsModal } from "./Modals/TicketsModal";
import { VerificationModal } from "./Modals/VerificationModal";
import { ReferrersModal } from "./Modals/ReferrersModal";
import { toast } from "react-toastify";

const AdminHomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // 각 모달별 상태 관리
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isReferralCountOpen, setIsReferralCountOpen] = useState(false);
  const [isOperationsOpen, setIsOperationsOpen] = useState(false);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isReferrersOpen, setIsReferrersOpen] = useState(false);

  const { data: users, refetch } = useGetApiAdminUsers({
    query: {
      enabled: true,
    },
  });

  const deleteUserMutation = useDeleteApiAdminUsersId({
    mutation: {
      onSuccess: () => {
        toast("회원이 삭제되었습니다.");
        refetch(); // 데이터 다시 불러오기
      },
      onError: (error) => {
        console.error("유저 삭제 오류:", error);
        toast("회원 삭제 중 오류가 발생했습니다.");
      },
    },
  });

  const formatPhoneNumber = (phone) => {
    if (!phone) return "-";
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
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
      case "referrers":
        setIsReferrersOpen(true);
        break;
    }
  };

  const handleDeleteClick = (user) => {
    if (
      window.confirm(
        `정말 ${user.name} 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      deleteUserMutation.mutate({ id: user.id });
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
      {sidebarVisible && <AdminSideBar />}
      <Section>
        <TopBar>
          <SectionTitle>회원 관리</SectionTitle>
        </TopBar>

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
          <TableWrapper>
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
                  <th>삭제</th>
                </tr>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <td>{user.user_id}</td>
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
                      onClick={() => openModal("referrers", user)}
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
                    </td>

                    {/* 삭제 */}
                    <td>
                      <DeleteButton onClick={() => handleDeleteClick(user)}>
                        삭제
                      </DeleteButton>
                    </td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
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
  flex-direction: row;
  overflow: scroll;
  @media (max-width: 768px) {
    flex-direction: column;
    padding-top: 60px;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const MenuToggle = styled.button`
  display: none;
  background: #3e4730;
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  margin-right: 15px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 !important;
  padding: 60px;
  transition: all 0.3s ease;

  @media (max-width: 1200px) {
    padding: 40px 20px;
  }

  @media (max-width: 768px) {
    padding: 20px 15px;
    width: 100%;
  }
`;

const SectionTitle = styled.div`
  color: #000;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const SearchBox = styled.div`
  position: relative;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
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
  width: 100%;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3e4730;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px; /* 테이블의 최소 너비 설정 */
`;

const TableHeader = styled.thead`
  background: #f8f9fa;

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
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
    white-space: nowrap;

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

const StatusBadge = styled.span<{ status?: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
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

const DeleteButton = styled.button`
  padding: 4px 8px;
  background: ${(props) => (props.disabled ? "#ffc9c9" : "#ff6b6b")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 12px;
  font-weight: 500;
  min-width: 48px;

  &:hover {
    background: ${(props) => (props.disabled ? "#ffc9c9" : "#fa5252")};
  }
`;

export default AdminHomePage;

import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useGetApiDrivers } from "@/src/api/endpoints/drivers/drivers";
import AdminSideBar from "@/src/components/AdminSideBar";
import DriverAddModal from "./Modals/DriverAddModal";
import DriverEditModal from "./Modals/DriverEditModal";
import IcEdit from "@/src/assets/ic-edit.svg";

// 드라이버 타입 정의
interface Driver {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  note?: string;
}

const AdminDriverPage: React.FC = () => {
  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  // 드라이버 추가 모달 상태
  const [isDriverAddModalOpen, setIsDriverAddModalOpen] =
    useState<boolean>(false);

  // 드라이버 수정 모달 상태
  const [isDriverEditModalOpen, setIsDriverEditModalOpen] =
    useState<boolean>(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // 드라이버 목록 데이터 fetching
  const {
    data: driversData,
    isLoading,
    refetch,
  } = useGetApiDrivers({
    query: {
      enabled: true,
      refetchOnWindowFocus: false,
    },
  });

  // 필터링된 드라이버 목록
  const filteredDrivers = useMemo(() => {
    return (
      driversData?.result?.filter(
        (driver: Driver) =>
          driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.phone?.includes(searchTerm)
      ) || []
    );
  }, [driversData, searchTerm]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // 드라이버 추가 완료 핸들러
  const handleDriverAddComplete = () => {
    refetch();
    setIsDriverAddModalOpen(false);
  };

  // 드라이버 수정/삭제 완료 핸들러
  const handleDriverEditComplete = () => {
    refetch();
    setIsDriverEditModalOpen(false);
    setSelectedDriver(null);
  };

  // 드라이버 수정 모달 열기
  const openEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDriverEditModalOpen(true);
  };

  return (
    <Container>
      {sidebarVisible && <AdminSideBar />}

      <Section>
        <TopBar>
          {/* <MenuToggle onClick={toggleSidebar}>
            {sidebarVisible ? "◀" : "▶"}
          </MenuToggle> */}
          <SectionTitle>드라이버 관리</SectionTitle>
        </TopBar>

        <ContentWrapper>
          <SearchContainer>
            <SearchInput
              placeholder="아이디 or 이름을 입력해주세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AddButton onClick={() => setIsDriverAddModalOpen(true)}>
              추가
            </AddButton>
          </SearchContainer>

          <TableWrapper>
            <DriverTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>이름</th>
                  <th>전화번호</th>
                  <th>자택</th>
                  <th>특이사항</th>
                  <th>수정</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6}>로딩 중...</td>
                  </tr>
                ) : filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={6}>등록된 드라이버가 없습니다.</td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver: Driver) => (
                    <tr key={driver.id}>
                      <td>{driver.id}</td>
                      <td>{driver.name}</td>
                      <td>{formatPhoneNumber(driver.phone)}</td>
                      <td>{driver.address}</td>
                      <td>{driver.note || "-"}</td>
                      <td>
                        <Icon
                          src={IcEdit}
                          onClick={() => openEditModal(driver)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </DriverTable>
          </TableWrapper>
        </ContentWrapper>
      </Section>

      {/* 드라이버 추가 모달 */}
      {isDriverAddModalOpen && (
        <DriverAddModal
          isOpen={isDriverAddModalOpen}
          onClose={() => setIsDriverAddModalOpen(false)}
          onComplete={handleDriverAddComplete}
        />
      )}

      {/* 드라이버 수정 모달 */}
      {isDriverEditModalOpen && selectedDriver && (
        <DriverEditModal
          isOpen={isDriverEditModalOpen}
          onClose={() => setIsDriverEditModalOpen(false)}
          driver={selectedDriver}
          onComplete={handleDriverEditComplete}
        />
      )}
    </Container>
  );
};

// 전화번호 포맷팅 헬퍼 함수
const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return "N/A";
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};

// Styled Components
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  background-color: #f8f9fa;
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
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;

  @media (max-width: 1200px) {
    padding: 40px 20px;
  }

  @media (max-width: 768px) {
    padding: 20px 15px;
    width: 100%;
  }
`;

const SectionTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ContentWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px 10px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;
  width: 300px;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const AddButton = styled.button`
  padding: 10px 16px;
  background-color: #3e4730;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2b331f;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
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

const DriverTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* 테이블의 최소 너비 설정 */

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
    white-space: nowrap;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

const Icon = styled.img`
  cursor: pointer;
`;

export default AdminDriverPage;

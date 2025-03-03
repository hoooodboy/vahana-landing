import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useGetApiDrivers } from "@/src/api/endpoints/drivers/drivers";
import AdminSideBar from "@/src/components/AdminSideBar";
import DriverAddModal from "./Modals/DriverAddModal";
import DriverEditModal from "./Modals/DriverEditModal";
import IcEdit from "@/src/assets/ic-edit.svg";

const AdminDriverPage = () => {
  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState("");

  // 드라이버 추가 모달 상태
  const [isDriverAddModalOpen, setIsDriverAddModalOpen] = useState(false);

  // 드라이버 수정 모달 상태
  const [isDriverEditModalOpen, setIsDriverEditModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

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
        (driver) =>
          driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.phone?.includes(searchTerm)
      ) || []
    );
  }, [driversData, searchTerm]);

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
  const openEditModal = (driver) => {
    setSelectedDriver(driver);
    setIsDriverEditModalOpen(true);
  };

  return (
    <Container>
      <AdminSideBar />

      <Section>
        <SectionTitle>드라이버 관리</SectionTitle>

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
                filteredDrivers.map((driver) => (
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
                      {/* <EditButton onClick={() => openEditModal(driver)}>
                        수정
                      </EditButton> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </DriverTable>
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
const formatPhoneNumber = (phone?: string) => {
  if (!phone) return "N/A";
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};

// Styled Components
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  background-color: #f8f9fa;
`;

const Section = styled.div`
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #333;
`;

const ContentWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
`;

const DriverTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 16px;
    text-align: center;
    border-bottom: 1px solid #e9ecef;
    white-space: pre-wrap;
    text-align: left;
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

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #3e4730;
  text-decoration: underline;

  &:hover {
    color: #2b331f;
  }
`;

const Icon = styled.img``;

export default AdminDriverPage;

import React, { useState, useMemo } from "react";
import styled from "styled-components";
import {
  useGetApiCars,
  useDeleteApiCarsIdInventoryInventoryId,
  useDeleteApiCarsId,
  getGetApiCarsIdQueryOptions,
} from "@/src/api/endpoints/cars/cars";
import AdminSideBar from "@/src/components/AdminSideBar";
import AddCarModal from "./Modals/AddCarModal";
import AddCarInventoryModal from "./Modals/AddCarInventoryModal";
import EditCarModal from "./Modals/EditCarModal";
import { useQueries } from "@tanstack/react-query";
import { imgView } from "@/src/utils/upload";

const AdminCarPage = () => {
  // 차량 목록 데이터
  const {
    data: carsData,
    isLoading: carsLoading,
    refetch: refetchCars,
  } = useGetApiCars({
    query: {
      enabled: true,
      refetchOnWindowFocus: false,
    },
  });

  // 차량 삭제 Mutation
  const deleteCarMutation = useDeleteApiCarsId({
    mutation: {
      onSuccess: () => {
        alert("차량이 성공적으로 삭제되었습니다.");
        refetchCars();
      },
      onError: () => {
        alert("차량 삭제에 실패했습니다.");
      },
    },
  });

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState("");

  // 확장된 차량 ID 상태
  const [expandedCarIds, setExpandedCarIds] = useState<number[]>([]);

  // 새 차량 추가 모달 상태
  const [showAddCarModal, setShowAddCarModal] = useState(false);

  // 차량 재고 추가 모달 상태
  const [showInventoryModal, setShowInventoryModal] = useState(false);

  // 차량 수정 모달 상태
  const [showEditCarModal, setShowEditCarModal] = useState(false);

  // 선택된 차량 ID (재고 추가 시)
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  // 수정할 차량 정보
  const [selectedCar, setSelectedCar] = useState(null);

  // 차량 재고 삭제 mutation
  const deleteInventoryMutation = useDeleteApiCarsIdInventoryInventoryId();

  // 차량 목록 필터링
  const filteredCars = useMemo(() => {
    return (
      carsData?.result?.filter((car) =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    );
  }, [carsData, searchTerm]);

  // 확장된 모든 차량 ID에 대한 쿼리 배열 생성
  const carDetailsQueries = useQueries({
    queries:
      expandedCarIds.length > 0
        ? expandedCarIds.map((id) =>
            getGetApiCarsIdQueryOptions(id.toString(), {
              query: {
                enabled: true,
                refetchOnWindowFocus: false,
              },
            })
          )
        : [],
  });

  // 차량 삭제 핸들러
  const handleDeleteCar = (carId: number) => {
    const confirmDelete = window.confirm("정말로 이 차량을 삭제하시겠습니까?");
    if (confirmDelete) {
      deleteCarMutation.mutate({
        id: carId.toString(),
      });
    }
  };

  // 차량 행 클릭 핸들러
  const handleCarRowClick = (carId: number) => {
    if (expandedCarIds.includes(carId)) {
      setExpandedCarIds(expandedCarIds.filter((id) => id !== carId));
    } else {
      setExpandedCarIds([...expandedCarIds, carId]);
    }
  };

  // 차량 ID로 쿼리 결과 찾기
  const findCarDetailQuery = (carId: number) => {
    const queryIndex = expandedCarIds.findIndex((id) => id === carId);
    if (queryIndex === -1) return null;
    return carDetailsQueries[queryIndex];
  };

  // 차량 추가 모달 열기 핸들러
  const handleOpenAddCarModal = () => {
    setShowAddCarModal(true);
  };

  // 차량 추가 모달 취소 핸들러
  const handleCancelAddCar = () => {
    setShowAddCarModal(false);
  };

  // 차량 추가 완료 핸들러
  const handleAddCarComplete = () => {
    refetchCars();
    setShowAddCarModal(false);
  };

  // 차량 재고 추가 모달 열기 핸들러
  const handleOpenInventoryModal = (carId: number) => {
    setSelectedCarId(carId);
    setShowInventoryModal(true);
  };

  // 차량 재고 추가 모달 취소 핸들러
  const handleCancelAddInventory = () => {
    setShowInventoryModal(false);
    setSelectedCarId(null);
  };

  // 차량 재고 추가 완료 핸들러
  const handleAddInventoryComplete = (carId: number) => {
    // 해당 차량 쿼리 찾기
    const query = findCarDetailQuery(carId);
    if (query) {
      query.refetch();
    }

    setShowInventoryModal(false);
    setSelectedCarId(null);
  };

  // 차량 수정 모달 열기 핸들러
  const handleOpenEditCarModal = (car) => {
    setSelectedCar(car);
    setShowEditCarModal(true);
  };

  // 차량 수정 모달 취소 핸들러
  const handleCancelEditCar = () => {
    setShowEditCarModal(false);
    setSelectedCar(null);
  };

  // 차량 수정 완료 핸들러
  const handleEditCarComplete = () => {
    refetchCars();
    setShowEditCarModal(false);
    setSelectedCar(null);
  };

  // 차량 재고 삭제 핸들러
  const handleDeleteInventory = async (carId: number, inventoryId: number) => {
    try {
      await deleteInventoryMutation.mutateAsync({
        id: carId.toString(),
        inventoryId: inventoryId.toString(),
      });

      // 삭제 후 해당 차량 상세 정보 다시 가져오기
      const query = findCarDetailQuery(carId);
      if (query) {
        query.refetch();
      }
    } catch (error) {
      console.error("Failed to delete inventory:", error);
    }
  };

  // 차량 상태 표시 헬퍼 함수
  const getStatusLabel = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "사용 가능";
      case "UNAVAILABLE":
        return "사용 불가";
      case "MAINTENANCE":
        return "정비 중";
      default:
        return status;
    }
  };

  // 차량 인벤토리 렌더링
  const renderCarInventories = (carId: number) => {
    const query = findCarDetailQuery(carId);

    if (!query) {
      return <div>로딩 중...</div>;
    }

    const { data, isLoading } = query;

    if (isLoading) {
      return <div>로딩 중...</div>;
    }

    if (!data?.result || data.result.length === 0) {
      return <div>등록된 차량 번호가 없습니다.</div>;
    }

    return (
      <InventoryList>
        {data.result.map((inventory: any) => (
          <InventoryItem key={inventory.id}>
            <span>{inventory.registration_number}</span>
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteInventory(carId, inventory.id);
              }}
            >
              삭제
            </DeleteButton>
          </InventoryItem>
        ))}
      </InventoryList>
    );
  };

  return (
    <Container>
      <AdminSideBar />

      <Section>
        <SectionTitle>차량 관리</SectionTitle>

        <ContentWrapper>
          <SearchContainer>
            <SearchInput
              placeholder="차량명을 입력해주세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AddButton onClick={handleOpenAddCarModal}>+ 차량 추가</AddButton>
          </SearchContainer>

          <CarTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>차량</th>
                <th style={{ textAlign: "right" }}>상태</th>
                <th style={{ textAlign: "right" }}>추가사항</th>
              </tr>
            </thead>
            <tbody>
              {carsLoading ? (
                <tr>
                  <td colSpan={4}>로딩 중...</td>
                </tr>
              ) : filteredCars.length === 0 ? (
                <tr>
                  <td colSpan={4}>등록된 차량이 없습니다.</td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <React.Fragment key={car.id}>
                    <CarRow onClick={() => handleCarRowClick(car.id)}>
                      <td>{car.id}</td>
                      <td>{car.name}</td>
                      <td style={{ textAlign: "right" }}>
                        <StatusBadge status={car.status}>
                          {getStatusLabel(car.status)}
                        </StatusBadge>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <ExpandIcon
                          isExpanded={expandedCarIds.includes(car.id)}
                        >
                          ▾
                        </ExpandIcon>
                      </td>
                    </CarRow>

                    {expandedCarIds.includes(car.id) && (
                      <ExpandedRow>
                        <td colSpan={4}>
                          <ExpandedContent>
                            <CarInfoSection>
                              <h4>{car.name}</h4>

                              {car.image && (
                                <CarImageContainer>
                                  <CarImage
                                    src={imgView(car.image)}
                                    alt={car.name}
                                  />
                                </CarImageContainer>
                              )}
                            </CarInfoSection>

                            {/* <SectionTitle>차량 재고</SectionTitle> */}
                            {renderCarInventories(car.id)}
                          </ExpandedContent>
                          <CarActionContainer>
                            <DeleteCarButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCar(car.id);
                              }}
                            >
                              삭제
                            </DeleteCarButton>
                            <EditCarButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditCarModal(car);
                              }}
                            >
                              수정
                            </EditCarButton>
                            <AddInventoryButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenInventoryModal(car.id);
                              }}
                            >
                              + 재고
                            </AddInventoryButton>
                          </CarActionContainer>
                        </td>
                      </ExpandedRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </CarTable>
        </ContentWrapper>
      </Section>

      {/* 차량 추가 모달 */}
      {showAddCarModal && (
        <AddCarModal
          isOpen={showAddCarModal}
          onCancel={handleCancelAddCar}
          onComplete={handleAddCarComplete}
        />
      )}

      {/* 차량 재고 추가 모달 */}
      {showInventoryModal && selectedCarId && (
        <AddCarInventoryModal
          isOpen={showInventoryModal}
          carId={selectedCarId}
          onCancel={handleCancelAddInventory}
          onComplete={() => handleAddInventoryComplete(selectedCarId)}
        />
      )}

      {/* 차량 수정 모달 */}
      {showEditCarModal && selectedCar && (
        <EditCarModal
          isOpen={showEditCarModal}
          car={selectedCar}
          onCancel={handleCancelEditCar}
          onComplete={handleEditCarComplete}
        />
      )}
    </Container>
  );
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

const CarTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }
`;

const CarRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.status) {
      case "AVAILABLE":
        return "#e6f7ee";
      case "UNAVAILABLE":
        return "#fff3bf";
      case "MAINTENANCE":
        return "#ffe3e3";
      default:
        return "#e9ecef";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "AVAILABLE":
        return "#0ca678";
      case "UNAVAILABLE":
        return "#f08c00";
      case "MAINTENANCE":
        return "#fa5252";
      default:
        return "#868e96";
    }
  }};
`;

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  display: inline-block;
  transform: ${(props) => (props.isExpanded ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.2s;
`;

const ExpandedRow = styled.tr`
  background-color: #f8f9fa;
`;

const ExpandedContent = styled.div`
  padding: 16px;
`;

const CarInfoSection = styled.div`
  margin-bottom: 24px;

  h4 {
    margin: 0 0 16px 0;
    font-size: 18px;
    color: #343a40;
  }
`;

const CarImageContainer = styled.div`
  width: 100%;
  max-width: 300px;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const CarImage = styled.img`
  width: 100%;
  height: 200px;
  height: auto;
  display: block;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #6c757d;
  margin-right: 8px;
  white-space: nowrap;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #343a40;
  font-weight: 500;
`;

const AddInventoryButton = styled.button`
  padding: 6px 12px;
  background-color: #3e4730;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2b331f;
  }
`;

const EditCarButton = styled.button`
  padding: 6px 12px;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #666;
  }
`;

const InventoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const InventoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;
`;

const DeleteButton = styled.button`
  padding: 4px 8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #c82333;
  }
`;

const CarActionContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const DeleteCarButton = styled.button`
  padding: 4px 8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #c82333;
  }
`;

export default AdminCarPage;

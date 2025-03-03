import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useGetApiReservations } from "@/src/api/endpoints/reservations/reservations";
import { usePatchApiReservationsId } from "@/src/api/endpoints/reservations/reservations";
import AdminSideBar from "@/src/components/AdminSideBar";
import InfoChangeModal from "./Modals/InfoChangeModal";
import VehicleChangeModal from "./Modals/VehicleChangeModal";
import DriverChangeModal from "./Modals/DriverChangeModal";
import ReservationDetailModal from "./Modals/ReservationDetailModal";
import StatusChangeModal from "./Modals/StatusChangeModal";
import IcEdit from "@/src/assets/ic-edit.svg";

// 예약 상태 라벨 및 색상 매핑
const STATUS_LABELS = {
  PENDING: { label: "대기", color: "#FFA500" },
  CONFIRMED: { label: "확정", color: "#2E8B57" },
  CANCELLED: { label: "취소", color: "#DC3545" },
};

const AdminReservationPage = () => {
  const [activeTab, setActiveTab] = useState("예약 확정");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [reservationDetailModalOpen, setReservationDetailModalOpen] =
    useState(false);

  // Fetch reservations with filter by status
  const {
    data: reservationsData,
    isLoading,
    refetch,
  } = useGetApiReservations(
    {
      status: getStatusFilter(activeTab),
    },
    {
      query: {
        enabled: true,
        refetchOnWindowFocus: false,
      },
    }
  );

  const updateReservationMutation = usePatchApiReservationsId({
    mutation: {
      onSuccess: () => {
        toast.success("예약 상태가 성공적으로 변경되었습니다.");
        refetch();
      },
      onError: () => {
        toast.error("예약 상태 변경에 실패했습니다.");
      },
    },
  }) as any;

  function getStatusFilter(tab: string) {
    switch (tab) {
      case "예약 확정":
        return "CONFIRMED";
      case "확정 대기":
        return "PENDING";
      case "취소":
        return "CANCELLED";
      default:
        return "CONFIRMED";
    }
  }

  const filteredReservations =
    reservationsData?.result?.filter((reservation) => {
      return (
        reservation.name?.includes(searchTerm) ||
        reservation.id?.toString()?.includes(searchTerm) ||
        reservation.phone?.includes(searchTerm)
      );
    }) || [];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const openStatusModal = (reservation: any) => {
    setSelectedReservation(reservation);
    setStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedReservation(null);
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedReservation) return;

    try {
      await updateReservationMutation.mutateAsync({
        id: selectedReservation.id,
        data: { status },
      });
      closeStatusModal();
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  const openVehicleModal = (reservation: any) => {
    setSelectedReservation(reservation);
    setVehicleModalOpen(true);
  };

  const closeVehicleModal = () => {
    setVehicleModalOpen(false);
    setSelectedReservation(null);
  };

  const handleVehicleChange = async (vehicleId: string) => {
    if (!selectedReservation) return;

    try {
      await updateReservationMutation.mutateAsync({
        id: selectedReservation.id,
        data: {
          car_inventory_id: vehicleId,
        },
      });
      closeVehicleModal();
    } catch (error) {
      console.error("Failed to update vehicle:", error);
    }
  };

  const openDriverModal = (reservation: any) => {
    setSelectedReservation(reservation);
    setDriverModalOpen(true);
  };

  const closeDriverModal = () => {
    setDriverModalOpen(false);
    setSelectedReservation(null);
  };

  const handleDriverChange = async (driverId: string) => {
    if (!selectedReservation) return;

    try {
      await updateReservationMutation.mutateAsync({
        id: selectedReservation.id,
        data: {
          driver_id: driverId,
        },
      });
      closeDriverModal();
    } catch (error) {
      console.error("Failed to update driver:", error);
    }
  };

  const openReservationDetailModal = (reservation: any) => {
    setSelectedReservation(reservation);
    setReservationDetailModalOpen(true);
  };

  const closeReservationDetailModal = () => {
    setReservationDetailModalOpen(false);
    setSelectedReservation(null);
  };

  const handleSaveReservationDetail = async (formData: any) => {
    if (!selectedReservation) return;

    try {
      await updateReservationMutation.mutateAsync({
        id: selectedReservation.id,
        data: formData,
      });
      closeReservationDetailModal();
    } catch (error) {
      console.error("Failed to update reservation details:", error);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    return phone ? phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3") : "N/A";
  };

  const handleReservationDetailSuccess = () => {
    refetch(); // 예약 상세 정보가 업데이트된 후 예약 목록을 새로고침
    toast.success("예약 정보가 성공적으로 업데이트되었습니다.");
  };

  return (
    <Container>
      <AdminSideBar />

      <Section>
        <SectionTitle>예약 관리</SectionTitle>

        <ContentWrapper>
          <TabsContainer>
            <Tab
              $isActive={activeTab === "예약 확정"}
              onClick={() => handleTabChange("예약 확정")}
            >
              예약 확정
            </Tab>
            <Tab
              $isActive={activeTab === "확정 대기"}
              onClick={() => handleTabChange("확정 대기")}
            >
              확정 대기
            </Tab>
            <Tab
              $isActive={activeTab === "취소"}
              onClick={() => handleTabChange("취소")}
            >
              취소
            </Tab>
          </TabsContainer>

          <TableSection>
            <TableHeader>
              <div>{activeTab}</div>
              <SearchContainer>
                <SearchInput
                  placeholder="아이디 or 이름을 입력해주세요."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIconWrapper>{/* <SearchIcon /> */}</SearchIconWrapper>
              </SearchContainer>
            </TableHeader>

            <ReservationTable>
              <TableHead>
                <tr>
                  <th>ID</th>
                  <th>예약일</th>
                  <th>출발 시간</th>
                  <th>출발지</th>
                  <th>목적지</th>
                  <th>차량</th>
                  <th>이름</th>
                  <th>전화번호</th>
                  <th>기사</th>
                  <th>상태</th>
                  <th>수정</th>
                </tr>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <tr>
                    <td colSpan={11}>로딩 중...</td>
                  </tr>
                ) : filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={11}>예약이 없습니다.</td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{reservation.id}</td>
                      <td>{formatDate(reservation.reserved_date)}</td>
                      <td>{reservation.pickup_time}</td>
                      <td>{reservation.pickup_location}</td>
                      <td>{reservation.dropoff_location}</td>
                      <td
                        onClick={() => openVehicleModal(reservation)}
                        className="clickable"
                      >
                        {reservation.car_name} -{" "}
                        {reservation.registration_number}
                      </td>
                      <td
                      // onClick={() => openReservationDetailModal(reservation)}
                      // className="clickable"
                      >
                        {reservation.name}
                      </td>
                      <td>{formatPhoneNumber(reservation.phone)}</td>
                      <td
                        onClick={() => openDriverModal(reservation)}
                        className="clickable"
                      >
                        {reservation.driver || "미배정"}
                      </td>
                      <td
                        onClick={() => openStatusModal(reservation)}
                        className="clickable status"
                      >
                        <StatusBadge
                          $color={
                            STATUS_LABELS[getStatusFilter(activeTab)]?.color
                          }
                        >
                          {STATUS_LABELS[getStatusFilter(activeTab)]?.label}
                        </StatusBadge>
                      </td>
                      <td>
                        <Icon
                          src={IcEdit}
                          onClick={() =>
                            openReservationDetailModal(reservation)
                          }
                        />
                        {/* <EditButton
                          
                        >
                          수정
                        </EditButton> */}
                      </td>
                    </tr>
                  ))
                )}
              </TableBody>
            </ReservationTable>
          </TableSection>
        </ContentWrapper>
      </Section>

      {/* Status Change Modal */}
      {statusModalOpen && (
        <StatusChangeModal
          isOpen={statusModalOpen}
          setIsOpen={setStatusModalOpen}
          reservation={selectedReservation}
          status={getStatusFilter(activeTab)}
          onCancel={closeStatusModal}
          onSave={handleStatusChange}
        />
      )}

      {/* Vehicle Change Modal */}
      {vehicleModalOpen && (
        <VehicleChangeModal
          isOpen={vehicleModalOpen}
          setIsOpen={setVehicleModalOpen}
          reservation={selectedReservation}
          onCancel={closeVehicleModal}
          onSave={handleVehicleChange}
        />
      )}

      {/* Driver Change Modal */}
      {driverModalOpen && (
        <DriverChangeModal
          isOpen={driverModalOpen}
          setIsOpen={setDriverModalOpen}
          reservation={selectedReservation}
          onCancel={closeDriverModal}
          onSave={handleDriverChange}
        />
      )}

      {/* Reservation Detail Modal */}
      {reservationDetailModalOpen && selectedReservation && (
        <ReservationDetailModal
          isOpen={reservationDetailModalOpen}
          setIsOpen={setReservationDetailModalOpen}
          reservationId={selectedReservation.id.toString()}
          onSuccess={handleReservationDetailSuccess}
          formatPhoneNumber={formatPhoneNumber}
        />
      )}
    </Container>
  );
};

// Helper function to format date for display
function formatDate(dateString: string | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Styled Components
const StatusBadge = styled.span<{ $color?: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => props.$color || "gray"};
  color: white;
`;

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
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e9ecef;
`;

const Tab = styled.div<{ $isActive?: boolean }>`
  padding: 16px 24px;
  font-size: 16px;
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  color: ${(props) => (props.$isActive ? "#3E4730" : "#adb5bd")};
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) => (props.$isActive ? "#3E4730" : "transparent")};
  margin-bottom: -2px;
  text-align: center;
  min-width: 120px;
`;

const TableSection = styled.div`
  padding: 20px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  div {
    font-size: 18px;
    font-weight: 600;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  padding-right: 40px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #adb5bd;
`;

const ReservationTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 8px;
    text-align: center;
    border-bottom: 1px solid #e9ecef;
    word-break: keep-all;
    white-space: pre-wrap;
  }

  th {
    font-weight: 600;
    color: #495057;
    background-color: #f8f9fa;
  }

  td.clickable {
    cursor: pointer;
    color: #3e4730;
    text-decoration: underline;

    &:hover {
      color: #2b331f;
    }
  }
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableBody = styled.tbody`
  tr:hover {
    background-color: #f8f9fa;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #3e4730;

  &:hover {
    color: #2b331f;
  }
`;

const Icon = styled.img``;

export default AdminReservationPage;

import React, { useState, useEffect, useRef } from "react";
import IcChevronRight from "@/src/assets/ic-chevron-right.svg";
import IcChevronLeft from "@/src/assets/ic-chevron-right.svg";
import styled from "styled-components";
import AdminSideBar from "@/src/components/AdminSideBar";
import {
  useGetApiReservationsAvailable,
  usePatchApiReservationsAvailable,
} from "@/src/api/endpoints/reservations/reservations";
import {
  useGetApiSettings,
  usePostApiSettings,
} from "@/src/api/endpoints/settings/settings";
import {
  useGetApiCars,
  usePatchApiCarsId,
} from "@/src/api/endpoints/cars/cars";
import { imgView } from "@/src/utils/upload";
import { toast } from "react-toastify";

const AdminCalendarPage: React.FC = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 캘린더 표시를 위한 상태
  const [displayMonth, setDisplayMonth] = useState(today);
  const [displayDates, setDisplayDates] = useState<Date[]>([]);

  // 실제 선택된 날짜 상태
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // open_date 설정 상태
  const [openDate, setOpenDate] = useState<number>(0);
  const [isEditingOpenDate, setIsEditingOpenDate] = useState<boolean>(false);
  const [tempOpenDate, setTempOpenDate] = useState<number>(0);

  // 차량 순서 관리를 위한 상태
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [carsList, setCarsList] = useState<any[]>([]);
  const [editingCarOrder, setEditingCarOrder] = useState<{
    [key: string]: number;
  }>({});
  const [originalCarOrder, setOriginalCarOrder] = useState<{
    [key: string]: number;
  }>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const ScrollContainer2Ref = useRef<HTMLDivElement>(null);

  // 드래그 스크롤을 위한 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Settings API 호출
  const { data: settingsData, refetch: refetchSettings } = useGetApiSettings();
  const updateSettingsMutation = usePostApiSettings();

  // 전체 차량 목록 불러오기
  const { data: allCarsData, refetch: refetchAllCars } = useGetApiCars();

  // 차량 정보 수정 API
  const updateCarMutation = usePatchApiCarsId();

  // 차량 목록 데이터
  const { data: cars, refetch } = useGetApiReservationsAvailable(
    {
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth() + 1,
      day: selectedDate.getDate(),
    },
    {
      query: {
        enabled: !!selectedDate,
      },
    }
  );

  // 차량 가용 상태 변경 API
  const updateAvailabilityMutation = usePatchApiReservationsAvailable({
    mutation: {
      onSuccess: () => {
        toast("차량 상태가 변경되었습니다.");
        refetch();
      },
      onError: (error) => {
        toast("차량 상태 변경에 실패했습니다.");
        console.error("Error updating car availability:", error);
      },
    },
  });

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Settings 데이터 로드시 open_date 설정 및 차량 목록 설정
  useEffect(() => {
    if ((settingsData as any)?.result?.open_date !== undefined) {
      setOpenDate((settingsData as any).result.open_date);
      setTempOpenDate((settingsData as any).result.open_date);
    }
  }, [settingsData]);

  // 전체 차량 목록 로드 시 차량 순서 정보 설정
  useEffect(() => {
    if (allCarsData?.result) {
      // 순서대로 정렬하여 저장
      const sortedCars = [...allCarsData.result].sort(
        (a, b) =>
          (a.order || Number.MAX_SAFE_INTEGER) -
          (b.order || Number.MAX_SAFE_INTEGER)
      );

      setCarsList(sortedCars);

      // 현재 순서를 객체로 저장 {id: order}
      const orderMap = {};
      sortedCars.forEach((car) => {
        orderMap[car.id] = car.order || 0;
      });

      setEditingCarOrder(orderMap);
      setOriginalCarOrder(orderMap);
    }
  }, [allCarsData]);

  const generateDates = (baseDate: Date) => {
    const dates: Date[] = [];
    const startDate = new Date(baseDate);
    startDate.setDate(startDate.getDate());

    for (let i = 0; i < 31; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // 초기 날짜 및 월 변경시 날짜 생성
  useEffect(() => {
    setDisplayDates(generateDates(displayMonth));
  }, [displayMonth]);

  // 드래그 스크롤 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (ScrollContainer2Ref.current) {
      setStartX(e.pageX - ScrollContainer2Ref.current.offsetLeft);
      setScrollLeft(ScrollContainer2Ref.current.scrollLeft);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    if (ScrollContainer2Ref.current) {
      const x = e.pageX - ScrollContainer2Ref.current.offsetLeft;
      const walk = (x - startX) * 2;
      ScrollContainer2Ref.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);

    // 선택된 날짜가 현재 표시 월의 범위를 벗어나면 표시 월 업데이트
    if (date.getMonth() !== displayMonth.getMonth()) {
      const newDisplayDate = new Date(date);
      newDisplayDate.setDate(1);
      setDisplayMonth(newDisplayDate);

      // 스크롤 초기화
      if (ScrollContainer2Ref.current) {
        ScrollContainer2Ref.current.scrollLeft = 0;
      }
    }
  };

  const handlePrevMonth = () => {
    const newDate = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() - 1,
      1
    );
    setDisplayMonth(newDate);

    // 스크롤 초기화
    if (ScrollContainer2Ref.current) {
      ScrollContainer2Ref.current.scrollLeft = 0;
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() + 1,
      1
    );
    setDisplayMonth(newDate);

    // 스크롤 초기화
    if (ScrollContainer2Ref.current) {
      ScrollContainer2Ref.current.scrollLeft = 0;
    }
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekDay = weekDays[date.getDay()];

    return `${year}-${month}-${day}(${weekDay})`;
  };

  const handleStatusChange = (
    carId: any,
    status: "AVAILABLE" | "UNAVAILABLE"
  ) => {
    updateAvailabilityMutation.mutate({
      data: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
        car_id: carId,
        status: status,
      },
    });
  };

  // open_date 변경 저장 핸들러
  const handleSaveOpenDate = () => {
    updateSettingsMutation.mutate(
      { data: { open_date: tempOpenDate } },
      {
        onSuccess: () => {
          toast("예약 가능 일수가 변경되었습니다.");
          setOpenDate(tempOpenDate);
          setIsEditingOpenDate(false);
          refetchSettings();
        },
        onError: (error) => {
          toast("설정 변경에 실패했습니다.");
          console.error("Error updating settings:", error);
        },
      }
    );
  };

  // 차량 순서 관리 모달 열기
  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  // 차량 순서 변경 핸들러
  const handleOrderChange = (carId: string, newOrder: number) => {
    setEditingCarOrder((prev) => ({
      ...prev,
      [carId]: newOrder,
    }));
  };

  // 차량 순서 위로 이동
  const moveCarUp = (index: number) => {
    if (index <= 0) return;

    const updatedCars = [...carsList];
    const currentCar = updatedCars[index];
    const previousCar = updatedCars[index - 1];

    // 차량 위치 교환
    updatedCars[index - 1] = currentCar;
    updatedCars[index] = previousCar;

    setCarsList(updatedCars);

    // order 값도 업데이트
    setEditingCarOrder((prev) => {
      return {
        ...prev,
        [currentCar.id]: prev[previousCar.id],
        [previousCar.id]: prev[currentCar.id],
      };
    });
  };

  // 차량 순서 아래로 이동
  const moveCarDown = (index: number) => {
    if (index >= carsList.length - 1) return;

    const updatedCars = [...carsList];
    const currentCar = updatedCars[index];
    const nextCar = updatedCars[index + 1];

    // 차량 위치 교환
    updatedCars[index + 1] = currentCar;
    updatedCars[index] = nextCar;

    setCarsList(updatedCars);

    // order 값도 업데이트
    setEditingCarOrder((prev) => {
      return {
        ...prev,
        [currentCar.id]: prev[nextCar.id],
        [nextCar.id]: prev[currentCar.id],
      };
    });
  };

  // 변경된 차량만 찾는 함수
  const getChangedCars = () => {
    return carsList.filter(
      (car) => editingCarOrder[car.id] !== originalCarOrder[car.id]
    );
  };

  // 순서 변경 저장
  const saveCarOrders = async () => {
    // 변경된 차량만 필터링
    const changedCars = getChangedCars();

    // 변경사항이 없으면 모달만 닫고 반환
    if (changedCars.length === 0) {
      setIsOrderModalOpen(false);
      return;
    }

    // 저장 중 상태 표시
    setIsSaving(true);

    try {
      // 변경된 차량만 순차적으로 업데이트
      for (const car of changedCars) {
        await updateCarMutation.mutateAsync({
          id: car.id.toString(),
          data: {
            order: editingCarOrder[car.id],
            name: car.name,
            status: car.status,
          },
        });
      }

      // 모든 작업 성공
      toast("차량 순서가 업데이트되었습니다.");
      setOriginalCarOrder({ ...editingCarOrder });
      refetchAllCars();
      refetch();
    } catch (error) {
      toast("차량 순서 업데이트 중 오류가 발생했습니다.");
      console.error("Error updating car orders:", error);
    } finally {
      setIsSaving(false);
      setIsOrderModalOpen(false);
    }
  };

  // 순서 변경 취소
  const cancelOrderEdit = () => {
    // 원래 순서로 복원
    setEditingCarOrder({ ...originalCarOrder });

    // 원래 순서대로 차량 목록 정렬
    const sortedCars = [...carsList].sort(
      (a, b) => (originalCarOrder[a.id] || 0) - (originalCarOrder[b.id] || 0)
    );
    setCarsList(sortedCars);

    setIsOrderModalOpen(false);
  };

  // 날짜가 예약 가능한지 확인
  const isDateSelectable = (date: Date): boolean => {
    const limitDate = new Date(today);
    limitDate.setDate(today.getDate() + openDate);
    return date >= limitDate;
  };

  return (
    <Container>
      {sidebarVisible && <AdminSideBar />}
      <Section>
        <TopBar>
          {/* <MenuToggle onClick={toggleSidebar}>
            {sidebarVisible ? "◀" : "▶"}
          </MenuToggle> */}
          <SectionTitle>차량 일정 관리</SectionTitle>
        </TopBar>

        {/* Open Date 설정 섹션 */}
        <OpenDateSettingSection>
          <OpenDateTitle>예약 오픈 설정</OpenDateTitle>
          {isEditingOpenDate ? (
            <OpenDateEditContainer>
              <OpenDateInput
                type="number"
                min="0"
                value={tempOpenDate}
                onChange={(e) => setTempOpenDate(parseInt(e.target.value) || 0)}
              />
              <OpenDateText>일 이후부터 예약 가능</OpenDateText>
              <SaveButton onClick={handleSaveOpenDate}>저장</SaveButton>
              <CancelButton
                onClick={() => {
                  setTempOpenDate(openDate);
                  setIsEditingOpenDate(false);
                }}
              >
                취소
              </CancelButton>
            </OpenDateEditContainer>
          ) : (
            <OpenDateContainer>
              <OpenDateValue>{openDate}</OpenDateValue>
              <OpenDateText>일 이후부터 예약 가능</OpenDateText>
              <EditButton onClick={() => setIsEditingOpenDate(true)}>
                수정
              </EditButton>
            </OpenDateContainer>
          )}
        </OpenDateSettingSection>

        {/* 차량 순서 관리 버튼 */}
        <OrderManagementButton onClick={openOrderModal}>
          차량 표시 순서 관리
        </OrderManagementButton>

        <CalendarContainer>
          <CalendarBlock>
            <CalendarHeader>
              <NavButton onClick={handlePrevMonth}>
                <RotatedImage src={IcChevronLeft} alt="Previous" />
              </NavButton>
              <MonthTitle>
                {displayMonth.getFullYear()}{" "}
                {String(displayMonth.getMonth() + 1).padStart(2, "0")}
              </MonthTitle>
              <NavButton onClick={handleNextMonth}>
                <img src={IcChevronRight} alt="Next" />
              </NavButton>
            </CalendarHeader>

            <ScrollContainer2
              ref={ScrollContainer2Ref}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
            >
              <DaysContainer>
                {displayDates.map((date) => {
                  const dateSelectable = isDateSelectable(date);
                  return (
                    <DayColumn key={date.toISOString()}>
                      <Weekday>{weekDays[date.getDay()]}</Weekday>
                      <DateCircle
                        $isSelected={
                          selectedDate.toDateString() === date.toDateString()
                        }
                        $isSelectable={dateSelectable}
                        $isPastOpenDate={!dateSelectable}
                        onClick={() => dateSelectable && handleDateClick(date)}
                      >
                        {date.getDate()}
                      </DateCircle>
                    </DayColumn>
                  );
                })}
              </DaysContainer>
            </ScrollContainer2>

            <DateBlock>{formatDate(selectedDate)}</DateBlock>

            <CarList>
              {!isDateSelectable(selectedDate) && (
                <InfoState>
                  해당 날짜는 현재 예약 오픈 전입니다. ({openDate}일 이후부터
                  예약 가능)
                </InfoState>
              )}
              {isDateSelectable(selectedDate) && cars?.result?.length === 0 && (
                <EmptyState>해당 날짜에 등록된 차량이 없습니다.</EmptyState>
              )}
              {isDateSelectable(selectedDate) &&
                cars?.result?.map((car) => (
                  <CarItem key={car.id}>
                    <CarImage src={imgView(car.image)} alt={car.name} />
                    <CarInfo>
                      <CarTitle>{car.name}</CarTitle>
                      <CarSeats>
                        {car.seat_capacity} Seats &#40;최대 {car.seats || 0}
                        인&#41;
                      </CarSeats>
                    </CarInfo>
                    <StatusSelectContainer>
                      <StatusSelect
                        value={car.is_available ? "AVAILABLE" : "UNAVAILABLE"}
                        onChange={(e) =>
                          handleStatusChange(
                            String(car.id),
                            e.target.value as "AVAILABLE" | "UNAVAILABLE"
                          )
                        }
                        $status={car.is_available ? "AVAILABLE" : "UNAVAILABLE"}
                      >
                        <option value="AVAILABLE">예약 가능</option>
                        <option value="UNAVAILABLE">예약 불가</option>
                      </StatusSelect>
                    </StatusSelectContainer>
                  </CarItem>
                ))}
            </CarList>
          </CalendarBlock>
        </CalendarContainer>
      </Section>

      {/* 차량 순서 관리 모달 */}
      {isOrderModalOpen && (
        <ModalOverlay>
          <OrderModal>
            <ModalHeader>
              <ModalTitle>차량 표시 순서 관리</ModalTitle>
              <CloseButton onClick={cancelOrderEdit}>×</CloseButton>
            </ModalHeader>
            <OrderDescription>
              차량이 고객에게 표시되는 순서를 관리합니다. 위로/아래로 버튼을
              사용하여 순서를 조정하세요.
            </OrderDescription>
            <CarOrderList>
              {carsList.map((car, index) => (
                <CarOrderItem
                  key={car.id}
                  $isChanged={
                    editingCarOrder[car.id] !== originalCarOrder[car.id]
                  }
                >
                  <CarOrderInfo>
                    <OrderNumber>
                      {editingCarOrder[car.id] > 0
                        ? editingCarOrder[car.id]
                        : "미설정"}
                    </OrderNumber>
                    <CarInfoBlock>
                      <OrderCarImage src={imgView(car.image)} alt={car.name} />
                      <OrderCarName>{car.name}</OrderCarName>
                    </CarInfoBlock>
                  </CarOrderInfo>
                  <OrderButtons>
                    <MoveButton
                      disabled={index === 0}
                      onClick={() => moveCarUp(index)}
                    >
                      ↑
                    </MoveButton>
                    <MoveButton
                      disabled={index === carsList.length - 1}
                      onClick={() => moveCarDown(index)}
                    >
                      ↓
                    </MoveButton>
                    <OrderInput
                      type="number"
                      min="0"
                      value={editingCarOrder[car.id] || 0}
                      onChange={(e) =>
                        handleOrderChange(car.id, Number(e.target.value))
                      }
                      placeholder="순서"
                    />
                  </OrderButtons>
                </CarOrderItem>
              ))}
            </CarOrderList>
            <ChangeSummary>
              {getChangedCars().length > 0 ? (
                <ChangedCount>
                  변경된 항목: {getChangedCars().length}개
                </ChangedCount>
              ) : (
                <NoChangesText>변경된 항목이 없습니다</NoChangesText>
              )}
            </ChangeSummary>
            <ModalFooter>
              <CancelButton onClick={cancelOrderEdit} disabled={isSaving}>
                취소
              </CancelButton>
              <SaveButton
                onClick={saveCarOrders}
                disabled={isSaving || getChangedCars().length === 0}
              >
                {isSaving ? "저장 중..." : "저장"}
              </SaveButton>
            </ModalFooter>
          </OrderModal>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fff;
  position: relative;
  display: flex;
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

// Open Date 설정 스타일
const OpenDateSettingSection = styled.div`
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const OpenDateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #3e4730;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const OpenDateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const OpenDateEditContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const OpenDateValue = styled.span`
  font-size: 22px;
  font-weight: 600;
  color: #3e4730;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const OpenDateText = styled.span`
  font-size: 16px;
  color: #666;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const OpenDateInput = styled.input`
  width: 60px;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 120px;
  }
`;

// 차량 순서 관리 버튼
const OrderManagementButton = styled.button`
  align-self: flex-start;
  margin-bottom: 24px;
  padding: 10px 16px;
  background-color: #3e4730;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #2d3422;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const EditButton = styled.button`
  padding: 6px 12px;
  background-color: #f3f4f6;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #e5e7eb;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SaveButton = styled.button<{ disabled?: boolean }>`
  padding: 6px 12px;
  background-color: ${(props) => (props.disabled ? "#a0a0a0" : "#3e4730")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#a0a0a0" : "#2d3422")};
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CancelButton = styled.button<{ disabled?: boolean }>`
  padding: 6px 12px;
  background-color: #f3f4f6;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 14px;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#f3f4f6" : "#e5e7eb")};
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CalendarContainer = styled.div`
  width: 100%;
  padding-bottom: 100px;
  max-width: 800px;

  @media (max-width: 768px) {
    padding-bottom: 40px;
  }
`;

const CalendarBlock = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.05);
  max-width: 1200px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 16px;
  gap: 8px;
`;

const MonthTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const NavButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
`;

const RotatedImage = styled.img`
  transform: rotate(180deg);
`;

const ScrollContainer2 = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DaysContainer = styled.div`
  display: flex;
`;

const DayColumn = styled.div`
  flex: 0 0 56px;
  text-align: center;

  @media (max-width: 768px) {
    flex: 0 0 45px;
  }
`;

const Weekday = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const DateCircle = styled.div<{
  $isSelected?: boolean;
  $isSelectable?: boolean;
  $isPastOpenDate?: boolean;
}>`
  width: 32px;
  height: 32px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: ${(props) => (props.$isSelectable ? "pointer" : "not-allowed")};
  background-color: ${(props) =>
    props.$isSelected ? "#3e4730" : "transparent"};
  color: ${(props) => {
    if (props.$isPastOpenDate) return "#aaa";
    if (props.$isSelected) return "white";
    return "inherit";
  }};
  opacity: ${(props) => (props.$isPastOpenDate ? 0.6 : 1)};

  &:hover {
    background-color: ${(props) => {
      if (!props.$isSelectable) return "transparent";
      return props.$isSelected ? "#3e4730" : "#f3f4f6";
    }};
  }
  transition: 0.2s all ease-in;

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
`;

const DateBlock = styled.div`
  width: 100%;
  padding: 16px 12px;
  background: #3e4730;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 13px;
  }
`;

const CarList = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    margin-top: 24px;
    gap: 12px;
  }
`;

const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 20px 15px;
    font-size: 14px;
  }
`;

const InfoState = styled.div`
  padding: 32px;
  text-align: center;
  color: #666;
  background: #fff0f0;
  border-radius: 8px;
  border: 1px dashed #ffcccc;

  @media (max-width: 768px) {
    padding: 20px 15px;
    font-size: 14px;
  }
`;

const CarItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 12px;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const CarImage = styled.img`
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;

  @media (max-width: 768px) {
    width: 100%;
    height: 140px;
  }
`;

const CarInfo = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CarTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 4px;
`;

const CarSeats = styled.p`
  font-size: 14px;
  color: #666;
`;

const StatusSelectContainer = styled.div`
  min-width: 120px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StatusSelect = styled.select<{ $status: "AVAILABLE" | "UNAVAILABLE" }>`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: ${(props) =>
    props.$status === "AVAILABLE" ? "#edf7ee" : "#fff0f0"};
  color: ${(props) => (props.$status === "AVAILABLE" ? "#2b8a3e" : "#e03131")};
  cursor: pointer;
  font-weight: 500;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }
`;

// 차량 순서 관리 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const OrderModal = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 95%;
    max-height: 80vh;
    border-radius: 12px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #3e4730;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }
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

const OrderDescription = styled.p`
  padding: 16px 24px;
  margin: 0;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #eee;

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 13px;
  }
`;

const CarOrderList = styled.div`
  overflow-y: auto;
  padding: 16px 24px;
  max-height: 50vh;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 12px 20px;
    max-height: 40vh;
    gap: 12px;
  }
`;

const CarOrderItem = styled.div<{ $isChanged?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid ${(props) => (props.$isChanged ? "#4caf50" : "#eee")};
  border-radius: 8px;
  background: ${(props) => (props.$isChanged ? "#f0fff1" : "#f9f9f9")};
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding: 10px 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const CarOrderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const OrderNumber = styled.div`
  width: 32px;
  height: 32px;
  background: #3e4730;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
`;

const CarInfoBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    width: calc(100% - 40px);
  }
`;

const OrderCarImage = styled.img`
  width: 50px;
  height: 35px;
  object-fit: cover;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 45px;
    height: 30px;
  }
`;

const OrderCarName = styled.span`
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 14px;
    max-width: calc(100% - 60px);
  }
`;

const OrderButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const MoveButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.disabled ? "#f3f3f3" : "#edf7ee")};
  color: ${(props) => (props.disabled ? "#bbb" : "#2b8a3e")};
  border: 1px solid ${(props) => (props.disabled ? "#e5e5e5" : "#d7ead8")};
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 16px;

  &:hover:not(:disabled) {
    background: #d7ead8;
  }

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
`;

const OrderInput = styled.input`
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }

  @media (max-width: 768px) {
    width: 50px;
  }
`;

const ChangeSummary = styled.div`
  padding: 12px 24px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eee;

  @media (max-width: 768px) {
    padding: 10px 20px;
  }
`;

const ChangedCount = styled.span`
  font-size: 14px;
  color: #2b8a3e;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const NoChangesText = styled.span`
  font-size: 14px;
  color: #666;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #eee;

  @media (max-width: 768px) {
    padding: 12px 20px;
    flex-direction: column-reverse;
  }
`;

export default AdminCalendarPage;

import React, { useState, useEffect, useRef } from "react";
import IcChevronRight from "@/src/assets/ic-chevron-right.svg";
import IcChevronLeft from "@/src/assets/ic-chevron-right.svg";
import styled from "styled-components";
import AdminSideBar from "@/src/components/AdminSideBar";
import {
  useGetApiReservationsAvailable,
  usePatchApiReservationsAvailable,
} from "@/src/api/endpoints/reservations/reservations";
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

  const ScrollContainer2Ref = useRef<HTMLDivElement>(null);

  // 드래그 스크롤을 위한 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
    carId: string,
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

  return (
    <Container>
      <AdminSideBar />
      <Section>
        <SectionTitle>차량 일정 관리</SectionTitle>
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
                {displayDates.map((date) => (
                  <DayColumn key={date.toISOString()}>
                    <Weekday>{weekDays[date.getDay()]}</Weekday>
                    <DateCircle
                      $isSelected={
                        selectedDate.toDateString() === date.toDateString()
                      }
                      $isSelectable={true}
                      onClick={() => handleDateClick(date)}
                    >
                      {date.getDate()}
                    </DateCircle>
                  </DayColumn>
                ))}
              </DaysContainer>
            </ScrollContainer2>

            <DateBlock>{formatDate(selectedDate)}</DateBlock>

            <CarList>
              {cars?.result?.length === 0 && (
                <EmptyState>해당 날짜에 등록된 차량이 없습니다.</EmptyState>
              )}
              {cars?.result?.map((car) => (
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

const CalendarContainer = styled.div`
  width: 100%;
  padding-bottom: 100px;
  max-width: 800px;
`;

const CalendarBlock = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.05);
  max-width: 1200px;
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
`;

const Weekday = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
`;

const DateCircle = styled.div<{
  $isSelected?: boolean;
  $isSelectable?: boolean;
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
  color: ${(props) => (props.$isSelected ? "white" : "inherit")};

  &:hover {
    background-color: ${(props) => (props.$isSelected ? "#3e4730" : "#f3f4f6")};
  }
  transition: 0.2s all ease-in;
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
`;

const CarList = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
`;

const CarItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 12px;
  gap: 16px;
`;

const CarImage = styled.img`
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
`;

const CarInfo = styled.div`
  flex: 1;
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

export default AdminCalendarPage;

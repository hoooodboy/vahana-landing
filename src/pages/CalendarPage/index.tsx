import React, { useState, useEffect, useRef } from "react";
import IcChevronRight from "@/src/assets/ic-chevron-right.svg";
import IcChevronLeft from "@/src/assets/ic-chevron-right.svg";
import styled from "styled-components";
import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import { useGetApiCars, useGetApiCarsId } from "@/src/api/endpoints/cars/cars";
import { imgView } from "@/src/utils/upload";
import { useNavigate } from "react-router-dom";
import tokens from "@/src/tokens";
import { toast } from "react-toastify";
import { useGetApiReservationsAvailable } from "@/src/api/endpoints/reservations/reservations";
import { useGetApiSettings } from "@/src/api/endpoints/settings/settings";

interface CarOption {
  name: string;
  seats: string;
  image: string;
  available: boolean;
}

const CalendarPage: React.FC = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const navigate = useNavigate();

  // 캘린더 표시를 위한 상태
  const [displayMonth, setDisplayMonth] = useState(today);
  const [displayDates, setDisplayDates] = useState<Date[]>([]);

  // 실제 선택된 날짜 상태
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // open_date 상태 관리
  const [openDate, setOpenDate] = useState<number>(0);
  const [openDateLimit, setOpenDateLimit] = useState<Date>(today);

  const ScrollContainer2Ref = useRef<HTMLDivElement>(null);

  // 드래그 스크롤을 위한 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { accessToken } = tokens;
  const isLoggedIn = !!accessToken;

  // Settings API 호출
  const { data: settingsData }: any = useGetApiSettings();

  // 차량 목록 데이터
  const { data: cars } = useGetApiReservationsAvailable(
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

  // Settings 데이터 로드시 open_date 설정 및 최소 예약 가능 날짜 계산
  useEffect(() => {
    if (settingsData?.result?.open_date !== undefined) {
      const openDaysCount = settingsData.result.open_date;
      setOpenDate(openDaysCount);

      // open_date 기반 최소 예약 가능 날짜 계산
      const limitDate = new Date(today);
      limitDate.setDate(today.getDate() + openDaysCount);
      setOpenDateLimit(limitDate);

      // 현재 선택된 날짜가 open_date 제한보다 빠르면 선택 날짜 업데이트
      if (selectedDate < limitDate) {
        setSelectedDate(limitDate);
      }
    }
  }, [settingsData]);

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
    if (isDateSelectable(date)) {
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
    } else if (date < openDateLimit && date >= today) {
      // open_date 제한으로 선택할 수 없는 날짜 클릭 시 알림
      toast(`예약은 ${openDate}일 이후부터 가능합니다.`);
    }
  };

  const handlePrevMonth = () => {
    const newDate = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() - 1,
      1
    );
    if (
      newDate.getMonth() >= today.getMonth() &&
      newDate.getFullYear() >= today.getFullYear()
    ) {
      setDisplayMonth(newDate);

      // 스크롤 초기화
      if (ScrollContainer2Ref.current) {
        ScrollContainer2Ref.current.scrollLeft = 0;
      }
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

  const handleCarSelect = (car) => {
    if (car.is_available) {
      navigate("/reservation/first", {
        state: {
          selectedCar: {
            id: car.id,
            name: car.name,
            seatCapacity: car.seat_capacity,
            maxSeats: car.seats,
            image: car.image,
          },
          selectedDate: selectedDate,
        },
      });
    }
  };

  // 날짜가 예약 가능한지 확인 (open_date 고려)
  const isDateSelectable = (date: Date): boolean => {
    return date.getTime() >= openDateLimit.getTime();
  };

  // 날짜가 오늘 이후지만 open_date 이전인지 확인
  const isWithinOpenDateLimit = (date: Date): boolean => {
    return (
      date.getTime() >= today.getTime() &&
      date.getTime() < openDateLimit.getTime()
    );
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          VEHICLE
          <br />
          SCHEDULE
        </Title>
        차량 예약
      </TitleContainer>

      {/* Open Date 안내 메시지 */}
      {openDate > 0 && (
        <OpenDateInfoBox>
          <InfoIcon>i</InfoIcon>
          <InfoText>예약은 {openDate}일 이후 날짜부터 가능합니다.</InfoText>
        </OpenDateInfoBox>
      )}

      <CalendarContainer>
        <CalendarBlock>
          <CalendarHeader>
            <NavButton
              onClick={handlePrevMonth}
              disabled={
                displayMonth.getMonth() === today.getMonth() &&
                displayMonth.getFullYear() === today.getFullYear()
              }
            >
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
                    $isSelectable={isDateSelectable(date)}
                    $isOpenDatePending={isWithinOpenDateLimit(date)}
                    onClick={() => handleDateClick(date)}
                  >
                    {date.getDate()}
                  </DateCircle>
                </DayColumn>
              ))}
            </DaysContainer>
          </ScrollContainer2>

          <DateBlock>{formatDate(selectedDate)}</DateBlock>

          {!isDateSelectable(selectedDate) && (
            <UnavailableMessage>
              선택하신 날짜는 예약 불가능합니다. {openDate}일 이후 날짜를
              선택해주세요.
            </UnavailableMessage>
          )}

          <CarList>
            {isDateSelectable(selectedDate) ? (
              cars?.result?.length > 0 ? (
                cars.result.map((car, index) => (
                  <CarItem
                    key={index}
                    onClick={() =>
                      isLoggedIn
                        ? handleCarSelect(car)
                        : toast("로그인 후 이용할 수 있습니다.")
                    }
                  >
                    <CarImage src={imgView(car.image)} alt={car.name} />
                    <CarInfo>
                      <CarTitle>{car.name}</CarTitle>
                      <CarSeats>
                        {car.seat_capacity} Seats &#40;최대 {car.seats || 0}
                        인&#41;
                      </CarSeats>
                    </CarInfo>
                    <Button $disabled={!car.is_available}>
                      {car.is_available ? "1 Ticket" : "마감"}
                    </Button>
                  </CarItem>
                ))
              ) : (
                <EmptyState>
                  해당 날짜에 예약 가능한 차량이 없습니다.
                </EmptyState>
              )
            ) : (
              <EmptyState>
                {openDate}일 이후 날짜를 선택하면 예약 가능한 차량이 표시됩니다.
              </EmptyState>
            )}
          </CarList>
        </CalendarBlock>
      </CalendarContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  padding-top: 56px;
  min-height: 100vh;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 46px 16px 24px;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
`;

// Open Date 안내 메시지 스타일
const OpenDateInfoBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 16px 24px;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #76865f;
`;

const InfoIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #76865f;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  font-size: 12px;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
`;

const CalendarContainer = styled.div`
  width: 100%;
  padding: 16px;
  padding-bottom: 200px;
`;

const CalendarBlock = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  background: white;
  border-radius: 28px;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.1);
  padding-bottom: 64px;
  margin-bottom: 150px;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 16px;
  gap: 4px;
`;

const MonthTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  padding: 8px;
  background: none;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover {
    background: ${(props) => (props.disabled ? "none" : "rgba(0, 0, 0, 0.05)")};
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

const DayColumn = styled.div<{ $isSelected?: boolean }>`
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
  $isOpenDatePending?: boolean;
}>`
  width: 32px;
  height: 32px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: ${(props) => (props.$isSelectable ? "pointer" : "not-allowed")};
  background-color: ${(props) => {
    if (props.$isSelected) return "#76865F";
    if (props.$isOpenDatePending) return "#f3f4f6";
    return "transparent";
  }};
  color: ${(props) => {
    if (!props.$isSelectable && !props.$isOpenDatePending) return "#ccc";
    if (props.$isOpenDatePending) return "#999";
    if (props.$isSelected) return "white";
    return "inherit";
  }};
  /* border: ${(props) =>
    props.$isOpenDatePending ? "1px dashed #999" : "none"}; */

  &:hover {
    background-color: ${(props) => {
      if (!props.$isSelectable)
        return props.$isOpenDatePending ? "#f3f4f6" : "transparent";
      return props.$isSelected ? "#76865F" : "#f3f4f6";
    }};
  }
  transition: 0.2s all ease-in;
`;

const DateBlock = styled.div`
  width: 100%;
  padding: 16px 12px;
  background: #76865f;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AvailabilityBadge = styled.span<{ $isUnavailable?: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) =>
    props.$isUnavailable ? "#C6C6C6" : "#EAF2DC"};
  color: ${(props) => (props.$isUnavailable ? "#666" : "#3E4730")};
`;

const UnavailableMessage = styled.div`
  margin-top: 16px;
  padding: 12px;
  text-align: center;
  background-color: #ffeeee;
  border-radius: 8px;
  color: #e03131;
  font-size: 14px;
`;

const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 16px;
`;

const CarList = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
`;

const CarItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #666;
  cursor: pointer;
  &:last-child {
    border: none;
  }
`;

const CarImage = styled.img`
  width: 92px;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;
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

const Button = styled.button<{ $disabled?: boolean }>`
  width: 68px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  background-color: ${(props) => (props.$disabled ? "#C6C6C6" : "#3E4730")};
  color: #fff;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  border: none;
  outline: none;
  text-align: center;
  font-size: 10px;
  font-weight: 500;
`;

export default CalendarPage;

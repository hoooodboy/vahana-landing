import React, { useState, useEffect } from "react";
import IcChevronRight from "@/src/assets/ic-chevron-right.svg";
import IcChevronLeft from "@/src/assets/ic-chevron-right.svg";
import styled from "styled-components";

import royal1 from "@/src/assets/royal-1.jpg";
import executive1 from "@/src/assets/executive-1.jpg";
import alphard1 from "@/src/assets/alphard-1.jpg";
import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";

interface CarOption {
  name: string;
  seats: string;
  image: string;
  available: boolean;
}

const CalendarPage: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [monthDates, setMonthDates] = useState<Date[]>([]);

  const carOptions: CarOption[] = [
    {
      name: "LM 500h ROYAL",
      seats: "2 Seats",
      image: royal1,
      available: false,
    },
    {
      name: "LM 500h EXECUTIVE",
      seats: "2 Seats (최대 4인)",
      image: executive1,
      available: true,
    },
    {
      name: "ALPHARD",
      seats: "2 Seats (최대 4인)",
      image: alphard1,
      available: true,
    },
  ];

  const generateDates = (baseDate: Date) => {
    const dates: Date[] = [];
    const startDate = new Date(baseDate);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // 초기 날짜 생성
  useEffect(() => {
    setMonthDates(generateDates(today));
  }, []);

  // 월 변경 시 날짜 업데이트
  useEffect(() => {
    setMonthDates(generateDates(currentMonth));
  }, [currentMonth]);

  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    setCurrentMonth(newDate);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    setCurrentMonth(newDate);
    setSelectedDate(newDate);
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekDay = weekDays[date.getDay()];

    return `${year}-${month}-${day}(${weekDay})`;
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
      <CalendarContainer>
        <CalendarBlock>
          <CalendarHeader>
            <NavButton onClick={handlePrevMonth}>
              <RotatedImage src={IcChevronLeft} alt="Previous" />
            </NavButton>
            <MonthTitle>
              {currentMonth.getFullYear()}{" "}
              {String(currentMonth.getMonth() + 1).padStart(2, "0")}
            </MonthTitle>
            <NavButton onClick={handleNextMonth}>
              <img src={IcChevronRight} alt="Next" />
            </NavButton>
          </CalendarHeader>

          <ScrollContainer>
            <DaysContainer>
              {monthDates.map((date) => (
                <DayColumn key={date.toISOString()}>
                  <Weekday>{weekDays[date.getDay()]}</Weekday>
                  <DateCircle
                    $isSelected={
                      selectedDate.toDateString() === date.toDateString()
                    }
                    onClick={() => handleDateClick(date)}
                  >
                    {date.getDate()}
                  </DateCircle>
                </DayColumn>
              ))}
            </DaysContainer>
          </ScrollContainer>
          <DateBlock>{formatDate(selectedDate)}</DateBlock>

          <CarList>
            {carOptions.map((car, index) => (
              <CarItem key={index}>
                <CarImage src={car.image} alt={car.name} />
                <CarInfo>
                  <CarTitle>{car.name}</CarTitle>
                  <CarSeats>{car.seats}</CarSeats>
                </CarInfo>
                <Button $disabled={!car.available}>
                  {car.available ? "1 Ticket" : "마감"}
                </Button>
              </CarItem>
            ))}
          </CarList>
        </CalendarBlock>
      </CalendarContainer>
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  padding-top: 56px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 46px 16px 82px;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
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

const ScrollContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
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

const DateCircle = styled.div<{ $isSelected?: boolean }>`
  width: 32px;
  height: 32px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isSelected ? "#76865F" : "transparent"};
  color: ${(props) => (props.$isSelected ? "white" : "inherit")};

  &:hover {
    background-color: ${(props) => (props.$isSelected ? "#76865F" : "#f3f4f6")};
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

  &:last-child {
    border: none;
  }
`;

const CarImage = styled.img`
  width: 96px;
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

import React from "react";
import styled from "styled-components";
import ScrollContainer from "react-indiana-drag-scroll";

const TableContainer = styled.div`
  overflow-x: auto;
`;

const StyledScrollContainer = styled(ScrollContainer)`
  padding: 16px;
`;

const Table = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.1);

  /* overflow: hidden; <- 이 부분을 제거합니다 */
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  background: #f5f5f5;
  /* border-top: 1px solid #e5e5e5; */

  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }
`;

const Td = styled.td`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid #e5e5e5;
  color: #333;
  vertical-align: middle;
`;

const CarComparisonTable = () => {
  const tableData = [
    {
      title: "인원수",
      royal: "2인 Seats (최대 2인)",
      executive: "2 Seats (최대 4인)",
      alphard: "2 Seats (최대 4인)",
      staria: "4 Seats (최대 5인)",
      sprinter: "6 Seats (최대 7인)",
    },
    {
      title: "노이즈켄슬링",
      royal: "O",
      executive: "X",
      alphard: "X",
      staria: "X",
    },
    {
      title: "파티션 글라스",
      royal: "O",
      executive: "X",
      alphard: "X",
      staria: "X",
    },
    {
      title: "이중접합유리",
      royal: "O",
      executive: "O",
      alphard: "O",
      staria: "X",
    },
    {
      title: "리어 컴포트 모드",
      royal: "O",
      executive: "O",
      alphard: "X",
      staria: "X",
    },
    {
      title: "오디오 스피커 갯수",
      royal: "28",
      executive: "23",
      alphard: "14",
      staria: "-",
    },
    {
      title: "냉장고",
      royal: "O",
      executive: "X",
      alphard: "X",
      staria: "X",
    },
    {
      title: "와이파이",
      royal: "O",
      executive: "X",
      alphard: "X",
      staria: "O",
    },
    {
      title: "모니터 크기",
      royal: '48"',
      executive: '14"',
      alphard: '14"',
      staria: '24"',
    },
    {
      title: "리클라이닝 각도",
      royal: "180º",
      executive: "165º",
      alphard: "160º",
      staria: "170º",
    },
    {
      title: "체온 추적 에어컨디셔닝",
      royal: "O",
      executive: "X",
      alphard: "X",
      staria: "X",
    },
    {
      title: "4륜",
      royal: "O",
      executive: "O",
      alphard: "½",
      staria: "X",
    },
    {
      title: "오디오",
      royal: "마크레빈슨",
      executive: "마크레빈슨",
      alphard: "JBL",
      staria: "JBL",
    },
  ];

  return (
    <TableContainer>
      <StyledScrollContainer>
        <Table>
          <thead>
            <tr>
              <Th></Th>
              <Th>
                LM 500h
                <br /> ROYAL
              </Th>
              <Th>
                LM 500h
                <br /> EXECUTIVE
              </Th>
              <Th>ALPHARD</Th>
              <Th>STARIA</Th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <Td>{row.title}</Td>
                <Td>{row.royal}</Td>
                <Td>{row.executive}</Td>
                <Td>{row.alphard}</Td>
                <Td>{row.staria}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </StyledScrollContainer>
    </TableContainer>
  );
};

export default CarComparisonTable;

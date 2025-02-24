import React, { useState } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";

export const OperationsModal = ({ isOpen, setIsOpen, user }) => {
  const [count, setCount] = useState("3");

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>전여 추천 횟수</ModalTitle>
        <Select value={count} onChange={(e) => setCount(e.target.value)}>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
          <option value="0">0</option>
        </Select>
        <ButtonGroup>
          <CancelButton onClick={() => setIsOpen(false)}>취소</CancelButton>
          <SubmitButton>적용</SubmitButton>
        </ButtonGroup>
      </ModalContent>
    </PCModal>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fffbf1;
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

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchBox = styled.div`
  position: relative;
  max-width: 400px;
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
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #eee;
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
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #3e4730;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #2e3520;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

const ModalTitle = styled.div`
  color: #000;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`;

const InviteButton = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  background: #3e4730;
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

const ModalContents = styled.div`
  color: #000;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #666;
  font-size: 14px;
  font-weight: 600;
  padding: 8px;
`;

const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid ${(props) => (props.$error ? "#ff0000" : "#c7c7c7")};
  background: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: #666;
  }
  &:disabled {
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
    border-color: ${(props) => (props.$error ? "#ff0000" : "#3e4730")};
  }
`;

const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #c7c7c7;
  background: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background: #f1f3f5;
  border: 1px solid #ddd;
  color: #666;
`;

const SubmitButton = styled(Button)`
  background: #3e4730;
  color: #fff;
`;

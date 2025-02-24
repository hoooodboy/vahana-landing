import React, { useState } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import { imgView } from "@/src/utils/upload";

export const VerificationModal = ({ isOpen, setIsOpen, user }) => {
  const [status, setStatus] = useState(user?.verification_status || "대기");

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>서류 인증</ModalTitle>
        <ImageContainer>
          {user?.identity_file && (
            <img
              src={imgView(user?.identity_file)}
              alt="Verification document"
            />
          )}
          {!user?.identity_file && <NoData>이미지가 없습니다</NoData>}
        </ImageContainer>
        <StatusSelect
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="대기">대기</option>
          <option value="확정">확정</option>
          <option value="보류">보류</option>
          <option value="미신청">미신청</option>
        </StatusSelect>
        <ButtonGroup>
          <CancelButton onClick={setIsOpen}>취소</CancelButton>
          <SubmitButton>저장</SubmitButton>
        </ButtonGroup>
      </ModalContent>
    </PCModal>
  );
};

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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

const ImageContainer = styled.div`
  width: 100%;
  padding: 16px;
  margin: 16px 0;
  background: #f8f9fa;
  border-radius: 8px;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 4px;
  }
`;

const StatusSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #666;
  border-radius: 16px;
  font-size: 14px;
  margin: 16px 0;
  color: #666;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }
`;

const NoData = styled.div`
  width: 100%;
  height: 256px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

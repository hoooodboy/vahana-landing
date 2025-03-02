import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import { imgView } from "@/src/utils/upload";
import { usePatchApiAdminUsersId } from "@/src/api/endpoints/users/users";

export const VerificationModal = ({ isOpen, setIsOpen, user }) => {
  const [identityStatus, setIdentityStatus] = useState(
    user?.identity_status || "PENDING"
  );

  // user가 변경될 때마다 identityStatus 상태 업데이트
  useEffect(() => {
    if (user) {
      setIdentityStatus(user.identity_status || "PENDING");
    }
  }, [user]);

  const updateUserMutation = usePatchApiAdminUsersId({
    mutation: {
      onSuccess: () => {
        alert("처리가 완료되었습니다.");
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error:", error);
        alert("처리 중 오류가 발생했습니다.");
      },
    },
  });

  const handleSubmit = async () => {
    if (!user?.id) return;

    try {
      // Prepare the update data
      const updateData = {
        name: user.name || "",
        phone: user.phone || "",
        role: user.role || "USER",
        identity_status: identityStatus,
        invite_limit: user.invite_limit || 10,
      };

      await updateUserMutation.mutateAsync({
        id: user.id,
        data: updateData,
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPROVED":
        return "확정";
      case "PENDING":
        return "대기";
      case "REJECTED":
        return "보류";
      case "NOT_SUBMITTED":
        return "미신청";
      default:
        return status;
    }
  };

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>서류 인증</ModalTitle>
        <UserInfo>
          <InfoRow>
            <Label>ID</Label>
            <Value>{user?.id}</Value>
          </InfoRow>
          <InfoRow>
            <Label>이름</Label>
            <Value>{user?.name}</Value>
          </InfoRow>
          <InfoRow>
            <Label>이메일</Label>
            <Value>{user?.email}</Value>
          </InfoRow>
          <InfoRow>
            <Label>현재 상태</Label>
            <Value>
              <StatusBadge status={user?.identity_status}>
                {getStatusLabel(user?.identity_status)}
              </StatusBadge>
            </Value>
          </InfoRow>
        </UserInfo>

        <ImageContainer>
          {user?.identity_file && (
            <img
              src={imgView(user?.identity_file)}
              alt="Verification document"
            />
          )}
          {!user?.identity_file && <NoData>이미지가 없습니다</NoData>}
        </ImageContainer>

        <AddTicketSection>
          <Label>인증 상태 변경</Label>
          <Select
            value={identityStatus}
            onChange={(e) => setIdentityStatus(e.target.value)}
          >
            <option value="PENDING">대기</option>
            <option value="APPROVED">확정</option>
            <option value="REJECTED">보류</option>
            <option value="NOT_SUBMITTED">미신청</option>
          </Select>
        </AddTicketSection>

        <ButtonGroup>
          <CancelButton onClick={() => setIsOpen(false)}>취소</CancelButton>
          <SubmitButton onClick={handleSubmit}>저장</SubmitButton>
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
  max-height: 80vh;
  overflow: scroll;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
  min-width: 80px;
`;

const Value = styled.div`
  font-size: 14px;
  color: #333;
`;

const StatusBadge = styled.span<{ status?: any }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.status) {
      case "APPROVED":
        return "#e6f7ee";
      case "PENDING":
        return "#fff9db";
      case "REJECTED":
        return "#ffe3e3";
      case "NOT_SUBMITTED":
        return "#e9ecef";
      default:
        return "#e9ecef";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "APPROVED":
        return "#0ca678";
      case "PENDING":
        return "#f59f00";
      case "REJECTED":
        return "#fa5252";
      case "NOT_SUBMITTED":
        return "#868e96";
      default:
        return "#868e96";
    }
  }};
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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f1f3f5;
  border: 1px solid #ddd;
  color: #666;
`;

const SubmitButton = styled(Button)`
  background: #3e4730;
  color: #fff;
  border: none;
`;

const ImageContainer = styled.div`
  width: 100%;
  padding: 16px;
  margin: 16px 0;
  background: #f8f9fa;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 4px;
  }
`;

const NoData = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #868e96;
  font-size: 14px;
`;

const AddTicketSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
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
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }

  &:disabled {
    background-color: #f1f3f5;
    cursor: not-allowed;
  }
`;

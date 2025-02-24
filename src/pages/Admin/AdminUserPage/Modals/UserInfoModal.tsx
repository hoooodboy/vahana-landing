import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import {
  usePatchApiAdminUsersId,
  useGetApiAdminUsers,
} from "@/src/api/endpoints/users/users";

const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const IDENTITY_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const UserInfoModal = ({ isOpen, setIsOpen, user }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: USER_ROLES.USER,
    identity_status: IDENTITY_STATUSES.PENDING,
    invite_limit: 0,
  });

  const updateUserMutation = usePatchApiAdminUsersId({
    mutation: {
      onSuccess: () => {
        alert("수정이 완료되었습니다.");
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error updating user:", error);
        alert("수정 중 오류가 발생했습니다.");
      },
    },
  });

  // useGetApiAdminUsers query 추가
  const { refetch: refetchUsers } = useGetApiAdminUsers({
    query: {
      enabled: false, // 처음에는 자동으로 실행되지 않도록 설정
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        role: user.role || USER_ROLES.USER,
        identity_status: user.identity_status || IDENTITY_STATUSES.PENDING,
        invite_limit: user.invite_limit || 0,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "invite_limit" ? Number(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await updateUserMutation.mutateAsync(
        {
          id: user.id,
          data: {
            name: formData.name,
            phone: formData.phone,
            role: formData.role,
            identity_status: formData.identity_status,
            invite_limit: Number(formData.invite_limit),
          },
        },
        {
          onSuccess: () => {
            refetchUsers(); // 사용자 목록 갱신
          },
        }
      );
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>회원 정보 수정</ModalTitle>
        <InputGroup>
          <Label>이름</Label>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </InputGroup>
        <InputGroup>
          <Label>전화번호</Label>
          <Input name="phone" value={formData.phone} onChange={handleChange} />
        </InputGroup>
        <InputGroup>
          <Label>사용자 역할</Label>
          <Select name="role" value={formData.role} onChange={handleChange}>
            {Object.entries(USER_ROLES).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </Select>
        </InputGroup>
        <ButtonGroup>
          <CancelButton onClick={() => setIsOpen(false)}>취소</CancelButton>
          <SubmitButton onClick={handleSubmit}>적용</SubmitButton>
        </ButtonGroup>
      </ModalContent>
    </PCModal>
  );
};

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
`;

const ModalTitle = styled.div`
  color: #000;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const Label = styled.label`
  color: #666;
  font-size: 14px;
  font-weight: 600;
  padding: 8px;
`;

const Input = styled.input`
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

  &::placeholder {
    color: #666;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: #3e4730;
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
  cursor: pointer;

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

  &:hover {
    background: #e9ecef;
  }
`;

const SubmitButton = styled(Button)`
  background: #3e4730;
  color: #fff;
  border: none;

  &:hover {
    background: #2e3520;
  }
`;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";
import {
  useGetApiAdminUsers,
  usePatchApiAdminUsersId,
} from "@/src/api/endpoints/users/users";

export const ReferralCountModal = ({ isOpen, setIsOpen, user }) => {
  const [inviteLimit, setInviteLimit] = useState("");

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
  }) as any;

  useEffect(() => {
    if (user) {
      setInviteLimit(user.invite_limit || 0);
    }
  }, [user]);

  const { refetch: refetchUsers } = useGetApiAdminUsers({
    query: {
      enabled: false,
    },
  });

  const handleSubmit = async () => {
    if (!user?.id) return;

    try {
      await updateUserMutation.mutateAsync(
        {
          id: user.id,
          data: {
            // name: user.name,
            // phone: user.phone,
            // role: user.role,
            // identity_status: user.identity_status,
            invite_limit: Number(inviteLimit),
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

  const handleChange = (e) => {
    const value = e.target.value;
    // 음수가 아닌 정수만 허용
    if (value === "" || /^\d+$/.test(value)) {
      setInviteLimit(value);
    }
  };

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalTitle>잔여 추천 횟수</ModalTitle>
        <InputGroup>
          <Label>추천 가능 횟수</Label>
          <Input
            type="text"
            value={inviteLimit}
            onChange={handleChange}
            placeholder="추천 가능 횟수를 입력하세요"
          />
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

  &:hover:not(:disabled) {
    background: #2e3520;
  }
`;

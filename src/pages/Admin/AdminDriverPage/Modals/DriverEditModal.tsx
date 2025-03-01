import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import {
  usePatchApiDriversId,
  useDeleteApiDriversId,
} from "@/src/api/endpoints/drivers/drivers";
import PCModal from "@/src/components/PCModal";

interface DriverEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: any;
  onComplete: () => void;
}

const DriverEditModal: React.FC<DriverEditModalProps> = ({
  isOpen,
  onClose,
  driver,
  onComplete,
}) => {
  // 드라이버 수정 Mutation
  const editDriverMutation = usePatchApiDriversId({
    mutation: {
      onSuccess: () => {
        toast.success("드라이버 정보가 성공적으로 수정되었습니다.");
        onComplete();
      },
      onError: () => {
        toast.error("드라이버 정보 수정에 실패했습니다.");
      },
    },
  });

  // 드라이버 삭제 Mutation
  const deleteDriverMutation = useDeleteApiDriversId({
    mutation: {
      onSuccess: () => {
        toast.success("드라이버가 성공적으로 삭제되었습니다.");
        onComplete();
      },
      onError: () => {
        toast.error("드라이버 삭제에 실패했습니다.");
      },
    },
  });

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 컴포넌트 마운트 시 드라이버 정보로 폼 데이터 초기화
  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || "",
        phone: driver.phone || "",
        address: driver.address || "",
        note: driver.note || "",
      });
    }
  }, [driver]);

  // 입력 필드 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 드라이버 정보 수정 핸들러
  const handleEditDriver = async () => {
    // 유효성 검사
    if (!formData.name) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    if (!formData.phone) {
      toast.error("전화번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await editDriverMutation.mutateAsync({
        id: driver.id.toString(),
        data: {
          ...formData,
        },
      });
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  // 드라이버 삭제 핸들러
  const handleDeleteDriver = async () => {
    // 삭제 확인 대화상자
    const confirmDelete = window.confirm(
      "정말로 이 드라이버를 삭제하시겠습니까?\n" +
        "삭제된 드라이버 정보는 복구할 수 없습니다."
    );

    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      await deleteDriverMutation.mutateAsync({
        id: driver.id.toString(),
      });
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <PCModal isOpen={isOpen} setIsOpen={onClose}>
      <ModalContent>
        <ModalHeader>
          <h3>드라이버 정보 관리</h3>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력해주세요."
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="전화번호를 입력해주세요."
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="address">자택</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="자택 주소를 입력해주세요."
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="note">특이사항</Label>
            <TextArea
              id="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="특이사항을 입력해주세요."
              disabled={isSubmitting}
              rows={4}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <DeleteButton
            onClick={handleDeleteDriver}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </DeleteButton>
          <ButtonGroup>
            <CancelButton
              onClick={onClose}
              disabled={isSubmitting || isDeleting}
            >
              취소
            </CancelButton>
            <SaveButton
              onClick={handleEditDriver}
              disabled={
                isSubmitting || isDeleting || !formData.name || !formData.phone
              }
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </SaveButton>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </PCModal>
  );
};

// Styled Components
const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;

  h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #adb5bd;

  &:hover {
    color: #495057;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #495057;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3e4730;
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #e9ecef;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #c82333;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: #f1f3f5;
  color: #495057;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  background-color: #3e4730;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #2b331f;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default DriverEditModal;

import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Header from "@/src/components/Header";

import tokens from "@/src/tokens";
import {
  getApiUsersId,
  useGetApiUsersId,
  useGetApiUsersIdReferrer,
  usePostApiUsersIdInvite,
} from "@/src/api/endpoints/users/users";

import icEmpty from "@/src/assets/ic-empty-data.svg";
import icInfo from "@/src/assets/ic-info.svg";
import Modal from "@/src/components/Modal";
import { toast } from "react-toastify";

const CouponPage = () => {
  const { userInfo } = tokens;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [reservationCount, setReservationCount] = useState<number>(0);

  const { data: referrerData }: any = useGetApiUsersIdReferrer(userInfo.id, {
    query: {
      enabled: !!userInfo?.id,
    },
  });

  console.log("referrerData", referrerData);

  const { data: userData, refetch } = useGetApiUsersId(userInfo.id);

  useEffect(() => {
    if (referrerData?.result?.invite_limit !== undefined) {
      setReservationCount(referrerData?.result?.invite_limit || 0);
    }
  }, [userData?.result?.reservations]);

  const mutation = usePostApiUsersIdInvite({
    mutation: {
      onSuccess: () => {
        setIsCouponOpen(false);
        setReservationCount((prev) => Math.max(0, prev - 1));
        refetch();
        toast("초대코드가 발송되었습니다.");
      },
      onError: (error) => {
        toast("초대에 실패했습니다.\n관리자에게 문의해주세요.");
      },
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, "");

    if (phoneNumber.startsWith("02")) {
      if (phoneNumber.length < 3) {
        return phoneNumber;
      } else if (phoneNumber.length < 6) {
        return `${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2)}`;
      } else if (phoneNumber.length < 10) {
        return `${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5)}`;
      } else {
        return `${phoneNumber.slice(0, 2)}-${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    } else {
      if (phoneNumber.length < 4) {
        return phoneNumber;
      } else if (phoneNumber.length < 7) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      } else if (phoneNumber.length < 11) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
      } else {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    const event = {
      target: {
        name: "phone",
        value: formattedPhone,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const handleInvite = () => {
    if (!formData.name || !formData.phone) {
      toast("이름과 전화번호를 모두 입력해주세요.");
      return;
    }

    mutation.mutate({
      id: userInfo.id,
      data: {
        to_user_name: formData.name,
        to_user_phone: formData.phone.replace(/-/g, ""),
      },
    });
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          SCHEDULED
          <br />
          OPERATION
        </Title>
        운행 예약
      </TitleContainer>

      <PublishContainer>
        <RemainBlock>
          <Remain onClick={() => setIsInfoOpen(true)}>
            잔여횟수
            <img src={icInfo} />
          </Remain>
          {reservationCount}회
        </RemainBlock>
        <PublishButton onClick={() => setIsCouponOpen(true)}>
          초대 쿠폰 발급
        </PublishButton>
      </PublishContainer>
      <Notice>
        *초대쿠폰 발급시 피추천인과 추천인에게 1티켓이 제공됩니다.
      </Notice>

      <ContentContainer>
        <ContainertTitle>피추천인</ContainertTitle>
        <ContentBlock>
          {!referrerData && (
            <ContentWrapper>
              <ContentTitle>이름</ContentTitle>
              날짜
            </ContentWrapper>
          )}

          {!!referrerData && (
            <EmptyBox>
              <Empty src={icEmpty} />
              데이터가 없습니다.
            </EmptyBox>
          )}
        </ContentBlock>
      </ContentContainer>

      <ContentContainer style={{ marginBottom: 152 }}>
        <ContainertTitle>추천인</ContainertTitle>

        {!referrerData && (
          <ContentWrapper>
            <ContentTitle>이름</ContentTitle>
            날짜
          </ContentWrapper>
        )}

        {!!referrerData && (
          <EmptyBox>
            <Empty src={icEmpty} />
            데이터가 없습니다.
          </EmptyBox>
        )}
      </ContentContainer>

      <Modal isOpen={isCouponOpen} setIsOpen={setIsCouponOpen}>
        <ModalContent>
          <ModalTitle>쿠폰 발행</ModalTitle>

          <Form>
            <InputGroup>
              <Label>이름</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력해주세요."
              />
            </InputGroup>

            <InputGroup>
              <Label>전화번호</Label>
              <Input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={13}
                placeholder="전화번호를 입력해주세요."
              />
            </InputGroup>
          </Form>
          <InviteButton onClick={handleInvite}>초대하기</InviteButton>
        </ModalContent>
      </Modal>
      <Modal isOpen={isInfoOpen} setIsOpen={setIsInfoOpen}>
        <ModalContent>
          <ModalTitle>쿠폰 발행</ModalTitle>
          <ModalContents>
            초대쿠폰 발급시 피추천인과 추천인에게 <br />
            1티켓이 제공됩니다.
            <br />
            <br />
            해당 쿠폰은 1,000,000₩ 상당의 1티켓과
            <br /> 동일하게 사용 가능합니다.
            <br />
            <br />
            티켓은 발급 시점으로 부터 최대 <br />
            90일 까지 사용가능합니다.
          </ModalContents>

          <InviteButton onClick={() => setIsInfoOpen(false)}>닫기</InviteButton>
        </ModalContent>
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  flex: 1 !important;
  background: #fff;
  position: relative;
  padding-top: 56px;
  padding-bottom: 215px;
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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 16px;
  margin-bottom: 120px;
`;

const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ContainertTitle = styled.div`
  color: #000;
  font-size: 20px;
  font-weight: 700;
`;

const ContentTitle = styled.div`
  width: 100px;
  color: #666;
  font-size: 16px;
  font-weight: 500;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;

  color: #000;
  font-size: 16px;
  font-weight: 400;
`;

const Notice = styled.div`
  margin-top: 20px;
  margin-bottom: 60px;
  padding: 0 16px;

  color: #666;
  font-size: 12px;
  font-weight: 500;
`;

const EmptyBox = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;

  color: #c7c7c7;
  font-size: 14px;
  font-weight: 400;
`;

const Empty = styled.img`
  width: 24px;
  height: 24px;
`;

const PublishContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 16px;
`;

const RemainBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #000;
  font-size: 20px;
  font-weight: 700;
`;

const Remain = styled.div`
  display: flex;
  gap: 4px;
  color: #666;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const PublishButton = styled.div`
  padding: 12px 24px;
  border-radius: 24px;
  background: #3e4730;

  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 24px 16px;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  gap: 36px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
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

export default CouponPage;

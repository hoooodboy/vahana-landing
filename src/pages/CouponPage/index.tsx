import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

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
  const params = useParams();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [inviteLimit, setInviteLimit] = useState(0);
  const [referrerData, setReferrerData] = useState([]);
  const [refereeData, setRefereeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 정보 조회
  const { data: userData, refetch: refetchUserData } = useGetApiUsersId(
    userInfo.id
  );

  // 추천인 정보 조회
  const {
    data: referrerResponse,
    isLoading: isReferrerLoading,
    error: referrerError,
  } = useGetApiUsersIdReferrer(userInfo.id, {
    query: {
      enabled: !!userInfo?.id,
    },
  });

  // 현재 유저 이름 가져오기
  const currentUserName = userData?.result?.name || userInfo?.name;

  // API 응답 데이터 처리
  useEffect(() => {
    if (!isReferrerLoading && referrerResponse && currentUserName) {
      console.log("API 응답 데이터:", referrerResponse);

      // API 응답 구조에 맞게 데이터 처리
      const result = referrerResponse?.result || ({} as any);

      // 추천 가능 횟수 업데이트
      if (result.invite_limit !== undefined) {
        setInviteLimit(result.invite_limit);
      }

      // 추천인(referrer)과 피추천인(referee) 데이터 분리
      const referrerList = [];
      const refereeList = [];

      // 데이터 구조에 맞게 처리
      if (Array.isArray(result)) {
        result.forEach((item) => {
          if (item.referee && item.referrer) {
            // referee가 현재 사용자인 경우 (추천인 목록)
            if (currentUserName === item.referee) {
              referrerList.push({
                name: item.referrer,
                date: formatDate(item.created_at),
              });
            }
            // referrer가 현재 사용자인 경우 (피추천인 목록)
            else if (currentUserName === item.referrer) {
              refereeList.push({
                name: item.referee,
                date: formatDate(item.created_at),
              });
            }
          }
        });
      } else if (Array.isArray(result.data)) {
        result.data.forEach((item) => {
          // 현재 유저 이름으로 비교하여 추천인/피추천인 분류
          if (item.referee && item.referrer) {
            if (currentUserName === item.referrer) {
              // 현재 사용자가 추천인인 경우 (피추천인 목록)
              refereeList.push({
                name: item.referee,
                date: formatDate(item.created_at),
              });
            } else if (currentUserName === item.referee) {
              // 현재 사용자가 피추천인인 경우 (추천인 목록)
              referrerList.push({
                name: item.referrer,
                date: formatDate(item.created_at),
              });
            }
          }
        });
      }

      setReferrerData(referrerList);
      setRefereeData(refereeList);
      setIsLoading(false);
    }
  }, [referrerResponse, isReferrerLoading, currentUserName]);

  // 초대 코드 발행 API 호출
  const mutation = usePostApiUsersIdInvite({
    mutation: {
      onSuccess: () => {
        setIsCouponOpen(false);
        setInviteLimit((prev) => Math.max(0, prev - 1));
        refetchUserData();
        toast("초대코드가 발송되었습니다.");
        // 폼 초기화
        setFormData({
          name: "",
          phone: "",
        });
      },
      onError: (error) => {
        toast("초대에 실패했습니다.\n관리자에게 문의해주세요.");
      },
    },
  });

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // 이미 형식화된 날짜 문자열일 수 있음
        return dateString;
      }
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    } catch (e) {
      console.error("날짜 변환 오류:", e);
      return dateString; // 오류 발생시 원본 문자열 반환
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPhoneNumber = (value) => {
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

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    const event = {
      target: {
        name: "phone",
        value: formattedPhone,
      },
    };
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
      headers: {
        origin: "",
      },
    });
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          COUPON
          <br />
          PUBLISH
        </Title>
        쿠폰 발행
      </TitleContainer>

      <PublishContainer>
        <RemainBlock>
          <Remain onClick={() => setIsInfoOpen(true)}>
            잔여횟수
            <img src={icInfo} alt="Info" />
          </Remain>
          {inviteLimit}회
        </RemainBlock>
        <PublishButton
          onClick={() => setIsCouponOpen(true)}
          disabled={inviteLimit <= 0}
        >
          초대 쿠폰 발급
        </PublishButton>
      </PublishContainer>
      <Notice>
        *초대쿠폰 발급시 피추천인과 추천인에게 1티켓이 제공됩니다.
      </Notice>

      {/* 피추천인 섹션 */}
      <ContentContainer>
        <ContainertTitle>피추천인</ContainertTitle>
        <ContentBlock>
          {isReferrerLoading || !userData ? (
            <LoadingState>데이터를 불러오는 중입니다...</LoadingState>
          ) : refereeData.length > 0 ? (
            refereeData.map((item, index) => (
              <ContentWrapper key={`referee-${index}`}>
                <ContentTitle>{item.name}</ContentTitle>
                {item.date}
              </ContentWrapper>
            ))
          ) : (
            <EmptyBox>
              <Empty src={icEmpty} alt="빈 데이터" />
              데이터가 없습니다.
            </EmptyBox>
          )}
        </ContentBlock>
      </ContentContainer>

      {/* 추천인 섹션 */}
      <ContentContainer style={{ marginBottom: 152 }}>
        <ContainertTitle>추천인</ContainertTitle>
        <ContentBlock>
          {isReferrerLoading || !userData ? (
            <LoadingState>데이터를 불러오는 중입니다...</LoadingState>
          ) : referrerData.length > 0 ? (
            referrerData.map((item, index) => (
              <ContentWrapper key={`referrer-${index}`}>
                <ContentTitle>{item.name}</ContentTitle>
                {item.date}
              </ContentWrapper>
            ))
          ) : (
            <EmptyBox>
              <Empty src={icEmpty} alt="빈 데이터" />
              데이터가 없습니다.
            </EmptyBox>
          )}
        </ContentBlock>
      </ContentContainer>

      {/* 쿠폰 발행 모달 */}
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

      {/* 쿠폰 정보 모달 */}
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
  display: flex;
  flex-direction: column;
  flex: 1 !important;
  background: #fff;
  position: relative;
  padding-top: 56px;
  padding-bottom: 317px;
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
  cursor: pointer;
`;

const PublishButton = styled.div<{ disabled?: boolean }>`
  padding: 12px 24px;
  border-radius: 24px;
  background: #3e4730;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 24px 16px;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
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
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
    border-color: #3e4730;
  }
`;

const ModalTitle = styled.div`
  color: #000;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`;

const InviteButton = styled.div<{ disabled?: boolean }>`
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
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const ModalContents = styled.div`
  color: #000;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
`;

const LoadingState = styled.div`
  width: 100%;
  padding: 24px 0;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

export default CouponPage;

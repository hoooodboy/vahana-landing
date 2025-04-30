import React, { useState, useRef } from "react";

import { usePostApiUpload } from "@/src/api/endpoints/upload/upload";
import {
  useGetApiUsersId,
  usePostApiUsersIdIdentity,
} from "@/src/api/endpoints/users/users";

import Header from "@/src/components/Header";
import tokens from "@/src/tokens";
import styled from "styled-components";
import icInfo from "@/src/assets/ic-info.svg";
import IcCheck from "@/src/assets/ic-check.svg";
import IcCancle from "@/src/assets/ic-cancle.svg";
import IcPending from "@/src/assets/ic-pending.svg";
import Modal from "@/src/components/Modal";
import { imgView } from "@/src/utils/upload";
import { toast } from "react-toastify";

const IdentifyPage = () => {
  const { userInfo } = tokens;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // New state for storing the uploaded image URL
  const [error, setError] = useState("");
  const { data: userData, refetch } = useGetApiUsersId(userInfo.id);
  const fileInputRef = useRef(null);

  const uploadMutation = usePostApiUpload({
    mutation: {
      onSuccess: (response: any) => {
        setError("");
        setUploadedImageUrl(response.result); // Store the returned URL
      },
      onError: () => {
        setError("이미지 업로드에 실패했습니다.");
      },
    },
  });

  const identifyMutation = usePostApiUsersIdIdentity({
    mutation: {
      onSuccess: () => {
        setError("");
        refetch(); // Refresh user data after successful identification
        toast("심사 신청이 완료되었습니다.");
      },
      onError: () => {
        setError("신원 인증에 실패했습니다.");
      },
    },
  });

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the image immediately after selection
      uploadMutation.mutate({
        data: {
          image: file,
        },
      });
    }
  };

  const handleSubmit = () => {
    if (!uploadedImageUrl) {
      setError("이미지를 먼저 업로드해주세요.");
      return;
    }

    identifyMutation.mutate({
      id: userInfo.id,
      data: {
        identity_file: uploadedImageUrl,
      },
    });
  };

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          USER
          <br />
          IDENTIFY
        </Title>
        신원 인증
      </TitleContainer>

      <PublishContainer>
        <RemainBlock>
          <Remain onClick={() => setIsInfoOpen(true)}>
            {userData?.result?.identity_status === "PENDING" && "인증 필요"}
            {userData?.result?.identity_status === "APPROVED" && "인증 됨"}
            {userData?.result?.identity_status === "REJECTED" && "인증 보류"}
            <img src={icInfo} />
          </Remain>
          -
        </RemainBlock>

        <PublishButton>
          {userData?.result?.identity_status === "PENDING" && (
            <img src={IcPending} />
          )}
          {userData?.result?.identity_status === "APPROVED" && (
            <img src={IcCheck} />
          )}
          {userData?.result?.identity_status === "REJECTED" && (
            <img src={IcCancle} />
          )}
        </PublishButton>
      </PublishContainer>
      <Notice style={{ padding: "4px 16px" }}>
        *서류 인증 후 무료 티켓을 받아보세요
      </Notice>

      <ContentContainer>
        <ImageUploadContainer onClick={() => fileInputRef.current?.click()}>
          {previewUrl ? (
            <PreviewImage src={previewUrl} alt="Selected" />
          ) : userData?.result?.identity_file ? (
            <PreviewImage
              src={imgView(userData?.result?.identity_file)}
              alt="Selected"
            />
          ) : (
            <PlaceholderContent></PlaceholderContent>
          )}
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </ImageUploadContainer>

        <Notice>
          자신을 잘 표현할 수 있는 서류/사진 한장을 첨부해주세요.
          <br />
          명함, 재직증명서, 소득금액증명원, 부동산 소유확인서, 실물증 (등)
        </Notice>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton onClick={handleSubmit}>등록하기</SubmitButton>
      </ContentContainer>

      <Modal isOpen={isInfoOpen} setIsOpen={setIsInfoOpen}>
        <ModalContent>
          <ModalTitle>쿠폰 발행</ModalTitle>
          <ModalContents>
            신원인증 심사는 차량 배차 현황에 따라 <br />
            기간이 길어질 수 있습니다.
            <br />
            <br />
            인증 방식은 내규에 따름을 알려드립니다.
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
  padding: 0 16px;
  margin-top: 52px;
  padding-bottom: 152px;
`;

const ImageUploadContainer = styled.div`
  width: 100%;
  height: 256px;
  border: 1px solid #666;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafa;
  overflow: hidden;
  margin-bottom: 8px;
`;

const PreviewImage = styled.img`
  max-height: 100%;
  object-fit: contain;
`;

const PlaceholderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StyledCamera = styled.div`
  width: 48px;
  height: 48px;
  color: #c7c7c7;
`;

const PlaceholderText = styled.p`
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Notice = styled.p`
  color: #666;
  font-size: 12px;
  font-weight: 500;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  border-radius: 24px;
  background: #3e4730;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 72px;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const PublishButton = styled.div``;

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
  margin-top: 42px;
`;

const ModalContents = styled.div`
  color: #000;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const UploadStatus = styled.div`
  color: #666;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

export default IdentifyPage;

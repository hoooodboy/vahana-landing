import { usePostApiAuthSignup } from "@/src/api/endpoints/auth/auth";
import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

const JoinPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const kakaoId = searchParams.get("id");
  const provider = searchParams.get("provider");
  const referrer = searchParams.get("referrer");

  // URL에서 본인인증 성공 여부와 imp_uid 확인
  const success = searchParams.get("success") === "true";
  const impUid = searchParams.get("imp_uid");

  // 초기 폼 데이터 구성
  const getInitialFormData = () => {
    // 세션 스토리지에서 저장된 값 가져오기
    const savedFormData = sessionStorage.getItem("joinFormData");

    if (savedFormData) {
      try {
        return JSON.parse(savedFormData);
      } catch (e) {
        console.error("저장된 폼 데이터 파싱 오류:", e);
      }
    }

    // 기본값
    return {
      name: "",
      id: kakaoId || "",
      password: "",
      passwordConfirm: "",
      phone: "",
      referrerCode: referrer || "",
      provider: provider || "LOCAL",
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [passwordError, setPasswordError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // 아임포트 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 비밀번호 유효성 검사
  useEffect(() => {
    if (!kakaoId && formData.password && formData.passwordConfirm) {
      setPasswordError(formData.password !== formData.passwordConfirm);
    }
  }, [formData.password, formData.passwordConfirm, kakaoId]);

  // formData가 변경될 때마다 세션 스토리지에 저장
  useEffect(() => {
    sessionStorage.setItem("joinFormData", JSON.stringify(formData));
  }, [formData]);

  // URL 쿼리 파라미터로부터 본인인증 결과 체크
  useEffect(() => {
    // URL에서 본인인증 성공 여부 확인
    if (success && impUid) {
      // 인증 성공 처리
      setIsVerified(true);
      setVerificationId(impUid);

      // 세션 스토리지에 인증 완료 상태 저장
      sessionStorage.setItem("isVerified", "true");
      sessionStorage.setItem("verificationId", impUid);

      toast("본인인증이 완료되었습니다.");

      // 주소창에서 쿼리 파라미터 제거 (선택적)
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [success, impUid]);

  // 페이지 로드 시 인증 상태 복원
  useEffect(() => {
    const savedVerified = sessionStorage.getItem("isVerified");
    const savedVerificationId = sessionStorage.getItem("verificationId");

    if (savedVerified === "true") {
      setIsVerified(true);

      if (savedVerificationId) {
        setVerificationId(savedVerificationId);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    if (kakaoId) {
      return !!(formData.name && formData.id && formData.phone && isVerified);
    } else {
      return !!(
        formData.name &&
        formData.id &&
        formData.password &&
        formData.passwordConfirm &&
        formData.phone &&
        !passwordError &&
        isVerified
      );
    }
  };

  const signupMutation = usePostApiAuthSignup({
    mutation: {
      onSuccess: (data) => {
        toast("회원가입 성공");
        // 회원가입 성공 시 저장된 폼 데이터 삭제
        sessionStorage.removeItem("joinFormData");
        sessionStorage.removeItem("isVerified");
        sessionStorage.removeItem("verificationId");
        navigate("/login");
      },
      onError: (error: any) => {
        console.log(error);
        console.log("AAAAA", error.response);
        toast(error.response.data.err);
      },
    },
  });

  const isVerificationButtonEnabled = () => {
    return !!(
      formData.name.trim() && // 이름이 입력되어 있는지 확인 (공백만 있는 경우 제외)
      formData.phone.replace(/[^0-9]/g, "").length >= 10 && // 전화번호가 최소 10자리 이상인지 확인
      !isVerified && // 이미 인증된 상태가 아닌지 확인
      !isVerifying // 인증 진행 중이 아닌지 확인
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 본인인증 확인
    if (!isVerified) {
      toast("본인인증이 필요합니다");
      return;
    }

    signupMutation.mutate({
      data: {
        name: formData.name,
        id: formData.id,
        password: formData.password,
        phone: formData.phone,
        referrerCode: formData.referrerCode,
        provider: formData.provider,
      },
    });
  };

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const phoneNumber = value.replace(/[^\d]/g, "");

    // 02로 시작하는 경우 (서울)
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
    }
    // 휴대폰 번호인 경우
    else {
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

  // 현재 URL에서 쿼리 파라미터 제거한 기본 경로 가져오기
  const getCleanRedirectUrl = () => {
    const url = new URL(window.location.href);
    url.search = ""; // 모든 쿼리 파라미터 제거
    return url.toString();
  };

  // 아임포트 본인인증 요청 함수
  const requestIdentityVerification = () => {
    if (isVerifying) return;

    setIsVerifying(true);

    try {
      // window.IMP 객체가 있는지 확인
      const { IMP } = window;
      if (!IMP) {
        toast("아임포트 SDK가 로드되지 않았습니다.");
        setIsVerifying(false);
        return;
      }

      // 아임포트 초기화
      IMP.init("imp61282785"); // 실제 가맹점 식별코드로 변경 필요

      // 전화번호 형식 변환 (하이픈 제거)
      const phoneNumberWithoutHyphen = formData.phone.replace(/-/g, "");

      // 본인인증 데이터 정의
      const data = {
        merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
        company: window.location.host, // 회사명 또는 URL
        // 통신사 정보 (선택)
        // carrier: "SKT", // 통신사 (SKT, KT, LGT, MVNO)
        // 이름, 전화번호 (미리 입력한 경우 전달)
        ...(formData.name && { name: formData.name }),
        ...(phoneNumberWithoutHyphen.length > 0 && {
          phone: phoneNumberWithoutHyphen,
        }),
        // 리다이렉트 URL (모바일 환경에서 필요)
        m_redirect_url: getCleanRedirectUrl(),
      };

      // 본인인증 창 호출
      IMP.certification(data, callback);
    } catch (error) {
      console.error("본인인증 오류:", error);
      toast("본인인증 중 오류가 발생했습니다.");
      setIsVerifying(false);
    }
  };

  // 아임포트 콜백 함수
  function callback(response) {
    const { success, error_msg, imp_uid } = response;

    setIsVerifying(false);

    if (success) {
      // 본인인증 성공 처리
      setIsVerified(true);
      setVerificationId(imp_uid);

      // 세션 스토리지에 인증 정보 저장
      sessionStorage.setItem("isVerified", "true");
      sessionStorage.setItem("verificationId", imp_uid);

      toast("본인인증이 완료되었습니다.");
    } else {
      // 본인인증 실패 처리
      toast(`본인인증 실패: ${error_msg}`);
    }
  }

  return (
    <Container>
      <Header />
      <TitleContainer>
        <Title>
          JOIN
          <br />
          MEMBERSHIP
        </Title>
        회원가입
      </TitleContainer>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>
            이름&nbsp;<b>*</b>
          </Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="당신의 이름을 입력해주세요."
            disabled={isVerified}
            style={{ background: isVerified ? "#f5f5f5" : "#fff" }}
          />
        </InputGroup>

        <InputGroup>
          <Label>아이디</Label>
          <Input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="아이디를 입력해주세요."
            disabled={!!kakaoId}
            style={{ background: kakaoId ? "#f5f5f5" : "#fff" }}
          />
        </InputGroup>

        {!kakaoId && (
          <>
            <InputGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요."
                $error={passwordError}
              />
            </InputGroup>

            <InputGroup>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력해주세요."
                $error={passwordError}
              />
              {passwordError && (
                <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
              )}
            </InputGroup>
          </>
        )}

        <InputGroup>
          <Label>전화번호</Label>
          <InputWrapper>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="전화번호를 입력해주세요."
              disabled={isVerified}
              style={{ background: isVerified ? "#f5f5f5" : "#fff" }}
            />
            <VerificationButton
              type="button"
              onClick={requestIdentityVerification}
              disabled={!isVerificationButtonEnabled()}
            >
              {isVerified ? "인증완료" : isVerifying ? "인증중..." : "본인인증"}
            </VerificationButton>
          </InputWrapper>
          {isVerified && (
            <SuccessMessage>본인인증이 완료되었습니다.</SuccessMessage>
          )}
        </InputGroup>

        <InputGroup>
          <Label>추천인 코드</Label>
          <Input
            type="text"
            name="referrerCode"
            value={formData.referrerCode}
            onChange={handleChange}
            placeholder="추천인 코드를 입력해주세요"
            disabled={!!referrer}
            style={{ background: referrer ? "#f5f5f5" : "#fff" }}
          />
        </InputGroup>

        <SubmitButton
          type="submit"
          $isValid={isFormValid()}
          disabled={!isFormValid()}
        >
          {isVerified ? "회원가입" : "본인인증이 필요합니다"}
        </SubmitButton>
      </Form>
      <Devider />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
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
  line-height: 1.2;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const Label = styled.label`
  color: #666;
  font-size: 14px;
  font-weight: 600;
  padding: 8px;
  b {
    color: #ba1313;
  }
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

const VerificationButton = styled.button`
  min-width: 90px;
  height: 48px;
  background: #3e4730;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background: #c6c6c6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #2e3520;
  }
`;

const ErrorMessage = styled.span`
  color: #ff0000;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 8px;
`;

const SuccessMessage = styled.span`
  color: #3e8635;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 8px;
`;

const SubmitButton = styled.button<{ $isValid: boolean }>`
  width: 100%;
  height: 48px;
  background: ${(props) => {
    if (props.disabled) return "#e0e0e0";
    return props.$isValid ? "#3e4730" : "#c6c6c6";
  }};
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 40px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;

  &:hover {
    background: ${(props) => {
      if (props.disabled) return "#e0e0e0";
      return props.$isValid ? "#2e3520" : "#b5b5b5";
    }};
  }
`;

const Devider = styled.div`
  height: 150px;
`;

// TypeScript 타입 선언
declare global {
  interface Window {
    IMP: any;
  }
}

export default JoinPage;

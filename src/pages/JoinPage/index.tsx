import React, { useState } from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import styled from "styled-components";

const JoinPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    password: "",
    phone: "",
    smsCode: "",
    recommendCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 로직 구현
    console.log("Form submitted:", formData);
  };

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
          <Label>이름</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="김아무개"
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
          />
        </InputGroup>

        <InputGroup>
          <Label>비밀번호</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력해주세요."
          />
        </InputGroup>

        <InputGroup>
          <Label>전화번호</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="전화번호를 입력해주세요."
          />
        </InputGroup>

        <InputGroup>
          <Label>문자 인증</Label>
          <Input
            type="text"
            name="smsCode"
            value={formData.smsCode}
            onChange={handleChange}
            placeholder="인증코드를 입력해주세요"
          />
        </InputGroup>

        <InputGroup>
          <Label>추천인코드</Label>
          <Input
            type="text"
            name="recommendCode"
            value={formData.recommendCode}
            onChange={handleChange}
            placeholder="A3d*@jd$da"
          />
        </InputGroup>

        <SubmitButton type="submit">회원가입</SubmitButton>
      </Form>
      <Devider />

      <Footer />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  padding-top: 56px;
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
  &::placeholder {
    color: #666;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 42px;
  background: #c6c6c6;
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 40px;
  cursor: pointer;
`;

const Devider = styled.div`
  height: 150px;
`;

export default JoinPage;

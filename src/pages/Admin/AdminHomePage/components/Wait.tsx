import React, { useEffect, useState } from "react";
import styled from "styled-components";

import LogoImg from "@/src/assets/ic-vahana-white.png";
import LmImg from "@/src/assets/img-lm500h.png";
import { Link } from "react-router-dom";

const Wait = () => {
  return <Container>Wait</Container>;
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  position: relative;
  display: flex;
`;

export default Wait;

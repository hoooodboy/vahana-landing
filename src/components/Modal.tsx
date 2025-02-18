import React, { useEffect } from "react";
import styled from "styled-components";
import { css } from "styled-components";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useBodyScrollLock } from "@/src/utils/useBodyScrollLock";

const Modal: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: any;
}> = ({ children, isOpen, setIsOpen }) => {
  const { lockScroll, openScroll } = useBodyScrollLock();

  useEffect(() => {
    if (isOpen) {
      lockScroll();
      return;
    }
    openScroll();
  }, [isOpen]);

  useEffect(() => {
    openScroll();
  }, []);

  return (
    <ModalContainer isVisible={isOpen}>
      <AnimatePresence>
        {isOpen && (
          <ModalBlock
            isVisible={isOpen}
            initial={{
              opacity: 0,
              scale: 0.68,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                ease: "easeOut",
                duration: 0.15,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.68,
              transition: {
                ease: "easeIn",
                duration: 0.15,
              },
            }}
          >
            {children}
          </ModalBlock>
        )}
      </AnimatePresence>
      <Background onClick={() => setIsOpen(false)}></Background>
    </ModalContainer>
  );
};

const Background = styled.div`
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;

  position: absolute;
  z-index: -1;
  cursor: pointer;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div<{ isVisible?: boolean }>`
  width: 100%;
  max-width: 480px;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  /* background: rgba(0, 0, 0, 0.5); */
  /* position: fixed;
  top: 0;
  left: 50%; */
  position: absolute;
  top: 0;
  left: 0;
  /* transform: translate(-50%, 0); */

  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  pointer-events: ${(props) => (props.isVisible ? "auto" : "none")};
  transition: opacity 0.1s ease-in-out;

  z-index: 100000;

  /* padding: 20px; */
`;

const ModalBlock = styled(motion.div)<{ isVisible?: boolean }>`
  width: 100%;

  max-width: 500px;
  /* padding: 58px 24px 20px; */

  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  /* border-radius: 40px;
  background: #fff; */
  position: relative;
  overflow: hidden;
`;

const ModalInfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ModalTitle = styled.div`
  font-size: 22px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Description = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ModalButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;

export default Modal;

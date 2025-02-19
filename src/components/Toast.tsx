// import { Container } from './Toast.styles';
import { toast, ToastOptions } from "react-toastify";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { createPortal } from "react-dom";

interface ToastProps {
  // 코드 리뷰 -> type은 enum으로 따로 빼기
  type: "success" | "error" | "info" | "action";
  message?: string;
  action?: string;
}

const toastOptions: ToastOptions = {
  position: "bottom-center",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  pauseOnFocusLoss: true,
  closeButton: false,
};

// export function showToast({ type, message, action = "바로가기" }: ToastProps) {
//   switch (type) {
//     case "success":
//       // enum으로 타입 지정했을 때 가독성 상승 -> case ToastType.success:
//       toast.success(message || "성공적으로 완료되었습니다", {
//         ...toastOptions,
//         icon: <img src="/svgs/toast_success.svg" alt="success" />,
//       });
//       return;
//     case "error":
//       toast.error(message || "다시 한번 시도해주세요", {
//         ...toastOptions,
//         icon: <img src="/svgs/toast_error.svg" alt="error" />,
//       });

//     //... 생략
//   }
// }

export default function Toast() {
  return (
    <Container
      position="top-center"
      autoClose={2500}
      hideProgressBar={true}
      closeOnClick={true}
      pauseOnHover={true}
      draggable={true}
      pauseOnFocusLoss={true}
      closeButton={false}
      limit={1}
    />
  );
}

export const Container = styled(ToastContainer)`
  max-width: 480px;
  width: 100%;
  padding: 0;

  .Toastify__toast {
    /* width: calc(100% - 20px) !important; */
    border-radius: 16px;
    padding: 16px 16px;
    color: #000;
    box-sizing: border-box;
    width: max-content;
    min-height: 0px;
    border-radius: 16px;
    background: rgba(256, 256, 256, 0.95);
    box-shadow: 0px 3px 20px 0px rgba(20, 27, 29, 0.1);

    font-size: 14px;
    font-weight: 500;
    margin: 0 auto;

    z-index: 100;
  }

  .Toastify__toast-body {
    width: 100% !important;
    padding: 0;
    margin: 0;
    height: fit-content;
    display: flex;
  }

  .Toastify__toast-icon {
    /* width: 22px;
    height: 22px; */
  }

  .Toastify__toast--info {
    background: rgba(107, 115, 135, 0.8);
  }

  .Toastify__toast--success {
    background: rgba(48, 173, 120, 0.8);
  }

  .Toastify__toast--error {
    background: rgba(224, 72, 82, 0.8);
  }
`;

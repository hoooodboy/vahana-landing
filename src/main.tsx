import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./utils/testUtils"; // 테스트 유틸리티 로드

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

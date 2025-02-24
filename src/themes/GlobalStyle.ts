import { createGlobalStyle } from "./themedStyledComponents";

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;
  }
  
  * {
    font-family: "Pretendard", sans-serif !important;
  }

  html, body, #root {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: "Pretendard", sans-serif !important;
    line-height: normal;
    font-size: 12px;
    color: #000;
    -webkit-text-size-adjust: none !important;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
  }

  body {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    user-drag: none;
    -webkit-touch-callout: none;
  }

  div {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    user-drag: none;
    -webkit-touch-callout: none;
  }

  img {
    -webkit-touch-callout: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
  }

  a {
    -webkit-touch-callout: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
  }

  html, body {
    background: #151711;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    padding: 0;
    -webkit-touch-callout: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
  }

   button, select {
    margin: 0;
    padding: 0;
    font-size: 16px;
    appearance: none;
    outline: none;
    cursor: pointer;
  }


  input {
    outline: none;
    background: transparent;
  }

  body {
    line-height: normal;
    -webkit-text-size-adjust: none !important;
  }

  * {
      box-sizing: border-box;
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: auto; 
      -webkit-scrollbar {
      display: none;
      }
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

      -ms-overflow-style: none; /* 인터넷 익스플로러 */
      scrollbar-width: none; /* 파이어폭스 */
    }

  body {
      -webkit-overflow-scrolling: touch;
    }

  body::-webkit-scrollbar {
    display: none;
    }

  body::-webkit-scrollbar-track {
      display: none;
    }

  body::-webkit-scrollbar-thumb {
    display: none;
  }

  body::-webkit-scrollbar-thumb:hover {
    display: none;
  }

  body::-webkit-scrollbar-thumb:active {
    display: none;
  }

  body::-webkit-scrollbar-button {
    display: none;
  }

`;

export default GlobalStyle;

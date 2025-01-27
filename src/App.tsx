import React from "react";

import { normalTheme, ThemeProvider, GlobalStyle } from "./themes";
import { CookiesProvider } from "react-cookie";
import { RootRouter } from "./router";

function App() {
  // const getGA = () => {
  //   ReactGA.initialize("G-TY4R7RLYJ1");

  //   ReactGA.set({ page: location.pathname });
  //   ReactGA.send({ hitType: "pageview", page: location.pathname });
  // };

  // useEffect(() => {
  //   getGA();
  // }, [location.pathname]);

  return (
    <ThemeProvider theme={normalTheme}>
      <GlobalStyle />

      <CookiesProvider>
        <RootRouter />
      </CookiesProvider>
    </ThemeProvider>
  );
}

export default App;

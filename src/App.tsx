import React from "react";

import { normalTheme, ThemeProvider, GlobalStyle } from "./themes";
import { CookiesProvider } from "react-cookie";
import { RootRouter } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Toast from "./components/Toast";
import useAxiosInterceptor from "./hooks/useAxiosInterceptor";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  // const getGA = () => {
  //   ReactGA.initialize("G-TY4R7RLYJ1");

  //   ReactGA.set({ page: location.pathname });
  //   ReactGA.send({ hitType: "pageview", page: location.pathname });
  // };

  // useEffect(() => {
  //   getGA();
  // }, [location.pathname]);

  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={normalTheme}>
      <GlobalStyle />

      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <RootRouter />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </CookiesProvider>
    </ThemeProvider>
  );
}

export default App;

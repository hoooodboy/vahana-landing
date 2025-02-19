import React from "react";

import { normalTheme, ThemeProvider, GlobalStyle } from "./themes";
import { CookiesProvider } from "react-cookie";
import { RootRouter } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Toast from "./components/Toast";

function App() {
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
      <Toast />
    </ThemeProvider>
  );
}

export default App;

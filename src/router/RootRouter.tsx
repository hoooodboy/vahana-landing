import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./AllRoutes";
import { RootPageProvider } from "../contexts/RootPageContext";

function RootRouter() {
  return (
    <BrowserRouter>
      <RootPageProvider>
        <AllRoutes />
      </RootPageProvider>
    </BrowserRouter>
  );
}

export default RootRouter;

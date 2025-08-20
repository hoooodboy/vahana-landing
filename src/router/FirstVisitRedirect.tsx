import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Pages from "../pages/index";

const FirstVisitRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisitedRoot");
    if (!hasVisited) {
      sessionStorage.setItem("hasVisitedRoot", "1");
      navigate("/subscribe/cars", { replace: true });
    }
  }, [navigate]);

  return <Pages.HomePage />;
};

export default FirstVisitRedirect;

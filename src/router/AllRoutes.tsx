import { RouteObject, useRoutes } from "react-router-dom";
import * as Pages from "../pages/index";

import BaseLayout from "./layouts/BaseLayout";

import LocalStorage from "../local-storage";
import PCLayout from "./layouts/PCLayout";

function AllRoutes() {
  // const { isLoggedIn } = useAppSelector((st) => st.auth.session);
  const isLoggedIn = LocalStorage.get("accessToken");
  const path = window.location.pathname;
  const loginRoutes: RouteObject[] = [
    {
      element: <BaseLayout />,
      children: [
        {
          path: "/",
          element: <Pages.HomePage />,
        },
        {
          path: "/cars",
          element: <Pages.CarPage />,
        },
        {
          path: "/pricing",
          element: <Pages.PricingPage />,
        },
        {
          path: "/my",
          element: <Pages.MyPage />,
        },
        {
          path: "/join",
          element: <Pages.JoinPage />,
        },
        {
          path: "/login",
          element: <Pages.LoginPage />,
        },
        {
          path: "/calendar",
          element: <Pages.CalendarPage />,
        },
        {
          path: "/*",
          element: <Pages.HomePage />,
        },
      ],
    },
  ];

  const Routes: RouteObject[] = [
    {
      element: path.includes("/admin") ? <PCLayout /> : <BaseLayout />,
      children: [
        {
          path: "/",
          element: <Pages.HomePage />,
        },
        {
          path: "/cars",
          element: <Pages.CarPage />,
        },
        {
          path: "/pricing",
          element: <Pages.PricingPage />,
        },
        {
          path: "/my",
          element: <Pages.MyPage />,
        },
        {
          path: "/signup",
          element: <Pages.JoinPage />,
        },
        {
          path: "/login",
          element: <Pages.LoginPage />,
        },
        {
          path: "/calendar",
          element: <Pages.CalendarPage />,
        },
        {
          path: "/admin",
          element: <Pages.AdminHomePage />,
        },
        {
          path: "/admin/user",
          element: <Pages.AdminHomePage />,
        },
        {
          path: "/*",
          element: <Pages.HomePage />,
        },
      ],
    },
  ];

  return useRoutes(!!isLoggedIn ? Routes : loginRoutes);
}

export default AllRoutes;

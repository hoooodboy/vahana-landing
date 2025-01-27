import React from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import { useMemo, useState } from "react";
import * as Pages from "../pages/index";

import BaseLayout from "./layouts/BaseLayout";
import NavigateReplace from "./NavigateReplace";
import OnBoardingLayout from "./layouts/OnBoardingLayout";

import UAParser from "ua-parser-js";
import LocalStorage from "../local-storage";

function AllRoutes() {
  // const { isLoggedIn } = useAppSelector((st) => st.auth.session);
  const isLoggedIn = LocalStorage.get("accessToken");

  const mobileRoutes: RouteObject[] = [
    {
      element: <BaseLayout />,
      children: [
        {
          path: "/",
          element: <Pages.HomePage />,
        }, // 완
        {
          path: "/*",
          element: <Pages.HomePage />,
        },
      ],
    },
  ];

  // const onBoadingRoutes: RouteObject[] = [
  //   {
  //     element: <OnBoardingLayout />,
  //     children: [
  //       {
  //         path: "/",
  //         element: <Pages.HomePage />,
  //       }, // 완
  //       {
  //         path: "/*",
  //         element: <Pages.HomePage />,
  //       },
  //     ],
  //   },
  // ];

  return useRoutes(mobileRoutes);
}

export default AllRoutes;

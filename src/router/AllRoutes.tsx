import { RouteObject, useRoutes, Navigate } from "react-router-dom";
import * as Pages from "../pages/index";

import BaseLayout from "./layouts/BaseLayout";
import FirstVisitRedirect from "./FirstVisitRedirect";

import tokens from "../tokens";
import PCLayout from "./layouts/PCLayout";
import { useEffect } from "react";
import { setupTokenRefreshTimer } from "../utils/tokenRefresh";
import LocalStorage from "../local-storage";
// import { useRootPage } from "../contexts/RootPageContext"; // 더 이상 필요 없음

// 보호된 라우트를 위한 커스텀 래퍼 컴포넌트
const ProtectedPage = ({ children, requireAuth = true }) => {
  const { accessToken } = tokens;
  const isLoggedIn = !!accessToken;

  // 로그인이 필요한 페이지인데 로그인이 안 되어 있는 경우
  if (requireAuth && !isLoggedIn) {
    // 현재 URL을 저장 (로그인 후 리다이렉트를 위해)
    const currentPath = window.location.pathname;
    LocalStorage.set("redirectAfterLogin", currentPath);

    return <Navigate to="/login" />;
  }

  // 이미 로그인했는데 로그인/가입 페이지에 접근하는 경우
  if (!requireAuth && isLoggedIn) {
    return <Navigate to="/my" />;
  }

  return children;
};

function AllRoutes() {
  const { accessToken } = tokens;
  const isLoggedIn = !!accessToken;
  const path = window.location.pathname;
  // const { isUck } = useRootPage(); // 더 이상 필요 없음

  // 컴포넌트 마운트 시 토큰 만료 확인 및 갱신 타이머 설정
  useEffect(() => {
    if (isLoggedIn) {
      setupTokenRefreshTimer();
    }
  }, [isLoggedIn]);

  // 로그인 하지 않은 사용자를 위한 라우트
  const loginRoutes: RouteObject[] = [
    {
      element: <BaseLayout />,
      children: [
        {
          path: "/",
          element: <FirstVisitRedirect />,
        },
        {
          path: "/vahana",
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
          element: <Pages.LoginPage />,
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
          path: "/privacy",
          element: <Pages.PrivacyPage />,
        },
        {
          path: "/terms",
          element: <Pages.TermsPage />,
        },
        {
          path: "/find-account",
          element: <Pages.FindAccountPage />,
        },
        {
          path: "/subscribe",
          element: <Pages.SubscribeIntroPage />,
        },
        {
          path: "/subscribe/cars",
          element: <Pages.SubscribeCarsPage />,
        },
        {
          path: "/subscribe/cars/:id",
          element: <Pages.SubscribeCarDetailPage />,
        },
        {
          path: "/subscribe/faq",
          element: <Pages.SubscribeFaqPage />,
        },

        {
          path: "/subscribe/:id/apply",
          element: <Pages.SubscribeApplyPage />,
        },
        {
          path: "/subscribe/success",
          element: <Pages.SubscribeSuccessPage />,
        },
        {
          path: "/subscribe/login",
          element: <Pages.SubscribeLoginPage />,
        },
        {
          path: "/subscribe/login/*",
          element: <Pages.SubscribeLoginPage />,
        },
        {
          path: "/subscribe/signup",
          element: <Pages.SubscribeSignupPage />,
        },
        {
          path: "/subscribe/referrer",
          element: <Pages.SubscribeReferrerPage />,
        },
        {
          path: "/subscribe/event",
          element: <Pages.SubscribeEventPage />,
        },
        {
          path: "/subscribe/accounts/kakao",
          element: <Pages.SubscribeKakaoLoadingPage />,
        },
        {
          path: "/subscribe/my",
          element: <Pages.SubscribeMyPage />,
        },
        {
          path: "/subscribe/coupons",
          element: <Pages.SubscribeCouponsPage />,
        },
        {
          path: "/*",
          element: <Pages.HomePage />,
        },
      ],
    },
  ];

  // 로그인 사용자를 위한 라우트 (접근 제어 추가)
  const Routes: RouteObject[] = [
    {
      element: path.includes("/admin") ? <PCLayout /> : <BaseLayout />,
      children: [
        // 로그인 여부와 관계 없이 접근 가능한 페이지들
        {
          path: "/",
          element: <FirstVisitRedirect />,
        },
        {
          path: "/vahana",
          element: <Pages.HomePage />,
        },
        {
          path: "/cars",
          element: <Pages.CarPage />,
        },
        {
          path: "/subscribe/cars",
          element: <Pages.SubscribeCarsPage />,
        },
        {
          path: "/subscribe/cars/:id",
          element: <Pages.SubscribeCarDetailPage />,
        },
        {
          path: "/subscribe/faq",
          element: <Pages.SubscribeFaqPage />,
        },
        {
          path: "/subscribe/:id/apply",
          element: <Pages.SubscribeApplyPage />,
        },
        {
          path: "/subscribe/success",
          element: <Pages.SubscribeSuccessPage />,
        },
        {
          path: "/subscribe/login",
          element: <Pages.SubscribeLoginPage />,
        },
        {
          path: "/subscribe/login/*",
          element: <Pages.SubscribeLoginPage />,
        },
        {
          path: "/subscribe/signup",
          element: <Pages.SubscribeSignupPage />,
        },
        {
          path: "/subscribe/referrer",
          element: <Pages.SubscribeReferrerPage />,
        },
        {
          path: "/subscribe/event",
          element: <Pages.SubscribeEventPage />,
        },
        {
          path: "/subscribe/accounts/kakao",
          element: <Pages.SubscribeKakaoLoadingPage />,
        },
        {
          path: "/subscribe/my",
          element: <Pages.SubscribeMyPage />,
        },
        {
          path: "/subscribe/coupons",
          element: <Pages.SubscribeCouponsPage />,
        },
        {
          path: "/subscribe",
          element: <Pages.SubscribeIntroPage />,
        },
        {
          path: "/pricing",
          element: <Pages.PricingPage />,
        },
        {
          path: "/calendar",
          element: <Pages.CalendarPage />,
        },
        {
          path: "/terms",
          element: <Pages.TermsPage />,
        },
        {
          path: "/privacy",
          element: <Pages.PrivacyPage />,
        },

        // 로그인 상태면 리다이렉트할 페이지들
        {
          path: "/signup",
          element: (
            <ProtectedPage requireAuth={false}>
              <Pages.JoinPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/login",
          element: (
            <ProtectedPage requireAuth={false}>
              <Pages.LoginPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/find-account",
          element: (
            <ProtectedPage requireAuth={false}>
              <Pages.FindAccountPage />
            </ProtectedPage>
          ),
        },

        // 로그인이 필요한 페이지들
        {
          path: "/my",
          element: (
            <ProtectedPage>
              <Pages.MyPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/reservation/:step",
          element: (
            <ProtectedPage>
              <Pages.ReservationPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/schedule-operation/:id",
          element: (
            <ProtectedPage>
              <Pages.ScheduleOperationPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/coupon",
          element: (
            <ProtectedPage>
              <Pages.CouponPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/identify",
          element: (
            <ProtectedPage>
              <Pages.IdentifyPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/qna",
          element: (
            <ProtectedPage>
              <Pages.QnAPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/reservation-detail",
          element: (
            <ProtectedPage>
              <Pages.ReservationDetailPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/user",
          element: (
            <ProtectedPage>
              <Pages.UserPage />
            </ProtectedPage>
          ),
        },

        // 관리자 페이지들 (추가적인 관리자 권한 체크 필요할 수 있음)
        {
          path: "/admin",
          element: (
            <ProtectedPage>
              <Pages.AdminUserPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/admin/user",
          element: (
            <ProtectedPage>
              <Pages.AdminUserPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/admin/reservation",
          element: (
            <ProtectedPage>
              <Pages.AdminReservationPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/admin/cars",
          element: (
            <ProtectedPage>
              <Pages.AdminCarPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/admin/driver",
          element: (
            <ProtectedPage>
              <Pages.AdminDriverPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/admin/car-calendar",
          element: (
            <ProtectedPage>
              <Pages.AdminCalendarPage />
            </ProtectedPage>
          ),
        },
        {
          path: "/admin/*",
          element: (
            <ProtectedPage>
              <Pages.AdminUserPage />
            </ProtectedPage>
          ),
        },

        // 404 페이지
        {
          path: "/*",
          element: <Pages.HomePage />,
        },
      ],
    },
  ];

  // 로그인 상태에 따라 다른 라우트 설정 사용
  return useRoutes(isLoggedIn ? Routes : loginRoutes);
}

export default AllRoutes;

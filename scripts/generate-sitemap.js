import fs from "fs";

(async () => {
  // React Router SPA의 실제 라우트들 (AllRoutes.tsx 기반)
  const routes = [
    { path: "", priority: "1.0", changefreq: "daily" }, // 홈페이지
    { path: "/vahana", priority: "0.9", changefreq: "daily" }, // 홈페이지 별칭
    { path: "/cars", priority: "0.8", changefreq: "daily" }, // 차량 페이지
    { path: "/pricing", priority: "0.8", changefreq: "daily" }, // 가격 페이지
    { path: "/calendar", priority: "0.7", changefreq: "daily" }, // 캘린더 페이지
    { path: "/privacy", priority: "0.6", changefreq: "monthly" }, // 개인정보처리방침
    { path: "/terms", priority: "0.6", changefreq: "monthly" }, // 이용약관
    { path: "/login", priority: "0.5", changefreq: "monthly" }, // 로그인
    { path: "/signup", priority: "0.5", changefreq: "monthly" }, // 회원가입
    { path: "/find-account", priority: "0.5", changefreq: "monthly" }, // 계정찾기
    { path: "/my", priority: "0.7", changefreq: "daily" }, // 마이페이지
    { path: "/reservation/1", priority: "0.8", changefreq: "daily" }, // 예약 페이지
    { path: "/coupon", priority: "0.6", changefreq: "weekly" }, // 쿠폰 페이지
    { path: "/identify", priority: "0.6", changefreq: "weekly" }, // 본인인증
    { path: "/qna", priority: "0.6", changefreq: "weekly" }, // Q&A
    { path: "/reservation-detail", priority: "0.7", changefreq: "daily" }, // 예약 상세
    { path: "/user", priority: "0.7", changefreq: "daily" }, // 사용자 페이지
    { path: "/schedule-operation/1", priority: "0.7", changefreq: "daily" }, // 스케줄 운영
    { path: "/admin", priority: "0.5", changefreq: "weekly" }, // 관리자 페이지
    { path: "/admin/user", priority: "0.5", changefreq: "weekly" }, // 관리자 사용자
    { path: "/admin/reservation", priority: "0.5", changefreq: "weekly" }, // 관리자 예약
    { path: "/admin/cars", priority: "0.5", changefreq: "weekly" }, // 관리자 차량
    { path: "/admin/driver", priority: "0.5", changefreq: "weekly" }, // 관리자 드라이버
    { path: "/admin/car-calendar", priority: "0.5", changefreq: "weekly" }, // 관리자 캘린더
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map((route) => {
      return `
  <url>
    <loc>https://vahana.kr${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join("")}
</urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap);
  console.log("Sitemap generated successfully!");
})();

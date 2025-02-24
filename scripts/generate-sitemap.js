// scripts/generate-sitemap.js
const fs = require("fs");
const globby = require("globby");

(async () => {
  const pages = await globby([
    "src/pages/**/*.tsx",
    "!src/pages/_*.tsx",
    "!src/pages/api",
  ]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const path = page
            .replace("src/pages", "")
            .replace(".tsx", "")
            .replace("/index", "");
          const route = path === "/index" ? "" : path;
          return `
            <url>
              <loc>https://vahana.kr${route}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  fs.writeFileSync("public/sitemap.xml", sitemap);
})();

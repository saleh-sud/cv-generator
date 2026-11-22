/**
 * بعد vite build:
 *  1) يولّد sitemap.xml + robots.txt من site.config.json وسجل المسارات (src/seo/routes.ts)
 *  2) يولّد نسخة HTML ثابتة لكل مسار (title / description / canonical / og) + 404.html
 *     حتى يرى جوجل ومشاركات السوشيال الوسوم الصحيحة بدون انتظار تشغيل JavaScript.
 * يُشغَّل تلقائياً ضمن: npm run build
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const config = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));
const SITE_URL = config.siteUrl.replace(/\/+$/, "");
const today = new Date().toISOString().slice(0, 10);

// حزّم سجل المسارات (TypeScript) إلى ملف مؤقت وحمّله
const tmp = path.join(ROOT, "node_modules", ".cache-routes.mjs");
await build({
  entryPoints: [path.join(ROOT, "src/seo/routes.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmp,
  logLevel: "silent",
});
const { getAllRoutes, NOT_FOUND_META, parseArticle, blocksToHtml, relatedArticles, articleJsonLd, EXTERNAL_SOURCES } = await import(`${pathToFileURL(tmp).href}?v=${Date.now()}`);
fs.rmSync(tmp, { force: true });

// المقالات المولَّدة: نصها الكامل في src/content/articles/<slug>.json
const routes = getAllRoutes().map((r) => {
  if (!r.article?.lazy) return r;
  const file = path.join(ROOT, "src/content/articles", `${r.article.slug}.json`);
  const full = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
  return { ...r, article: { ...r.article, ...full } };
});
const esc = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const urlOf = (p) => (p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`);

// ---------- 1) sitemap + robots ----------
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((r) => !r.noindex)
  .map(
    (r) => `  <url>
    <loc>${esc(urlOf(r.path))}</loc>
    <lastmod>${r.lastmod || today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
// فهرس sitemap إضافي، وملف مفتاح IndexNow (لـ Bing / Yandex)
fs.writeFileSync(
  path.join(DIST, "sitemap-index.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_URL}/sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
</sitemapindex>
`
);
if (config.indexNowKey) fs.writeFileSync(path.join(DIST, `${config.indexNowKey}.txt`), config.indexNowKey);
fs.writeFileSync(
  path.join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\nSitemap: ${SITE_URL}/sitemap-index.xml\n`
);

// ---------- 2) prerender ----------
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const ldScript = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const jsonLd = (r) => {
  if (r.path === "/")
    return ldScript({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: config.siteNameAr,
      alternateName: config.siteNameEn,
      url: `${SITE_URL}/`,
      inLanguage: "ar",
    });
  if (r.article)
    return articleJsonLd(r.article, SITE_URL, config.siteNameAr, SITE_URL + config.ogImage, r.articleLang).map(ldScript).join("");
  return "";
};
const allArticles = routes.filter((r) => r.article && r.articleLang === "ar").map((r) => r.article);

/** محتوى المقال الكامل في HTML الثابت (يراه جوجل فوراً بدون JavaScript). */
function articleBody(a, lang = "ar") {
  const en = lang === "en";
  const base = en ? "/en/blog/" : "/blog/";
  const related = relatedArticles(allArticles, a)
    .map((x) => `<li><a href="${en && x.contentEn ? base : "/blog/"}${x.slug}">${esc(en ? x.titleEn : x.title)}</a></li>`)
    .join("");
  const sources = EXTERNAL_SOURCES.map(
    (s) => `<li><a href="${s.url}" rel="noopener" target="_blank">${esc(en ? s.labelEn : s.label)}</a></li>`
  ).join("");
  return `<main style="max-width:760px;margin:40px auto;padding:0 16px;font-family:sans-serif;line-height:1.8">
<nav aria-label="breadcrumb"><a href="/">${esc(en ? config.siteNameEn : config.siteNameAr)}</a> › <a href="/blog">${en ? "Blog" : "المدونة"}</a></nav>
<article><h1>${esc(en ? a.titleEn : a.title)}</h1><p><time datetime="${a.date}">${a.date}</time> · ${esc(en ? a.categoryEn : a.category)}</p>
<p><strong>${esc(en ? a.summaryEn : a.summary)}</strong></p>
${blocksToHtml(parseArticle(en ? a.contentEn : a.content))}
<p><a href="${en ? "/tools/cv-generator-en" : "/tools/cv-generator-ar"}">${en ? "Build your CV for free" : "أنشئ سيرتك الذاتية مجاناً الآن"}</a></p>
</article>
<h2>${en ? "Related articles" : "مقالات ذات صلة"}</h2><ul>${related}</ul>
<h2>${en ? "Useful resources" : "مصادر مفيدة"}</h2><ul>${sources}</ul>
</main>`;
}

function render(r, { noindex = false } = {}) {
  const url = urlOf(r.path);
  const image = SITE_URL + config.ogImage;
  const head = `<title>${esc(r.title)}</title>
    <meta name="description" content="${esc(r.description)}" />
    <meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow"}" />
    <link rel="canonical" href="${esc(url)}" />${r.alternates ? `
    <link rel="alternate" hreflang="ar" href="${urlOf(r.alternates.ar)}" />
    <link rel="alternate" hreflang="en" href="${urlOf(r.alternates.en)}" />
    <link rel="alternate" hreflang="x-default" href="${urlOf(r.alternates.ar)}" />` : ""}
    <meta property="og:title" content="${esc(r.title)}" />
    <meta property="og:description" content="${esc(r.description)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:type" content="${r.article ? "article" : "website"}" />${r.article ? `
    <meta property="article:published_time" content="${r.article.date}" />` : ""}
    <meta property="og:locale" content="${r.lang === "en" ? "en_US" : "ar_AR"}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(r.title)}" />
    <meta name="twitter:description" content="${esc(r.description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    ${jsonLd(r)}`;
  // روابط الصفحات العامة + أحدث 40 مقالاً فقط (حتى لا يكبر كل ملف HTML مع زيادة المقالات)
  const links = [
    ...routes.filter((x) => !x.article && !x.noindex),
    ...routes.filter((x) => x.article && x.articleLang === "ar").slice(0, 40),
  ]
    .map((x) => `<li><a href="${x.path}">${esc(x.title)}</a></li>`)
    .join("");
  const body = r.article ? articleBody(r.article, r.articleLang) : `<main style="max-width:760px;margin:40px auto;padding:0 16px;font-family:sans-serif"><h1>${esc(
    r.title
  )}</h1><p>${esc(r.description)}</p><nav><ul>${links}</ul></nav></main>`;

  return template
    .replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->/, head)
    .replace('<html lang="ar" dir="rtl">', `<html lang="${r.lang}" dir="${r.lang === "en" ? "ltr" : "rtl"}">`)
    .replace("<!--prerender-->", body);
}

let count = 0;
for (const r of routes) {
  const file = r.path === "/" ? "index.html" : `${r.path.slice(1)}.html`;
  const out = path.join(DIST, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, render(r));
  count++;
}
fs.writeFileSync(
  path.join(DIST, "404.html"),
  render({ ...NOT_FOUND_META, path: "/404", lang: "ar" }, { noindex: true })
);

console.log(`✅ sitemap.xml + robots.txt + ${count} prerendered pages + 404.html  (site: ${SITE_URL})`);

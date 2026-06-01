import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://bright-beignet-44952a.netlify.app";
const ROOT_DIR = process.cwd();
const BLOG_DATA_PATH = path.join(ROOT_DIR, "src", "data", "blogData.ts");
const SEO_TEMPLATES_PATH = path.join(ROOT_DIR, "src", "data", "seoTemplates.ts");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");

const today = new Date().toISOString().slice(0, 10);

function readFileIfExists(filePath) {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cleanUrl(url) {
  return url.replace(/([^:]\/)\/+/g, "$1");
}

function extractBlogArticles(source) {
  const articles = [];
  const blockRegex = /\{[\s\S]*?slug:\s*["']([^"']+)["'][\s\S]*?\}/g;
  let match;

  while ((match = blockRegex.exec(source)) !== null) {
    const block = match[0];
    const slug = match[1]?.trim();
    if (!slug) continue;

    const dateMatch = block.match(/date:\s*["']([^"']+)["']/);
    const date = dateMatch?.[1]?.trim() || today;

    articles.push({ slug, date });
  }

  return articles;
}

function extractArraySection(source, exportName) {
  const startToken = `export const ${exportName}`;
  const startIndex = source.indexOf(startToken);
  if (startIndex === -1) return "";

  const nextExportIndex = source.indexOf("export const ", startIndex + startToken.length);
  if (nextExportIndex === -1) return source.slice(startIndex);

  return source.slice(startIndex, nextExportIndex);
}

function extractSlugs(source) {
  const slugs = [];
  const slugRegex = /slug:\s*["']([^"']+)["']/g;
  let match;

  while ((match = slugRegex.exec(source)) !== null) {
    const slug = match[1]?.trim();
    if (slug) slugs.push(slug);
  }

  return slugs;
}

function addUrl(urls, loc, options = {}) {
  const normalizedLoc = cleanUrl(loc);
  if (urls.some((item) => item.loc === normalizedLoc)) return;

  urls.push({
    loc: normalizedLoc,
    lastmod: options.lastmod || today,
    changefreq: options.changefreq || "weekly",
    priority: options.priority || "0.7",
  });
}

const blogSource = readFileIfExists(BLOG_DATA_PATH);
const seoSource = readFileIfExists(SEO_TEMPLATES_PATH);

const blogArticles = extractBlogArticles(blogSource);
const cvTemplateSlugs = extractSlugs(extractArraySection(seoSource, "SEO_CV_TEMPLATES"));
const jobTemplateSlugs = extractSlugs(extractArraySection(seoSource, "SEO_JOB_TEMPLATES"));

const urls = [];

addUrl(urls, `${SITE_URL}/`, {
  changefreq: "daily",
  priority: "1.0",
});

addUrl(urls, `${SITE_URL}/tools/cv-generator-ar`, {
  changefreq: "weekly",
  priority: "0.9",
});

addUrl(urls, `${SITE_URL}/tools/cv-generator-en`, {
  changefreq: "weekly",
  priority: "0.9",
});

addUrl(urls, `${SITE_URL}/tools/job-description-generator`, {
  changefreq: "weekly",
  priority: "0.9",
});

addUrl(urls, `${SITE_URL}/blog`, {
  changefreq: "daily",
  priority: "0.9",
});

for (const article of blogArticles) {
  addUrl(urls, `${SITE_URL}/blog/${article.slug}`, {
    lastmod: article.date || today,
    changefreq: "monthly",
    priority: "0.8",
  });
}

for (const slug of cvTemplateSlugs) {
  addUrl(urls, `${SITE_URL}/cv/${slug}`, {
    changefreq: "monthly",
    priority: "0.75",
  });
}

for (const slug of jobTemplateSlugs) {
  addUrl(urls, `${SITE_URL}/job-description/${slug}`, {
    changefreq: "monthly",
    priority: "0.75",
  });
}

for (const route of ["/privacy-policy", "/terms", "/about", "/contact"]) {
  addUrl(urls, `${SITE_URL}${route}`, {
    changefreq: "monthly",
    priority: "0.5",
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
    <changefreq>${escapeXml(url.changefreq)}</changefreq>
    <priority>${escapeXml(url.priority)}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.writeFileSync(SITEMAP_PATH, xml, "utf8");

console.log(`✅ sitemap.xml generated successfully with ${urls.length} URLs.`);

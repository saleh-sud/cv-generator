import { BLOG_ARTICLES } from "../data/blogData";
import { SEO_CV_TEMPLATES, SEO_JOB_TEMPLATES } from "../data/seoTemplates";
import type { BlogArticle } from "../types";
import { STATIC_ROUTES, SITE_AR, SITE_EN, type RouteMeta } from "./staticRoutes";
export { STATIC_ROUTES, NOT_FOUND_META, type RouteMeta } from "./staticRoutes";
export { parseArticle, blocksToHtml, relatedArticles, articleJsonLd, EXTERNAL_SOURCES } from "./articleMarkup";

/** للمقال نسخة إنجليزية كافية لصفحة مستقلة؟ */
export const hasEnglish = (a: BlogArticle) => (a.lazy ? !!a.hasEn : (a.contentEn || "").split(/\s+/).length >= 120);

/** مقالات بلا نسخة إنجليزية: رابطها الإنجليزي يُحوَّل 301 إلى النسخة العربية */
export const articlesWithoutEnglish = () => BLOG_ARTICLES.filter((a) => !hasEnglish(a)).map((a) => a.slug);

export function getAllRoutes(): RouteMeta[] {
  const routes: RouteMeta[] = [...STATIC_ROUTES];
  for (const a of [...BLOG_ARTICLES].sort((x, y) => y.date.localeCompare(x.date))) {
    const en = hasEnglish(a);
    const alternates = en ? { en: `/blog/${a.slug}`, ar: `/ar/blog/${a.slug}` } : undefined;
    if (en) {
      routes.push({
        path: `/blog/${a.slug}`,
        lang: "en",
        title: `${a.titleEn} | ${SITE_EN}`,
        description: a.summaryEn,
        lastmod: a.date,
        changefreq: "monthly",
        priority: "0.8",
        article: a,
        articleLang: "en",
        alternates,
      });
    }
    routes.push({
      path: `/ar/blog/${a.slug}`,
      lang: "ar",
      title: `${a.title} | ${SITE_AR}`,
      description: a.summary,
      lastmod: a.date,
      changefreq: "monthly",
      priority: "0.8",
      article: a,
      articleLang: "ar",
      alternates,
    });
  }
  for (const [list, base] of [
    [SEO_CV_TEMPLATES, "/cv/"],
    [SEO_JOB_TEMPLATES, "/job-description/"],
  ] as const) {
    for (const t of list) {
      const alternates = { en: `${base}${t.slug}`, ar: `/ar${base}${t.slug}` };
      routes.push({ path: alternates.en, lang: "en", title: t.metaTitleEn, description: t.metaDescEn, changefreq: "monthly", priority: "0.75", alternates });
      routes.push({ path: alternates.ar, lang: "ar", title: t.metaTitleAr, description: t.metaDescAr, changefreq: "monthly", priority: "0.75", alternates });
    }
  }
  return routes;
}

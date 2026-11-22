import { BLOG_ARTICLES } from "../data/blogData";
import { SEO_CV_TEMPLATES, SEO_JOB_TEMPLATES } from "../data/seoTemplates";
import type { BlogArticle } from "../types";
import { STATIC_ROUTES, SITE_AR, type RouteMeta } from "./staticRoutes";
export { STATIC_ROUTES, NOT_FOUND_META, type RouteMeta } from "./staticRoutes";
export { parseArticle, blocksToHtml, relatedArticles, articleJsonLd, EXTERNAL_SOURCES } from "./articleMarkup";

/** للمقال نسخة إنجليزية كافية لصفحة مستقلة؟ */
export const hasEnglish = (a: BlogArticle) => (a.contentEn || "").split(/\s+/).length >= 120;

export function getAllRoutes(): RouteMeta[] {
  const routes: RouteMeta[] = [...STATIC_ROUTES];
  for (const a of [...BLOG_ARTICLES].sort((x, y) => y.date.localeCompare(x.date))) {
    routes.push({
      path: `/blog/${a.slug}`,
      lang: "ar",
      title: `${a.title} | ${SITE_AR}`,
      description: a.summary,
      lastmod: a.date,
      changefreq: "monthly",
      priority: "0.8",
      article: a,
      articleLang: "ar",
      alternates: hasEnglish(a) ? { ar: `/blog/${a.slug}`, en: `/en/blog/${a.slug}` } : undefined,
    });
    if (hasEnglish(a)) {
      routes.push({
        path: `/en/blog/${a.slug}`,
        lang: "en",
        title: `${a.titleEn} | JobTools`,
        description: a.summaryEn,
        lastmod: a.date,
        changefreq: "monthly",
        priority: "0.6",
        article: a,
        articleLang: "en",
        alternates: { ar: `/blog/${a.slug}`, en: `/en/blog/${a.slug}` },
      });
    }
  }
  for (const t of SEO_CV_TEMPLATES) {
    routes.push({
      path: `/cv/${t.slug}`,
      lang: "ar",
      title: t.metaTitleAr,
      description: t.metaDescAr,
      changefreq: "monthly",
      priority: "0.75",
    });
  }
  for (const t of SEO_JOB_TEMPLATES) {
    routes.push({
      path: `/job-description/${t.slug}`,
      lang: "ar",
      title: t.metaTitleAr,
      description: t.metaDescAr,
      changefreq: "monthly",
      priority: "0.75",
    });
  }
  return routes;
}


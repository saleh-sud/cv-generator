import { BLOG_ARTICLES } from "../data/blogData";
import { SEO_CV_TEMPLATES, SEO_JOB_TEMPLATES } from "../data/seoTemplates";

/** سجلّ المسارات الوحيد: يستخدمه التطبيق، وسكربت الـ sitemap، وسكربت الـ prerender. */
export interface RouteMeta {
  path: string;
  lang: "ar" | "en";
  title: string;
  description: string;
  lastmod?: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
  noindex?: boolean;
}

const SITE_AR = "أدوات الوظائف";

export const STATIC_ROUTES: RouteMeta[] = [
  {
    path: "/",
    lang: "ar",
    title: "أدوات الوظائف | إنشاء سيرة ذاتية CV مجاناً وتوليد وصف وظيفي",
    description: "منصة مجانية لإنشاء سيرة ذاتية احترافية بالعربي والإنجليزي متوافقة مع أنظمة ATS، وتوليد وصف وظيفي لأي مهنة. بدون تسجيل، وتحميل PDF وWord فوراً.",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    path: "/tools/cv-generator-ar",
    lang: "ar",
    title: "إنشاء سيرة ذاتية عربي مجاناً | مولد CV احترافي PDF وWord",
    description: "أنشئ سيرتك الذاتية بالعربي في دقائق: قوالب احترافية متوافقة مع ATS، تعديل مباشر ومعاينة فورية، وتحميل PDF أو Word مجاناً بدون تسجيل.",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/tools/cv-generator-en",
    lang: "en",
    title: "Free CV & Resume Builder (English) | ATS-Friendly PDF & Word",
    description: "Build a professional ATS-friendly English resume in minutes. Choose a template, edit with live preview and download as PDF or Word. Free, no sign-up.",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/tools/job-description-generator",
    lang: "ar",
    title: "مولد وصف وظيفي مجاني لأي مهنة | Job Description Generator",
    description: "ولّد وصفاً وظيفياً احترافياً لأي وظيفة: المسؤوليات والمتطلبات والمهارات بالعربي والإنجليزي، جاهز للنسخ أو التحميل. مجاني تماماً.",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/blog",
    lang: "ar",
    title: "مدونة السير الذاتية والتوظيف | نصائح ATS وكتابة CV",
    description: "مقالات عملية عن كتابة السيرة الذاتية، أنظمة ATS، المقابلات الشخصية والبحث عن عمل، بالعربي والإنجليزي.",
    changefreq: "daily",
    priority: "0.9",
  },
  {
    path: "/about",
    lang: "ar",
    title: `من نحن | ${SITE_AR}`,
    description: "تعرّف على منصة أدوات الوظائف: أدوات مجانية لإنشاء السير الذاتية وتوليد الأوصاف الوظيفية للباحثين عن عمل في الوطن العربي.",
    changefreq: "monthly",
    priority: "0.4",
  },
  {
    path: "/contact",
    lang: "ar",
    title: `تواصل معنا | ${SITE_AR}`,
    description: "للاستفسارات والاقتراحات والإبلاغ عن مشكلة، تواصل مع فريق أدوات الوظائف.",
    changefreq: "monthly",
    priority: "0.4",
  },
  {
    path: "/privacy-policy",
    lang: "ar",
    title: `سياسة الخصوصية | ${SITE_AR}`,
    description: "سياسة الخصوصية: كيف نتعامل مع بياناتك، ملفات تعريف الارتباط، وخدمات الإعلانات والتحليلات المستخدمة في الموقع.",
    changefreq: "monthly",
    priority: "0.3",
  },
  {
    path: "/terms",
    lang: "ar",
    title: `شروط الاستخدام | ${SITE_AR}`,
    description: "شروط وأحكام استخدام موقع أدوات الوظائف وأدوات إنشاء السيرة الذاتية والوصف الوظيفي.",
    changefreq: "monthly",
    priority: "0.3",
  },
];

export function getAllRoutes(): RouteMeta[] {
  const routes: RouteMeta[] = [...STATIC_ROUTES];
  for (const a of BLOG_ARTICLES) {
    routes.push({
      path: `/blog/${a.slug}`,
      lang: "ar",
      title: `${a.title} | ${SITE_AR}`,
      description: a.summary,
      lastmod: a.date,
      changefreq: "monthly",
      priority: "0.8",
    });
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

export const NOT_FOUND_META = {
  title: `الصفحة غير موجودة (404) | ${SITE_AR}`,
  description: "الصفحة المطلوبة غير موجودة.",
};

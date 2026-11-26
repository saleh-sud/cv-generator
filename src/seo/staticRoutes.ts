import type { BlogArticle } from "../types";

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
  /** للمقالات: يُستخدم لتوليد المحتوى الكامل وبيانات BlogPosting في HTML الثابت */
  article?: BlogArticle;
  /** لغة نسخة المقال (ar / en) */
  articleLang?: "ar" | "en";
  /** روابط hreflang البديلة */
  alternates?: { ar: string; en: string };
}

export const SITE_AR = "أدوات الوظائف";

export const SITE_EN = "JobTools";

type Pair = {
  path: string;
  changefreq: RouteMeta["changefreq"];
  priority: string;
  en: { title: string; description: string };
  ar: { title: string; description: string };
};

/** الصفحات العامة بنسختيها: الإنجليزية على الرابط الأساسي والعربية تحت /ar */
const PAIRS: Pair[] = [
  {
    path: "/",
    changefreq: "daily",
    priority: "1.0",
    en: {
      title: "JobTools | Free CV & Resume Builder and Job Description Generator",
      description: "Free tools to build a professional ATS-friendly CV in English or Arabic and generate a job description for any role. No sign-up, instant PDF and Word download.",
    },
    ar: {
      title: "أدوات الوظائف | إنشاء سيرة ذاتية CV مجاناً وتوليد وصف وظيفي",
      description: "منصة مجانية لإنشاء سيرة ذاتية احترافية بالعربي والإنجليزي متوافقة مع أنظمة ATS، وتوليد وصف وظيفي لأي مهنة. بدون تسجيل، وتحميل PDF وWord فوراً.",
    },
  },
  {
    path: "/tools/job-description-generator",
    changefreq: "weekly",
    priority: "0.9",
    en: {
      title: "Free Job Description Generator for Any Role | JobTools",
      description: "Generate a professional job description for any role: responsibilities, requirements and skills in English or Arabic, ready to copy or download. Completely free.",
    },
    ar: {
      title: "مولد وصف وظيفي مجاني لأي مهنة | Job Description Generator",
      description: "ولّد وصفاً وظيفياً احترافياً لأي وظيفة: المسؤوليات والمتطلبات والمهارات بالعربي والإنجليزي، جاهز للنسخ أو التحميل. مجاني تماماً.",
    },
  },
  {
    path: "/blog",
    changefreq: "daily",
    priority: "0.9",
    en: {
      title: "Career & Resume Blog | ATS Tips, CV Writing and Interviews",
      description: "Practical articles on writing a CV, passing ATS systems, job interviews and job hunting in the Arab world and beyond.",
    },
    ar: {
      title: "مدونة السير الذاتية والتوظيف | نصائح ATS وكتابة CV",
      description: "مقالات عملية عن كتابة السيرة الذاتية، أنظمة ATS، المقابلات الشخصية والبحث عن عمل، بالعربي والإنجليزي.",
    },
  },
  {
    path: "/about",
    changefreq: "monthly",
    priority: "0.4",
    en: {
      title: `About Us | ${SITE_EN}`,
      description: "About JobTools: free tools to build CVs and generate job descriptions for job seekers in the Arab world and worldwide.",
    },
    ar: {
      title: `من نحن | ${SITE_AR}`,
      description: "تعرّف على منصة أدوات الوظائف: أدوات مجانية لإنشاء السير الذاتية وتوليد الأوصاف الوظيفية للباحثين عن عمل في الوطن العربي.",
    },
  },
  {
    path: "/contact",
    changefreq: "monthly",
    priority: "0.4",
    en: {
      title: `Contact Us | ${SITE_EN}`,
      description: "Questions, suggestions or a problem to report? Get in touch with the JobTools team.",
    },
    ar: {
      title: `تواصل معنا | ${SITE_AR}`,
      description: "للاستفسارات والاقتراحات والإبلاغ عن مشكلة، تواصل مع فريق أدوات الوظائف.",
    },
  },
  {
    path: "/privacy-policy",
    changefreq: "monthly",
    priority: "0.3",
    en: {
      title: `Privacy Policy | ${SITE_EN}`,
      description: "Privacy policy: how we handle your data, cookies, and the advertising and analytics services used on this site.",
    },
    ar: {
      title: `سياسة الخصوصية | ${SITE_AR}`,
      description: "سياسة الخصوصية: كيف نتعامل مع بياناتك، ملفات تعريف الارتباط، وخدمات الإعلانات والتحليلات المستخدمة في الموقع.",
    },
  },
  {
    path: "/terms",
    changefreq: "monthly",
    priority: "0.3",
    en: {
      title: `Terms of Use | ${SITE_EN}`,
      description: "Terms and conditions for using JobTools and its CV builder and job description tools.",
    },
    ar: {
      title: `شروط الاستخدام | ${SITE_AR}`,
      description: "شروط وأحكام استخدام موقع أدوات الوظائف وأدوات إنشاء السيرة الذاتية والوصف الوظيفي.",
    },
  },
];

const arPath = (p: string) => (p === "/" ? "/ar" : `/ar${p}`);

export const STATIC_ROUTES: RouteMeta[] = [
  ...PAIRS.flatMap((x): RouteMeta[] => {
    const alternates = { en: x.path, ar: arPath(x.path) };
    return [
      { path: x.path, lang: "en", ...x.en, changefreq: x.changefreq, priority: x.priority, alternates },
      { path: arPath(x.path), lang: "ar", ...x.ar, changefreq: x.changefreq, priority: x.priority, alternates },
    ];
  }),
  // منشئا السيرة: لكل واحد لغة ثابتة، وكلٌّ منهما المقابل للآخر
  {
    path: "/tools/cv-generator-en",
    lang: "en",
    title: "Free CV & Resume Builder (English) | ATS-Friendly PDF & Word",
    description: "Build a professional ATS-friendly English resume in minutes. Choose a template, edit with live preview and download as PDF or Word. Free, no sign-up.",
    changefreq: "weekly",
    priority: "0.9",
    alternates: { en: "/tools/cv-generator-en", ar: "/tools/cv-generator-ar" },
  },
  {
    path: "/tools/cv-generator-ar",
    lang: "ar",
    title: "إنشاء سيرة ذاتية عربي مجاناً | مولد CV احترافي PDF وWord",
    description: "أنشئ سيرتك الذاتية بالعربي في دقائق: قوالب احترافية متوافقة مع ATS، تعديل مباشر ومعاينة فورية، وتحميل PDF أو Word مجاناً بدون تسجيل.",
    changefreq: "weekly",
    priority: "0.9",
    alternates: { en: "/tools/cv-generator-en", ar: "/tools/cv-generator-ar" },
  },
];

export const NOT_FOUND_META = {
  title: `Page not found (404) | ${SITE_EN}`,
  description: "The page you requested does not exist.",
};

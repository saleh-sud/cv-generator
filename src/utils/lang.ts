/**
 * لغة الموقع تُحدَّد من الرابط:
 *  - الإنجليزية (الأساسية) على الروابط العادية:   /  /blog  /about ...
 *  - العربية تحت /ar:                             /ar  /ar/blog  /ar/about ...
 *  - منشئا السيرة لهما لغة ثابتة: /tools/cv-generator-ar (عربي) و /tools/cv-generator-en (إنجليزي).
 */
export type Lang = "ar" | "en";

export const LANG_STORAGE_KEY = "site-lang";

/** صفحات لغتها ثابتة ولا تُكرَّر تحت /ar (المقابل في اللغة الأخرى صفحة مختلفة). */
export const FIXED_LANG_PAGES: Record<string, Lang> = {
  "/tools/cv-generator-ar": "ar",
  "/tools/cv-generator-en": "en",
};
const BUILDER_PAIR: Record<string, string> = {
  "/tools/cv-generator-ar": "/tools/cv-generator-en",
  "/tools/cv-generator-en": "/tools/cv-generator-ar",
};

export const isArPath = (p: string) => p === "/ar" || p.startsWith("/ar/");

/** المسار بدون بادئة اللغة: /ar/blog/x -> /blog/x */
export const stripLang = (p: string) => (p === "/ar" ? "/" : p.startsWith("/ar/") ? p.slice(3) : p);

export const langOfPath = (p: string): Lang => FIXED_LANG_PAGES[stripLang(p)] ?? (isArPath(p) ? "ar" : "en");

/** رابط الصفحة نفسها بلغة معيّنة. */
export function withLang(p: string, lang: Lang): string {
  const base = stripLang(p);
  if (FIXED_LANG_PAGES[base]) return base;
  if (lang === "en") return base;
  return base === "/" ? "/ar" : `/ar${base}`;
}

/** رابط الصفحة المقابلة في اللغة الأخرى (لزر التبديل و hreflang). */
export function counterpart(p: string): string {
  const base = stripLang(p);
  if (BUILDER_PAIR[base]) return BUILDER_PAIR[base];
  return withLang(base, langOfPath(p) === "ar" ? "en" : "ar");
}

let current: Lang = "en";
export const setCurrentLang = (l: Lang) => {
  current = l;
};
export const getCurrentLang = () => current;

/** يحوّل رابطاً داخلياً عاماً (مثل "/blog") إلى رابط اللغة الحالية. */
export const L = (p: string) => (p.startsWith("http") ? p : withLang(p, current));

export function savedLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    return v === "ar" || v === "en" ? v : null;
  } catch {
    return null;
  }
}
export function saveLang(l: Lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, l);
  } catch {
    /* ignore */
  }
}

import { SITE } from "../config/site";

export interface SeoOptions {
  title: string;
  description: string;
  path: string;
  lang?: "ar" | "en";
  noindex?: boolean;
  type?: "website" | "article";
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** يحدّث العنوان والوصف والـ canonical ووسوم المشاركة للصفحة الحالية. */
export function setSeo({ title, description, path, lang = "ar", noindex = false, type = "website" }: SeoOptions) {
  const url = SITE.url + (path === "/" ? "/" : path.replace(/\/+$/, ""));
  document.title = title;
  setMeta("name", "description", description);
  setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:type", type);
  setMeta("property", "og:locale", lang === "ar" ? "ar_AR" : "en_US");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}

/** يضع بيانات Schema.org (JSON-LD) الخاصة بالصفحة الحالية، أو يزيلها عند تمرير null. */
export function setJsonLd(data: object | object[] | null) {
  document.head.querySelectorAll('script[data-page-ld]').forEach((n) => n.remove());
  // احذف نسخة HTML الثابتة حتى لا تتكرر
  document.head.querySelectorAll('script[type="application/ld+json"]:not([data-page-ld])').forEach((n) => {
    if (/BlogPosting|BreadcrumbList/.test(n.textContent || "")) n.remove();
  });
  if (!data) return;
  for (const obj of Array.isArray(data) ? data : [data]) {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-page-ld", "");
    el.textContent = JSON.stringify(obj);
    document.head.appendChild(el);
  }
}

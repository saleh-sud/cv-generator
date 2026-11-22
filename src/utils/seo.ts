import { SITE } from "../config/site";

export interface SeoOptions {
  title: string;
  description: string;
  path: string;
  lang?: "ar" | "en";
  noindex?: boolean;
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
export function setSeo({ title, description, path, lang = "ar", noindex = false }: SeoOptions) {
  const url = SITE.url + (path === "/" ? "/" : path.replace(/\/+$/, ""));
  document.title = title;
  setMeta("name", "description", description);
  setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:type", "website");
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

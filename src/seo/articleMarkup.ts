import type { BlogArticle } from "../types";

/**
 * يحوّل نص المقال (الصيغة البسيطة المستخدمة في blogData) إلى كتل منظمة:
 *  - سطر يبدأ بمسافة أو "## " أو "1. " => عنوان فرعي (h2)
 *  - سطر يبدأ بـ "- " أو "* "        => عنصر قائمة
 *  - غير ذلك                          => فقرة
 * ويُستخدم في صفحة المقال (React) وفي ملفات HTML الثابتة (prerender) حتى يقرأ جوجل نفس المحتوى.
 */
export type ArticleBlock =
  | { type: "h2"; text: string; id: string }
  | { type: "ul"; items: string[] }
  | { type: "p"; text: string };

const HEADING_MAX = 90;

export function parseArticle(raw: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let list: string[] | null = null;
  let n = 0;
  const flush = () => {
    if (list) blocks.push({ type: "ul", items: list });
    list = null;
  };

  for (const line of raw.replace(/\r/g, "").split("\n")) {
    const t = line.trim();
    if (!t) {
      flush();
      continue;
    }
    const bullet = t.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      (list ??= []).push(bullet[1]);
      continue;
    }
    flush();
    const md = t.match(/^#{2,3}\s+(.*)$/);
    const numbered = t.match(/^\d+[.)]\s+(.*)$/);
    const indented = /^\s/.test(line) && t.length <= HEADING_MAX && !/[.:؟?!]$/.test(t);
    if (md || numbered || indented) {
      const text = (md?.[1] ?? t).replace(/\*\*/g, "");
      blocks.push({ type: "h2", text, id: `s${++n}` });
    } else {
      blocks.push({ type: "p", text: t });
    }
  }
  flush();
  return blocks;
}

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** **غامق** => <strong> */
export const inlineHtml = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

export function blocksToHtml(blocks: ArticleBlock[]): string {
  return blocks
    .map((b) =>
      b.type === "h2"
        ? `<h2 id="${b.id}">${esc(b.text)}</h2>`
        : b.type === "ul"
          ? `<ul>${b.items.map((i) => `<li>${inlineHtml(i)}</li>`).join("")}</ul>`
          : `<p>${inlineHtml(b.text)}</p>`
    )
    .join("\n");
}

export function wordCount(raw: string): number {
  return raw.split(/\s+/).filter(Boolean).length;
}

/** مقالات ذات صلة: نفس التصنيف أولاً ثم الأحدث. */
export function relatedArticles(all: BlogArticle[], current: BlogArticle, count = 3): BlogArticle[] {
  const others = all.filter((a) => a.slug !== current.slug);
  const score = (a: BlogArticle) => (a.category === current.category ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a) || b.date.localeCompare(a.date)).slice(0, count);
}

/** مصادر خارجية موثوقة تُعرض أسفل كل مقال (روابط مفيدة للقارئ، وتقوّي مصداقية المحتوى). */
export const EXTERNAL_SOURCES: { label: string; labelEn: string; url: string }[] = [
  { label: "ما هو نظام تتبع المتقدمين ATS؟ (ويكيبيديا)", labelEn: "Applicant tracking system (Wikipedia)", url: "https://en.wikipedia.org/wiki/Applicant_tracking_system" },
  { label: "السيرة الذاتية (ويكيبيديا)", labelEn: "Résumé (Wikipedia)", url: "https://en.wikipedia.org/wiki/R%C3%A9sum%C3%A9" },
  { label: "نصائح مهنية من Indeed", labelEn: "Indeed Career Guide", url: "https://www.indeed.com/career-advice" },
  { label: "وظائف LinkedIn", labelEn: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/" },
  { label: "موقع بيت.كوم للوظائف في الخليج", labelEn: "Bayt.com Jobs", url: "https://www.bayt.com/" },
];

export function articleJsonLd(a: BlogArticle, siteUrl: string, siteName: string, image: string) {
  const url = `${siteUrl}/blog/${a.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: a.title,
      alternativeHeadline: a.titleEn,
      description: a.summary,
      inLanguage: "ar",
      datePublished: a.date,
      dateModified: a.date,
      articleSection: a.category,
      wordCount: wordCount(a.content),
      image,
      url,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: siteName, url: siteUrl },
      publisher: { "@type": "Organization", name: siteName, url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.svg` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteName, item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "المدونة", item: `${siteUrl}/blog` },
        { "@type": "ListItem", position: 3, name: a.title, item: url },
      ],
    },
  ];
}

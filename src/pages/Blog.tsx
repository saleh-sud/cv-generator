import { Fragment, useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Clock,
  Calendar,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { BLOG_ARTICLES } from "../data/blogData";
import type { BlogArticle } from "../types";

// كل مقال مولَّد في ملف مستقل يُحمَّل عند فتحه فقط
const ARTICLE_FILES = import.meta.glob<{ default: Partial<BlogArticle> }>("../content/articles/*.json");
import { hasEnglish } from "../seo/routes";
import AdSpace from "../components/AdSpace";
import { setSeo, setJsonLd } from "../utils/seo";
import { SITE } from "../config/site";
import {
  parseArticle,
  inlineHtml,
  relatedArticles,
  articleJsonLd,
  EXTERNAL_SOURCES,
} from "../seo/articleMarkup";

interface BlogProps {
  articleSlug?: string;
  isRtl: boolean;
  onNavigate: (route: string) => void;
}

export default function Blog({
  articleSlug,
  isRtl,
  onNavigate,
}: BlogProps) {

  const articlePath = (slug: string) => {
    const a = BLOG_ARTICLES.find((x) => x.slug === slug);
    // العربية تحت /ar، والإنجليزية على الرابط الأساسي (المقال بلا نسخة إنجليزية يفتح بالعربية)
    return (isRtl || !a || !hasEnglish(a) ? "/ar/blog/" : "/blog/") + slug;
  };

  // مدة القراءة مخزّنة بالعربية ("5 دقائق")؛ بالإنجليزية نعرض "5 min read"
  const readTimeLabel = (t: string) => (isRtl ? t : `${(t.match(/\d+/) || ["5"])[0]} min read`);

  const PAGE = 24;
  const [visible, setVisible] = useState(PAGE);

  // القائمة الإنجليزية تعرض المقالات التي لها نسخة إنجليزية فقط
  const sortedArticles = [...BLOG_ARTICLES]
    .filter((a) => isRtl || hasEnglish(a))
    .sort((a, b) => b.date.localeCompare(a.date));

  const meta = BLOG_ARTICLES.find(
    (art) => art.slug === articleSlug
  );
  const [loaded, setLoaded] = useState<Record<string, BlogArticle>>({});
  const activeArticle = meta?.lazy ? loaded[meta.slug] : meta;

  useEffect(() => {
    if (!meta?.lazy || loaded[meta.slug]) return;
    const load = ARTICLE_FILES[`../content/articles/${meta.slug}.json`];
    load?.().then((m) => setLoaded((prev) => ({ ...prev, [meta.slug]: { ...meta, ...m.default } })));
  }, [meta, loaded]);

  useEffect(() => {
    if (!activeArticle) return; // صفحة /blog نفسها يضبطها App
    setSeo({
      title: (isRtl ? activeArticle.title : activeArticle.titleEn) + " | " + (isRtl ? "أدوات الوظائف" : "JobTools"),
      description: isRtl ? activeArticle.summary : activeArticle.summaryEn,
      path: `${isRtl ? "/ar" : ""}/blog/${activeArticle.slug}`,
      lang: isRtl ? "ar" : "en",
      type: "article",
    });
    setJsonLd(articleJsonLd(activeArticle, SITE.url, "أدوات الوظائف", SITE.url + "/og-image.png", isRtl ? "ar" : "en"));
    return () => setJsonLd(null);
  }, [activeArticle, isRtl]);

  // مقال بلا نسخة إنجليزية فُتح من الرابط الإنجليزي: نعرض رابط النسخة العربية
  if (!isRtl && meta && !hasEnglish(meta)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center" dir="ltr">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-3">{meta.titleEn}</h1>
        <p className="text-slate-600 text-sm mb-6">This article is currently available in Arabic only.</p>
        <a
          href={`/ar/blog/${meta.slug}`}
          onClick={(e) => { e.preventDefault(); onNavigate(`/ar/blog/${meta.slug}`); }}
          className="inline-block px-5 py-2.5 rounded-xl bg-sky-700 text-white font-bold text-sm"
        >
          Read it in Arabic
        </a>
      </div>
    );
  }

  if (meta?.lazy && !activeArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400 text-sm">
        {isRtl ? "جارٍ تحميل المقال..." : "Loading article..."}
      </div>
    );
  }

  if (activeArticle) {

    const title = isRtl
      ? activeArticle.title
      : activeArticle.titleEn;

    const content = isRtl
      ? activeArticle.content
      : activeArticle.contentEn;

    const category = isRtl
      ? activeArticle.category
      : activeArticle.categoryEn;

    const blocks = parseArticle(content);
    const headings = blocks.filter((b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2");
    const midAd = blocks.length > 6 ? Math.floor(blocks.length / 2) : -1;
    const related = relatedArticles(isRtl ? BLOG_ARTICLES : BLOG_ARTICLES.filter(hasEnglish), activeArticle);

    return (
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{
          direction: isRtl ? "rtl" : "ltr",
        }}
      >

        <button
          onClick={() => onNavigate("/blog")}
          className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg mb-6 cursor-pointer"
        >
          {isRtl ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}

          <span>
            {isRtl
              ? "العودة لجميع المقالات"
              : "Back to Blog List"}
          </span>
        </button>

        <article className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10">

          <span className="inline-block px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-md mb-4">
            {category}
          </span>

          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-slate-150 pb-6 mb-6">

            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={activeArticle.date}>{activeArticle.date}</time>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readTimeLabel(activeArticle.readTime)}</span>
            </div>

          </div>

          <AdSpace type="top" isRtl={isRtl} />

          <p className="text-slate-800 font-semibold leading-relaxed mb-6">
            {isRtl ? activeArticle.summary : activeArticle.summaryEn}
          </p>

          {headings.length > 2 && (
            <nav className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-sm">
              <p className="font-bold text-slate-700 mb-2">{isRtl ? "محتويات المقال" : "Contents"}</p>
              <ol className="space-y-1 text-sky-700">
                {headings.map((h) => (
                  <li key={h.id}><a href={`#${h.id}`} className="hover:underline">{h.text}</a></li>
                ))}
              </ol>
            </nav>
          )}

          <div className="text-slate-700 leading-loose">
            {blocks.map((b, i) => (
              <div key={i}>
                {b.type === "h2" ? (
                  <h2 id={b.id} className="text-xl md:text-2xl font-extrabold text-slate-900 mt-8 mb-3 scroll-mt-24">{b.text}</h2>
                ) : b.type === "ul" ? (
                  <ul className="list-disc ps-6 space-y-1.5 my-3">
                    {b.items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{ __html: inlineHtml(it) }} />)}
                  </ul>
                ) : (
                  <p className="my-3" dangerouslySetInnerHTML={{ __html: inlineHtml(b.text) }} />
                )}
                {i === midAd && <AdSpace type="sidebar" isRtl={isRtl} />}
              </div>
            ))}
          </div>

          <AdSpace type="content" isRtl={isRtl} />

          <div className="mt-8 rounded-2xl bg-gradient-to-l from-sky-600 to-blue-700 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-bold">{isRtl ? "جاهز تطبّق النصائح؟ أنشئ سيرتك الذاتية المتوافقة مع ATS مجاناً." : "Ready to apply these tips? Build your ATS-friendly CV for free."}</p>
            <a
              href={isRtl ? "/tools/cv-generator-ar" : "/tools/cv-generator-en"}
              onClick={(e) => { e.preventDefault(); onNavigate(isRtl ? "/tools/cv-generator-ar" : "/tools/cv-generator-en"); }}
              className="bg-white text-blue-700 font-extrabold text-sm px-5 py-2.5 rounded-xl whitespace-nowrap"
            >
              {isRtl ? "ابدأ الآن مجاناً" : "Start free"}
            </a>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">{isRtl ? "مصادر مفيدة" : "Useful resources"}</h2>
            <ul className="list-disc ps-6 space-y-1 text-sm text-sky-700">
              {EXTERNAL_SOURCES.map((src) => (
                <li key={src.url}>
                  <a href={src.url} target="_blank" rel="noopener" className="hover:underline">{isRtl ? src.label : src.labelEn}</a>
                </li>
              ))}
            </ul>
          </section>

        </article>

        <AdSpace type="native" isRtl={isRtl} />

        <section className="mt-10">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">{isRtl ? "مقالات ذات صلة" : "Related articles"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((r) => (
              <a
                key={r.slug}
                href={articlePath(r.slug)}
                onClick={(e) => { e.preventDefault(); onNavigate(articlePath(r.slug)); window.scrollTo(0, 0); }}
                className="block bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all"
              >
                <span className="text-[11px] text-sky-600">{isRtl ? r.category : r.categoryEn}</span>
                <p className="font-bold text-slate-800 text-sm mt-1">{isRtl ? r.title : r.titleEn}</p>
              </a>
            ))}
          </div>
        </section>

      </div>
    );
  }

  return (

    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      style={{
        direction: isRtl ? "rtl" : "ltr",
      }}
    >

      <div className="text-center max-w-2xl mx-auto mb-12">

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full mb-3">
          <BookOpen className="w-3.5 h-3.5" />

          <span>
            {isRtl
              ? "مدونة المعرفة المهنية"
              : "Career Education Library"}
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900">

          {isRtl
            ? "نصائح كتابة السيرة الذاتية وأسرار ATS"
            : "Career Insights & Resume Tips"}

        </h1>

      </div>

      <AdSpace type="top" isRtl={isRtl} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {sortedArticles.slice(0, visible).map((article, index) => {

          const title = isRtl
            ? article.title
            : article.titleEn;

          const summary = isRtl
            ? article.summary
            : article.summaryEn;

          const category = isRtl
            ? article.category
            : article.categoryEn;

          return (
            <Fragment key={article.id}>
            {index > 0 && index % 6 === 0 && (
              <div className="md:col-span-2 lg:col-span-3">
                <AdSpace type={index % 12 === 0 ? "native" : "content"} isRtl={isRtl} />
              </div>
            )}
            <div
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all"
            >

              <div className="p-6">

                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">

                  <span className="text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
                    {category}
                  </span>

                  <span>{article.date}</span>

                </div>

                <h2 className="font-extrabold text-slate-800 text-base mb-2">

                  <a
                    href={articlePath(article.slug)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(articlePath(article.slug));
                    }}
                  >
                    {title}
                  </a>

                </h2>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {summary}
                </p>

              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-xs font-bold text-sky-600">

                <div className="flex items-center gap-1">

                  <Clock className="w-3.5 h-3.5 text-slate-400" />

                  <span className="text-slate-500">
                    {readTimeLabel(article.readTime)}
                  </span>

                </div>

                <button
                  onClick={() =>
                    onNavigate(articlePath(article.slug))
                  }
                  className="flex items-center gap-1 hover:underline cursor-pointer"
                >

                  <span>
                    {isRtl
                      ? "اقرأ المقال بالكامل"
                      : "Read full guide"}
                  </span>

                  {isRtl ? (
                    <ArrowLeft className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}

                </button>

              </div>

            </div>
            </Fragment>
          );
        })}

      </div>

      {visible < sortedArticles.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisible((v) => v + PAGE)}
            className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm cursor-pointer"
          >
            {isRtl ? "عرض المزيد من المقالات" : "Show more articles"}
          </button>
        </div>
      )}

      <AdSpace type="content" isRtl={isRtl} />
      <AdSpace type="native" isRtl={isRtl} />

    </div>
  );
}

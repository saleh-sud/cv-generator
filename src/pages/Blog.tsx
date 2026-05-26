import { useEffect } from "react";
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
import AdSpace from "../components/AdSpace";

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

  const activeArticle = BLOG_ARTICLES.find(
    (art) => art.slug === articleSlug
  );

  useEffect(() => {

    if (activeArticle) {

      const title = isRtl
        ? activeArticle.title
        : activeArticle.titleEn;

      const description = isRtl
        ? activeArticle.summary
        : activeArticle.summaryEn;

      document.title = title + " | JobTools";

      let metaDescription = document.querySelector(
        'meta[name="description"]'
      );

      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }

      metaDescription.setAttribute(
        "content",
        description
      );

      let ogTitle = document.querySelector(
        'meta[property="og:title"]'
      );

      if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        document.head.appendChild(ogTitle);
      }

      ogTitle.setAttribute("content", title);

      let ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );

      if (!ogDescription) {
        ogDescription = document.createElement("meta");
        ogDescription.setAttribute(
          "property",
          "og:description"
        );
        document.head.appendChild(ogDescription);
      }

      ogDescription.setAttribute(
        "content",
        description
      );

    } else {

      document.title = isRtl
        ? "مدونة السير الذاتية والأوصاف الوظيفية | JobTools"
        : "Career & Resume Blog | JobTools";

    }

  }, [activeArticle, isRtl]);

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

    return (
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{
          direction: isRtl ? "rtl" : "ltr",
        }}
      >

        <button
          onClick={() => onNavigate("#/blog")}
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
              <span>{activeArticle.date}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{activeArticle.readTime}</span>
            </div>

          </div>

          <AdSpace type="top" isRtl={isRtl} />

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {content}
            </p>
          </div>

          <AdSpace type="content" isRtl={isRtl} />

        </article>

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

        {BLOG_ARTICLES.map((article) => {

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

            <div
              key={article.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all"
            >

              <div className="p-6">

                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">

                  <span className="text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
                    {category}
                  </span>

                  <span>{article.date}</span>

                </div>

                <h3 className="font-extrabold text-slate-800 text-base mb-2">

                  <a
                    href={"#/blog/" + article.slug}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(
                        "#/blog/" + article.slug
                      );
                    }}
                  >
                    {title}
                  </a>

                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {summary}
                </p>

              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-xs font-bold text-sky-600">

                <div className="flex items-center gap-1">

                  <Clock className="w-3.5 h-3.5 text-slate-400" />

                  <span className="text-slate-500">
                    {article.readTime}
                  </span>

                </div>

                <button
                  onClick={() =>
                    onNavigate(
                      "#/blog/" + article.slug
                    )
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
          );
        })}

      </div>

    </div>
  );
}
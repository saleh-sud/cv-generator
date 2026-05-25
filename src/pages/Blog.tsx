import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, BookOpen, Clock, Calendar, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { BLOG_ARTICLES } from "../data/blogData";
import AdSpace from "../components/AdSpace";

interface BlogProps {
  articleSlug?: string;
  isRtl: boolean;
  onNavigate: (route: string) => void;
}

export default function Blog({ articleSlug, isRtl, onNavigate }: BlogProps) {
  const activeArticle = BLOG_ARTICLES.find(art => art.slug === articleSlug);

  useEffect(() => {
    if (activeArticle) {
      document.title = isRtl ? activeArticle.title : activeArticle.titleEn;
    } else {
      document.title = isRtl 
        ? "مدونة السير الذاتية والأوصاف الوظيفية - نصائح الموارد البشرية والتوظيف" 
        : "Career and Resumes Guidance Blog - HR & ATS Tips";
    }
  }, [activeArticle, isRtl]);

  // If viewing a single article details
  if (activeArticle) {
    const title = isRtl ? activeArticle.title : activeArticle.titleEn;
    const content = isRtl ? activeArticle.content : activeArticle.contentEn;
    const summary = isRtl ? activeArticle.summary : activeArticle.summaryEn;
    const category = isRtl ? activeArticle.category : activeArticle.categoryEn;

    // Help parse markdown headings (#, ##, ###) and lists into simple clean HTML nodes
    const renderProcessedContent = (text: string) => {
      return text.split("\n\n").map((para, idx) => {
        const trimmed = para.trim();
        if (trimmed.startsWith("###")) {
          return (
            <h3 key={idx} className="text-lg md:text-xl font-extrabold text-slate-900 mt-6 mb-3 tracking-snug">
              {trimmed.replace(/^###\s*/, "")}
            </h3>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h2 key={idx} className="text-xl md:text-2xl font-extrabold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2">
              {trimmed.replace(/^##\s*/, "")}
            </h2>
          );
        }
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const listItems = trimmed.split("\n").map(item => item.replace(/^[-*]\s*/, ""));
          return (
            <ul key={idx} className="list-disc pr-5 pl-5 my-4 space-y-2 text-xs md:text-sm text-slate-700">
              {listItems.map((li, liIdx) => (
                <li key={liIdx} className="leading-relaxed pl-1">{li}</li>
              ))}
            </ul>
          );
        }
        // Handle markdown grid tables if present
        if (trimmed.startsWith("|")) {
          const rows = trimmed.split("\n").filter(row => row.trim().length > 0 && !row.includes("---"));
          return (
            <div key={idx} className="overflow-x-auto my-6 border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200 text-xs md:text-sm">
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.map((row, rowIdx) => {
                    const cells = row.split("|").map(c => c.trim()).filter((_, cellIdx, self) => cellIdx > 0 && cellIdx < self.length - 1);
                    const isHeader = rowIdx === 0;
                    return (
                      <tr key={rowIdx} className={isHeader ? "bg-slate-50 font-bold text-slate-800" : "hover:bg-slate-50/50"}>
                        {cells.map((cell, cellId) => (
                          <td key={cellId} className="px-4 py-3 text-right md:text-start whitespace-nowrap font-medium border-l border-r border-slate-100">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={idx} className="text-slate-650 text-xs md:text-sm leading-relaxed text-justify mb-4 whitespace-pre-line pr-0.5">
            {trimmed}
          </p>
        );
      });
    };

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ direction: isRtl ? "rtl" : "ltr" }}>
        
        {/* Back navigation action */}
        <button
          onClick={() => onNavigate("#/blog")}
          className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg mb-6 cursor-pointer"
        >
          {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{isRtl ? "العودة لجميع المقالات" : "Back to Blog List"}</span>
        </button>

        <article className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xs">
          
          {/* Category tag */}
          <span className="inline-block px-2.5 py-1 bg-sky-50 text-sky-700 text-[10px] md:text-xs font-bold rounded-md uppercase tracking-wider mb-4">
            {category}
          </span>

          {/* Title */}
          <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4 text-justify">
            {title}
          </h1>

          {/* Metadata parameters */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 border-b border-slate-150 pb-6 mb-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-350" />
              <span>{activeArticle.date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-350" />
              <span>{isRtl ? `مدة القراءة: ${activeArticle.readTime}` : `Read time: ${activeArticle.readTime}`}</span>
            </div>
          </div>

          {/* Ad Top Slot */}
          <AdSpace type="top" isRtl={isRtl} />

          {/* Processed body text */}
          <div className="prose prose-slate max-w-none text-right">
            {renderProcessedContent(content)}
          </div>

          <AdSpace type="content" isRtl={isRtl} />

        </article>

        {/* Sidebar suggestions banner */}
        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8">
          <h3 className="font-bold text-slate-900 text-lg mb-4">
            {isRtl ? "هل سئمت من القراءة؟ حان وقت التطبيق!" : "Done Reading? Take Action Now!"}
          </h3>
          <p className="text-xs md:text-sm text-slate-500 mb-6 leading-relaxed">
            {isRtl 
              ? "جرّب أدواتنا المجاني لتوليد وبناء سيرتك الذاتية متوافقة بالكامل مع الـ ATS، أو صياغة وصف وظيفي حصين لمهنتك في دقائق." 
              : "Launch our smart engines now to format premium resumes or job requirements card locally."}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("#/tools/cv-generator-ar")}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs md:text-sm transition-all cursor-pointer"
            >
              {isRtl ? "مولد السيرة العربية" : "Create Arabic CV"}
            </button>
            <button
              onClick={() => onNavigate("#/tools/cv-generator-en")}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs md:text-sm transition-all cursor-pointer"
            >
              {isRtl ? "مولد سيرة إنجليزية 🇬🇧" : "Create English CV 🇬🇧"}
            </button>
          </div>
        </div>

      </div>
    );
  }

  // DEFAULT / LIST VIEW representation
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      
      {/* Search landing header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full mb-3">
          <BookOpen className="w-3.5 h-3.5 animate-pulse" />
          <span>{isRtl ? "مدونة المعرفة المهنية" : "Career Education Library"}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {isRtl ? "نصائح كتابة السيرة الذاتية وأسرار الـ ATS" : "Career Insights & Parsing Strategies"}
        </h1>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          {isRtl 
            ? "مقالات وأدلة علمية مبنية على ممارسات الموارد البشرية الفعلية لمساعدتك في الحصول على حظوظ قبول مضاعفة." 
            : "Practical, research-oriented resources detailing compliance variables, core skills mapping, and recruitment standards."}
        </p>
      </div>

      <AdSpace type="top" isRtl={isRtl} />

      {/* Grid of articles cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {BLOG_ARTICLES.map((article) => {
          const title = isRtl ? article.title : article.titleEn;
          const summary = isRtl ? article.summary : article.summaryEn;
          const category = isRtl ? article.category : article.categoryEn;

          return (
            <div 
              key={article.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-6">
                {/* Category & date */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-3.5">
                  <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">{category}</span>
                  <span>{article.date}</span>
                </div>

                {/* Heading */}
                <h3 className="font-extrabold text-slate-800 text-base mb-2 hover:text-sky-600 transition-colors line-clamp-2">
                  <a href={`#/blog/${article.slug}`} onClick={(e) => { e.preventDefault(); onNavigate(`#/blog/${article.slug}`); }}>
                    {title}
                  </a>
                </h3>

                {/* Subtitle brief */}
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                  {summary}
                </p>
              </div>

              {/* Action read button */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-xs font-bold text-sky-600 select-none">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">{article.readTime}</span>
                </div>
                <button
                  onClick={() => onNavigate(`#/blog/${article.slug}`)}
                  className="flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{isRtl ? "اقرأ المقال بالكامل" : "Read full guide"}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

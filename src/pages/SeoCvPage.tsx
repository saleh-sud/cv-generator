import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, Copy, Check, FileEdit, HelpCircle, Lightbulb, FileText, Sparkles } from "lucide-react";
import { SEO_CV_TEMPLATES } from "../data/seoTemplates";
import { CVData } from "../types";
import AdSpace from "../components/AdSpace";

interface SeoCvPageProps {
  slug: string;
  isRtl: boolean;
  onNavigate: (route: string) => void;
  onLoadCvDataToBuilder: (data: CVData, language: "ar" | "en") => void;
}

export default function SeoCvPage({ slug, isRtl, onNavigate, onLoadCvDataToBuilder }: SeoCvPageProps) {
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Match active slug
  const template = SEO_CV_TEMPLATES.find((t) => t.slug === slug);

  useEffect(() => {
    if (template) {
      // SEO Meta tag updates
      document.title = isRtl ? template.metaTitleAr : template.metaTitleEn;
      const metaDescription = document.getElementById("meta-desc");
      if (metaDescription) {
        metaDescription.setAttribute("content", isRtl ? template.metaDescAr : template.metaDescEn);
      }
    }
  }, [template, isRtl]);

  if (!template) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4">
        <h2 className="text-2xl font-bold text-slate-800">العنصر غير موجود - Page Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">تعذر العثور على نموذج السيرة الذاتية المطلوب.</p>
        <button 
          onClick={() => onNavigate("#/")}
          className="mt-6 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg text-sm cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const cv = isRtl ? template.sampleCvAr : template.sampleCvEn;
  const h1 = isRtl ? template.h1Ar : template.h1En;
  const intro = isRtl ? template.introAr : template.introEn;
  const skills = isRtl ? template.skillsAr : template.skillsEn;
  const tips = isRtl ? template.tipsAr : template.tipsEn;
  const faqs = isRtl ? template.faqsAr : template.faqsEn;

  const copySampleText = () => {
    const text = `
السيرة الذاتية لـ: ${cv.fullName}
المسمى الوظيفي: ${cv.jobTitle}
البريد الإلكتروني: ${cv.email} | الهاتف: ${cv.phone}
المدينة: ${cv.city}

الخلاصة:
${cv.summary}

الخبرات:
${cv.experience.map(e => `- ${e.role} في ${e.company} (${e.startDate} - ${e.endDate}): ${e.description}`).join("\n")}

التعليم:
${cv.education.map(ed => `- ${ed.degree} - ${ed.school} (${ed.gradYear})`).join("\n")}

المهارات المعنية:
${cv.skills.join(" - ")}
    `;

    navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleEditThisTemplate = () => {
    // Pre-load data to the live builder page
    onLoadCvDataToBuilder(cv, isRtl ? "ar" : "en");
    // Redirect to builder
    onNavigate(isRtl ? "#/tools/cv-generator-ar" : "#/tools/cv-generator-en");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      
      {/* Sitemap breadcrumb navigator */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 font-medium select-none">
        <button onClick={() => onNavigate("#/")} className="hover:text-sky-600 cursor-pointer">
          {isRtl ? "الرئيسية" : "Home"}
        </button>
        <span>/</span>
        <span className="text-slate-800">{isRtl ? "نماذج سيرة ذاتية" : "CV Templates"}</span>
        <span>/</span>
        <span className="text-sky-600 font-semibold">{isRtl ? template.titleAr : template.titleEn}</span>
      </nav>

      {/* Intro Header */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
        {h1}
      </h1>
      <p className="text-slate-650 text-sm md:text-base leading-relaxed max-w-4xl mb-8">
        {intro}
      </p>

      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main core layout (Spans 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Ad Space Top */}
          <AdSpace type="top" isRtl={isRtl} />

          {/* Sample CV Container Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500" />
                <span className="font-bold text-slate-800 text-sm">
                  {isRtl ? "النموذج الجاهز والصيغة المعتمدة" : "Predefined Format Sample"}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={copySampleText}
                  className="flex-1 sm:flex-initial px-3 py-1.5 text-xs bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-700 font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isRtl ? "تم النسخ!" : "copied!") : (isRtl ? "نسخ السيرة كلياً" : "Copy Resume")}</span>
                </button>
                <button
                  onClick={handleEditThisTemplate}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs shadow-sky-600/10"
                >
                  <FileEdit className="w-3.5 h-3.5 text-sky-200" />
                  <span>{isRtl ? "تعديل هذا النموذج وفهرسته" : "Customize Template"}</span>
                </button>
              </div>
            </div>

            {/* Print preview structured inside page */}
            <div className="p-6 md:p-8 text-slate-800 bg-white" style={{ direction: isRtl ? "rtl" : "ltr" }}>
              <div className="text-center border-b border-slate-200 pb-5 mb-5">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{cv.fullName}</h2>
                <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wide">{cv.jobTitle}</p>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-3 font-medium">
                  <span>📧 {cv.email}</span>
                  <span>📞 {cv.phone}</span>
                  <span>📍 {cv.city}</span>
                </div>
              </div>

              {/* Summary */}
              {cv.summary && (
                <div className="mb-5">
                  <h4 className="text-xs font-black text-slate-900 bg-slate-100/80 px-2.5 py-1 rounded-sm uppercase tracking-wider mb-2 border-r-4 border-slate-800">
                    {isRtl ? "الخلاصة الكلية" : "Career Summary"}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">{cv.summary}</p>
                </div>
              )}

              {/* Experiences */}
              <div className="mb-5 text-xs">
                <h4 className="text-xs font-black text-slate-900 bg-slate-100/80 px-2.5 py-1 rounded-sm uppercase tracking-wider mb-2 border-r-4 border-slate-800">
                  {isRtl ? "التاريخ العملي" : "Experiences"}
                </h4>
                <div className="space-y-4">
                  {cv.experience.map((exp, id) => (
                    <div key={id}>
                      <div className="flex justify-between font-bold text-slate-900 flex-wrap">
                        <span>{exp.role}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <p className="text-[11px] font-bold text-sky-700 mt-0.5">{exp.company}</p>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed text-justify">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-5 text-sm">
                <h4 className="text-xs font-black text-slate-900 bg-slate-100/80 px-2.5 py-1 rounded-sm uppercase tracking-wider mb-2 border-r-4 border-slate-800">
                  {isRtl ? "التعليم" : "Education"}
                </h4>
                {cv.education.map((edu, id) => (
                  <div key={id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900 flex-wrap">
                      <span>{edu.degree}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{edu.gradYear}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{edu.school} - {edu.city}</p>
                  </div>
                ))}
              </div>

              {/* Bottom dynamic badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-black text-slate-900 bg-slate-100/80 px-2.5 py-1 rounded-sm uppercase tracking-wider mb-2 border-r-4 border-slate-800">
                    {isRtl ? "المهارات" : "Technical Skills"}
                  </h4>
                  <ul className="list-disc pr-4 space-y-1 text-xs text-slate-700 font-medium">
                    {cv.skills.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 bg-slate-100/80 px-2.5 py-1 rounded-sm uppercase tracking-wider mb-2 border-r-4 border-slate-800">
                    {isRtl ? "الدورات واللغات" : "Certs & Languages"}
                  </h4>
                  <ul className="list-disc pr-4 space-y-1 text-xs text-slate-700 font-medium">
                    {cv.certifications.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                    {cv.languages.map((l, idx) => (
                      <li key={idx}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* Tips to Improve CV */}
          <div className="bg-sky-50 border border-sky-100 p-5 md:p-6 rounded-2xl shadow-xs">
            <h3 className="font-bold text-sky-900 text-lg mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 animate-pulse" />
              <span>{isRtl ? "نصائح حركية لتعزيز هذه السيرة الذاتية" : "Expert Growth Hacks for this Resume"}</span>
            </h3>
            <ul className="space-y-3 text-sm text-sky-850">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-600 mt-1">✔</span>
                  <p className="flex-1 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Ad Space Mid */}
          <AdSpace type="content" isRtl={isRtl} />

          {/* FAQ Accordion */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              {isRtl ? "أسئلة شائعة حول هذه الوظيفة وسيرتها" : "Common Profile Q&As"}
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-xs">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center p-4 text-right font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer text-sm md:text-base focus:outline-hidden"
                    >
                      <span>{faq.q}</span>
                      <span className="text-slate-400 font-bold">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-slate-50 border-t border-slate-105 text-xs md:text-sm text-slate-500 leading-relaxed text-right">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right sidebar layout (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Appropriate Skills Checklist column */}
          <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm md:text-base border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
              <span>{isRtl ? "مهارات فريضة بالسي في" : "Core Skills Checklist"}</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
              {isRtl 
                ? "احرص على تطابق مهاراتك الفعالة مع القائمة الآتية لزيادة مطابقة ملف الـ ATS:" 
                : "Secure these exact variables inside your profile blocks to scale robot matching scores:"}
            </p>
            <div className="space-y-2.5">
              {skills.map((st, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></div>
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ad space sidebar */}
          <AdSpace type="sidebar" isRtl={isRtl} />

        </div>

      </div>

    </div>
  );
}

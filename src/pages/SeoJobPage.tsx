import { useEffect, useState } from "react";
import { Copy, Check, FileEdit, HelpCircle, Briefcase, Sparkles } from "lucide-react";
import { SEO_JOB_TEMPLATES } from "../data/seoTemplates";
import { JobDescInput } from "../types";
import AdSpace from "../components/AdSpace";

interface SeoJobPageProps {
  slug: string;
  isRtl: boolean;
  onNavigate: (route: string) => void;
  onLoadJobDataToBuilder: (data: JobDescInput) => void;
}

export default function SeoJobPage({ slug, isRtl, onNavigate, onLoadJobDataToBuilder }: SeoJobPageProps) {
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Match template based on slug
  const template = SEO_JOB_TEMPLATES.find((t) => t.slug === slug);

  useEffect(() => {
    if (template) {
      // Dynamic page title & description for SEO
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
        <p className="text-slate-500 text-sm mt-2">تعذر العثور على بطاقة الوصف الوظيفي المطلوبة.</p>
        <button 
          onClick={() => onNavigate("#/")}
          className="mt-6 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg text-sm cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const h1 = isRtl ? template.h1Ar : template.h1En;
  const jobTitle = isRtl ? template.jobTitleAr : template.jobTitleEn;
  const department = isRtl ? template.departmentAr : template.departmentEn;
  const summary = isRtl ? template.summaryAr : template.summaryEn;
  const responsibilities = isRtl ? template.responsibilitiesAr : template.responsibilitiesEn;
  const requirements = isRtl ? template.requirementsAr : template.requirementsEn;
  const skills = isRtl ? template.skillsAr : template.skillsEn;
  const keywords = isRtl ? template.keywordsAr : template.keywordsEn;
  const faqs = isRtl ? template.faqsAr : template.faqsEn;

  const copyJobText = () => {
    const textBuilder = `
الوصف الوظيفي لمهنة: ${jobTitle}
القسم: ${department}

ملخص الوظيفة:
${summary}

المهام والمسؤوليات الأساسية:
${responsibilities.map((r, i) => `${i + 1}. ${r}`).join("\n")}

المؤهلات المطلوبة وشروط التقديم:
${requirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}

المهارات المطلوبة:
${skills.join(" - ")}
    `;

    navigator.clipboard.writeText(textBuilder.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleUseToGenerate = () => {
    const dataToSeed: JobDescInput = {
      jobTitle: isRtl ? template.jobTitleAr : template.jobTitleEn,
      department: isRtl ? template.departmentAr : template.departmentEn,
      contractType: isRtl ? "دوام كامل (Full-Time)" : "Full-Time",
      location: isRtl ? "حضوري (On-Site)" : "On-Site",
      experienceYears: isRtl ? "سنتين إلى 4 سنوات" : "2-4 years",
      responsibilities: responsibilities.map((r, i) => `${i + 1}. ${r}`).join("\n"),
      requirements: requirements.map((r, i) => `- ${r}`).join("\n"),
      skills: skills.join("، "),
      salary: isRtl ? "6,000 - 10,000 ريال سعودي" : "6,000 - 10,000 SAR"
    };

    onLoadJobDataToBuilder(dataToSeed);
    onNavigate("#/tools/job-description-generator");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      
      {/* Breadcrumb breading paths */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 font-medium select-none">
        <button onClick={() => onNavigate("#/")} className="hover:text-sky-600 cursor-pointer">
          {isRtl ? "الرئيسية" : "Home"}
        </button>
        <span>/</span>
        <span className="text-slate-800">{isRtl ? "تفاصيل الوظائف" : "Job Specifications"}</span>
        <span>/</span>
        <span className="text-emerald-600 font-semibold">{isRtl ? `وصف ${template.titleAr}` : template.titleEn}</span>
      </nav>

      {/* Main Title heading */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
        {h1}
      </h1>
      <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-slate-400">
        <span>{isRtl ? "دليل التوظيف الرسمي" : "Official Hiring Ledger"}</span>
        <span className="text-slate-205">•</span>
        <span>{isRtl ? "مُحدث لعام 2026" : "Updated for 2026"}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Core display (Spans 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-8">
          
          <AdSpace type="top" isRtl={isRtl} />

          {/* Job description card template */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Briefcase className="w-5 h-5" />
                <span>{isRtl ? "بطاقة الوصف الوظيفي قابلة للنسخ" : "Deployable Job Spec Card"}</span>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={copyJobText}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 text-xs bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-700 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isRtl ? "تم النسخ!" : "Copied!") : (isRtl ? "نسخ الوصف بالكامل" : "Copy Description")}</span>
                </button>
                <button
                  onClick={handleUseToGenerate}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs shadow-emerald-600/10"
                >
                  <FileEdit className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{isRtl ? "تحميل في أداة التعديل" : "Edit as Template"}</span>
                </button>
              </div>
            </div>

            {/* Spec details representation */}
            <div className="p-6 md:p-8 space-y-5 bg-white">
              
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block mb-1">
                  {department}
                </span>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {jobTitle}
                </h3>
              </div>

              {/* General Summary */}
              <div>
                <h4 className="text-xs font-black text-slate-900 bg-slate-100/80 px-2.5 py-1 rounded-sm mb-2 border-r-4 border-emerald-500">
                  {isRtl ? "ملخص الوظيفة والدور" : "Job Summary"}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  {summary}
                </p>
              </div>

              {/* Responsibilities list */}
              <div>
                <h4 className="text-xs font-black text-slate-900 bg-slate-100/80 px-2.5 py-1 rounded-sm mb-2.5 border-r-4 border-emerald-500">
                  {isRtl ? "المهام والمسؤوليات الأساسية" : "Key Responsibilities"}
                </h4>
                <ul className="list-decimal pr-4 space-y-2 text-xs text-slate-700">
                  {responsibilities.map((r, id) => (
                    <li key={id} className="leading-relaxed pl-1 text-justify">{r}</li>
                  ))}
                </ul>
              </div>

              {/* Qualifications */}
              <div>
                <h4 className="text-xs font-black text-slate-900 bg-slate-100/80 px-2.5 py-1 rounded-sm mb-2.5 border-r-4 border-emerald-500">
                  {isRtl ? "المؤهلات المطلوبة وشروط التقديم" : "Required Qualifications"}
                </h4>
                <ul className="list-disc pr-4 space-y-1.5 text-xs text-slate-700">
                  {requirements.map((r, id) => (
                    <li key={id} className="leading-relaxed pl-1 text-justify">{r}</li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-xs font-black text-slate-900 bg-slate-100/80 px-2.5 py-1 rounded-sm mb-2.5 border-r-4 border-emerald-500">
                  {isRtl ? "المهارات المطلوبة" : "Skills Requirements"}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-xs bg-slate-100/80 text-slate-700 border border-slate-200 rounded-md font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

          <AdSpace type="content" isRtl={isRtl} />

          {/* FAQs section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              {isRtl ? "أسئلة شائعة حول التوصيف والتعيين" : "Recruitment FAQ Ledger"}
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

        {/* Right column: Keywords and ads metadata (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Keywords tags */}
          <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm md:text-base border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isRtl ? "الكلمات المفتاحية الـ SEO" : "Target SEO Keywords"}</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
              {isRtl 
                ? "يساعد إدراج الكلمات الدلالية التالية في إعلانك الوظيفي على جلب زيارات قوية من محركات البحث:" 
                : "These secondary terms help elevate your job listings rank on standard search queries:"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 text-[10px] bg-slate-105/85 hover:bg-emerald-50 hover:text-emerald-700 text-slate-650 rounded-md border border-slate-200 font-medium transition-all">
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          <AdSpace type="sidebar" isRtl={isRtl} />

        </div>

      </div>

    </div>
  );
}

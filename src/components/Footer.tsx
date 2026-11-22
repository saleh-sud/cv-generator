import React from "react";
import { Briefcase, FileText, Library, HelpCircle, ShieldCheck } from "lucide-react";
import { SITE } from "../config/site";
import { SEO_CV_TEMPLATES, SEO_JOB_TEMPLATES } from "../data/seoTemplates";

interface FooterProps {
  isRtl: boolean;
  onNavigate: (route: string) => void;
}

export default function Footer({ isRtl, onNavigate }: FooterProps) {
  const handleLinkClick = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    onNavigate(route);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-850 mt-16" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Pitch & Meta */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black font-mono">
                CV
              </div>
              <span>{isRtl ? "أدوات الوظائف" : "JobTools"}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isRtl 
                ? "منصة مجانية وعلمية لتصميم السير الذاتية وتوليد الأوصاف الوظيفية بدقة عالية، مبنية وفق معايير التوافق مع أنظمة التوظيف ATS لرفع نسب القبول."
                : "A free platform to draft professional resumes and compile job descriptions, optimized for ATS parsers to enhance hiring callback frequencies."}
            </p>
            <div className="text-xs text-slate-400">
              <p>© {new Date().getFullYear()} {isRtl ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
              <p className="mt-1 font-mono text-sky-400/80">{isRtl ? "تعديل محلي آمن في المتصفح" : "Secure browser-side creation"}</p>
            </div>
          </div>

          {/* Column 2: CV Libraries */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>{isRtl ? "نماذج سيرة ذاتية جاهزة" : "CV Templates"}</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {SEO_CV_TEMPLATES.map((item) => (
                <li key={item.slug}>
                  <a
                    href={`/cv/${item.slug}`}
                    onClick={(e) => handleLinkClick(e, `/cv/${item.slug}`)}
                    className="hover:text-sky-400 transition-colors block text-right md:text-start"
                  >
                    {isRtl ? item.titleAr : item.titleEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Job Specifications Libraries */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
              <Library className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? "نماذج أوصاف وظيفية ممتازة" : "Job Descriptions"}</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {SEO_JOB_TEMPLATES.map((item) => (
                <li key={item.slug}>
                  <a
                    href={`/job-description/${item.slug}`}
                    onClick={(e) => handleLinkClick(e, `/job-description/${item.slug}`)}
                    className="hover:text-emerald-400 transition-colors block text-right md:text-start"
                  >
                    💼 {isRtl ? `وصف وظيفي ${item.titleAr}` : `${item.titleEn} Job Description`}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Links & Privacy Guidelines */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>{isRtl ? "المساعدة والصفحات القانونية" : "Legal & Documentation"}</span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, "/about")}
                  className="hover:text-sky-400 transition-colors block text-right md:text-start"
                >
                  ℹ️ {isRtl ? "عن المنصة" : "About Us"}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, "/contact")}
                  className="hover:text-sky-400 transition-colors block text-right md:text-start"
                >
                  📧 {isRtl ? "اتصل بنا" : "Contact Support"}
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => handleLinkClick(e, "/privacy-policy")}
                  className="hover:text-sky-400 transition-colors block text-right md:text-start"
                >
                  🔒 {isRtl ? "سياسة الخصوصية والأمان" : "Privacy Policy"}
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLinkClick(e, "/terms")}
                  className="hover:text-sky-400 transition-colors block text-right md:text-start"
                >
                  📄 {isRtl ? "الشروط والأحكام" : "Terms & Conditions"}
                </a>
              </li>
              {SITE.waslUrl && (
                <li>
                  <a
                    href={SITE.waslUrl}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-sky-400 transition-colors block text-right md:text-start"
                  >
                    🔗 {isRtl ? "تابعنا على وصل (WASL)" : "Find us on WASL"}
                  </a>
                </li>
              )}
              <li className="pt-2 border-t border-slate-800">
                <a
                  href="/blog"
                  onClick={(e) => handleLinkClick(e, "/blog")}
                  className="hover:text-sky-400 text-sky-400 font-semibold transition-colors block text-right md:text-start text-xs"
                >
                  💡 {isRtl ? "مدونة النصائح المهنية والـ ATS" : "Career & ATS Advice Blog"}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Outer banner message */}
        <div className="mt-12 pt-8 border-t border-slate-850 text-center text-xs text-slate-400 leading-relaxed">
          <p>
            {isRtl 
              ? "إخلاء مسؤولية: بيانات السيرة الذاتية التي تدخلها تُعالج وتُحفظ على متصفحك فقط (localStorage) ولا تُرفع إلى خوادمنا. يعرض الموقع إعلانات وتحليلات من أطراف ثالثة، راجع سياسة الخصوصية."
              : "Disclaimer: Your CV data is processed and stored in your browser only (localStorage) and is never uploaded to our servers. The site shows third-party ads and analytics; see the Privacy Policy."}
          </p>
        </div>
      </div>
      
      {/* Hadi Saleh credits section with highly readable contrast */}
      <div className="bg-slate-50 border-t border-slate-200 py-3.5 text-center w-full" id="developer-credits">
        <p className="text-sm font-semibold tracking-wide" style={{ color: "#333", margin: 0 }}>
          Made with 🖤 by Hadi Saleh
        </p>
      </div>
    </footer>
  );
}

import React from "react";
import { CVData } from "../../types";

interface TemplateProps {
  cv: CVData;
  isRtl: boolean;
}

export default function ModernTemplate({ cv, isRtl }: TemplateProps) {
  const alignClass = isRtl ? "text-right" : "text-left";
  const flexDir = isRtl ? "flex-row-reverse" : "flex-row";
  const borderClass = isRtl ? "border-r-4 pr-3 text-right" : "border-l-4 pl-3 text-left";

  return (
    <div 
      className={`w-full bg-white text-slate-800 font-sans p-6 md:p-8 rounded-lg overflow-hidden leading-relaxed ${alignClass}`}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Top Banner Accent */}
      <div className="h-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 rounded-t-lg -mx-8 -mt-8 mb-6" />

      {/* Header Profile Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5 md:pb-6 md:mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1.5">
            {cv.fullName || (isRtl ? "الاسم الكامل" : "Your Full Name")}
          </h2>
          <p className="text-sm md:text-base font-bold text-sky-600 tracking-wide uppercase">
            {cv.jobTitle || (isRtl ? "المسمى الوظيفي المستهدف" : "Target Job Title")}
          </p>
        </div>

        {/* Contacts details in high visual density design */}
        <div className="flex flex-col gap-1 text-xs text-slate-500 font-medium bg-slate-50/80 p-3 rounded-xl border border-slate-100 min-w-[200px]">
          {cv.email && <div className="flex items-center gap-1.5"><span>📧</span> <span className="underline">{cv.email}</span></div>}
          {cv.phone && <div className="flex items-center gap-1.5"><span>📞</span> <span>{cv.phone}</span></div>}
          {cv.city && <div className="flex items-center gap-1.5"><span>📍</span> <span>{cv.city}</span></div>}
        </div>
      </div>

      {/* Content Columns Structure */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Right side for summary & experience: 8 columns */}
        <div className="md:col-span-8 space-y-6">
          {/* Summary / Profile info */}
          {cv.summary && (
            <div>
              <h3 className={`text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100 flex items-center gap-1.5 ${borderClass} border-sky-500`}>
                {isRtl ? "عنّي والملخص المهني" : "Professional Summary"}
              </h3>
              <p className="text-xs md:text-sm text-slate-650 leading-relaxed max-w-prose">
                {cv.summary}
              </p>
            </div>
          )}

          {/* Core Experiences */}
          {cv.experience && cv.experience.length > 0 && (
            <div>
              <h3 className={`text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-100 flex items-center gap-1.5 ${borderClass} border-sky-500`}>
                {isRtl ? "التاريخ الوظيفي والخبرات" : "Professional Experience"}
              </h3>
              <div className="space-y-4">
                {cv.experience.map((exp, idx) => (
                  <div key={idx} className="group relative border-l-2 border-slate-100 pl-4 last:border-0 pb-1">
                    <div className="absolute w-2.5 h-2.5 bg-sky-500 rounded-full -left-[6px] top-1.5 ring-4 ring-white" />
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-tight">
                        {exp.role || (isRtl ? "مسمى الدور الوظيفي" : "Role / Title")}
                      </h4>
                      <span className="text-[10px] md:text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                        {exp.startDate} - {exp.endDate || (isRtl ? "الآن" : "Present")}
                      </span>
                    </div>
                    <p className="text-[11px] md:text-xs font-extrabold text-slate-600 mb-1.5">
                      {exp.company || (isRtl ? "الشركة أو المؤسسة" : "Company / Organization")}
                    </p>
                    {exp.description && (
                      <p className="text-[11px] md:text-xs text-slate-650 leading-relaxed pr-2">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Left column sidebar: 4 columns for skills, education, languages */}
        <div className="md:col-span-4 space-y-6">
          {/* Key skills with modern tags */}
          {cv.skills && cv.skills.length > 0 && (
            <div>
              <h3 className={`text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 ${borderClass} border-indigo-500`}>
                {isRtl ? "المهارات التقنية" : "Key Competencies"}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] md:text-xs font-bold text-indigo-700 bg-indigo-50/70 border border-indigo-150 px-2.5 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cv.education && cv.education.length > 0 && (
            <div>
              <h3 className={`text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 ${borderClass} border-indigo-500`}>
                {isRtl ? "المؤهلات التعليمية" : "Education"}
              </h3>
              <div className="space-y-3">
                {cv.education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <h4 className="font-extrabold text-slate-900 leading-tight">
                      {edu.degree || (isRtl ? "الدرجة العلمية" : "Degree")}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      {edu.school || (isRtl ? "الجامعة أو المعهد" : "School / Institution")}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-bold">
                      {edu.city && <span>{edu.city}</span>}
                      {edu.gradYear && <span className="bg-slate-100 px-1.5 py-0.5 rounded">{edu.gradYear}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {cv.certifications && cv.certifications.length > 0 && (
            <div>
              <h3 className={`text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 ${borderClass} border-indigo-500`}>
                {isRtl ? "الشهادات والاعتمادات" : "Certifications"}
              </h3>
              <ul className="space-y-1.5">
                {cv.certifications.map((cert, idx) => (
                  <li key={idx} className="text-[11px] md:text-xs text-slate-650 flex items-start gap-1 pb-1 border-b border-slate-50 last:border-0">
                    <span className="text-sky-500 mt-0.5">⭐</span>
                    <span className="font-medium">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {cv.languages && cv.languages.length > 0 && (
            <div>
              <h3 className={`text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 ${borderClass} border-indigo-500`}>
                {isRtl ? "اللغات" : "Languages"}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cv.languages.map((lang, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] md:text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-250 px-2 py-0.5 rounded-md"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { CVData } from "../../types";

interface TemplateProps {
  cv: CVData;
  isRtl: boolean;
}

export default function ClassicTemplate({ cv, isRtl }: TemplateProps) {
  const alignClass = "text-center";
  const contentAlignClass = isRtl ? "text-right" : "text-left";
  const borderClass = "border-b border-double border-slate-600 pb-1 mb-3";

  return (
    <div 
      className="w-full bg-white text-slate-900 p-8 md:p-10 rounded-lg overflow-hidden leading-relaxed font-serif"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Centered Name and Contacts */}
      <div className={`${alignClass} border-b-2 border-slate-800 pb-4 mb-6`}>
        <h2 className="text-3xl font-bold tracking-wide text-slate-900 font-serif leading-none mb-2">
          {cv.fullName || (isRtl ? "الاسم الكامل" : "Your Full Name")}
        </h2>
        <p className="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-widest mb-3">
          {cv.jobTitle || (isRtl ? "المسمى الوظيفي المستهدف" : "Target Job Title")}
        </p>
        
        {/* Simple single line separated metadata */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
          {cv.email && <span>📧 {cv.email}</span>}
          {cv.phone && <span>📞 {cv.phone}</span>}
          {cv.city && <span>📍 {cv.city}</span>}
        </div>
      </div>

      {/* Profile Summary */}
      {cv.summary && (
        <div className="mb-6">
          <h3 className={`text-xs font-bold text-slate-900 uppercase tracking-widest ${borderClass} ${contentAlignClass}`}>
            {isRtl ? "الخلاصة والملخص المهني" : "Professional Summary"}
          </h3>
          <p className={`text-xs text-slate-700 leading-relaxed max-w-4xl font-serif ${contentAlignClass}`}>
            {cv.summary}
          </p>
        </div>
      )}

      {/* Industrial Experience */}
      {cv.experience && cv.experience.length > 0 && (
        <div className="mb-6">
          <h3 className={`text-xs font-bold text-slate-900 uppercase tracking-widest ${borderClass} ${contentAlignClass}`}>
            {isRtl ? "الخبرات السابقة والسيرة المهنية" : "Professional Experience"}
          </h3>
          <div className="space-y-4">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className={`text-xs ${contentAlignClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1 font-bold">
                  <span className="text-slate-900 text-sm font-bold">
                    {exp.role || (isRtl ? "مسمى الدور الوظيفي" : "Role / Title")}
                  </span>
                  <span className="text-slate-500 font-normal">
                    {exp.startDate} - {exp.endDate || (isRtl ? "الآن" : "Present")}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mb-1.5 italic">
                  {exp.company || (isRtl ? "الشركة أو المؤسسة" : "Company / Organization")}
                </div>
                {exp.description && (
                  <p className="text-slate-700 leading-relaxed text-[11px] pr-1">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic Qualifications & Skills side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column Left: Education */}
        {cv.education && cv.education.length > 0 && (
          <div>
            <h3 className={`text-xs font-bold text-slate-900 uppercase tracking-widest ${borderClass} ${contentAlignClass}`}>
              {isRtl ? "التعليم والمؤهلات الأكاديمية" : "Education"}
            </h3>
            <div className="space-y-3">
              {cv.education.map((edu, idx) => (
                <div key={idx} className={`text-xs ${contentAlignClass}`}>
                  <h4 className="font-bold text-slate-900">
                    {edu.degree || (isRtl ? "الدرجة العلمية" : "Degree")}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {edu.school || (isRtl ? "الجامعة أو المعهد" : "School / Institution")}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                    {edu.city && <span>{edu.city}</span>}
                    {edu.gradYear && <span>{edu.gradYear}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Column Right: Skills & Certifications */}
        <div className="space-y-5">
          {cv.skills && cv.skills.length > 0 && (
            <div>
              <h3 className={`text-xs font-bold text-slate-900 uppercase tracking-widest ${borderClass} ${contentAlignClass}`}>
                {isRtl ? "المهارات والخبرات الفنية" : "Key Strengths & Skills"}
              </h3>
              <div className={`flex flex-wrap gap-x-2 gap-y-1 ${contentAlignClass}`}>
                {cv.skills.map((skill, idx) => (
                  <span key={idx} className="text-xs text-slate-700 font-medium after:content-['•'] after:ml-2 after:text-slate-400 last:after:content-['']">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <div>
              <h3 className={`text-xs font-bold text-slate-900 uppercase tracking-widest ${borderClass} ${contentAlignClass}`}>
                {isRtl ? "الشهادات والاعتمادات" : "Certifications"}
              </h3>
              <ul className={`space-y-1 text-xs text-slate-700 ${contentAlignClass}`}>
                {cv.certifications.map((cert, idx) => (
                  <li key={idx} className="list-disc list-inside text-[11px]">
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

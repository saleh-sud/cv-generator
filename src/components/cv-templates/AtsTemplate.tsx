import React from "react";
import { CVData } from "../../types";

interface TemplateProps {
  cv: CVData;
  isRtl: boolean;
}

export default function AtsTemplate({ cv, isRtl }: TemplateProps) {
  const contentAlignClass = isRtl ? "text-right" : "text-left";
  const borderClass = "border-b border-slate-300 pb-1 mb-2";

  return (
    <div 
      className={`w-full bg-white text-slate-900 p-6 md:p-8 rounded-lg overflow-hidden leading-relaxed font-sans ${contentAlignClass}`}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Name and Simple Contact */}
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950 leading-tight mb-1">
          {cv.fullName || (isRtl ? "الاسم الكامل" : "Your Full Name")}
        </h2>
        <p className="text-xs md:text-sm font-semibold text-slate-800 uppercase tracking-wide mb-2">
          {cv.jobTitle || (isRtl ? "المسمى الوظيفي المستهدف" : "Target Job Title")}
        </p>
        
        {/* Contact details */}
        <div className="text-[11px] text-slate-600 font-medium flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
          {cv.email && <span>{isRtl ? "البريد الإلكتروني:" : "Email:"} {cv.email}</span>}
          {cv.phone && <span>• {isRtl ? "الهاتف:" : "Phone:"} {cv.phone}</span>}
          {cv.city && <span>• {isRtl ? "العنوان:" : "Address:"} {cv.city}</span>}
        </div>
      </div>

      {/* Profile Summary */}
      {cv.summary && (
        <div className="mb-4">
          <h3 className={`text-xs font-bold text-slate-950 uppercase tracking-widest ${borderClass}`}>
            {isRtl ? "الخلاصة والملخص المهني" : "Professional Summary"}
          </h3>
          <p className="text-[11px] md:text-xs text-slate-700 leading-normal">
            {cv.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {cv.experience && cv.experience.length > 0 && (
        <div className="mb-4">
          <h3 className={`text-xs font-bold text-slate-950 uppercase tracking-widest ${borderClass}`}>
            {isRtl ? "الخبرات السابقة والسيرة المهنية" : "Professional Experience"}
          </h3>
          <div className="space-y-3">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className="text-[11px] md:text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-955 gap-1">
                  <span>
                    {exp.role || (isRtl ? "مسمى الدور الوظيفي" : "Role / Title")} | {exp.company || (isRtl ? "الشركة" : "Company")}
                  </span>
                  <span className="text-slate-600 font-medium whitespace-nowrap">
                    {exp.startDate} - {exp.endDate || (isRtl ? "الآن" : "Present")}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-slate-700 leading-normal mt-1 whitespace-pre-wrap pr-1">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cv.education && cv.education.length > 0 && (
        <div className="mb-4">
          <h3 className={`text-xs font-bold text-slate-950 uppercase tracking-widest ${borderClass}`}>
            {isRtl ? "التعليم والمؤهلات الأكاديمية" : "Education"}
          </h3>
          <div className="space-y-2">
            {cv.education.map((edu, idx) => (
              <div key={idx} className="text-[11px] md:text-xs flex justify-between items-baseline gap-1">
                <div>
                  <span className="font-bold">{edu.degree || (isRtl ? "الدرجة العلمية" : "Degree")}</span> - {edu.school || (isRtl ? "المدرسة/الجامعة" : "School")}
                </div>
                <div className="text-slate-600 whitespace-nowrap">
                  {edu.gradYear && <span>{edu.gradYear}</span>} {edu.city && <span>({edu.city})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cv.skills && cv.skills.length > 0 && (
        <div className="mb-4">
          <h3 className={`text-xs font-bold text-slate-950 uppercase tracking-widest ${borderClass}`}>
            {isRtl ? "المهارات والخبرات الفنية" : "Core Strengths & Skills"}
          </h3>
          <p className="text-[11px] md:text-xs text-slate-700 leading-normal">
            {cv.skills.join(", ")}
          </p>
        </div>
      )}

      {/* Certifications and Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cv.certifications && cv.certifications.length > 0 && (
          <div>
            <h3 className={`text-xs font-bold text-slate-955 uppercase tracking-widest ${borderClass}`}>
              {isRtl ? "الشهادات والاعتمادات" : "Certifications"}
            </h3>
            <div className="text-[11px] md:text-xs text-slate-700 leading-normal space-y-1">
              {cv.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-start gap-1">
                  <span>-</span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <div>
            <h3 className={`text-xs font-bold text-slate-955 uppercase tracking-widest ${borderClass}`}>
              {isRtl ? "اللغات" : "Languages"}
            </h3>
            <p className="text-[11px] md:text-xs text-slate-700 leading-normal">
              {cv.languages.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

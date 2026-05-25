import React from "react";
import { CVData } from "../../types";

interface TemplateProps {
  cv: CVData;
  isRtl: boolean;
}

export default function MinimalTemplate({ cv, isRtl }: TemplateProps) {
  const contentAlignClass = isRtl ? "text-right" : "text-left";
  const flexDir = isRtl ? "flex-row-reverse" : "flex-row";

  return (
    <div 
      className={`w-full bg-white text-zinc-800 p-6 md:p-8 rounded-lg overflow-hidden leading-relaxed font-sans ${contentAlignClass}`}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Minimal Header */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-zinc-950 mb-1">
          <span className="font-extrabold">{cv.fullName?.split(" ")[0]}</span> {cv.fullName?.split(" ").slice(1).join(" ") || (isRtl ? "الاسم" : "Name")}
        </h2>
        <p className="text-xs md:text-sm tracking-widest uppercase font-semibold text-zinc-500 mb-3">
          {cv.jobTitle || (isRtl ? "المسمى الوظيفي المستهدف" : "Target Job Title")}
        </p>

        {/* Minimal Contacts Inline */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-400 font-medium">
          {cv.email && <span>{cv.email}</span>}
          {cv.phone && <span>• {cv.phone}</span>}
          {cv.city && <span>• {cv.city}</span>}
        </div>
      </div>

      {/* Profile Summary */}
      {cv.summary && (
        <div className="mb-6">
          <p className="text-xs md:text-sm text-zinc-650 leading-relaxed font-normal">
            {cv.summary}
          </p>
        </div>
      )}

      {/* Experience block */}
      {cv.experience && cv.experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[10px] md:text-xs font-bold text-zinc-950 uppercase tracking-widest mb-3 pb-1 border-b border-zinc-100">
            {isRtl ? "الخبرات وسنوات العمل" : "Experience"}
          </h3>
          <div className="space-y-4">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className="group transition-all">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <span className="text-xs md:text-sm font-semibold text-zinc-900">
                    {exp.role || "Role"} <span className="text-zinc-400 font-medium font-serif">@</span> {exp.company || "Company"}
                  </span>
                  <span className="text-[10px] md:text-xs text-zinc-400 whitespace-nowrap">
                    {exp.startDate} – {exp.endDate || (isRtl ? "الآن" : "Present")}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-[11px] md:text-xs text-zinc-500 mt-1 pl-1 line-clamp-4 hover:line-clamp-none">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid for Skills & Education */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Education */}
        <div className="md:col-span-7">
          {cv.education && cv.education.length > 0 && (
            <div>
              <h3 className="text-[10px] md:text-xs font-bold text-zinc-950 uppercase tracking-widest mb-3 pb-1 border-b border-zinc-100">
                {isRtl ? "التعليم والتدريب" : "Education"}
              </h3>
              <div className="space-y-3">
                {cv.education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <h4 className="font-semibold text-zinc-900">
                      {edu.degree || "Degree"}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {edu.school || "School"}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-1">
                      {edu.city && <span>{edu.city}</span>}
                      {edu.gradYear && <span>{edu.gradYear}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Skills, Certifications, Languages */}
        <div className="md:col-span-5 space-y-4">
          {cv.skills && cv.skills.length > 0 && (
            <div>
              <h3 className="text-[10px] md:text-xs font-bold text-zinc-950 uppercase tracking-widest mb-3 pb-1 border-b border-zinc-100">
                {isRtl ? "المهارات" : "Key Skills"}
              </h3>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((skill, idx) => (
                  <span key={idx} className="text-[10px] md:text-xs text-zinc-600 bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <div>
              <h3 className="text-[10px] md:text-xs font-bold text-zinc-950 uppercase tracking-widest mb-3 pb-1 border-b border-zinc-100">
                {isRtl ? "الاعتمادات" : "Certifications"}
              </h3>
              <ul className="space-y-1 text-[11px] md:text-xs text-zinc-500 list-disc list-inside">
                {cv.certifications.map((cert, idx) => (
                  <li key={idx}>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cv.languages && cv.languages.length > 0 && (
            <div>
              <h3 className="text-[10px] md:text-xs font-bold text-zinc-950 uppercase tracking-widest mb-3 pb-1 border-b border-zinc-100">
                {isRtl ? "اللغات" : "Languages"}
              </h3>
              <p className="text-[11px] md:text-xs text-zinc-500">
                {cv.languages.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

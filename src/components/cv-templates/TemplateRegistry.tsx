import React from "react";
import { CVData } from "../../types";
import ModernTemplate from "./ModernTemplate";
import ClassicTemplate from "./ClassicTemplate";
import AtsTemplate from "./AtsTemplate";
import MinimalTemplate from "./MinimalTemplate";

export interface TemplateSpec {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  iconBg: string;
  textColor: string;
}

export const TEMPLATES_LIST: TemplateSpec[] = [
  {
    id: "modern",
    nameAr: "النموذج الحديث (Modern)",
    nameEn: "Modern Template",
    descAr: "تصميم عصري مع تدرجات لونية، مثالي لمجالات التقنية والتسويق والإبداع.",
    descEn: "Contemporary layout with subtle gradients, ideal for technology, marketing, and creative fields.",
    iconBg: "bg-gradient-to-tr from-sky-400 to-indigo-600",
    textColor: "text-indigo-600"
  },
  {
    id: "classic",
    nameAr: "النموذج الكلاسيكي (Classic)",
    nameEn: "Classic Template",
    descAr: "تنسيق تقليدي أنيق بنمط Serif الرسمي، ممتاز للشركات الكبرى والوظائف التنفيذية والقانون والطب.",
    descEn: "Elegant, conservative serif layout. Outstanding for corporate, legal, and medical applications.",
    iconBg: "bg-slate-700",
    textColor: "text-slate-800"
  },
  {
    id: "ats",
    nameAr: "متوافق مع الذكاء الاصطناعي (ATS Friendly)",
    nameEn: "ATS Friendly",
    descAr: "تصميم مبسط للغاية من عمود واحد لضمان مرور السيرة الذاتية بنجاح عبر أنظمة تصفية التوظيف.",
    descEn: "Highly optimized single-column design ensuring perfect parsing through applicant tracking software.",
    iconBg: "bg-emerald-600",
    textColor: "text-emerald-600"
  },
  {
    id: "minimal",
    nameAr: "النموذج البسيط (Minimal)",
    nameEn: "Minimal Template",
    descAr: "مساحات بيضاء مريحة، خطوط نقية وتفاصيل رقيقة، يعكس الأناقة والاحترافية والوضوح.",
    descEn: "Spacious breathing white spaces, crisp lines, and delicate details. Radiates elegance and clarity.",
    iconBg: "bg-zinc-800",
    textColor: "text-zinc-800"
  }
];

interface RenderProps {
  templateId: string;
  cv: CVData;
  isRtl: boolean;
}

export function RenderCvTemplate({ templateId, cv, isRtl }: RenderProps) {
  switch (templateId) {
    case "classic":
      return <ClassicTemplate cv={cv} isRtl={isRtl} />;
    case "ats":
      return <AtsTemplate cv={cv} isRtl={isRtl} />;
    case "minimal":
      return <MinimalTemplate cv={cv} isRtl={isRtl} />;
    case "modern":
    default:
      return <ModernTemplate cv={cv} isRtl={isRtl} />;
  }
}

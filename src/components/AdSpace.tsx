import { useState } from "react";
import { Info, Sparkles } from "lucide-react";

interface AdSpaceProps {
  type: "top" | "sidebar" | "content";
  isRtl?: boolean;
}

export default function AdSpace({ type, isRtl = true }: AdSpaceProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  if (!showPlaceholder) return null;

  const styleClasses = {
    top: "w-full min-h-[90px] bg-slate-50 border border-dashed border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 my-6 transition-all",
    sidebar: "w-full min-h-[280px] bg-slate-50 border border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center gap-3 text-center text-xs text-slate-400 my-4 transition-all",
    content: "w-full min-h-[120px] bg-slate-50 border border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 text-center text-xs text-slate-400 my-6 transition-all"
  };

  const labelAr = {
    top: "مساحة إعلانية مقترحة (Ad Banner Top - 728×90)",
    sidebar: "مساحة إعلانية جانبية (Ad Sidebar - 300×250)",
    content: "إعلان وسط المحتوى (Ad Between Content - 468×60)"
  };

  const labelEn = {
    top: "Suggested Ad Space (Ad Banner Top - 728x90)",
    sidebar: "Vertical Ad Space (Ad Sidebar - 300x250)",
    content: "Inline Ad Space (Ad Between Content - 468x60)"
  };

  return (
    <div className={styleClasses[type]} id={`ad-space-${type}`}>
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
        <div className="text-right">
          <p className="font-semibold text-slate-600">
            {isRtl ? labelAr[type] : labelEn[type]}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isRtl 
              ? "سيتم تفعيل إعلانات Google AdSense هنا لاحقاً لجلب العوائد" 
              : "Google AdSense will be deployed in this container for monetization"}
          </p>
        </div>
      </div>
      <button 
        onClick={() => setShowPlaceholder(false)}
        className="px-2.5 py-1 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-600 rounded-md transition-all cursor-pointer"
      >
        {isRtl ? "إخفاء المعاينة مؤقتاً" : "Hide preview"}
      </button>
    </div>
  );
}

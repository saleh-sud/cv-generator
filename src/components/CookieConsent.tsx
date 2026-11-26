import { useEffect, useState } from "react";
import { L } from "../utils/lang";

const KEY = "cookie-consent-v1";

/** شريط موافقة الكوكيز (مطلوب لزوار أوروبا بسبب الإعلانات والتحليلات). */
export default function CookieConsent({ isRtl, onNavigate }: { isRtl: boolean; onNavigate: (r: string) => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(!localStorage.getItem(KEY));
    } catch {
      setShow(false);
    }
  }, []);

  const choose = (value: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    // Google Analytics consent mode
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    w.gtag?.("consent", "update", {
      analytics_storage: value === "all" ? "granted" : "denied",
      ad_storage: value === "all" ? "granted" : "denied",
    });
    setShow(false);
  };

  if (!show) return null;
  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="fixed bottom-3 inset-x-3 md:inset-x-auto md:start-4 md:max-w-md z-[100000] bg-slate-900 text-white rounded-2xl shadow-2xl p-4 text-xs leading-relaxed"
      role="dialog"
      aria-label={isRtl ? "موافقة ملفات تعريف الارتباط" : "Cookie consent"}
      aria-live="polite"
    >
      <p className="mb-3">
        {isRtl
          ? "نستخدم ملفات تعريف الارتباط (الكوكيز) لتحسين تجربتك، ولعرض الإعلانات وقياس الزيارات. "
          : "We use cookies to improve your experience, show ads and measure traffic. "}
        <a
          href={L("/privacy-policy")}
          onClick={(e) => {
            e.preventDefault();
            onNavigate("/privacy-policy");
          }}
          className="underline text-sky-300"
        >
          {isRtl ? "سياسة الخصوصية" : "Privacy policy"}
        </a>
      </p>
      <div className="flex gap-2 justify-end">
        <button onClick={() => choose("essential")} className="px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 cursor-pointer">
          {isRtl ? "الضرورية فقط" : "Essential only"}
        </button>
        <button onClick={() => choose("all")} className="px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 font-bold cursor-pointer">
          {isRtl ? "موافق" : "Accept"}
        </button>
      </div>
    </div>
  );
}

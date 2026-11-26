import { Suspense, lazy, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GlobalAds from "./components/GlobalAds";
import CookieConsent from "./components/CookieConsent";
import Home from "./pages/Home";
import { CVData, JobDescInput } from "./types";
import { AlertCircle } from "lucide-react";
import { NOT_FOUND_META, STATIC_ROUTES } from "./seo/staticRoutes";
import { setSeo } from "./utils/seo";
import { counterpart, langOfPath, saveLang, savedLang, setCurrentLang, stripLang, withLang } from "./utils/lang";

// تحميل كسول للصفحات الثقيلة (يقلّص حجم الحزمة الأولى بشكل كبير)
const CvGeneratorAr = lazy(() => import("./pages/CvGeneratorAr"));
const CvGeneratorEn = lazy(() => import("./pages/CvGeneratorEn"));
const JobDescriptionGenerator = lazy(() => import("./pages/JobDescriptionGenerator"));
const SeoCvPage = lazy(() => import("./pages/SeoCvPage"));
const SeoJobPage = lazy(() => import("./pages/SeoJobPage"));
const Blog = lazy(() => import("./pages/Blog"));
const Legal = lazy(() => import("./pages/Legal"));

const normalizePath = (p: string) => {
  const clean = (p || "/").split("?")[0].split("#")[0].replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = normalizePath(window.location.pathname);
    // الزائر الذي اختار العربية سابقاً يرجع للعربية عند دخوله رابطاً إنجليزياً
    if (savedLang() === "ar" && langOfPath(path) === "en") {
      const ar = counterpart(path);
      if (ar !== path) {
        window.history.replaceState({}, "", ar);
        return ar;
      }
    }
    return path;
  });
  // اللغة من الرابط: الإنجليزية أساسية، والعربية تحت /ar
  const lang = langOfPath(currentRoute);
  const isRtl = lang === "ar";
  setCurrentLang(lang);

  // popstate (زر الرجوع/الأمام)
  useEffect(() => {
    const onPop = () => setCurrentRoute(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // عند أي تغيير في المسار: اتجاه اللغة + SEO + الرجوع لأعلى الصفحة
  useEffect(() => {
    const path = currentRoute;
    const staticRoute = STATIC_ROUTES.find((r) => r.path === path);
    if (staticRoute) {
      setSeo({
        title: staticRoute.title,
        description: staticRoute.description,
        path,
        lang: staticRoute.lang,
      });
    } else {
      // سجل المسارات الكامل (فيه نصوص المقالات) يُحمَّل عند الحاجة فقط حتى يبقى الملف الرئيسي خفيفاً
      import("./seo/routes").then(({ getAllRoutes }) => {
        if (!getAllRoutes().some((r) => r.path === path)) setSeo({ ...NOT_FOUND_META, path, noindex: true });
      });
    }
    // المسارات الديناميكية (مقالات / نماذج) تضبط SEO داخل صفحاتها
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentRoute]);

  // Update root html attribute direction tag
  useEffect(() => {
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", isRtl ? "ar" : "en");
  }, [isRtl]);

  // زر اللغة: ينتقل للصفحة نفسها باللغة الأخرى ويتذكر اختيار الزائر
  const handleLanguageToggle = () => {
    const next = counterpart(currentRoute);
    saveLang(langOfPath(next));
    handleNavigate(next, true);
  };

  // الروابط الداخلية تُكتب بلا بادئة لغة ("/blog")، وتُحوَّل هنا تلقائياً للغة الحالية
  const handleNavigate = (route: string, exact = false) => {
    const next = normalizePath(exact || route.startsWith("/ar") ? route : withLang(route, lang));
    if (next !== normalizePath(window.location.pathname)) {
      window.history.pushState({}, "", next);
    }
    setCurrentRoute(next);
  };

  // Seeding tools dynamically
  const handleLoadCvDataToBuilder = (data: CVData, language: "ar" | "en") => {
    if (language === "ar") {
      localStorage.setItem("arabic_cv_draft", JSON.stringify(data));
    } else {
      localStorage.setItem("english_cv_draft", JSON.stringify(data));
    }
  };

  const handleLoadJobDataToBuilder = (data: JobDescInput) => {
    localStorage.setItem("jd_generator_draft", JSON.stringify(data));
  };

  // Routing Switch Statement
  const renderActivePage = () => {
    const path = stripLang(currentRoute);

    // 1. Main routes
    if (path === "/" || path === "") {
      return <Home isRtl={isRtl} onNavigate={handleNavigate} />;
    }
    if (path === "/tools/cv-generator-ar") {
      return <CvGeneratorAr />;
    }
    if (path === "/tools/cv-generator-en") {
      return <CvGeneratorEn />;
    }
    if (path === "/tools/job-description-generator") {
      return <JobDescriptionGenerator globalIsRtl={isRtl} />;
    }
    if (path === "/blog") {
      return <Blog isRtl={isRtl} onNavigate={handleNavigate} />;
    }

    // 2. Dynamic Blog posts
    if (path.startsWith("/blog/")) {
      const slug = path.replace("/blog/", "");
      return <Blog articleSlug={slug} isRtl={isRtl} onNavigate={handleNavigate} />;
    }

    // 3. Dynamic SEO CV Templates
    if (path.startsWith("/cv/")) {
      const slug = path.replace("/cv/", "");
      return (
        <SeoCvPage 
          slug={slug} 
          isRtl={isRtl} 
          onNavigate={handleNavigate} 
          onLoadCvDataToBuilder={handleLoadCvDataToBuilder} 
        />
      );
    }

    // 4. Dynamic SEO Job Descriptions
    if (path.startsWith("/job-description/")) {
      const slug = path.replace("/job-description/", "");
      return (
        <SeoJobPage 
          slug={slug} 
          isRtl={isRtl} 
          onNavigate={handleNavigate} 
          onLoadJobDataToBuilder={handleLoadJobDataToBuilder} 
        />
      );
    }

    // 5. Static Legal Content
    if (path === "/privacy-policy") {
      return <Legal pageType="privacy" isRtl={isRtl} onNavigate={handleNavigate} />;
    }
    if (path === "/terms") {
      return <Legal pageType="terms" isRtl={isRtl} onNavigate={handleNavigate} />;
    }
    if (path === "/about") {
      return <Legal pageType="about" isRtl={isRtl} onNavigate={handleNavigate} />;
    }
    if (path === "/contact") {
      return <Legal pageType="contact" isRtl={isRtl} onNavigate={handleNavigate} />;
    }

    // 6. 404 Fallback Page
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 min-h-[450px] flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950">{isRtl ? "الصفحة غير موجودة - 404" : "Page not found - 404"}</h2>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed max-w-sm">
          {isRtl 
            ? "عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله لمكان آخر."
            : "Apologies, the web-link you are accessing does not exist or has been relocated."}
        </p>
        <button
          onClick={() => handleNavigate("/")}
          className="mt-8 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
        >
          {isRtl ? "العودة للواجهة الرئيسية" : "Return to Homepage"}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans antialiased text-slate-800">
      
      {/* Universal header navigation */}
      <Navbar 
        currentRoute={currentRoute} 
        isRtl={isRtl} 
        onLanguageToggle={handleLanguageToggle} 
        onNavigate={handleNavigate} 
      />

      {/* Main core canvas layout */}
      <main className="flex-grow">
        <Suspense fallback={<div className="py-24 text-center text-sm text-slate-500" style={{ minHeight: "100vh" }}>...</div>}>
          {renderActivePage()}
        </Suspense>
      </main>
      <GlobalAds />
      <CookieConsent isRtl={isRtl} onNavigate={handleNavigate} />

      {/* Universal footer links */}
      <Footer isRtl={isRtl} onNavigate={handleNavigate} />

    </div>
  );
}

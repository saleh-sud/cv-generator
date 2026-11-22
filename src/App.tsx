import { Suspense, lazy, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GlobalAds from "./components/GlobalAds";
import Home from "./pages/Home";
import { CVData, JobDescInput } from "./types";
import { AlertCircle } from "lucide-react";
import { getAllRoutes, NOT_FOUND_META, STATIC_ROUTES } from "./seo/routes";
import { setSeo } from "./utils/seo";

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
  const [currentRoute, setCurrentRoute] = useState<string>(() => normalizePath(window.location.pathname));
  const [isRtl, setIsRtl] = useState<boolean>(true);

  // popstate (زر الرجوع/الأمام)
  useEffect(() => {
    const onPop = () => setCurrentRoute(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // عند أي تغيير في المسار: اتجاه اللغة + SEO + الرجوع لأعلى الصفحة
  useEffect(() => {
    const path = currentRoute;
    if (path === "/tools/cv-generator-en") setIsRtl(false);
    else if (path === "/tools/cv-generator-ar") setIsRtl(true);

    const staticRoute = STATIC_ROUTES.find((r) => r.path === path);
    const isKnown = getAllRoutes().some((r) => r.path === path);
    if (staticRoute) {
      setSeo({
        title: staticRoute.title,
        description: staticRoute.description,
        path,
        lang: path === "/tools/cv-generator-en" ? "en" : "ar",
      });
    } else if (!isKnown) {
      setSeo({ ...NOT_FOUND_META, path, noindex: true });
    }
    // المسارات الديناميكية (مقالات / نماذج) تضبط SEO داخل صفحاتها
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentRoute]);

  // Update root html attribute direction tag
  useEffect(() => {
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", isRtl ? "ar" : "en");
  }, [isRtl]);

  const handleLanguageToggle = () => {
    const nextRtl = !isRtl;
    setIsRtl(nextRtl);

    // Auto toggle page if they are on a language-specific CV builder
    if (currentRoute === "/tools/cv-generator-ar" && !nextRtl) {
      handleNavigate("/tools/cv-generator-en");
    } else if (currentRoute === "/tools/cv-generator-en" && nextRtl) {
      handleNavigate("/tools/cv-generator-ar");
    }
  };

  const handleNavigate = (route: string) => {
    const next = normalizePath(route);
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
    const path = currentRoute;

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
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950">الصفحة غير موجودة - 404</h2>
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
        <Suspense fallback={<div className="py-24 text-center text-sm text-slate-400">...</div>}>
          {renderActivePage()}
        </Suspense>
      </main>
      <GlobalAds />

      {/* Universal footer links */}
      <Footer isRtl={isRtl} onNavigate={handleNavigate} />

    </div>
  );
}

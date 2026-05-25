import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CvGeneratorAr from "./pages/CvGeneratorAr";
import CvGeneratorEn from "./pages/CvGeneratorEn";
import JobDescriptionGenerator from "./pages/JobDescriptionGenerator";
import SeoCvPage from "./pages/SeoCvPage";
import SeoJobPage from "./pages/SeoJobPage";
import Blog from "./pages/Blog";
import Legal from "./pages/Legal";
import { CVData, JobDescInput } from "./types";
import { AlertCircle, HelpCircle } from "lucide-react";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>("#/");
  const [isRtl, setIsRtl] = useState<boolean>(true);

  // Synchronize route hash on mount and window navigate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/";
      setCurrentRoute(hash);
      
      // Auto scroll to top of viewport on path modification
      window.scrollTo({ top: 0, behavior: "instant" as any });

      // Smart direction toggle depending on path preferences
      if (hash.includes("cv-generator-en") || hash.includes("en-cv")) {
        setIsRtl(false);
      } else if (hash.includes("cv-generator-ar") || hash.includes("ar-cv")) {
        setIsRtl(true);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run check on initial load

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Update root html attribute direction tag
  useEffect(() => {
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", isRtl ? "ar" : "en");
  }, [isRtl]);

  const handleLanguageToggle = () => {
    const nextRtl = !isRtl;
    setIsRtl(nextRtl);

    // Auto toggle page if they are on a language-specific CV builder
    if (currentRoute === "#/tools/cv-generator-ar" && !nextRtl) {
      handleNavigate("#/tools/cv-generator-en");
    } else if (currentRoute === "#/tools/cv-generator-en" && nextRtl) {
      handleNavigate("#/tools/cv-generator-ar");
    }
  };

  const handleNavigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
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
    const hash = currentRoute;

    // 1. Main routes
    if (hash === "#/" || hash === "") {
      return <Home isRtl={isRtl} onNavigate={handleNavigate} />;
    }
    if (hash === "#/tools/cv-generator-ar") {
      return <CvGeneratorAr />;
    }
    if (hash === "#/tools/cv-generator-en") {
      return <CvGeneratorEn />;
    }
    if (hash === "#/tools/job-description-generator") {
      return <JobDescriptionGenerator globalIsRtl={isRtl} />;
    }
    if (hash === "#/blog") {
      return <Blog isRtl={isRtl} onNavigate={handleNavigate} />;
    }

    // 2. Dynamic Blog posts
    if (hash.startsWith("#/blog/")) {
      const slug = hash.replace("#/blog/", "");
      return <Blog articleSlug={slug} isRtl={isRtl} onNavigate={handleNavigate} />;
    }

    // 3. Dynamic SEO CV Templates
    if (hash.startsWith("#/cv/")) {
      const slug = hash.replace("#/cv/", "");
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
    if (hash.startsWith("#/job-description/")) {
      const slug = hash.replace("#/job-description/", "");
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
    if (hash === "#/privacy-policy") {
      return <Legal pageType="privacy" isRtl={isRtl} onNavigate={handleNavigate} />;
    }
    if (hash === "#/terms") {
      return <Legal pageType="terms" isRtl={isRtl} onNavigate={handleNavigate} />;
    }
    if (hash === "#/about") {
      return <Legal pageType="about" isRtl={isRtl} onNavigate={handleNavigate} />;
    }
    if (hash === "#/contact") {
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
          onClick={() => handleNavigate("#/")}
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
        {renderActivePage()}
      </main>

      {/* Universal footer links */}
      <Footer isRtl={isRtl} onNavigate={handleNavigate} />

    </div>
  );
}

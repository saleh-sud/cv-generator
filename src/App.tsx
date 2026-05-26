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
  const [currentRoute, setCurrentRoute] = useState<string>("/");
  const [isRtl, setIsRtl] = useState<boolean>(true);

  // Synchronize route path on mount and window navigate
  useEffect(() => {
    const handlepathChange = () => {
      const path = window.location.pathname || "/";
          setCurrentRoute(path);
      
      // Auto scroll to top of viewport on path modification
      window.scrollTo({ top: 0, behavior: "instant" as any });

      // Smart direction toggle depending on path preferences
      if (path.includes("cv-generator-en") || path.includes("en-cv")) {
        setIsRtl(false);
      } else if (path.includes("cv-generator-ar") || path.includes("ar-cv")) {
        setIsRtl(true);
      }
    };

       window.addEventListener("popstate", handlepathChange);
    handlepathChange(); // Run check on initial load

    return () => {
     window.removeEventListener("popstate", handlepathChange);
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
    if (currentRoute === "/tools/cv-generator-ar" && !nextRtl) {
      handleNavigate("/tools/cv-generator-en");
    } else if (currentRoute === "/tools/cv-generator-en" && nextRtl) {
      handleNavigate("/tools/cv-generator-ar");
    }
  };

  const handleNavigate = (route: string) => {
  window.history.pushState({}, "", route);
  setCurrentRoute(route);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
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
        {renderActivePage()}
      </main>

      {/* Universal footer links */}
      <Footer isRtl={isRtl} onNavigate={handleNavigate} />

    </div>
  );
}

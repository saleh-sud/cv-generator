import { useState } from "react";
import { Menu, X, FileText, Briefcase, BookOpen, Globe, Sparkles } from "lucide-react";

interface NavbarProps {
  currentRoute: string;
  isRtl: boolean;
  onLanguageToggle: () => void;
  onNavigate: (route: string) => void;
}

export default function Navbar({ currentRoute, isRtl, onLanguageToggle, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      labelAr: "الرئيسية",
      labelEn: "Home",
      route: "/",
      icon: null
    },
    {
      labelAr: "إنشاء CV عربي",
      labelEn: "Arabic CV Builder",
      route: "/tools/cv-generator-ar",
      icon: FileText
    },
    {
      labelAr: "Create English CV",
      labelEn: "English CV Builder",
      route: "/tools/cv-generator-en",
      icon: FileText
    },
    {
      labelAr: "وصف وظيفي",
      labelEn: "Job Spec Builder",
      route: "/tools/job-description-generator",
      icon: Briefcase
    },
    {
      labelAr: "المقالات",
      labelEn: "Resources Blog",
      route: "/blog",
      icon: BookOpen
    }
  ];

  const handleItemClick = (route: string) => {
    onNavigate(route);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand Section */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleItemClick("/")}
              className="flex items-center gap-2 text-blue-600 font-bold text-lg md:text-xl tracking-tight cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black font-mono">
                CV
              </div>
              <span className="font-heading tracking-tight text-blue-900 font-black flex items-center gap-1.5 text-lg md:text-xl">
                <span>{isRtl ? "أدوات الوظائف" : "JobTools"}</span>
              </span>
            </button>
            <span className="hidden md:inline px-2.5 py-0.5 text-[10px] bg-blue-50 text-blue-600 font-extrabold rounded-full">
              {isRtl ? "مجاني" : "100% Free"}
            </span>
          </div>

          {/* Desktop Right Alignment Navigation and Meta actions */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleItemClick(item.route)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{isRtl ? item.labelAr : item.labelEn}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Functional Actions like Translate */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer"
              title="تغيير اتجاه اللغة - Switch LTR/RTL"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{isRtl ? "English (LTR)" : "العربية (RTL)"}</span>
            </button>
          </div>

          {/* Mobile hamburger selector */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{isRtl ? "EN" : "AR"}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-50 focus:outline-hidden transition-all cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 shadow-lg px-2 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleItemClick(item.route)}
                className={`w-full block px-4 py-3 text-right rounded-lg text-base font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                }`}
                style={{ direction: isRtl ? "rtl" : "ltr" }}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{isRtl ? item.labelAr : item.labelEn}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

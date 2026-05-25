import { motion } from "motion/react";
import { 
  FileText, Briefcase, FilePlus2, BadgeHelp, CheckCircle, 
  Sparkles, Shield, Eye, Flame, ChevronDown, ListCollapse, ArrowLeft, ArrowRight
} from "lucide-react";
import { useState } from "react";
import AdSpace from "../components/AdSpace";
import { SEO_CV_TEMPLATES, SEO_JOB_TEMPLATES } from "../data/seoTemplates";

interface HomeProps {
  isRtl: boolean;
  onNavigate: (route: string) => void;
}

export default function Home({ isRtl, onNavigate }: HomeProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const homeFaqs = [
    {
      qAr: "هل هذه المنصة مجانية بالكامل؟ وبدون ميزات مدفوعة مقفلة؟",
      qEn: "Is this platform completely free? Are there any payroll gates?",
      aAr: "نعم، كافة الأدوات ومولدات السير الذاتية والأوصاف الوظيفية مجانية مئة بالمئة ومتاحة للاستخدام دون حاجة للتسجيل أو دفع رسوم.",
      aEn: "Absolutely. All tools, CV builders, and Job Description templates are completely free with zero hidden payments, registrations, or limitations."
    },
    {
      qAr: "أين تذهب البيانات الشخصية التي أدخلها لتوليد السيرة؟",
      qEn: "Where does my computed personal information go?",
      aAr: "بياناتك آمنة للغاية. لا يتم إرسال أي جزء من سيرتك الذاتية لخوادم سحابية أو قواعد بيانات، بل يتم حفظها مؤقتاً في متصفحك الشخصي فقط باستخدام localStorage.",
      aEn: "Your data stays 100% local. Your resume inputs are processed securely in your own browser using localStorage without any database synchronization or tracking."
    },
    {
      qAr: "هل النماذج متوافقة مع أنظمة الفحص الآلي للشركات (صفحات الـ ATS)؟",
      qEn: "Are generated layouts compliant with ATS engines?",
      aAr: "نعم تمامًا، تم بناء كود المولد وهيكلت السير لتفادي تداخل الأعمدة المعقدة وتصدير هيكلية نصية أحادية مريحة للفهرسة الآلية بمحركات ATS.",
      aEn: "Yes, indeed. The resume layouts are built vertically to bypass parsing glitches. No overlapping sidebars or graphical rating grids, which guarantees high ATS score optimization."
    },
    {
      qAr: "كيف يمكنني تحميل السيرة الذاتية بصيغة PDF؟",
      qEn: "How do I download the generated CV as a PDF file?",
      aAr: "ببساطة بعد الانتهاء من ملء البيانات وتوليد السيرة الذاتية، يمكنك الضغط على زر 'تحميل السيرة الذاتية (PDF)' وسيتم فتح نافذة الطباعة الافتراضية للوصف لاختيار خيار 'حفظ بتنسيق PDF' بجودة مذهلة وتنسيق مطبوع رائع.",
      aEn: "Simply after filling your metrics and triggering the generator, hit the 'Save as PDF' option. It launches your native browser print manager styled precisely for clean A4 dimensions."
    }
  ];

  const features = [
    {
      titleAr: "مجاني وسهل ومفتوح",
      titleEn: "100% Free & Open",
      descAr: "لا حاجة لبطاقات ائتمان أو حسابات معقدة. املأ بياناتك فورًا وحمل مخرجاتك بنسخة نظيفة.",
      descEn: "No credit cards or accounts. Instantly construct your text, preview the draft, and export.",
      icon: Sparkles,
      color: "bg-amber-50 text-amber-600"
    },
    {
      titleAr: "خصوصية مطلقة وأمان",
      titleEn: "Absolute Local Privacy",
      descAr: "بياناتك الشخصية ملكك وحدك. لا يتم رفع أي مستند لخوادمنا، فكل المعالجة مخزنة في متصفحك.",
      descEn: "Your details remain entirely yours. We run zero server transfers, saving drafts securely in localStorage.",
      icon: Shield,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      titleAr: "متوافق بالكامل مع الـ ATS",
      titleEn: "ATS Optimized Files",
      descAr: "أكواد وتنسيقات السيرة مدروسة بعناية لتناسب أنظمة الذكاء الاصطناعي لفحص السير بالشركات.",
      descEn: "Clean vertical designs ensuring automated recruiting systems read your core values correctly.",
      icon: CheckCircle,
      color: "bg-sky-50 text-sky-600"
    },
    {
      titleAr: "دعم متميز للغات RTL/LTR",
      titleEn: "Native RTL & LTR Core",
      descAr: "إنشاء سيرة ذاتية عربية بمهارات وعمليات RTL مرتبة، أو إنجليزية بأسلوب LTR احترافي.",
      descEn: "Easily switch from right-to-left Arabic layouts to standard western left-to-right setups.",
      icon: Flame,
      color: "bg-rose-50 text-rose-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      
      {/* Ad top space placeholder */}
      <AdSpace type="top" isRtl={isRtl} />

      {/* Modern Bento Grid Hero & Quick Tools Container */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        
        {/* Bento Card 1: Main Rich Hero Section (spans 8 cols on desktop) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 flex flex-col justify-center relative overflow-hidden shadow-xs hover:border-sky-300 hover:shadow-sm transition-all duration-300">
          <div className="relative z-10 my-2">
            
            {/* Elegant Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>
                {isRtl 
                  ? "#1 منصة توظيف عربية متميزة" 
                  : "#1 Advanced Professional Recruitment Suite"}
              </span>
            </motion.div>

            {/* Title with Underlined decoration */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-4">
              {isRtl ? (
                <>
                  أنشئ سيرتك الذاتية <br className="hidden sm:inline" /> والوصف الوظيفي <span className="text-blue-600 underline decoration-blue-200 decoration-3 underline-offset-4">بسهولة</span>
                </>
              ) : (
                <>
                  Draft Professional Resumes <br className="hidden sm:inline" /> and Job Specs <span className="text-blue-600 underline decoration-blue-100 decoration-3 underline-offset-4 font-black">Instantly</span>
                </>
              )}
            </h1>

            {/* Subtext */}
            <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-xl mb-8 leading-relaxed">
              {isRtl 
                ? "أداة ذكية متكاملة ومجانية بالكامل تدعم اللغتين العربية والإنجليزية، مصممة لمساعدتك في الحصول على وظيفة أحلامك وتجاوز مرشحات الـ ATS."
                : "A world-class tool 100% free with zero registration. Built utilizing standard guidelines optimized to pass modern enterprise ATS tracking algorithms."}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate("#/tools/cv-generator-ar")}
                className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-md shadow-blue-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <span>{isRtl ? "إنشاء CV عربي جاهز" : "Design Arabic Resume"}</span>
                <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-0" : "rotate-180"}`} />
              </button>
              
              <button
                onClick={() => onNavigate("#/tools/cv-generator-en")}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold transition-all hover:shadow-md hover:-translate-y-0.5 text-sm sm:text-base cursor-pointer"
              >
                <span>{isRtl ? "Create English CV" : "Create English Resume"}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : "rotate-0"}`} />
              </button>
            </div>
          </div>

          {/* Abstract visual background circles matching theme */}
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-50/50 rounded-full pointer-events-none"></div>
          <div className="absolute top-12 right-12 w-32 h-32 border-4 border-blue-50/40 rounded-full pointer-events-none"></div>
        </div>

        {/* Bento Card 2: Quick Tool Job Description Builder (spans 4 cols on desktop) */}
        <div 
          onClick={() => onNavigate("#/tools/job-description-generator")}
          className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer border border-slate-800"
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              {/* Icon widget */}
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">
                {isRtl ? "مولد الوصف الوظيفي" : "Job Spec Generator"}
              </h3>
              
              <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                {isRtl 
                  ? "اكتب مسمى الوظيفة واحصل على وصف مهني معتمد وبطاقة كفاءات بلمح البصر."
                  : "Draft dynamic corporate job postings and candidate competency listings instantly."}
              </p>
            </div>

            {/* Quick pre-seeded indicators */}
            <div className="space-y-2.5 mt-auto">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center text-xs text-slate-300 hover:bg-white/10 transition-all">
                <span>{isRtl ? "محاسب مالي" : "Financial Consultant"}</span>
                <span className="text-blue-400 font-bold">{isRtl ? "توليد ←" : "Create →"}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center text-xs text-slate-300 hover:bg-white/10 transition-all">
                <span>{isRtl ? "مدير موارد بشرية" : "HR Team Director"}</span>
                <span className="text-blue-400 font-bold">{isRtl ? "توليد ←" : "Create →"}</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none"></div>
        </div>

      </section>

      {/* Bento Grid Row 2: Stats, Highlight Blog and Features Slider */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        
        {/* Bento Card 3: Stats & User Trust (spans 3 cols on desktop) */}
        <div className="md:col-span-12 lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-xs hover:border-sky-200 transition-all duration-300">
          <div className="text-5xl font-black text-blue-600 tracking-tight">+50k</div>
          <div className="text-slate-800 font-bold mt-2 text-sm sm:text-base">
            {isRtl ? "سيرة تم إنشاؤها" : "Resumes Generated"}
          </div>
          
          <div className="mt-5 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-4/5 h-full bg-blue-500 rounded-full"></div>
          </div>
          
          <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
            {isRtl 
              ? "ثقة الكوادر والمحترفين العرب سر ديمومتنا مجاناً" 
              : "Trusted by thousands of young professionals worldwide"}
          </p>
        </div>

        {/* Bento Card 4: Immersive Career Advisory Blog post (spans 6 cols on desktop) */}
        <div 
          onClick={() => onNavigate("#/blog/how-to-bypass-ats-screening")}
          className="md:col-span-12 lg:col-span-6 bg-blue-600 hover:bg-blue-700 rounded-3xl p-6 text-white flex flex-col justify-between relative overflow-hidden group shadow-md transition-all duration-300 cursor-pointer"
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-2.5 py-1 rounded">
                {isRtl ? "نصائح المهنة والتوظيف" : "Career Growth Guide"}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold mt-4 leading-snug text-white max-w-lg">
                {isRtl 
                  ? "كيف تتجاوز أنظمة الـ ATS وتضمن وصول سيرتك للمديرين؟" 
                  : "How to Bypass Corporate ATS Screening Filters and Secure Interviews"}
              </h3>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              {/* Readers Avatar Cluster */}
              <div className="flex -space-x-2 space-x-reverse pointer-events-none">
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold">A</div>
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 bg-slate-300 flex items-center justify-center text-[10px] text-slate-700 font-bold">K</div>
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 bg-slate-400 flex items-center justify-center text-[10px] text-slate-800 font-bold">M</div>
              </div>
              
              <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:underline decoration-white/50">
                <span>{isRtl ? "اقرأ المقال كاملاً" : "Read Full Article"}</span>
                <ArrowLeft className={`w-4 h-4 transform ${isRtl ? "rotate-0" : "rotate-180"}`} />
              </span>
            </div>
          </div>
          {/* Subtle background gradient overlay */}
          <div className="absolute inset-0 bg-radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops)) from-blue-500/30 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Bento Card 5: Core stats / Verified secure (spans 3 cols on desktop) */}
        <div className="md:col-span-12 lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-xs hover:border-sky-200 transition-all duration-300">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-slate-800 font-bold text-base">
            {isRtl ? "خصوصية فدرالية ومحلية" : "100% Secure Local"}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 max-w-[200px] leading-relaxed">
            {isRtl 
              ? "يتم معالجة وحفظ مدخلاتك الحساسة فقط في جهازك الشخصي" 
              : "Your data stays on your machine with absolute local safety"}
          </p>
        </div>

      </section>

      {/* Bento Layout Part 3: Features Proposition grid */}
      <section className="my-16" id="features-section">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 text-center mb-8 tracking-tight">
          {isRtl ? "مواصفات تضمن لك التفوق في مسارك المهني" : "Engineered with Superior Standards"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`p-3 rounded-2xl w-12 h-12 flex items-center justify-center mb-4 ${feat.color}`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">
                  {isRtl ? feat.titleAr : feat.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                  {isRtl ? feat.descAr : feat.descEn}
                </p>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 border-t border-slate-50 pt-3">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span>{isRtl ? "تم التحقق متصفحياً" : "Verified Safe Processing"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* popular SEO pages for CV/JD structured within stylish Bento Tiles */}
      <section className="bg-slate-100/60 rounded-3xl p-6 md:p-8 my-16" id="popular-libraries">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
              {isRtl ? "تصفح القوالب والنماذج الجاهزة" : "Popular Pre-Structured Templates & Profiles"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isRtl 
                ? "انقر على أي نموذج للاطلاع السريع أو استيراده في دقيقة واختصار ساعات الصياغة" 
                : "Explore highly rich, pre-packaged corporate listings you can load instantly into your workspace"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sub-Bento Box: Resumes */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition-colors">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              {isRtl ? "نماذج سيرة ذاتية جاهزة للتعديل (SEO)" : "Download Prepared Resumes (SEO)"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SEO_CV_TEMPLATES.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => onNavigate(`#/cv/${item.slug}`)}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-blue-400 hover:bg-blue-50/20 text-xs sm:text-sm font-bold text-slate-700 transition-all text-right md:text-start cursor-pointer"
                >
                  <span className="truncate">{isRtl ? item.titleAr : item.titleEn}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4 text-blue-500 shrink-0" /> : <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Bento Box: Popular JDs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {isRtl ? "بطاقات الوصف الوظيفي لجميع المهن" : "Full Job Description Cards"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SEO_JOB_TEMPLATES.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => onNavigate(`#/job-description/${item.slug}`)}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/20 text-xs sm:text-sm font-bold text-slate-700 transition-all text-right md:text-start cursor-pointer"
                >
                  <span className="truncate">{isRtl ? `وصف ${item.titleAr}` : item.titleEn}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4 text-emerald-500 shrink-0" /> : <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Ad Space Mid-Level */}
      <AdSpace type="content" isRtl={isRtl} />

      {/* Bento styled FAQs Section */}
      <section className="my-16" id="faq-section">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {isRtl ? "الأسئلة الشائعة لمعماري السير الذاتية" : "Frequently Asked Questions"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {isRtl 
              ? "تفقد أهم التفاصيل حول كيفية سير المنصة ونقل البيانات وحقوقك كصانع قرار آمن" 
              : "Learn more about local data persistence, security rules, and PDF compilation safeguards."}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          {homeFaqs.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="border-b border-slate-100 last:border-b-0 pb-4 last:pb-0"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center py-3 text-right font-bold text-slate-800 hover:text-blue-600 focus:outline-hidden cursor-pointer selection:bg-transparent"
                  style={{ direction: isRtl ? "rtl" : "ltr" }}
                >
                  <span className="text-sm sm:text-base pr-2">{isRtl ? item.qAr : item.qEn}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transform transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-500" : ""}`} />
                </button>
                {isOpen && (
                  <div 
                    className="mt-2 p-4 bg-slate-50 rounded-2xl text-[13px] sm:text-sm text-slate-600 leading-relaxed text-right border border-slate-100"
                    style={{ direction: isRtl ? "rtl" : "ltr" }}
                  >
                    <p>{isRtl ? item.aAr : item.aEn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

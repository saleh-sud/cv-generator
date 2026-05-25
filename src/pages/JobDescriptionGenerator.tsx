import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Briefcase, Copy, RefreshCw, FileText, Check, AlertCircle, Sparkles, 
  Eye, Printer, Download, Trash2, Globe, ListCheck, HelpCircle, ArrowUpRight
} from "lucide-react";
import AdSpace from "../components/AdSpace";
import { JobDescInput, JobDescOutput } from "../types";

const INITIAL_INPUTS_AR: JobDescInput = {
  jobTitle: "",
  department: "",
  contractType: "دوام كامل (Full-Time)",
  location: "حضوري (On-Site)",
  experienceYears: "",
  responsibilities: "",
  requirements: "",
  skills: "",
  salary: ""
};

const INITIAL_INPUTS_EN: JobDescInput = {
  jobTitle: "",
  department: "",
  contractType: "Full-Time",
  location: "On-Site",
  experienceYears: "",
  responsibilities: "",
  requirements: "",
  skills: "",
  salary: ""
};

const SAMPLE_JOB_AR: JobDescInput = {
  jobTitle: "أخصائي تسويق رقمي قنوات النمو (Growth Hacker)",
  department: "إدارة التسويق والمبيعات السحابية",
  contractType: "دوام كامل (Full-Time)",
  location: "هجين (Hybrid)",
  experienceYears: "3-5 سنوات",
  responsibilities: "1. إدارة وإطلاق الحملات الإعلانية الممولة على منصات السوشيال ميديا.\n2. إعداد وإدارة ميزانيات التسويق الرقمي وتحسين تكلفة التحويل (CPA).\n3. تتبع سلوك زوار الموقع باستخدام Google Analytics وتحسين تجربة التحويل للعميل.\n4. صياغة وتجربة نصوص إعلانية مبتكرة واختبارها بـ A/B testing باستمرار.",
  requirements: "1. درجة بكالوريوس في التسويق الرقمي أو الاتصال والإعلام.\n2. خبرة ملموسة في تسيير إعلانات Google Ads المتقدمة وحيازة شهادات معتمدة.\n3. فهم قوي ومطوّر في تحسين محركات البحث SEO وصياغة نصوص المقالات لجلب الزوار.",
  skills: "تحليل البيانات، إكسل، كتابة كوبي رايتنج جذاب (Copywriting)، إدارة الحملات، أدوات الذكاء الاصطناعي التوليدي",
  salary: "8,000 - 12,000 ريال سعودي شهريًا"
};

const SAMPLE_JOB_EN: JobDescInput = {
  jobTitle: "Senior Full-Stack Developer",
  department: "Software Product Engineering Division",
  contractType: "Full-Time",
  location: "Remote",
  experienceYears: "5+ Years",
  responsibilities: "1. Design, build, and deploy robust APIs with Node.js and REST/GraphQL patterns.\n2. Create adaptive, pixel-perfect user interfaces using React and Tailwind CSS.\n3. Conduct comprehensive team code reviews to guarantee safety, quality, and style standards.\n4. Configure and monitor automated serverless cloud pipelines in high-availability systems.",
  requirements: "1. Bachelor's degree in Computer Science or Software Engineering.\n2. Advanced expert history utilizing modern serverless states and microservice designs.\n3. Demonstrated mastery of database engines like PostgreSQL, MongoDB, and Redis caching.",
  skills: "TypeScript, React, Node.js, Next.js, Docker, Kubernetes, GCP, PostgreSQL, Redis",
  salary: "$95,000 - $125,000 / Year"
};

interface JobDescriptionGeneratorProps {
  globalIsRtl?: boolean;
}

export default function JobDescriptionGenerator({ globalIsRtl }: JobDescriptionGeneratorProps = {}) {
  // Use page local language direction setting
  const [toolLanguage, setToolLanguage] = useState<"ar" | "en">(globalIsRtl === false ? "en" : "ar");
  const [inputs, setInputs] = useState<JobDescInput>(INITIAL_INPUTS_AR);
  const [output, setOutput] = useState<JobDescOutput | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // AI Simulation States
  const [isAiSummaryLoading, setIsAiSummaryLoading] = useState(false);
  const [isAiPolisherLoading, setIsAiPolisherLoading] = useState(false);
  const [isAiSkillsLoading, setIsAiSkillsLoading] = useState(false);

  const isRtl = toolLanguage === "ar";

  // Toggle internal tool language & swap appropriate defaults/samples
  const handleToggleToolLanguage = () => {
    const nextLang = toolLanguage === "ar" ? "en" : "ar";
    setToolLanguage(nextLang);
    
    // Clear output on language toggle and reset schema
    setOutput(null);
    setInputs(nextLang === "ar" ? INITIAL_INPUTS_AR : INITIAL_INPUTS_EN);
    
    triggerAlert(
      nextLang === "ar" 
        ? "🔄 تم تحويل واجهة المولد للغة العربية (RTL)" 
        : "🔄 Interfaced transitioned to English layout (LTR)"
    );
  };

  // Restore draft on mount
  useEffect(() => {
    const saved = localStorage.getItem("jd_generator_draft");
    const savedLang = localStorage.getItem("jd_generator_lang");
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInputs(parsed);
        if (savedLang) {
          setToolLanguage(savedLang as "ar" | "en");
        }
        if (parsed.jobTitle) {
          generateJdFromState(parsed, savedLang === "en" ? "en" : "ar");
        }
      } catch (e) {
        console.error("Failed to restore JD draft", e);
      }
    }
  }, []);

  // Sync internal toolLanguage state with globalIsRtl toggler
  useEffect(() => {
    if (globalIsRtl !== undefined) {
      const targetLang = globalIsRtl ? "ar" : "en";
      if (toolLanguage !== targetLang) {
        setToolLanguage(targetLang);
        setOutput(null);
        setInputs(targetLang === "ar" ? INITIAL_INPUTS_AR : INITIAL_INPUTS_EN);
      }
    }
  }, [globalIsRtl]);

  const saveStateDraft = (updated: JobDescInput, currentLang: "ar" | "en") => {
    setInputs(updated);
    localStorage.setItem("jd_generator_draft", JSON.stringify(updated));
    localStorage.setItem("jd_generator_lang", currentLang);
  };

  const handleFieldChange = (field: keyof JobDescInput, value: string) => {
    const updated = { ...inputs, [field]: value };
    saveStateDraft(updated, toolLanguage);
  };

  const generateJdFromState = (stateData: JobDescInput, lang: "ar" | "en") => {
    if (!stateData.jobTitle || !stateData.responsibilities) {
      return;
    }

    const parseLines = (text: string) => {
      return text
        .split("\n")
        .map(line => line.replace(/^[0-9+.\-*\u2022]\s*/, "").trim())
        .filter(line => line.length > 0);
    };

    const isAr = lang === "ar";
    const parsedSummary = isAr
      ? `نبحث عن ${stateData.jobTitle} محترف ومتحمس للانضمام إلى فريقنا المتميز في قسم ${stateData.department || "العمليات"}. سيقوم شاغل الوظيفة بقيادة وتسيير المهام التنفيذية والتعاون مع الزملاء لضمان تسليم المخرجات والحلول المبتكرة بأعلى معايير الجودة للشركة.`
      : `We are searching for an experienced and highly driven ${stateData.jobTitle} to join our growing team within the ${stateData.department || "Operations"} department. In this critical workspace role, you will lead daily tasks, collaborate on key milestones, and deploy robust solutions to maximize customer and organizational efficiency.`;

    const generatedOut: JobDescOutput = {
      jobTitle: stateData.jobTitle,
      department: stateData.department || (isAr ? "غير محدد" : "General Department"),
      jobSummary: parsedSummary,
      responsibilities: parseLines(stateData.responsibilities),
      requirements: parseLines(stateData.requirements),
      skills: stateData.skills ? stateData.skills.split(/[,،]/).map(s => s.trim()).filter(Boolean) : [],
      contractType: stateData.contractType,
      workLocation: stateData.location,
      salary: stateData.salary || undefined
    };

    setOutput(generatedOut);
  };

  const handleGenerateClick = () => {
    if (!inputs.jobTitle) {
      triggerAlert(isRtl ? "❌ يرجى كتابة المسمى الوظيفي المستهدف كحد أدنى." : "❌ Please enter a target Job Title.");
      return;
    }
    if (!inputs.responsibilities) {
      triggerAlert(isRtl ? "❌ يرجى إدخال المسؤوليات والمهام لتوليد الوصف." : "❌ Please enter key responsibilities first.");
      return;
    }
    generateJdFromState(inputs, toolLanguage);
    triggerAlert(isRtl ? "✨ تم توليد بطاقة الوصف الوظيفي بنجاح!" : "✨ Professional job description compiled successfully!");
    
    // Smooth scroll down to preview on mobile
    const element = document.getElementById("jd-preview-control");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const loadSample = () => {
    const sample = isRtl ? SAMPLE_JOB_AR : SAMPLE_JOB_EN;
    saveStateDraft(sample, toolLanguage);
    generateJdFromState(sample, toolLanguage);
    triggerAlert(isRtl ? "💡 تم ملء حقول المولد بنموذج تجريبي متكامل!" : "💡 Rich industry sample loaded successfully!");
  };

  const clearForm = () => {
    setShowClearConfirm(true);
  };

  const confirmClearForm = () => {
    const empty = isRtl ? INITIAL_INPUTS_AR : INITIAL_INPUTS_EN;
    saveStateDraft(empty, toolLanguage);
    setOutput(null);
    triggerAlert(isRtl ? "🧹 تم إرجاع الحقول للوضع الافتراضي." : "🧹 Form reset to default.");
    setShowClearConfirm(false);
  };

  const triggerAlert = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  const copyJdText = () => {
    if (!output) return;

    const isAr = toolLanguage === "ar";
    const textToCopy = isAr ? `
بطاقة الوصف الوظيفي الرسمية:
📌 المسمى الوظيفي: ${output.jobTitle}
🏢 القسم التابع له: ${output.department}
📝 نوع العقد: ${output.contractType}
📍 مكان وبيئة العمل: ${output.workLocation}
${output.salary ? `💰 الراتب والمكافآت المتوقعة: ${output.salary}` : ""}

📋 ملخص مبسط للدور الوظيفي:
${output.jobSummary}

🛠️ المهام والمسؤوليات الأساسية:
${output.responsibilities.map((r, i) => `${i + 1}. ${r}`).join("\n")}

🎓 المؤهلات المطلوبة وشروط التقديم:
${output.requirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}

🔑 المهارات والكفاءات الشخصية:
${output.skills.join(" - ")}

تم التوليد والتنسيق مجاناً عبر منصة JobTools (أدوات الوظائف).
    ` : `
Official Job Specification:
📌 Target Title: ${output.jobTitle}
🏢 Department/Team: ${output.department}
📝 Contract Style: ${output.contractType}
📍 Location/Environment: ${output.workLocation}
${output.salary ? `💰 Target Salary / Compensation: ${output.salary}` : ""}

📋 General Role Summary:
${output.jobSummary}

🛠️ Core Responsibilities & Duties:
${output.responsibilities.map((r, i) => `- ${r}`).join("\n")}

🎓 Experience Requirements & Qualifications:
${output.requirements.map((r, i) => `- ${r}`).join("\n")}

🔑 Skills & Competencies:
${output.skills.join(" | ")}

Compiled and styled via JobTools Professional Portal.
    `;

    navigator.clipboard.writeText(textToCopy.trim());
    triggerAlert(isRtl ? "📋 تم نسخ النص المنسق للوصف الوظيفي!" : "📋 Job description text copied to clipboard!");
  };

  // Modern Native printable action linking Tailwind as requested
  const handlePrintPdf = () => {
    if (!output) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert(isRtl ? "يرجى السماح بالنوافذ المنبثقة لطباعة بطاقة الوصف." : "Please allow pop-ups to print the description.");
      return;
    }

    const direction = toolLanguage === "ar" ? "rtl" : "ltr";
    const alignClass = toolLanguage === "ar" ? "text-right" : "text-left";

    const printContent = `
      <!DOCTYPE html>
      <html dir="${direction}" lang="${toolLanguage}">
      <head>
        <title>${output.jobTitle} - ${toolLanguage === 'ar' ? 'بطاقة الوصف الوظيفي' : 'Job Specification'}</title>
        <meta charset="utf-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background-color: #ffffff; color: #0f172a; padding: 40px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body class="p-8 md:p-12 ${alignClass}">
        <div class="max-w-3xl mx-auto border border-slate-300 rounded-3xl p-8 sm:p-10 shadow-xs relative">
          
          {/* Header layout */}
          <div class="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-6">
            <div>
              <span class="text-xs font-bold text-blue-600 tracking-wider uppercase">${output.department}</span>
              <h1 class="text-3xl font-black text-slate-900 mt-1">${output.jobTitle}</h1>
              <div class="flex flex-wrap gap-4 text-xs font-bold text-slate-500 mt-4">
                <span>💼 ${output.contractType}</span>
                <span>📍 ${output.workLocation}</span>
                ${inputs.experienceYears ? `<span>⏳ ${toolLanguage === 'ar' ? 'سنوات الخبرة:' : 'Required Experience:'} ${inputs.experienceYears}</span>` : ''}
                ${output.salary ? `<span class="text-emerald-700 font-extrabold">💰 ${output.salary}</span>` : ''}
              </div>
            </div>
            <div class="text-left font-mono text-[10px] text-slate-400 shrink-0">
              <p>REF: JT-${Math.floor(Math.random() * 90000) + 10000}</p>
              <p>DATE: ${new Date().toLocaleDateString(toolLanguage === 'ar' ? 'ar-SA' : 'en-US')}</p>
              <p>PORTAL: JobTools</p>
            </div>
          </div>

          {/* Core Body Section */}
          <div class="space-y-6">
            
            <div>
              <h3 class="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-1.5 mb-2.5">
                ${toolLanguage === 'ar' ? '📝 ملخص عام للدور الوظيفي' : '📝 General Role Summary'}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">${output.jobSummary}</p>
            </div>

            ${output.responsibilities.length > 0 ? `
              <div>
                <h3 class="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-1.5 mb-2.5">
                  ${toolLanguage === 'ar' ? '🛠️ المهام والمسؤوليات الأساسية' : '🛠️ Key Responsibilities & Daily Tasks'}
                </h3>
                <ul class="list-decimal pl-5 pr-5 space-y-2 text-xs sm:text-sm text-slate-700">
                  ${output.responsibilities.map(item => `<li class="leading-relaxed">${item}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${output.requirements.length > 0 ? `
              <div>
                <h3 class="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-1.5 mb-2.5">
                  ${toolLanguage === 'ar' ? '🎓 الشروط والمؤهلات المطلوبة' : '🎓 Required Qualifications & Experience'}
                </h3>
                <ul class="list-disc pl-5 pr-5 space-y-2 text-xs sm:text-sm text-slate-700">
                  ${output.requirements.map(item => `<li class="leading-relaxed">${item}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${output.skills.length > 0 ? `
              <div>
                <h3 class="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-1.5 mb-2.5">
                  ${toolLanguage === 'ar' ? '🔑 المهارات والكفاءات الشخصية' : '🔑 Core Skills & Tool Competencies'}
                </h3>
                <div class="flex flex-wrap gap-2 pt-1">
                  ${output.skills.map(st => `<span class="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-bold">${st}</span>`).join('')}
                </div>
              </div>
            ` : ''}

          </div>

          <div class="mt-12 pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400">
            <p>${toolLanguage === 'ar' ? 'تم توليد هذه الوثيقة وتنسيقها بواسطة منصة أدوات الوظائف JobTools.' : 'Generated and compiled using JobTools Portal.'}</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  /* ==========================================================
     EXTENSIBLE AI COPILOT WORKSPACE (STUB CODE / MOCK)
     ========================================================== */

  // 1. AI Summary Generator
  const runAiSummaryGenerator = () => {
    if (!inputs.jobTitle) {
      triggerAlert(isRtl ? "⚠️ اكتب المسمى الوظيفي أولاً ليتمكن الذكاء الاصطناعي من صياغة الملخص." : "⚠️ Please write the target Job Title first.");
      return;
    }
    
    setIsAiSummaryLoading(true);
    
    // Developer Integration Note:
    // To connect to a real Gemini API backend or server-side endpoint, swap this block with:
    // const response = await fetch('/api/gemini/summary', { method: 'POST', body: JSON.stringify({ title: inputs.jobTitle }) });
    // const text = await response.text();
    // Then set output to the resulting string.
    
    setTimeout(() => {
      setIsAiSummaryLoading(false);
      const isAr = toolLanguage === "ar";
      
      const aiSummary = isAr 
        ? `بصفتك قيادياً ملهماً في دور ${inputs.jobTitle}، ستتولى الإشراف على دفع وتطوير الاستراتيجيات الفنية والإدارية، وتطوير معايير الجودة للقسم. نحن نبحث عن عقلية شغوفة قادرة على تحسين الأداء العام وابتكار حلول مبتكرة تنعكس بشكل ملموس على فاعلية الفريق والإنتاجية العامة للشركة.`
        : `As a forward-thinking catalyst in the ${inputs.jobTitle} role, you will champion tactical execution, drive collaborative success, and architect standards to ensure elite levels of operational excellence. We seek a passionate, data-driven professional equipped to optimize daily workflows and navigate high-risk decisions.`;

      if (output) {
        setOutput({
          ...output,
          jobSummary: aiSummary
        });
        triggerAlert(isAr ? "🤖 قام الذكاء الاصطناعي بإعادة كتابة وتلميع خلاصة الوظيفة!" : "🤖 AI successfully drafted a professional role introduction!");
      } else {
        triggerAlert(isAr ? "⚠️ يرجى النقر على زر التوليد العام للبطاقة أولاً لتطبيق التعديل الذكي." : "⚠️ Please click compile first to spawn the core layout.");
      }
    }, 1200);
  };

  // 2. AI Bullet Improver / Polisher
  const runAiBulletPolisher = () => {
    if (!output || output.responsibilities.length === 0) {
      triggerAlert(isRtl ? "⚠️ يرجى توليد بطاقة الوصف الوظيفي والمسؤوليات لتنقيتها بالذكاء الاصطناعي." : "⚠️ Ensure responsibilities exist prior to polishing.");
      return;
    }

    setIsAiPolisherLoading(true);

    setTimeout(() => {
      setIsAiPolisherLoading(false);
      const isAr = toolLanguage === "ar";
      
      // Professional corporate action-verb expansions
      const polished = output.responsibilities.map(r => {
        if (isAr) {
          return r.includes("إدارة") || r.includes("تتبع") || r.includes("تحسين") 
            ? `تأطير و${r} وفقًا لمؤشرات الأداء القياسية للجهوزية والموثوقية العالية.` 
            : `${r} مع تطبيق معايير هندسية رصينة ومراجعة مستمرة للمخاطر.`;
        } else {
          return `Proactively executing ${r.toLowerCase()} while optimizing cross-functional metrics and scaling reliability.`;
        }
      });

      setOutput({
        ...output,
        responsibilities: polished
      });
      triggerAlert(isAr ? "🤖 تم صقل وتحسين النقاط بصياغة احترافية ممتازة!" : "🤖 AI sharpened bullet points with strong industry verbs!");
    }, 1200);
  };

  // 3. AI Skills Generator / Suggestor
  const runAiSkillsSuggester = () => {
    if (!inputs.jobTitle) {
      triggerAlert(isRtl ? "⚠️ اكتب المسمى الوظيفي أولاً لاقتراح كفاءات ملائمة له." : "⚠️ Enter Job Title prior to suggesting skills.");
      return;
    }

    setIsAiSkillsLoading(true);

    setTimeout(() => {
      setIsAiSkillsLoading(false);
      const isAr = toolLanguage === "ar";
      
      const techSkills = isAr 
        ? ["إدارة الكفاءات الرقمية", "التفكير التصميمي والتحليلي", "إتقان أدوات الأتمتة الحديثة (SaaS)", "صياغة مؤشرات تقييم الأداء KPIs"]
        : ["Strategic Cloud Optimization", "KPI Dashboard Development", "Agile Task Prioritization", "Cross-functional Leadership"];

      const existingSkills = inputs.skills ? inputs.skills.split(/[,،]/).map(s => s.trim()).filter(Boolean) : [];
      const combined = Array.from(new Set([...existingSkills, ...techSkills]));

      const updatedInputs = {
        ...inputs,
        skills: combined.join(isAr ? "، " : ", ")
      };
      
      saveStateDraft(updatedInputs, toolLanguage);
      if (output) {
        setOutput({
          ...output,
          skills: combined
        });
      }
      triggerAlert(isAr ? "🤖 تم اقتراح وإضافة مهارات جديدة لبطاقتك!" : "🤖 Instantly suggested 4 advanced industry competencies!");
    }, 1100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      
      {/* Proposed Top Ad banner placement */}
      <AdSpace type="top" isRtl={isRtl} />

      {/* Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-150 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-2">
              {isRtl ? "هل أنت متأكد من مسح كافة المدخلات؟" : "Confirm Clear Form"}
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {isRtl 
                ? "سيؤدي هذا إلى تفريغ كافة حقول استمارة الوصف الوظيفي والبدء بصفحة فارغة." 
                : "This action will completely erase all current inputs and reset the job desc template."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmClearForm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all cursor-pointer"
              >
                {isRtl ? "نعم، مسح البيانات" : "Yes, Clear All"}
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-150 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                {isRtl ? "تراجع" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Panel with options */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-2 text-blue-600">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full">
              {isRtl ? "لوحة الموارد البشرية ومسؤولي التوظيف" : "HR & Corporate Recruiter Workspace"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {isRtl ? "مولد الوصف الوظيفي الاحترافي" : "Professional Job Description Builder"}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
            {isRtl 
              ? "أنشئ توصيفات مهنية متكاملة متوافقة بالكامل مع خوارزميات الـ ATS، غنية بالمهام، مع أدوات ذكاء اصطناعي تجريبية مدمجة للتلميع."
              : "Generate structured, print-ready corporate profiles structured custom to recruitment requirements."}
          </p>
        </div>

        {/* Action Widgets */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleToolLanguage}
            className="px-4 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-blue-100"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>{isRtl ? "تحويل إلى English (LTR)" : "Switch to Arabic (RTL)"}</span>
          </button>
          
          <button 
            type="button" 
            onClick={loadSample} 
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            💡 {isRtl ? "استيراد نموذج جاهز" : "Load Fast Sample"}
          </button>
          
          <button 
            type="button" 
            onClick={clearForm} 
            className="px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isRtl ? "مسح الاستمارة" : "Clear Form"}</span>
          </button>
        </div>
      </div>

      {/* Layout Grid (Left Form - Right Preview Page) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Input form Area */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative">
            <span className="absolute top-4 left-4 text-[9px] font-mono font-bold text-slate-400">
              {isRtl ? "معلومات الهوية" : "JOB IDENTIFICATION"}
            </span>
            
            <h3 className="font-extrabold text-slate-900 text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <span className="w-2.5 h-5 rounded-md bg-blue-600"></span>
              <span>{isRtl ? "الهوية وهيكل الدور" : "Role Classification"}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isRtl ? "المسمى الوظيفي المستهدف *" : "Target Job Title *"}
                </label>
                <input 
                  type="text" 
                  value={inputs.jobTitle} 
                  onChange={(e) => handleFieldChange("jobTitle", e.target.value)}
                  placeholder={isRtl ? "مثال: مخرج إبداعي، مهندس معماري" : "e.g., Lead Creative Director"} 
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 hover:border-slate-300 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isRtl ? "القسم أو الإدارة المعنية" : "Department / Division"}
                </label>
                <input 
                  type="text" 
                  value={inputs.department} 
                  onChange={(e) => handleFieldChange("department", e.target.value)}
                  placeholder={isRtl ? "مثال: إدارة الإنتاج الرقمي" : "e.g., Marketing Operations"} 
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 hover:border-slate-300 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isRtl ? "نوع عقد العمل" : "Employment Schedule"}
                </label>
                <select 
                  value={inputs.contractType}
                  onChange={(e) => handleFieldChange("contractType", e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 bg-white hover:border-slate-300 transition-colors"
                >
                  {isRtl ? (
                    <>
                      <option>دوام كامل (Full-Time)</option>
                      <option>دوام جزئي (Part-Time)</option>
                      <option>تدريب تعاوني (Co-op / Intern)</option>
                      <option>عمل حر وعقود (Freelance / Contract)</option>
                    </>
                  ) : (
                    <>
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Internship</option>
                      <option>Freelance / Contract</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isRtl ? "مكان وبيئة العمل" : "Workplace Arrangement"}
                </label>
                <select 
                  value={inputs.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 bg-white hover:border-slate-300 transition-colors"
                >
                  {isRtl ? (
                    <>
                      <option>حضوري (On-Site)</option>
                      <option>هجين (Hybrid)</option>
                      <option>عن بعد بالكامل (Remote)</option>
                    </>
                  ) : (
                    <>
                      <option>On-Site</option>
                      <option>Hybrid</option>
                      <option>Remote</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isRtl ? "المستوى وسنوات الخبرة المطلوبة" : "Years of Experience Needed"}
                </label>
                <input 
                  type="text" 
                  value={inputs.experienceYears} 
                  onChange={(e) => handleFieldChange("experienceYears", e.target.value)}
                  placeholder={isRtl ? "مثال: 3 إلى 5 سنوات" : "e.g., 2-4 Years"} 
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 hover:border-slate-300 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isRtl ? "الراتب والمزايا المتوقعة (اختياري)" : "Target Salary & Perks (Optional)"}
                </label>
                <input 
                  type="text" 
                  value={inputs.salary} 
                  onChange={(e) => handleFieldChange("salary", e.target.value)}
                  placeholder={isRtl ? "مثال: 9,000 - 12,000 ريال سعودي" : "e.g., $80,000 - $110,000 / Yr"} 
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 hover:border-slate-300 transition-colors" 
                />
              </div>
            </div>
          </div>

          {/* Cards 2: Bullet Lists Content */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {isRtl ? "المهام والمسؤوليات الأساسية *" : "Key Responsibilities & Duties *"}
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isRtl ? "اكتب كل مهمة في سطر مستقل" : "One instruction per newline"}
                </span>
              </div>
              <textarea 
                rows={5}
                value={inputs.responsibilities}
                onChange={(e) => handleFieldChange("responsibilities", e.target.value)}
                placeholder={
                  isRtl 
                    ? "1. إدارة وإطلاق الحملات الإعلانية المدفوعة.\n2. إعداد وتحليل التقارير الشهرية."
                    : "- Deploy scalable client software systems.\n- Manage code review tasks daily."
                }
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 leading-relaxed hover:border-slate-300 transition-colors" 
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {isRtl ? "الشروط والشهادات المطلوبة" : "Skills Requirements & Qualifications"}
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isRtl ? "اكتب كل شرط في سطر مستقل" : "One item per newline"}
                </span>
              </div>
              <textarea 
                rows={4}
                value={inputs.requirements}
                onChange={(e) => handleFieldChange("requirements", e.target.value)}
                placeholder={
                  isRtl 
                    ? "1. درجة بكالوريوس في علوم الحاسب.\n2. شهادة معتمدة من Google للمحترفين."
                    : "- Bachelor's degree in Computer Science.\n- Proven prior hands-on agile project experience."
                }
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 leading-relaxed hover:border-slate-300 transition-colors" 
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {isRtl ? "المهارات والكفاءات المطلوبة" : "Compulsory Target Competencies"}
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isRtl ? "افصل بينها بفواصل (،)" : "Delimit with commas (,)"}
                </span>
              </div>
              <input 
                type="text"
                value={inputs.skills}
                onChange={(e) => handleFieldChange("skills", e.target.value)}
                placeholder={isRtl ? "مثال: التفكير الإبداعي، تحليل أداء Google Ads، كتابة محتوى" : "e.g., UI/UX, Google Analytics, Copywriting, React"} 
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 hover:border-slate-300 transition-colors" 
              />
            </div>

          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerateClick}
              className="w-full py-4 text-center font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all text-base cursor-pointer"
            >
              {isRtl ? "توليد وتنسيق بطاقة الوصف الوظيفي" : "Compile Professional Spec Card"}
            </button>
          </div>

        </div>

        {/* Right Output and Preview Box */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-20 bg-white border border-slate-200 rounded-3xl shadow-md p-5" id="jd-preview-control">
            
            {/* Action Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5 mb-4">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                <Eye className="w-5 h-5 text-blue-600 animate-pulse" />
                <span>{isRtl ? "معاينة بطاقة الوصف" : "Document Active Preview"}</span>
              </h3>
              
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={copyJdText}
                  disabled={!output}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed font-extrabold text-xs text-blue-700 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  title={isRtl ? "نسخ محتوى الوصف" : "Copy to clipboard"}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isRtl ? "نسخ" : "Copy"}</span>
                </button>
                
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  disabled={!output}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-extrabold text-xs text-slate-700 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  title={isRtl ? "طباعة وتحميل PDF" : "Print Document"}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isRtl ? "تحميل PDF" : "Print PDF"}</span>
                </button>
              </div>
            </div>

            {/* Simulated AI Powerhouse Playground Container */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-black text-indigo-950 uppercase">
                  {isRtl ? "مساعد الذكاء الاصطناعي التجريبي (AI Copilot)" : "AI Co-pilot Workspace (Beta)"}
                </h4>
              </div>
              
              <p className="text-[10px] text-indigo-850 mb-3.5 leading-relaxed">
                {isRtl 
                  ? "قم بتجربة تلميع البيانات عبر وظائف الذكاء الاصطناعي للتحقق من الصياغة المتقدمة وأقلمة المهارات الذكية."
                  : "Sharpen text clarity, suggest rich industry capabilities, and formulate executive summaries."}
              </p>

              {/* Interactive Stub buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center">
                <button
                  onClick={runAiSummaryGenerator}
                  disabled={isAiSummaryLoading}
                  className="px-2.5 py-2 bg-white hover:bg-indigo-100/50 border border-indigo-200 text-indigo-950 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-55"
                >
                  {isAiSummaryLoading ? (
                    <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  )}
                  <span>{isRtl ? "كتابة خلاصة ذكية" : "Draft Summary"}</span>
                </button>

                <button
                  onClick={runAiBulletPolisher}
                  disabled={isAiPolisherLoading}
                  className="px-2.5 py-2 bg-white hover:bg-indigo-100/50 border border-indigo-200 text-indigo-950 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-55"
                >
                  {isAiPolisherLoading ? (
                    <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin" />
                  ) : (
                    <ListCheck className="w-3 h-3 text-indigo-600" />
                  )}
                  <span>{isRtl ? "صقل الصياغة" : "Polish Bullets"}</span>
                </button>

                <button
                  onClick={runAiSkillsSuggester}
                  disabled={isAiSkillsLoading}
                  className="px-2.5 py-2 bg-white hover:bg-indigo-100/50 border border-indigo-200 text-indigo-950 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-55"
                >
                  {isAiSkillsLoading ? (
                    <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin" />
                  ) : (
                    <Briefcase className="w-3 h-3 text-indigo-600" />
                  )}
                  <span>{isRtl ? "اقتراح كفاءات" : "Suggest Skills"}</span>
                </button>
              </div>

              {/* Developer Integration Documentation Inline */}
              <div className="mt-3.5 pt-2.5 border-t border-indigo-100 text-[9px] text-indigo-900/75 select-none font-mono">
                <p className="font-bold">// Developer Note for API Integration:</p>
                <p className="mt-0.5">💡 Run @google/genai module client-side or bind the buttons to proxy route /api/gemini safely.</p>
              </div>
            </div>

            {/* Generated Output Preview Section */}
            {!output ? (
              <div className="min-h-[380px] bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-500 text-center">
                <Briefcase className="w-8 h-8 text-slate-400 mb-2 animate-pulse" />
                <p className="font-extrabold text-slate-700 text-sm">
                  {isRtl ? "بطاقة مواصفات الوظيفة فارغة" : "No compiled profile to preview"}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed">
                  {isRtl 
                    ? "املأ الاستمارة على اليمين ثم اضغط على زر التوليد السري لتعبئة البيانات هنا."
                    : "Fill corporate attributes and tasks then trigger execution helper."}
                </p>
              </div>
            ) : (
              <div 
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-800 relative select-text"
                id="printable-jd-element"
              >
                {/* Meta details decoration */}
                <div className="absolute top-4 left-4 text-[8px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                  {isRtl ? "مُعتمد" : "ACTIVE SPEC"}
                </div>

                <div className="border-b border-slate-200 pb-4 mb-4">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">
                    {output.department}
                  </span>
                  
                  <h2 className="text-lg font-black text-slate-900 leading-tight">
                    {output.jobTitle}
                  </h2>
                  
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-bold mt-2.5">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">💼 {output.contractType}</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">📍 {output.workLocation}</span>
                    {inputs.experienceYears && (
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">⏳ {isRtl ? "الخبرة:" : "Required:"} {inputs.experienceYears}</span>
                    )}
                    {output.salary && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-bold">💰 {output.salary}</span>
                    )}
                  </div>
                </div>

                {/* Job Summary */}
                <div className="mb-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase mb-1.5 flex items-center gap-1">
                    <span>📝</span>
                    <span>{isRtl ? "ملخص عام للدور" : "General Role Summary"}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    {output.jobSummary}
                  </p>
                </div>

                {/* Scope of responsibilities */}
                {output.responsibilities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase mb-2 flex items-center gap-1">
                      <span>🛠️</span>
                      <span>{isRtl ? "المهام والمسؤوليات اليومية" : "Key Responsibilities"}</span>
                    </h4>
                    <ul className={`${isRtl ? "pr-4" : "pl-4"} list-decimal space-y-1.5 text-xs text-slate-700`}>
                      {output.responsibilities.map((item, id) => (
                        <li key={id} className="leading-relaxed pl-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Demanded specifications */}
                {output.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase mb-2 flex items-center gap-1">
                      <span>🎓</span>
                      <span>{isRtl ? "الشروط والمؤهلات المطلوبة" : "Required Qualifications"}</span>
                    </h4>
                    <ul className={`${isRtl ? "pr-4" : "pl-4"} list-disc space-y-1 text-xs text-slate-700`}>
                      {output.requirements.map((item, id) => (
                        <li key={id} className="leading-relaxed pl-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills tags */}
                {output.skills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase mb-2 flex items-center gap-1">
                      <span>🔑</span>
                      <span>{isRtl ? "المهارات والكفاءات الشخصية" : "Core Skills"}</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {output.skills.map((st, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] font-bold bg-white text-slate-700 border border-slate-200 rounded-md shadow-2xs">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Ad Space Sidebar */}
          <AdSpace type="sidebar" isRtl={isRtl} />
        </div>

      </div>

      {/* Suggested Inline content ad space */}
      <AdSpace type="content" isRtl={isRtl} />

      {/* Quick Helpful Advisory Guidelines */}
      <section className="mt-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span>{isRtl ? "إرشادات صياغة وتطوير الأوصاف الوظيفية" : "Professional Job Description Guidelines"}</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <p>
              {isRtl 
                ? "💡 ابدأ دائمًا بمسمى وظيفي دقيق ومعياري. تجنب الكلمات الغامضة أو الإبداعية مفرطة التكلف مثل 'معجزة التسويق' أو 'ساحر البرمجيات'، لأن هذه المسميات تفشل في مرشحات البحث الداخلي وأنظمة التوظيف (ATS)." 
                : "💡 Start with a clear and industry-standard job title. Creative or inflated titles like 'Marketing Guru' or 'Code Ninja' make it extremely difficult for automated recruitment parsers to classify and index your listing correctly."}
            </p>
            <p>
              {isRtl 
                ? "💡 رتب المسؤوليات اليومية تصاعديًا تِبعًا لأهميتها أو نسبة تكرارها الفعلي. حدد ما لا يقل عن 5 مهام رئيسية واضحة تجيب بدقة على ما سيفعله المرشح طوال يوم عمله." 
                : "💡 Rank daily objectives sequentially in terms of functional importance or hourly occurrence. A strong list must feature at least 5 transparent indicators of what a recruit actually executes on a daily shift."}
            </p>
          </div>
          
          <div className="space-y-3">
            <p>
              {isRtl 
                ? "💡 حدد مهارات تقنية صريحة وقابلة للقياس (مثل: تحليل البيانات ببرنامج إكسل، معالجة الجداول الزمنية، نمذجة بايثون). يفيد ذلك محركات البحث ومسؤولي الفلترة في تصفية الطلبات." 
                : "💡 Demarcate technical capabilities clearly (e.g., PostgreSQL indexing, advanced MS Excel modeling). Avoid bloated terms like 'fast learner' unless heavily paired with proven professional contexts."}
            </p>
            <p>
              {isRtl 
                ? "💡 عند تشغيل المنصة في خطة الإنتاج وتفعيل موديول الذكاء الاصطناعي، يوصى بالاتصال بنموذج gemini-2.5-pro للحصول على أفضل صياغات مهنية دقيقة ومصطلحات معتمدة للمهن المختلفة." 
                : "💡 For elite outcome accuracy upon API release, we heavily suggest binding this module workspace either to a server route or utilizing client-side fetchers targeting gemini-2.5-pro."}
            </p>
          </div>
        </div>
      </section>

      {/* alert notification panel */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 z-55 bg-slate-900 text-white py-3.5 px-6 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 max-w-sm animate-bounce">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{showNotification}</span>
        </div>
      )}

    </div>
  );
}


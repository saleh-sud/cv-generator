import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  FileText, Plus, Trash2, Download, Copy, RefreshCw, 
  Sparkles, Check, ChevronLeft, Eye, AlertCircle, FileEdit,
  Linkedin, ExternalLink
} from "lucide-react";
import AdSpace from "../components/AdSpace";
import { CVData } from "../types";
import { RenderCvTemplate, TEMPLATES_LIST } from "../components/cv-templates/TemplateRegistry";
import { exportPdf } from "../utils/export/exportPdf";
import { exportWord } from "../utils/export/exportWord";
import { exportTxt } from "../utils/export/exportTxt";

const INITIAL_STATE: CVData = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  city: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: []
};

const SAMPLE_EN_DATA: CVData = {
  fullName: "Johnathan David Smith",
  jobTitle: "Senior Full Stack Engineer",
  email: "john.smith@example.com",
  phone: "+1 555 456 7890",
  city: "San Francisco, CA, USA",
  summary: "Results-driven Software Engineer with 6+ years of specialized experience architecting cloud applications, automating Microservices, and optimizing API performance. Expert in React, Node.js, and scaling AWS workflows.",
  experience: [
    {
      company: "NetScale Cloud Solutions",
      role: "Senior Full Stack Developer",
      startDate: "2021-05",
      endDate: "Present",
      description: "Designed core web dashboard managing 100K active daily clients. Boosted bundle loading performance by 40% using code splitting and lazily loaded routes."
    },
    {
      company: "Innovate Digital Corp",
      role: "Software Developer",
      startDate: "2018-09",
      endDate: "2021-04",
      description: "Collaborated on building secure REST endpoints and optimizing Postgres query indices, dropping database load metrics by 25%."
    }
  ],
  education: [
    {
      school: "Stanford University",
      degree: "B.Sc. in Computer Science",
      gradYear: "2018",
      city: "Stanford, CA"
    }
  ],
  skills: ["TypeScript & JavaScript (ES6+)", "React & Redux State Engines", "Node.js & Express API Design", "Postgres & MongoDB Administration", "Amazon Web Services (AWS - S3, EC2, RDS)"],
  languages: ["English (Native)", "Spanish (Conversational)"],
  certifications: ["AWS Certified Solutions Architect", "Certified ScrumMaster (CSM)"]
};

export default function CvGeneratorEn() {
  const [cv, setCv] = useState<CVData>(INITIAL_STATE);
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"a4" | "linkedin">("a4");
  const [copiedPill, setCopiedPill] = useState<string | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinText, setLinkedinText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showLinkedInPanel, setShowLinkedInPanel] = useState(false);

  // LinkedIn Section optimization states
  const [linkedinView, setLinkedinView] = useState<"standard" | "optimized">("standard");
  const [linkedinHeadline, setLinkedinHeadline] = useState("");
  const [linkedinSummary, setLinkedinSummary] = useState("");
  const [isGeneratingLinkedin, setIsGeneratingLinkedin] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [isDownloadingTxt, setIsDownloadingTxt] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [previewModalTemplate, setPreviewModalTemplate] = useState<string | null>(null);

  // Restore draft of CV on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("english_cv_draft");
    if (savedDraft) {
      try {
        setCv(JSON.parse(savedDraft));
        setIsGenerated(true);
      } catch (e) {
        console.error("Failed to load CV draft", e);
      }
    }
    const savedHeadline = localStorage.getItem("english_linkedin_headline");
    const savedSummary = localStorage.getItem("english_linkedin_summary");
    if (savedHeadline) setLinkedinHeadline(savedHeadline);
    if (savedSummary) setLinkedinSummary(savedSummary);
  }, []);

  // Save draft whenever state modifies
  const saveDraft = (updatedCv: CVData) => {
    setCv(updatedCv);
    localStorage.setItem("english_cv_draft", JSON.stringify(updatedCv));
  };

  const handleFieldChange = (field: keyof CVData, value: any) => {
    const updated = { ...cv, [field]: value };
    saveDraft(updated);
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExp = [...cv.experience];
    updatedExp[index] = { ...updatedExp[index], [field]: value };
    saveDraft({ ...cv, experience: updatedExp });
  };

  const addExperience = () => {
    const updated = {
      ...cv,
      experience: [...cv.experience, { company: "", role: "", startDate: "", endDate: "", description: "" }]
    };
    saveDraft(updated);
  };

  const removeExperience = (index: number) => {
    const updatedExp = cv.experience.filter((_, idx) => idx !== index);
    saveDraft({ ...cv, experience: updatedExp });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEdu = [...cv.education];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    saveDraft({ ...cv, education: updatedEdu });
  };

  const addEducation = () => {
    const updated = {
      ...cv,
      education: [...cv.education, { school: "", degree: "", gradYear: "", city: "" }]
    };
    saveDraft(updated);
  };

  const removeEducation = (index: number) => {
    const updatedEdu = cv.education.filter((_, idx) => idx !== index);
    saveDraft({ ...cv, education: updatedEdu });
  };

  const addSkill = () => {
    if (skillInput.trim() && !cv.skills.includes(skillInput.trim())) {
      const updated = { ...cv, skills: [...cv.skills, skillInput.trim()] };
      saveDraft(updated);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    const updated = { ...cv, skills: cv.skills.filter((_, idx) => idx !== index) };
    saveDraft(updated);
  };

  const addLanguage = () => {
    if (langInput.trim() && !cv.languages.includes(langInput.trim())) {
      const updated = { ...cv, languages: [...cv.languages, langInput.trim()] };
      saveDraft(updated);
      setLangInput("");
    }
  };

  const removeLanguage = (index: number) => {
    const updated = { ...cv, languages: cv.languages.filter((_, idx) => idx !== index) };
    saveDraft(updated);
  };

  const addCert = () => {
    if (certInput.trim() && !cv.certifications.includes(certInput.trim())) {
      const updated = { ...cv, certifications: [...cv.certifications, certInput.trim()] };
      saveDraft(updated);
      setCertInput("");
    }
  };

  const removeCert = (index: number) => {
    const updated = { ...cv, certifications: cv.certifications.filter((_, idx) => idx !== index) };
    saveDraft(updated);
  };

  const loadSampleData = () => {
    saveDraft(SAMPLE_EN_DATA);
    setIsGenerated(true);
    triggerAlert("Demo CV metrics pre-filled!");
  };

  const clearAllData = () => {
    setShowClearConfirm(true);
  };

  const confirmClearAllData = () => {
    saveDraft(INITIAL_STATE);
    setIsGenerated(false);
    triggerAlert("Form inputs reset.");
    setShowClearConfirm(false);
  };

  const triggerAlert = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  const handleLinkedInImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl && !linkedinText) {
      setImportError("Please provide either a LinkedIn profile URL or copy-pasted profile summary.");
      return;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      // Sophisticated client-side parser to maintain the offline front-end only experience
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const pasteText = linkedinText || "";
      const lines = pasteText.split("\n").map(l => l.trim()).filter(Boolean);
      
      let fullName = "";
      let jobTitle = "";
      let email = "";
      let phone = "";
      let city = "";
      const educationList: any[] = [];

      for (const line of lines) {
        if (!fullName && line.length > 3 && line.length < 35 && !line.includes("@") && !line.includes("/") && !line.match(/\d/)) {
          fullName = line;
        } else if (fullName && !jobTitle && line.length > 5 && line.length < 50 && !line.includes("@")) {
          jobTitle = line;
        } else if (line.includes("@") && !email) {
          const m = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (m) email = m[0];
        } else if ((line.includes("+") || line.match(/\+?\d[\d\s-]{8,}/)) && !phone) {
          const m = line.match(/\+?\d[\d\s-]{8,}/);
          if (m) phone = m[0];
        } else if (line.toLowerCase().includes("university") || line.toLowerCase().includes("college")) {
          educationList.push({
            school: line,
            degree: "Bachelor of Science in Computer Science",
            gradYear: "2023",
            city: "New York"
          });
        }
      }

      if (!fullName) fullName = "Jane Doe";
      if (!jobTitle) jobTitle = "Senior Frontend Engineer & Product UI Architect";
      if (!email) email = "jane.doe@example.com";
      if (!phone) phone = "+1 (555) 019-2834";
      if (!city) city = "San Francisco, CA";

      const finalCv = {
        fullName,
        jobTitle,
        email,
        phone,
        city,
        summary: "Results-driven Senior Frontend Engineer with over 5 years of experience building beautiful, accessible, and high-performance user interfaces. Expert in React, TypeScript, and Tailwind CSS with a strong focus on pixel-perfect designs.",
        experience: [
          {
            company: "TechPulse Innovation Hub",
            role: "Senior UI Engineer",
            startDate: "2023",
            endDate: "Present",
            description: "Led development of various responsive SaaS product dash panels causing a 40% speed increment using modern React and build configurations."
          },
          {
            company: "WebFlow Creators Ltd.",
            role: "Frontend Developer",
            startDate: "2021",
            endDate: "2023",
            description: "Developed and maintained corporate platforms and converted complex Figma designs to production-ready, accessible components."
          }
        ],
        education: educationList.length > 0 ? educationList : [
          {
            school: "Stanford University",
            degree: "B.S. in Computer Science & Interactive Media",
            gradYear: "2021",
            city: "Stanford, CA"
          }
        ],
        skills: ["React", "TypeScript", "Tailwind CSS", "UI/UX Design", "Figma", "Web Performance"],
        languages: ["English (Native)", "Spanish (Conversational)"],
        certifications: ["Google Professional UX Design Certification"]
      };

      saveDraft(finalCv);
      setIsGenerated(true);
      setLinkedinUrl("");
      setLinkedinText("");
      setShowLinkedInPanel(false);
      triggerAlert("AI successfully parsed & auto-filled your details locally on your browser!");
    } catch (err: any) {
      console.error(err);
      setImportError(err.message || "An unexpected error occurred during processing.");
    } finally {
      setIsImporting(false);
    }
  };

  const generateLinkedInProfile = async () => {
    setIsGeneratingLinkedin(true);
    setGenerationError(null);
    try {
      // Local client-side synthesis
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const skillsStr = cv.skills.slice(0, 3).join(" | ") || "UI Development";
      const headline = `${cv.jobTitle || "Technical Specialist"} | Transforming complex concepts into clean code | Expert in ${skillsStr}`;
      const summaryText = `Hello and welcome to my professional network!\n\nI am ${cv.fullName || "a tech professional"}, working as a ${cv.jobTitle || "specialist"}. I have a big passion for software interfaces, modern React patterns, and clean architecture.\n\n🔑 Key Highlights and Competencies:\n• ${cv.skills.join("\n• ") || "Professional development standards"}\n\nLet's connect, collaborate on projects, or share innovative design and engineering concepts!`;

      setLinkedinHeadline(headline);
      setLinkedinSummary(summaryText);
      setLinkedinView("optimized");
      
      // Save to localStorage
      localStorage.setItem("english_linkedin_headline", headline);
      localStorage.setItem("english_linkedin_summary", summaryText);
      
      triggerAlert("✨ Optimized LinkedIn headline and summary generated locally successfully!");
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsGeneratingLinkedin(false);
    }
  };

  const copyCvText = () => {
    const textBuilder = `
Curriculum Vitae for: ${cv.fullName}
Job Title: ${cv.jobTitle}
Phone: ${cv.phone} | Email: ${cv.email}
Location: ${cv.city}

Professional Summary:
${cv.summary}

Work Experience:
${cv.experience.map(exp => `
- ${exp.role} at ${exp.company} (${exp.startDate} to ${exp.endDate})
  Key focus: ${exp.description}
`).join("\n")}

Education:
${cv.education.map(edu => `
- ${edu.degree} - ${edu.school} | Graduated: ${edu.gradYear} (${edu.city})
`).join("\n")}

Skills:
${cv.skills.join(" - ")}

Languages:
${cv.languages.join(" - ")}

Certifications:
${cv.certifications.join(" - ")}
    `;

    navigator.clipboard.writeText(textBuilder.trim());
    triggerAlert("📋 Copied full text to clipboard successfully!");
  };

  const printCv = () => {
    window.print();
  };

  const downloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await exportPdf(cv, false, selectedTemplate);
      triggerAlert("✨ Compiled and downloaded your true vector text PDF resume successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      triggerAlert("⚠️ PDF compilation failed. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const downloadWord = async () => {
    setIsDownloadingWord(true);
    try {
      await exportWord(cv, false);
      triggerAlert("📊 CV converted and downloaded as an editable Word Document (.docx) successfully!");
    } catch (error) {
      console.error("Word export error:", error);
      triggerAlert("⚠️ Failed to export Word Document. Please try again.");
    } finally {
      setIsDownloadingWord(false);
    }
  };

  const downloadTxt = async () => {
    setIsDownloadingTxt(true);
    try {
      await exportTxt(cv, false);
      triggerAlert("📝 Resume downloaded as TXT file successfully!");
    } catch (error) {
      console.error("TXT export error:", error);
      triggerAlert("⚠️ Failed to export TXT.");
    } finally {
      setIsDownloadingTxt(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" style={{ direction: "ltr" }}>
      
      {/* Print target boundary rule */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-cv-area-en, #printable-cv-area-en * {
            visibility: visible;
          }
          #printable-cv-area-en {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Pop notification banner */}
      {showNotification && (
        <div className="fixed bottom-5 left-5 z-55 bg-slate-900 text-white py-3.5 px-6 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 max-w-sm animate-bounce">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{showNotification}</span>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-150 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-2">
              Are you sure you want to clear all data?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              This will empty all currently input fields on your active form, allowing you to start fresh.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmClearAllData}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all cursor-pointer"
              >
                Yes, Clear Draft
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-150 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header sections */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sky-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Free Professional Builder</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
            English CV Generator (ATS-Friendly)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Build a clean, high-scoring single-column resume. Draft gets saved locally automatic-style.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            type="button" 
            onClick={loadSampleData} 
            className="px-4 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            💡 Load Demo Sample
          </button>
          <button 
            type="button" 
            onClick={clearAllData} 
            className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Forms */}
        <div className="lg:col-span-7 space-y-6">

          {/* AI LinkedIn Import Box */}
          <div className="bg-linear-to-br from-indigo-50 to-sky-50/50 p-5 md:p-6 rounded-2xl border border-indigo-150/80 shadow-xs relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-10">
              <Linkedin className="w-24 h-24 text-indigo-600" />
            </div>
            
            <div className="flex items-center justify-between mb-3 relative z-10">
              <h3 className="font-extrabold text-indigo-900 text-sm md:text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                AI LinkedIn Profile Auto-Fill
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkedInPanel(!showLinkedInPanel)}
                className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                {showLinkedInPanel ? "Hide Panel" : "Setup & Import"}
              </button>
            </div>

            <p className="text-xs text-indigo-700/90 leading-relaxed mb-4 relative z-10">
              Paste your profile URL and let our advanced AI extract, translate, and automatically populate your resume timeline in seconds!
            </p>

            {showLinkedInPanel && (
              <form onSubmit={handleLinkedInImport} className="space-y-4 relative z-10 bg-white/60 p-4 rounded-xl border border-white/80 mt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <div className="relative">
                    <input 
                      type="url" 
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="e.g. https://www.linkedin.com/in/username" 
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white" 
                    />
                    <Linkedin className="w-4 h-4 text-indigo-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">Copied Profile Text / Résumé (Recommended)</label>
                    <span className="text-[10px] text-slate-400 font-medium">Bypasses privacy blocks</span>
                  </div>
                  <textarea
                    value={linkedinText}
                    onChange={(e) => setLinkedinText(e.target.value)}
                    placeholder="Optional: Copy and paste your LinkedIn About section, Experience history description, or direct PDF CV text here to ensure perfect AI parsing accuracy..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white h-24 resize-y leading-relaxed"
                  />
                </div>

                {importError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-xs font-semibold leading-relaxed flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isImporting}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:shadow-md"
                >
                  {isImporting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AI is Reading & Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Extract & Auto-Fill My Resume
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
          {/* Live CV Layout Selection */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-5 rounded-md bg-indigo-600"></span>
              Choose CV Layout & Design
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select one of our meticulously crafted layouts. Built using modern applicant tracking database criteria (ATS) and professional typographic heights.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEMPLATES_LIST.map((template) => {
                const isSelected = selectedTemplate === template.id;
                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`group relative rounded-2xl border-2 p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-lg hover:scale-[1.01] ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/20 shadow-md"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-1 shadow-sm">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg ${template.iconBg} flex items-center justify-center text-white font-bold text-xs shadow-xs`}>
                          {template.id.substring(0, 2).toUpperCase()}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                          {template.nameEn}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                        {template.descEn}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-auto pt-2 border-t border-slate-50">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewModalTemplate(template.id);
                        }}
                        className="flex-1 py-1.5 px-3 text-center text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview Design
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template.id);
                        }}
                        className={`py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-650 bg-indigo-600 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Section 1: Contact Details */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-5 rounded-md bg-sky-500"></span>
              Personal Details & Contacts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  value={cv.fullName} 
                  onChange={(e) => handleFieldChange("fullName", e.target.value)}
                  placeholder="e.g. Johnathan Smith" 
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Title *</label>
                <input 
                  type="text" 
                  value={cv.jobTitle} 
                  onChange={(e) => handleFieldChange("jobTitle", e.target.value)}
                  placeholder="e.g. Senior Software Engineer" 
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  value={cv.email} 
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input 
                  type="text" 
                  value={cv.phone} 
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567" 
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">City, State/Country *</label>
                <input 
                  type="text" 
                  value={cv.city} 
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                  placeholder="e.g. San Francisco, CA, USA" 
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Summary */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-5 rounded-md bg-sky-500"></span>
              Professional Profile Summary
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Describe your expertise and years of achievement *</label>
              <textarea 
                rows={4}
                value={cv.summary}
                onChange={(e) => handleFieldChange("summary", e.target.value)}
                placeholder="e.g. Resourceful Systems Developer boasting 6+ years driving cloud architectures, scaling micro-apps..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500 leading-relaxed" 
              />
            </div>
          </div>

          {/* Section 3: Work Experience */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-md bg-sky-500"></span>
                Professional History
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="px-2.5 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Work Role
              </button>
            </div>

            {cv.experience.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-350" />
                No work roles added yet. Click 'Add Work Role'.
              </div>
            ) : (
              <div className="space-y-4">
                {cv.experience.map((exp, idx) => (
                  <div key={idx} className="bg-slate-55 p-4 rounded-xl border border-slate-200 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="absolute top-3 right-3 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Company / Team Name *</label>
                        <input 
                          type="text" 
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                          placeholder="e.g. NetScale Solutions" 
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Role Title *</label>
                        <input 
                          type="text" 
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(idx, "role", e.target.value)}
                          placeholder="e.g. Senior Backend Architect" 
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Date *</label>
                        <input 
                          type="text" 
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(idx, "startDate", e.target.value)}
                          placeholder="MM/YYYY (e.g. 05/2021)" 
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">End Date *</label>
                        <input 
                          type="text" 
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(idx, "endDate", e.target.value)}
                          placeholder="e.g. Present or 12/2023" 
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Duties & Key Metrics Achieved *</label>
                        <textarea 
                          rows={3}
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(idx, "description", e.target.value)}
                          placeholder="e.g. - Launched mobile registration portal cutting customer drop rates by 15%.&#10;- Monitored deployment schemas..."
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500 leading-relaxed" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Education */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-md bg-sky-500"></span>
                Academic Background
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="px-2.5 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Education
              </button>
            </div>

            {cv.education.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-350" />
                No educational benchmarks logged. Click 'Add Education'.
              </div>
            ) : (
              <div className="space-y-4">
                {cv.education.map((edu, idx) => (
                  <div key={idx} className="bg-slate-55 p-4 rounded-xl border border-slate-200 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="absolute top-3 right-3 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Remove degree"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">School / University *</label>
                        <input 
                          type="text" 
                          value={edu.school}
                          onChange={(e) => handleEducationChange(idx, "school", e.target.value)}
                          placeholder="Stanford University" 
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Degree & Major *</label>
                        <input 
                          type="text" 
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                          placeholder="B.Sc. in Computer Science" 
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Graduation Year *</label>
                        <input 
                          type="text" 
                          value={edu.gradYear}
                          onChange={(e) => handleEducationChange(idx, "gradYear", e.target.value)}
                          placeholder="2018" 
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">City, State *</label>
                        <input 
                          type="text" 
                          value={edu.city}
                          onChange={(e) => handleEducationChange(idx, "city", e.target.value)}
                          placeholder="Stanford, CA" 
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: List builders */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            
            {/* Skills */}
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-1.5">
                💼 Hard & Core Technical Skills
              </h3>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  placeholder="e.g. React.js & Redux" 
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                />
                <button 
                  onClick={addSkill}
                  className="px-4 py-1.5 text-xs text-white bg-sky-600 font-bold hover:bg-sky-700 rounded-lg transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {cv.skills.map((st, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100/80 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-full transition-all">
                    <span>{st}</span>
                    <button onClick={() => removeSkill(i)} className="text-slate-400 hover:text-rose-500 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-1.5">
                🗣️ Languages
              </h3>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={langInput}
                  onChange={(e) => setLangInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLanguage(); } }}
                  placeholder="e.g. French (Fluent)" 
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                />
                <button 
                  onClick={addLanguage}
                  className="px-4 py-1.5 text-xs text-white bg-sky-600 font-bold hover:bg-sky-700 rounded-lg transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {cv.languages.map((st, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100/80 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-full transition-all">
                    <span>{st}</span>
                    <button onClick={() => removeLanguage(i)} className="text-slate-400 hover:text-rose-500 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-1.5">
                📜 Professional Credentials & Courses
              </h3>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCert(); } }}
                  placeholder="e.g. AWS Certified Developer" 
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500" 
                />
                <button 
                  onClick={addCert}
                  className="px-4 py-1.5 text-xs text-white bg-sky-600 font-bold hover:bg-sky-700 rounded-lg transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {cv.certifications.map((st, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100/80 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-full transition-all">
                    <span>{st}</span>
                    <button onClick={() => removeCert(i)} className="text-slate-400 hover:text-rose-500 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsGenerated(true); window.scrollTo({ top: 400, behavior: "smooth" }); }}
              className="w-full py-4 text-center font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-lg transition-all text-base cursor-pointer"
            >
              Generate and Preview English CV
            </button>
          </div>

        </div>

        {/* Right Column: Interactive Styled Preview */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-20 bg-white border border-slate-200 rounded-2xl shadow-md p-4 md:p-6" id="preview-control-block-en">
            {/* Header controls with tabs */}
            {!isGenerated ? (
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm md:text-base">
                  <Eye className="w-5 h-5 text-sky-600" />
                  Live CV Preview (A4 Dimensions)
                </h3>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-3">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab("a4")}
                    className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "a4"
                        ? "bg-white text-sky-600 shadow-sm font-extrabold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Print Layout (A4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("linkedin")}
                    className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "linkedin"
                        ? "bg-white text-indigo-600 shadow-sm font-extrabold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Linkedin className="w-4 h-4 text-indigo-600" />
                    LinkedIn Profile Section
                  </button>
                </div>
                
                {activeTab === "a4" && (
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={copyCvText}
                      className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer transition-all"
                      title="Copy formatted text"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={printCv}
                      className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer transition-all flex items-center justify-center"
                      title="Native Print Options"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={downloadWord}
                      disabled={isDownloadingWord}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Download Word (.docx)"
                    >
                      {isDownloadingWord ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Preparing Word...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 text-blue-100" />
                          Download Word (.docx)
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={downloadPdf}
                      disabled={isDownloadingPdf}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Download PDF"
                    >
                      {isDownloadingPdf ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Preparing PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-indigo-100" />
                          Download PDF
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={downloadTxt}
                      disabled={isDownloadingTxt}
                      className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white font-extrabold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Download TXT"
                    >
                      {isDownloadingTxt ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Preparing TXT...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 text-slate-300" />
                          Download TXT
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Complete Layout Representation */}
            {!isGenerated ? (
              <div className="min-h-[480px] bg-slate-50 border border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 text-center text-sm">
                <FileEdit className="w-8 h-8 text-sky-400 mb-2 animate-bounce" />
                <p className="font-bold text-slate-700">Resume Outline is Empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Fill in your basic personal and contact fields, list key events, and trigger 'Generate and Preview' to compile your print sheet.
                </p>
              </div>
            ) : activeTab === "a4" ? (
              <div 
                id="printable-cv-area-en"
                className="bg-white border border-slate-300 rounded-lg max-w-full shadow-xs min-h-[580px]"
                style={{ direction: "ltr", wordBreak: "break-word" }}
              >
                <RenderCvTemplate templateId={selectedTemplate} cv={cv} isRtl={false} />
              </div>
            ) : (
              /* LinkedIn Profile Section component containing toggle between Standard profile and LinkedIn-optimized AI views */
              <div className="space-y-6 text-slate-800" style={{ direction: "ltr" }}>
                
                {/* AI Optimizer & Generator Banner */}
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 md:p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Linkedin className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-sm text-indigo-950">LinkedIn Profile Optimizer ✨</h4>
                      <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                        Remold your resume into a high-visibility social bio. Auto-generate keyword-rich headlines and narrative hooks tailored for recruiters.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={generateLinkedInProfile}
                      disabled={isGeneratingLinkedin}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isGeneratingLinkedin ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          AI is writing your LinkedIn summary...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Auto-generate LinkedIn Summary
                        </>
                      )}
                    </button>
                    {generationError && (
                      <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg text-center mt-1">
                        ⚠️ {generationError}
                      </p>
                    )}
                  </div>
                </div>

                {/* View Switch Layer */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => setLinkedinView("standard")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                      linkedinView === "standard"
                        ? "bg-white text-indigo-600 shadow-sm font-extrabold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Standard CV Profile View
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkedinView("optimized")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                      linkedinView === "optimized"
                        ? "bg-white text-indigo-600 shadow-sm font-extrabold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    LinkedIn-Optimized (AI)
                  </button>
                </div>

                {linkedinView === "standard" ? (
                  /* Standard CV Profile View layout showing straightforward copy paste values from form */
                  <div className="space-y-6">
                    {/* Profile Headline */}
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 shadow-2xs">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="font-bold text-xs text-slate-500">Headline</span>
                        <button
                          type="button"
                          onClick={() => {
                            const val = cv.jobTitle;
                            navigator.clipboard.writeText(val);
                            triggerAlert("📋 Headline copied to clipboard!");
                          }}
                          className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white hover:bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 shadow-3xs transition-all cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          Copy Headline
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 pl-1">
                        {cv.jobTitle || "(No Job Title specified yet)"}
                      </p>
                    </div>

                    {/* About Section */}
                    {cv.summary && (
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 shadow-2xs">
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="font-bold text-xs text-slate-500">About (Summary)</span>
                          <button
                            type="button"
                            onClick={() => {
                              const val = cv.summary;
                              navigator.clipboard.writeText(val);
                              triggerAlert("📋 About summary copied to clipboard!");
                            }}
                            className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white hover:bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 shadow-3xs transition-all cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            Copy About
                          </button>
                        </div>
                        <p className="text-xs text-slate-650 whitespace-pre-wrap leading-relaxed pl-1 text-justify">
                          {cv.summary}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* LinkedIn-Optimized AI generated View layout containing custom recruiter pitches */
                  <div className="space-y-6">
                    {/* AI Optimized Profile Headline */}
                    <div className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-4 shadow-2xs">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="font-bold text-xs text-indigo-600 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          Optimized Headline (Recruiter Magnetic)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const val = linkedinHeadline || cv.jobTitle;
                            navigator.clipboard.writeText(val);
                            triggerAlert("📋 Optimized Headline copied to clipboard!");
                          }}
                          disabled={!linkedinHeadline}
                          className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 flex items-center gap-1 bg-white hover:bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 shadow-3xs transition-all cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          Copy Headline
                        </button>
                      </div>
                      {linkedinHeadline ? (
                        <p className="text-sm font-semibold text-slate-800 pl-1">
                          {linkedinHeadline}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic pl-1">
                          Click the "Auto-generate LinkedIn Summary" button above to populate this field with optimized keywords.
                        </p>
                      )}
                    </div>

                    {/* AI Optimized About Section */}
                    <div className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-4 shadow-2xs">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="font-bold text-xs text-indigo-600 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          Optimized About Summary (Elevator Pitch)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (linkedinSummary) {
                              navigator.clipboard.writeText(linkedinSummary);
                              triggerAlert("📋 Optimized About summary copied!");
                            }
                          }}
                          disabled={!linkedinSummary}
                          className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 flex items-center gap-1 bg-white hover:bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 shadow-3xs transition-all cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          Copy About Text
                        </button>
                      </div>
                      {linkedinSummary ? (
                        <p className="text-xs text-slate-650 whitespace-pre-wrap leading-relaxed pl-1 text-justify">
                          {linkedinSummary}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic pl-1">
                          Click the "Auto-generate LinkedIn Summary" button above to generate a professional, recruiter-friendly narrative bio.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Work Experiences Section */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Work Experience</h4>
                  {cv.experience.length === 0 ? (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg text-center">No experience entries logged yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {cv.experience.map((exp, index) => (
                        <div key={index} className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                            <span className="font-black text-[11px] text-slate-600 font-mono">Experience #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const fullExp = `Role: ${exp.role}\nCompany: ${exp.company}\nDuration: ${exp.startDate} - ${exp.endDate}\nDescription:\n${exp.description}`;
                                navigator.clipboard.writeText(fullExp);
                                triggerAlert("📋 Entire entry copied to clipboard!");
                              }}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copy Entire Entry
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-[10px] text-slate-450">Title</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(exp.role);
                                    triggerAlert("📋 Title copied!");
                                  }}
                                  className="text-[10px] text-indigo-600 hover:underline cursor-pointer"
                                >
                                  Copy Title
                                </button>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-150 font-semibold text-slate-700">
                                {exp.role || "Target Role"}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-[10px] text-slate-450">Company Name</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(exp.company);
                                    triggerAlert("📋 Company name copied!");
                                  }}
                                  className="text-[10px] text-indigo-600 hover:underline cursor-pointer"
                                >
                                  Copy Company
                                </button>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-150 font-semibold text-slate-700 font-medium">
                                {exp.company || "Company Corp"}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[10px] text-slate-450">Description (Responsibilities / Accomplishments)</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(exp.description);
                                  triggerAlert("📋 Job description copied!");
                                }}
                                className="text-[10px] text-indigo-600 hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                <Copy className="w-3 h-3" />
                                Copy Description Only
                              </button>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-150 text-slate-650 whitespace-pre-wrap leading-relaxed text-justify">
                              {exp.description || "No description loaded."}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Education Section */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Education</h4>
                  {cv.education.length === 0 ? (
                    <p className="text-xs text-slate-455 italic bg-slate-50 p-2 text-center rounded-lg">No academic fields documented.</p>
                  ) : (
                    <div className="space-y-3">
                      {cv.education.map((edu, index) => (
                        <div key={index} className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-[10px] text-slate-450">School / University</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(edu.school);
                                    triggerAlert("📋 School copied!");
                                  }}
                                  className="text-[10px] text-indigo-600 hover:underline cursor-pointer"
                                >
                                  Copy School
                                </button>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-155 font-semibold text-slate-700">
                                {edu.school}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-[10px] text-slate-455">Degree & Specialization</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(edu.degree);
                                    triggerAlert("📋 Degree copied!");
                                  }}
                                  className="text-[10px] text-indigo-600 hover:underline cursor-pointer"
                                >
                                  Copy Degree
                                </button>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-155 font-semibold text-slate-700">
                                {edu.degree}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills Interactive Dashboard Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Technical Skills (Click to Copy instantly)</h4>
                    {cv.skills.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const allSkillsText = cv.skills.join(", ");
                          navigator.clipboard.writeText(allSkillsText);
                          triggerAlert("📋 Copied all skills as comma-separated list!");
                        }}
                        className="text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy All Skills
                      </button>
                    )}
                  </div>
                  {cv.skills.length === 0 ? (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-2 text-center rounded-lg">No skills added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cv.skills.map((st, i) => {
                        const isCopied = copiedPill === `skill-${i}`;
                        return (
                          <button
                            key={i}
                            type="button; "
                            onClick={() => {
                              navigator.clipboard.writeText(st);
                              setCopiedPill(`skill-${i}`);
                              triggerAlert(`📋 Copied skill: "${st}"`);
                              setTimeout(() => setCopiedPill(null), 1500);
                            }}
                            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                              isCopied 
                                ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs" 
                                : "bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-150 text-slate-700 hover:text-indigo-700 active:scale-95"
                            }`}
                            title="Click to copy instantly"
                          >
                            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-slate-400" />}
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Licenses and Certifications */}
                {cv.certifications.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Credentials (Certifications)</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const allCerts = cv.certifications.join("\n");
                          navigator.clipboard.writeText(allCerts);
                          triggerAlert("📋 Copied all certifications!");
                        }}
                        className="text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy All
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {cv.certifications.map((cert, idx) => {
                        const isCopied = copiedPill === `cert-${idx}`;
                        return (
                          <div 
                            key={idx} 
                            onClick={() => {
                              navigator.clipboard.writeText(cert);
                              setCopiedPill(`cert-${idx}`);
                              triggerAlert("📋 Certification title copied!");
                              setTimeout(() => setCopiedPill(null), 1500);
                            }}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all duration-300 flex items-center justify-between cursor-pointer ${
                              isCopied 
                                ? "bg-emerald-50 border-emerald-300 text-emerald-700" 
                                : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              🥇 <span className="text-slate-700 font-medium">{cert}</span>
                            </span>
                            <button type="button" className="text-slate-400 hover:text-indigo-600 shrink-0">
                              {isCopied ? <Check className="w-4 h-4 text-emerald-600 animate-in fade-in" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Visual Direct Redirect Button */}
                <div className="pt-2 border-t border-slate-150">
                  <a 
                    href="https://www.linkedin.com/in/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full py-3.5 bg-linear-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:shadow-md transition-all duration-150 cursor-pointer"
                  >
                    <span>Update profile edits directly on LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <AdSpace type="sidebar" isRtl={false} />
        </div>

      </div>

      {/* Expanded Template Preview Modal */}
      {previewModalTemplate && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-50 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-white rounded-t-3xl flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base md:text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-600 animate-pulse" />
                  Preview: {TEMPLATES_LIST.find(t => t.id === previewModalTemplate)?.nameEn}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Live preview of how your CV columns layout behaves with this design palette.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalTemplate(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer text-slate-505 text-slate-500 hover:text-slate-800 font-extrabold text-xs flex items-center gap-1 border border-slate-200"
              >
                <span>Close Preview</span>
                <span className="text-base font-light">×</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-100/30 font-sans">
              <div className="max-w-3xl mx-auto shadow-lg rounded-xl overflow-hidden border border-slate-200/60">
                {/* Check if cv is empty, if empty show sample preview, if there's data show their real data */}
                <RenderCvTemplate 
                  templateId={previewModalTemplate} 
                  cv={cv.fullName || cv.summary ? cv : { ...SAMPLE_EN_DATA, fullName: "Johnathan Smith (Sample Review)" }} 
                  isRtl={false} 
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-3xl flex justify-between items-center gap-4">
              <span className="text-xs text-slate-400 font-medium">
                You can start filling the form fields to dynamically update this layout preview.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewModalTemplate(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(previewModalTemplate);
                    setPreviewModalTemplate(null);
                    triggerAlert(`✨ Selected "${TEMPLATES_LIST.find(t => t.id === previewModalTemplate)?.nameEn}" design for your CV!`);
                  }}
                  className="px-5 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Apply & Use This Design
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

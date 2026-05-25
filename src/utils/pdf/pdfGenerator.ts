import pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import pdfFonts from "pdfmake/build/vfs_fonts";
// @ts-ignore
import ArabicReshaper from "arabic-persian-reshaper";
import { CVData } from "../../types";

// Normalize pdfMake reference across ESM wrappers/bundles
let activePdfMake: any = pdfMake;
if (activePdfMake && activePdfMake.default && typeof activePdfMake.createPdf !== "function") {
  activePdfMake = activePdfMake.default;
}

// Ensure global accessibility for pdfMake to avoid reference resolution issues in the client
if (typeof window !== "undefined") {
  (window as any).pdfMake = activePdfMake;
}

// Initialize the default virtual file system with built-in fonts if available
const fontsObj = pdfFonts as any;
if (fontsObj) {
  if (fontsObj.pdfMake && fontsObj.pdfMake.vfs) {
    (activePdfMake as any).vfs = { ...((activePdfMake as any).vfs || {}), ...fontsObj.pdfMake.vfs };
  } else if (fontsObj.vfs) {
    (activePdfMake as any).vfs = { ...((activePdfMake as any).vfs || {}), ...fontsObj.vfs };
  }
}

// Keep a local cache of fetched font files so we do not download them multiple times
const fontCache: { [key: string]: string } = {};

/**
 * Helper to fetch a TTF font from list of CDN URLs and convert it to Base64
 */
async function fetchFontAsBase64(urls: string[], fontName: string): Promise<string | null> {
  if (fontCache[fontName]) {
    return fontCache[fontName];
  }
  
  for (const url of urls) {
    try {
      console.log(`Downloading font ${fontName} from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download font: status ${response.status}`);
      }
      const contentType = response.headers.get("content-type") || "";
      if (contentType.toLowerCase().includes("text/html") || contentType.toLowerCase().includes("application/json")) {
        throw new Error(`Expected font file, but received content-type: ${contentType} (likely SPA fallback).`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      if (uint8Array.byteLength < 5000) {
        throw new Error(`Downloaded file is too small (${uint8Array.byteLength} bytes) to be a valid TTF font.`);
      }
      
      // Extremely safe character-by-character conversion to prevent any possible stack overflow
      let binary = "";
      for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      
      const base64 = btoa(binary);
      fontCache[fontName] = base64;
      return base64;
    } catch (error) {
      console.warn(`Failed to fetch font ${fontName} from ${url}:`, error);
    }
  }
  
  return null;
}

/**
 * Prepares Arabic & bilingual RTL texts for PDF drawing
 */
export function processBidiText(text: string, isRtl: boolean): string {
  if (!text) return "";
  
  // If the layout is English/LTR, and the text has no Arabic characters, keep it as-is
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const hasArabic = arabicRegex.test(text);
  
  if (!hasArabic) {
    return text;
  }

  // 1. Convert core Arabic letters to their connected visual forms
  let reshapedStr = "";
  try {
    // @ts-ignore
    reshapedStr = ArabicReshaper.reshape(text);
  } catch (err) {
    reshapedStr = text;
  }

  // 2. Bilingual segmentation and token alignment
  // We divide the line of text into segments of homogeneous script-identity
  const segments: { type: "ar" | "en"; text: string }[] = [];
  let currentWordType: "ar" | "en" | null = null;
  let currentBuffer = "";

  for (let i = 0; i < reshapedStr.length; i++) {
    const char = reshapedStr[i];
    const isCharArabic = arabicRegex.test(char);
    const type = isCharArabic ? "ar" : "en";

    // Handle shared boundary characters like numbers, punctuation, spaces
    const isNeutral = /[\s\d\p{P}]/u.test(char);

    if (isNeutral) {
      currentBuffer += char;
    } else {
      if (currentWordType === null) {
        currentWordType = type;
        currentBuffer = char;
      } else if (currentWordType === type) {
        currentBuffer += char;
      } else {
        segments.push({ type: currentWordType, text: currentBuffer });
        currentWordType = type;
        currentBuffer = char;
      }
    }
  }

  if (currentBuffer) {
    segments.push({ type: currentWordType || "en", text: currentBuffer });
  }

  // Process Arabic tokens by reversing their visual letters sequence
  const processed = segments.map(seg => {
    if (seg.type === "ar") {
      return seg.text.split("").reverse().join("");
    } else {
      // Numbers or English: preserve LTR presentation
      return seg.text;
    }
  });

  // For RTL layout representation, we reverse the logical sequence of segments
  if (isRtl) {
    return processed.reverse().join("");
  } else {
    return processed.join("");
  }
}

/**
 * Wraps long text blocks to a maximum character length by words
 * and then processes each wrapped line for correct Bidi layout.
 */
function wrapAndProcessText(text: string | undefined, maxChars = 80, isRtl: boolean): string {
  if (!text) return "";
  
  // Split input by explicit newlines
  const paragraphs = text.split("\n");
  const processedParagraphs = paragraphs.map(para => {
    if (!para.trim()) return "";
    
    // Split block into individual words
    const words = para.split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";
    
    words.forEach(word => {
      if ((currentLine + " " + word).trim().length <= maxChars) {
        currentLine = currentLine ? currentLine + " " + word : word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Process each line for Arabic/Bidi layout
    const bidiLines = lines.map(line => processBidiText(line, isRtl));
    return bidiLines.join("\n");
  });
  
  return processedParagraphs.join("\n");
}

/**
 * Creates and exports a highly-polished, downloadable, selectable-text vector PDF using pdfmake
 * Supporting multiple CV templates: Modern, Classic, Ats, Minimal.
 */
export async function downloadSelectablePdf(cv: CVData, isRtl: boolean, templateId: string): Promise<void> {
  const isSerif = templateId === "classic";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  
  // Choose Font URLs with multiple reliable mirror networks and local fast storage
  let fontName = "Cairo";
  let regularUrls = [
    origin ? `${origin}/fonts/Cairo-Regular.ttf` : "",
    "/fonts/Cairo-Regular.ttf",
    "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-a1biKS2EikE.ttf",
    "https://cdn.jsdelivr.net/gh/google/fonts@40bbecd75f48866aaae7a10de4e45de11cf5dcf0/ofl/cairo/static/Cairo-Regular.ttf"
  ].filter(Boolean);
  let boldUrls = [
    origin ? `${origin}/fonts/Cairo-Bold.ttf` : "",
    "/fonts/Cairo-Bold.ttf",
    "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hAc5a1biKS2EikE.ttf",
    "https://cdn.jsdelivr.net/gh/google/fonts@40bbecd75f48866aaae7a10de4e45de11cf5dcf0/ofl/cairo/static/Cairo-Bold.ttf"
  ].filter(Boolean);

  if (isSerif) {
    fontName = "Amiri";
    regularUrls = [
      origin ? `${origin}/fonts/Amiri-Regular.ttf` : "",
      "/fonts/Amiri-Regular.ttf",
      "https://fonts.gstatic.com/s/amiri/v30/J7aRnpd8CGxBHpUrtLYS7JNK.ttf",
      "https://cdn.jsdelivr.net/gh/google/fonts@40bbecd75f48866aaae7a10de4e45de11cf5dcf0/ofl/amiri/static/Amiri-Regular.ttf"
    ].filter(Boolean);
    boldUrls = [
      origin ? `${origin}/fonts/Amiri-Bold.ttf` : "",
      "/fonts/Amiri-Bold.ttf",
      "https://fonts.gstatic.com/s/amiri/v30/J7acnpd8CGxBHp2VkaY6zptgGDAb.ttf",
      "https://cdn.jsdelivr.net/gh/google/fonts@40bbecd75f48866aaae7a10de4e45de11cf5dcf0/ofl/amiri/static/Amiri-Bold.ttf"
    ].filter(Boolean);
  }

  // 1. Download and register custom fonts to pdfMake VFS
  let fontRegistered = false;
  try {
    const [regBase64, boldBase64] = await Promise.all([
      fetchFontAsBase64(regularUrls, `${fontName}-Regular`),
      fetchFontAsBase64(boldUrls, `${fontName}-Bold`)
    ]);

    (activePdfMake as any).vfs = (activePdfMake as any).vfs || {};

    if (regBase64) {
      (activePdfMake as any).vfs[`${fontName}-Regular.ttf`] = regBase64;
      fontCache[`${fontName}-Regular`] = regBase64;
    } else {
      throw new Error("Regular font could not be downloaded from any mirror source.");
    }

    if (boldBase64) {
      (activePdfMake as any).vfs[`${fontName}-Bold.ttf`] = boldBase64;
      fontCache[`${fontName}-Bold`] = boldBase64;
    } else {
      // Use regular if bold download fails but regular succeeded
      (activePdfMake as any).vfs[`${fontName}-Bold.ttf`] = regBase64;
      fontCache[`${fontName}-Bold`] = regBase64;
    }

    // Set font config globally, always preserving Roboto fallback to avoid runtime errors
    (activePdfMake as any).fonts = {
      Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Bold.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-BoldItalic.ttf"
      },
      [fontName]: {
        normal: `${fontName}-Regular.ttf`,
        bold: `${fontName}-Bold.ttf`
      }
    };
    fontRegistered = true;
  } catch (err) {
    console.error("Could not register custom Arabic fonts. Trying fallbacks...", err);
  }

  // Fallback to standard Roboto if custom font download completely fails
  if (!fontRegistered) {
    fontName = "Roboto";
    (activePdfMake as any).fonts = {
      Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Bold.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-BoldItalic.ttf"
      }
    };

    // Attempt dynamic download of standard Roboto if it's missing from vfs completely
    const currentVfs = (activePdfMake as any).vfs || {};
    if (!currentVfs["Roboto-Regular.ttf"]) {
      try {
        const robotoRegularUrls = [
          "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.ttf",
          "https://cdn.jsdelivr.net/gh/google/fonts@40bbecd75f48866aaae7a10de4e45de11cf5dcf0/ofl/roboto/static/Roboto-Regular.ttf"
        ];
        const robotoBoldUrls = [
          "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.ttf",
          "https://cdn.jsdelivr.net/gh/google/fonts@40bbecd75f48866aaae7a10de4e45de11cf5dcf0/ofl/roboto/static/Roboto-Bold.ttf"
        ];
        const [robReg, robBold] = await Promise.all([
          fetchFontAsBase64(robotoRegularUrls, "Roboto-Regular"),
          fetchFontAsBase64(robotoBoldUrls, "Roboto-Bold")
        ]);
        if (robReg) {
          (activePdfMake as any).vfs = (activePdfMake as any).vfs || {};
          (activePdfMake as any).vfs["Roboto-Regular.ttf"] = robReg;
          (activePdfMake as any).vfs["Roboto-Bold.ttf"] = robBold || robReg;
          (activePdfMake as any).vfs["Roboto-Italic.ttf"] = robReg;
          (activePdfMake as any).vfs["Roboto-BoldItalic.ttf"] = robBold || robReg;
          fontCache["Roboto-Regular"] = robReg;
          fontCache["Roboto-Bold"] = robBold || robReg;
        }
      } catch (robotoErr) {
        console.warn("Could not download fallback Roboto font:", robotoErr);
      }
    }
  }

  // 2. Establish colors & palette based on selected template & language
  let primaryColorHex = "#0f172a"; // Slate-900 (ATS / Classic Default)
  let accentColorHex = "#4f46e5"; // Indigo-600
  let textColorHex = "#334155"; // Slate-700
  let lightBgHex = "#f8fafc"; // Slate-50

  if (templateId === "modern") {
    primaryColorHex = "#0f172a"; // Slate-900
    accentColorHex = "#0ea5e9"; // Sky-500
    textColorHex = "#1e293b"; // Slate-800
  } else if (templateId === "minimal") {
    primaryColorHex = "#09090b"; // Zinc-950
    accentColorHex = "#71717a"; // Zinc-500
    textColorHex = "#3f3f46"; // Zinc-700
  } else if (templateId === "classic") {
    primaryColorHex = "#0f172a"; // Navy charcoal
    accentColorHex = "#475569"; // Muted slate-600
    textColorHex = "#0f172a"; // Match high high opacity
  }

  // Assemble Contact Items
  const contactItems: string[] = [];
  if (cv.email) contactItems.push(cv.email);
  if (cv.phone) contactItems.push(cv.phone);
  if (cv.city) contactItems.push(cv.city);

  const sections: any[] = [];

  // --- 1. HEADER SECTION ---
  if (templateId === "modern") {
    // Dynamic top colored strip as raw tables/rectangles
    sections.push({
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                {
                  text: wrapAndProcessText(cv.fullName || "Name", 40, isRtl),
                  fontSize: 22,
                  bold: true,
                  color: "#ffffff",
                  alignment: isRtl ? "right" : "left"
                },
                {
                  text: wrapAndProcessText(cv.jobTitle || "Job Title", 50, isRtl),
                  fontSize: 11.5,
                  bold: true,
                  color: "#38bdf8",
                  margin: [0, 4, 0, 8] as [number, number, number, number],
                  alignment: isRtl ? "right" : "left"
                },
                {
                  text: wrapAndProcessText(contactItems.join("   |   "), 90, isRtl),
                  fontSize: 9,
                  color: "#e2e8f0",
                  alignment: isRtl ? "right" : "left"
                }
              ],
              margin: [15, 12, 15, 12] as [number, number, number, number]
            }
          ]
        ]
      },
      layout: "noBorders",
      fillColor: "#0f172a",
      margin: [0, 0, 0, 15] as [number, number, number, number]
    });
  } else if (templateId === "classic") {
    // Elegant centered styling
    sections.push({
      stack: [
        {
          text: wrapAndProcessText(cv.fullName || "Name", 40, isRtl),
          fontSize: 24,
          bold: true,
          color: primaryColorHex,
          alignment: "center"
        },
        {
          text: wrapAndProcessText(cv.jobTitle || "Job Title", 50, isRtl),
          fontSize: 12,
          color: accentColorHex,
          alignment: "center",
          margin: [0, 4, 0, 6] as [number, number, number, number]
        },
        {
          text: wrapAndProcessText(contactItems.join("   •   "), 90, isRtl),
          fontSize: 9.5,
          color: "#334155",
          alignment: "center",
          margin: [0, 0, 0, 12] as [number, number, number, number]
        },
        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.25, strokeColor: primaryColorHex }
          ],
          margin: [0, 0, 0, 15] as [number, number, number, number]
        }
      ]
    });
  } else if (templateId === "minimal") {
    sections.push({
      stack: [
        {
          text: wrapAndProcessText(cv.fullName || "Name", 40, isRtl),
          fontSize: 22,
          bold: true,
          color: primaryColorHex,
          alignment: isRtl ? "right" : "left"
        },
        {
          text: wrapAndProcessText(cv.jobTitle || "Job Title", 50, isRtl),
          fontSize: 11,
          color: accentColorHex,
          alignment: isRtl ? "right" : "left",
          margin: [0, 3, 0, 6] as [number, number, number, number]
        },
        {
          text: wrapAndProcessText(contactItems.join("   |   "), 90, isRtl),
          fontSize: 8.5,
          color: "#27272a",
          alignment: isRtl ? "right" : "left",
          margin: [0, 0, 0, 10] as [number, number, number, number]
        },
        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, strokeColor: "#e4e4e7" }
          ],
          margin: [0, 0, 0, 15] as [number, number, number, number]
        }
      ]
    });
  } else {
    // ATS Template
    sections.push({
      stack: [
        {
          text: wrapAndProcessText(cv.fullName || "Name", 40, isRtl),
          fontSize: 19,
          bold: true,
          color: "#000000",
          alignment: isRtl ? "right" : "left"
        },
        {
          text: wrapAndProcessText(cv.jobTitle || "Job Title", 50, isRtl),
          fontSize: 11,
          bold: true,
          color: "#000000",
          alignment: isRtl ? "right" : "left",
          margin: [0, 2, 0, 4] as [number, number, number, number]
        },
        {
          text: wrapAndProcessText(contactItems.join("  •  "), 100, isRtl),
          fontSize: 9,
          color: "#000000",
          alignment: isRtl ? "right" : "left",
          margin: [0, 0, 0, 8] as [number, number, number, number]
        },
        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, strokeColor: "#000000" }
          ],
          margin: [0, 0, 0, 15] as [number, number, number, number]
        }
      ]
    });
  }

  // Header bottom border decorator creator
  function buildSectionHeader(title: string) {
    const label = {
      text: wrapAndProcessText(title, 50, isRtl),
      fontSize: 11.5,
      bold: true,
      color: primaryColorHex,
      alignment: isRtl ? "right" : "left",
      margin: [0, 8, 0, 4] as [number, number, number, number]
    };

    let drawElement;
    if (templateId === "modern") {
      drawElement = {
        canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, strokeColor: accentColorHex }],
        margin: [0, 0, 0, 10] as [number, number, number, number]
      };
    } else if (templateId === "classic") {
      drawElement = {
        canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, strokeColor: primaryColorHex }],
        margin: [0, 0, 0, 10] as [number, number, number, number]
      };
    } else if (templateId === "minimal") {
      drawElement = {
        canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, strokeColor: "#cbd5e1" }],
        margin: [0, 0, 0, 10] as [number, number, number, number]
      };
    } else {
      // ATS
      drawElement = {
        canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, strokeColor: "#000000" }],
        margin: [0, 0, 0, 10] as [number, number, number, number]
      };
    }

    return {
      stack: [label, drawElement],
      keepWithNext: true
    };
  }

  // --- 2. SUMMARY SECTION ---
  if (cv.summary) {
    sections.push(buildSectionHeader(isRtl ? "الملخص المهني" : "Professional Summary"));
    sections.push({
      text: wrapAndProcessText(cv.summary, 85, isRtl),
      fontSize: 9.5,
      color: textColorHex,
      lineHeight: 1.25,
      alignment: isRtl ? "right" : "left",
      margin: [0, 0, 0, 12] as [number, number, number, number]
    });
  }

  // --- 3. EXPERIENCE SECTION ---
  if (cv.experience && cv.experience.length > 0) {
    sections.push(buildSectionHeader(isRtl ? "الخبرات والمسار المهني" : "Work Experience"));
    
    cv.experience.forEach(exp => {
      const datesText = `${exp.startDate} - ${exp.endDate || (isRtl ? "الآن" : "Present")}`;
      
      const colRole = {
        text: wrapAndProcessText(exp.role || "Role Title", 60, isRtl),
        fontSize: 10,
        bold: true,
        color: primaryColorHex
      };
      
      const colDates = {
        text: wrapAndProcessText(datesText, 25, isRtl),
        fontSize: 9,
        color: "#64748b"
      };

      const roleRow = isRtl
        ? [ { ...colDates, alignment: "left", width: "auto" }, { ...colRole, alignment: "right", width: "*" } ]
        : [ { ...colRole, alignment: "left", width: "*" }, { ...colDates, alignment: "right", width: "auto" } ];

      const companyText = exp.company || "";
      const companyRow = {
        text: wrapAndProcessText(companyText, 75, isRtl),
        fontSize: 9.5,
        bold: true,
        color: templateId === "modern" ? accentColorHex : "#475569",
        alignment: isRtl ? "right" : "left",
        margin: [0, 2, 0, 4] as [number, number, number, number]
      };

      const descBlock = exp.description
        ? {
            text: wrapAndProcessText(exp.description, 85, isRtl),
            fontSize: 9,
            color: textColorHex,
            lineHeight: 1.25,
            alignment: isRtl ? "right" : "left",
            margin: [0, 2, 0, 6] as [number, number, number, number]
          }
        : null;

      sections.push({
        stack: [
          { columns: roleRow, margin: [0, 2, 0, 0] as [number, number, number, number], keepWithNext: true },
          companyRow,
          descBlock
        ].filter(Boolean),
        margin: [0, 0, 0, 8] as [number, number, number, number]
      });
    });
  }

  // --- 4. EDUCATION SECTION ---
  if (cv.education && cv.education.length > 0) {
    sections.push(buildSectionHeader(isRtl ? "التعليم والمؤهلات الدراسية" : "Education"));
    
    cv.education.forEach(edu => {
      const schText = `${edu.school || "School"} ${edu.city ? `(${edu.city})` : ""}`;
      
      const colDeg = {
        text: wrapAndProcessText(edu.degree || "Degree", 60, isRtl),
        fontSize: 10,
        bold: true,
        color: primaryColorHex
      };
      
      const colYear = {
        text: wrapAndProcessText(edu.gradYear || "", 20, isRtl),
        fontSize: 9,
        color: "#64748b"
      };

      const gradRow = isRtl
        ? [ { ...colYear, alignment: "left", width: "auto" }, { ...colDeg, alignment: "right", width: "*" } ]
        : [ { ...colDeg, alignment: "left", width: "*" }, { ...colYear, alignment: "right", width: "auto" } ];

      sections.push({
        stack: [
          { columns: gradRow, margin: [0, 2, 0, 2] as [number, number, number, number], keepWithNext: true },
          {
            text: wrapAndProcessText(schText, 80, isRtl),
            fontSize: 9,
            color: textColorHex,
            alignment: isRtl ? "right" : "left"
          }
        ],
        margin: [0, 0, 0, 8] as [number, number, number, number]
      });
    });
  }

  // --- 5. SKILLS SECTION ---
  if (cv.skills && cv.skills.length > 0) {
    sections.push(buildSectionHeader(isRtl ? "المهارات المهنية والفنية" : "Skills"));
    sections.push({
      text: wrapAndProcessText(cv.skills.join("   •   "), 85, isRtl),
      fontSize: 9.5,
      color: textColorHex,
      lineHeight: 1.3,
      alignment: isRtl ? "right" : "left",
      margin: [0, 0, 0, 10] as [number, number, number, number]
    });
  }

  // --- 6. LANGUAGES & CREDENTIALS SECTION ---
  const hasLang = cv.languages && cv.languages.length > 0;
  const hasCerts = cv.certifications && cv.certifications.length > 0;

  if (hasLang || hasCerts) {
    sections.push(buildSectionHeader(isRtl ? "اللغات والشهادات المعتمدة" : "Credentials & Languages"));
    
    const lines: string[] = [];
    if (hasLang) {
      lines.push(`${isRtl ? "اللغات: " : "Languages: "} ${cv.languages.join(", ")}`);
    }
    if (hasCerts) {
      lines.push(`${isRtl ? "الشهادات والكورسات: " : "Certifications: "} ${cv.certifications.join(" • ")}`);
    }

    lines.forEach(line => {
      sections.push({
        text: wrapAndProcessText(line, 85, isRtl),
        fontSize: 9.5,
        color: textColorHex,
        lineHeight: 1.25,
        alignment: isRtl ? "right" : "left",
        margin: [0, 2, 0, 4] as [number, number, number, number]
      });
    });
  }

  // Formulate absolute document definition for PDFMake
  const docDefinition = {
    content: sections,
    defaultStyle: {
      font: fontName,
      fontSize: 9.5,
      lineHeight: 1.25,
      color: textColorHex
    },
    pageMargins: [35, 35, 35, 35] as [number, number, number, number]
  };

  const outputFileName = cv.fullName 
    ? `${cv.fullName.replace(/\s+/g, "_")}_CV.pdf` 
    : "Resume_CV.pdf";

  // Build local VFS and font configurations to override globally securely
  const customVfs = { ...((activePdfMake as any).vfs || {}) };
  
  // Back up any fonts fetched during previous or current downloads
  const actualFontFamily = fontName;
  if (actualFontFamily !== "Roboto") {
    const regFontBase64 = fontCache[`${actualFontFamily}-Regular`];
    const boldFontBase64 = fontCache[`${actualFontFamily}-Bold`] || regFontBase64;
    if (regFontBase64) {
      customVfs[`${actualFontFamily}-Regular.ttf`] = regFontBase64;
      customVfs[`${actualFontFamily}-Bold.ttf`] = boldFontBase64;
    }
  }

  // Ensure Cairo and Amiri are properly copied to customVfs if they exist in cache
  if (fontCache["Cairo-Regular"]) {
    customVfs["Cairo-Regular.ttf"] = fontCache["Cairo-Regular"];
    customVfs["Cairo-Bold.ttf"] = fontCache["Cairo-Bold"] || fontCache["Cairo-Regular"];
  }
  if (fontCache["Amiri-Regular"]) {
    customVfs["Amiri-Regular.ttf"] = fontCache["Amiri-Regular"];
    customVfs["Amiri-Bold.ttf"] = fontCache["Amiri-Bold"] || fontCache["Amiri-Regular"];
  }

  // Supercharge fallback: Map standard Roboto keys to our loaded Arabic font base64!
  // This completely eliminates "File 'Roboto-Regular.ttf' not found in virtual file system" crashes
  // as it provides a valid, working TTF font even if the default pdfFonts did not register in ESM.
  const activeFontReg = fontCache[`${fontName}-Regular`] || fontCache["Cairo-Regular"] || fontCache["Amiri-Regular"] || fontCache["Roboto-Regular"];
  const activeFontBold = fontCache[`${fontName}-Bold`] || fontCache["Cairo-Bold"] || fontCache["Amiri-Bold"] || fontCache["Roboto-Bold"] || activeFontReg;
  
  if (activeFontReg) {
    customVfs["Roboto-Regular.ttf"] = activeFontReg;
    customVfs["Roboto-Bold.ttf"] = activeFontBold;
    customVfs["Roboto-Italic.ttf"] = activeFontReg;
    customVfs["Roboto-BoldItalic.ttf"] = activeFontBold;
  }

  // Double check that we do not try to use a font family whose files are missing from customVfs
  let finalFontName = fontName;
  if (finalFontName !== "Roboto") {
    const regKey = `${finalFontName}-Regular.ttf`;
    const boldKey = `${finalFontName}-Bold.ttf`;
    if (!customVfs[regKey] || !customVfs[boldKey]) {
      console.warn(`Font files for ${finalFontName} missing from customVfs. Falling back to Roboto.`);
      finalFontName = "Roboto";
      docDefinition.defaultStyle.font = "Roboto";
    }
  }

  // Build the customFonts object dynamically
  const customFonts: any = {
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Bold.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-BoldItalic.ttf"
    }
  };

  // Only declare Amiri if its physical files are completely ready in customVfs
  if (customVfs["Amiri-Regular.ttf"] && customVfs["Amiri-Bold.ttf"]) {
    customFonts.Amiri = {
      normal: "Amiri-Regular.ttf",
      bold: "Amiri-Bold.ttf"
    };
  }

  // Only declare Cairo if its physical files are completely ready in customVfs
  if (customVfs["Cairo-Regular.ttf"] && customVfs["Cairo-Bold.ttf"]) {
    customFonts.Cairo = {
      normal: "Cairo-Regular.ttf",
      bold: "Cairo-Bold.ttf"
    };
  }

  // Trigger browser download with robust double-fallback logic
  try {
    console.log(`Starting PDF download with font choice: ${finalFontName}`);
    
    // Assign to pdfMake globally to bypass any signature and reference handling issues across modules/bundles
    if (typeof window !== "undefined") {
      (window as any).pdfMake = activePdfMake;
    }
    (activePdfMake as any).fonts = customFonts;
    (activePdfMake as any).vfs = customVfs;

    (activePdfMake as any).createPdf(docDefinition, undefined, customFonts, customVfs).download(outputFileName);
  } catch (downloadErr) {
    console.error("Dynamic font rendering failed. Falling back to built-in Roboto font...", downloadErr);
    
    // Explicitly modify the font parameter and generate under standard Roboto configuration
    docDefinition.defaultStyle.font = "Roboto";
    const robotoFonts = {
      Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Bold.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-BoldItalic.ttf"
      }
    };
    if (typeof window !== "undefined") {
      (window as any).pdfMake = activePdfMake;
    }
    (activePdfMake as any).fonts = robotoFonts;
    (activePdfMake as any).vfs = customVfs;
    
    (activePdfMake as any).createPdf(docDefinition, undefined, robotoFonts, customVfs).download(outputFileName);
  }
}

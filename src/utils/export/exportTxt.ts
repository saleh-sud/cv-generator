import { saveAs } from "file-saver";
import { CVData } from "../../types";

/**
 * Generates and downloads a clean, beautifully formatted plain text resume.
 * Ideal as a zero-fuss fallback and ATS copy-paste reference.
 */
export function exportTxt(cv: CVData, isRtl: boolean): void {
  const lines: string[] = [];

  // Title block
  const nameLabel = cv.fullName || (isRtl ? "الاسم الكامل" : "Full Name");
  lines.push(nameLabel.toUpperCase());
  if (cv.jobTitle) {
    lines.push(cv.jobTitle);
  }
  lines.push("=".repeat(nameLabel.length));
  
  // Contact Info
  const contact: string[] = [];
  if (cv.email) contact.push(cv.email);
  if (cv.phone) contact.push(cv.phone);
  if (cv.city) contact.push(cv.city);
  if (contact.length > 0) {
    lines.push(contact.join(" | "));
  }
  lines.push("");

  // Professional Summary
  if (cv.summary) {
    lines.push(isRtl ? "--- الملخص المهني ---" : "--- Professional Summary ---");
    lines.push(cv.summary);
    lines.push("");
  }

  // Work Experience
  if (cv.experience && cv.experience.length > 0) {
    lines.push(isRtl ? "--- الخبرات المهنية ---" : "--- Work Experience ---");
    cv.experience.forEach((exp, idx) => {
      const dates = `${exp.startDate} - ${exp.endDate || (isRtl ? "الآن" : "Present")}`;
      lines.push(`${idx + 1}. ${exp.role} @ ${exp.company} (${dates})`);
      if (exp.description) {
        lines.push(exp.description);
      }
      lines.push("");
    });
  }

  // Education
  if (cv.education && cv.education.length > 0) {
    lines.push(isRtl ? "--- التعليم والمؤهلات ---" : "--- Education ---");
    cv.education.forEach((edu) => {
      const gradYearStr = edu.gradYear ? ` (${edu.gradYear})` : "";
      const cityStr = edu.city ? `, ${edu.city}` : "";
      lines.push(`• ${edu.degree} - ${edu.school}${cityStr}${gradYearStr}`);
    });
    lines.push("");
  }

  // Skills
  if (cv.skills && cv.skills.length > 0) {
    lines.push(isRtl ? "--- المهارات ---" : "--- Skills ---");
    lines.push(cv.skills.join(" • "));
    lines.push("");
  }

  // Languages
  if (cv.languages && cv.languages.length > 0) {
    lines.push(isRtl ? "--- اللغات ---" : "--- Languages ---");
    lines.push(cv.languages.join(" • "));
    lines.push("");
  }

  // Certifications
  if (cv.certifications && cv.certifications.length > 0) {
    lines.push(isRtl ? "--- الشهادات والدورات ---" : "--- Certifications ---");
    lines.push(cv.certifications.join(" • "));
    lines.push("");
  }

  const textContent = lines.join("\n");
  const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
  
  const fileName = cv.fullName
    ? `${cv.fullName.trim().replace(/\s+/g, "_")}_CV.txt`
    : "Resume_CV.txt";
    
  saveAs(blob, fileName);
}

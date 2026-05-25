import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  IParagraphOptions
} from "docx";
import { CVData } from "../../types";

/**
 * Creates and exports a highly polished Word (.docx) document.
 * Leverages native Word RTL attributes (bidirectional + rightToLeft run properties)
 * to support Arabic and bilingual mixed-direction content perfectly.
 */
export async function exportWord(cv: CVData, isRtl: boolean): Promise<void> {
  const primaryColorHex = "0F172A"; // Slate-900 / Deep Slate
  const accentColorHex = isRtl ? "475569" : "4F46E5"; // Muted Slate vs Indigo
  const textColorHex = "334155"; // Slate-700
  const lightGreyHex = "94A3B8"; // Slate-400
  
  // Decide fonts based on direction
  const fontName = isRtl ? "Arial" : "Calibri";

  // Helper to build a styled Paragraph with correct language direction
  const createParagraph = (options: IParagraphOptions): Paragraph => {
    return new Paragraph({
      ...options,
      bidirectional: isRtl ? true : undefined,
      alignment: options.alignment || (isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT),
    });
  };

  const children: Paragraph[] = [];

  // --- 1. HEADER SECTION ---
  // CV Full Name
  children.push(
    createParagraph({
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({
          text: (cv.fullName || "Name").trim(),
          font: fontName,
          size: 44, // 22pt
          bold: true,
          color: primaryColorHex,
          rightToLeft: isRtl ? true : undefined,
        }),
      ],
    })
  );

  // CV Job Title
  if (cv.jobTitle) {
    children.push(
      createParagraph({
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { before: 0, after: 120 },
        children: [
          new TextRun({
            text: cv.jobTitle.trim(),
            font: fontName,
            size: 26, // 13pt
            bold: true,
            color: accentColorHex,
            rightToLeft: isRtl ? true : undefined,
          }),
        ],
      })
    );
  }

  // Contact Grid Line
  const contactLines: string[] = [];
  if (cv.email) contactLines.push(cv.email);
  if (cv.phone) contactLines.push(cv.phone);
  if (cv.city) contactLines.push(cv.city);
  
  if (contactLines.length > 0) {
    const separator = isRtl ? "  •  " : "  |  ";
    children.push(
      createParagraph({
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { before: 0, after: 240 },
        children: [
          new TextRun({
            text: contactLines.join(separator),
            font: fontName,
            size: 19, // 9.5pt
            color: textColorHex,
            rightToLeft: isRtl ? true : undefined,
          }),
        ],
      })
    );
  }

  // Helper to append a structured Section title with a professional accent bottom border line
  const addSectionTitle = (title: string) => {
    children.push(
      createParagraph({
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { before: 280, after: 120 },
        border: {
          bottom: {
            color: accentColorHex,
            space: 6,
            style: BorderStyle.SINGLE,
            size: 10, // ~1.25 pt width
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            font: fontName,
            size: 25, // ~12.5pt
            bold: true,
            color: primaryColorHex,
            rightToLeft: isRtl ? true : undefined,
          }),
        ],
      })
    );
  };

  // --- 2. PROFESSIONAL SUMMARY ---
  if (cv.summary) {
    addSectionTitle(isRtl ? "الملخص المهني" : "Professional Summary");
    children.push(
      createParagraph({
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { before: 60, after: 180, line: 300 }, // clean lineheight
        children: [
          new TextRun({
            text: cv.summary,
            font: fontName,
            size: 21, // 10.5pt
            color: textColorHex,
            rightToLeft: isRtl ? true : undefined,
          }),
        ],
      })
    );
  }

  // --- 3. WORK EXPERIENCE ---
  if (cv.experience && cv.experience.length > 0) {
    addSectionTitle(isRtl ? "الخبرات والمسار المهني" : "Work Experience");
    
    cv.experience.forEach((exp) => {
      const datesText = `${exp.startDate} - ${exp.endDate || (isRtl ? "الآن" : "Present")}`;
      
      // Role & Dates layout context (RTL vs LTR support)
      // We will place role and dates on separate text fragments in the same line or nicely spaced paragraphs
      children.push(
        createParagraph({
          alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: (exp.role || "Role Title").trim() + "   ",
              font: fontName,
              size: 22, // 11pt
              bold: true,
              color: primaryColorHex,
              rightToLeft: isRtl ? true : undefined,
            }),
            new TextRun({
              text: `(${datesText})`,
              font: fontName,
              size: 19, // 9.5pt
              color: lightGreyHex,
              rightToLeft: isRtl ? true : undefined,
            }),
          ],
        })
      );

      // Company Info
      if (exp.company) {
        children.push(
          createParagraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: exp.company.trim(),
                font: fontName,
                size: 20, // 10pt
                bold: true,
                color: accentColorHex,
                rightToLeft: isRtl ? true : undefined,
              }),
            ],
          })
        );
      }

      // Description text run
      if (exp.description) {
        children.push(
          createParagraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { before: 40, after: 160, line: 280 },
            children: [
              new TextRun({
                text: exp.description,
                font: fontName,
                size: 20, // 10pt
                color: textColorHex,
                rightToLeft: isRtl ? true : undefined,
              }),
            ],
          })
        );
      }
    });
  }

  // --- 4. EDUCATION ---
  if (cv.education && cv.education.length > 0) {
    addSectionTitle(isRtl ? "التعليم والمؤهلات الدراسية" : "Education");

    cv.education.forEach((edu) => {
      const gradYearText = edu.gradYear ? ` (${edu.gradYear})` : "";
      
      children.push(
        createParagraph({
          alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: (edu.degree || "Degree Title").trim() + gradYearText,
              font: fontName,
              size: 22, // 11pt
              bold: true,
              color: primaryColorHex,
              rightToLeft: isRtl ? true : undefined,
            }),
          ],
        })
      );

      const schoolCity = `${edu.school || ""}${edu.city ? `, ${edu.city}` : ""}`;
      if (schoolCity) {
        children.push(
          createParagraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: schoolCity.trim(),
                font: fontName,
                size: 20, // 10pt
                color: textColorHex,
                rightToLeft: isRtl ? true : undefined,
              }),
            ],
          })
        );
      }
    });
  }

  // --- 5. SKILLS ---
  if (cv.skills && cv.skills.length > 0) {
    addSectionTitle(isRtl ? "المهارات المهنية والفنية" : "Skills");
    children.push(
      createParagraph({
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { before: 80, after: 180, line: 300 },
        children: [
          new TextRun({
            text: cv.skills.join("   •   "),
            font: fontName,
            size: 21, // 10.5pt
            color: textColorHex,
            bold: true,
            rightToLeft: isRtl ? true : undefined,
          }),
        ],
      })
    );
  }

  // --- 6. LANGUAGES & CERTIFICATIONS ---
  const hasLang = cv.languages && cv.languages.length > 0;
  const hasCerts = cv.certifications && cv.certifications.length > 0;

  if (hasLang || hasCerts) {
    addSectionTitle(isRtl ? "اللغات والشهادات المعتمدة" : "Credentials & Languages");

    if (hasLang) {
      children.push(
        createParagraph({
          alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
          spacing: { before: 60, after: 80 },
          children: [
            new TextRun({
              text: `${isRtl ? "اللغات:  " : "Languages:  "}`,
              font: fontName,
              size: 21,
              bold: true,
              color: primaryColorHex,
              rightToLeft: isRtl ? true : undefined,
            }),
            new TextRun({
              text: cv.languages.join(", "),
              font: fontName,
              size: 21,
              color: textColorHex,
              rightToLeft: isRtl ? true : undefined,
            }),
          ],
        })
      );
    }

    if (hasCerts) {
      children.push(
        createParagraph({
          alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
          spacing: { before: 60, after: 120 },
          children: [
            new TextRun({
              text: `${isRtl ? "الشهادات والتعليم المالي والدورات:  " : "Certifications & Courses:  "}`,
              font: fontName,
              size: 21,
              bold: true,
              color: primaryColorHex,
              rightToLeft: isRtl ? true : undefined,
            }),
            new TextRun({
              text: cv.certifications.join("   •   "),
              font: fontName,
              size: 21,
              color: textColorHex,
              rightToLeft: isRtl ? true : undefined,
            }),
          ],
        })
      );
    }
  }

  // Instantiate standard Docx Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1150, // 0.8 inch
              bottom: 1150,
              left: 1150,
              right: 1150,
            },
          },
        },
        children: children,
      },
    ],
  });

  // Pack and generate download trigger in the client with file-saver
  const blob = await Packer.toBlob(doc);
  const fileSuffix = cv.fullName ? cv.fullName.trim().replace(/\s+/g, "_") : "Word_CV";
  saveAs(blob, `${fileSuffix}_CV.docx`);
}

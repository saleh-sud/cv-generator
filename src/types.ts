export interface CVData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  summary: string;
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    gradYear: string;
    city: string;
  }>;
  skills: string[];
  languages: string[];
  certifications: string[];
}

export interface JobDescInput {
  jobTitle: string;
  department: string;
  contractType: string;
  location: string;
  experienceYears: string;
  responsibilities: string;
  requirements: string;
  skills: string;
  salary?: string;
}

export interface JobDescOutput {
  jobTitle: string;
  department: string;
  jobSummary: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  contractType: string;
  workLocation: string;
  salary?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  readTime: string;
  date: string;
  category: string;
  categoryEn: string;
  titleEn: string;
  summaryEn: string;
  contentEn: string;
}

export interface SeoCvTemplate {
  slug: string;
  titleAr: string;
  titleEn: string;
  metaTitleAr: string;
  metaTitleEn: string;
  metaDescAr: string;
  metaDescEn: string;
  keywordsAr: string[];
  keywordsEn: string[];
  h1Ar: string;
  h1En: string;
  introAr: string;
  introEn: string;
  sampleCvAr: CVData;
  sampleCvEn: CVData;
  skillsAr: string[];
  skillsEn: string[];
  tipsAr: string[];
  tipsEn: string[];
  faqsAr: Array<{ q: string; a: string }>;
  faqsEn: Array<{ q: string; a: string }>;
}

export interface SeoJobTemplate {
  slug: string;
  titleAr: string;
  titleEn: string;
  metaTitleAr: string;
  metaTitleEn: string;
  metaDescAr: string;
  metaDescEn: string;
  keywordsAr: string[];
  keywordsEn: string[];
  h1Ar: string;
  h1En: string;
  jobTitleAr: string;
  jobTitleEn: string;
  departmentAr: string;
  departmentEn: string;
  summaryAr: string;
  summaryEn: string;
  responsibilitiesAr: string[];
  responsibilitiesEn: string[];
  requirementsAr: string[];
  requirementsEn: string[];
  skillsAr: string[];
  skillsEn: string[];
  faqsAr: Array<{ q: string; a: string }>;
  faqsEn: Array<{ q: string; a: string }>;
}

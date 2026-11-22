import config from "../../site.config.json";

/** إعدادات الموقع الأساسية – عدّلها من ملف site.config.json فقط. */
export const SITE = {
  url: config.siteUrl.replace(/\/+$/, ""),
  nameAr: config.siteNameAr,
  nameEn: config.siteNameEn,
  contactEmail: config.contactEmail,
  waslUrl: config.waslUrl,
  ogImage: config.ogImage,
};

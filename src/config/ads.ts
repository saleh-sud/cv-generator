/**
 * إعدادات الإعلانات – هذا هو الملف الوحيد الذي تعدّله لتشغيل/إيقاف المنصات ولصق أكوادها.
 *
 * - enabled: true/false لتشغيل المنصة أو إيقافها بالكامل.
 * - slots:   كود الإعلان (HTML/JS كما تعطيك المنصة) لكل مكان في الصفحة.
 *            يبقى فارغًا "" => لا يظهر شيء في الموقع الحقيقي (ويظهر مربع تنبيه في وضع التطوير فقط).
 * - global:  أكواد تُحمَّل مرة واحدة في كل الصفحات (Popunder / Social Bar / Native ...).
 *
 * أماكن الإعلان: top (بانر علوي 728×90) | content (وسط المحتوى 468×60) | sidebar (جانبي 300×250)
 */
export type AdSlotName = "top" | "content" | "sidebar";
export type AdNetworkId = "hilltopads" | "aads" | "adsterra";

export interface AdNetworkConfig {
  label: string;
  enabled: boolean;
  slots: Record<AdSlotName, string>;
  global: string;
}

export const ADS_CONFIG: Record<AdNetworkId, AdNetworkConfig> = {
  hilltopads: {
    label: "HilltopAds",
    enabled: false,
    slots: {
      top: "", // <-- الصق هنا كود HilltopAds للبانر العلوي
      content: "", // <-- الصق هنا كود HilltopAds لبانر وسط المحتوى
      sidebar: "", // <-- الصق هنا كود HilltopAds للبانر الجانبي
    },
    global: "", // <-- (اختياري) كود Popunder / In-Page Push من HilltopAds
  },
  aads: {
    label: "A-ADS",
    enabled: false,
    slots: {
      top: "", // <-- الصق هنا iframe الخاص بـ A-ADS (728×90)
      content: "", // <-- الصق هنا iframe الخاص بـ A-ADS (468×60)
      sidebar: "", // <-- الصق هنا iframe الخاص بـ A-ADS (300×250)
    },
    global: "",
  },
  adsterra: {
    label: "Adsterra",
    enabled: false,
    slots: {
      top: "", // <-- الصق هنا كود Adsterra (atOptions + invoke.js) لمقاس 728×90
      content: "", // <-- الصق هنا كود Adsterra لمقاس 468×60
      sidebar: "", // <-- الصق هنا كود Adsterra لمقاس 300×250
    },
    global: "", // <-- (اختياري) Social Bar / Popunder / Native Banner من Adsterra
  },
};

/** ترتيب ظهور المنصات داخل نفس المكان. */
export const AD_NETWORK_ORDER: AdNetworkId[] = ["hilltopads", "aads", "adsterra"];

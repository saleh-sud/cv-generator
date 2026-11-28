/**
 * إعدادات الإعلانات – هذا هو الملف الوحيد الذي تعدّله لتشغيل/إيقاف المنصات ولصق أكوادها.
 *
 * - enabled: true/false لتشغيل المنصة أو إيقافها بالكامل.
 * - slots:   كود الإعلان (HTML/JS كما تعطيك المنصة) لكل مكان في الصفحة.
 *            يبقى فارغًا "" => لا يظهر شيء في هذا المكان لهذه المنصة.
 * - global:  أكواد تُحمَّل مرة واحدة في كل الصفحات (Popunder / Social Bar / In-Page Push / Video Slider).
 *
 * أماكن الإعلان:
 *   top     بانر علوي 728×90 (على الشاشات الكبيرة)
 *   mobile  بانر علوي للجوال 320×100 (يحلّ مكان top تلقائيًا على الشاشات الصغيرة)
 *   content وسط المحتوى 468×60
 *   sidebar جانبي 300×250
 *   native  إعلان Native بعرض المحتوى
 *
 * كل المنصات مضبوطة على "بدون إعلانات للبالغين".
 */
export type AdSlotName = "top" | "mobile" | "content" | "sidebar" | "native";
export type AdNetworkId = "hilltopads" | "aads";

export interface AdNetworkConfig {
  label: string;
  enabled: boolean;
  slots: Record<AdSlotName, string>;
  global: string;
}

/** صيغة كود HilltopAds MultiTag (نفس الكود الذي تعطيه المنصة، فقط الرابط يتغير). */
const hilltop = (src: string) =>
  `<script>(function(oast){var d=document,s=d.createElement('script'),l=d.currentScript||d.scripts[d.scripts.length-1];s.settings=oast||{};s.src="${src}";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})</script>`;

/** A-ADS: وحدة واحدة Adaptive (#2463568) تتكيّف مع حجم كل مكان. */
const AADS_UNIT = `<iframe data-aa='2463568' src='https://acceptable.a-ads.com/2463568/?size=Adaptive' style='border:0;padding:0;width:100%;height:100%;overflow:hidden;display:block;margin:auto'></iframe>`;

export const ADS_CONFIG: Record<AdNetworkId, AdNetworkConfig> = {
  hilltopads: {
    label: "HilltopAds",
    enabled: true,
    slots: {
      top: "",
      // 300x100 zone 7669861, site cv.wasl-jobs.com
      mobile: hilltop("https://prizefamily.com/b/XUV.sNd/GSlA0YYOW_cP/Re/m/9suEZ/UJlUkgPuT_c/2wN/jDki4/NqjYEItwNNzwYv2mOGTygb2/NdQW"),
      content: "",
      // 300x250 zone 7669829, site cv.wasl-jobs.com
      sidebar: hilltop("https://prizefamily.com/bvXpVns/d.Gylr0OYqW/cb/ze/m/9_upZ/UKl/kxPpTlcv2zN/jvkN4/MxjwkCtgNtz/Yn2ROpTGgTz/MrwF"),
      native: "",
    },
    // Popunder / In-Page Push / Video Slider removed (not allowed next to Google AdSense).
    global: "",
  },
  aads: {
    label: "A-ADS",
    enabled: true,
    slots: {
      top: AADS_UNIT,
      mobile: AADS_UNIT,
      content: AADS_UNIT,
      sidebar: AADS_UNIT,
      native: "",
    },
    global: "",
  },
};

/** ترتيب ظهور المنصات داخل نفس المكان. */
export const AD_NETWORK_ORDER: AdNetworkId[] = ["hilltopads", "aads"];

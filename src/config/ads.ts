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
export type AdNetworkId = "hilltopads" | "aads" | "adsterra";

export interface AdNetworkConfig {
  label: string;
  enabled: boolean;
  slots: Record<AdSlotName, string>;
  global: string;
}

/** صيغة كود HilltopAds MultiTag/Popunder (نفس الكود الذي تعطيه المنصة، فقط الرابط يتغير). */
const hilltop = (src: string) =>
  `<script>(function(oast){var d=document,s=d.createElement('script'),l=d.currentScript||d.scripts[d.scripts.length-1];s.settings=oast||{};s.src="${src}";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})</script>`;

/** صيغة كود Adsterra Banner (iframe). */
const adsterraBanner = (key: string, width: number, height: number) =>
  `<script>atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};</script><script src="https://bauval.org/22/${key}"></script>`;

/** A-ADS: وحدة واحدة Adaptive (#2462866) تتكيّف مع حجم كل مكان. */
const AADS_UNIT = `<iframe data-aa='2462866' src='https://acceptable.a-ads.com/2462866/?size=Adaptive' style='border:0;padding:0;width:100%;height:100%;overflow:hidden;display:block;margin:auto'></iframe>`;

export const ADS_CONFIG: Record<AdNetworkId, AdNetworkConfig> = {
  hilltopads: {
    label: "HilltopAds",
    enabled: true,
    slots: {
      top: "",
      // JobTools_Banner_300x100 (zone 7649041)
      mobile: hilltop("https://prizefamily.com/bIX/Vcs.d/G/l_0yYfWgcm/veJmo9/u/ZMU/lMkFPATvcv2FN/DGkkwhNFDpEStsNYzJYr0YOQT/Au0DNcQj"),
      content: "",
      // JobTools_Banner_300x250 (zone 7649025)
      sidebar: hilltop("https://prizefamily.com/bTX/V.s/dIGllr0KYnW-cr/Ne_mN9NuqZ/UflpkZP/T_ch2bNGDXkkwDMDjzUytZNPzmY/0RODTZA/yGOtQU"),
      native: "",
    },
    global: [
      // JobTools_Popunder (zone 7649009)
      hilltop("https://enchantingboss.com/c/Dn9d6Jb.2-5/leSGW-Q/9YNJzlYS0XOcT/AuwAOESz0b3fNSjNQ_5BMPDWE/zB"),
      // JobTools_InPagePush (zone 7649053)
      hilltop("https://prizefamily.com/bRXAV-s.ddGQle0aYKWVcp/SeJmY9/u/Z/UDl-keP/Tscf2BNaD/kGwINDTXMptfN/zCYX0iOQTFA/1ENkwD"),
      // JobTools_VideoSlider (zone 7649069)
      hilltop("https://prizefamily.com/bcXBVqs.dKGylw0tYtWhco/QezmR9CuMZWUzlBkrP/TtcS2nN/Dak/wINPjtkEtDNQzEYf0bOSTeAL3fM/wi"),
    ].join(""),
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
  adsterra: {
    label: "Adsterra",
    enabled: true,
    slots: {
      top: adsterraBanner("232690b7caa661b6b556e5df0e0e7576", 728, 90),
      mobile: adsterraBanner("9e34b40c29b3703762891206b2662d6c", 320, 50),
      content: adsterraBanner("706b491c339f9dbe2dbb51513ed96845", 468, 60),
      sidebar: adsterraBanner("10ae58789b24b4e85e51189adb696f3f", 300, 250),
      native: `<script async="async" data-cfasync="false" src="https://bauval.org/21/6b6482dae4d0b6ec9af422e5dbe25b1d"></script><div id="container-6b6482dae4d0b6ec9af422e5dbe25b1d"></div>`,
    },
    global: [
      // Social Bar
      `<script data-cfasync="false" src="https://bauval.org/14/26568786ff1b172f43c0eda6056e81c9"></script>`,
      // Popunder
      `<script data-cfasync="false" src="https://abscloud.org/1/07c5c13a3f65e8259a233fa7b13bd0a8"></script>`,
    ].join(""),
  },
};

/** ترتيب ظهور المنصات داخل نفس المكان. */
export const AD_NETWORK_ORDER: AdNetworkId[] = ["adsterra", "hilltopads", "aads"];

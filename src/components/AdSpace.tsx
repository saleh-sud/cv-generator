import { AD_NETWORK_ORDER, ADS_CONFIG, AdSlotName } from "../config/ads";

interface AdSpaceProps {
  type: AdSlotName;
  isRtl?: boolean;
}

const SIZE: Record<AdSlotName, { w: number; h: number }> = {
  top: { w: 728, h: 90 },
  content: { w: 468, h: 60 },
  sidebar: { w: 300, h: 250 },
};

/**
 * مكوّن إعلانات واحد لكل المنصات (HilltopAds / A-ADS / Adsterra).
 * كل إعلان يُعرض داخل iframe معزول (sandbox) حتى لا تتعارض السكربتات مع بعضها
 * ولا يصل كود الإعلان إلى صفحة الموقع. الإعدادات في src/config/ads.ts
 */
export default function AdSpace({ type, isRtl = true }: AdSpaceProps) {
  const { w, h } = SIZE[type];
  const active = AD_NETWORK_ORDER.filter((id) => ADS_CONFIG[id].enabled);
  const withCode = active.filter((id) => ADS_CONFIG[id].slots[type].trim());

  // في الموقع الحقيقي: لا نعرض شيئًا إذا لا يوجد كود. في وضع التطوير: مربع تنبيه واضح.
  if (withCode.length === 0) {
    if (!import.meta.env.DEV) return null;
    const names = (active.length ? active : AD_NETWORK_ORDER).map((id) => ADS_CONFIG[id].label).join(" / ");
    return (
      <div
        className="mx-auto my-4 flex items-center justify-center text-center text-[11px] text-slate-400 border border-dashed border-slate-300 rounded-lg bg-slate-50 px-3"
        style={{ width: "100%", maxWidth: w, minHeight: h }}
        data-ad-placeholder={type}
      >
        {isRtl ? `مكان إعلان (${type}) — الصق الكود في src/config/ads.ts — ${names}` : `Ad slot (${type}) — paste code in src/config/ads.ts — ${names}`}
      </div>
    );
  }

  return (
    <div className="my-4 flex flex-col items-center gap-3" id={`ad-space-${type}`}>
      {withCode.map((id) => (
        <iframe
          key={id}
          title={`ad-${id}-${type}`}
          loading="lazy"
          scrolling="no"
          width={w}
          height={h}
          style={{ border: 0, maxWidth: "100%" }}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          srcDoc={`<!doctype html><html><head><meta charset="utf-8"><base target="_blank"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>${ADS_CONFIG[id].slots[type]}</body></html>`}
        />
      ))}
    </div>
  );
}

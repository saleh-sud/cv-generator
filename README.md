# أدوات الوظائف (JobTools) — مولد السيرة الذاتية والوصف الوظيفي

موقع React + Vite يعمل بالكامل في المتصفح (بدون خادم). مجاني ومموَّل بالإعلانات.

## التشغيل محلياً
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # يبني dist/ + sitemap.xml + robots.txt + صفحات ثابتة لكل مسار + 404.html
```

## الإعدادات (ملفان فقط)
| الملف | الغرض |
|---|---|
| `site.config.json` | رابط الموقع النهائي (`siteUrl`)، بريد التواصل (`contactEmail`)، رابط وصل (`waslUrl`) |
| `src/config/ads.ts` | تشغيل/إيقاف HilltopAds وA-ADS (وإعلانات Google AdSense من index.html) ولصق أكوادها لكل مكان |

> غيّر `siteUrl` قبل البناء: منه يُولَّد الـ sitemap وrobots والـ canonical.

## الإعلانات
المكوّن `src/components/AdSpace.tsx` (`top` / `content` / `sidebar`) يعرض أكواد المنصات المفعّلة داخل iframe معزول.
الأكواد العامة توضع في `global` وتُحمَّل مرة واحدة عبر `GlobalAds`.
بدون كود => لا يظهر شيء في الموقع الحقيقي (ويظهر مربع تنبيه في `npm run dev` فقط).

## النشر على Firebase Hosting (موقع مستقل لكل مشروع)
```bash
npm install -g firebase-tools
firebase login
firebase use <PROJECT_ID>
firebase target:apply hosting cv-generator jobtools-cv-generator
npm run build
firebase deploy --only hosting:cv-generator
```
`<SITE_ID>` هو معرّف الـ Site داخل Firebase Console → Hosting (يمكن إنشاء موقع جديد بـ `firebase hosting:sites:create <SITE_ID>`).
الرابط الافتراضي: `https://<SITE_ID>.web.app`

بعد النشر: أرسل `https://<SITE_ID>.web.app/sitemap.xml` في Google Search Console.

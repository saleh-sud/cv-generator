import React, { useState } from "react";
import { SITE } from "../config/site";
import { Mail, Shield, FileSpreadsheet, Info, Check, Send, Sparkles } from "lucide-react";

interface LegalProps {
  pageType: "privacy" | "terms" | "contact" | "about";
  isRtl: boolean;
  onNavigate: (route: string) => void;
}

export default function Legal({ pageType, isRtl, onNavigate }: LegalProps) {
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [success, setSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert(isRtl ? "يرجى تعبئة كافة الحقول الإلزامية." : "Please fill in all mandatory fields.");
      return;
    }
    if (!SITE.contactEmail) return;
    // لا يوجد خادم: نفتح تطبيق البريد لدى الزائر برسالة جاهزة
    const subject = contactForm.subject || (isRtl ? "رسالة من الموقع" : "Message from website");
    const body = `${contactForm.message}\n\n— ${contactForm.name} (${contactForm.email})`;
    window.location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSuccess(true);
    setContactForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSuccess(false), 8000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      
      {/* Dynamic Render according to pageType */}
      {pageType === "privacy" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {isRtl ? "سياسة الخصوصية وأمان المستخدمين" : "Privacy Policy & Security Standards"}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {isRtl ? "تاريخ التحديث الأخير: نوفمبر 2026" : "Last updated: November 2026"}
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-650 leading-relaxed space-y-4">
            <p>
              {isRtl 
                ? "أهلاً بك في منصتنا لتوليد السير الذاتية والوصف الوظيفي. نحن نقدّر خصوصيتك بشكل مطلق ونضع حدوداً صارمة وصادقة لضمان أمن ملفك الشخصي وعناوينك."
                : "Welcome to our platform. We deeply revere your data choices and enforce airtight safeguards to keep your personal indices private."}
            </p>

            <h3 className="text-slate-900 font-extrabold text-base pt-3 border-b border-slate-50 pb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-rose-500 rounded-xs"></span>
              {isRtl ? "1. معالجة وتخزين البيانات محلياً (Zero Leakage)" : "1. Localized Sandboxed Storage (Zero Data Leaks)"}
            </h3>
            <p>
              {isRtl 
                ? "كافة النصوص والبيانات والخبرات المهنية التي تقوم بكتابتها وتوليدها في المولدات لا يتم رفعها أو معالجتها أو نقلها لخوادم خارجية للشركة إطلاقاً. كل العمليات تُحتسب وتُنظم محلياً بالكامل داخل متصفح الويب الشخصي الخاص بك ومخزنة بمأمن في ذاكرة localStorage المتصفح، مما يعني ألا أحد غيرك يستطيع مس المخرجات أو التعدي عليها."
                : "All metrics, names, and career logs that you type are processed entirely inside your client-side browser's engine. We run zero server sync, and we maintain no databases. Your drafts stay privately configured in your local storage."}
            </p>

            <h3 className="text-slate-900 font-extrabold text-base pt-3 border-b border-slate-50 pb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-rose-500 rounded-xs"></span>
              {isRtl ? "2. الإعلانات وملفات تعريف الارتباط (Cookies)" : "2. Advertising and Cookies"}
            </h3>
            <p>
              {isRtl
                ? "يعرض الموقع إعلانات عبر شبكات إعلانية خارجية، وقد تشمل HilltopAds وA-ADS وAdsterra. قد تستخدم هذه الشبكات ملفات تعريف الارتباط (Cookies) أو معرّفات مشابهة لعرض إعلانات وقياس أدائها وتقليل التكرار. هذه الجهات لها سياسات خصوصية مستقلة، ولا نملك التحكم في ما تجمعه. يمكنك حذف ملفات تعريف الارتباط أو حظرها من إعدادات متصفحك، أو استخدام إضافات حظر الإعلانات، وسيبقى الموقع يعمل."
                : "This site shows ads served by third-party ad networks, which may include HilltopAds, A-ADS and Adsterra. These networks may use cookies or similar identifiers to serve and measure ads and limit repetition. They operate under their own privacy policies and we do not control what they collect. You can delete or block cookies in your browser settings or use an ad blocker; the tools will keep working."}
            </p>

            <h3 className="text-slate-900 font-extrabold text-base pt-3 border-b border-slate-50 pb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-rose-500 rounded-xs"></span>
              {isRtl ? "3. تحليلات الزيارات (Google Analytics)" : "3. Analytics (Google Analytics)"}
            </h3>
            <p>
              {isRtl
                ? "نستخدم Google Analytics لمعرفة عدد الزوار والصفحات الأكثر زيارة والبلدان والأجهزة، بشكل إحصائي مجمّع. لا نرسل إلى Google محتوى سيرتك الذاتية أو ما تكتبه في الأدوات."
                : "We use Google Analytics to understand aggregate visitor numbers, popular pages, countries and devices. The content of your CV or anything you type into the tools is not sent to Google."}
            </p>

            <h3 className="text-slate-900 font-extrabold text-base pt-3 border-b border-slate-50 pb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-rose-500 rounded-xs"></span>
              {isRtl ? "4. عدم بيع بياناتك الشخصية" : "4. We Do Not Sell Your Personal Data"}
            </h3>
            <p>
              {isRtl
                ? "لا نبيع ولا نؤجر المعلومات التي تُدخلها في الأدوات، لأنها لا تصل إلينا أصلاً. ما يجمعه مزودو الإعلانات والتحليلات (كمعرّفات المتصفح والـ IP التقريبي) يخضع لسياساتهم."
                : "We do not sell or rent the information you enter into the tools, since it never reaches us. Data collected by ad and analytics providers (such as browser identifiers and approximate IP) is governed by their own policies."}
            </p>

            <h3 className="text-slate-900 font-extrabold text-base pt-3 border-b border-slate-50 pb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-rose-500 rounded-xs"></span>
              {isRtl ? "5. الأطفال وروابط المواقع الخارجية" : "5. Children and External Links"}
            </h3>
            <p>
              {isRtl
                ? "الموقع غير موجّه للأطفال دون 13 عاماً. قد يحتوي الموقع على روابط لمواقع خارجية (ومنها الإعلانات) لسنا مسؤولين عن محتواها أو سياساتها."
                : "The site is not directed at children under 13. It may link to external sites (including ads) whose content and policies we are not responsible for."}
            </p>

            <h3 className="text-slate-900 font-extrabold text-base pt-3 border-b border-slate-50 pb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-rose-500 rounded-xs"></span>
              {isRtl ? "6. التواصل" : "6. Contact"}
            </h3>
            <p>
              {isRtl ? "لأي استفسار حول الخصوصية، استخدم صفحة " : "For any privacy question, use the "}
              <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }} className="text-sky-600 underline">
                {isRtl ? "تواصل معنا" : "Contact page"}
              </a>
              {isRtl ? "." : "."}
            </p>
          </div>
        </div>
      )}

      {/* Terms of conditions */}
      {pageType === "terms" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-sky-50 rounded-2xl text-sky-600">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {isRtl ? "الشروط والأحكام وشرط الاستعمال" : "Terms & Conditions of Usage"}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {isRtl ? "شروط الاستخدام العادل للأكواد والمخرجات" : "Systemic guidelines and fair-use conditions"}
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-650 leading-relaxed space-y-4">
            <p>
              {isRtl 
                ? "باستخدامك لموقع مولدات السير الذاتية، فإنك تتعهد وتوافق تلقائياً على الشروط البسيطة التالية:"
                : "By utilizing our tools and reading our guides, you consent to these simple usage bounds:"}
            </p>

            <ul className="list-decimal pr-5 pl-5 space-y-3">
              <li>
                <strong>{isRtl ? "الاستخدام الشخصي العادل:" : "Personal Fair-Use:"}</strong> 
                {isRtl 
                  ? " يحق لك استخدام المولدات تكرارًا لتوليد سيرك الذاتية أو أوصافك الوظيفية لأغراض التقديم المالي أو تعيين الموظفين. يُمنع نهائياً نسخ كود المنصة بالكامل لأجل المتاجرة به أو تصديره باسم شركة أخرى بشكل مضلل."
                  : " You are licensed to use our tools as much as required to code and format your resume for professional placement. Selling or deploying clones of our layout is strictly prohibited."}
              </li>
              <li>
                <strong>{isRtl ? "صحة وحقوق البيانات:" : "Details Authenticity:"}</strong> 
                {isRtl 
                  ? " تقع المسؤولية الكاملة في اختيار الكلمات والمؤهلات والشهادات المدرجة في سيرة المتقدم على المتقدم نفسه أمام الجهات الحكومية والشركات."
                  : " You carry absolute legal responsibility for the validity, certification claims, and text formatting inside your files when presenting folders to potential employers."}
              </li>
              <li>
                <strong>{isRtl ? "إخلاء المسؤولية المالي والمهني:" : "Responsibility Disclaimer:"}</strong> 
                {isRtl 
                  ? " يتم تقديم هذه الأدوات المكتوبة 'كما هي' دون ضمانات صريحة أو ضمنية بنجاح قبول التعيين، فالشركة أو المنصة لا تمثل وكالة توظيف ولا تقدم وعوداً بمكالمات مريرة بل تسهل لك الصياغة والكيان ميكانيكياً."
                  : " We supply these formatting layout tools 'as is'. We offer zero implied warranties that presenting our ATS models will secure immediate callbacks or workplace hires."}
              </li>
              <li>
                <strong>{isRtl ? "الإعلانات والروابط الخارجية:" : "Ads and External Links:"}</strong>
                {isRtl
                  ? " يعرض الموقع إعلانات من أطراف ثالثة لتمويل الخدمة المجانية. لا نتحمل مسؤولية محتوى المعلن أو المواقع التي تنقلك إليها الإعلانات، ونوصي بالحذر عند التعامل معها."
                  : " The site shows third-party ads to fund the free service. We are not responsible for advertiser content or the sites ads lead to; please use caution."}
              </li>
              <li>
                <strong>{isRtl ? "التعديل والتوقف:" : "Changes and Availability:"}</strong>
                {isRtl
                  ? " قد نعدّل هذه الشروط أو الخدمة أو نوقفها في أي وقت دون إشعار مسبق. استمرارك في الاستخدام يعني موافقتك على النسخة الحالية."
                  : " We may modify these terms or the service, or discontinue it, at any time without notice. Continued use means you accept the current version."}
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* About Section */}
      {pageType === "about" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {isRtl ? "عن منصة السير الذاتية والأوصاف الوظيفية" : "About Our Platform and Mission"}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {isRtl ? "رواية بسيطة عن ركائز الإتقان والمساعدة" : "Our core paradigms of craftsmanship and help"}
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-650 leading-relaxed space-y-4">
            <p>
              {isRtl 
                ? "تأسس هذا الموقع بفكرة رئيسية واحدة: كسر تعقيد وتكلفة بوابات التوظيف التي تحتجز قوالب السير الذاتية والوصف الوظيفي خلف شروط دفع واشتراكات متكررة تبشر دون وفاء."
                : "Our platform was established with a single goal: to dismantle the complex paywalls, logins, and subscription traps of conventional career builders."}
            </p>
            <p className="font-semibold text-slate-800 text-base">
              {isRtl 
                ? "نحن نؤمن بالتفوق المهني، وأن لكل باحث عن كرامة العمل فرصة يستحقها شريطة أن تُعرض قيمه وخريطة مهاراته بصورة تجذب الأنظار."
                : "We believe in professional excellence. Every passionate candidate deserves a chance to showcase their unique attributes dynamically to potential managers."}
            </p>
            <p>
              {isRtl 
                ? "لهذا قمنا بالجمع بين المجلدات والنصائح الأكاديمية وصياغة الهياكل البرمجية المعتمدة لمحركات الـ ATS في واجهة استخدام بالغة الوضوح والخفة تعمل من متصفحك مباشرة بدون إثقال ولا تتبع. الموقع يدعم العربية RTL بانسجام والأجنبية LTR بقصد توفير منصة واحدة تلائم تخصصات سوق العمل في الخليج والوطن العربي كلياً."
                : "Our dual-language RTL/LTR approach serves thousands of job seekers and recruitment teams. Built securely on lightweight React architectures, it yields pristine outputs without compromising personal data safety."}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Contact Form */}
      {pageType === "contact" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {isRtl ? "اتصل بنا وتواصل مع فريق الدعم" : "Contact Support & Inquiries Channel"}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {isRtl ? "نحن مستعدون للإجابة على مقترحاتكم واستفساراتكم" : "We are happy to answer your questions"}
              </p>
            </div>
          </div>

          {SITE.contactEmail && (
            <p className="mb-5 text-sm text-slate-600">
              {isRtl ? "البريد الإلكتروني: " : "Email: "}
              <a className="text-indigo-600 font-semibold underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </p>
          )}

          {!SITE.contactEmail ? (
            <p className="p-4 text-sm bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
              {isRtl ? "البريد الإلكتروني للتواصل غير مضبوط بعد." : "The contact email has not been configured yet."}
            </p>
          ) : success ? (
            <div className="p-6 text-center text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <Check className="w-10 h-10 text-emerald-600 mx-auto mb-3 animate-ping" />
              <p className="font-bold text-lg">{isRtl ? "تم فتح تطبيق البريد لديك" : "Your email app should now be open"}</p>
              <p className="text-xs text-slate-500 mt-2">
                {isRtl 
                  ? "اضغط إرسال في تطبيق البريد لإتمام الرسالة. يمكنك أيضاً مراسلتنا مباشرة على البريد الموضح في الأعلى."
                  : "Press send in your email app to complete the message. You can also write to us directly at the address shown above."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRtl ? "الاسم الكامل *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Sara Khaled"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRtl ? "البريد الإلكتروني للإجابة *" : "Email Address *"}
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRtl ? "عنوان وموضوع الرسالة" : "Subject"}
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder={isRtl ? "استفسار بخصوص المولد" : "Inquiry regarding builders"}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRtl ? "مضمون ونص رسالتك *" : "Message text *"}
                </label>
                <textarea
                  rows={5}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder={isRtl ? "اكتب تساؤلك أو مقترحك بالتفصيل هنا..." : "Type your inquiry in details here..."}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="text-left md:text-right pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all w-full md:w-auto cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-200" />
                  <span>{isRtl ? "إرسال عبر البريد" : "Send via email"}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      )}

    </div>
  );
}

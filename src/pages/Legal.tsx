import React, { useState, useEffect } from "react";
import { Mail, Shield, FileSpreadsheet, Info, Check, Send, Sparkles } from "lucide-react";

interface LegalProps {
  pageType: "privacy" | "terms" | "contact" | "about";
  isRtl: boolean;
  onNavigate: (route: string) => void;
}

export default function Legal({ pageType, isRtl, onNavigate }: LegalProps) {
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const titles = {
      privacy: isRtl ? "سياسة الخصوصية والأمان" : "Privacy Policy & Safe Storage",
      terms: isRtl ? "الشروط والضوابط والأحكام" : "Terms & Conditions of Service",
      contact: isRtl ? "اتصل بنا - تواصل مع الدعم" : "Contact Us - Support Channel",
      about: isRtl ? "من نحن - عن منصة السير الذاتية" : "About Us - Resume platform"
    };
    document.title = titles[pageType];
  }, [pageType, isRtl]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert(isRtl ? "يرجى تعبئة كافة الحقول الإلزامية." : "Please fill in all mandatory fields.");
      return;
    }
    setSuccess(true);
    setContactForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSuccess(false), 5000);
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
                {isRtl ? "تاريخ التحديث الأخير: مايو 2026" : "Last updated: May 2026"}
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
              {isRtl ? "2. عدم بيع البيانات للطرف الثالث" : "2. Zero Personnel Selling Guarantee"}
            </h3>
            <p>
              {isRtl 
                ? "نتعهد بأن الموقع لا يبيع، لا يقايض، ولا يشارك المعلومات المدخلة أو ملفات تعريف الارتباط لأي جهة ثالثة أو شركات تجميع البيانات التسويقية كونه موقعًا خدميًا مجانيًا غايته النفع العام."
                : "We pledge that our website never trades, leases, or processes your raw text to any metrics tracking databases or data harvesters."}
            </p>

            <h3 className="text-slate-900 font-extrabold text-base pt-3 border-b border-slate-50 pb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-rose-500 rounded-xs"></span>
              {isRtl ? "3. الإعلانات ومزودي الخدمات الخارجين" : "3. Commercial Advertising and AdSense"}
            </h3>
            <p>
              {isRtl 
                ? "قد نقوم مستقبلاً بإدراج شبكات إعلانية معتمدة من طرف ثالث (مثل Google AdSense) تظهر في الأماكن وبانرات المخصصة مسبقاً في الموقع من أجل كفاية تكلفة استضافات المنصة لتظل مجانية. قد يتضمن هؤلاء الشركاء ملفات تعريف ارتباط (Cookies) عامة فقط لفهم اهتمامات التصفح السطحية."
                : "To keep our workspace free for everyone, we might introduce standard trusted advertising networks (such as Google AdSense) inside the pre-set placeholder bans of our page. These cookies track anonymous interest categories to display high relevance metrics."}
            </p>

            <h3 className="text-slate-900 font-extrabold text-base pt-3 border-b border-slate-50 pb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-rose-500 rounded-xs"></span>
              {isRtl ? "4. تتبع زيارات زوار الموقع" : "4. Site Analytics and Google Crawler"}
            </h3>
            <p>
              {isRtl 
                ? "قد يتم مستقبلاً الاستعانة بأدوات تحليل زيارات الويب العامة (مثل Google Analytics) لمعرفة أعداد زوار المنصة، البلدان الأكثر فاعلية، وصفحات السير والأوصاف الأكثر طلباً لتحسين فاعلية الهيكل وتقديم خيارات برمجية أفضل."
                : "To coordinate infrastructure priorities, we might integrate basic anonymous analytics engines (like Google Analytics) to observe regional traffic spikes, and evaluate page conversion patterns to construct faster capabilities."}
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

          {success ? (
            <div className="p-6 text-center text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <Check className="w-10 h-10 text-emerald-600 mx-auto mb-3 animate-ping" />
              <p className="font-bold text-lg">{isRtl ? "تم إرسال رسالتك بنجاح!" : "Message dispatched successfully!"}</p>
              <p className="text-xs text-slate-500 mt-2">
                {isRtl 
                  ? "شكراً لك لتواصلك معنا. سنقوم بمراجعة طلبك والرد على بريدك الإلكتروني في أقرب مهلة زمنية ممكنا." 
                  : "Thank you for reaching out. Our team will review your message and reply back shortly."}
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
                  <span>{isRtl ? "إرسال الرسالة الإلكترونية" : "Send Mail Message"}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      )}

    </div>
  );
}

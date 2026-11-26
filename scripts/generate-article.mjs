/**
 * Worker المقالات: يكتب مقالاً عربياً (~1000 كلمة) + نسخة إنجليزية، ويضيفه إلى
 * src/data/generatedArticles.json.
 * يعمل مجاناً وبدون أي مفتاح عبر Pollinations.ai (واجهة متوافقة مع OpenAI).
 * يكتب المقال على مراحل: مخطط ← كل قسم على حدة ← نسخة إنجليزية، حتى يصل إلى ~1000 كلمة بجودة أفضل.
 *
 *   node scripts/generate-article.mjs            مقال واحد (جديد أو توسيع مقال قصير)
 *   node scripts/generate-article.mjs --count 2  مقالان
 *
 * يطبع في النهاية سطر:  NEW_URLS=/blog/a,/blog/b   (يستخدمه الـ workflow لإرسالها إلى IndexNow)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "src/data/generatedArticles.json"); // البيانات الوصفية فقط
const CONTENT_DIR = path.join(ROOT, "src/content/articles"); // النص الكامل لكل مقال
const TOPICS_FILE = path.join(ROOT, "scripts/article-topics.json");
const TOPICS = JSON.parse(fs.readFileSync(TOPICS_FILE, "utf8"));
fs.mkdirSync(CONTENT_DIR, { recursive: true });
const ENDPOINT = process.env.LLM_ENDPOINT || "https://text.pollinations.ai/openai";
const MODELS = (process.env.LLM_MODELS || "openai").split(",");
const MIN_WORDS = 850;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const countArg = process.argv.indexOf("--count");
const COUNT = countArg > -1 ? Number(process.argv[countArg + 1]) || 1 : 1;

const generated = JSON.parse(fs.readFileSync(OUT, "utf8"));
const done = new Set(generated.map((a) => a.slug));
// كل الـ slugs الموجودة في الموقع (القديمة + المولّدة + قائمة المواضيع) حتى لا يتكرر أي موضوع
const allKnownSlugs = () =>
  new Set([...done, ...TOPICS.new.map((t) => t.slug), ...TOPICS.expand, ...[...baseSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1])]);
const words = (s) => String(s).split(/\s+/).filter(Boolean).length;

// بيانات المقالات القديمة (لتوسيعها بدل كتابة موضوع مختلف)
const baseSrc = fs.readFileSync(path.join(ROOT, "src/data/blogData.ts"), "utf8");
function baseArticle(slug) {
  const i = baseSrc.indexOf(`slug: "${slug}"`);
  if (i < 0) return null;
  const chunk = baseSrc.slice(Math.max(0, baseSrc.lastIndexOf("{", i) - 10), baseSrc.indexOf("contentEn", i));
  return {
    slug,
    title: chunk.match(/title:\s*"([^"]+)"/)?.[1],
    category: chunk.match(/category:\s*"([^"]+)"/)?.[1],
    categoryEn: chunk.match(/categoryEn:\s*"([^"]+)"/)?.[1],
  };
}

const slugify = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

/** عندما تقترب قائمة المواضيع من النهاية: يقترح الذكاء الاصطناعي مواضيع جديدة غير مكررة ويضيفها للقائمة. */
async function refillTopics() {
  const remaining = TOPICS.new.filter((t) => !done.has(t.slug)).length;
  if (remaining >= 5) return;
  const known = allKnownSlugs();
  const recent = [...known].slice(-250).join(", ");
  const res = await chat([
    { role: "system", content: "You are an SEO content strategist for an Arabic careers & CV website. Return JSON only." },
    {
      role: "user",
      content: `Suggest 20 NEW article topics people in the Arab world search on Google about: CV/resume writing for specific jobs, job interviews, job hunting in specific Arab or foreign countries, cover letters, careers, workplace skills, salaries, remote work, freelancing.
Each topic must be clearly different from these existing article slugs: ${recent}
Return JSON: {"topics": [{"slug": "short-english-kebab-case-slug", "keyword": "عنوان الموضوع بالعربية كما يبحث عنه الناس"}]}`,
    },
  ]);
  let added = 0;
  for (const t of res.topics || []) {
    const slug = slugify(t.slug);
    if (!slug || known.has(slug) || !t.keyword) continue;
    TOPICS.new.push({ slug, keyword: String(t.keyword).trim() });
    known.add(slug);
    added++;
  }
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(TOPICS, null, 2) + "\n");
  console.log(`🧠 أُضيف ${added} موضوع جديد إلى القائمة`);
}

function nextTask() {
  const expand = TOPICS.expand.filter((s) => !done.has(s));
  const fresh = TOPICS.new.filter((t) => !done.has(t.slug));
  const expandedSoFar = TOPICS.expand.length - expand.length;
  const newSoFar = TOPICS.new.length - fresh.length;
  // بالتناوب: توسيع مقال قصير ثم موضوع جديد
  if (expand.length && (expandedSoFar <= newSoFar || !fresh.length)) {
    const b = baseArticle(expand[0]);
    if (b?.title) return { kind: "expand", slug: b.slug, keyword: b.title, base: b };
    done.add(expand[0]);
    return nextTask();
  }
  if (fresh.length) return { kind: "new", slug: fresh[0].slug, keyword: fresh[0].keyword };
  return null;
}

async function chat(messages, maxTokens = 2500) {
  let lastErr;
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        await sleep(3000); // احترام حدود الاستخدام المجاني
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ model, messages, max_tokens: maxTokens, response_format: { type: "json_object" } }),
        });
        const text = await res.text();
        if (!res.ok) throw new Error(`${model} HTTP ${res.status}: ${text.slice(0, 200)}`);
        const content = JSON.parse(text).choices?.[0]?.message?.content || "";
        return JSON.parse(content.slice(content.indexOf("{"), content.lastIndexOf("}") + 1));
      } catch (e) {
        lastErr = e;
        console.warn(`  ⚠ ${String(e.message).slice(0, 160)}`);
        await sleep(8000 * attempt);
      }
    }
  }
  throw lastErr;
}

/** تنظيف نص القسم: إزالة \n الحرفية والعناوين المكررة والأسطر الفارغة الزائدة. */
const clean = (t = "") =>
  String(t)
    .replace(/\\n/g, "\n")
    .replace(/^#{1,4}\s+.*$/gm, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const SYS_AR =
  "أنت كاتب محتوى عربي محترف ومحرر لغوي، متخصص في التوظيف والسير الذاتية وخبير SEO. تكتب بعربية فصحى سليمة وواضحة، بجمل قصيرة وأمثلة واقعية من سوق العمل العربي والخليجي. لا تخترع إحصاءات أو أسماء دراسات. تعيد JSON فقط.";

async function writeArabic(task) {
  const askOutline = () => chat([
    { role: "system", content: SYS_AR },
    {
      role: "user",
      content: `${task.kind === "expand" ? "خطط لدليل شامل يعيد كتابة ويوسّع مقالاً بعنوان" : "خطط لمقال شامل عن"}: "${task.keyword}".
أعد JSON:
{"title": "عنوان جذاب 50-65 حرفاً يحتوي الكلمة المفتاحية",
 "summary": "وصف ميتا 140-160 حرفاً",
 "category": "تصنيف قصير",
 "intro": "مقدمة 80-100 كلمة تذكر الكلمة المفتاحية في أول جملة",
 "sections": [{"heading": "عنوان فرعي", "points": ["نقطة يجب تغطيتها"]}],
 "faq": [{"q": "سؤال؟", "a": "جواب 30-40 كلمة"}]}
عدد الأقسام 7 (العناوين بدون ترقيم)، وعدد الأسئلة 4. لا تذكر كلمة SEO أو "الكلمة المفتاحية" في النص الموجّه للقارئ.`,
    },
  ]);
  // أداة الكتابة المجانية تعيد أحياناً مخططاً ناقصاً: نطلبه من جديد قبل أن نتخلى عن المقال.
  let outline = {}, sections = [];
  for (let tries = 1; tries <= 5 && sections.length < 5; tries++) {
    outline = (await askOutline()) || {};
    sections = (Array.isArray(outline.sections) ? outline.sections : []).filter((x) => x && x.heading).slice(0, 8);
    if (sections.length < 5) console.warn(`  ⚠ مخطط ناقص (${sections.length} أقسام، الحقول: ${Object.keys(outline).join(",")}) — محاولة ${tries}`);
  }
  if (sections.length < 5) throw new Error("مخطط ناقص");
  const parts = [clean(outline.intro)];
  for (const sec of sections) {
    const body = await chat([
      { role: "system", content: SYS_AR },
      {
        role: "user",
        content: `ضمن مقال بعنوان "${outline.title}"، اكتب محتوى القسم: "${sec.heading}".
غطِّ هذه النقاط: ${(sec.points || []).join("، ")}.
الطول 140-170 كلمة: فقرة أو فقرتان، ويمكن إضافة قائمة قصيرة كل عنصر فيها في سطر يبدأ بـ "- ". استخدم **غامق** لكلمة أو كلمتين مهمتين فقط. لا تكتب العنوان.
أعد JSON: {"text": "..."}`,
      },
    ]);
    parts.push(`## ${String(sec.heading).replace(/^#+\s*/, "").trim()}\n\n${clean(body.text)}`);
  }
  const faq = (outline.faq || []).map((f) => `- **${String(f.q).trim()}** ${String(f.a).trim()}`).join("\n");
  if (faq) parts.push(`## أسئلة شائعة\n\n${faq}`);
  return { title: outline.title, summary: outline.summary, category: outline.category, sections, content: parts.join("\n\n") };
}

async function writeEnglish(ar) {
  const sys = "You are a professional career-content writer and SEO editor writing clear, natural English. Return JSON only.";
  const head = await chat([
    { role: "system", content: sys },
    {
      role: "user",
      content: `Adapt this Arabic article metadata for an English audience.
Title: ${ar.title}
Summary: ${ar.summary}
Category: ${ar.category}
Section headings: ${ar.sections.map((x) => x.heading).join(" | ")}
Return JSON: {"titleEn": "...", "summaryEn": "140-160 chars", "categoryEn": "...", "intro": "70-90 word intro", "headings": ["English heading for each section, same order"]}`,
    },
  ]);
  const blocks = ar.content.split(/\n(?=## )/).slice(1, 1 + ar.sections.length);
  const parts = [clean(head.intro)];
  for (let i = 0; i < blocks.length; i++) {
    const body = await chat([
      { role: "system", content: sys },
      {
        role: "user",
        content: `Write the English version (natural, not literal, 90-120 words) of this article section. Use "- " for list items if helpful. Do not write the heading.\n\n${blocks[i]}\n\nReturn JSON: {"text": "..."}`,
      },
    ]);
    parts.push(`## ${String((head.headings || [])[i] || "Section " + (i + 1)).replace(/^d+s*[.)-–:]s*/, "")}\n\n${clean(body.text)}`);
  }
  return { titleEn: head.titleEn, summaryEn: head.summaryEn, categoryEn: head.categoryEn, contentEn: parts.join("\n\n") };
}

const today = new Date().toISOString().slice(0, 10);
const newUrls = [];

for (let i = 0; i < COUNT; i++) {
  try {
    await refillTopics();
  } catch (e) {
    console.warn("تعذّر اقتراح مواضيع جديدة الآن:", String(e.message).slice(0, 120));
  }
  const task = nextTask();
  if (!task) {
    console.log("لا توجد مواضيع متبقية في scripts/article-topics.json — أضف مواضيع جديدة.");
    break;
  }
  console.log(`✍️  ${task.kind === "expand" ? "توسيع" : "جديد"}: ${task.slug}`);

  let ar;
  for (let tries = 1; tries <= 2; tries++) {
    ar = await writeArabic(task);
    const w = words(ar.content);
    console.log(`   العربي: ${w} كلمة`);
    if (w >= MIN_WORDS) break;
    if (tries === 2) throw new Error(`المقال قصير جداً (${w} كلمة) — لم يُحفظ.`);
  }
  const en = await writeEnglish(ar);
  console.log(`   الإنجليزي: ${words(en.contentEn)} كلمة`);

  const w = words(ar.content);
  const meta = {
    id: `g-${task.slug}`,
    slug: task.slug,
    title: String(ar.title).trim(),
    titleEn: String(en.titleEn || ar.title).trim(),
    summary: String(ar.summary).trim(),
    summaryEn: String(en.summaryEn || "").trim(),
    category: task.base?.category || ar.category || "نصائح مهنية",
    categoryEn: task.base?.categoryEn || en.categoryEn || "Career Tips",
    readTime: `${Math.max(4, Math.round(w / 200))} دقائق`,
    date: today,
    hasEn: words(en.contentEn || "") >= 120,
  };
  const body = { content: ar.content.trim(), contentEn: String(en.contentEn || "").trim() };
  fs.writeFileSync(path.join(CONTENT_DIR, `${task.slug}.json`), JSON.stringify(body, null, 2) + "\n");
  const article = { ...meta, ...body };
  generated.push(meta);
  done.add(task.slug);
  newUrls.push(`/blog/${task.slug}`);
  fs.writeFileSync(OUT, JSON.stringify(generated, null, 2) + "\n");
  console.log(`   ✅ حُفظ: ${article.title}`);
}

console.log(`NEW_URLS=${newUrls.join(",")}`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `new_urls=${newUrls.join(" ")}\n`);

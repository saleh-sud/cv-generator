/**
 * Worker المقالات: يكتب مقالاً عربياً (~1000 كلمة) + نسخة إنجليزية، ويضيفه إلى
 * src/data/generatedArticles.json. يعمل مجاناً عبر GitHub Models (GITHUB_TOKEN داخل GitHub Actions).
 *
 *   node scripts/generate-article.mjs            مقال واحد (جديد أو توسيع مقال قصير)
 *   node scripts/generate-article.mjs --count 2  مقالان
 *
 * يطبع في النهاية سطر:  NEW_URLS=/blog/a,/blog/b   (يستخدمه الـ workflow لإرسالها إلى IndexNow)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "src/data/generatedArticles.json");
const TOPICS = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/article-topics.json"), "utf8"));
const TOKEN = process.env.GITHUB_TOKEN || process.env.MODELS_TOKEN;
const ENDPOINT = "https://models.github.ai/inference/chat/completions";
const MODELS = (process.env.ARTICLE_MODELS || "openai/gpt-4.1,openai/gpt-4o,openai/gpt-4.1-mini").split(",");
const MIN_WORDS = 750;

if (!TOKEN) {
  console.error("GITHUB_TOKEN غير موجود (يعمل تلقائياً داخل GitHub Actions مع permissions: models: read).");
  process.exit(1);
}

const countArg = process.argv.indexOf("--count");
const COUNT = countArg > -1 ? Number(process.argv[countArg + 1]) || 1 : 1;

const generated = JSON.parse(fs.readFileSync(OUT, "utf8"));
const done = new Set(generated.map((a) => a.slug));
const words = (s) => s.split(/\s+/).filter(Boolean).length;

// نصوص المقالات القديمة (لتوسيعها بدل كتابة موضوع مختلف)
const baseSrc = fs.readFileSync(path.join(ROOT, "src/data/blogData.ts"), "utf8");
function baseArticle(slug) {
  const i = baseSrc.indexOf(`slug: "${slug}"`);
  if (i < 0) return null;
  const chunk = baseSrc.slice(Math.max(0, baseSrc.lastIndexOf("{", i) - 10), baseSrc.indexOf("contentEn", i));
  const title = chunk.match(/title:\s*"([^"]+)"/)?.[1];
  const date = chunk.match(/date:\s*"([^"]+)"/)?.[1];
  const category = chunk.match(/category:\s*"([^"]+)"/)?.[1];
  const categoryEn = chunk.match(/categoryEn:\s*"([^"]+)"/)?.[1];
  return { slug, title, date, category, categoryEn };
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

async function chat(messages, maxTokens) {
  let lastErr;
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: maxTokens, response_format: { type: "json_object" } }),
        });
        const text = await res.text();
        if (!res.ok) throw new Error(`${model} HTTP ${res.status}: ${text.slice(0, 300)}`);
        const content = JSON.parse(text).choices?.[0]?.message?.content || "";
        return { model, data: JSON.parse(content.replace(/^```json\s*|\s*```$/g, "")) };
      } catch (e) {
        lastErr = e;
        console.warn(`  ⚠ ${String(e.message).slice(0, 200)}`);
        await new Promise((r) => setTimeout(r, 4000 * attempt));
      }
    }
  }
  throw lastErr;
}

const FORMAT_RULES = `
قواعد التنسيق داخل حقل content (نص عادي، ليس HTML):
- كل عنوان فرعي في سطر مستقل يبدأ بـ "## " (من 6 إلى 9 عناوين فرعية).
- القوائم: كل عنصر في سطر يبدأ بـ "- ".
- استخدم **نص** للكلمات المهمة فقط.
- افصل بين الفقرات بسطر فارغ.
- اختم بقسم "## أسئلة شائعة" فيه 4 أسئلة، كل سؤال كعنوان سطر يبدأ بـ "- **السؤال؟**" يليه الجواب في نفس السطر.
- لا تذكر روابط، ولا تخترع إحصاءات بأرقام دقيقة أو أسماء دراسات غير حقيقية.`;

async function writeArabic(task) {
  const sys = `أنت كاتب محتوى عربي محترف متخصص في التوظيف والسير الذاتية وخبير SEO. تكتب بالعربية الفصحى المبسطة، بأسلوب عملي مفيد وأمثلة واقعية من سوق العمل العربي والخليجي. تعيد JSON فقط.`;
  const user = `${task.kind === "expand" ? `أعد كتابة وتوسيع مقال بعنوان: "${task.keyword}" ليصبح دليلاً شاملاً.` : `اكتب مقالاً شاملاً عن: "${task.keyword}".`}
الطول: بين 1000 و1200 كلمة في حقل content.
الكلمة المفتاحية الرئيسية يجب أن تظهر في العنوان وفي أول فقرة وفي عنوانين فرعيين على الأقل بشكل طبيعي.
${FORMAT_RULES}
أعد JSON بالمفاتيح:
{"title": "عنوان جذاب 50-65 حرفاً يحتوي الكلمة المفتاحية", "summary": "وصف ميتا 140-160 حرفاً", "category": "تصنيف قصير", "content": "..."}`;
  const { model, data } = await chat([{ role: "system", content: sys }, { role: "user", content: user }], 4000);
  return { model, ...data };
}

async function writeEnglish(ar) {
  const sys = "You are a professional career-content writer and SEO editor. Return JSON only.";
  const user = `Write an English version (natural, not literal) of this Arabic career article for an international audience.
Length: 600-800 words in "contentEn". Same structure: subheadings on their own line starting with "## ", list items starting with "- ", end with "## FAQ".
Return JSON: {"titleEn": "...", "summaryEn": "140-160 chars", "categoryEn": "short category", "contentEn": "..."}

Arabic title: ${ar.title}
Arabic article:
${ar.content.slice(0, 9000)}`;
  const { data } = await chat([{ role: "system", content: sys }, { role: "user", content: user }], 3000);
  return data;
}

const today = new Date().toISOString().slice(0, 10);
const newUrls = [];

for (let i = 0; i < COUNT; i++) {
  const task = nextTask();
  if (!task) {
    console.log("لا توجد مواضيع متبقية في scripts/article-topics.json — أضف مواضيع جديدة.");
    break;
  }
  console.log(`✍️  ${task.kind === "expand" ? "توسيع" : "جديد"}: ${task.slug}`);

  let ar;
  for (let tries = 1; tries <= 2; tries++) {
    ar = await writeArabic(task);
    const w = words(ar.content || "");
    console.log(`   ${ar.model}: ${w} كلمة`);
    if (w >= MIN_WORDS) break;
    if (tries === 2) throw new Error(`المقال قصير جداً (${w} كلمة) — لم يُحفظ.`);
  }
  const en = await writeEnglish(ar);

  const w = words(ar.content);
  const article = {
    id: `g-${task.slug}`,
    slug: task.slug,
    title: ar.title.trim(),
    titleEn: (en.titleEn || ar.title).trim(),
    summary: ar.summary.trim(),
    summaryEn: (en.summaryEn || "").trim(),
    category: task.base?.category || ar.category || "نصائح مهنية",
    categoryEn: task.base?.categoryEn || en.categoryEn || "Career Tips",
    readTime: `${Math.max(4, Math.round(w / 200))} دقائق`,
    date: today,
    content: ar.content.trim(),
    contentEn: (en.contentEn || "").trim(),
  };
  generated.push(article);
  done.add(task.slug);
  newUrls.push(`/blog/${task.slug}`);
  fs.writeFileSync(OUT, JSON.stringify(generated, null, 2) + "\n");
  console.log(`   ✅ حُفظ: ${article.title}`);
}

console.log(`NEW_URLS=${newUrls.join(",")}`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `new_urls=${newUrls.join(" ")}\n`);

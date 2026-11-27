import { createWorkBuddyCloud } from '@tencent-ai/workbuddy-cloud-sdk';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { notifyPublished } from './notify.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const PLAN_PATH = join(REPO_ROOT, '.github', 'blog-plan.json');
const CONTENT_DIR = join(REPO_ROOT, 'src', 'content');

const publicConfig = {
  endpoint: 'https://blog-updater.app.workbuddy.host',
  publishableKey: 'wbpk_pTqA4XiFLJTJE8D5jdQvLx_Q3bP3w1S1dU86sBMU15jeZoR7XiQ9F68',
};

const cloud = createWorkBuddyCloud({
  endpoint: publicConfig.endpoint,
  publishableKey: publicConfig.publishableKey,
});

const log = (...args) => console.log('[blog-bot]', ...args);
const fail = (msg) => { console.error('[blog-bot] FATAL:', msg); process.exit(1); };

// ---------- date helpers (Asia/Shanghai) ----------
function todayShanghai() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date());
}
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

// ---------- LLM ----------
async function pickModel(settings) {
  const models = await cloud.llm.models.list();
  const selectable = models.filter((m) => m.disabled !== true).map((m) => m.id);
  if (selectable.includes(settings.model)) return settings.model;
  if (selectable.includes(settings.fallbackModel)) return settings.fallbackModel;
  return selectable[0] ?? fail('No selectable LLM model available');
}

async function chatOnce(model, system, user) {
  let answer = '';
  for await (const chunk of cloud.llm.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    stream: true,
    temperature: 0.8,
  })) {
    if (chunk.choices?.[0]?.delta?.content) answer += chunk.choices[0].delta.content;
  }
  return answer.trim();
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('no JSON object found in model output');
  return JSON.parse(raw.slice(start, end + 1));
}

const STYLE_RULES = `
写作硬约束：
- 第一人称叙述，围绕一件具体的事写，交代真实代价，允许误判。开头形式必须多样：禁止用"某年某月某日几点，我坐在书桌/电脑前"这类时间加地点的固定句式开场；可从一句对话、一个物件、一处异常、一个决定或一个具体问题切入。不同文章不得复用同一套开头，正文也不要写精确到年月日和钟点的开场时间。
  First-person narration around one concrete incident with a real cost. Vary the opening: never use a fixed "time + I sat at my desk" pattern. Open with dialogue, an object, an anomaly, a decision, or a question. Do not reuse the same opening across posts, and do not open with an exact date and clock time.
- 不得编造作者的个人生活事实。作者真实情况：在淄博生活，骑摩托车通勤，不吃外卖，不坐地铁。涉及生活细节时必须与此一致，或写通用经验不点明具体事实。
  Do not invent the author's personal life facts. Known facts: lives in Zibo, commutes by motorcycle, never eats takeout, does not use the subway. Keep details consistent or stay general.
- 禁止列要点清单，禁止"首先/其次/最后"式结构，禁止"综上所述"式总结升华。
- 标题含搜索词（问题现象 + 方法/结论），不要文学化短句。
- description 是搜索结果第二行，要带关键词。
- 篇幅 600 至 900 字。
- 正文小标题一律用两个井号开头（## ），绝对不要出现只有一个井号的行。
- 不写具体公司名、客户名、品牌名、产品名或内部业务数字；举例只到经营范围为止。
- 像人说话，不要 AI 腔：不用"在当今时代""随着...的发展""值得注意的是""不仅...更是..."这类句式。
`;

const zhSystem = `你是外贸从业者的个人博客作者，站点定位：外贸、建站运营、英文学习、生活分析。${STYLE_RULES}
输出要求：只输出一个 JSON 对象（可以包在 \`\`\`json 代码块里），字段：
- "slug": 英文 URL slug，3 至 6 个小写英文单词、连字符连接、含文章关键词，例如 "english-learning-plateau-b1-b2"。必须是纯小写字母数字和连字符。
- "title": 中文标题（如需冒号用全角冒号"："，不要半角冒号加空格）
- "description": 中文描述（用半角双引号包裹的内容里不能再出现未转义双引号）
- "body": 中文正文（markdown，可用 ## 小标题，但不要一级标题，不要以标题开头）
JSON 字符串内的换行写成 \\n，保证 JSON 合法可解析。`;

const enSystem = `You are the English-language author of a foreign-trade practitioner's personal blog covering international trade, website building and operations, English learning, and life analysis.${STYLE_RULES}
Use American spelling. Write number ranges like "7 to 10". Never use em dashes or en dashes anywhere.
Output requirements: output ONLY one JSON object (may be wrapped in a \`\`\`json code block) with fields:
- "title": the English title (avoid colons followed by spaces; use a colon without space if needed, or restructure)
- "description": the English meta description (no unescaped double quotes inside)
- "body": the English article body (markdown, ## subheadings allowed; never start any line with a single # heading, and never start the body with the title)
Write newlines inside JSON strings as \\n so the JSON is valid and parseable.`;

function validateArticle(a, { lang, category, pubDate }) {
  const errs = [];
  const title = (a.title ?? '').trim();
  const desc = (a.description ?? '').trim();
  const body = (a.body ?? '').trim();
  if (!title || title.length < 8) errs.push('title missing or too short');
  if (!desc || desc.length < 15) errs.push('description missing or too short');
  if (body.length < (lang === 'zh' ? 550 : 2200)) errs.push(`body too short (${body.length})`);
  if (lang === 'en' && /[—–]/.test(title + desc + body)) errs.push('em/en dash found in English text');
  // h1 = line starting with "# " (not "## ")
  if (/^# /m.test(body)) errs.push('h1 heading found in body');
  if (lang === 'zh' && !/^[a-z0-9]+(-[a-z0-9]+){2,5}$/.test((a.slug ?? '').trim())) {
    errs.push('invalid slug: must be 3-6 lowercase english words joined by hyphens');
  }
  return { errs, title, desc, body, slug: (a.slug ?? '').trim() };
}

function buildFrontmatter({ title, description, pubDate, category, lang }) {
  const quotedTitle = lang === 'zh' ? title : `"${title.replace(/"/g, '\\"')}"`;
  const quotedDesc = `"${description.replace(/"/g, '\\"')}"`;
  return `---
title: ${quotedTitle}
description: ${quotedDesc}
pubDate: ${pubDate}
updatedDate:
tags: [${lang === 'zh' ? '外贸手记' : 'foreign-trade-notes'}]
category: ${category}
draft: false
---`;
}

function uniqueSlug(slug, lang) {
  let s = (slug ?? '').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!s || s.length < 5) s = 'blog-post';
  let candidate = s;
  let i = 2;
  while (existsSync(join(CONTENT_DIR, lang, 'blog', `${candidate}.md`))) {
    candidate = `${s}-${i}`;
    i += 1;
  }
  return candidate;
}

async function generateArticle(model, { topic, category, pubDate, lang, slug }) {
  const attempt = async (extraError) => {
    if (lang === 'zh') {
      const user = `选题：${topic}\n板块（category 字段值）：${category}\n发布日期：${pubDate}\n请按系统规则写这篇中文文章。${extraError ? `\n注意，上次输出有以下问题，必须修正：${extraError}` : ''}`;
      const raw = await chatOnce(model, zhSystem, user);
      const parsed = extractJson(raw);
      const check = validateArticle(parsed, { lang, category, pubDate });
      if (check.errs.length) throw new Error(check.errs.join('; '));
      return check;
    }
    const user = `Topic (as previously decided for the Chinese version): ${topic}\nCategory (frontmatter category value): ${category}\nPublish date: ${pubDate}\nUse this exact URL slug (do not change it, the Chinese version already uses it): ${slug}\nWrite the English article as its own piece, not a word-for-word translation of a Chinese draft. ${extraError ? `\nImportant, fix these problems from the previous output: ${extraError}` : ''}`;
    const raw = await chatOnce(model, enSystem, user);
    const parsed = extractJson(raw);
    const check = validateArticle(parsed, { lang, category, pubDate });
    if (check.errs.length) throw new Error(check.errs.join('; '));
    return check;
  };

  try {
    return await attempt('');
  } catch (e1) {
    log(`${lang} first attempt failed: ${e1.message}; retrying once`);
    return await attempt(e1.message);
  }
}

// ---------- main ----------
async function main() {
  const plan = JSON.parse(readFileSync(PLAN_PATH, 'utf8'));
  const settings = plan.settings;
  const today = todayShanghai();
  const force = process.env.FORCE_PUBLISH === '1';
  log('today =', today, 'lastPublishDate =', plan.lastPublishDate, 'force =', force);

  const gap = daysBetween(plan.lastPublishDate, today);
  if (!force) {
    if (gap <= 0) { log('Already published today or date not advanced; skipping.'); return; }
    if (gap === 1 && Math.random() >= (settings.singleGapPublishProbability ?? 0.5)) {
      log('Random skip on 1-day gap; publishing next trigger.');
      return;
    }
  }

  const pending = plan.topics.filter((t) => t.status === 'pending');
  if (pending.length === 0) fail('No pending topics left; refill the plan.');

  // Category balance: any category idle more than N days jumps the queue.
  let target = pending[0];
  for (const [category, lastDate] of Object.entries(plan.lastPublishedByCategory)) {
    const idleDays = lastDate ? daysBetween(lastDate, today) : Infinity;
    if (idleDays > (settings.maxCategoryIdleDays ?? 7)) {
      const rescue = pending.find((t) => t.category === category);
      if (rescue) { target = rescue; log(`Category ${category} idle ${idleDays} days; jumping queue.`); }
      break;
    }
  }
  log('target topic:', target.id, target.category, target.topic);

  const model = await pickModel(settings);
  log('using model:', model);

  const zh = await generateArticle(model, { topic: target.topic, category: target.category, pubDate: today, lang: 'zh' });
  const finalSlug = uniqueSlug(zh.slugInput ?? zh.slug ?? '', 'zh');
  log('slug:', finalSlug, '| zh title:', zh.title);

  const en = await generateArticle(model, { topic: target.topic, category: target.category, pubDate: today, lang: 'en', slug: finalSlug });

  const zhPath = join(CONTENT_DIR, 'zh', 'blog', `${finalSlug}.md`);
  const enPath = join(CONTENT_DIR, 'en', 'blog', `${finalSlug}.md`);
  writeFileSync(zhPath, `${buildFrontmatter({ title: zh.title, description: zh.desc, pubDate: today, category: target.category, lang: 'zh' })}\n\n${zh.body}\n`, 'utf8');
  writeFileSync(enPath, `${buildFrontmatter({ title: en.title, description: en.desc, pubDate: today, category: target.category, lang: 'en' })}\n\n${en.body}\n`, 'utf8');

  // Update plan
  target.status = 'published';
  target.publishedDate = today;
  target.slug = finalSlug;
  plan.lastPublishDate = today;
  plan.lastPublishedByCategory[target.category] = today;
  writeFileSync(PLAN_PATH, JSON.stringify(plan, null, 2) + '\n', 'utf8');

  // Commit & push
  execSync('git add -- "' + zhPath + '" "' + enPath + '" "' + PLAN_PATH + '"', { cwd: REPO_ROOT, stdio: 'inherit' });
  const staged = execSync('git diff --cached --name-only', { cwd: REPO_ROOT, encoding: 'utf8' }).trim().split('\n');
  log('staged files:', staged.join(', '));
  if (staged.length !== 3) fail(`Expected exactly 3 staged files, got ${staged.length}`);
  execSync(`git commit -m "Add bilingual post: ${finalSlug}"`, { cwd: REPO_ROOT, stdio: 'inherit' });

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    execSync(`git push https://x-access-token:${token}@github.com/3555172179/blog.git main`, { cwd: REPO_ROOT, stdio: 'inherit' });
  } else {
    execSync('git push origin main', { cwd: REPO_ROOT, stdio: 'inherit' });
  }
  log('PUSHED. Published', finalSlug, `(${target.category}) on ${today}`);

  // WeChat notification is best-effort and never fails the publish.
  await notifyPublished({
    zhTitle: zh.title,
    enTitle: en.title,
    slug: finalSlug,
    category: target.category,
    date: today,
  });
}

main().catch((e) => fail(e?.error?.code ? `${e.error.code}: ${e.message}` : (e.stack ?? e.message)));

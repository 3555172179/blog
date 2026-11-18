// WeChat notification via Server酱 (sct.ftqq.com) and/or PushPlus (pushplus.plus).
// Both are optional and read from env: SERVERCHAN_SENDKEY / PUSHPLUS_TOKEN.
// Notification is best-effort: it must never fail an already-successful publish.

const SITE_URL = 'https://blog.svvvv.vip';
const log = (...args) => console.log('[blog-bot]', ...args);
const mask = (value, secret) => (secret ? String(value ?? '').split(secret).join('***') : String(value ?? ''));

async function postForm(url, params) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });
  return await res.json();
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function sendServerchan(key, title, desp) {
  let url;
  if (key.startsWith('sctp')) {
    const m = key.match(/^sctp(\d+)t/);
    if (!m) throw new Error('invalid sctp SendKey format');
    url = `https://${m[1]}.push.ft07.com/send/${key}.send`;
  } else {
    url = `https://sctapi.ftqq.com/${key}.send`;
  }
  const r = await postForm(url, { title, desp });
  // Business code lives in the body, not the HTTP status.
  if (String(r.code) !== '0') throw new Error(`Server酱 code=${r.code} message=${r.message ?? ''}`);
  return 'Server酱';
}

async function sendPushplus(token, title, content) {
  const r = await postJson('https://www.pushplus.plus/send', {
    token,
    title,
    content,
    template: 'markdown',
  });
  if (r.code !== 200) throw new Error(`PushPlus code=${r.code} msg=${r.msg ?? ''}`);
  return 'PushPlus';
}

/**
 * @param {{ zhTitle: string, enTitle: string, slug: string, category: string, date: string }} article
 */
export async function notifyPublished({ zhTitle, enTitle, slug, category, date }) {
  const scKey = process.env.SERVERCHAN_SENDKEY?.trim();
  const ppToken = process.env.PUSHPLUS_TOKEN?.trim();
  if (!scKey && !ppToken) {
    log('No WeChat channel configured (SERVERCHAN_SENDKEY / PUSHPLUS_TOKEN); skipping notification.');
    return;
  }

  const title = `博客已发布：${zhTitle}`;
  const desp = [
    `**${zhTitle}**`,
    '',
    `英文标题：${enTitle}`,
    '',
    `板块：${category}　发布日期：${date}`,
    '',
    `中文：${SITE_URL}/blog/${slug}/`,
    '',
    `英文：${SITE_URL}/en/blog/${slug}/`,
  ].join('\n');

  const channels = [];
  if (scKey) channels.push(() => sendServerchan(scKey, title, desp));
  if (ppToken) channels.push(() => sendPushplus(ppToken, title, desp));

  for (const send of channels) {
    try {
      const name = await send();
      log(`Notified via ${name}.`);
    } catch (e) {
      // Keep secrets out of logs even if fetch errors echo the URL/body.
      const safe = mask(mask(e?.message ?? e, scKey), ppToken);
      console.warn('[blog-bot] notification failed (publish unaffected):', safe);
    }
  }
}

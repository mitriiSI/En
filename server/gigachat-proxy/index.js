/* Прокси для кнопки «✨ ИИ» на сайте «Митя».
   Ключ GigaChat хранится ТОЛЬКО в переменной окружения GIGACHAT_KEY этой функции и никогда не попадает на сайт.
   Рассчитано на Yandex Cloud Functions (Node.js 18+), точка входа: index.handler.

   Переменные окружения:
     GIGACHAT_KEY      — «Ключ авторизации» из личного кабинета developers.sber.ru (обязательно)
     GIGACHAT_SCOPE    — GIGACHAT_API_PERS (по умолчанию, для физлиц)
     GIGACHAT_MODEL    — GigaChat (по умолчанию), можно GigaChat-Pro / GigaChat-Max
     ALLOWED_ORIGINS   — откуда разрешены запросы, по умолчанию https://mitriisi.github.io
     GIGACHAT_CA       — текст корневого сертификата Минцифры (PEM), если среда ему не доверяет
     GIGACHAT_SKIP_TLS — 1, чтобы не проверять сертификат (менее безопасно, только если нет GIGACHAT_CA) */
'use strict';
const https = require('https');
const tls = require('tls');
const crypto = require('crypto');

const KEY = process.env.GIGACHAT_KEY || '';
const SCOPE = process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS';
const MODEL = process.env.GIGACHAT_MODEL || 'GigaChat';
const ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://mitriisi.github.io').split(',').map(s => s.trim()).filter(Boolean);
const agent = new https.Agent({
  keepAlive: true,
  ca: process.env.GIGACHAT_CA ? tls.rootCertificates.concat([process.env.GIGACHAT_CA.replace(/\\n/g, '\n')]) : undefined,
  rejectUnauthorized: process.env.GIGACHAT_SKIP_TLS !== '1'
});

function request(url, opts, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, Object.assign({ agent, timeout: 60000 }, opts), res => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

let token = null, tokenExp = 0;
async function getToken() {
  if (token && Date.now() < tokenExp - 60000) return token;
  const r = await request('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + KEY, 'RqUID': crypto.randomUUID(), 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }
  }, 'scope=' + encodeURIComponent(SCOPE));
  if (r.status !== 200) throw new Error('oauth ' + r.status + ': ' + r.body.slice(0, 200));
  const j = JSON.parse(r.body);
  token = j.access_token; tokenExp = j.expires_at || (Date.now() + 25 * 60000);
  return token;
}

async function chat(messages, retry) {
  const t = await getToken();
  const r = await request('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json', 'Accept': 'application/json' }
  }, JSON.stringify({ model: MODEL, messages, temperature: 0.3, max_tokens: 1400 }));
  if (r.status === 401 && !retry) { token = null; return chat(messages, true); }
  if (r.status !== 200) throw new Error('chat ' + r.status + ': ' + r.body.slice(0, 200));
  const j = JSON.parse(r.body);
  return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
}

function cors(origin) {
  const ok = ORIGINS.includes('*') || ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin || ORIGINS[0] : ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
function reply(status, obj, origin) {
  return { statusCode: status, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, cors(origin)), body: JSON.stringify(obj) };
}

/* проверка входящего запроса: только диалог разумного размера, без лишних полей */
function clean(body) {
  const msgs = Array.isArray(body && body.messages) ? body.messages : null;
  if (!msgs || !msgs.length || msgs.length > 16) return null;
  let total = 0;
  const out = [];
  for (const m of msgs) {
    if (!m || !['system', 'user', 'assistant'].includes(m.role) || typeof m.content !== 'string') return null;
    total += m.content.length;
    out.push({ role: m.role, content: m.content });
  }
  if (total > 30000) return null;
  return out;
}

module.exports.handler = async function (event) {
  const headers = event.headers || {};
  const origin = headers.Origin || headers.origin || '';
  const method = (event.httpMethod || 'POST').toUpperCase();
  if (method === 'OPTIONS') return { statusCode: 204, headers: cors(origin), body: '' };
  if (method === 'GET') return reply(200, { ok: true, model: MODEL, key: !!KEY }, origin);
  if (method !== 'POST') return reply(405, { error: 'Только POST' }, origin);
  if (ORIGINS.length && !ORIGINS.includes('*') && origin && !ORIGINS.includes(origin)) return reply(403, { error: 'Чужой сайт' }, origin);
  if (!KEY) return reply(500, { error: 'В функции не задан GIGACHAT_KEY' }, origin);
  let body;
  try { body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '{}')); }
  catch (e) { return reply(400, { error: 'Неверный JSON' }, origin); }
  const messages = clean(body);
  if (!messages) return reply(400, { error: 'Слишком длинный или неверный запрос' }, origin);
  try {
    const answer = await chat(messages);
    return reply(200, { answer }, origin);
  } catch (e) {
    const msg = String(e && e.message || e);
    const tlsHint = /certificate|self.signed|UNABLE_TO|CERT_/i.test(msg) ? ' — среда не доверяет сертификату Минцифры: задайте GIGACHAT_CA (см. README)' : '';
    return reply(502, { error: 'GigaChat: ' + msg.slice(0, 220) + tlsHint }, origin);
  }
};

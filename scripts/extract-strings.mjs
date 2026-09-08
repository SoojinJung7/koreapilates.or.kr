// dist/ 의 HTML에서 화면에 보이는 한글 텍스트 노드를 뽑아 번역 사전의 뼈대를 만든다.
// 언어 토글이 '텍스트 노드 통째로 exact match'로 갈아끼우므로, 키도 브라우저가 보는 것과
// 같아야 한다 → HTML 엔티티를 반드시 디코드한 뒤 trim 한다.
//   실행: npm run build && node scripts/extract-strings.mjs
// 결과: src/data/translations.json 에 빠진 항목만 en:"" 로 덧붙인다(기존 번역은 보존).
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const OUT = 'src/data/translations.json';

// 화면에 0.1초 스쳐가는 리다이렉트 스텁 — 번역할 가치가 없다(옛 Wix 커뮤니티 주소).
const SKIP_DIRS = ['community-1'];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return SKIP_DIRS.includes(e.name) ? [] : walk(p);
    return p.endsWith('.html') ? [p] : [];
  });
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

const seen = new Set();
for (const file of walk(DIST)) {
  const html = fs.readFileSync(file, 'utf8').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
  for (const m of html.matchAll(/>([^<>]+)</g)) {
    const key = decode(m[1]).trim();
    if (key.length < 2 || !/[가-힣]/.test(key)) continue;
    seen.add(key);
  }
}

const existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
const known = new Set(existing.map((t) => t.ko));
const added = [...seen].filter((k) => !known.has(k)).map((ko) => ({ ko, en: '' }));
// 화면에서 사라진 문구는 남겨둔다(되살아날 수 있고, 안 쓰면 그냥 무시된다).
fs.writeFileSync(OUT, JSON.stringify([...existing, ...added], null, 2) + '\n');

const all = [...existing, ...added];
console.log(`화면 문구 ${seen.size}개 · 사전 ${all.length}개 (새로 추가 ${added.length}개) → ${OUT}`);
const todo = all.filter((t) => !t.en);
if (todo.length) console.log(`⚠️ 영문이 빈 항목 ${todo.length}개`);

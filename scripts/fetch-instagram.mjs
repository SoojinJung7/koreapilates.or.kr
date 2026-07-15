/**
 * 빌드 시 인스타그램 최신 게시물을 가져와 src/data/instagram.json 을 갱신한다.
 *
 * 동작 원칙 (안전 우선):
 *  - 환경변수 INSTAGRAM_TOKEN 이 없으면 아무것도 하지 않고 기존 json 을 유지한다.
 *    (로컬 개발/토큰 미설정 시에도 빌드가 깨지지 않도록)
 *  - API 호출이나 이미지 다운로드가 실패하면 기존 json 을 그대로 두고 종료한다.
 *  - 성공하면 이미지를 public/instagram/ 에 내려받아 자체 호스팅하고,
 *    json 의 image 경로를 로컬 경로로 기록한다. (인스타 CDN URL 만료 대비)
 *
 * 필요한 환경변수:
 *  - INSTAGRAM_TOKEN     : 장기(long-lived) 액세스 토큰   (필수)
 *  - INSTAGRAM_USER_ID   : 인스타 비즈니스/크리에이터 계정 ID (선택, 없으면 'me')
 *  - INSTAGRAM_API_BASE  : API 베이스 (선택, 기본 graph.instagram.com)
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'src/data/instagram.json');
const IMG_DIR = path.join(ROOT, 'public/instagram');

const TOKEN = process.env.INSTAGRAM_TOKEN;
const USER_ID = process.env.INSTAGRAM_USER_ID || 'me';
const API_BASE = process.env.INSTAGRAM_API_BASE || 'graph.instagram.com';
const COUNT = 3;

function log(msg) { console.log(`[instagram] ${msg}`); }

async function main() {
  if (!TOKEN) {
    log('INSTAGRAM_TOKEN 없음 → 기존 데이터 유지하고 건너뜀.');
    return;
  }

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://${API_BASE}/${USER_ID}/media?fields=${fields}&limit=${COUNT + 4}&access_token=${TOKEN}`;

  let media;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    const json = await res.json();
    media = json.data || [];
  } catch (e) {
    log(`API 호출 실패 → 기존 데이터 유지. (${e.message})`);
    return;
  }

  // 이미지/캐러셀만 사용 (동영상은 thumbnail 로 대체)
  const usable = media
    .filter((m) => m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM' || m.thumbnail_url)
    .slice(0, COUNT);

  if (usable.length === 0) {
    log('사용할 게시물이 없음 → 기존 데이터 유지.');
    return;
  }

  await mkdir(IMG_DIR, { recursive: true });

  const posts = [];
  for (const m of usable) {
    const src = m.media_url || m.thumbnail_url;
    if (!src) continue;
    const localName = `${m.id}.jpg`;
    try {
      const imgRes = await fetch(src);
      if (!imgRes.ok) throw new Error(`이미지 ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      await writeFile(path.join(IMG_DIR, localName), buf);
    } catch (e) {
      log(`이미지 다운로드 실패(${m.id}) → 이 게시물 건너뜀. (${e.message})`);
      continue;
    }
    posts.push({
      id: m.id,
      permalink: m.permalink,
      image: `/instagram/${localName}`,
      caption: (m.caption || '').split('\n')[0].slice(0, 120),
    });
  }

  if (posts.length === 0) {
    log('다운로드된 게시물이 없음 → 기존 데이터 유지.');
    return;
  }

  // 기존 파일에서 handle/profile 유지
  let base = { handle: 'koreapilatesassociation', profile: 'https://www.instagram.com/koreapilatesassociation' };
  if (existsSync(DATA_FILE)) {
    try { base = { ...base, ...JSON.parse(await readFile(DATA_FILE, 'utf8')) }; } catch {}
  }

  const out = {
    handle: base.handle,
    profile: base.profile,
    updatedAt: new Date().toISOString(),
    placeholder: false,
    posts,
  };
  await writeFile(DATA_FILE, JSON.stringify(out, null, 2) + '\n');
  log(`완료: 게시물 ${posts.length}개 갱신.`);
}

main().catch((e) => {
  // 어떤 경우에도 빌드를 막지 않는다.
  log(`예기치 못한 오류 → 기존 데이터 유지. (${e.message})`);
});

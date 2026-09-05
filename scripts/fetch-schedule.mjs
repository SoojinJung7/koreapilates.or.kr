/**
 * 빌드 시 KPA-student 앱의 공개 일정 API(교육장 예약)를 받아
 * src/data/reservations.json 을 갱신한다.
 *
 * 역할: "폴백 사본". 실제 표시는 방문자 브라우저가 같은 API를 실시간으로 읽어 덮어쓰고,
 * 앱이 응답하지 않을 때만 이 빌드 시점 사본이 보인다.
 *
 * 동작 원칙 (인스타 피드와 동일, 안전 우선):
 *  - 앱 주소를 모르면(환경변수 없음) 아무것도 하지 않고 기존 json 을 유지한다.
 *  - API 호출이 실패해도 기존 json 을 그대로 두고 종료한다. 빌드는 절대 막지 않는다.
 *
 * 환경변수:
 *  - PUBLIC_APP_URL        : 앱 origin (예: https://student.koreapilates.or.kr)  (선택)
 *  - PUBLIC_APP_LOGIN_URL  : 위가 없으면 이 값의 origin 을 사용 (SSO 용으로 이미 등록됨)
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'src/data/reservations.json');

// 조회 폭: 지난달 1일 ~ 다다음달 말일 (API 최대 130일 안쪽)
const PAST_MONTHS = 1;
const FUTURE_MONTHS = 2;

function log(msg) { console.log(`[schedule] ${msg}`); }

function appOrigin() {
  const direct = process.env.PUBLIC_APP_URL;
  const login = process.env.PUBLIC_APP_LOGIN_URL;
  try {
    if (direct) return new URL(direct).origin;
    if (login) return new URL(login).origin;
  } catch {}
  return null;
}

// KST 기준 오늘
function kstToday() {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
}
const pad = (n) => String(n).padStart(2, '0');
function ymd(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function lastDay(y, m) { return new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); }

async function main() {
  const origin = appOrigin();
  if (!origin) {
    log('PUBLIC_APP_URL / PUBLIC_APP_LOGIN_URL 없음 → 기존 데이터 유지하고 건너뜀.');
    return;
  }

  const { y, m } = kstToday();
  const fromD = new Date(Date.UTC(y, m - PAST_MONTHS, 1));
  const toD = new Date(Date.UTC(y, m + FUTURE_MONTHS, 1));
  const from = ymd(fromD.getUTCFullYear(), fromD.getUTCMonth(), 1);
  const to = ymd(toD.getUTCFullYear(), toD.getUTCMonth(), lastDay(toD.getUTCFullYear(), toD.getUTCMonth()));

  const url = `${origin}/api/public/schedule?from=${from}&to=${to}`;
  let json;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 200)}`);
    json = await res.json();
    if (!Array.isArray(json.items)) throw new Error('items 배열이 없음');
  } catch (e) {
    log(`API 호출 실패 → 기존 데이터 유지. (${e.message})`);
    return;
  }

  const out = {
    _comment: '빌드 시 KPA-student 공개 일정 API에서 자동 생성되는 폴백 사본. 직접 편집하지 말 것.',
    source: url,
    updatedAt: new Date().toISOString(),
    from,
    to,
    items: json.items,
  };
  await writeFile(DATA_FILE, JSON.stringify(out, null, 2) + '\n');
  log(`완료: 예약 ${json.items.length}건 (${from} ~ ${to}).`);
}

main().catch((e) => {
  // 어떤 경우에도 빌드를 막지 않는다.
  log(`예기치 못한 오류 → 기존 데이터 유지. (${e.message})`);
});

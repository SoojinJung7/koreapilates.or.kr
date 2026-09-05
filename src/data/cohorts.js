/**
 * 지도자과정 기수 정보 — 한 곳에서 관리한다.
 *
 * 쓰는 곳:
 *   - /coursedate  기수별 교육일정 표
 *   - 달력(Calendar.astro)  개강·정규과정·시험 등 기수 일정을 이 규칙으로 자동 생성
 *
 * 새 기수를 열 때는 맨 위에 한 줄 추가하고 status 를 'open' 으로 두면 된다.
 * 커리큘럼표가 나오면 end / off / special / extra 를 채운다. (168기 참고)
 *
 * 필드:
 *   gen      '169기'
 *   start    '2026-09-06'            개강일 (첫 수업일)
 *   end      '2026-10-14' | null     마지막 정규수업일. null 이면 COURSE_MONTHS 로 추정
 *   cls      '일요반' | '월/수반' | '토요반'
 *   status   'open' | 'closed'       모집 상태
 *   note     '잔여 1자리'            모집 중일 때 표시할 문구 (선택)
 *   off      ['2026-05-25', …]       방학·휴강일 — 수업 대신 "168기 월수반 방학" 으로 표시 (선택)
 *   special  { '2026-07-22': '수행평가', … }
 *            수업 요일이지만 정규과정 대신 다른 이름으로 표시할 날 (선택)
 *   extra    [{ date: '2026-10-21', title: '필기시험' }, …]
 *            정규 수업일 밖의 기수 행사 (선택). time 을 생략하면 반 수업시간
 *
 * 달력 제목은 "168기 월수반 정규과정" 처럼 `기수 반 이름` 으로 만든다.
 */

// 정규수업이 이어지는 기간(개월). end 를 안 적은 기수의 마지막 수업일 추정에 쓴다.
export const COURSE_MONTHS = 6;

// 반별 수업 요일·시간. 요일: 0=일 … 6=토. short 는 달력 제목용.
export const CLASS_PATTERNS = {
  '일요반':  { short: '일요반', days: [0],    time: '11:00–17:00', label: '일요일 11:00 ~ 17:00' },
  '토요반':  { short: '토요반', days: [6],    time: '12:00–18:00', label: '토요일 12:00 ~ 18:00' },
  '월/수반': { short: '월수반', days: [1, 3], time: '10:30–13:30', label: '월요일 10:30~13:30 / 수요일 10:30~13:30' },
};

// 최신순
export const cohorts = [
  { gen: '169기', start: '2026-09-06', end: null, cls: '일요반',  status: 'open',   note: '잔여 1자리' },
  {
    // 168기 월수반 커리큘럼표(2026-09 기준) 반영. 교육순서·일정은 습득속도에 따라 유동적.
    gen: '168기', start: '2026-05-11', end: '2026-10-14', cls: '월/수반', status: 'closed',
    off: ['2026-05-25', '2026-06-03', '2026-08-17', '2026-10-05'], // 석가탄신일·지방선거일·광복절·개천절
    special: {
      '2026-06-29': '자체 스터디',
      '2026-07-22': '수행평가',      // 중간고사
      '2026-07-27': '자체 스터디',
      '2026-08-31': '자체 스터디',
      '2026-09-23': '자체 스터디',
      '2026-10-07': '수행평가',      // 기말고사(실기)
      '2026-10-12': '수행평가',      // 그룹수업발표
      '2026-10-14': '프로필 촬영일', // 마지막 실기동작 복습 + Photoshooting day
    },
    extra: [
      { date: '2026-10-21', title: '필기시험' },
      { date: '2026-11-11', title: '실기시험' },
    ],
  },
  { gen: '167기', start: '2026-01-18', end: null, cls: '일요반',  status: 'closed' },
  { gen: '166기', start: '2025-10-22', end: null, cls: '월/수반', status: 'closed' },
  { gen: '165기', start: '2025-06-29', end: null, cls: '일요반',  status: 'closed' },
  { gen: '164기', start: '2025-04-23', end: null, cls: '월/수반', status: 'closed' },
  { gen: '163기', start: '2024-12-01', end: null, cls: '일요반',  status: 'closed' },
  { gen: '162기', start: '2024-09-25', end: null, cls: '월/수반', status: 'closed' },
  { gen: '161기', start: '2024-04-07', end: null, cls: '일요반',  status: 'closed' },
  { gen: '160기', start: '2024-01-31', end: null, cls: '월/수반', status: 'closed' },
  { gen: '159기', start: '2023-11-04', end: null, cls: '토요반',  status: 'closed' },
  { gen: '158기', start: '2023-09-10', end: null, cls: '일요반',  status: 'closed' },
  { gen: '157기', start: '2023-07-12', end: null, cls: '월/수반', status: 'closed' },
  { gen: '156기', start: '2023-02-26', end: null, cls: '일요반',  status: 'closed' },
  { gen: '155기', start: '2023-01-16', end: null, cls: '월/수반', status: 'closed' },
];

// ---------- 유틸 ----------
const pad = (n) => String(n).padStart(2, '0');
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

/** '2026-09-06' → '2026.09.06' (기수별 일정 표 표기) */
export const dotDate = (iso) => iso.replaceAll('-', '.');

/** 마지막 정규수업일 (명시값 없으면 개강일 + COURSE_MONTHS 개월) */
export function cohortEnd(c) {
  if (c.end) return c.end;
  const d = parse(c.start);
  d.setMonth(d.getMonth() + COURSE_MONTHS);
  return toKey(d);
}

/**
 * 달력용 기수 일정 생성. [from, to] 범위 안의 날짜만 만든다.
 *   - 개강일:            "169기 일요반 개강일"          (recurring: false)
 *   - 정규 수업일:       "168기 월수반 정규과정"        (recurring: true  → '다가오는 일정' 목록에서는 제외)
 *   - off 에 든 날:      "168기 월수반 방학"            (recurring: false, 시간 없음)
 *   - special 로 지정한 날: "168기 월수반 수행평가" 등  (recurring: false)
 *   - extra:            "168기 월수반 필기시험" 등      (recurring: false)
 */
export function cohortEvents(from, to) {
  const out = [];
  const inRange = (k) => k >= from && k <= to;
  for (const c of cohorts) {
    const p = CLASS_PATTERNS[c.cls];
    if (!p) continue;
    const end = cohortEnd(c);
    const name = `${c.gen} ${p.short}`;
    const off = new Set(c.off || []);
    const special = c.special || {};
    const base = { type: 'academic', where: '본원', time: p.time };

    if (!(end < from || c.start > to)) {
      for (let d = parse(c.start), last = parse(end); d <= last; d.setDate(d.getDate() + 1)) {
        if (!p.days.includes(d.getDay())) continue;
        const key = toKey(d);
        if (!inRange(key)) continue;
        if (off.has(key)) out.push({ type: 'academic', date: key, title: `${name} 방학`, recurring: false });
        else if (special[key]) out.push({ ...base, date: key, title: `${name} ${special[key]}`, recurring: false });
        else if (key === c.start) out.push({ ...base, date: key, title: `${name} 개강일`, recurring: false });
        else out.push({ ...base, date: key, title: `${name} 정규과정`, recurring: true });
      }
    }
    for (const x of c.extra || []) {
      if (!inRange(x.date)) continue;
      out.push({ ...base, ...(x.time ? { time: x.time } : {}), date: x.date, title: `${name} ${x.title}`, recurring: false });
    }
  }
  return out;
}

// 번역 사전을 정적 파일 하나(/lang/en.json)로 내보낸다.
// 페이지마다 64KB 를 인라인하면 34개 페이지가 통째로 무거워진다 —
// EN 을 고른 방문자만 한 번 받아 가고, 그 뒤엔 브라우저 캐시가 맡는다.
import { EN } from '../../i18n/dict.js';

export function GET() {
  return new Response(JSON.stringify(EN), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

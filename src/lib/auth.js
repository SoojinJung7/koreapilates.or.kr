// ─────────────────────────────────────────────────────────────
// KPA 통합 로그인(SSO) — 홈페이지(정적 사이트) 쪽 클라이언트
//
// 구조 원칙:
//   • KPA 교육생 앱(Vercel, Next.js)  = 신원 발급/쓰기 담당(OAuth 콜백 전담)
//   • 홈페이지(정적 Astro)            = 앱이 심어둔 세션 쿠키를 "읽기"만 함
//
// 앱과 홈페이지가 같은 상위 도메인(.koreapilates.or.kr)의 서브도메인이면
// 세션 쿠키가 공유되어, 앱에서 로그인하면 홈페이지도 자동 로그인 상태가 됩니다.
//
// 필요한 환경변수(빌드 타임, PUBLIC_ 접두사 = 클라이언트에 노출됨):
//   PUBLIC_SUPABASE_URL          앱과 "동일한" Supabase 프로젝트 URL
//   PUBLIC_SUPABASE_ANON_KEY     앱과 "동일한" anon key (공개용이라 노출 안전)
//   PUBLIC_AUTH_COOKIE_DOMAIN    예) .koreapilates.or.kr  (미설정 시 현재 호스트에만 저장 = 공유 안 함)
//   PUBLIC_APP_LOGIN_URL         예) https://student.koreapilates.or.kr/login (홈페이지 로그인 버튼이 보낼 앱 로그인 주소)
// ─────────────────────────────────────────────────────────────
import { createBrowserClient } from '@supabase/ssr';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const cookieDomain = import.meta.env.PUBLIC_AUTH_COOKIE_DOMAIN || undefined;

export const APP_LOGIN_URL = import.meta.env.PUBLIC_APP_LOGIN_URL || '';

// 두 값이 모두 있어야 실제 인증이 켜집니다. 없으면(로컬/미설정) 로그인 UI는 얌전히 비활성.
export const isAuthConfigured = Boolean(url && anon);

// 상위 도메인 쿠키(운영)일 때만 domain/secure 지정.
// 로컬(도메인 미설정)에서는 현재 호스트 쿠키 + 비보안 → http://localhost 에서도 동작.
const cookieOptions = cookieDomain
  ? { domain: cookieDomain, path: '/', sameSite: 'lax', secure: true, maxAge: 60 * 60 * 24 * 365 }
  : { path: '/', sameSite: 'lax' };

export const supabase = isAuthConfigured
  ? createBrowserClient(url, anon, { cookieOptions })
  : null;

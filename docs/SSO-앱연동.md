# KPA 통합 로그인(SSO) — 앱 ↔ 홈페이지 연동 가이드

> 목표: **KPA 교육생 앱에서 로그인하면 홈페이지(koreapilates.or.kr)도 자동 로그인 상태**가 되게 한다.

## 큰 그림

```
[사용자] ── 구글 로그인 ──▶ student.koreapilates.or.kr (Vercel/Next.js 앱)
                                │  세션을 .koreapilates.or.kr 쿠키로 저장(도메인 공유)
                                ▼
                       koreapilates.or.kr (정적 홈페이지)  ← 그 쿠키를 "읽어서" 로그인 표시
```

- **앱 = 신원 발급/쓰기 담당**: 구글 OAuth 콜백·세션 발급을 앱이 전담.
- **홈페이지 = 읽기 전용**: 발급된 공유 쿠키만 읽어 로그인 UI를 표시(자체 인증 처리 없음).
- 두 사이트가 **같은 상위 도메인(.koreapilates.or.kr)** 아래에 있고 **같은 Supabase 프로젝트**를 쓰면 쿠키가 공유됨.

---

## 홈페이지 쪽 (이 저장소 — 이미 완료)

- `src/lib/auth.js` — `@supabase/ssr` `createBrowserClient` 로 공유 쿠키 세션 읽기
- `src/components/AuthController.astro` — 전역 로그인 상태 토글(`html[data-auth="in|out|off"]`)
- 헤더: 로그인/로그아웃 버튼 (`data-auth-login` / `data-auth-logout`)
- 환경변수(`.env.example` 참고): `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `PUBLIC_AUTH_COOKIE_DOMAIN`, `PUBLIC_APP_LOGIN_URL`

**남은 준비물** (값을 GitHub 저장소 Secrets/Variables 에 등록):
| 이름 | 종류 | 예시 |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Secret | `https://xxxx.supabase.co` |
| `PUBLIC_SUPABASE_ANON_KEY` | Secret | `eyJhbGciOi...` (앱과 동일) |
| `PUBLIC_AUTH_COOKIE_DOMAIN` | Variable | `.koreapilates.or.kr` |
| `PUBLIC_APP_LOGIN_URL` | Variable | `https://student.koreapilates.or.kr/login` |

---

## 앱 쪽 (KPA-student 저장소 — 여기를 맞춰줘야 함)

### 1. Vercel 커스텀 도메인 연결
- Vercel 프로젝트 → Settings → Domains → `student.koreapilates.or.kr` 추가
- 도메인 등록업체 DNS 에 Vercel이 안내하는 **CNAME**(보통 `cname.vercel-dns.com`) 추가
- ⚠️ 반드시 `koreapilates.or.kr` 의 서브도메인이어야 쿠키 공유가 됩니다. `*.vercel.app` 로는 SSO 불가.

### 2. Supabase 클라이언트 쿠키 도메인 지정 (가장 중요)
앱의 Supabase 클라이언트가 세션 쿠키를 **상위 도메인**에 쓰도록 `cookieOptions.domain` 을 추가합니다.
브라우저용·서버용 **둘 다** 동일하게 맞춰야 합니다.

```ts
// 브라우저 클라이언트
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookieOptions: {
      domain: '.koreapilates.or.kr', // ★ 공유의 핵심
      path: '/',
      sameSite: 'lax',
      secure: true,
    },
  }
)
```

```ts
// 서버 클라이언트(콜백/미들웨어)도 같은 domain 옵션으로 createServerClient(...) 구성
// cookies().set(name, value, { domain: '.koreapilates.or.kr', path: '/', sameSite: 'lax', secure: true })
```

> 쿠키 이름(`sb-<프로젝트ref>-auth-token`)은 프로젝트에서 자동으로 정해지므로,
> **같은 Supabase 프로젝트 + 같은 domain** 이면 홈페이지가 자동으로 같은 쿠키를 읽습니다.

### 3. `/login` 페이지에서 `?next=` 처리
홈페이지 로그인 버튼은 `https://student.koreapilates.or.kr/login?next=<돌아갈주소>` 로 이동시킵니다.
앱은 구글 로그인 성공 후 `next` 로 돌려보내야 합니다.

```ts
// 로그인 성공(OAuth 콜백 처리) 후
const next = searchParams.get('next')
// 보안: next 는 반드시 koreapilates.or.kr 도메인만 허용(오픈 리다이렉트 방지)
const safe = isKoreapilatesUrl(next) ? next! : 'https://koreapilates.or.kr'
redirect(safe)
```

### 4. Supabase Auth 설정 (대시보드)
- Authentication → URL Configuration
  - **Site URL**: `https://koreapilates.or.kr`
  - **Redirect URLs** 에 추가:
    - `https://student.koreapilates.or.kr/**`
    - `https://koreapilates.or.kr/**`
- Google Provider 사용 설정 + Google Cloud OAuth 승인된 리디렉션 URI 에 Supabase 콜백 등록

---

## 동작 확인 체크리스트
1. 앱(`student.…`)에서 구글 로그인 → 브라우저 개발자도구 Application → Cookies 에서 `sb-…-auth-token` 의 **Domain 이 `.koreapilates.or.kr`** 인지 확인
2. 새 탭에서 `koreapilates.or.kr` 접속 → 헤더가 자동으로 "○○○ 님 / 로그아웃" 으로 바뀌는지
3. 홈페이지에서 로그아웃 → 앱 새로고침 시에도 로그아웃돼 있는지

## 전제조건 / 주의
- 홈페이지가 아직 `github.io` 라면 SSO 불가 → **커스텀 도메인(koreapilates.or.kr) 전환 필수**.
  전환 시 `astro.config.mjs` 의 `base` 를 `'/'` 로 변경.
- 쿠키는 `Secure` 라 **HTTPS 에서만** 동작(운영은 문제없음, 로컬 http 테스트는 도메인 옵션 없이).
- anon key 노출은 정상(공개용). `service_role` 키는 클라이언트/이 저장소에 절대 넣지 말 것.

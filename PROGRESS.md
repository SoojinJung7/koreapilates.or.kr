# KPA 홈페이지 재구축 진행 상황

원본: https://koreapilates.or.kr (Wix) → Astro 정적 사이트로 재구축
저장소: https://github.com/SoojinJung7/koreapilates.or.kr

## 방침 (사용자 결정)
- 방식: **재구축(Astro)** — 원본과 똑같이 보이되 깨끗한 코드로 새로 제작
- 동적 기능(로그인/회원가입, 수강신청 결제, 커뮤니티/자료 게시판): **1단계에서는 겉모습만**, 2단계에서 새로 개발
- 이미지/로고/영상 저작권: 전부 사용자 소유

## 디자인 토큰 (원본에서 추출)
- 색상: 크림 250,233,190 / 잉크 28,16,18 / 마룬 59,30,34 / 세이지 141,153,144 / 올리브 70,83,65 / 핑크 214,192,195
- 폰트: Avenir(라이트/헤비), Didot, Caudex, DIN Next + 업로드 한글 폰트(woff)
- 파비콘: ficons/6f7ec1_3d0c9ecdd37b4dcbaff4d9b8bcb4d4fd

## 페이지 목록 & 상태
주소: https://koreapilates.or.kr (2026-09-01 실도메인 전환 — DNS 작업은 docs/도메인전환.md)

| 경로 | 이름 | 상태 |
|---|---|---|
| / | 홈 | ✅ 완료 |
| /kpa | 협회소개 | ✅ 완료 |
| /faculty | 강사소개 | ✅ 완료 |
| /projects | 시설 둘러보기 | ✅ 완료 |
| /pilatesequipment | 장비 둘러보기 | ✅ 완료 |
| /address | 오시는길 | ✅ 완료 |
| /curriculum | 커리큘럼 | ✅ 완료 |
| /coursedate | 교육일정 | ✅ 완료 |
| /kpaapp | KPA 교육어플 | ✅ 완료 |
| /category/all-products | 심화과정 수강신청 | ✅ 완료 |
| /ncpt | NCPT 국제공인 자격증 | ✅ 완료 |
| /workshop-seminar | 워크샵/세미나 | ✅ 완료 |
| /event-list | 워크샵/세미나 신청 | ✅ 완료 |
| /graduates-seminar | 졸업생세미나 | ✅ 완료 |
| /conferences | 해외 초청 워크샵 | ✅ 완료 |
| /community | KPA커뮤니티 | ✅ 완료 |
| /file-share | 자료게시판 | ✅ 완료 |
| /members | 인증 회원 찾기 | ✅ 완료 |

## 공통 작업
- ✅ Astro 스캐폴드 + 디자인 시스템
- ✅ Header / Footer 컴포넌트 (내비게이션 18개 항목)
- ✅ 폰트 파일 다운로드 & 로컬 호스팅
- ✅ 홈페이지 이미지 다운로드 & 로컬 호스팅
- ✅ GitHub Pages 자동배포 워크플로우 (base 경로 대응)
- ✅ 실도메인 전환 코드 (base '/' + public/CNAME) — docs/도메인전환.md
- ✅ 파비콘 로컬 호스팅 → 빌드 산출물에 Wix 의존성 0
- ✅ 통합 로그인(SSO) 코드 — 홈페이지·앱 양쪽 (docs/SSO-앱연동.md)
- ⬜ 폰트 역할(본문/제목) 화면 대조 후 확정
- ⬜ 이미지 최적화 (public/images 21MB, 1MB+ PNG 5장)

## 다음 할 일
1. **가비아 DNS 전환** (사용자) → docs/도메인전환.md 2~3번
2. Pages 커스텀 도메인 지정 + 인증서 확인 → 같은 문서 4~5번
3. SSO 마무리: Vercel 커스텀 도메인 + 환경변수, Supabase Redirect URL,
   홈페이지 저장소 Secrets → docs/SSO-앱연동.md
4. 메일 실수신 확인 후 **Wix 해지**
5. 이미지 최적화 / 일정·인스타 실데이터 / 심화과정 온라인 신청

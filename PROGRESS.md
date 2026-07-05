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
미리보기: https://soojinjung7.github.io/koreapilates.or.kr/ (실제 도메인 미변경)

| 경로 | 이름 | 상태 |
|---|---|---|
| / | 홈 | ✅ 완료 |
| /kpa | 협회소개 | ✅ 완료 |
| /faculty | 강사소개 | ✅ 완료 |
| /projects | 시설 둘러보기 | ✅ 완료 |
| /pilatesequipment | 장비 둘러보기 | ✅ 완료 |
| /address | 오시는길 | ✅ 완료 |
| /curriculum | 커리큘럼 | ✅ 완료 |
| /coursedate | 교육일정 | ⬜ |
| /kpaapp | KPA 교육어플 | ⬜ |
| /category/all-products | 심화과정 수강신청 | ⬜ |
| /ncpt | NCPT 국제공인 자격증 | ⬜ |
| /workshop-seminar | 워크샵/세미나 | ⬜ |
| /event-list | 워크샵/세미나 신청 | ⬜ |
| /graduates-seminar | 졸업생세미나 | ⬜ |
| /conferences | 해외 초청 워크샵 | ⬜ |
| /community | KPA커뮤니티 | ⬜ |
| /file-share | 자료게시판 | ⬜ |
| /members | 인증 회원 찾기 | ⬜ |

## 공통 작업
- ✅ Astro 스캐폴드 + 디자인 시스템
- ✅ Header / Footer 컴포넌트 (내비게이션 18개 항목)
- ✅ 폰트 파일 다운로드 & 로컬 호스팅
- ✅ 홈페이지 이미지 다운로드 & 로컬 호스팅
- ✅ GitHub Pages 자동배포 워크플로우 (base 경로 대응)
- ⬜ 나머지 페이지 이미지 다운로드 (_source/fetch_images.sh <페이지명>)
- ⬜ 폰트 역할(본문/제목) 화면 대조 후 확정
- ⬜ 이미지 최적화 (원본 일부 18MB+)

## 다음 할 일
1. 서브페이지 순차 제작 (kpa → faculty → curriculum → coursedate → ...)
   - 각 페이지: _source/pages/<name>.html 참고 + 이미지 다운로드 + Astro 페이지 작성
2. 폰트 역할 확정 및 미세 조정
3. 2단계(로그인/결제/게시판) 별도 개발

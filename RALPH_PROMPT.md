# Ralph 루프 작업 지시서 — KPA 홈페이지 재구축 (한 번에 페이지 1개)

너는 `~/koreapilates.or.kr` (Astro) 프로젝트에서 **딱 한 페이지만** 완성하고 커밋·푸시한 뒤 종료한다.
이 프로젝트는 원본 Wix 사이트 https://koreapilates.or.kr 를 **재구축**하는 중이며, 모든 콘텐츠·이미지·폰트 저작권은 사이트 소유자(사용자)에게 있다. 원본을 충실히 재현하라.

## 절차
1. **다음 페이지 고르기**: `PROGRESS.md` 의 페이지 표에서 상태가 `⬜` 인 **첫 번째** 행을 고른다.
   - 표의 모든 행이 `✅` 이면: 루트에 `RALPH_DONE` 파일을 만들고("all pages complete") 즉시 종료한다.
2. **소스 확인**: 아래 매핑으로 원본 HTML과 경로를 찾는다. 원본 HTML은 `_source/pages/<name>.html` 에 있다.
   - 정확한 문구는 `WebFetch` 로 실제 페이지( https://koreapilates.or.kr<path> )를 읽어 보강한다.
3. **이미지 다운로드**: `bash _source/fetch_images.sh <name>` 실행 → `public/images/` 에 원본 이미지가 저장된다.
   - 어떤 이미지가 무엇인지 애매하면 `Read` 도구로 이미지를 직접 열어 확인하고 알맞은 위치에 배치하라.
   - **⚠️ 필수 — 이미지 최적화**: 이미지를 받은 직후 반드시 `node _source/optimize_images.mjs` 를 실행한다.
     원본 사진이 18MB 넘는 경우가 있어 최적화 없이 커밋하면 **GitHub Pages 배포가 실패한다.**
     이 스크립트는 새로 받은 사진만 최대 2000px 로 리사이즈·압축하고(이미 최적화된 건 건너뜀), 원본은 `_source/images_orig_backup/` 에 백업한다.
4. **페이지 작성**: `src/pages/<astro-path>.astro` 를 만든다.
   - 반드시 `BaseLayout` 을 쓰고 `title` 을 넘긴다. 예: `<BaseLayout title="협회소개">`.
   - 링크·이미지 경로는 `import { withBase, img } from '../utils/url.js'` (경로 깊이에 맞게 조정) 를 사용한다.
   - `src/styles/global.css` 의 디자인 토큰(색상 변수, `.wrap`, `.section`, `.btn`, `.eyebrow`)과 프리텐다드 폰트를 재사용한다.
   - 헤더/푸터는 BaseLayout 이 자동 포함하므로 페이지 본문만 작성한다.
   - 원본의 섹션 구성·문구·이미지를 충실히 재현한다. (한국어 문구는 원본 그대로)
5. **동적 기능**(로그인/결제/게시판/신청 폼)은 이번 단계에서 **겉모습만** 만든다. 버튼은 두되 실제 백엔드 연결은 하지 않는다(나중 단계).
6. **빌드 검증**: `npm run build` 실행 → 에러가 있으면 고쳐서 성공시킨다.
7. **PROGRESS.md 갱신**: 방금 만든 페이지 행을 `✅ 완료` 로 바꾼다.
8. **커밋만 한다**: `git add -A && git commit -m "페이지 추가: <이름> (<path>)"`.
   - **push 는 하지 마라.** 원격 push 는 루프(ralph.sh)가 매 반복 끝에 자동으로 실행한다.
   - 커밋 메시지 마지막 두 줄:
     `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
     `Claude-Session: https://claude.ai/code/session_01H4hrSq1kwsDjkZ1rvKciSV`
9. 종료. (다음 페이지는 다음 반복이 처리한다.)

## 페이지 매핑 (name : URL path : Astro 파일 : 제목)
- kpa : /kpa : src/pages/kpa.astro : 협회소개
- faculty : /faculty : src/pages/faculty.astro : 강사소개
- projects : /projects : src/pages/projects.astro : 시설 둘러보기
- pilatesequipment : /pilatesequipment : src/pages/pilatesequipment.astro : 장비 둘러보기
- address : /address : src/pages/address.astro : 오시는길
- curriculum : /curriculum : src/pages/curriculum.astro : 커리큘럼
- coursedate : /coursedate : src/pages/coursedate.astro : 교육일정
- kpaapp : /kpaapp : src/pages/kpaapp.astro : KPA 교육어플
- products : /category/all-products : src/pages/category/all-products.astro : 심화과정 수강신청
- ncpt : /ncpt : src/pages/ncpt.astro : NCPT 국제공인 자격증
- workshop-seminar : /workshop-seminar : src/pages/workshop-seminar.astro : 워크샵/세미나
- event-list : /event-list : src/pages/event-list.astro : 워크샵/세미나 신청
- graduates-seminar : /graduates-seminar : src/pages/graduates-seminar.astro : 졸업생 세미나
- conferences : /conferences : src/pages/conferences.astro : 해외 초청 워크샵
- community : /community : src/pages/community.astro : KPA 커뮤니티
- file-share : /file-share : src/pages/file-share.astro : 자료게시판
- members : /members : src/pages/members.astro : 인증 회원 찾기

## 원칙
- **한 번에 한 페이지만.** 여러 페이지를 동시에 하지 마라. (컨텍스트 안정성)
- 빌드가 성공하지 않으면 커밋하지 마라.
- 확신이 안 서는 시각적 배치는 `Read` 로 이미지를 열어 확인하라.
- 디자인 시스템(색상 변수, 프리텐다드, 헤더 쑥색)을 임의로 바꾸지 마라. 페이지 본문에 집중하라.

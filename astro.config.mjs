// @ts-check
import { defineConfig } from 'astro/config';

// 배포(build/preview)는 GitHub Pages 프로젝트 경로(/koreapilates.or.kr)를 씁니다.
// 로컬 개발(dev)에서는 base 를 '/' 로 둬서 http://localhost:4321/ 루트로 바로 접속되게 합니다.
// (링크·에셋은 src/utils/url.js 의 withBase 가 base 를 자동으로 붙여줌)
const isDev = process.argv.includes('dev');

export default defineConfig({
  // 미리보기: GitHub Pages 프로젝트 경로. 커스텀 도메인 전환 시 base 를 '/' 로 변경.
  site: 'https://soojinjung7.github.io',
  base: isDev ? '/' : '/koreapilates.or.kr',
  build: {
    format: 'directory',
  },
});

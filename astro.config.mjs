// @ts-check
import { defineConfig } from 'astro/config';

// 커스텀 도메인(koreapilates.or.kr)으로 배포할 예정이라 base는 '/' 로 둡니다.
// GitHub Pages 프로젝트 경로로 배포하려면 base: '/koreapilates.or.kr' 로 바꾸세요.
export default defineConfig({
  // 미리보기: GitHub Pages 프로젝트 경로. 커스텀 도메인 전환 시 base 를 '/' 로 변경.
  site: 'https://soojinjung7.github.io',
  base: '/koreapilates.or.kr',
  build: {
    format: 'directory',
  },
});

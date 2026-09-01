// @ts-check
import { defineConfig } from 'astro/config';

// 커스텀 도메인(koreapilates.or.kr) 배포.
// GitHub Pages 는 public/CNAME 파일을 보고 이 도메인으로 서빙합니다.
// (프로젝트 경로 /koreapilates.or.kr 로 되돌리려면 base 를 그 값으로 바꾸면 됨)
export default defineConfig({
  site: 'https://koreapilates.or.kr',
  base: '/',
  build: {
    format: 'directory',
  },
});

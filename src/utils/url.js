// GitHub Pages 프로젝트 경로(/koreapilates.or.kr) 배포와
// 커스텀 도메인(/) 배포 모두에서 링크·에셋 경로가 깨지지 않도록
// base 경로를 자동으로 붙여주는 헬퍼입니다.
// 커스텀 도메인으로 전환할 때는 astro.config.mjs 의 base 를 '/' 로만 바꾸면 됩니다.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path; // 외부 링크는 그대로
  }
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}`;
}

export const img = (id) => withBase(`/images/${id}`);

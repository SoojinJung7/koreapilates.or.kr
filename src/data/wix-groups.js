/**
 * 옛 Wix 커뮤니티 그룹 주소 → 아직 살아 있는 Wix 원본 주소 매핑.
 *
 * 도메인(koreapilates.or.kr)이 새 홈페이지로 넘어가면서 학생들이 쓰던
 * /community-1/<slug>(/discussion) 주소가 죽었다. Wix 원본은 wixsite.com 주소로
 * 그대로 운영 중이므로 옛 주소로 들어오면 그쪽으로 자동 이동시킨다.
 * 앱 안에 공지 게시판이 생기면 이 파일과 src/pages/community-1/ 은 지워도 된다. (2026-09-06)
 */
export const WIX_SITE = 'https://soojinjung7.wixsite.com/my-site';

export const wixGroups = [
  { slug: '1-sueob-gwaje-gongji', name: '1. 수업/과제 공지' },
  { slug: '2-gyoyugsaeng-gwajejechul', name: '2. 교육생 과제제출' },
  { slug: '3-jilmun-kkultibgesipan', name: '3. 질문 & 꿀팁게시판' },
  { slug: '4-gyoyugsaeng-jol-eobsaeng-keomyuniti', name: '4. 교육생/졸업생 커뮤니티' },
  { slug: '5-yuyonghan-beoblyul-semu-nomu-jeongbo', name: '5. 유용한 법률/세무/노무 정보' },
  { slug: '6-chwieobjeongbo-inteon', name: '6. 취업정보/인턴' },
  { slug: '7-yusonyeon-gangsa-jeon-yong-yusonyeon-sueob-sikwonseu', name: '7. [유소년 강사 전용] 유소년 수업 시퀀스' },
];

export const wixGroupUrl = (slug, sub = '') => `${WIX_SITE}/community-1/${slug}${sub ? `/${sub}` : ''}`;

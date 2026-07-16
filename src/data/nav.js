// 내비게이션: 4개 큰 카테고리 + 외부 링크 (사용자 지정 구조)
export const navGroups = [
  {
    label: 'KPA',
    children: [
      { label: '협회소개', href: '/kpa' },
      { label: '강사소개', href: '/faculty' },
      { label: '시설 둘러보기', href: '/projects' },
      { label: '장비 둘러보기', href: '/pilatesequipment' },
      { label: '오시는길', href: '/address' },
    ],
  },
  {
    label: '지도자과정',
    children: [
      { label: '커리큘럼', href: '/curriculum' },
      { label: '교육일정', href: '/coursedate' },
      { label: '일정 달력', href: '/schedule' },
      { label: 'KPA 교육어플', href: '/kpaapp' },
      { label: '심화과정 수강신청', href: '/category/all-products' },
      { label: 'NCPT 국제공인 자격증', href: '/ncpt' },
    ],
  },
  {
    label: '워크샵',
    children: [
      { label: '워크샵/세미나', href: '/workshop-seminar' },
      { label: '졸업생 세미나', href: '/graduates-seminar' },
      { label: '해외 초청 워크샵', href: '/conferences' },
    ],
  },
  {
    label: '커뮤니티',
    children: [
      { label: 'KPA 커뮤니티', href: '/community' },
      { label: '자료게시판', href: '/file-share' },
      { label: '인증 회원 찾기', href: '/members' },
    ],
  },
  { label: '더 스파이럴 분당', href: 'https://www.thespiral.co.kr', external: true },
];

// 평면 목록 (사이트맵/보조용)
export const navItems = navGroups.flatMap((g) =>
  g.children ? g.children : [{ label: g.label, href: g.href, external: g.external }]
);

export const siteMeta = {
  name: 'KPA 사단법인 대한필라테스협회',
  short: 'KPA',
  title: 'KPA 사단법인 대한필라테스협회 | 필라테스 지도자과정 | South Korea, Gyeonggi-do, Seongnam-si, 분당',
  description: '사단법인 대한필라테스협회 — 실무에 강한 250시간 필라테스 지도자과정. 경기도 성남시 분당.',
  logo: '/images/kpa-logo-2023.png',
  logoLight: '/images/6f7ec1_5c492f6a24374bb2a3d5f1ae302f183d~mv2.png',
  favicon: 'https://static.wixstatic.com/ficons/6f7ec1_3d0c9ecdd37b4dcbaff4d9b8bcb4d4fd%7Emv2.ico',
};

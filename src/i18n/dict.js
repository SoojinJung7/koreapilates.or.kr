// 한국어 → 영어 사전. 언어 토글이 화면의 한글 텍스트를 이 표대로 갈아끼운다.
//
// 사전의 키는 **화면에 그려진 텍스트 노드를 trim 한 것과 정확히 같아야** 한다.
// 그래서 문구를 고치면 사전의 키도 같이 어긋난다 — 문구를 바꾼 뒤에는
//   npm run build && node scripts/extract-strings.mjs
// 를 돌려 새 문구를 뽑고 en 을 채워 넣을 것. (키가 없으면 그냥 한국어로 남는다.)
import translations from '../data/translations.json';

export const EN = Object.fromEntries(
  translations.filter((t) => t.en).map((t) => [t.ko, t.en])
);

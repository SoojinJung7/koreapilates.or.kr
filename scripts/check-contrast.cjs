/**
 * 캡처한 PNG 에서 WCAG 명도대비를 실제 픽셀로 검증한다.
 *
 * 왜 픽셀로 재는가:
 *   히어로처럼 영상·그라디언트·반투명 유리가 겹친 화면은 CSS 값만 봐서는
 *   최종 대비를 알 수 없다. 렌더된 결과를 재는 것이 유일하게 정확하다.
 *
 * 왜 "영역"인가:
 *   한 점만 찍으면 글자 획을 배경으로 오인한다(실제로 헤더에서 그렇게 틀렸다).
 *   영역 안의 가장 어두운 픽셀=배경, 가장 밝은 픽셀=글자 로 보고 그 둘의 대비를 낸다.
 *   (밝은 글자/어두운 배경 조합 기준. 반대 조합도 같은 식으로 성립한다.)
 *
 * 사용:
 *   node scripts/check-contrast.cjs shot.png '{"헤더":[350,33,505,20,4.5]}'
 *   영역 = [x, y, width, height, 요구대비]   본문 4.5 / 큰 글자(24px+ 또는 19px+bold) 3.0
 */
const sharp = require('sharp');

const L = (r, g, b) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const CR = (a, b) => { const hi = Math.max(a, b), lo = Math.min(a, b); return (hi + 0.05) / (lo + 0.05); };

async function audit(file, regions) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  return Object.entries(regions).map(([label, [x0, y0, w, h, need]]) => {
    let lo = 2, hi = -1;
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) {
        const i = (y * info.width + x) * info.channels;
        const l = L(data[i], data[i + 1], data[i + 2]);
        if (l < lo) lo = l;
        if (l > hi) hi = l;
      }
    }
    const cr = CR(hi, lo);
    return { label, cr, need, pass: cr >= need };
  });
}

module.exports = audit;

if (require.main === module) {
  const [file, json] = process.argv.slice(2);
  if (!file || !json) {
    console.error('사용: node scripts/check-contrast.cjs <png> \'{"라벨":[x,y,w,h,요구대비]}\'');
    process.exit(1);
  }
  audit(file, JSON.parse(json)).then((rows) => {
    let bad = 0;
    for (const r of rows) {
      if (!r.pass) bad++;
      console.log((r.pass ? 'PASS' : 'FAIL'), r.label.padEnd(14), r.cr.toFixed(2) + ':1', '(필요 ' + r.need + ')');
    }
    console.log(bad ? `--- 실패 ${bad}건` : '--- 전부 통과');
    process.exit(bad ? 1 : 0);
  });
}

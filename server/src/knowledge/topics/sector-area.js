import { pick } from '../util.js';

// 扇形面积（小学 6 年级圆 → 初中）
// 公式：S = (θ / 360) × π × r²，即扇形是整个圆的 θ/360。
//
// 答案约定：结果「用 π 表示」，学生只填 π 前面的系数（例如面积 12π 就填 12）。
// 这样答案是有理数、可精确判分，避免 π≈3.14 取近似带来的四舍五入分歧。
// 配套的互动课件（SectorDemo）会按学生当前拖动的 r、θ 直接调用本模块的 solve/explain 出题。

// 半径、圆心角按难度分桶随机取值（真正随机，不再固定 r=6）。
// 答案是「π 的系数」= (θ/360)·r²，保留两位小数即可精确判分，所以 r、θ 可自由随机组合。
const R_BY_DIFF = {
  easy: [2, 3, 4, 5, 6, 8],
  medium: [6, 8, 10, 12, 14],
  hard: [12, 15, 18, 20, 24],
};
const THETA_BY_DIFF = {
  easy: [60, 90, 120, 180],
  medium: [45, 72, 120, 135, 150, 240],
  hard: [30, 72, 135, 150, 240, 270],
};

// 保留两位小数（圆心角任意取值也能得到稳定可判分的系数）
const round2 = (v) => Math.round(v * 100) / 100;

// 系数 = 面积里 π 前面的数 = (θ/360)·r²
const coef = (theta, r) => round2((theta / 360) * r * r);

export default {
  id: 'sector-area',
  objective: '理解扇形是圆的一部分，会用 S=(θ/360)πr² 算面积。',
  title: '扇形的面积',
  category: '图形与几何',
  grades: [6, 9],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const r = pick(R_BY_DIFF[difficulty] || R_BY_DIFF.medium);
    const theta = pick(THETA_BY_DIFF[difficulty] || THETA_BY_DIFF.medium);
    return {
      type: 'numeric',
      stem: `一个扇形的半径是 ${r} cm，圆心角是 ${theta}°。它的面积是多少平方厘米？（结果用 π 表示：例如面积是 5π 就填 5）`,
      visual: { kind: 'sector', r, theta },
      params: { r, theta },
    };
  },

  solve({ r, theta }) {
    return { answer: coef(theta, r) };
  },

  explain({ r, theta }) {
    const c = coef(theta, r);
    const approx = round2(c * 3.14);
    return {
      steps: [
        {
          title: '扇形是圆的一部分',
          detail: `圆心角 ${theta}° 占整个周角 360° 的 ${theta}/360，所以这个扇形就是整个圆的 ${theta}/360。`,
        },
        {
          title: '先想整个圆的面积',
          detail: `半径 r = ${r} cm，整个圆的面积是 π·r² = π×${r}² = ${r * r}π（平方厘米）。`,
        },
        {
          title: '取出扇形那一份',
          detail: `扇形面积 = (θ/360)×π·r² = (${theta}/360)×${r * r}π = ${c}π（平方厘米）。`,
        },
        {
          title: '换成近似值',
          detail: `如果 π 取 3.14，面积 ≈ ${c}×3.14 ≈ ${approx} 平方厘米。本题只要填系数 ${c}。`,
        },
      ],
      whyItWorks:
        '扇形就是圆切下来的一块「饼」，圆心角越大切得越多。圆心角占 360° 的几分之几，扇形面积就是圆面积的几分之几——所以乘上 θ/360 这个比例。',
      commonMistakes: [
        '忘了乘 θ/360，直接把整个圆的面积当成扇形面积。',
        '把半径和直径搞混，r 要用半径。',
        '只算到 π·r² 就停了，没有取扇形那一份。',
      ],
      optionAnalysis: [],
      summary: `半径 ${r} cm、圆心角 ${theta}° 的扇形，面积 = (${theta}/360)×π×${r}² = ${c}π 平方厘米（π 取 3.14 约 ${approx}）。`,
    };
  },

  llmContext({ r, theta }) {
    return `一道扇形面积题：半径 ${r} cm，圆心角 ${theta}°，用 S=(θ/360)πr²，面积是 ${coef(
      theta,
      r
    )}π 平方厘米。`;
  },
};

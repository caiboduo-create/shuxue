import { pick } from '../util.js';

// 扇形面积（小学 6 年级圆 → 初中）
// 公式：S = (θ / 360) × π × r²，即扇形是整个圆的 θ/360。
//
// 答案约定：结果「用 π 表示」，学生只填 π 前面的系数（例如面积 12π 就填 12）。
// 这样答案是有理数、可精确判分，避免 π≈3.14 取近似带来的四舍五入分歧。
// 配套的互动课件（SectorDemo）会按学生当前拖动的 r、θ 直接调用本模块的 solve/explain 出题。

// 预置一批「系数恰为整数」的干净组合，按难度分桶，保证常规练习答案是整数。
const CLEAN = {
  easy: [
    { theta: 90, r: 2 }, // 1π
    { theta: 180, r: 2 }, // 2π
    { theta: 90, r: 4 }, // 4π
    { theta: 120, r: 3 }, // 3π
  ],
  medium: [
    { theta: 60, r: 6 }, // 6π
    { theta: 180, r: 4 }, // 8π
    { theta: 240, r: 3 }, // 6π
    { theta: 45, r: 4 }, // 2π
    { theta: 270, r: 2 }, // 3π
  ],
  hard: [
    { theta: 120, r: 6 }, // 12π
    { theta: 150, r: 6 }, // 15π
    { theta: 30, r: 6 }, // 3π
    { theta: 300, r: 6 }, // 30π
  ],
};

// 保留两位小数（学生从课件拖出的任意角度也能得到稳定可判分的系数）
const round2 = (v) => Math.round(v * 100) / 100;

// 系数 = 面积里 π 前面的数 = (θ/360)·r²
const coef = (theta, r) => round2((theta / 360) * r * r);

export default {
  id: 'sector-area',
  title: '扇形的面积',
  category: '图形与几何',
  grades: [6, 9],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const { theta, r } = pick(CLEAN[difficulty] || CLEAN.medium);
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

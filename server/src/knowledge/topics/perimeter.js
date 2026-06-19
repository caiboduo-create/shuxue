import { randInt, pick } from '../util.js';

// 长方形 / 正方形的周长（小学 3 年级）
export default {
  id: 'perimeter',
  objective: '理解周长的含义，会算长方形和正方形的周长。',
  title: '长方形和正方形的周长',
  category: '图形与几何',
  grades: [3, 4],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const max = difficulty === 'easy' ? 10 : difficulty === 'hard' ? 50 : 20;
    const unit = '厘米';
    const shape = pick(['rect', 'square']);
    if (shape === 'square') {
      const s = randInt(2, max);
      return {
        type: 'numeric',
        stem: `一个正方形的边长是 ${s} ${unit}，它的周长是多少 ${unit}？`,
        visual: { kind: 'rect', w: s, h: s, unit, label: '正方形' },
        params: { shape, w: s, h: s, unit },
      };
    }
    let w = randInt(2, max);
    let h = randInt(2, max);
    if (w === h) h = h === max ? h - 1 : h + 1; // 避免变成正方形
    return {
      type: 'numeric',
      stem: `一个长方形长 ${w} ${unit}、宽 ${h} ${unit}，它的周长是多少 ${unit}？`,
      visual: { kind: 'rect', w, h, unit, label: '长方形' },
      params: { shape: 'rect', w, h, unit },
    };
  },

  solve({ w, h }) {
    return { answer: 2 * (w + h) };
  },

  explain({ shape, w, h, unit }) {
    const ans = 2 * (w + h);
    if (shape === 'square') {
      return {
        steps: [
          { title: '回忆公式', detail: '正方形四条边一样长，周长 = 边长 × 4。' },
          { title: '代入数据', detail: `边长是 ${w} ${unit}，所以周长 = ${w} × 4。` },
          { title: '算出结果', detail: `${w} × 4 = ${ans}（${unit}）。` },
        ],
        whyItWorks: '周长就是绕图形一圈的总长度。正方形四条边相等，所以乘 4 最快。',
        commonMistakes: ['把"× 4"写成"× 2"。', '忘记写单位。'],
        summary: `正方形周长 = 边长 × 4 = ${w} × 4 = ${ans} ${unit}。`,
      };
    }
    return {
      steps: [
        { title: '回忆公式', detail: '长方形周长 = (长 + 宽) × 2。' },
        { title: '先算一组长加宽', detail: `${w} + ${h} = ${w + h}（${unit}）。` },
        { title: '再乘 2', detail: `${w + h} × 2 = ${ans}（${unit}）。` },
      ],
      whyItWorks: '长方形对边相等，一条长加一条宽正好是半圈，再乘 2 就是一整圈的周长。',
      commonMistakes: [
        '只把长和宽相加，忘了乘 2。',
        '把周长和面积搞混（面积是长×宽）。',
      ],
      summary: `长方形周长 = (长 + 宽) × 2 = (${w} + ${h}) × 2 = ${ans} ${unit}。`,
    };
  },

  llmContext({ shape, w, h, unit }) {
    return shape === 'square'
      ? `一道正方形周长题，边长 ${w} ${unit}，答案 ${4 * w} ${unit}。`
      : `一道长方形周长题，长 ${w} ${unit}、宽 ${h} ${unit}，答案 ${2 * (w + h)} ${unit}。`;
  },
};

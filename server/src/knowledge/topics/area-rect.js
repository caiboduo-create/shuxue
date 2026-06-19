import { randInt, pick } from '../util.js';

// 长方形 / 正方形的面积（小学 3 年级）
export default {
  id: 'area-rect',
  title: '长方形和正方形的面积',
  category: '图形与几何',
  grades: [3, 4],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const max = difficulty === 'easy' ? 9 : difficulty === 'hard' ? 30 : 15;
    const unit = '厘米';
    const shape = pick(['rect', 'square']);
    if (shape === 'square') {
      const s = randInt(2, max);
      return {
        type: 'numeric',
        stem: `一个正方形的边长是 ${s} ${unit}，它的面积是多少平方${unit}？`,
        visual: { kind: 'rect', w: s, h: s, unit, label: '正方形', grid: true },
        params: { shape, w: s, h: s, unit },
      };
    }
    let w = randInt(2, max);
    let h = randInt(2, max);
    if (w === h) h = h === max ? h - 1 : h + 1;
    return {
      type: 'numeric',
      stem: `一个长方形长 ${w} ${unit}、宽 ${h} ${unit}，它的面积是多少平方${unit}？`,
      visual: { kind: 'rect', w, h, unit, label: '长方形', grid: true },
      params: { shape: 'rect', w, h, unit },
    };
  },

  solve({ w, h }) {
    return { answer: w * h };
  },

  explain({ shape, w, h, unit }) {
    const ans = w * h;
    if (shape === 'square') {
      return {
        steps: [
          { title: '回忆公式', detail: '正方形面积 = 边长 × 边长。' },
          { title: '代入数据', detail: `边长是 ${w} ${unit}，所以面积 = ${w} × ${w}。` },
          { title: '算出结果', detail: `${w} × ${w} = ${ans}（平方${unit}）。` },
        ],
        whyItWorks: '面积表示图形铺满了多少个单位小方格。边长 × 边长，正好数出方格总数。',
        commonMistakes: ['把面积算成了周长（周长是边长×4）。', '单位忘了写"平方"。'],
        summary: `正方形面积 = 边长² = ${w} × ${w} = ${ans} 平方${unit}。`,
      };
    }
    return {
      steps: [
        { title: '回忆公式', detail: '长方形面积 = 长 × 宽。' },
        { title: '代入数据', detail: `长 ${w} ${unit}、宽 ${h} ${unit}，面积 = ${w} × ${h}。` },
        { title: '算出结果', detail: `${w} × ${h} = ${ans}（平方${unit}）。` },
      ],
      whyItWorks: '把长方形看成一行行的小方格，每行有"长"个，共有"宽"行，所以长×宽就是方格总数。',
      commonMistakes: [
        '把面积和周长搞混：面积用乘法，周长用加法。',
        '面积的单位是"平方厘米"，不是"厘米"。',
      ],
      summary: `长方形面积 = 长 × 宽 = ${w} × ${h} = ${ans} 平方${unit}。`,
    };
  },

  llmContext({ shape, w, h, unit }) {
    return shape === 'square'
      ? `一道正方形面积题，边长 ${w} ${unit}，答案 ${w * w} 平方${unit}。`
      : `一道长方形面积题，长 ${w} ${unit}、宽 ${h} ${unit}，答案 ${w * h} 平方${unit}。`;
  },
};

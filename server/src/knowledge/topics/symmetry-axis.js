import { pick, shuffle } from '../util.js';

// 对称轴（小学 4–5 年级，图形与几何）
// 看图判断一个图形有几条对称轴。这是你最初点名要的知识点之一。
const SHAPES = {
  square: { name: '正方形', axesText: '4 条' },
  rect: { name: '长方形', axesText: '2 条' },
  eqtri: { name: '等边三角形', axesText: '3 条' },
  isotri: { name: '等腰三角形', axesText: '1 条' },
  circle: { name: '圆', axesText: '无数条' },
  para: { name: '平行四边形', axesText: '0 条' },
};

// 所有可能的选项标签（题目从中挑正确项 + 干扰项）
const ALL_LABELS = ['0 条', '1 条', '2 条', '3 条', '4 条', '无数条'];

function buildOptions(correctLabel) {
  const distract = shuffle(ALL_LABELS.filter((l) => l !== correctLabel)).slice(0, 3);
  const opts = shuffle([correctLabel, ...distract]);
  return opts.map((label, i) => ({ key: ['A', 'B', 'C', 'D'][i], label, value: label }));
}

export default {
  id: 'symmetry-axis',
  title: '轴对称图形的对称轴',
  category: '图形与几何',
  grades: [4, 5],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    // 难度决定候选图形：简单只考常见且直观的，困难加入易错的（长方形≠4、平行四边形=0）
    const pool =
      difficulty === 'easy'
        ? ['square', 'eqtri', 'circle']
        : difficulty === 'hard'
        ? ['rect', 'para', 'isotri', 'square']
        : ['square', 'rect', 'eqtri', 'isotri', 'circle'];
    const shape = pick(pool);
    const s = SHAPES[shape];
    return {
      type: 'choice',
      stem: `下面的${s.name}有几条对称轴？`,
      options: buildOptions(s.axesText),
      visual: { kind: 'symmetry', shape },
      params: { shape },
    };
  },

  solve({ shape }) {
    return { correctValue: SHAPES[shape].axesText };
  },

  explain({ shape }) {
    const s = SHAPES[shape];
    const how = {
      square: '正方形沿着两条对角线、以及横竖两条中线对折都能完全重合，所以有 4 条对称轴。',
      rect: '长方形只有横、竖两条中线对折能重合；它的对角线对折两边并不重合，所以是 2 条，不是 4 条。',
      eqtri: '等边三角形从每个顶点到对边中点各有一条对称轴，三个顶点共 3 条。',
      isotri: '等腰三角形只有顶角到底边中点这一条对称轴，所以是 1 条。',
      circle: '圆过圆心的任意一条直线都能把它分成完全重合的两半，所以有无数条对称轴。',
      para: '一般的平行四边形沿任何直线对折两边都无法重合，所以一条对称轴也没有（它是中心对称，不是轴对称）。',
    };
    return {
      steps: [
        {
          title: '什么是对称轴',
          detail: '把图形沿一条直线对折，如果两边能完全重合，这条直线就是它的对称轴。',
        },
        { title: '动手对折看看', detail: `想象把${s.name}沿不同方向对折，数一数有几个方向能完全重合。` },
        { title: '得出答案', detail: how[shape] },
      ],
      whyItWorks: '判断对称轴的本质就是"对折后能否完全重合"，能重合的方向有几个，就有几条对称轴。',
      commonMistakes: [
        '把长方形当成 4 条——它的对角线对折两边并不重合。',
        '以为平行四边形有对称轴——它只是中心对称，不是轴对称。',
        '忘了圆有无数条对称轴。',
      ],
      optionAnalysis: ALL_LABELS.filter((l) => l === s.axesText || ['0 条', '2 条', '4 条', '无数条'].includes(l))
        .slice(0, 4)
        .map((label) => ({
          value: label,
          label,
          correct: label === s.axesText,
          reason: label === s.axesText ? '与图形实际对折结果一致，正确。' : `${s.name}对折后不是${label}。`,
        })),
      summary: `${s.name}有${s.axesText}对称轴。记住：对称轴 = 对折后能完全重合的折痕。`,
    };
  },

  llmContext({ shape }) {
    return `一道小学几何题，判断${SHAPES[shape].name}的对称轴条数，正确答案是${SHAPES[shape].axesText}。`;
  },
};

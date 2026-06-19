import { pick, shuffle } from '../util.js';

// 轴对称（小学 4~5 年级，图形与几何）
// 两种问法：
//   A) count       —— 看图，这个图形有几条对称轴？（numeric）
//   B) isSymmetric  —— 这个图形是不是轴对称图形？（choice 是/否）
//
// 每个图形的对称轴条数是固定的几何事实，圆有无数条（用 Infinity 表示，只在判断题里出现）。
const SHAPES = {
  square: { name: '正方形', axes: 4, note: '4 条边都相等、4 个角都是直角' },
  rect: { name: '长方形', axes: 2, note: '对边相等，但相邻边不一定相等' },
  equilateral: { name: '等边三角形', axes: 3, note: '三条边都相等' },
  isosceles: { name: '等腰三角形', axes: 1, note: '只有两条腰相等' },
  isoTrapezoid: { name: '等腰梯形', axes: 1, note: '两条腰相等的梯形' },
  pentagon: { name: '正五边形', axes: 5, note: '5 条边都相等' },
  hexagon: { name: '正六边形', axes: 6, note: '6 条边都相等' },
  parallelogram: { name: '平行四边形', axes: 0, note: '对边平行且相等，但不是轴对称图形' },
  circle: { name: '圆', axes: Infinity, note: '任意一条过圆心的直线都是对称轴' },
};

// 数对称轴的题目：排除"无数条"的圆，避免出现无法填写的数值答案
const COUNT_POOL = {
  easy: ['square', 'rect', 'equilateral'],
  medium: ['square', 'rect', 'equilateral', 'isosceles', 'isoTrapezoid'],
  hard: ['pentagon', 'hexagon', 'isosceles', 'isoTrapezoid', 'parallelogram'],
};

// 判断是否轴对称的题目：可以包含圆和平行四边形（典型的"是/否"对比）
const JUDGE_POOL = {
  easy: ['square', 'equilateral', 'circle', 'parallelogram'],
  medium: ['rect', 'isosceles', 'isoTrapezoid', 'parallelogram', 'circle'],
  hard: ['pentagon', 'hexagon', 'parallelogram', 'isoTrapezoid', 'circle'],
};

function axesText(axes) {
  return axes === Infinity ? '无数' : String(axes);
}

export default {
  id: 'symmetry',
  title: '轴对称',
  category: '图形与几何',
  grades: [4, 5],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const form = pick(['count', 'isSymmetric']);

    if (form === 'count') {
      const shape = pick(COUNT_POOL[difficulty] || COUNT_POOL.medium);
      return {
        type: 'numeric',
        stem: `观察下面的${SHAPES[shape].name}，它有几条对称轴？`,
        visual: { kind: 'symmetry', shape },
        params: { form: 'count', shape },
      };
    }

    // isSymmetric：是/否判断
    const shape = pick(JUDGE_POOL[difficulty] || JUDGE_POOL.medium);
    const options = shuffle([
      { value: 'yes', label: '是轴对称图形' },
      { value: 'no', label: '不是轴对称图形' },
    ]).map((o, i) => ({ key: ['A', 'B'][i], label: o.label, value: o.value }));
    return {
      type: 'choice',
      stem: `下面的${SHAPES[shape].name}是轴对称图形吗？`,
      options,
      visual: { kind: 'symmetry', shape },
      params: { form: 'isSymmetric', shape },
    };
  },

  solve({ form, shape }) {
    const axes = SHAPES[shape].axes;
    if (form === 'count') {
      // 圆不进入数对称轴题，这里一定是有限值
      return { answer: axes };
    }
    return { correctValue: axes > 0 ? 'yes' : 'no' };
  },

  explain({ form, shape }) {
    const s = SHAPES[shape];
    const isSym = s.axes > 0;

    if (form === 'count') {
      return {
        steps: [
          {
            title: '什么是对称轴',
            detail:
              '把图形沿一条直线对折，如果两边能完全重合，这条直线就是它的一条对称轴。',
          },
          {
            title: `分析这个${s.name}`,
            detail: `${s.name}${s.note}，可以从不同方向对折试试，看有几条折痕能让两边重合。`,
          },
          {
            title: '数出对称轴',
            detail: `${s.name}一共有 ${axesText(s.axes)} 条对称轴。`,
          },
        ],
        whyItWorks:
          '正多边形有几条边，就有几条对称轴；长方形有 2 条（连接对边中点）；等腰三角形/等腰梯形只有 1 条；平行四边形一条都没有。',
        commonMistakes: [
          '把长方形的对角线当成对称轴——长方形沿对角线对折两边并不重合。',
          '以为平行四边形是轴对称图形——它是中心对称，不是轴对称。',
        ],
        summary: `${s.name}有 ${axesText(s.axes)} 条对称轴。`,
      };
    }

    // isSymmetric 的讲解
    return {
      steps: [
        {
          title: '判断方法',
          detail: '看能不能找到一条直线，沿它对折后图形两边完全重合。能找到就是轴对称图形。',
        },
        {
          title: `分析这个${s.name}`,
          detail: `${s.name}${s.note}。`,
        },
        {
          title: '得出结论',
          detail: isSym
            ? `它能找到 ${axesText(s.axes)} 条这样的对折线，所以是轴对称图形。`
            : '无论沿哪条直线对折，两边都无法完全重合，所以它不是轴对称图形。',
        },
      ],
      whyItWorks:
        '轴对称的关键是"沿某条直线对折后两边重合"。圆、正多边形、正方形、长方形、等腰三角形都满足；而一般的平行四边形不满足（它只是中心对称）。',
      commonMistakes: [
        '把"中心对称"和"轴对称"混淆——平行四边形是中心对称但不是轴对称。',
        '只检查了一个方向就下结论，漏掉了其他可能的对称轴。',
      ],
      optionAnalysis: [
        {
          value: 'yes',
          label: '是轴对称图形',
          correct: isSym,
          reason: isSym
            ? `${s.name}能沿对称轴对折后两边重合，正确。`
            : `${s.name}找不到能对折重合的直线，所以这个选项错误。`,
        },
        {
          value: 'no',
          label: '不是轴对称图形',
          correct: !isSym,
          reason: !isSym
            ? `${s.name}不能沿任何直线对折重合，正确。`
            : `${s.name}其实有 ${axesText(s.axes)} 条对称轴，所以这个选项错误。`,
        },
      ],
      summary: isSym
        ? `${s.name}是轴对称图形，有 ${axesText(s.axes)} 条对称轴。`
        : `${s.name}不是轴对称图形。`,
    };
  },

  llmContext({ form, shape }) {
    const s = SHAPES[shape];
    return form === 'count'
      ? `一道小学轴对称题，看图数${s.name}的对称轴条数，正确答案是 ${axesText(s.axes)} 条。`
      : `一道小学轴对称判断题，问${s.name}是不是轴对称图形，正确答案是「${
          s.axes > 0 ? '是' : '不是'
        }」。`;
  },
};

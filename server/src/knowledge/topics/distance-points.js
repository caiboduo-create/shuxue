import { randInt, pick } from '../util.js';

// 平面直角坐标系中两点间的距离（初中 8 年级）
// 这是你最初点名要的"点到点距离"。用勾股定理，刻意保证答案为整数，便于学生检验。
// 常用勾股数：(3,4,5)(6,8,10)(5,12,13)(8,15,17)(9,12,15)
const TRIPLES = [
  [3, 4],
  [4, 3],
  [6, 8],
  [8, 6],
  [5, 12],
  [9, 12],
];

export default {
  id: 'distance-points',
  title: '平面直角坐标系中两点间的距离',
  category: '图形与几何',
  grades: [8],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    let ax = randInt(0, 6);
    let ay = randInt(0, 6);
    let dx;
    let dy;

    if (difficulty === 'easy') {
      // 简单：横向或纵向，距离就是坐标差，整数
      if (pick([true, false])) {
        dx = randInt(2, 8);
        dy = 0;
      } else {
        dx = 0;
        dy = randInt(2, 8);
      }
    } else {
      // 中等/困难：用勾股数，斜放，距离仍为整数
      const [a, b] = pick(TRIPLES);
      dx = a;
      dy = b;
    }

    const bx = ax + dx;
    const by = ay + dy;
    return {
      type: 'numeric',
      stem: `在平面直角坐标系中，点 A(${ax}, ${ay}) 和点 B(${bx}, ${by}) 之间的距离是多少？`,
      visual: { kind: 'points', ax, ay, bx, by, legs: difficulty !== 'easy' },
      params: { ax, ay, bx, by },
    };
  },

  solve({ ax, ay, bx, by }) {
    return { answer: Math.hypot(bx - ax, by - ay) };
  },

  explain({ ax, ay, bx, by }) {
    const dx = bx - ax;
    const dy = by - ay;
    const d = Math.hypot(dx, dy);
    const steps = [
      {
        title: '记住两点间距离公式',
        detail: '在坐标系里，两点 (x₁,y₁) 和 (x₂,y₂) 的距离 d = √[(x₂−x₁)² + (y₂−y₁)²]。',
      },
      {
        title: '算横纵坐标差',
        detail: `横坐标差 = ${bx} − ${ax} = ${dx}；纵坐标差 = ${by} − ${ay} = ${dy}。`,
      },
      {
        title: '代入公式',
        detail: `d = √[(${dx})² + (${dy})²] = √(${dx * dx} + ${dy * dy}) = √${dx * dx + dy * dy} = ${d}。`,
      },
    ];
    return {
      steps,
      whyItWorks:
        '距离公式其实就是勾股定理：横坐标差和纵坐标差是直角三角形的两条直角边，两点间的距离就是斜边。',
      commonMistakes: [
        '忘了把坐标差平方，直接相加。',
        '坐标相减时把顺序或正负号搞错（平方后符号不影响，但中间容易算错）。',
        '最后忘了开平方根。',
      ],
      optionAnalysis: [],
      summary: `A、B 两点的距离是 ${d}。方法：横纵坐标差各平方、相加、再开根号（本质是勾股定理）。`,
    };
  },

  llmContext({ ax, ay, bx, by }) {
    return `一道初中题，求坐标系中 A(${ax},${ay}) 与 B(${bx},${by}) 两点的距离，用距离公式（勾股定理），答案是 ${Math.hypot(
      bx - ax,
      by - ay
    )}。`;
  },
};

import { randInt, pick } from '../util.js';

// 一元一次方程 ax + b = c（初中 7 年级）。保证解为整数
// 多套问法，避免同一知识点题目语义单一
const STEMS = [
  (eq) => `解方程：${eq}，求 x。`,
  (eq) => `求未知数 x：${eq}。`,
  (eq) => `已知 ${eq}，那么 x 等于多少？`,
  (eq) => `一个数 x 满足 ${eq}，这个数是多少？`,
];

export default {
  id: 'linear-eq',
  objective: '会用移项和系数化一，解一元一次方程。',
  title: '一元一次方程',
  category: '方程与代数',
  grades: [7],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    let a, x;
    if (difficulty === 'easy') {
      a = randInt(1, 5);
      x = randInt(1, 9);
    } else if (difficulty === 'hard') {
      a = pick([-6, -5, -4, -3, 3, 4, 5, 6]);
      x = randInt(-9, 9);
    } else {
      a = randInt(2, 8);
      x = randInt(-5, 9);
    }
    const b = randInt(-12, 12);
    const c = a * x + b;
    const bSign = b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`;
    const eq = `${a}x ${bSign} = ${c}`;
    return {
      type: 'numeric',
      stem: pick(STEMS)(eq),
      params: { a, b, c },
    };
  },

  solve({ a, b, c }) {
    return { answer: (c - b) / a };
  },

  explain({ a, b, c }) {
    const x = (c - b) / a;
    const bSign = b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`;
    const moved = c - b;
    return {
      steps: [
        { title: '目标：把 x 单独留下', detail: `方程是 ${a}x ${bSign} = ${c}，我们要一步步把 x 解出来。` },
        {
          title: '第一步：移项',
          detail: `把常数项 ${b >= 0 ? `+${b}` : b} 移到等号右边（移项要变号）：${a}x = ${c} ${
            b >= 0 ? `− ${b}` : `+ ${Math.abs(b)}`
          } = ${moved}。`,
        },
        { title: '第二步：系数化为 1', detail: `两边同时除以 ${a}：x = ${moved} ÷ ${a} = ${x}。` },
        { title: '第三步：检验', detail: `代回原方程：${a}×${x} ${bSign} = ${a * x + b}，等于右边 ${c}，正确。` },
      ],
      whyItWorks:
        '解方程的核心是"等式两边做同样的操作，等号依然成立"。移项和两边同除，都是为了把 x 一点点孤立出来。',
      commonMistakes: [
        '移项忘记变号（加号移过去要变减号）。',
        '系数化 1 时只除了一边。',
        `${a < 0 ? '系数是负数时，两边同除负数容易把符号算错。' : '除法算错。'}`,
      ],
      summary: `x = ${x}。解一元一次方程三步走：移项 → 系数化 1 → 检验。`,
    };
  },

  llmContext({ a, b, c }) {
    return `一道一元一次方程题：${a}x + (${b}) = ${c}，解得 x = ${(c - b) / a}。`;
  },
};

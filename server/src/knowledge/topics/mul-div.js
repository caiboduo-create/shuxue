import { randInt, pick } from '../util.js';

// 乘除法（小学 2-4 年级）。除法保证整除，避免小学阶段出现余数/小数
const STEMS_MUL = [
  (a, b) => `计算：${a} × ${b} = ?`,
  (a, b) => `每盒有 ${b} 支铅笔，${a} 盒一共有多少支？`,
  (a, b) => `一排坐 ${b} 人，坐满 ${a} 排，一共坐多少人？`,
];
const STEMS_DIV = [
  (a, b) => `计算：${a} ÷ ${b} = ?`,
  (a, b) => `把 ${a} 个苹果平均分给 ${b} 个小朋友，每人分到几个？`,
  (a, b) => `${a} 米长的彩带，每 ${b} 米剪一段，能剪成几段？`,
];

export default {
  id: 'mul-div',
  title: '乘法与除法',
  category: '数与运算',
  grades: [2, 3, 4],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const op = pick(['×', '÷']);
    let a, b;
    if (difficulty === 'easy') {
      a = randInt(2, 9);
      b = randInt(2, 9);
    } else if (difficulty === 'hard') {
      a = randInt(11, 25);
      b = randInt(3, 12);
    } else {
      a = randInt(2, 12);
      b = randInt(2, 9);
    }
    if (op === '×') {
      return { type: 'numeric', stem: pick(STEMS_MUL)(a, b), params: { a, b, op } };
    }
    // 除法：用乘积构造被除数，保证整除
    const product = a * b;
    return { type: 'numeric', stem: pick(STEMS_DIV)(product, b), params: { a: product, b, op } };
  },

  solve({ a, b, op }) {
    return { answer: op === '×' ? a * b : a / b };
  },

  explain({ a, b, op }) {
    const ans = op === '×' ? a * b : a / b;
    const steps =
      op === '×'
        ? [
            { title: '理解题意', detail: `求 ${b} 的 ${a} 倍，也就是 ${a} 个 ${b} 相加。` },
            { title: '用乘法口诀', detail: `回忆乘法口诀，${a} × ${b}。` },
            { title: '得出结果', detail: `${a} × ${b} = ${ans}。` },
          ]
        : [
            { title: '理解题意', detail: `求 ${a} 里面包含几个 ${b}，也就是把 ${a} 平均分成 ${b} 份。` },
            { title: '用乘法口诀倒推', detail: `想：几乘 ${b} 等于 ${a}？` },
            { title: '得出结果', detail: `${a} ÷ ${b} = ${ans}，因为 ${ans} × ${b} = ${a}。` },
          ];
    return {
      steps,
      whyItWorks:
        op === '×'
          ? '乘法是加法的简便运算，几个相同的数相加就用乘法。'
          : '除法和乘法互为逆运算，所以可以用乘法口诀倒着想来求商。',
      commonMistakes: [
        '乘法口诀记错，比如把 7×8 算成 54。',
        '除法时把被除数和除数的位置弄反。',
      ],
      summary: `${a} ${op} ${b} = ${ans}。乘除法互为逆运算，口诀要熟。`,
    };
  },

  llmContext({ a, b, op }) {
    return `一道小学${op === '×' ? '乘法' : '除法'}题：${a} ${op} ${b}。`;
  },
};

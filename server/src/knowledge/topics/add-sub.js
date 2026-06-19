import { randInt, pick } from '../util.js';

// 整数加减法（小学 1-3 年级）
// 通过参数范围 + 多套问法模板实现"同知识点多种问法、不重复"
const STEMS_ADD = [
  (a, b) => `计算：${a} + ${b} = ?`,
  (a, b) => `小明有 ${a} 颗糖，妈妈又给了他 ${b} 颗，现在一共有多少颗？`,
  (a, b) => `图书角原来有 ${a} 本书，今天新到了 ${b} 本，现在共有多少本？`,
  (a, b) => `把 ${a} 和 ${b} 加起来，结果是多少？`,
];
const STEMS_SUB = [
  (a, b) => `计算：${a} − ${b} = ?`,
  (a, b) => `停车场原来有 ${a} 辆车，开走了 ${b} 辆，还剩多少辆？`,
  (a, b) => `一根绳子长 ${a} 厘米，剪掉 ${b} 厘米，还剩多少厘米？`,
  (a, b) => `${a} 比 ${b} 多多少？`,
];

function range(difficulty) {
  if (difficulty === 'easy') return [1, 20];
  if (difficulty === 'hard') return [100, 999];
  return [10, 99];
}

export default {
  id: 'add-sub',
  objective: '掌握整数加法和减法，并能解决简单的生活问题。',
  title: '整数加减法',
  category: '数与运算',
  grades: [1, 2, 3],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const [lo, hi] = range(difficulty);
    const op = pick(['+', '-']);
    let a = randInt(lo, hi);
    let b = randInt(lo, hi);
    if (op === '-' && b > a) [a, b] = [b, a]; // 保证不出现负数（小学阶段）
    const stem = op === '+' ? pick(STEMS_ADD)(a, b) : pick(STEMS_SUB)(a, b);
    return { type: 'numeric', stem, params: { a, b, op } };
  },

  solve({ a, b, op }) {
    return { answer: op === '+' ? a + b : a - b };
  },

  explain({ a, b, op }) {
    const ans = op === '+' ? a + b : a - b;
    const steps =
      op === '+'
        ? [
            { title: '第一步：看清要求什么', detail: `这是一道加法题，求 ${a} 和 ${b} 合起来是多少。` },
            { title: '第二步：对齐相加', detail: `个位、十位、百位分别对齐，从个位开始往上加，满十就向前一位进 1。` },
            { title: '第三步：得出结果', detail: `${a} + ${b} = ${ans}。` },
          ]
        : [
            { title: '第一步：看清要求什么', detail: `这是一道减法题，求 ${a} 减去 ${b} 还剩多少。` },
            { title: '第二步：对齐相减', detail: `数位对齐，从个位开始往上减，不够减就向前一位借 1 当 10。` },
            { title: '第三步：得出结果', detail: `${a} − ${b} = ${ans}。` },
          ];
    return {
      steps,
      whyItWorks:
        op === '+'
          ? '加法就是把两部分合并成整体，所以把两个数对齐相加即可。'
          : '减法是从总数里去掉一部分，剩下的就是答案，所以用大数减小数。',
      commonMistakes: [
        '忘记进位或借位，导致结果差 10 或 100。',
        '数位没对齐就直接相加减。',
      ],
      summary: `${a} ${op} ${b} = ${ans}。做这类题的关键是数位对齐 + 处理好进位/借位。`,
    };
  },

  llmContext({ a, b, op }) {
    return `一道小学整数${op === '+' ? '加法' : '减法'}题：${a} ${op} ${b}。`;
  },
};

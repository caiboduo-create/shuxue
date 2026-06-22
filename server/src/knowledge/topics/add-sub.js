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

const SCOPE_CONFIG = {
  'within-5': { lo: 0, hi: 5, ops: ['+', '-'], resultMax: 5 },
  'within-10': { lo: 0, hi: 10, ops: ['+', '-'], resultMax: 10 },
  'plus-within-20-carry': { lo: 2, hi: 9, ops: ['+'], resultMin: 11, resultMax: 20 },
  'minus-within-20-borrow': { minuendLo: 11, minuendHi: 20, subtrahendLo: 2, subtrahendHi: 9, ops: ['-'], borrow: true },
  'within-100-basic': { lo: 1, hi: 99, ops: ['+', '-'], resultMax: 100, noCarry: true, noBorrow: true },
  'within-100-carry': { lo: 10, hi: 99, ops: ['+', '-'], resultMax: 100, carry: true, borrow: true },
  'within-1000': { lo: 100, hi: 999, ops: ['+', '-'], resultMax: 1000 },
  'within-10000': { lo: 1000, hi: 9999, ops: ['+', '-'], resultMax: 9999 },
};

function range(difficulty) {
  // 数值整体增大并分档：易=两位内，中=三位内，难=四位数
  if (difficulty === 'easy') return [1, 80];
  if (difficulty === 'hard') return [300, 4000];
  return [20, 400];
}

function scopedConfig(scope) {
  return scope?.id ? SCOPE_CONFIG[scope.id] : null;
}

function boundedAdd(cfg) {
  for (let i = 0; i < 120; i++) {
    const a = randInt(cfg.lo, cfg.hi);
    const b = randInt(cfg.lo, cfg.hi);
    const sum = a + b;
    if (sum === 0) continue;
    if (cfg.resultMin !== undefined && sum < cfg.resultMin) continue;
    if (cfg.resultMax !== undefined && sum > cfg.resultMax) continue;
    if (cfg.carry && (a % 10) + (b % 10) < 10) continue;
    if (cfg.noCarry && (a % 10) + (b % 10) >= 10) continue;
    return [a, b];
  }
  return [randInt(cfg.lo, cfg.hi), randInt(cfg.lo, cfg.hi)];
}

function boundedSub(cfg) {
  if (cfg.borrow && cfg.minuendLo !== undefined && cfg.subtrahendLo !== undefined) {
    for (let i = 0; i < 120; i++) {
      const a = randInt(cfg.minuendLo, cfg.minuendHi);
      const b = randInt(cfg.subtrahendLo, cfg.subtrahendHi);
      if (a >= b && a % 10 < b % 10) return [a, b];
    }
    return [13, 8];
  }

  let a = randInt(cfg.lo, cfg.hi);
  let b = randInt(cfg.lo, cfg.hi);
  for (let i = 0; i < 80; i++) {
    a = randInt(cfg.lo, cfg.hi);
    b = randInt(cfg.lo, cfg.hi);
    if (b > a) [a, b] = [b, a];
    if (a === 0 && b === 0) continue;
    if (cfg.lo === 0 && b === 0) continue;
    break;
  }
  if (cfg.borrow || cfg.noBorrow) {
    for (let i = 0; i < 120; i++) {
      a = randInt(cfg.lo, cfg.hi);
      b = randInt(cfg.lo, cfg.hi);
      if (b > a) [a, b] = [b, a];
      if (a === 0 && b === 0) continue;
      const hasBorrow = a % 10 < b % 10;
      if (cfg.borrow && hasBorrow) return [a, b];
      if (cfg.noBorrow && !hasBorrow) return [a, b];
    }
  }
  return [a, b];
}

export default {
  id: 'add-sub',
  objective: '掌握整数加法和减法，并能解决简单的生活问题。',
  title: '整数加减法',
  category: '数与运算',
  grades: [1, 2, 3],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty, context = {}) {
    const cfg = scopedConfig(context.scope);
    const op = pick(cfg?.ops || ['+', '-']);
    let a;
    let b;

    if (cfg) {
      [a, b] = op === '+' ? boundedAdd(cfg) : boundedSub(cfg);
    } else {
      const [lo, hi] = range(difficulty);
      a = randInt(lo, hi);
      b = randInt(lo, hi);
      if (op === '-' && b > a) [a, b] = [b, a]; // 保证不出现负数（小学阶段）
    }

    const stem = op === '+' ? pick(STEMS_ADD)(a, b) : pick(STEMS_SUB)(a, b);
    return { type: 'numeric', stem, params: { a, b, op, scopeId: context.scope?.id || null } };
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

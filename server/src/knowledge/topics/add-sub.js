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

function splitTensOnes(n) {
  return { tens: Math.floor(n / 10) * 10, ones: n % 10 };
}

function directAnswer(a, b, op, ans) {
  return {
    aiPolish: false,
    steps: [{ title: '答案', detail: `${a} ${op} ${b} = ${ans}。` }],
    whyItWorks: '',
    commonMistakes: [],
    summary: `${a} ${op} ${b} = ${ans}。`,
  };
}

function countAnswer(a, b, op, ans) {
  return {
    aiPolish: false,
    steps: [
      {
        title: '答案',
        detail:
          op === '+'
            ? `${a} 加 ${b}，可以接着数，答案是 ${ans}。`
            : `${a} 减 ${b}，就是拿走 ${b} 个，答案是 ${ans}。`,
      },
    ],
    whyItWorks: '',
    commonMistakes: [],
    summary: `${a} ${op} ${b} = ${ans}。`,
  };
}

function makeTwentyCarryExplain(a, b, ans) {
  const first = Math.max(a, b);
  const second = Math.min(a, b);
  const toTen = 10 - first;
  const rest = second - toTen;
  return {
    aiPolish: false,
    steps: [
      { title: '先凑成 10', detail: `${first} 再加 ${toTen} 就是 10。` },
      { title: '再加剩下的数', detail: `${second} 可以分成 ${toTen} 和 ${rest}，所以 ${first} + ${second} = 10 + ${rest} = ${ans}。` },
    ],
    whyItWorks: '先凑成 10，再接着算，会更容易。',
    commonMistakes: [],
    summary: `${a} + ${b} = ${ans}。`,
  };
}

function makeTwentyBorrowExplain(a, b, ans) {
  const ones = a - 10;
  const tenMinus = 10 - b;
  return {
    aiPolish: false,
    steps: [
      { title: '先看成 10 和几', detail: `${a} 可以看成 10 和 ${ones}。` },
      { title: '先算 10 减', detail: `10 - ${b} = ${tenMinus}。` },
      { title: '再加剩下的', detail: `${tenMinus} + ${ones} = ${ans}，所以 ${a} - ${b} = ${ans}。` },
    ],
    whyItWorks: '把十几拆成 10 和几，先用 10 去减，再把剩下的几加回来。',
    commonMistakes: ['不要把十几里的“几”忘记加回来。'],
    summary: `${a} - ${b} = ${ans}。`,
  };
}

function makeHundredBasicExplain(a, b, op, ans) {
  const A = splitTensOnes(a);
  const B = splitTensOnes(b);
  const tenPart = op === '+' ? A.tens + B.tens : A.tens - B.tens;
  const onePart = op === '+' ? A.ones + B.ones : A.ones - B.ones;
  return {
    aiPolish: false,
    steps: [
      { title: '分开看', detail: `${a} 可以看成 ${A.tens} 和 ${A.ones}，${b} 可以看成 ${B.tens} 和 ${B.ones}。` },
      {
        title: '分别算',
        detail:
          op === '+'
            ? `先算整十数：${A.tens} + ${B.tens} = ${tenPart}；再算几个一：${A.ones} + ${B.ones} = ${onePart}。`
            : `先算整十数：${A.tens} - ${B.tens} = ${tenPart}；再算几个一：${A.ones} - ${B.ones} = ${onePart}。`,
      },
      { title: '合起来', detail: `${tenPart} 和 ${onePart} 合起来是 ${ans}。` },
    ],
    whyItWorks: '把十个十个的部分和一个一个的部分分开算，再合起来就可以。',
    commonMistakes: [],
    summary: `${a} ${op} ${b} = ${ans}。`,
  };
}

function makeColumnExplain(a, b, op, ans, level = 'hundred') {
  const upperWord = level === 'large' ? '个位、十位、百位等数位' : '个位、十位';
  const adjustWord = op === '+' ? '满十向前一位进 1' : '不够减时向前一位退 1 当 10';
  return {
    steps: [
      { title: '看清运算', detail: `这是一道${op === '+' ? '加法' : '减法'}题：${a} ${op} ${b}。` },
      { title: '按数位计算', detail: `${upperWord}对齐，从个位开始算，${adjustWord}。` },
      { title: '写出答案', detail: `${a} ${op} ${b} = ${ans}。` },
    ],
    whyItWorks: '相同数位表示的大小相同，所以要同一位上的数和同一位上的数相加减。',
    commonMistakes: [op === '+' ? '进位后忘记多加 1。' : '退位后忘记这一位已经少了 1。', '数位没有对齐就直接计算。'],
    summary: `${a} ${op} ${b} = ${ans}。关键是数位对齐，再处理好${op === '+' ? '进位' : '退位'}。`,
  };
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

  explain({ a, b, op, scopeId }) {
    const ans = op === '+' ? a + b : a - b;
    if (scopeId === 'within-5') return directAnswer(a, b, op, ans);
    if (scopeId === 'within-10') return countAnswer(a, b, op, ans);
    if (scopeId === 'plus-within-20-carry') return makeTwentyCarryExplain(a, b, ans);
    if (scopeId === 'minus-within-20-borrow') return makeTwentyBorrowExplain(a, b, ans);
    if (scopeId === 'within-100-basic') return makeHundredBasicExplain(a, b, op, ans);
    if (scopeId === 'within-100-carry') return makeColumnExplain(a, b, op, ans, 'hundred');
    return makeColumnExplain(a, b, op, ans, 'large');
  },

  llmContext({ a, b, op }) {
    return `一道小学整数${op === '+' ? '加法' : '减法'}题：${a} ${op} ${b}。`;
  },
};

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

const SCOPE_CONFIG = {
  'table-mul-2-5': { ops: ['×'], a: [2, 5], b: [2, 9] },
  'table-mul-6-9': { ops: ['×'], a: [6, 9], b: [2, 9] },
  'table-div-2-5': { ops: ['÷'], quotient: [2, 9], divisor: [2, 5] },
  'table-div-6-9': { ops: ['÷'], quotient: [2, 9], divisor: [6, 9] },
  'table-mixed': { ops: ['×', '÷'], a: [2, 9], b: [2, 9], quotient: [2, 9], divisor: [2, 9] },
  'multi-one-digit': { ops: ['×'], a: [12, 999], b: [2, 9] },
  'divide-one-digit': { ops: ['÷'], quotient: [12, 999], divisor: [2, 9] },
  'two-digit-two-digit': { ops: ['×'], a: [12, 99], b: [11, 99] },
  'three-digit-two-digit': { ops: ['×'], a: [100, 999], b: [10, 99] },
  'divide-two-digit': { ops: ['÷'], quotient: [10, 999], divisor: [10, 99] },
};

function scopedConfig(scope) {
  return scope?.id ? SCOPE_CONFIG[scope.id] : null;
}

function scaledRange([lo, hi], difficulty) {
  if (hi <= 9) return [lo, hi];
  if (difficulty === 'easy') return [lo, Math.min(hi, 99)];
  if (difficulty === 'hard') return [Math.min(hi, Math.max(lo, hi >= 100 ? 100 : Math.floor(hi * 0.6))), hi];
  return [lo, Math.min(hi, 399)];
}

function scopedFactors(cfg, difficulty, op) {
  if (op === '×') {
    const [alo, ahi] = scaledRange(cfg.a, difficulty);
    const [blo, bhi] = scaledRange(cfg.b, difficulty);
    return { a: randInt(alo, ahi), b: randInt(blo, bhi), op };
  }

  const [qlo, qhi] = scaledRange(cfg.quotient, difficulty);
  const [dlo, dhi] = scaledRange(cfg.divisor, difficulty);
  const quotient = randInt(qlo, qhi);
  const divisor = randInt(dlo, dhi);
  return { a: quotient * divisor, b: divisor, op };
}

export default {
  id: 'mul-div',
  objective: '理解乘法和除法的意义，熟练口算并会应用。',
  title: '乘法与除法',
  category: '数与运算',
  grades: [2, 3, 4],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty, context = {}) {
    const cfg = scopedConfig(context.scope);
    const op = pick(cfg?.ops || ['×', '÷']);
    let a, b;

    if (cfg) {
      ({ a, b } = scopedFactors(cfg, difficulty, op));
    } else {
      // 因数整体增大并分档（除法用乘积当被除数，保证整除）
      if (difficulty === 'easy') {
        a = randInt(2, 12);
        b = randInt(2, 9);
      } else if (difficulty === 'hard') {
        a = randInt(15, 40);
        b = randInt(6, 20);
      } else {
        a = randInt(3, 20);
        b = randInt(3, 12);
      }
    }

    if (op === '×') {
      return { type: 'numeric', stem: pick(STEMS_MUL)(a, b), params: { a, b, op, scopeId: context.scope?.id || null } };
    }

    if (cfg) {
      return { type: 'numeric', stem: pick(STEMS_DIV)(a, b), params: { a, b, op, scopeId: context.scope?.id || null } };
    }

    // 除法：用乘积构造被除数，保证整除
    const product = a * b;
    return { type: 'numeric', stem: pick(STEMS_DIV)(product, b), params: { a: product, b, op, scopeId: context.scope?.id || null } };
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

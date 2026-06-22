import { randInt, pick } from '../util.js';

const SCOPE = {
  '11-20': {
    title: '11-20 各数的认识',
    hi: 20,
    stems: [
      (n) => `${n} 后面一个数是几？`,
      (n) => `${n} 前面一个数是几？`,
      (n) => `从小到大数，${n} 后面紧挨着的是几？`,
    ],
  },
  'within-100': {
    title: '100 以内数的认识',
    hi: 100,
    stems: [
      (n) => `${n} 后面一个数是几？`,
      (n) => `${n} 前面一个数是几？`,
      (n) => `比 ${n} 多 1 的数是几？`,
      (n) => `比 ${n} 少 1 的数是几？`,
    ],
  },
  'within-10000': {
    title: '万以内数的认识',
    hi: 9999,
    stems: [
      (n) => `${n} 后面一个数是几？`,
      (n) => `${n} 前面一个数是几？`,
      (n) => `比 ${n} 多 1 的数是几？`,
      (n) => `比 ${n} 少 1 的数是几？`,
    ],
  },
};

function scopeConfig(scope) {
  return SCOPE[scope?.id] || SCOPE['11-20'];
}

function nextQuestion(cfg) {
  const n = randInt(11, cfg.hi - 1);
  return { n, answer: n + 1, stem: pick([cfg.stems[0], cfg.stems[2] || cfg.stems[0]])(n), relation: '后面' };
}

function prevQuestion(cfg) {
  const n = randInt(12, cfg.hi);
  return { n, answer: n - 1, stem: pick([cfg.stems[1], cfg.stems[3] || cfg.stems[1]])(n), relation: '前面' };
}

export default {
  id: 'number-sense-basic',
  objective: '认识教材范围内的数，能按顺序数数并比较相邻的数。',
  title: '数的认识',
  category: '数与运算',
  grades: [1, 2],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty, context = {}) {
    const cfg = scopeConfig(context.scope);
    const q = pick([nextQuestion, prevQuestion])(cfg);
    return {
      type: 'numeric',
      stem: q.stem,
      params: { ...q, scopeId: context.scope?.id || '11-20' },
    };
  },

  solve({ answer }) {
    return { answer };
  },

  explain({ n, answer, relation }) {
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `${n} 的${relation}一个数是 ${answer}。` }],
      commonMistakes: [],
      summary: `答案是 ${answer}。`,
    };
  },
};

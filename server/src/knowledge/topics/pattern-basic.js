import { pick, shuffle } from '../util.js';

const PATTERNS = [
  { seq: ['红', '蓝', '红', '蓝', '红'], answer: '蓝', rule: '红、蓝轮流出现' },
  { seq: ['圆', '方', '圆', '方', '圆'], answer: '方', rule: '圆、方轮流出现' },
  { seq: ['1', '2', '3', '1', '2'], answer: '3', rule: '1、2、3 重复出现' },
  { seq: ['大', '小', '小', '大', '小', '小'], answer: '大', rule: '大、小、小重复出现' },
];

export default {
  id: 'pattern-basic',
  objective: '能发现简单重复规律，并接着往下排。',
  title: '找规律',
  category: '数与运算',
  grades: [1, 2],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const p = pick(PATTERNS);
    const choices = shuffle([p.answer, ...PATTERNS.map((x) => x.answer).filter((x) => x !== p.answer)])
      .slice(0, 4)
      .map((value, i) => ({ key: ['A', 'B', 'C', 'D'][i], value, label: value }));
    if (!choices.some((c) => c.value === p.answer)) choices[0] = { key: 'A', value: p.answer, label: p.answer };
    return {
      type: 'choice',
      stem: `找规律：${p.seq.join('、')}、？`,
      options: choices,
      params: p,
    };
  },

  solve({ answer }) {
    return { correctValue: answer };
  },

  explain({ answer, rule }) {
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `规律是：${rule}，所以下一个是${answer}。` }],
      commonMistakes: [],
      summary: `答案是${answer}。`,
    };
  },
};

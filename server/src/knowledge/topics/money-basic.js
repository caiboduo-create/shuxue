import { pick, shuffle } from '../util.js';

const MONEY = [
  { stem: '1 元等于多少角？', answer: 10, unit: '角' },
  { stem: '2 元等于多少角？', answer: 20, unit: '角' },
  { stem: '5 角 + 3 角 = 多少角？', answer: 8, unit: '角' },
  { stem: '9 角 - 4 角 = 多少角？', answer: 5, unit: '角' },
  { stem: '1 元 + 5 角，一共是多少角？', answer: 15, unit: '角' },
];

function options(answer, unit) {
  const values = shuffle([answer, answer + 1, Math.max(0, answer - 1), answer + 5]).slice(0, 4);
  if (!values.includes(answer)) values[0] = answer;
  return values.map((value, i) => ({ key: ['A', 'B', 'C', 'D'][i], value, label: `${value} ${unit}` }));
}

export default {
  id: 'money-basic',
  objective: '认识人民币，会做简单的元、角换算和加减。',
  title: '认识人民币',
  category: '数与运算',
  grades: [1],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const q = pick(MONEY);
    return {
      type: 'choice',
      stem: q.stem,
      options: options(q.answer, q.unit),
      params: q,
    };
  },

  solve({ answer }) {
    return { correctValue: answer };
  },

  explain({ stem, answer, unit }) {
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `${stem} 答案是 ${answer} ${unit}。` }],
      commonMistakes: [],
      summary: `答案是 ${answer} ${unit}。`,
    };
  },
};

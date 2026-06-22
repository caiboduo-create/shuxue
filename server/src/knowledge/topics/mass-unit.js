import { randInt, pick, shuffle } from '../util.js';

const OBJECTS = [
  { object: '一袋大米', unit: '千克' },
  { object: '一个苹果', unit: '克' },
  { object: '一只小狗', unit: '千克' },
  { object: '一块橡皮', unit: '克' },
];

function unitOptions(answer) {
  return shuffle(['克', '千克']).map((label, i) => ({
    key: ['A', 'B'][i],
    value: label,
    label,
  }));
}

export default {
  id: 'mass-unit',
  objective: '认识克和千克，会选择合适的质量单位并做简单计算。',
  title: '克和千克',
  category: '数与运算',
  grades: [2],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    if (difficulty === 'easy') {
      const item = pick(OBJECTS);
      return {
        type: 'choice',
        stem: `${item.object}一般用哪个单位表示比较合适？`,
        options: unitOptions(item.unit),
        params: { form: 'unit', answer: item.unit, object: item.object },
      };
    }
    const a = randInt(1, 8);
    const b = randInt(1, 8);
    const op = pick(['+', '-']);
    const x = op === '-' ? Math.max(a, b) : a;
    const y = op === '-' ? Math.min(a, b) : b;
    return {
      type: 'numeric',
      stem: `${x} 千克 ${op} ${y} 千克 = 多少千克？`,
      params: { form: 'calc', a: x, b: y, op, answer: op === '+' ? x + y : x - y },
    };
  },

  solve({ answer, form }) {
    return form === 'unit' ? { correctValue: answer } : { answer };
  },

  explain(params) {
    if (params.form === 'unit') {
      return {
        aiPolish: false,
        steps: [{ title: '答案', detail: `${params.object}一般用${params.answer}作单位。` }],
        commonMistakes: [],
        summary: `答案是${params.answer}。`,
      };
    }
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `${params.a} ${params.op} ${params.b} = ${params.answer}，所以答案是 ${params.answer} 千克。` }],
      commonMistakes: [],
      summary: `答案是 ${params.answer} 千克。`,
    };
  },
};

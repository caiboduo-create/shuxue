import { randInt, pick } from '../util.js';

const OBJECT_UNITS = [
  { object: '铅笔的长度', unit: '厘米' },
  { object: '橡皮的长度', unit: '厘米' },
  { object: '教室的长度', unit: '米' },
  { object: '门的高度', unit: '米' },
];

export default {
  id: 'length-unit',
  objective: '认识厘米和米，会选择合适的长度单位，并做简单长度加减。',
  title: '长度单位',
  category: '图形与几何',
  grades: [2, 3],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    if (difficulty === 'easy') {
      const item = pick(OBJECT_UNITS);
      return {
        type: 'choice',
        stem: `${item.object}通常用哪个单位比较合适？`,
        options: [
          { key: 'A', value: '厘米', label: '厘米' },
          { key: 'B', value: '米', label: '米' },
        ],
        params: { form: 'unit', answer: item.unit, object: item.object },
      };
    }
    const a = randInt(8, 60);
    const b = randInt(2, 20);
    const op = pick(['+', '-']);
    const x = op === '-' && b > a ? b : a;
    const y = op === '-' && b > a ? a : b;
    return {
      type: 'numeric',
      stem: `一根彩带长 ${x} 厘米，${op === '+' ? `又接上 ${y} 厘米` : `剪去 ${y} 厘米`}，现在长多少厘米？`,
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
      steps: [{ title: '答案', detail: `${params.a} ${params.op} ${params.b} = ${params.answer}，所以答案是 ${params.answer} 厘米。` }],
      commonMistakes: [],
      summary: `答案是 ${params.answer} 厘米。`,
    };
  },
};

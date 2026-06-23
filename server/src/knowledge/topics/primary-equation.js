import { randInt, pick } from '../util.js';

function makeQuestion() {
  const form = pick(['add', 'sub', 'mul']);
  const x = randInt(2, 20);
  const n = randInt(2, 12);
  if (form === 'add') return { form, x, n, stem: `x + ${n} = ${x + n}，x 等于多少？` };
  if (form === 'sub') return { form, x, n, stem: `x - ${n} = ${x - n}，x 等于多少？` };
  return { form, x, n, stem: `${n}x = ${n * x}，x 等于多少？` };
}

export default {
  id: 'primary-equation',
  objective: '会解简单方程，并能用代入检查答案。',
  title: '简易方程',
  category: '方程与代数',
  grades: [5],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const q = makeQuestion();
    return {
      type: 'numeric',
      stem: q.stem,
      params: { ...q, answer: q.x },
    };
  },

  solve({ answer }) {
    return { answer };
  },

  explain({ form, x, n, answer }) {
    const detail =
      form === 'add'
        ? `想：哪个数加 ${n} 等于 ${x + n}？答案是 ${answer}。`
        : form === 'sub'
          ? `想：哪个数减 ${n} 等于 ${x - n}？答案是 ${answer}。`
          : `想：${n} 乘哪个数等于 ${n * x}？答案是 ${answer}。`;
    return {
      aiPolish: false,
      steps: [
        { title: '答案', detail },
        { title: '检查', detail: `把 x = ${answer} 放回原式，等式成立。` },
      ],
      commonMistakes: ['求出答案后没有代回去检查。'],
      summary: `x = ${answer}。`,
    };
  },
};

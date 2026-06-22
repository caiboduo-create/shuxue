import { randInt, pick } from '../util.js';

const STEMS = [
  (total, each) => `${total} 个苹果，每 ${each} 个装一盘，可以装几盘，还剩几个？`,
  (total, each) => `${total} 支铅笔，每 ${each} 支分一组，可以分几组，还剩几支？`,
  (total, each) => `${total} 个同学，每 ${each} 个同学一队，可以分几队，还剩几人？`,
];

export default {
  id: 'remainder-division',
  objective: '理解有余数的除法，会求商和余数。',
  title: '有余数的除法',
  category: '数与运算',
  grades: [2, 3],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const each = difficulty === 'hard' ? randInt(4, 9) : randInt(2, 6);
    const quotient = difficulty === 'easy' ? randInt(2, 5) : randInt(3, 9);
    const remainder = randInt(1, each - 1);
    const total = quotient * each + remainder;
    return {
      type: 'text',
      stem: pick(STEMS)(total, each),
      params: { total, each, quotient, remainder, answer: `${quotient}余${remainder}` },
    };
  },

  solve({ answer }) {
    return { answer };
  },

  explain({ total, each, quotient, remainder }) {
    return {
      aiPolish: false,
      steps: [
        { title: '答案', detail: `${total} ÷ ${each} = ${quotient} 余 ${remainder}。` },
        { title: '检查', detail: `${quotient} 个 ${each} 是 ${quotient * each}，再加剩下的 ${remainder}，正好是 ${total}。` },
      ],
      commonMistakes: ['余数要比每份的数量小。'],
      summary: `答案是 ${quotient}余${remainder}。`,
    };
  },
};

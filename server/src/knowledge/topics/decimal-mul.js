import { randInt, pick } from '../util.js';

function oneDecimal(n) {
  return Number((n / 10).toFixed(1));
}

function round2(n) {
  return Number(n.toFixed(2));
}

export default {
  id: 'decimal-mul',
  objective: '会计算简单小数乘法，并能解决生活中的小数乘法问题。',
  title: '小数乘法',
  category: '数与运算',
  grades: [5],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const a = oneDecimal(randInt(12, difficulty === 'hard' ? 98 : 59));
    const b = difficulty === 'easy' ? randInt(2, 9) : oneDecimal(randInt(12, 49));
    const answer = round2(a * b);
    const stem = pick([
      `计算：${a} × ${b} = ?`,
      `每米彩带 ${a} 元，买 ${b} 米需要多少元？`,
      `一个小数是 ${a}，另一个数是 ${b}，它们的积是多少？`,
    ]);
    return {
      type: 'numeric',
      stem,
      params: { a, b, answer },
    };
  },

  solve({ answer }) {
    return { answer };
  },

  explain({ a, b, answer }) {
    return {
      aiPolish: false,
      steps: [
        { title: '答案', detail: `${a} × ${b} = ${answer}。` },
        { title: '检查', detail: '小数乘法可以先按整数乘法想，再看小数点的位置。' },
      ],
      commonMistakes: ['只算数字，忘记给结果点小数点。'],
      summary: `答案是 ${answer}。`,
    };
  },
};

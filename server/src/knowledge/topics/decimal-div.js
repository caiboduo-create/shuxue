import { randInt, pick } from '../util.js';

function oneDecimal(n) {
  return Number((n / 10).toFixed(1));
}

function round2(n) {
  return Number(n.toFixed(2));
}

export default {
  id: 'decimal-div',
  objective: '会计算简单小数除法，并理解商的小数点位置。',
  title: '小数除法',
  category: '数与运算',
  grades: [5],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const quotient = oneDecimal(randInt(12, difficulty === 'hard' ? 96 : 58));
    const divisor = difficulty === 'easy' ? randInt(2, 9) : pick([2, 4, 5, 8]);
    const dividend = round2(quotient * divisor);
    const stem = pick([
      `计算：${dividend} ÷ ${divisor} = ?`,
      `${dividend} 米绳子平均分成 ${divisor} 段，每段长多少米？`,
      `${dividend} 元买 ${divisor} 个本子，平均每个多少元？`,
    ]);
    return {
      type: 'numeric',
      stem,
      params: { dividend, divisor, answer: quotient },
    };
  },

  solve({ answer }) {
    return { answer };
  },

  explain({ dividend, divisor, answer }) {
    return {
      aiPolish: false,
      steps: [
        { title: '答案', detail: `${dividend} ÷ ${divisor} = ${answer}。` },
        { title: '检查', detail: `${answer} × ${divisor} = ${dividend}，所以商是 ${answer}。` },
      ],
      commonMistakes: ['小数点位置看错，结果会差 10 倍。'],
      summary: `答案是 ${answer}。`,
    };
  },
};

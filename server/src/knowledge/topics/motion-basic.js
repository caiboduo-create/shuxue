import { pick, shuffle } from '../util.js';

const MOVES = [
  { value: '平移', clue: '电梯直直地上升，形状和方向都没有变' },
  { value: '旋转', clue: '风车绕着中间的点转动' },
  { value: '轴对称', clue: '把图形沿中间折起来，两边能完全重合' },
];

function options() {
  return shuffle(MOVES.map(({ value }) => value)).map((label, i) => ({
    key: ['A', 'B', 'C'][i],
    value: label,
    label,
  }));
}

export default {
  id: 'motion-basic',
  objective: '初步认识轴对称、平移和旋转现象。',
  title: '图形的运动',
  category: '图形与几何',
  grades: [2, 4],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const item = pick(MOVES);
    return {
      type: 'choice',
      stem: `下面说的是哪种图形运动？\n${item.clue}`,
      options: options(),
      params: { answer: item.value, clue: item.clue },
    };
  },

  solve({ answer }) {
    return { correctValue: answer };
  },

  explain({ answer, clue }) {
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `${clue}，所以是${answer}。` }],
      commonMistakes: [],
      summary: `答案是${answer}。`,
    };
  },
};

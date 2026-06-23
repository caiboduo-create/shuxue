import { randInt, shuffle } from '../util.js';

function choiceLabels(x, y) {
  const labels = [];
  for (const label of [`(${x}, ${y})`, `(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${Math.max(1, y - 1)})`, `(${Math.max(1, x - 1)}, ${y + 1})`]) {
    if (!labels.includes(label)) labels.push(label);
  }
  return shuffle(labels.slice(0, 4)).map((label, i) => ({
    key: ['A', 'B', 'C', 'D'][i],
    value: label,
    label,
  }));
}

export default {
  id: 'grid-position',
  objective: '会用数对表示具体位置，理解先列后行。',
  title: '位置',
  category: '图形与几何',
  grades: [5],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const x = randInt(2, 8);
    const y = randInt(2, 8);
    const answer = `(${x}, ${y})`;
    return {
      type: 'choice',
      stem: `小华坐在第 ${x} 列、第 ${y} 行。用数对表示他的位置，应写成什么？`,
      options: choiceLabels(x, y),
      params: { x, y, answer },
    };
  },

  solve({ answer }) {
    return { correctValue: answer };
  },

  explain({ x, y, answer }) {
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `数对先写列，再写行，所以第 ${x} 列第 ${y} 行写作 ${answer}。` }],
      commonMistakes: ['把行和列的顺序写反。'],
      summary: `答案是 ${answer}。`,
    };
  },
};

import { pick, shuffle } from '../util.js';

const ANGLES = [
  { value: 'right', label: '直角', clue: '像书本角一样方方正正' },
  { value: 'acute', label: '锐角', clue: '比直角小' },
  { value: 'obtuse', label: '钝角', clue: '比直角大' },
];

function choices() {
  return shuffle(ANGLES.map(({ value, label }) => ({ value, label }))).map((o, i) => ({
    key: ['A', 'B', 'C'][i],
    ...o,
  }));
}

export default {
  id: 'angle-basic',
  objective: '初步认识角，会判断直角、锐角和钝角。',
  title: '角的初步认识',
  category: '图形与几何',
  grades: [2, 4],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const target = pick(ANGLES);
    return {
      type: 'choice',
      stem: `下面说的是哪种角？\n${target.clue}`,
      options: choices(),
      params: { answer: target.value, label: target.label, clue: target.clue },
    };
  },

  solve({ answer }) {
    return { correctValue: answer };
  },

  explain({ label, clue }) {
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `${clue}，所以答案是${label}。` }],
      commonMistakes: [],
      summary: `答案是${label}。`,
    };
  },
};

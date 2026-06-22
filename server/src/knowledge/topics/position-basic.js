import { pick, shuffle } from '../util.js';

const RELATIONS = [
  { value: 'left', label: '左边', question: '小猫在小狗的哪边？', scene: '小猫  小狗' },
  { value: 'right', label: '右边', question: '小狗在小猫的哪边？', scene: '小猫  小狗' },
  { value: 'front', label: '前面', question: '排队时，小红站在小明前面。小红在小明的哪面？', scene: '小红 -> 小明' },
  { value: 'behind', label: '后面', question: '排队时，小明站在小红后面。小明在小红的哪面？', scene: '小红 -> 小明' },
  { value: 'up', label: '上面', question: '书在桌子的上面。书在桌子的哪面？', scene: '书 / 桌子' },
  { value: 'down', label: '下面', question: '足球在椅子的下面。足球在椅子的哪面？', scene: '椅子 / 足球' },
];

function options() {
  return shuffle(RELATIONS.map(({ value, label }) => ({ value, label })))
    .slice(0, 4)
    .map((o, i) => ({ key: ['A', 'B', 'C', 'D'][i], ...o }));
}

export default {
  id: 'position-basic',
  objective: '会用上、下、前、后、左、右描述物体的位置。',
  title: '位置',
  category: '图形与几何',
  grades: [1],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const item = pick(RELATIONS);
    let opts = options();
    if (!opts.some((o) => o.value === item.value)) {
      opts[0] = { key: 'A', value: item.value, label: item.label };
      opts = opts.map((o, i) => ({ ...o, key: ['A', 'B', 'C', 'D'][i] }));
    }
    return {
      type: 'choice',
      stem: item.question,
      options: opts,
      params: { answer: item.value, label: item.label, scene: item.scene },
    };
  },

  solve({ answer }) {
    return { correctValue: answer };
  },

  explain({ label, scene }) {
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `看位置关系：${scene}，答案是${label}。` }],
      commonMistakes: [],
      summary: `答案是${label}。`,
    };
  },
};

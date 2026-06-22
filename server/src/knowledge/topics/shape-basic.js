import { pick, shuffle } from '../util.js';

const SHAPES = {
  solid: [
    { value: 'cuboid', label: '长方体', clue: '像文具盒、砖块一样，面大多是长方形' },
    { value: 'cube', label: '正方体', clue: '像魔方一样，几个面都一样大' },
    { value: 'cylinder', label: '圆柱', clue: '像水杯、易拉罐一样，上下是圆形' },
    { value: 'sphere', label: '球', clue: '像皮球一样，圆圆的，可以滚动' },
  ],
  plane: [
    { value: 'rectangle', label: '长方形', clue: '有四条边，对边一样长' },
    { value: 'square', label: '正方形', clue: '有四条边，四条边都一样长' },
    { value: 'triangle', label: '三角形', clue: '有三条边' },
    { value: 'circle', label: '圆', clue: '没有直直的边，圆圆的' },
  ],
};

function scopeKind(scopeId) {
  return scopeId === 'plane' ? 'plane' : 'solid';
}

export default {
  id: 'shape-basic',
  objective: '认识常见立体图形和平面图形，会根据特征判断图形名称。',
  title: '认识图形',
  category: '图形与几何',
  grades: [1],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty, context = {}) {
    const kind = scopeKind(context.scope?.id);
    const pool = SHAPES[kind];
    const target = pick(pool);
    const options = shuffle(pool.map(({ value, label }) => ({ value, label }))).map((o, i) => ({
      key: ['A', 'B', 'C', 'D'][i],
      ...o,
    }));
    return {
      type: 'choice',
      stem: `下面说的是哪种图形？\n${target.clue}`,
      options,
      params: { answer: target.value, label: target.label, clue: target.clue, scopeId: context.scope?.id || null },
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

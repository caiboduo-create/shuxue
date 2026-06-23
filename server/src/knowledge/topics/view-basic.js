import { pick, shuffle } from '../util.js';

const SCENES = [
  {
    object: '杯子',
    question: '从上面看，一个杯子更像什么图形？',
    answer: '圆形',
    options: ['圆形', '长方形', '三角形'],
    reason: '杯口是圆圆的，从上面看更像圆形。',
  },
  {
    object: '长方体盒子',
    question: '从正面看，一个长方体盒子更像什么图形？',
    answer: '长方形',
    options: ['长方形', '圆形', '三角形'],
    reason: '盒子的正面通常是一个长方形。',
  },
  {
    object: '小正方体',
    question: '从正面看，一个小正方体更像什么图形？',
    answer: '正方形',
    options: ['正方形', '圆形', '梯形'],
    reason: '正方体每个面都像正方形。',
  },
];

function options(scene) {
  return shuffle(scene.options).map((label, i) => ({
    key: ['A', 'B', 'C'][i],
    value: label,
    label,
  }));
}

export default {
  id: 'view-basic',
  objective: '能从前面、侧面、上面观察简单物体。',
  title: '观察物体',
  category: '图形与几何',
  grades: [2, 4, 5],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const scene = pick(SCENES);
    return {
      type: 'choice',
      stem: scene.question,
      options: options(scene),
      params: { answer: scene.answer, reason: scene.reason },
    };
  },

  solve({ answer }) {
    return { correctValue: answer };
  },

  explain({ answer, reason }) {
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `${reason}答案是${answer}。` }],
      commonMistakes: [],
      summary: `答案是${answer}。`,
    };
  },
};

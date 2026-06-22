import { pick, shuffle } from '../util.js';

const SETS = [
  { aName: '上衣', a: ['红上衣', '蓝上衣'], bName: '裤子', b: ['黑裤子', '白裤子', '灰裤子'] },
  { aName: '早餐', a: ['包子', '面包'], bName: '饮品', b: ['牛奶', '豆浆', '果汁'] },
  { aName: '路线', a: ['A路', 'B路'], bName: '终点', b: ['公园', '学校', '图书馆'] },
];

function options(answer) {
  return shuffle([answer, answer - 1, answer + 1, answer + 2].filter((n) => n > 0)).slice(0, 4).map((value, i) => ({
    key: ['A', 'B', 'C', 'D'][i],
    value,
    label: String(value),
  }));
}

export default {
  id: 'combination-basic',
  objective: '能按顺序搭配，数出简单搭配的种数。',
  title: '简单搭配',
  category: '综合与实践',
  grades: [2, 3],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const set = pick(SETS);
    const answer = set.a.length * set.b.length;
    return {
      type: 'choice',
      stem: `有 ${set.a.length} 种${set.aName}，${set.b.length} 种${set.bName}，每次各选一种，一共有多少种搭配？`,
      options: options(answer),
      params: { answer, set },
    };
  },

  solve({ answer }) {
    return { correctValue: answer };
  },

  explain({ answer, set }) {
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `每种${set.aName}都可以配 ${set.b.length} 种${set.bName}，一共有 ${answer} 种。` }],
      commonMistakes: [],
      summary: `答案是 ${answer} 种。`,
    };
  },
};

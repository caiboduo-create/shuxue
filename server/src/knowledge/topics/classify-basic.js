import { randInt, pick } from '../util.js';

const GROUPS = [
  { kind: '颜色', a: '红色', b: '蓝色', item: '圆片' },
  { kind: '形状', a: '三角形', b: '圆形', item: '卡片' },
  { kind: '种类', a: '苹果', b: '梨', item: '水果' },
];

export default {
  id: 'classify-basic',
  objective: '会按一个标准分类，并数出每类有多少个。',
  title: '分类与整理',
  category: '统计与概率',
  grades: [1, 2],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const group = pick(GROUPS);
    const aCount = randInt(2, 8);
    const bCount = randInt(2, 8);
    const ask = pick(['a', 'b', 'total']);
    const answer = ask === 'a' ? aCount : ask === 'b' ? bCount : aCount + bCount;
    const askText =
      ask === 'a'
        ? `${group.a}${group.item}有几个？`
        : ask === 'b'
          ? `${group.b}${group.item}有几个？`
          : `一共有几个${group.item}？`;
    return {
      type: 'numeric',
      stem: `按${group.kind}分类：${group.a}${group.item}有 ${aCount} 个，${group.b}${group.item}有 ${bCount} 个。${askText}`,
      params: { group, aCount, bCount, ask, answer },
    };
  },

  solve({ answer }) {
    return { answer };
  },

  explain({ group, aCount, bCount, ask, answer }) {
    const label = ask === 'a' ? group.a : ask === 'b' ? group.b : '全部';
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: ask === 'total' ? `${aCount} + ${bCount} = ${answer}。` : `${label}${group.item}有 ${answer} 个。` }],
      commonMistakes: [],
      summary: `答案是 ${answer}。`,
    };
  },
};

import { randInt, pick } from '../util.js';

const ITEMS = ['跳绳', '拍球', '跑步', '踢毽子'];

export default {
  id: 'data-basic',
  objective: '能读简单统计表，比较数量多少。',
  title: '数据收集整理',
  category: '统计与概率',
  grades: [2, 3],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const a = pick(ITEMS);
    let b = pick(ITEMS);
    while (b === a) b = pick(ITEMS);
    const ask = pick(['more', 'total', 'which']);
    let aCount = randInt(3, 12);
    let bCount = randInt(3, 12);
    if (ask === 'which') {
      for (let i = 0; i < 10 && aCount === bCount; i++) bCount = randInt(3, 12);
      if (aCount === bCount) bCount += 1;
    }
    if (ask === 'which') {
      return {
        type: 'choice',
        stem: `统计表：喜欢${a}的有 ${aCount} 人，喜欢${b}的有 ${bCount} 人。哪一项人数更多？`,
        options: [
          { key: 'A', value: a, label: a },
          { key: 'B', value: b, label: b },
        ],
        params: { ask, a, b, aCount, bCount, answer: aCount >= bCount ? a : b },
      };
    }
    const answer = ask === 'total' ? aCount + bCount : Math.abs(aCount - bCount);
    return {
      type: 'numeric',
      stem:
        ask === 'total'
          ? `统计表：喜欢${a}的有 ${aCount} 人，喜欢${b}的有 ${bCount} 人。一共有多少人？`
          : `统计表：喜欢${a}的有 ${aCount} 人，喜欢${b}的有 ${bCount} 人。两项相差多少人？`,
      params: { ask, a, b, aCount, bCount, answer },
    };
  },

  solve({ ask, answer }) {
    return ask === 'which' ? { correctValue: answer } : { answer };
  },

  explain({ ask, a, b, aCount, bCount, answer }) {
    const detail =
      ask === 'which'
        ? `${aCount} 和 ${bCount} 比，较大的那一项人数更多，答案是${answer}。`
        : ask === 'total'
          ? `${aCount} + ${bCount} = ${answer}。`
          : `相差多少用减法：${Math.max(aCount, bCount)} - ${Math.min(aCount, bCount)} = ${answer}。`;
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail }],
      commonMistakes: [],
      summary: ask === 'which' ? `答案是${answer}。` : `答案是 ${answer}。`,
    };
  },
};

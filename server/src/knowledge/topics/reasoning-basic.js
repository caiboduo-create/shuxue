import { pick, shuffle } from '../util.js';

const PEOPLE = ['小红', '小明', '小丽'];
const ITEMS = ['足球', '跳绳', '毽子'];

function options(answer) {
  return shuffle(ITEMS).map((label, i) => ({
    key: ['A', 'B', 'C'][i],
    value: label,
    label,
  }));
}

export default {
  id: 'reasoning-basic',
  objective: '能根据简单条件进行排除和推理。',
  title: '简单推理',
  category: '综合与实践',
  grades: [2],
  difficulties: ['easy', 'medium', 'hard'],

  generate() {
    const target = pick(PEOPLE);
    const answer = pick(ITEMS);
    const otherItems = ITEMS.filter((item) => item !== answer);
    const clue = `${target}没有拿${otherItems[0]}，也没有拿${otherItems[1]}。`;
    return {
      type: 'choice',
      stem: `${PEOPLE.join('、')}分别拿着足球、跳绳、毽子。${clue}${target}拿的是什么？`,
      options: options(answer),
      params: { target, answer, otherItems },
    };
  },

  solve({ answer }) {
    return { correctValue: answer };
  },

  explain({ target, answer, otherItems }) {
    return {
      aiPolish: false,
      steps: [{ title: '答案', detail: `${target}不是${otherItems[0]}，也不是${otherItems[1]}，剩下就是${answer}。` }],
      commonMistakes: [],
      summary: `${target}拿的是${answer}。`,
    };
  },
};

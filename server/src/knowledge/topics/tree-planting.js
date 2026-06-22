import { randInt, pick } from '../util.js';

export default {
  id: 'tree-planting',
  objective: '理解植树问题中的间隔数和棵数关系。',
  title: '植树问题',
  category: '综合与实践',
  grades: [5],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const gap = difficulty === 'easy' ? pick([2, 5, 10]) : pick([3, 4, 5, 6, 8]);
    const spaces = randInt(4, difficulty === 'hard' ? 20 : 12);
    const length = gap * spaces;
    const bothEnds = pick([true, false]);
    const answer = bothEnds ? spaces + 1 : spaces - 1;
    return {
      type: 'numeric',
      stem: `一条路长 ${length} 米，每隔 ${gap} 米栽一棵树。${bothEnds ? '两端都栽' : '两端都不栽'}，一共要栽多少棵？`,
      params: { length, gap, spaces, bothEnds, answer },
    };
  },

  solve({ answer }) {
    return { answer };
  },

  explain({ length, gap, spaces, bothEnds, answer }) {
    return {
      aiPolish: false,
      steps: [
        { title: '先算间隔数', detail: `${length} ÷ ${gap} = ${spaces}，所以有 ${spaces} 个间隔。` },
        { title: '再看两端', detail: bothEnds ? `两端都栽，棵数 = 间隔数 + 1 = ${answer}。` : `两端都不栽，棵数 = 间隔数 - 1 = ${answer}。` },
      ],
      commonMistakes: ['把间隔数直接当成棵数。'],
      summary: `答案是 ${answer} 棵。`,
    };
  },
};

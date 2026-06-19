import { randInt, pick } from '../util.js';

// 有理数加减运算（初中 7 年级）。重点训练正负号
function fmt(n) {
  return n < 0 ? `(${n})` : `${n}`;
}

export default {
  id: 'rational-ops',
  objective: '掌握有理数的加减运算，重点突破正负号。',
  title: '有理数加减运算',
  category: '数与运算',
  grades: [7],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const range = difficulty === 'easy' ? 10 : difficulty === 'hard' ? 50 : 20;
    const a = randInt(-range, range);
    const b = randInt(-range, range);
    const op = pick(['+', '-']);
    return {
      type: 'numeric',
      stem: `计算：${fmt(a)} ${op} ${fmt(b)} = ?`,
      params: { a, b, op },
    };
  },

  solve({ a, b, op }) {
    return { answer: op === '+' ? a + b : a - b };
  },

  explain({ a, b, op }) {
    const ans = op === '+' ? a + b : a - b;
    const converted = op === '-' ? `${fmt(a)} + ${fmt(-b)}` : `${fmt(a)} + ${fmt(b)}`;
    return {
      steps: [
        {
          title: '第一步：把减法变加法',
          detail:
            op === '-'
              ? `减去一个数，等于加上它的相反数：${fmt(a)} − ${fmt(b)} = ${converted}。`
              : `本题是加法，直接进入下一步。`,
        },
        {
          title: '第二步：定符号',
          detail:
            '同号相加取相同符号、绝对值相加；异号相加取绝对值大的符号、绝对值相减。',
        },
        { title: '第三步：算结果', detail: `最终 ${fmt(a)} ${op} ${fmt(b)} = ${ans}。` },
      ],
      whyItWorks:
        '有理数运算最容易错的是符号。先把所有减法统一成加法，再用"同号相加、异号相减"的法则定符号，就不容易乱。',
      commonMistakes: [
        '减去负数时忘了"负负得正"，例如 5 − (−3) 应该等于 8。',
        '异号相加时符号取错（要跟绝对值大的那个走）。',
      ],
      summary: `${fmt(a)} ${op} ${fmt(b)} = ${ans}。口诀：减号变加号、负号变相反数，再按同号异号定符号。`,
    };
  },

  llmContext({ a, b, op }) {
    return `一道有理数${op === '+' ? '加法' : '减法'}题：${fmt(a)} ${op} ${fmt(b)}，答案 ${
      op === '+' ? a + b : a - b
    }。`;
  },
};

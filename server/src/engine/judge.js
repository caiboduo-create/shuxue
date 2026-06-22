import { getTopic } from '../knowledge/index.js';
import { simplifyFraction } from '../knowledge/util.js';

// 判题引擎：只负责"对错判定"，与出题/讲解分离
// 无状态：根据 topicId + params 重新求解，再和用户答案比较

function normNumber(s) {
  if (typeof s === 'number') return s;
  if (typeof s !== 'string') return NaN;
  return Number(s.trim().replace(/，/g, '').replace(/。/g, '').replace(/[°厘米平方个度]/g, ''));
}

function normText(s) {
  return String(s)
    .trim()
    .replace(/\s+/g, '')
    .replace(/，/g, ',')
    .replace(/。/g, '')
    .replace(/剩/g, '余');
}

// 解析分数 / 整数 / 小数为 {n, d} 便于比较概率类答案
function parseFraction(s) {
  if (typeof s === 'number') return { n: s, d: 1 };
  const str = String(s).trim();
  if (str.includes('/')) {
    const [n, d] = str.split('/').map((x) => Number(x.trim()));
    if (Number.isFinite(n) && Number.isFinite(d) && d !== 0) return { n, d };
  }
  const num = Number(str);
  if (Number.isFinite(num)) return { n: num, d: 1 };
  return null;
}

function fractionEqual(a, b) {
  if (!a || !b) return false;
  return a.n * b.d === b.n * a.d;
}

export function judge(topicId, params, userAnswer) {
  const topic = getTopic(topicId);
  if (!topic) {
    const err = new Error(`找不到知识点：${topicId}`);
    err.status = 404;
    throw err;
  }

  const solution = topic.solve(params);

  // 1) 选择题：比较 value
  if (solution.correctValue !== undefined) {
    const correct = String(userAnswer).trim() === String(solution.correctValue);
    return { correct, correctValue: solution.correctValue, type: 'choice' };
  }

  // 2) 概率等分数型答案：允许 1/3、2/6、0.333… 等多种等价写法
  if (typeof solution.answer === 'string' && solution.answer.includes('/')) {
    const want = parseFraction(solution.answer);
    const got = parseFraction(userAnswer);
    let correct = fractionEqual(want, got);
    // 也接受最简分数文本完全一致
    if (!correct && got) {
      const sg = simplifyFraction(got.n, got.d).text;
      const sw = simplifyFraction(want.n, want.d).text;
      correct = sg === sw;
    }
    return { correct, correctAnswer: solution.answer, type: 'text' };
  }

  // 3) 文本型答案：例如"3余2"。去掉空格和句号后比较。
  if (typeof solution.answer === 'string' && !Number.isFinite(Number(solution.answer))) {
    const correct = normText(userAnswer) === normText(solution.answer);
    return { correct, correctAnswer: solution.answer, type: 'text' };
  }

  // 4) 数值题：容忍极小浮点误差
  const want = Number(solution.answer);
  const got = normNumber(userAnswer);
  const correct = Number.isFinite(got) && Math.abs(got - want) < 1e-6;
  return { correct, correctAnswer: solution.answer, type: 'numeric' };
}

import { randInt, pick } from '../util.js';

// 一次函数 y = kx + b（初中 8 年级，方程与代数 / 函数）
// 已知 k、b 和某个自变量 x，求对应的函数值 y。参数随机，图示画出坐标系与该直线及点 (x, y)。
// 把 kx + b 格式化成自然的数学写法（处理 k=1/-1、b 的正负号）。
function formatFn(k, b) {
  let kPart;
  if (k === 1) kPart = 'x';
  else if (k === -1) kPart = '−x';
  else kPart = `${k}x`;
  if (b === 0) return `y = ${kPart}`;
  return `y = ${kPart} ${b > 0 ? '+' : '−'} ${Math.abs(b)}`;
}

export default {
  id: 'linear-function',
  objective: '理解 k 是斜率、b 是截距，会求一次函数的函数值。',
  title: '一次函数 y = kx + b',
  category: '方程与代数',
  grades: [8],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    let k;
    let b;
    let x;
    // 斜率保持适中（太大图线会过陡），主要放大 b（截距）与 x（自变量）
    if (difficulty === 'easy') {
      k = pick([1, 2, 3]); // 正斜率，便于看图
      b = randInt(0, 15);
      x = randInt(1, 12);
    } else if (difficulty === 'hard') {
      k = pick([-6, -5, -4, 4, 5, 6]);
      b = randInt(-25, 25);
      x = randInt(-18, 18);
    } else {
      k = pick([-4, -3, -2, 2, 3, 4]);
      b = randInt(-15, 15);
      x = randInt(-12, 12);
    }

    return {
      type: 'numeric',
      stem: `已知一次函数 ${formatFn(k, b)}，当 x = ${x} 时，y 的值是多少？`,
      visual: { kind: 'linear-graph', k, b, x },
      params: { k, b, x },
    };
  },

  solve({ k, b, x }) {
    return { answer: k * x + b };
  },

  explain({ k, b, x }) {
    const y = k * x + b;
    const kx = k * x;
    return {
      steps: [
        {
          title: '看懂函数表达式',
          detail: `${formatFn(k, b)} 表示：把 x 乘以 ${k}，再加上 ${b}，就得到 y。这里 k = ${k} 是斜率，b = ${b} 是直线与 y 轴的交点（截距）。`,
        },
        {
          title: '把 x 的值代入',
          detail: `当 x = ${x} 时，先算 ${k} × ${x} = ${kx}。`,
        },
        {
          title: '再加上 b',
          detail: `y = ${kx} ${b >= 0 ? '+' : '−'} ${Math.abs(b)} = ${y}。`,
        },
      ],
      whyItWorks:
        '一次函数的图象是一条直线。k 决定直线的倾斜程度（k>0 向上、k<0 向下），b 决定直线在 y 轴上的起点。代入某个 x，就是在直线上找到横坐标为 x 的那个点的高度 y。',
      commonMistakes: [
        '运算顺序错：要先算 kx（乘法），再加 b。',
        'x 是负数时，kx 的正负号容易算错。',
        '把 k 和 b 的作用搞混（k 是斜率，b 是截距）。',
      ],
      optionAnalysis: [],
      summary: `当 x = ${x} 时，y = ${k}×${x} ${b >= 0 ? '+' : '−'} ${Math.abs(b)} = ${y}。`,
    };
  },

  llmContext({ k, b, x }) {
    return `一道一次函数求值题：${formatFn(k, b)}，当 x = ${x} 时 y = ${k * x + b}。`;
  },
};

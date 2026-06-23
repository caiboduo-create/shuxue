import { randInt, pick } from '../util.js';

// 点到直线的距离（初中 8–9 年级，建立在两点间距离 / 勾股定理之上）
// 统一用点到直线距离公式：d = |a·x₀ + b·y₀ + c| / √(a² + b²)，直线写成一般式 ax + by + c = 0。
//
// 为了让答案是整数、便于学生自检，刻意分两类构造：
//   easy            ：与坐标轴平行的直线（y = k 或 x = k），距离就是坐标差，分母为 1。
//   medium / hard   ：法向量取勾股数 (3,4) / (4,3)，分母恰为 5；
//                     由给定的点 P(x₀,y₀) 与目标距离 d 反推常数项 c，
//                     使 |a·x₀ + b·y₀ + c| 恰为 5d，于是距离精确等于整数 d。
const NORMALS = [
  [3, 4],
  [4, 3],
];

// 把一般式 ax + by + c = 0 写成中文友好的式子；轴平行时简化成 y = k / x = k。
function formatLine(a, b, c) {
  if (a === 0) return `y = ${-c / b}`; // 0·x + b·y + c = 0
  if (b === 0) return `x = ${-c / a}`; // a·x + 0·y + c = 0
  const terms = [`${a === 1 ? '' : a}x`];
  terms.push(`${b < 0 ? '− ' : '+ '}${Math.abs(b) === 1 ? '' : Math.abs(b)}y`);
  if (c !== 0) terms.push(`${c < 0 ? '− ' : '+ '}${Math.abs(c)}`);
  return `${terms.join(' ')} = 0`;
}

export default {
  id: 'distance-point-line',
  objective: '用点到直线距离公式，求一个点到直线的距离。',
  title: '点到直线的距离',
  category: '图形与几何',
  grades: [8, 9],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    let a;
    let b;
    let c;
    let x0;
    let y0;

    if (difficulty === 'easy') {
      // 与坐标轴平行的直线：距离 = 坐标差，最直观（范围增大）
      const dist = randInt(2, 15);
      const k = randInt(2, 18);
      if (pick([true, false])) {
        // 水平线 y = k  ->  0·x + 1·y − k = 0
        a = 0;
        b = 1;
        c = -k;
        x0 = randInt(0, 6);
        // 点放在线的上方或下方，保证落在第一象限
        y0 = k - dist >= 0 && pick([true, false]) ? k - dist : k + dist;
      } else {
        // 竖直线 x = k  ->  1·x + 0·y − k = 0
        a = 1;
        b = 0;
        c = -k;
        y0 = randInt(0, 6);
        x0 = k - dist >= 0 && pick([true, false]) ? k - dist : k + dist;
      }
    } else {
      // 斜线：法向量为勾股数，分母为 5，反推 c 让答案为整数（距离与坐标整体增大）
      [a, b] = pick(NORMALS);
      const d = difficulty === 'hard' ? pick([4, 5, 6, 8]) : pick([2, 3, 4, 5]);
      const sign = pick([1, -1]);
      // 点坐标取足够大，保证垂足仍落在第一象限内（垂足 ≈ P ∓ 0.8d，避免画图越界裁切）
      x0 = difficulty === 'hard' ? randInt(7, 16) : randInt(5, 12);
      y0 = difficulty === 'hard' ? randInt(7, 16) : randInt(5, 12);
      // |a·x₀ + b·y₀ + c| = 5d  =>  c = sign·5d − (a·x₀ + b·y₀)
      c = sign * 5 * d - (a * x0 + b * y0);
    }

    // 计算包含点 P 与垂足的网格范围，供 SVG 自适应
    const denom = a * a + b * b;
    const n = a * x0 + b * y0 + c;
    const fx = x0 - (n * a) / denom;
    const fy = y0 - (n * b) / denom;
    const maxC = Math.max(6, Math.ceil(x0), Math.ceil(y0), Math.ceil(fx), Math.ceil(fy));

    return {
      type: 'numeric',
      stem: `在平面直角坐标系中，求点 P(${x0}, ${y0}) 到直线 ${formatLine(a, b, c)} 的距离。`,
      visual: { kind: 'point-line', a, b, c, x0, y0, maxC },
      params: { a, b, c, x0, y0 },
    };
  },

  solve({ a, b, c, x0, y0 }) {
    return { answer: Math.abs(a * x0 + b * y0 + c) / Math.hypot(a, b) };
  },

  explain({ a, b, c, x0, y0 }) {
    const num = a * x0 + b * y0 + c;
    const denom = a * a + b * b;
    const d = Math.abs(num) / Math.sqrt(denom);
    const lineText = formatLine(a, b, c);

    const steps = [
      {
        title: '理解“点到直线的距离”',
        detail:
          '从点向直线作垂线，垂线段的长度就是这个点到直线的距离（“垂线段最短”，其他连线都比它长）。',
      },
      {
        title: '把直线写成一般式，记住公式',
        detail: `直线写成 ax + by + c = 0 后，距离公式是 d = |a·x₀ + b·y₀ + c| / √(a² + b²)。本题直线 ${lineText} 中 a = ${a}，b = ${b}，c = ${c}。`,
      },
      {
        title: '代入点 P 的坐标',
        detail: `分子 = |${a}×${x0} + ${b}×${y0} + (${c})| = |${num}| = ${Math.abs(
          num
        )}；分母 = √(${a}² + ${b}²) = √${denom} = ${Math.sqrt(denom)}。`,
      },
      {
        title: '相除得到距离',
        detail: `d = ${Math.abs(num)} ÷ ${Math.sqrt(denom)} = ${d}。`,
      },
    ];

    return {
      steps,
      whyItWorks:
        '公式本质还是勾股定理：把点沿直线方向与垂直方向分解，分母 √(a²+b²) 是直线法向量的长度，用它来把“代入直线方程得到的数值”换算成真正的垂线段长度。',
      commonMistakes: [
        '忘了加绝对值，把距离算成了负数。',
        '没先把直线化成一般式 ax + by + c = 0 就套公式（例如 y = 2x + 1 要先写成 2x − y + 1 = 0）。',
        '分母漏了开平方，或只平方了一项。',
      ],
      optionAnalysis: [],
      summary: `点 P(${x0}, ${y0}) 到直线 ${lineText} 的距离是 ${d}。方法：化成一般式后代入 d = |a·x₀ + b·y₀ + c| / √(a² + b²)。`,
    };
  },

  llmContext({ a, b, c, x0, y0 }) {
    return `一道初中题，求点 P(${x0},${y0}) 到直线 ${formatLine(
      a,
      b,
      c
    )} 的距离，用点到直线距离公式，答案是 ${
      Math.abs(a * x0 + b * y0 + c) / Math.hypot(a, b)
    }。`;
  },
};

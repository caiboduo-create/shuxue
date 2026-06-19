import { randInt } from '../util.js';

// 三角形内角和（小学 4 年级 / 初中 7 年级，图形与几何）
// 核心事实：三角形三个内角和恒为 180°。已知两个角，求第三个角。
// 参数随机生成两个角，保证三个角都是合理正整数（每个角 ≥ 20°），图示按真实角度绘制。
export default {
  id: 'triangle-angle-sum',
  title: '三角形的内角和',
  category: '图形与几何',
  grades: [4, 7],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    // 难度：简单偏向常见的"好看"角度，困难允许更杂的数值
    let a;
    let b;
    let guard = 0;
    do {
      if (difficulty === 'easy') {
        a = randInt(4, 12) * 5; // 20~60，5 的倍数
        b = randInt(4, 12) * 5;
      } else if (difficulty === 'hard') {
        a = randInt(20, 120);
        b = randInt(20, 120);
      } else {
        a = randInt(5, 20) * 5; // 25~100
        b = randInt(5, 20) * 5;
      }
      guard++;
    } while ((a + b > 160 || a + b < 50) && guard < 50); // 留给第三个角 20~130°

    const c = 180 - a - b;
    return {
      type: 'numeric',
      stem: `如图，一个三角形的两个内角分别是 ${a}° 和 ${b}°，那么第三个内角是多少度？`,
      visual: { kind: 'triangle', angles: [a, b, c] },
      params: { a, b },
    };
  },

  solve({ a, b }) {
    return { answer: 180 - a - b };
  },

  explain({ a, b }) {
    const c = 180 - a - b;
    return {
      steps: [
        {
          title: '记住内角和',
          detail: '任意一个三角形，三个内角加起来一定等于 180°。',
        },
        {
          title: '把已知的两个角加起来',
          detail: `已知两个角是 ${a}° 和 ${b}°，先求它们的和：${a} + ${b} = ${a + b}°。`,
        },
        {
          title: '用 180° 减',
          detail: `第三个角 = 180° − ${a + b}° = ${c}°。`,
        },
      ],
      whyItWorks:
        '把三角形的三个角撕下来拼在一起，正好拼成一个平角（180°）。所以无论三角形什么形状，三个内角的和都是 180°。',
      commonMistakes: [
        '把内角和记成 360°（那是四边形）。',
        '两个角先算错和，导致最后结果也错。',
        '结果忘了带单位“°”。',
      ],
      optionAnalysis: [],
      summary: `第三个内角 = 180° − ${a}° − ${b}° = ${c}°。口诀：三角形内角和永远是 180°。`,
    };
  },

  llmContext({ a, b }) {
    return `一道三角形内角和题：已知两个内角 ${a}° 和 ${b}°，由内角和 180° 得第三个角是 ${180 - a - b}°。`;
  },
};

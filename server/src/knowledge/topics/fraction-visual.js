import { randInt, pick } from '../util.js';
import { simplifyFraction } from '../util.js';

// 分数的比较与加减（小学 3–5 年级，数与运算）
// 配方格条形图直观展示分数大小。三种问法，参数随机：
//   compare：比较两个分数大小（选择 > / < / =）
//   add    ：同分母分数相加 a/d + c/d，结果写成最简分数
//   sub    ：同分母分数相减 a/d − c/d，结果写成最简分数
// 答案不下发前端；solve 用 params 重新计算（比较返回 correctValue，加减返回 answer 分数文本）。
export default {
  id: 'fraction-visual',
  title: '分数的比较与加减',
  category: '数与运算',
  grades: [3, 4, 5],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const form = difficulty === 'easy' ? pick(['compare', 'add']) : pick(['compare', 'add', 'sub']);

    if (form === 'compare') {
      if (difficulty === 'easy') {
        // 简单：同分母，比分子即可
        const d = randInt(3, 8);
        let n1 = randInt(1, d - 1);
        let n2 = randInt(1, d - 1);
        return {
          type: 'choice',
          stem: `比较两个分数的大小，应该填哪个符号？\n${n1}/${d} ○ ${n2}/${d}`,
          options: [
            { key: 'A', label: '>（大于）', value: '>' },
            { key: 'B', label: '<（小于）', value: '<' },
            { key: 'C', label: '=（等于）', value: '=' },
          ],
          visual: { kind: 'fraction', layout: 'compare', a: { n: n1, d }, b: { n: n2, d } },
          params: { form: 'compare', a: { n: n1, d }, b: { n: n2, d } },
        };
      }
      // 中等/困难：不同分母
      const d1 = randInt(2, 8);
      let d2 = randInt(2, 8);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);
      return {
        type: 'choice',
        stem: `比较两个分数的大小，应该填哪个符号？\n${n1}/${d1} ○ ${n2}/${d2}`,
        options: [
          { key: 'A', label: '>（大于）', value: '>' },
          { key: 'B', label: '<（小于）', value: '<' },
          { key: 'C', label: '=（等于）', value: '=' },
        ],
        visual: { kind: 'fraction', layout: 'compare', a: { n: n1, d: d1 }, b: { n: n2, d: d2 } },
        params: { form: 'compare', a: { n: n1, d: d1 }, b: { n: n2, d: d2 } },
      };
    }

    // add / sub：同分母，结果为真分数（add 保证 a+c≤d，sub 保证 a>c）
    const d = randInt(difficulty === 'hard' ? 5 : 3, difficulty === 'hard' ? 12 : 8);
    let a;
    let c;
    if (form === 'add') {
      a = randInt(1, d - 1);
      c = randInt(1, d - a); // a + c ≤ d
    } else {
      a = randInt(2, d - 1);
      c = randInt(1, a - 1); // a > c
    }
    const sign = form === 'add' ? '+' : '−';
    return {
      type: 'text',
      stem: `计算：${a}/${d} ${sign} ${c}/${d} = ？（结果写成最简分数）`,
      visual: { kind: 'fraction', layout: 'op', op: form === 'add' ? '+' : '-', a: { n: a, d }, b: { n: c, d } },
      params: { form, a: { n: a, d }, b: { n: c, d } },
    };
  },

  solve({ form, a, b }) {
    if (form === 'compare') {
      // 交叉相乘比较 a.n/a.d 与 b.n/b.d
      const left = a.n * b.d;
      const right = b.n * a.d;
      const correctValue = left > right ? '>' : left < right ? '<' : '=';
      return { correctValue };
    }
    const n = form === 'add' ? a.n + b.n : a.n - b.n;
    return { answer: simplifyFraction(n, a.d).text };
  },

  explain({ form, a, b }) {
    if (form === 'compare') {
      const sym = this.solve({ form, a, b }).correctValue;
      const sameD = a.d === b.d;
      return {
        steps: [
          {
            title: '看分母是否相同',
            detail: sameD
              ? `两个分数分母都是 ${a.d}，分母相同时，分子大的分数就大。`
              : `两个分数分母不同（${a.d} 和 ${b.d}），不能直接比分子。可以通分，或用交叉相乘比较。`,
          },
          {
            title: sameD ? '比较分子' : '交叉相乘',
            detail: sameD
              ? `比较分子：${a.n} 和 ${b.n}。`
              : `${a.n}/${a.d} 与 ${b.n}/${b.d}：交叉相乘，${a.n}×${b.d} = ${a.n * b.d}，${b.n}×${a.d} = ${b.n * a.d}。哪边乘积大，对应的分数就大。`,
          },
          { title: '得出结论', detail: `所以 ${a.n}/${a.d} ${sym} ${b.n}/${b.d}。` },
        ],
        whyItWorks:
          '分数表示把整体平均分后取了几份。分母相同就是每份一样大，谁取得多谁就大；分母不同，可以通分成相同的份，再比分子。',
        commonMistakes: [
          '分母不同时直接比分子（必须先通分或交叉相乘）。',
          '以为分母大的分数就大——其实分母越大，每一份反而越小。',
        ],
        optionAnalysis: ['>', '<', '='].map((v) => ({
          value: v,
          label: v,
          correct: v === sym,
          reason: v === sym ? '与实际比较结果一致，正确。' : '和两个分数的真实大小关系不符。',
        })),
        summary: `${a.n}/${a.d} ${sym} ${b.n}/${b.d}。比较分数：同分母比分子，不同分母先通分。`,
      };
    }

    const n = form === 'add' ? a.n + b.n : a.n - b.n;
    const res = simplifyFraction(n, a.d);
    const sign = form === 'add' ? '+' : '−';
    const raw = `${n}/${a.d}`;
    const simplified = res.text !== raw && res.text !== `${n}/${a.d}`;
    return {
      steps: [
        {
          title: '分母相同，只算分子',
          detail: `两个分数分母都是 ${a.d}，相加减时分母不变，只把分子${form === 'add' ? '相加' : '相减'}。`,
        },
        {
          title: '计算分子',
          detail: `${a.n} ${sign} ${b.n} = ${n}，所以得到 ${raw}。`,
        },
        {
          title: '化成最简分数',
          detail: simplified
            ? `${raw} 还能约分，分子分母同时除以它们的最大公约数，得到 ${res.text}。`
            : `${raw} 已经是最简分数（或整数），结果就是 ${res.text}。`,
        },
      ],
      whyItWorks:
        '同分母分数相加减，就像“同样大小的份”在合并或拿走，份的大小（分母）不变，只是份数（分子）在变，所以分母保持不变、分子做加减。',
      commonMistakes: [
        '把分母也加起来了（分母不变！）。',
        '算完忘了约分，没写成最简分数。',
      ],
      optionAnalysis: [],
      summary: `${a.n}/${a.d} ${sign} ${b.n}/${a.d} = ${raw} = ${res.text}。同分母分数加减：分母不变，分子加减后约分。`,
    };
  },

  llmContext({ form, a, b }) {
    if (form === 'compare') {
      return `一道分数比较大小题：比较 ${a.n}/${a.d} 与 ${b.n}/${b.d}，正确符号是 ${this.solve({ form, a, b }).correctValue}。`;
    }
    const n = form === 'add' ? a.n + b.n : a.n - b.n;
    return `一道同分母分数${form === 'add' ? '加法' : '减法'}题：${a.n}/${a.d} ${form === 'add' ? '+' : '−'} ${b.n}/${a.d}，结果是 ${simplifyFraction(n, a.d).text}。`;
  },
};

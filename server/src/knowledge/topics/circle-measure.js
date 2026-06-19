import { randInt, pick } from '../util.js';

// 圆的面积与周长（小学 6 年级，图形与几何）
// π 取 3.14。两种问法 × 两种已知量，参数随机，避免题目雷同：
//   ask  = 'area'（求面积 S=πr²）| 'circumference'（求周长 C=2πr）
//   given= 'radius'（给半径）   | 'diameter'（给直径，需先 ÷2 求半径）
// 答案绝不下发前端；solve 用 params 重新计算。
const PI = 3.14;
const round2 = (v) => Math.round(v * 100) / 100;

export default {
  id: 'circle-measure',
  title: '圆的面积与周长',
  category: '图形与几何',
  grades: [6],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    // 难度控制半径范围：简单用小整数，困难用较大或含 .5 的半径
    let r;
    if (difficulty === 'easy') r = randInt(1, 5);
    else if (difficulty === 'hard') r = pick([6, 7, 8, 9, 10, 12, 2.5, 3.5, 4.5]);
    else r = randInt(3, 9);

    const ask = pick(['area', 'circumference']);
    // 给直径时取偶数半径，保证直径是整数、好算（困难允许 .5 半径配奇数直径）
    let given = pick(['radius', 'diameter']);
    if (given === 'diameter' && !Number.isInteger(r * 2)) given = 'radius';

    const givenValue = given === 'radius' ? r : r * 2;
    const givenName = given === 'radius' ? '半径' : '直径';
    const askName = ask === 'area' ? '面积' : '周长';
    const askUnit = ask === 'area' ? '平方厘米' : '厘米';

    return {
      type: 'numeric',
      stem: `一个圆的${givenName}是 ${givenValue} 厘米，它的${askName}是多少${askUnit}？（π 取 3.14）`,
      visual: { kind: 'circle', r, given, givenValue },
      params: { r, ask, given, givenValue },
    };
  },

  solve({ r, ask }) {
    const v = ask === 'area' ? PI * r * r : 2 * PI * r;
    return { answer: round2(v) };
  },

  explain({ r, ask, given, givenValue }) {
    const askName = ask === 'area' ? '面积' : '周长';
    const askUnit = ask === 'area' ? '平方厘米' : '厘米';
    const ans = round2(ask === 'area' ? PI * r * r : 2 * PI * r);
    const steps = [
      {
        title: '先确定半径 r',
        detail:
          given === 'radius'
            ? `题目直接给了半径 r = ${r} 厘米。`
            : `题目给的是直径 ${givenValue} 厘米，半径 = 直径 ÷ 2 = ${givenValue} ÷ 2 = ${r} 厘米。`,
      },
      {
        title: '写出公式',
        detail:
          ask === 'area'
            ? '圆的面积 S = π × r × r（π 取 3.14）。'
            : '圆的周长 C = 2 × π × r（π 取 3.14）。',
      },
      {
        title: '代入计算',
        detail:
          ask === 'area'
            ? `S = 3.14 × ${r} × ${r} = ${ans}（${askUnit}）。`
            : `C = 2 × 3.14 × ${r} = ${ans}（${askUnit}）。`,
      },
    ];
    return {
      steps,
      whyItWorks:
        ask === 'area'
          ? '圆可以剪开拼成一个近似的长方形，长约等于周长的一半 πr，宽就是半径 r，所以面积 = πr×r = πr²。'
          : '圆的周长总是直径的 π 倍（π≈3.14），而直径 = 2r，所以周长 = 2πr。',
      commonMistakes: [
        given === 'diameter' ? '题目给的是直径，忘了先除以 2 得到半径。' : '把直径当成半径代入公式。',
        '面积和周长公式记混：面积乘了两个 r，周长只乘一个 r 再乘 2。',
        `单位写错：${askName}的单位是“${askUnit}”。`,
      ],
      optionAnalysis: [],
      summary:
        ask === 'area'
          ? `半径 ${r} 厘米的圆，面积 = 3.14 × ${r}² = ${ans} 平方厘米。`
          : `半径 ${r} 厘米的圆，周长 = 2 × 3.14 × ${r} = ${ans} 厘米。`,
    };
  },

  llmContext({ r, ask, given, givenValue }) {
    const askName = ask === 'area' ? '面积' : '周长';
    const ans = round2(ask === 'area' ? PI * r * r : 2 * PI * r);
    return `一道圆的${askName}题：已知${given === 'radius' ? '半径' : '直径'} ${givenValue} 厘米，π 取 3.14，${askName}是 ${ans}。`;
  },
};

import { randInt, pick, simplifyFraction } from '../util.js';

// 简单概率（初中 7-9 年级）。注意：这个模块只会出概率题，
// 它的 generate / solve / explain 都只产出概率内容，
// 从架构上保证"概率知识点下面绝不会出现三角形等几何题"。
const ITEMS = [
  { name: '球', colors: ['红', '蓝', '黄', '绿'] },
  { name: '卡片', colors: ['红', '黄'] },
  { name: '小球', colors: ['白', '黑'] },
];

export default {
  id: 'probability-basic',
  title: '简单事件的概率',
  category: '统计与概率',
  grades: [7, 8],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const item = pick(ITEMS);
    const n = difficulty === 'hard' ? 3 : 2; // 颜色种类数
    const colors = item.colors.slice(0, n);
    const counts = colors.map(() => randInt(2, difficulty === 'easy' ? 5 : 9));
    const total = counts.reduce((s, x) => s + x, 0);
    const targetIdx = randInt(0, colors.length - 1);
    const target = colors[targetIdx];
    const desc = colors.map((c, i) => `${counts[i]} 个${c}色${item.name}`).join('、');
    return {
      type: 'text',
      stem: `一个不透明的袋子里装着 ${desc}，搅匀后随机摸出一个，摸到${target}色${item.name}的概率是多少？（用最简分数表示，例如 1/3）`,
      params: { fav: counts[targetIdx], total, target, item: item.name },
    };
  },

  solve({ fav, total }) {
    const fr = simplifyFraction(fav, total);
    // 接受 "1/3" 或约分前 "2/6" 或小数等多种写法，judge 里再细化
    return { answer: fr.text, raw: { fav, total } };
  },

  explain({ fav, total, target, item }) {
    const fr = simplifyFraction(fav, total);
    const g = total / fr.d / (fr.n === 0 ? 1 : fr.n / (fr.n || 1)); // 仅用于说明
    return {
      steps: [
        {
          title: '第一步：数清总数',
          detail: `袋子里一共有 ${total} 个${item}，这是所有可能的结果总数。`,
        },
        {
          title: '第二步：数清目标',
          detail: `其中${target}色的有 ${fav} 个，这是我们关心的"有利结果"。`,
        },
        {
          title: '第三步：写成分数并约分',
          detail: `概率 = 有利结果 ÷ 总数 = ${fav}/${total}${
            fr.text !== `${fav}/${total}` ? `，约分后是 ${fr.text}` : '（已是最简）'
          }。`,
        },
      ],
      whyItWorks:
        '概率 = 我们想要的结果数 ÷ 所有可能的结果数。因为每个球被摸到的机会均等，所以直接数个数就行。',
      commonMistakes: [
        `分母写错：分母应是总数 ${total}，不是某一种颜色的个数。`,
        '算出分数后忘记约分成最简形式。',
      ],
      summary: `摸到${target}色的概率 = ${fav}/${total} = ${fr.text}。记住：概率 = 目标数 ÷ 总数。`,
    };
  },

  llmContext({ fav, total, target, item }) {
    return `一道简单概率题：袋子里共 ${total} 个${item}，其中${target}色 ${fav} 个，求摸到${target}色的概率，答案 ${simplifyFraction(
      fav,
      total
    ).text}。`;
  },
};

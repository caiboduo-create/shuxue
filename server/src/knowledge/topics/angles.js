import { randInt, pick, shuffle } from '../util.js';

// 角的认识与分类（小学 4 年级）
// 两种问法：A) 看图判断角的类型  B) 已知一个角，求它的余角/补角
function classify(deg) {
  if (deg < 90) return '锐角';
  if (deg === 90) return '直角';
  if (deg < 180) return '钝角';
  if (deg === 180) return '平角';
  return '周角';
}

export default {
  id: 'angles',
  title: '角的度量与分类',
  category: '图形与几何',
  grades: [4, 5],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const form = difficulty === 'hard' ? pick(['classify', 'complement']) : 'classify';

    if (form === 'classify') {
      // 选一个有代表性的角度
      const deg =
        difficulty === 'easy'
          ? pick([30, 45, 60, 90, 120, 150])
          : pick([25, 50, 75, 90, 110, 135, 160, 180]);
      const types = ['锐角', '直角', '钝角', '平角'];
      const options = shuffle(types).map((t, i) => ({
        key: ['A', 'B', 'C', 'D'][i],
        label: t,
        value: t,
      }));
      return {
        type: 'choice',
        stem: `下图中的角大约是 ${deg}°，它是什么角？`,
        options,
        visual: { kind: 'angle', degrees: deg },
        params: { form: 'classify', deg },
      };
    }

    // complement：求补角（和为 180°）或余角（和为 90°）
    const mode = pick(['complement', 'supplement']);
    const total = mode === 'complement' ? 90 : 180;
    const deg = randInt(20, total - 20);
    return {
      type: 'numeric',
      stem:
        mode === 'complement'
          ? `一个角是 ${deg}°，它的余角是多少度？（两个角的和是 90°）`
          : `一个角是 ${deg}°，它的补角是多少度？（两个角的和是 180°）`,
      visual: { kind: 'angle', degrees: deg },
      params: { form: 'complement', deg, total },
    };
  },

  solve({ form, deg, total }) {
    if (form === 'classify') return { correctValue: classify(deg) };
    return { answer: total - deg };
  },

  explain({ form, deg, total }) {
    if (form === 'classify') {
      const ans = classify(deg);
      return {
        steps: [
          { title: '记住分类标准', detail: '锐角 < 90°，直角 = 90°，90° < 钝角 < 180°，平角 = 180°。' },
          { title: '比一比', detail: `这个角是 ${deg}°，和 90°、180° 比一比，看落在哪个范围。` },
          { title: '得出结论', detail: `${deg}° 属于${ans}。` },
        ],
        whyItWorks: '角的分类完全由它的度数决定，只要和 90°、180° 这两个关键值比较就能判断。',
        commonMistakes: ['把"直角"和"锐角"搞混；直角是正好 90°。', '忘了 180° 是平角而不是钝角。'],
        optionAnalysis: ['锐角', '直角', '钝角', '平角'].map((t) => ({
          value: t,
          label: t,
          correct: t === ans,
          reason: t === ans ? '度数落在该范围内，正确。' : '该类型的度数范围和本题不符。',
        })),
        summary: `${deg}° 是${ans}。判断角的类型，关键是和 90° 与 180° 比大小。`,
      };
    }
    const ans = total - deg;
    const name = total === 90 ? '余角' : '补角';
    return {
      steps: [
        { title: '理解概念', detail: `${name}的意思是：两个角加起来等于 ${total}°。` },
        { title: '列式', detail: `用 ${total}° 减去已知的角：${total} − ${deg}。` },
        { title: '算出结果', detail: `${total} − ${deg} = ${ans}°。` },
      ],
      whyItWorks: `因为两个角的和固定是 ${total}°，所以用总和减去其中一个，就得到另一个。`,
      commonMistakes: [
        '把余角（90°）和补角（180°）的总和记反。',
        '减法算错，结果别忘了带单位"°"。',
      ],
      summary: `${deg}° 的${name}是 ${ans}°。记住：余角凑 90°，补角凑 180°。`,
    };
  },

  llmContext({ form, deg, total }) {
    if (form === 'classify') return `一道角的分类题，角是 ${deg}°，正确答案是${classify(deg)}。`;
    return `一道求${total === 90 ? '余角' : '补角'}的题，已知角 ${deg}°，答案是 ${total - deg}°。`;
  },
};

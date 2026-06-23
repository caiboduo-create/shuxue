import { pick, shuffle } from '../util.js';

// 线段 / 直线 / 射线（小学 4 年级，图形与几何）
// 两种问法：A) 看图判断是什么线  B) 根据特征判断
const NAMES = {
  segment: '线段',
  ray: '射线',
  line: '直线',
};

const FACTS = {
  segment: { ends: 2, extend: '不能向任何一端延伸', measurable: true },
  ray: { ends: 1, extend: '只能向一端无限延伸', measurable: false },
  line: { ends: 0, extend: '可以向两端无限延伸', measurable: false },
};

export default {
  id: 'line-types',
  objective: '区分线段、射线、直线，理解端点个数与能否延伸的不同。',
  title: '线段、射线和直线',
  category: '图形与几何',
  grades: [4],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const form = difficulty === 'easy' ? 'identify' : pick(['identify', 'feature']);
    const variant = pick(['segment', 'ray', 'line']);

    if (form === 'identify') {
      const options = shuffle(
        Object.keys(NAMES).map((k) => ({ value: k, label: NAMES[k] }))
      ).map((o, i) => ({ key: ['A', 'B', 'C'][i], label: o.label, value: o.value }));
      return {
        type: 'choice',
        stem: '观察下面的图形，它是哪一种线？',
        options,
        visual: { kind: 'line', variant },
        params: { form: 'identify', variant },
      };
    }

    // feature：给出一个特征，问对应哪种线
    const feature = pick([
      { text: '有两个端点，可以量出长度', value: 'segment' },
      { text: '只有一个端点，能向一端无限延伸', value: 'ray' },
      { text: '没有端点，能向两端无限延伸', value: 'line' },
    ]);
    const options = shuffle(
      Object.keys(NAMES).map((k) => ({ value: k, label: NAMES[k] }))
    ).map((o, i) => ({ key: ['A', 'B', 'C'][i], label: o.label, value: o.value }));
    return {
      type: 'choice',
      stem: `下面描述的是哪一种线？\n"${feature.text}"`,
      options,
      params: { form: 'feature', variant: feature.value },
    };
  },

  solve({ variant }) {
    return { correctValue: variant };
  },

  explain({ form, variant }) {
    const f = FACTS[variant];
    const steps = [
      {
        title: '记住三种线的区别',
        detail:
          '线段有 2 个端点，长度固定；射线有 1 个端点，向一端无限延伸；直线没有端点，向两端无限延伸。',
      },
      {
        title: form === 'identify' ? '看图找特征' : '抓住描述里的关键词',
        detail:
          form === 'identify'
            ? '看图形两端：有小圆点（端点）就是封口，带箭头就表示无限延伸。'
            : '注意"几个端点"和"能不能延伸"这两个关键信息。',
      },
      {
        title: '得出答案',
        detail: `它${f.extend}，有 ${f.ends} 个端点，所以是${NAMES[variant]}。`,
      },
    ];
    return {
      steps,
      whyItWorks:
        '判断线的种类，本质就看两点：端点的个数，以及能不能无限延伸。这两点决定了它是线段、射线还是直线。',
      commonMistakes: [
        '把射线和直线搞混：射线只有一端能延伸，直线两端都能。',
        '以为线段也能延伸——线段的长度是固定的。',
      ],
      optionAnalysis: Object.keys(NAMES).map((k) => ({
        value: k,
        label: NAMES[k],
        correct: k === variant,
        reason:
          k === variant
            ? '符合题目特征，正确。'
            : `${NAMES[k]}有 ${FACTS[k].ends} 个端点，${FACTS[k].extend}，和题目不符。`,
      })),
      summary: `答案是${NAMES[variant]}。口诀：线段两端封口，射线一端带箭头，直线两端都带箭头。`,
    };
  },

  llmContext({ variant, form }) {
    return `一道小学几何题，考查线段/射线/直线的区分，正确答案是${NAMES[variant]}（${
      form === 'identify' ? '看图判断' : '根据特征判断'
    }）。`;
  },
};

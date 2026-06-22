import { randInt, pick } from '../util.js';

const unitText = (unit) => (unit === 'm' ? '米' : '千米');

export default {
  id: 'ratio-scale',
  objective: '理解比例尺的意义，会在图上距离、实际距离和比例尺之间换算。',
  title: '比例尺与按比例缩放',
  category: '数与运算',
  grades: [5, 6, 7],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty) {
    const form =
      difficulty === 'easy'
        ? pick(['findReal', 'findReal'])
        : difficulty === 'hard'
          ? pick(['findReal', 'findMap', 'scaleShape'])
          : pick(['findReal', 'findMap']);

    if (form === 'scaleShape') {
      const factor = pick([2, 3, 4, 5]);
      const w = randInt(3, 10);
      const h = randInt(2, 8);
      const ask = pick(['width', 'area']);
      return {
        type: 'numeric',
        stem:
          ask === 'width'
            ? `一个长方形长 ${w} cm、宽 ${h} cm。按 ${factor}:1 放大后，新的长是多少厘米？`
            : `一个长方形长 ${w} cm、宽 ${h} cm。按 ${factor}:1 放大后，新的面积是多少平方厘米？`,
        visual: { kind: 'scale', form: 'shape', w, h, factor },
        params: { form, w, h, factor, ask },
      };
    }

    const scale = difficulty === 'hard' ? pick([2500, 5000, 10000, 25000, 50000]) : pick([100, 200, 500, 1000, 2000]);
    const mapCm = form === 'findMap' ? randInt(2, 12) : randInt(2, difficulty === 'hard' ? 18 : 10);
    const realCm = mapCm * scale;
    const unit = realCm >= 100000 ? 'km' : 'm';
    const realValue = unit === 'km' ? realCm / 100000 : realCm / 100;
    const place = pick(['学校到图书馆', '小明家到公园', '甲地到乙地', '操场到教学楼']);

    if (form === 'findReal') {
      return {
        type: 'numeric',
        stem: `一张地图的比例尺是 1:${scale}，图上${place}的距离是 ${mapCm} cm。实际距离是多少${unitText(unit)}？`,
        visual: { kind: 'scale', form: 'map', mapCm, scale, unit },
        params: { form, mapCm, scale, unit },
      };
    }

    return {
      type: 'numeric',
      stem: `一张地图的比例尺是 1:${scale}，实际${place}的距离是 ${realValue} ${unitText(unit)}。图上距离是多少厘米？`,
      visual: { kind: 'scale', form: 'map', mapCm, scale, unit },
      params: { form, realValue, scale, unit },
    };
  },

  solve(params) {
    if (params.form === 'scaleShape') {
      if (params.ask === 'width') return { answer: params.w * params.factor };
      return { answer: params.w * params.h * params.factor * params.factor };
    }

    if (params.form === 'findReal') {
      const realCm = params.mapCm * params.scale;
      return { answer: params.unit === 'km' ? realCm / 100000 : realCm / 100 };
    }

    const realCm = params.unit === 'km' ? params.realValue * 100000 : params.realValue * 100;
    return { answer: realCm / params.scale };
  },

  explain(params) {
    if (params.form === 'scaleShape') {
      const newW = params.w * params.factor;
      const newH = params.h * params.factor;
      const area = newW * newH;
      return {
        steps: [
          { title: '看懂放大比例', detail: `${params.factor}:1 表示每条边都变成原来的 ${params.factor} 倍。` },
          { title: '先算新长和新宽', detail: `新长 = ${params.w} × ${params.factor} = ${newW} cm，新宽 = ${params.h} × ${params.factor} = ${newH} cm。` },
          {
            title: params.ask === 'width' ? '回答题目所问' : '计算新面积',
            detail:
              params.ask === 'width'
                ? `题目问新的长，所以答案是 ${newW} cm。`
                : `新面积 = ${newW} × ${newH} = ${area} 平方厘米。注意面积会变成 ${params.factor}×${params.factor} 倍。`,
          },
        ],
        whyItWorks: '按比例放大或缩小，所有长度都乘同一个倍数。面积由两条长度相乘得到，所以面积会乘两次这个倍数。',
        commonMistakes: ['只把长放大，忘了宽也要放大。', '求面积时只乘一次放大倍数。'],
        optionAnalysis: [],
        summary: params.ask === 'width' ? `新的长是 ${newW} cm。` : `新的面积是 ${area} 平方厘米。`,
      };
    }

    const isKm = params.unit === 'km';
    if (params.form === 'findReal') {
      const realCm = params.mapCm * params.scale;
      const answer = this.solve(params).answer;
      return {
        steps: [
          { title: '理解比例尺', detail: `比例尺 1:${params.scale} 表示图上 1 cm 代表实际 ${params.scale} cm。` },
          { title: '图上距离乘比例尺', detail: `实际距离 = ${params.mapCm} × ${params.scale} = ${realCm} cm。` },
          { title: '换算单位', detail: isKm ? `${realCm} cm = ${answer} 千米。` : `${realCm} cm = ${answer} 米。` },
        ],
        whyItWorks: '比例尺描述的是图上长度和实际长度的固定倍数。知道图上距离，就乘比例尺得到实际距离。',
        commonMistakes: ['忘记把厘米换算成米或千米。', '把乘比例尺误写成除比例尺。'],
        optionAnalysis: [],
        summary: `实际距离是 ${answer} ${unitText(params.unit)}。`,
      };
    }

    const realCm = isKm ? params.realValue * 100000 : params.realValue * 100;
    const answer = this.solve(params).answer;
    return {
      steps: [
        { title: '先统一单位', detail: `${params.realValue} ${unitText(params.unit)} = ${realCm} cm。` },
        { title: '实际距离除以比例尺', detail: `图上距离 = ${realCm} ÷ ${params.scale} = ${answer} cm。` },
        { title: '检查意义', detail: `图上距离比实际距离小很多，得到 ${answer} cm 是合理的。` },
      ],
      whyItWorks: '比例尺 1:n 表示实际距离是图上距离的 n 倍，所以反过来求图上距离时，要用实际距离除以 n。',
      commonMistakes: ['实际距离没有先换成厘米。', '求图上距离时又乘了一次比例尺。'],
      optionAnalysis: [],
      summary: `图上距离是 ${answer} cm。`,
    };
  },

  llmContext(params) {
    const answer = this.solve(params).answer;
    if (params.form === 'scaleShape') return `一道按比例放大图形题，答案是 ${answer}。`;
    return `一道比例尺换算题，答案是 ${answer}${params.form === 'findReal' ? unitText(params.unit) : '厘米'}。`;
  },
};

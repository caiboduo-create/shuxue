import { randInt, pick } from '../util.js';

function timeText(hour, minute) {
  if (minute === 0) return `${hour} 时`;
  if (minute === 30) return `${hour} 时半`;
  return `${hour} 时 ${minute} 分`;
}

function minuteOptions(answer) {
  const candidates = Array.from(new Set([answer, 0, 15, 30, 45, 60].filter((n) => n >= 0 && n < 60)));
  while (candidates.length < 4) {
    const n = pick([5, 10, 20, 25, 35, 40, 50, 55]);
    if (!candidates.includes(n)) candidates.push(n);
  }
  return candidates.slice(0, 4).sort((a, b) => a - b).map((value, i) => ({
    key: ['A', 'B', 'C', 'D'][i],
    value,
    label: `${value} 分`,
  }));
}

function timeOptions(hour, minute) {
  const answer = timeText(hour, minute);
  const pool = [
    answer,
    timeText(hour === 12 ? 1 : hour + 1, minute),
    timeText(hour, minute === 0 ? 30 : 0),
    timeText(hour === 1 ? 12 : hour - 1, minute === 0 ? 30 : 0),
  ];
  return Array.from(new Set(pool)).slice(0, 4).map((label, i) => ({
    key: ['A', 'B', 'C', 'D'][i],
    value: label,
    label,
  }));
}

export default {
  id: 'clock-basic',
  objective: '会认整时、半时，并初步认识几时几分。',
  title: '认识钟表',
  category: '数与运算',
  grades: [1, 2],
  difficulties: ['easy', 'medium', 'hard'],

  generate(difficulty, context = {}) {
    const scope = context.scope?.id || 'whole-half';
    const hour = randInt(1, 12);
    const minute = scope === 'minutes' ? pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]) : pick([0, 30]);
    if (scope === 'minutes' && difficulty !== 'easy') {
      return {
        type: 'choice',
        stem: `钟面上分针指向 ${minute / 5}，表示多少分？`,
        options: minuteOptions(minute),
        params: { form: 'minute-hand', hour, minute, answer: minute, scopeId: scope },
      };
    }
    return {
      type: 'choice',
      stem: `这个时间应该读作什么？`,
      options: timeOptions(hour, minute),
      params: { form: 'read-time', hour, minute, answer: timeText(hour, minute), scopeId: scope },
    };
  },

  solve({ form, answer }) {
    if (form === 'minute-hand') return { correctValue: answer };
    return { correctValue: answer };
  },

  explain({ form, hour, minute, answer }) {
    return {
      aiPolish: false,
      steps: [
        {
          title: '答案',
          detail:
            form === 'minute-hand'
              ? `分针指到 ${minute / 5}，就是 ${minute} 分。`
              : `这个时间读作 ${answer}。`,
        },
      ],
      commonMistakes: [],
      summary: form === 'minute-hand' ? `答案是 ${minute} 分。` : `答案是${answer}。`,
    };
  },
};

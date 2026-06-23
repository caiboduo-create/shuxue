import { getPlacement, getTopic } from '../knowledge/index.js';
import { randomUUID } from 'crypto';

// 出题引擎：只负责"生成题目"，不负责判题或讲解（职责分离）
// 返回给前端的题目里【不包含答案】，但包含 params（用于后续无状态判题/讲解）

// 记录每个知识点上一次出过的题干，用于"防连续重复"——
// 直接回应需求：不能一直重复类似题目。
const lastStemByTopic = new Map();

export function generateQuestion(topicId, difficulty = 'medium', options = {}) {
  const topic = getTopic(topicId);
  if (!topic) {
    const err = new Error(`找不到知识点：${topicId}`);
    err.status = 404;
    throw err;
  }
  if (!topic.difficulties.includes(difficulty)) {
    difficulty = 'medium';
  }
  const placement = getPlacement(options.placementId);
  const title = options.topicTitle || placement?.title || topic.title;
  const context = { placement, scope: placement?.scope || null };

  // 防连续重复：若新题与该知识点上一题题干完全相同，重新生成（最多重试 6 次，避免死循环）
  const repeatKey = `${topic.id}:${placement?.placementId || 'base'}`;
  const last = lastStemByTopic.get(repeatKey);
  let q = topic.generate(difficulty, context);
  for (let i = 0; i < 6 && q.stem === last; i++) {
    q = topic.generate(difficulty, context);
  }
  lastStemByTopic.set(repeatKey, q.stem);

  // 对选择题，剥离 isCorrect/正确标记，只留 key/label/value
  let optionList;
  if (q.options) {
    optionList = q.options.map(({ key, label, value }) => ({ key, label, value }));
  }

  return {
    id: randomUUID(),
    topicId: topic.id,
    topicTitle: title,
    baseTopicTitle: topic.title,
    placementId: placement?.placementId || null,
    curriculum: placement
      ? {
          bookTitle: placement.bookTitle,
          volumeLabel: placement.volumeLabel,
          unit: placement.unit,
          unitTitle: placement.unitTitle,
        }
      : null,
    category: topic.category,
    difficulty,
    type: q.type, // 'numeric' | 'choice' | 'text'
    stem: q.stem,
    options: optionList,
    visual: q.visual || null,
    params: q.params, // 前端答题后会原样回传，供判题/讲解使用
  };
}

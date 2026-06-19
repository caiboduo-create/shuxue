// 用浏览器本地存储保存错题本和学习进度（MVP 阶段无需后端数据库）。
// 未来要做多端同步，可把这一层替换成后端 API，其它代码几乎不用改。

const WRONG_KEY = 'mathai.wrongbook.v1';
const STAT_KEY = 'mathai.stats.v1';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

/* —— 错题本 —— */
export function getWrongBook() {
  return read(WRONG_KEY, []);
}

// 判断两条错题是不是"同一道题"：知识点相同且参数完全一致
function sameQuestion(a, b) {
  if (!a.params || !b.params) return false;
  return a.topicId === b.topicId && JSON.stringify(a.params) === JSON.stringify(b.params);
}

export function addWrong(entry) {
  // 同一道题只保留最新一条，避免错题本里同题重复堆积
  const list = getWrongBook().filter((w) => !sameQuestion(w, entry));
  list.unshift({ ...entry, ts: Date.now() });
  write(WRONG_KEY, list.slice(0, 200)); // 最多保留 200 条
}
export function removeWrong(ts) {
  write(
    WRONG_KEY,
    getWrongBook().filter((w) => w.ts !== ts)
  );
}
// 做对某道题后，自动把错题本里这道题（同知识点 + 同参数）移除，形成"做对即清除"的闭环
export function resolveWrong(topicId, params) {
  const list = getWrongBook();
  const key = JSON.stringify(params);
  const next = list.filter(
    (w) => !(w.topicId === topicId && w.params && JSON.stringify(w.params) === key)
  );
  if (next.length !== list.length) {
    write(WRONG_KEY, next);
    return true;
  }
  return false;
}
export function clearWrong() {
  write(WRONG_KEY, []);
}

/* —— 学习进度统计 —— */
// 结构：{ total, correct, byTopic: { topicId: {title, total, correct} } }
export function getStats() {
  return read(STAT_KEY, { total: 0, correct: 0, byTopic: {} });
}
export function recordAnswer({ topicId, topicTitle, correct }) {
  const s = getStats();
  s.total += 1;
  if (correct) s.correct += 1;
  const t = s.byTopic[topicId] || { title: topicTitle, total: 0, correct: 0 };
  t.total += 1;
  if (correct) t.correct += 1;
  t.title = topicTitle;
  s.byTopic[topicId] = t;
  write(STAT_KEY, s);
  return s;
}
export function resetStats() {
  write(STAT_KEY, { total: 0, correct: 0, byTopic: {} });
}

// 找出正确率最低的知识点（薄弱点），用于"针对薄弱点继续出题"
export function weakestTopic(minAttempts = 2) {
  return weakTopics({ minAttempts })[0] || null;
}

// 薄弱知识点列表：正确率 < 100% 且练习达到最少次数，按正确率升序（最薄弱的排最前）
export function weakTopics({ minAttempts = 2 } = {}) {
  const s = getStats();
  return Object.entries(s.byTopic)
    .map(([id, t]) => ({ id, title: t.title, total: t.total, correct: t.correct, rate: t.correct / t.total }))
    .filter((t) => t.total >= minAttempts && t.rate < 1)
    .sort((a, b) => a.rate - b.rate);
}

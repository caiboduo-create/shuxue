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
export function addWrong(entry) {
  const list = getWrongBook();
  list.unshift({ ...entry, ts: Date.now() });
  write(WRONG_KEY, list.slice(0, 200)); // 最多保留 200 条
}
export function removeWrong(ts) {
  write(
    WRONG_KEY,
    getWrongBook().filter((w) => w.ts !== ts)
  );
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
export function weakestTopic(minAttempts = 3) {
  const s = getStats();
  let weakest = null;
  for (const [id, t] of Object.entries(s.byTopic)) {
    if (t.total < minAttempts) continue;
    const rate = t.correct / t.total;
    if (!weakest || rate < weakest.rate) weakest = { id, title: t.title, rate, ...t };
  }
  return weakest;
}

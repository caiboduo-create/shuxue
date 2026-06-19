// 通用小工具：随机数、数组取样、分数化简等
// 出题引擎大量依赖这些函数来制造"同一知识点的多种问法和参数"

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 最大公约数，用于分数化简
export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

// 把分子分母化简成最简分数，返回 { n, d, text }
export function simplifyFraction(n, d) {
  if (d === 0) throw new Error('分母不能为 0');
  let sign = (n < 0) !== (d < 0) ? -1 : 1;
  n = Math.abs(n);
  d = Math.abs(d);
  const g = gcd(n, d);
  n = (n / g) * sign;
  d = d / g;
  const text = d === 1 ? `${n}` : `${n}/${d}`;
  return { n, d, text };
}

// 生成 n 个互不相同的错误选项（数值型干扰项）
export function distractors(correct, count, spread = 5) {
  const set = new Set([correct]);
  let guard = 0;
  while (set.size < count + 1 && guard < 200) {
    guard++;
    const delta = randInt(-spread, spread);
    if (delta === 0) continue;
    set.add(correct + delta);
  }
  set.delete(correct);
  return [...set].slice(0, count);
}

// 把一组带 correct 标记的选项洗牌并配上 A/B/C/D
export function buildChoices(items) {
  const keys = ['A', 'B', 'C', 'D', 'E', 'F'];
  return shuffle(items).map((it, i) => ({
    key: keys[i],
    label: it.label,
    isCorrect: !!it.correct,
  }));
}

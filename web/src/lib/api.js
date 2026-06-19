// 与后端交互的统一封装。前端其它地方只调用这些函数。
async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

async function get(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

export const api = {
  meta: () => get('/api/meta'),
  topics: (grade) => get(`/api/topics?grade=${grade}`),
  question: (topicId, difficulty) => post('/api/question', { topicId, difficulty }),
  judge: (topicId, params, userAnswer) => post('/api/judge', { topicId, params, userAnswer }),
  explain: (topicId, params, stem) => post('/api/explain', { topicId, params, stem }),
};

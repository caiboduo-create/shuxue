import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWrongBook, removeWrong, clearWrong } from '../lib/store.js';

const DIFF_LABEL = { easy: '简单', medium: '中等', hard: '困难', demo: '互动' };

export default function WrongBook() {
  const [list, setList] = useState(getWrongBook());
  const [filter, setFilter] = useState('all'); // 'all' 或某个 topicId
  const nav = useNavigate();

  function del(ts) {
    removeWrong(ts);
    setList(getWrongBook());
  }
  function clearAll() {
    if (confirm('确定清空所有错题吗？')) {
      clearWrong();
      setList([]);
    }
  }

  // 「重做这道题」：把原题（含参数）带进答题页，原样复现，做对后会自动从错题本移除
  function redo(w) {
    nav(`/quiz/${w.topicId}`, {
      state: {
        retryQuestion: {
          id: `retry-${w.ts}`,
          topicId: w.topicId,
          topicTitle: w.topicTitle,
          category: w.category,
          difficulty: w.difficulty,
          type: w.type,
          stem: w.stem,
          options: w.options,
          visual: w.visual,
          params: w.params,
        },
      },
    });
  }

  // 按知识点构造筛选项（去重）
  const topicsInBook = [];
  const seen = new Set();
  for (const w of list) {
    if (!seen.has(w.topicId)) {
      seen.add(w.topicId);
      topicsInBook.push({ id: w.topicId, title: w.topicTitle });
    }
  }

  const shown = filter === 'all' ? list : list.filter((w) => w.topicId === filter);

  return (
    <div>
      <Link to="/" className="back">← 返回首页</Link>
      <div className="row between wrap mt12">
        <h2>错题本</h2>
        {list.length > 0 && (
          <button className="btn btn-ghost" onClick={clearAll}>清空</button>
        )}
      </div>
      <p className="muted mt8">这里收集你做错的题，重点复习这些更高效。做对一道就会自动从错题本移除。</p>

      {list.length === 0 ? (
        <div className="empty">
          还没有错题 🎈
          <br />
          <Link to="/grades" className="btn btn-primary mt16">去练习</Link>
        </div>
      ) : (
        <>
          {/* 按知识点筛选 */}
          <div className="filter-row mt16">
            <button className={'filter-chip' + (filter === 'all' ? ' on' : '')} onClick={() => setFilter('all')}>
              全部（{list.length}）
            </button>
            {topicsInBook.map((t) => {
              const n = list.filter((w) => w.topicId === t.id).length;
              return (
                <button
                  key={t.id}
                  className={'filter-chip' + (filter === t.id ? ' on' : '')}
                  onClick={() => setFilter(t.id)}
                >
                  {t.title}（{n}）
                </button>
              );
            })}
          </div>

          <div className="mt16" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {shown.map((w) => (
              <div className="wrong-item" key={w.ts}>
                <div className="wi-stem">{w.stem}</div>
                <div className="wi-meta">
                  <span>你的答案：<b style={{ color: 'var(--red)' }}>{w.yourAnswer || '—'}</b></span>
                  <span>正确答案：<b style={{ color: 'var(--green)' }}>{w.correctAnswer}</b></span>
                  <span className="badge grey">{w.topicTitle}</span>
                  {w.difficulty && <span className="badge">{DIFF_LABEL[w.difficulty] || w.difficulty}</span>}
                </div>
                <div className="row wrap mt12" style={{ gap: 8 }}>
                  {w.params && w.type ? (
                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 14 }} onClick={() => redo(w)}>
                      重做这道题
                    </button>
                  ) : null}
                  <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 14 }} onClick={() => nav(`/quiz/${w.topicId}`)}>
                    再练这个知识点
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 14 }} onClick={() => del(w.ts)}>
                    移除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

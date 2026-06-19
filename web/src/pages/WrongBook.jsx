import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWrongBook, removeWrong, clearWrong } from '../lib/store.js';

export default function WrongBook() {
  const [list, setList] = useState(getWrongBook());
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

  return (
    <div>
      <Link to="/" className="back">← 返回首页</Link>
      <div className="row between wrap mt12">
        <h2>错题本</h2>
        {list.length > 0 && (
          <button className="btn btn-ghost" onClick={clearAll}>
            清空
          </button>
        )}
      </div>
      <p className="muted mt8">这里收集你做错的题，重点复习这些更高效。</p>

      {list.length === 0 ? (
        <div className="empty">
          还没有错题 🎈
          <br />
          <Link to="/grades" className="btn btn-primary mt16">去练习</Link>
        </div>
      ) : (
        <div className="mt16" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map((w) => (
            <div className="wrong-item" key={w.ts}>
              <div className="wi-stem">{w.stem}</div>
              <div className="wi-meta">
                <span>你的答案：<b style={{ color: 'var(--red)' }}>{w.yourAnswer || '—'}</b></span>
                <span>正确答案：<b style={{ color: 'var(--green)' }}>{w.correctAnswer}</b></span>
                <span className="badge grey">{w.topicTitle}</span>
              </div>
              <div className="row wrap mt12" style={{ gap: 8 }}>
                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 14 }} onClick={() => nav(`/quiz/${w.topicId}`)}>
                  再练这个知识点
                </button>
                <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 14 }} onClick={() => del(w.ts)}>
                  移除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

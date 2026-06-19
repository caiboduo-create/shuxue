import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStats, resetStats, weakestTopic } from '../lib/store.js';

function rate(c, t) {
  return t === 0 ? 0 : Math.round((c / t) * 100);
}

export default function Progress() {
  const [stats, setStats] = useState(getStats());
  const weak = weakestTopic();
  const nav = useNavigate();
  const topics = Object.entries(stats.byTopic);

  function reset() {
    if (confirm('确定清空学习进度吗？错题本不会被删除。')) {
      resetStats();
      setStats(getStats());
    }
  }

  return (
    <div>
      <Link to="/" className="back">← 返回首页</Link>
      <div className="row between wrap mt12">
        <h2>学习进度</h2>
        {stats.total > 0 && (
          <button className="btn btn-ghost" onClick={reset}>
            重置进度
          </button>
        )}
      </div>

      {stats.total === 0 ? (
        <div className="empty">
          还没有练习记录 📊
          <br />
          <Link to="/grades" className="btn btn-primary mt16">开始第一题</Link>
        </div>
      ) : (
        <>
          <div className="stat-row mt16">
            <div className="stat">
              <div className="num">{stats.total}</div>
              <div className="lab">累计做题</div>
            </div>
            <div className="stat">
              <div className="num">{stats.correct}</div>
              <div className="lab">答对题数</div>
            </div>
            <div className="stat">
              <div className="num">{rate(stats.correct, stats.total)}%</div>
              <div className="lab">总正确率</div>
            </div>
          </div>

          {weak && (
            <div className="card mt16" style={{ borderLeft: '3px solid var(--amber)' }}>
              <div className="row between wrap">
                <div>
                  <div className="badge amber">建议加强</div>
                  <h3 className="mt8">{weak.title}（正确率 {Math.round(weak.rate * 100)}%）</h3>
                </div>
                <button className="btn btn-amber" onClick={() => nav(`/quiz/${weak.id}`)}>
                  去练习
                </button>
              </div>
            </div>
          )}

          <h3 className="mt24" style={{ marginBottom: 12 }}>各知识点掌握情况</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topics.map(([id, t]) => {
              const r = rate(t.correct, t.total);
              return (
                <div className="card" key={id} style={{ padding: 16 }}>
                  <div className="row between">
                    <b>{t.title}</b>
                    <span className="muted" style={{ fontSize: 14 }}>
                      {t.correct}/{t.total} · {r}%
                    </span>
                  </div>
                  <div className="progress-bar mt12">
                    <span style={{ width: r + '%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

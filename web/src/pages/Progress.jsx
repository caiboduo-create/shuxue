import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStats, resetStats, weakestTopic } from '../lib/store.js';

function rate(c, t) {
  return t === 0 ? 0 : Math.round((c / t) * 100);
}

// 掌握度分档：决定进度条颜色和文字标签
function mastery(r) {
  if (r >= 85) return { label: '已掌握', color: 'var(--green)' };
  if (r >= 60) return { label: '还需巩固', color: 'var(--blue)' };
  return { label: '薄弱', color: 'var(--red)' };
}

export default function Progress() {
  const [stats, setStats] = useState(getStats());
  const weak = weakestTopic();
  const nav = useNavigate();

  // 各知识点按正确率升序——最薄弱的排最前面，便于优先复习
  const topics = Object.entries(stats.byTopic)
    .map(([id, t]) => ({ id, ...t, r: rate(t.correct, t.total) }))
    .sort((a, b) => a.r - b.r);

  function reset() {
    if (confirm('确定清空学习进度吗？错题本不会被删除。')) {
      resetStats();
      setStats(getStats());
    }
  }

  return (
    <div>
      <Link to="/" className="back home-back">返回首页</Link>
      <section className="page-panel blue mt12">
        <div className="panel-head">
          <div>
            <h2>学习进度</h2>
            <p className="panel-sub">看整体正确率，也看每个知识点的掌握情况。</p>
          </div>
          {stats.total > 0 && (
            <button className="btn btn-ghost" onClick={reset}>重置进度</button>
          )}
        </div>

        {stats.total === 0 ? (
          <div className="empty content-card">
            还没有练习记录 📊
            <br />
            <Link to="/grades" className="btn btn-primary mt16">开始第一题</Link>
          </div>
        ) : (
          <>
            <div className="stat-row mt16">
              <div className="stat soft-stat">
                <div className="num">{stats.total}</div>
                <div className="lab">累计做题</div>
              </div>
              <div className="stat soft-stat">
                <div className="num">{stats.correct}</div>
                <div className="lab">答对题数</div>
              </div>
              <div className="stat soft-stat">
                <div className="num">{rate(stats.correct, stats.total)}%</div>
                <div className="lab">总正确率</div>
              </div>
            </div>

            {weak ? (
              <div className="content-card mt16 weak-card">
                <div className="row between wrap">
                  <div>
                    <div className="badge amber">建议加强</div>
                    <h3 className="mt8">{weak.title}（正确率 {Math.round(weak.rate * 100)}%）</h3>
                    <p className="muted mt8">优先攻克薄弱知识点，正确率提升最快。</p>
                  </div>
                  <button
                    className="btn btn-amber"
                    onClick={() =>
                      nav(`/quiz/${weak.id}`, { state: { placementId: weak.placementId, topicTitle: weak.title } })
                    }
                  >
                    针对薄弱点出题
                  </button>
                </div>
              </div>
            ) : (
              <div className="content-card mt16 weak-card ok">
                <div className="badge green">状态不错</div>
                <h3 className="mt8">暂无明显薄弱点，继续保持！</h3>
              </div>
            )}

            <h3 className="mt24" style={{ marginBottom: 12 }}>各知识点掌握情况</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {topics.map((t) => {
                const m = mastery(t.r);
                return (
                  <div className="content-card progress-topic" key={t.id}>
                    <div className="row between wrap" style={{ gap: 8 }}>
                      <b>{t.title}</b>
                      <span className="row" style={{ gap: 8 }}>
                        <span className="badge" style={{ background: 'transparent', color: m.color, border: `1px solid ${m.color}` }}>{m.label}</span>
                        <span className="muted" style={{ fontSize: 14 }}>{t.correct}/{t.total} · {t.r}%</span>
                      </span>
                    </div>
                    <div className="progress-bar mt12">
                      <span style={{ width: t.r + '%', background: m.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

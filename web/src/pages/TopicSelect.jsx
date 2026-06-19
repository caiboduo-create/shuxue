import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { getDemoByTopic } from '../components/interactive/index.js';

const gradeLabel = (g) => (g <= 6 ? `${g}年级` : `初${g - 6}`);

export default function TopicSelect() {
  const { grade } = useParams();
  const [topics, setTopics] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .topics(grade)
      .then((d) => setTopics(d.topics))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [grade]);

  // 按知识点分类分组
  const byCat = topics.reduce((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {});

  return (
    <div>
      <Link to="/grades" className="back">← 返回年级</Link>
      <h2 className="mt12">选择知识点</h2>

      {loading && (
        <div className="row mt16">
          <span className="spinner" /> <span className="muted">加载中…</span>
        </div>
      )}
      {err && <div className="empty">加载失败：{err}</div>}

      {!loading && !err && topics.length === 0 && (
        <div className="empty">
          这个年级的知识点还在补充中 🛠️
          <br />
          <span className="muted">可以先试试相邻年级，或看 README 了解如何添加知识点。</span>
        </div>
      )}

      {Object.entries(byCat).map(([cat, list]) => (
        <section key={cat} className="mt24">
          <div className="badge">{cat}</div>
          <div className="grid-cards mt12">
            {list.map((t) => {
              const demo = getDemoByTopic(t.id);
              return (
                <button
                  key={t.id}
                  className="pick-card topic-card"
                  onClick={() => nav(demo ? `/interactive/${demo.id}` : `/quiz/${t.id}`)}
                >
                  <div className="pc-title">{t.title}</div>
                  <div className="row wrap" style={{ gap: 6 }}>
                    {t.grades.map((g) => (
                      <span key={g} className="badge grey">{gradeLabel(g)}</span>
                    ))}
                  </div>
                  {t.objective && <div className="pc-sub topic-goal">🎯 {t.objective}</div>}
                  <div className="topic-foot">
                    {demo ? '🎮 含互动课件 · 先演示再练习' : `${t.difficulties.length} 个难度 · 点击开始`}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

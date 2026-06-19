import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { weakestTopic } from '../lib/store.js';

export default function Home() {
  const nav = useNavigate();
  const [meta, setMeta] = useState(null);
  const weak = weakestTopic();

  useEffect(() => {
    api.meta().then(setMeta).catch(() => {});
  }, []);

  return (
    <div>
      <section className="card" style={{ background: 'linear-gradient(135deg,#fff, #eef4ff)' }}>
        <span className="badge amber">中小学数学 · AI 出题与讲解</span>
        <h1 style={{ fontSize: 34, marginTop: 14, lineHeight: 1.3 }}>
          边做题，边听老师讲。<br />每道题都有分步讲解和配图。
        </h1>
        <p className="muted mt12" style={{ fontSize: 16, lineHeight: 1.7 }}>
          选好年级和知识点，系统自动出题、判对错，并像老师一样一步步讲清楚为什么。
          几何题还会画出图形，帮你真正看懂。
        </p>
        <div className="row wrap mt24">
          <Link to="/grades" className="btn btn-primary">开始练习 →</Link>
          <Link to="/wrong" className="btn btn-ghost">看看错题本</Link>
        </div>
        {meta && (
          <p className="muted mt16" style={{ fontSize: 13 }}>
            当前讲解模式：
            {meta.aiEnabled ? `AI 讲解（${meta.provider}）` : '本地规则讲解（未配置 API Key 也能正常用）'}
          </p>
        )}
      </section>

      {weak && (
        <section className="card mt16" style={{ borderLeft: '3px solid var(--amber)' }}>
          <div className="row between wrap">
            <div>
              <div className="badge amber">薄弱点提醒</div>
              <h3 className="mt8">「{weak.title}」最近正确率偏低（{Math.round(weak.rate * 100)}%）</h3>
              <p className="muted mt8">要不要针对这个知识点再练几道？</p>
            </div>
            <button className="btn btn-amber" onClick={() => nav(`/quiz/${weak.id}`)}>
              针对性练习
            </button>
          </div>
        </section>
      )}

      <section className="mt24">
        <h3 style={{ marginBottom: 12 }}>它能帮到谁</h3>
        <div className="grid-cards">
          <div className="pick-card">
            <div className="pc-title">🧒 学生</div>
            <div className="pc-sub">自动出题不重样，做错有讲解，慢慢补上薄弱环节。</div>
          </div>
          <div className="pick-card">
            <div className="pc-title">👨‍👩‍👧 家长</div>
            <div className="pc-sub">讲解通俗易懂，孩子哪里弱一目了然，不用自己辅导。</div>
          </div>
          <div className="pick-card">
            <div className="pc-title">📐 几何题</div>
            <div className="pc-sub">线段、角、周长、面积都配清晰图形，看着图就能懂。</div>
          </div>
        </div>
      </section>
    </div>
  );
}

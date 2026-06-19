import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function GradeSelect() {
  const [grades, setGrades] = useState([]);
  const [err, setErr] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    api.meta().then((m) => setGrades(m.grades)).catch((e) => setErr(e.message));
  }, []);

  if (err)
    return (
      <div className="empty">
        加载失败：{err}
        <br />
        <span className="muted">请确认后端已启动（npm run dev）。</span>
      </div>
    );

  const stages = ['小学', '初中'];

  return (
    <div>
      <Link to="/" className="back">← 返回首页</Link>
      <h2 className="mt12">选择年级</h2>
      <p className="muted mt8">先选年级，再挑想练的知识点。</p>

      {stages.map((stage) => (
        <section key={stage} className="mt24">
          <div className="badge grey">{stage}</div>
          <div className="grid-cards mt12">
            {grades
              .filter((g) => g.stage === stage)
              .map((g) => (
                <button key={g.value} className="pick-card" onClick={() => nav(`/grade/${g.value}`)}>
                  <div className="pc-title">{g.label}</div>
                  <div className="pc-sub">查看知识点 →</div>
                </button>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

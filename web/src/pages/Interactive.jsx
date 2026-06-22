import { Link, useNavigate } from 'react-router-dom';
import { INTERACTIVE } from '../components/interactive/index.js';

// 互动课件总入口：按类别分组的卡片式列表。
const gradeLabel = (g) => (g <= 6 ? `${g}年级` : `初${g - 6}`);

export default function Interactive() {
  const nav = useNavigate();
  const openDemo = (d) => {
    if (d.topicId) {
      nav(`/learn/${d.topicId}`, {
        state: { backTo: '/interactive', backLabel: '返回课件列表' },
      });
      return;
    }
    nav(`/interactive/${d.id}`);
  };

  // 按 registry 里的 category 字段动态分组，不硬编码类别
  const byCat = INTERACTIVE.reduce((acc, d) => {
    (acc[d.category] = acc[d.category] || []).push(d);
    return acc;
  }, {});

  return (
    <div>
      <Link to="/" className="back home-back">返回首页</Link>
      <section className="page-panel pink mt12">
        <div className="panel-head">
          <div>
            <h2>互动课件</h2>
            <p className="panel-sub">先拖一拖、调一调看懂模型，再随机做一题，提交后看答案和分步讲解。</p>
          </div>
        </div>

        {Object.entries(byCat).map(([cat, list]) => (
          <section key={cat} className="section-gap">
            <div className="badge">{cat}</div>
            <div className="grid-cards mt12">
              {list.map((d) => (
                <button key={d.id} className="pick-card demo-card choice-card" onClick={() => openDemo(d)}>
                  <div className="demo-emoji">{d.emoji}</div>
                  <div className="pc-title">{d.title}</div>
                  <div className="pc-sub">{d.subtitle}</div>
                  <div className="row wrap mt8" style={{ gap: 6 }}>
                    {d.grades.map((g) => (
                      <span key={g} className="badge grey">{gradeLabel(g)}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}

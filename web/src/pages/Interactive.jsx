import { Link, useNavigate } from 'react-router-dom';
import { INTERACTIVE } from '../components/interactive/index.js';

// 互动课件总入口：按年级拆分，避免一个知识点卡片同时挂多个年级。
const gradeLabel = (g) => (g <= 6 ? `${g}年级` : `初${g - 6}`);

function expandByGrade(list) {
  return list
    .flatMap((d) => d.grades.map((grade) => ({ ...d, grade, cardId: `${d.id}-g${grade}` })))
    .sort((a, b) => a.grade - b.grade || a.title.localeCompare(b.title, 'zh-Hans-CN'));
}

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

  const byGrade = expandByGrade(INTERACTIVE).reduce((acc, d) => {
    (acc[d.grade] = acc[d.grade] || []).push(d);
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

        {Object.entries(byGrade).map(([grade, list]) => (
          <section key={grade} className="section-gap">
            <div className="badge">{gradeLabel(Number(grade))}</div>
            <div className="grid-cards mt12">
              {list.map((d) => (
                <button key={d.cardId} className="pick-card demo-card choice-card" onClick={() => openDemo(d)}>
                  <div className="demo-emoji">{d.emoji}</div>
                  <div className="pc-title">{d.title}</div>
                  <div className="pc-sub">{d.subtitle}</div>
                  <div className="row wrap mt8" style={{ gap: 6 }}>
                    <span className="badge grey">{d.category}</span>
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

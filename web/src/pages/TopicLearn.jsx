import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { getDemoByTopic } from '../components/interactive/index.js';
import InlinePractice from '../components/interactive/InlinePractice.jsx';

export default function TopicLearn() {
  const { topicId } = useParams();
  const location = useLocation();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [practiceVersion, setPracticeVersion] = useState(0);

  useEffect(() => {
    setLoading(true);
    api
      .topics('')
      .then((d) => {
        const found = d.topics.find((t) => t.id === topicId);
        if (!found) throw new Error('没有找到这个知识点');
        setTopic(found);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [topicId]);

  const demo = getDemoByTopic(topicId);
  const DemoComponent = demo?.Component;
  const defaultBackTo = demo ? '/interactive' : '/grades';
  const defaultBackLabel = demo ? '返回课件列表' : '返回年级';
  const backTo = location.state?.backTo || defaultBackTo;
  const backLabel = location.state?.backLabel || defaultBackLabel;
  const backClassName = `back${backTo === '/' ? ' home-back' : ''}`;
  const placementId = location.state?.placementId || null;
  const displayTopic = topic
    ? {
        ...topic,
        title: location.state?.topicTitle || topic.title,
        objective: location.state?.topicObjective || topic.objective,
      }
    : null;
  const curriculumLabel = location.state?.curriculumLabel;

  if (loading) {
    return (
      <div className="card row">
        <span className="spinner" /> <span className="muted">正在准备学习页…</span>
      </div>
    );
  }

  if (err) {
    return (
      <div>
        <Link to={backTo} className={backClassName}>{backLabel}</Link>
        <div className="empty">加载失败：{err}</div>
      </div>
    );
  }

  return (
    <div>
      <Link to={backTo} className={backClassName}>{backLabel}</Link>

      <div className="page-panel blue learn-hero mt12">
        <div>
          <div className="row wrap" style={{ gap: 8, marginBottom: 8 }}>
            <span className="badge">{topic.category}</span>
            {demo && <span className="badge green">含互动模型</span>}
            {curriculumLabel && <span className="badge amber">{curriculumLabel}</span>}
          </div>
          <h2>{displayTopic.title}</h2>
          {displayTopic.objective && <p className="muted mt8">{displayTopic.objective}</p>}
        </div>
        <Link
          to={`/quiz/${topic.id}`}
          state={{ backTo: location.pathname, backLabel: '返回学习页', placementId, topicTitle: displayTopic.title }}
          className="btn btn-ghost"
        >
          整套练习 →
        </Link>
      </div>

      {DemoComponent ? (
        <>
          <section className="mt16" id="model">
            <div className="row between wrap">
              <div>
                <div className="badge">互动模型</div>
                <h3 className="mt8">{demo.title}</h3>
              </div>
            </div>
            <div className="content-card mt12 learn-demo-card demo-shell">
              <DemoComponent />
            </div>
          </section>

          <section className="content-card practice-panel mt16" id="practice">
            <div className="practice-title-row">
              <div>
                <div className="badge amber">练习板块</div>
                <h3 className="mt8">做一道题</h3>
              </div>
              <button type="button" className="btn btn-ghost btn-small" onClick={() => setPracticeVersion((v) => v + 1)}>
                换一道题
              </button>
            </div>
            <InlinePractice
              topicId={topic.id}
              placementId={placementId}
              topicTitle={displayTopic.title}
              hasModel={!!demo}
              refreshKey={practiceVersion}
            />
          </section>
        </>
      ) : (
        <section className="page-panel orange mt16" id="practice">
          <div className="practice-title-row">
            <div>
              <div className="badge amber">练习板块</div>
              <h3 className="mt8">做一道题</h3>
            </div>
            <button type="button" className="btn btn-ghost btn-small" onClick={() => setPracticeVersion((v) => v + 1)}>
              换一道题
            </button>
          </div>
          <InlinePractice
            topicId={topic.id}
            placementId={placementId}
            topicTitle={displayTopic.title}
            refreshKey={practiceVersion}
          />
        </section>
      )}
    </div>
  );
}

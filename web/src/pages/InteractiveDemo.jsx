import { Link, useParams } from 'react-router-dom';
import { getDemo } from '../components/interactive/index.js';
import InlinePractice from '../components/interactive/InlinePractice.jsx';

// 单个互动课件页面：演示组件 + 「去做整套练习题」入口。
// 学习流程：知识点 → 互动演示（本页）→ 练习题。
export default function InteractiveDemo() {
  const { demoId } = useParams();
  const demo = getDemo(demoId);

  if (!demo) {
    return (
      <div>
        <Link to="/interactive" className="back">返回课件列表</Link>
        <div className="empty">没有找到这个互动课件 🛠️</div>
      </div>
    );
  }

  const { Component } = demo;

  return (
    <div>
      <Link to="/interactive" className="back">返回课件列表</Link>
      <div className="row between wrap mt12">
        <h2>
          <span style={{ marginRight: 8 }}>{demo.emoji}</span>
          {demo.title}
        </h2>
        {demo.topicId && (
          <Link
            to={`/learn/${demo.topicId}`}
            state={{ backTo: `/interactive/${demo.id}`, backLabel: '返回模型' }}
            className="btn btn-ghost"
          >
            学习这个知识点 →
          </Link>
        )}
      </div>
      <p className="muted mt8">{demo.subtitle}</p>

      <div className="page-panel blue mt16">
        <div className="content-card demo-shell interactive-demo-card">
        <Component />
        </div>
      </div>

      {demo.topicId && (
        <section className="content-card practice-panel interactive-practice-card mt16">
          <div className="badge amber">练一练</div>
          <h3 className="mt8">随机出题与答案讲解</h3>
          <InlinePractice topicId={demo.topicId} topicTitle={demo.title} />
        </section>
      )}
    </div>
  );
}

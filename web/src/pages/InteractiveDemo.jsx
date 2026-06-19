import { Link, useParams } from 'react-router-dom';
import { getDemo } from '../components/interactive/index.js';

// 单个互动课件页面：演示组件 + 「去做整套练习题」入口。
// 学习流程：知识点 → 互动演示（本页）→ 练习题。
export default function InteractiveDemo() {
  const { demoId } = useParams();
  const demo = getDemo(demoId);

  if (!demo) {
    return (
      <div>
        <Link to="/interactive" className="back">← 返回课件列表</Link>
        <div className="empty">没有找到这个互动课件 🛠️</div>
      </div>
    );
  }

  const { Component } = demo;

  return (
    <div>
      <Link to="/interactive" className="back">← 返回课件列表</Link>
      <div className="row between wrap mt12">
        <h2>
          <span style={{ marginRight: 8 }}>{demo.emoji}</span>
          {demo.title}
        </h2>
        {demo.topicId && (
          <Link to={`/quiz/${demo.topicId}`} className="btn btn-ghost">去做整套练习题 →</Link>
        )}
      </div>
      <p className="muted mt8">{demo.subtitle}</p>

      <div className="card mt16">
        <Component />
      </div>
    </div>
  );
}

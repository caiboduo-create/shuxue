import { Link, useNavigate } from 'react-router-dom';
import { INTERACTIVE } from '../components/interactive/index.js';

// 互动课件总入口：卡片式列出所有可玩的动态演示。
export default function Interactive() {
  const nav = useNavigate();
  return (
    <div>
      <Link to="/" className="back">← 返回首页</Link>
      <h2 className="mt12">互动课件</h2>
      <p className="muted mt8">拖一拖、动一动，看着图形和公式一起变化，把数学概念玩明白。</p>

      <div className="grid-cards mt24">
        {INTERACTIVE.map((d) => (
          <button key={d.id} className="pick-card demo-card" onClick={() => nav(`/interactive/${d.id}`)}>
            <div className="demo-emoji">{d.emoji}</div>
            <div className="pc-title">{d.title}</div>
            <div className="pc-sub">{d.subtitle}</div>
            <span className="badge mt8" style={{ alignSelf: 'flex-start' }}>互动演示</span>
          </button>
        ))}
      </div>
    </div>
  );
}

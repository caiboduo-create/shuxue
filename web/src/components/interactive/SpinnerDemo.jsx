import { useState } from 'react';
import GeometrySVG from '../GeometrySVG.jsx';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';

// 简单概率互动演示：调整每种颜色的份数，转盘实时变化，直观看"概率 = 目标份数 / 总份数"。
// 复用 GeometrySVG 的 spinner 渲染，出题复用 probability-basic 知识点。
const COLORS = [
  { label: '红', color: '#e02424' },
  { label: '蓝', color: '#2563eb' },
  { label: '黄', color: '#f59e0b' },
];
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export default function SpinnerDemo() {
  const [counts, setCounts] = useState([3, 2, 1]);
  const [targetIdx, setTargetIdx] = useState(0);
  const [practice, setPractice] = useState(false);

  const setCount = (i, v) => setCounts((c) => c.map((x, j) => (j === i ? v : x)));
  const segments = COLORS.map((c, i) => ({ ...c, count: counts[i] }));
  const total = counts.reduce((s, x) => s + x, 0);
  const fav = counts[targetIdx];
  const g = gcd(fav, total);
  const simp = total / g === 1 ? `${fav / g}` : `${fav / g}/${total / g}`;
  const visual = { kind: 'spinner', segments, targetIdx };

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="demo-stage">
          <GeometrySVG visual={visual} />
          <div className="stage-hint">扇区越大，转到它的可能性越大</div>
        </div>
        <div className="demo-side">
          <div className="demo-controls">
            {COLORS.map((c, i) => (
              <Slider key={c.label} label={`${c.label}色份数`} value={counts[i]} min={1} max={8} onChange={(v) => setCount(i, v)} />
            ))}
            <div>
              <div className="islider-label" style={{ marginBottom: 6 }}>求转到哪种颜色的概率？</div>
              <div className="seg" style={{ display: 'flex' }}>
                {COLORS.map((c, i) => (
                  <button key={c.label} className={targetIdx === i ? 'on' : ''} onClick={() => setTargetIdx(i)}>{c.label}色</button>
                ))}
              </div>
            </div>
          </div>
          <div className="formula">
            <div className="formula-title">转到{COLORS[targetIdx].label}色的概率</div>
            <div className="formula-main">P = {fav} / {total}</div>
            <div className="formula-calc">
              目标份数 {fav} ÷ 总份数 {total}<br />
              = <b>{simp}</b>
            </div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          概率 = <b>目标份数 ÷ 总份数</b>。某种颜色份数越多、扇区越大，转到它的机会就越大。<br />
          算出的分数记得<b>约成最简</b>：{fav}/{total} {simp !== `${fav}/${total}` ? `= ${simp}` : '已经是最简'}。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={() => setPractice(true)}>
          随机出一道概率题练一练 →
        </button>
      ) : (
        <InlinePractice topicId="probability-basic" topicTitle="简单事件的概率" />
      )}
    </div>
  );
}

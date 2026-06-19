import { useState } from 'react';
import GeometrySVG from '../GeometrySVG.jsx';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';

// 点到直线距离互动演示：移动点 P 和直线，实时看垂线段（距离）怎么变。
// 复用 GeometrySVG 现有的 point-line 渲染（直线 + 点 + 垂足 + 垂线段）。
// 直线取法向量 (3,4)，写成 3x + 4y + c = 0，分母 √(3²+4²)=5；c 由直线的 y 轴截距决定。
// 取值范围特意约束，保证垂足始终落在第一象限内，图不会被裁切。
const round2 = (v) => Math.round(v * 100) / 100;
const A = 3;
const B = 4;

export default function PointLineDemo() {
  const [px, setPx] = useState(8);
  const [py, setPy] = useState(9);
  const [yi, setYi] = useState(6); // 直线在 y 轴上的截距
  const [practice, setPractice] = useState(false);

  const c = -B * yi; // 3x + 4y - 4·yi = 0，y 轴截距 = yi
  const n = A * px + B * py + c;
  const dist = round2(Math.abs(n) / 5);

  // 垂足，用于把网格范围算到能容纳它（与知识点模块一致）
  const denom = A * A + B * B;
  const fx = px - (n * A) / denom;
  const fy = py - (n * B) / denom;
  const maxC = Math.max(6, Math.ceil(px), Math.ceil(py), Math.ceil(fx), Math.ceil(fy), Math.ceil((4 * yi) / 3));
  const visual = { kind: 'point-line', a: A, b: B, c, x0: px, y0: py, maxC };

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="demo-stage">
          <GeometrySVG visual={visual} />
          <div className="stage-hint">橙色虚线就是 P 到直线的垂线段，它的长度 = 距离</div>
        </div>
        <div className="demo-side">
          <div className="demo-controls">
            <Slider label="点 P 的横坐标 x" value={px} min={4} max={11} onChange={setPx} />
            <Slider label="点 P 的纵坐标 y" value={py} min={5} max={11} onChange={setPy} />
            <Slider label="直线高低（y 轴截距）" value={yi} min={6} max={10} onChange={setYi} />
          </div>
          <div className="formula">
            <div className="formula-title">点到直线的距离</div>
            <div className="formula-main">d = |3x + 4y + c| / 5</div>
            <div className="formula-calc">
              直线：3x + 4y − {B * yi} = 0<br />
              = |3×{px} + 4×{py} − {B * yi}| / 5<br />
              = |{n}| / 5 = <b>{dist}</b>
            </div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          点到直线的距离，指的是从点向直线作<b>垂线</b>，那条垂线段的长度——它是该点到直线上所有点里<b>最短</b>的。
          把直线写成 3x + 4y + c = 0，代入点的坐标算出 |3x + 4y + c|，再除以 √(3²+4²)=5，就是距离。
          你拖动 P 或上下移动直线，看垂线段怎么跟着变长变短。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={() => setPractice(true)}>
          随机出一道点到直线距离题练一练 →
        </button>
      ) : (
        <InlinePractice
          topicId="distance-point-line"
          topicTitle="点到直线的距离"
          avoidParams={{ a: A, b: B, c, x0: px, y0: py }}
        />
      )}
    </div>
  );
}

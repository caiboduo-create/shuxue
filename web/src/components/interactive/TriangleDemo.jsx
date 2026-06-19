import { useState } from 'react';
import GeometrySVG from '../GeometrySVG.jsx';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';

// 三角形内角和互动演示：调两个内角，三角形形状实时变化，第三个角自动算出，三角恒为 180°。
// 复用 GeometrySVG 的 triangle 渲染（按真实角度绘制），出题复用 triangle-angle-sum 知识点。
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function TriangleDemo() {
  const [a, setA] = useState(60);
  const [b, setB] = useState(70);
  const [practice, setPractice] = useState(null);

  // 约束：两角之和不超过 160°，给第三个角留 ≥20°
  const setAngleA = (v) => setA(clamp(v, 20, 160 - b));
  const setAngleB = (v) => setB(clamp(v, 20, 160 - a));
  const c = 180 - a - b;
  const visual = { kind: 'triangle', angles: [a, b, c] };

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="demo-stage">
          <GeometrySVG visual={visual} />
          <div className="stage-hint">调整两个角，三角形会随之改变形状</div>
        </div>
        <div className="demo-side">
          <div className="demo-controls">
            <Slider label="第一个角" value={a} min={20} max={140} unit="°" onChange={setAngleA} />
            <Slider label="第二个角" value={b} min={20} max={140} unit="°" onChange={setAngleB} />
          </div>
          <div className="formula">
            <div className="formula-title">三角形内角和</div>
            <div className="formula-main">∠1 + ∠2 + ∠3 = 180°</div>
            <div className="formula-calc">
              {a}° + {b}° + 第三个角 = 180°<br />
              第三个角 = 180° − {a}° − {b}° = <b>{c}°</b>
            </div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          不管三角形是高是瘦、是尖是钝，三个内角加起来<b>永远是 180°</b>。
          所以只要知道两个角，用 180° 减去它们的和，就能求出第三个角。你可以拖动滑块，看看第三个角怎么跟着变。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={() => setPractice(true)}>
          随机出一道内角和的题练一练 →
        </button>
      ) : (
        <InlinePractice topicId="triangle-angle-sum" topicTitle="三角形的内角和" avoidParams={{ a, b }} />
      )}
    </div>
  );
}

import { useState } from 'react';
import GeometrySVG from '../GeometrySVG.jsx';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';

// 一次函数 y=kx+b 互动演示：调 k、b，直线实时变化；调 x 看对应的点。
// 复用 GeometrySVG 的 linear-graph 渲染，出题复用 linear-function 知识点。
function formatFn(k, b) {
  let kPart;
  if (k === 1) kPart = 'x';
  else if (k === -1) kPart = '−x';
  else kPart = `${k}x`;
  if (b === 0) return `y = ${kPart}`;
  return `y = ${kPart} ${b > 0 ? '+' : '−'} ${Math.abs(b)}`;
}

export default function LinearFunctionDemo() {
  const [k, setK] = useState(2);
  const [b, setB] = useState(1);
  const [x, setX] = useState(2);
  const [practice, setPractice] = useState(null);

  const visual = { kind: 'linear-graph', k, b, x };
  const y = k * x + b;

  function makeQuestion() {
    setPractice({
      params: { k, b, x },
      stem: `已知一次函数 ${formatFn(k, b)}，当 x = ${x} 时，y 的值是多少？`,
    });
  }

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="demo-stage">
          <GeometrySVG visual={visual} />
          <div className="stage-hint">调 k 看直线倾斜，调 b 看直线上下移动</div>
        </div>
        <div className="demo-side">
          <div className="demo-controls">
            <Slider label="斜率 k" value={k} min={-3} max={3} onChange={setK} />
            <Slider label="截距 b" value={b} min={-6} max={6} onChange={setB} />
            <Slider label="代入的 x" value={x} min={-5} max={5} onChange={setX} />
          </div>
          <div className="formula">
            <div className="formula-title">一次函数</div>
            <div className="formula-main">{formatFn(k, b)}</div>
            <div className="formula-calc">
              当 x = {x} 时：<br />
              y = {k} × {x} {b >= 0 ? '+' : '−'} {Math.abs(b)} = <b>{y}</b>
            </div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          一次函数的图象是一条<b>直线</b>。<b>k 是斜率</b>，决定直线的倾斜：k&gt;0 向右上方走，k&lt;0 向右下方走，
          |k| 越大越陡。<b>b 是截距</b>，就是直线穿过 y 轴的位置（b 变大直线整体上移）。
          代入一个 x，就是在直线上找横坐标为 x 的那个点的高度 y。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={makeQuestion}>
          用当前 k、b、x 出一道题 →
        </button>
      ) : (
        <InlinePractice
          topicId="linear-function"
          topicTitle="一次函数 y = kx + b"
          params={practice.params}
          stem={practice.stem}
          type="numeric"
          hint="直接填 y 的值"
          onNew={() => setPractice(null)}
        />
      )}
    </div>
  );
}

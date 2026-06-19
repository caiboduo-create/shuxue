import { useState } from 'react';
import GeometrySVG from '../GeometrySVG.jsx';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';

// 有理数加减互动演示：在数轴上从 a 出发，按运算移动，直观看"加负数向左""减一个负数"。
// 复用 GeometrySVG 的 numberline 渲染，出题复用 rational-ops 知识点。
export default function NumberLineDemo() {
  const [a, setA] = useState(-3);
  const [b, setB] = useState(5);
  const [op, setOp] = useState('+');
  const [practice, setPractice] = useState(false);

  const result = op === '+' ? a + b : a - b;
  const visual = { kind: 'numberline', a, b, op };
  const move = op === '+' ? b : -b; // 数轴上实际移动（带符号）：右为正、左为负
  const dirText = move > 0 ? '向右' : move < 0 ? '向左' : '原地不动';

  return (
    <div className="demo">
      <div className="demo-stage">
        <GeometrySVG visual={visual} />
        <div className="stage-hint">蓝点是起点，橙色弧线是这一步的移动，绿点是结果</div>
      </div>

      <div className="demo-controls mt16">
        <Slider label="起点 a" value={a} min={-10} max={10} onChange={setA} />
        <div className="seg" style={{ display: 'flex' }}>
          <button className={op === '+' ? 'on' : ''} onClick={() => setOp('+')}>加法 +</button>
          <button className={op === '-' ? 'on' : ''} onClick={() => setOp('-')}>减法 −</button>
        </div>
        <Slider label="第二个数 b" value={b} min={-10} max={10} onChange={setB} />
      </div>

      <div className="formula mt16">
        <div className="formula-title">一步一步看怎么走</div>
        <div className="formula-main">({a}) {op} ({b}) = {result}</div>
        <ol className="step-list">
          <li>先站在起点 <b style={{ color: 'var(--blue)' }}>{a}</b>。</li>
          <li>这次要{op === '+' ? '加上' : '减去'} {b}。</li>
          {op === '-' && (
            <li className="tip">减去 {b} = 加上它的相反数 {-b}（减一个数，就是加它的相反数）。</li>
          )}
          <li>所以{dirText}{move !== 0 ? <> 走 <b>{Math.abs(move)}</b> 格</> : ''}。</li>
          <li>走到 <b style={{ color: 'var(--green)' }}>{result}</b>，这就是结果。</li>
        </ol>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          数轴上做加减，就是从起点“走一步”：<br />
          <b>加正数 → 往右走；加负数 → 往左走。</b><br />
          减法先换句话说：<b>减去一个数 = 加上它的相反数</b>。比如减去 −3，就是加 3，要往右走。<br />
          盯着橙色箭头的方向，正负号就不会搞错啦。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={() => setPractice(true)}>
          随机出一道有理数加减题练一练 →
        </button>
      ) : (
        <InlinePractice topicId="rational-ops" topicTitle="有理数加减运算" avoidParams={{ a, b, op }} />
      )}
    </div>
  );
}

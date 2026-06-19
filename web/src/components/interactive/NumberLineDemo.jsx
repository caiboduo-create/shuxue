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
  // 减一个数 = 加它的相反数
  const moveDesc =
    op === '+'
      ? b >= 0
        ? `加上正数 ${b}，向右移动 ${b} 格`
        : `加上负数 ${b}，向左移动 ${Math.abs(b)} 格`
      : b >= 0
        ? `减去正数 ${b}，向左移动 ${b} 格`
        : `减去负数 ${b}（等于加 ${Math.abs(b)}），向右移动 ${Math.abs(b)} 格`;

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
        <div className="formula-title">这一步在数轴上怎么走</div>
        <div className="formula-main">({a}) {op} ({b}) = {result}</div>
        <div className="formula-calc">{moveDesc}。</div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          有理数加减就是在数轴上"走步"：<b>加正数往右走、加负数往左走</b>。
          减法先变成加法——<b>减去一个数 = 加上它的相反数</b>，比如 减去 −3 就等于 加 3，要往右走。
          看着橙色箭头的方向，正负号就不容易错了。
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

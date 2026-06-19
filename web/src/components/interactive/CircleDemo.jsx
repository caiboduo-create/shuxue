import { useState } from 'react';
import GeometrySVG from '../GeometrySVG.jsx';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';

// 圆的面积与周长互动演示：拖半径，圆实时变大变小，面积/周长公式实时更新。
// 复用 GeometrySVG 的 circle 渲染（图随 r 缩放），出题复用 circle-measure 知识点。
const round2 = (v) => Math.round(v * 100) / 100;

export default function CircleDemo() {
  const [r, setR] = useState(5);
  const [ask, setAsk] = useState('area'); // area | circumference
  const [practice, setPractice] = useState(null);

  const visual = { kind: 'circle', r, given: 'radius', givenValue: r };
  const area = round2(3.14 * r * r);
  const circ = round2(2 * 3.14 * r);

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="demo-stage">
          <GeometrySVG visual={visual} />
          <div className="stage-hint">拖动滑块改变半径，圆会跟着变大变小</div>
        </div>
        <div className="demo-side">
          <div className="demo-controls">
            <Slider label="半径 r" value={r} min={1} max={12} unit=" cm" onChange={setR} />
            <div className="seg" style={{ display: 'flex' }}>
              <button className={ask === 'area' ? 'on' : ''} onClick={() => setAsk('area')}>求面积</button>
              <button className={ask === 'circumference' ? 'on' : ''} onClick={() => setAsk('circumference')}>求周长</button>
            </div>
          </div>
          <div className="formula">
            <div className="formula-title">{ask === 'area' ? '圆的面积' : '圆的周长'}</div>
            <div className="formula-main">{ask === 'area' ? 'S = π × r²' : 'C = 2 × π × r'}</div>
            <div className="formula-calc">
              {ask === 'area' ? (
                <>= 3.14 × {r}² = <b>{area}</b> 平方厘米</>
              ) : (
                <>= 2 × 3.14 × {r} = <b>{circ}</b> 厘米</>
              )}
              <br />
              <span className="muted">面积 {area} 平方厘米 · 周长 {circ} 厘米</span>
            </div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          圆的大小由半径 r 决定。<b>周长</b>是绕圆一圈的长度，永远是直径的 π 倍，即 2πr；
          <b>面积</b>是圆里面铺满的大小，等于 πr²。注意面积要把 r 乘两次，周长只乘一次再乘 2。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={() => setPractice(true)}>
          随机出一道圆的题练一练 →
        </button>
      ) : (
        <InlinePractice
          topicId="circle-measure"
          topicTitle="圆的面积与周长"
          avoidParams={{ r, ask, given: 'radius', givenValue: r }}
        />
      )}
    </div>
  );
}

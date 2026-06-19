import { useState } from 'react';
import GeometrySVG from '../GeometrySVG.jsx';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';

// 长方形面积与周长互动演示：调长、宽，方格图实时变化，面积与周长公式实时更新。
// 复用 GeometrySVG 的 rect 渲染（带单位格），出题复用 area-rect 知识点（求面积）。
export default function RectangleDemo() {
  const [w, setW] = useState(6);
  const [h, setH] = useState(4);
  const [practice, setPractice] = useState(null);

  const visual = { kind: 'rect', w, h, unit: '厘米', label: '长方形', grid: true };
  const area = w * h;
  const perimeter = 2 * (w + h);

  function makeQuestion() {
    setPractice({
      params: { shape: 'rect', w, h, unit: '厘米' },
      stem: `一个长方形长 ${w} 厘米、宽 ${h} 厘米，它的面积是多少平方厘米？`,
    });
  }

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="demo-stage">
          <GeometrySVG visual={visual} />
          <div className="stage-hint">调长和宽，数一数方格有多少个</div>
        </div>
        <div className="demo-side">
          <div className="demo-controls">
            <Slider label="长" value={w} min={1} max={15} unit=" cm" onChange={setW} />
            <Slider label="宽" value={h} min={1} max={15} unit=" cm" onChange={setH} />
          </div>
          <div className="formula">
            <div className="formula-title">面积与周长</div>
            <div className="formula-main">S = 长 × 宽</div>
            <div className="formula-calc">
              面积 = {w} × {h} = <b>{area}</b> 平方厘米<br />
              周长 = 2 × ({w} + {h}) = <b>{perimeter}</b> 厘米
            </div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          <b>面积</b>是长方形里铺满了多少个小方格，所以用长 × 宽（一行有“长”个，共有“宽”行）。
          <b>周长</b>是绕一圈的总长度，四条边是“长、宽、长、宽”，所以等于 2 ×（长 + 宽）。
          面积用乘法、周长用加法，别搞混。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={makeQuestion}>
          用当前长宽出一道题（求面积）→
        </button>
      ) : (
        <InlinePractice
          topicId="area-rect"
          topicTitle="长方形和正方形的面积"
          params={practice.params}
          stem={practice.stem}
          type="numeric"
          hint="单位是平方厘米，直接填数字"
          onNew={() => setPractice(null)}
        />
      )}
    </div>
  );
}

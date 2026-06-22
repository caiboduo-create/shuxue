import { useState } from 'react';
import GeometrySVG from '../GeometrySVG.jsx';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';

export default function RatioScaleDemo() {
  const [mode, setMode] = useState('map');
  const [mapCm, setMapCm] = useState(5);
  const [scale, setScale] = useState(1000);
  const [w, setW] = useState(5);
  const [h, setH] = useState(3);
  const [factor, setFactor] = useState(2);
  const [practice, setPractice] = useState(null);

  const realCm = mapCm * scale;
  const realM = realCm / 100;
  const realKm = realCm / 100000;
  const mapBack = realCm / scale;
  const newW = w * factor;
  const newH = h * factor;
  const newArea = newW * newH;
  const visual =
    mode === 'shape'
      ? { kind: 'scale', form: 'shape', w, h, factor }
      : { kind: 'scale', form: 'map', mapCm, scale, unit: realCm >= 100000 ? 'km' : 'm' };

  function switchMode(next) {
    setMode(next);
    setPractice(null);
  }

  return (
    <div className="demo">
      <div className="seg mt8" style={{ display: 'flex' }}>
        <button className={mode === 'map' ? 'on' : ''} onClick={() => switchMode('map')}>比例尺</button>
        <button className={mode === 'shape' ? 'on' : ''} onClick={() => switchMode('shape')}>图形缩放</button>
      </div>

      <div className="demo-grid mt16">
        <div className="demo-stage">
          <GeometrySVG visual={visual} />
          <div className="stage-hint">{mode === 'map' ? '比例尺越大，同样图上距离代表的实际距离越远' : '放大图形时，每条边都乘同一个倍数'}</div>
        </div>

        <div className="demo-side">
          {mode === 'map' ? (
            <div className="demo-controls">
              <Slider label="图上距离" value={mapCm} min={1} max={18} unit=" cm" onChange={setMapCm} />
              <Slider label="比例尺 1:n" value={scale} min={100} max={5000} step={100} onChange={setScale} />
            </div>
          ) : (
            <div className="demo-controls">
              <Slider label="原长" value={w} min={2} max={10} unit=" cm" onChange={setW} />
              <Slider label="原宽" value={h} min={2} max={8} unit=" cm" onChange={setH} />
              <Slider label="放大倍数" value={factor} min={2} max={5} onChange={setFactor} />
            </div>
          )}

          <div className="formula">
            <div className="formula-title">{mode === 'map' ? '比例尺换算' : '按比例放大'}</div>
            {mode === 'map' ? (
              <div className="formula-calc">
                实际距离 = 图上距离 × 比例尺<br />
                {mapCm} × {scale} = <b>{realCm}</b> cm<br />
                = <b>{realM}</b> 米{realKm >= 1 ? <> = <b>{realKm}</b> 千米</> : null}<br />
                反过来：{realCm} ÷ {scale} = <b>{mapBack}</b> cm
              </div>
            ) : (
              <div className="formula-calc">
                新长 = {w} × {factor} = <b>{newW}</b> cm<br />
                新宽 = {h} × {factor} = <b>{newH}</b> cm<br />
                新面积 = {newW} × {newH} = <b>{newArea}</b> 平方厘米
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          比例尺 1:n 的意思是：图上 1 cm 代表实际 n cm。求实际距离用乘法，求图上距离用除法。
          图形按比例放大时，<b>长度</b>乘放大倍数；如果求面积，要把长和宽都放大后再相乘。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={() => setPractice(true)}>
          随机出一道比例题练一练 →
        </button>
      ) : (
        <InlinePractice
          topicId="ratio-scale"
          topicTitle="比例尺与按比例缩放"
          avoidParams={mode === 'shape' ? { form: 'scaleShape', w, h, factor, ask: 'width' } : { form: 'findReal', mapCm, scale, unit: realCm >= 100000 ? 'km' : 'm' }}
        />
      )}
    </div>
  );
}

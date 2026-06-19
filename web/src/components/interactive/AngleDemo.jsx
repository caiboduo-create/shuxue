import { useRef, useState, useCallback } from 'react';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';
import { useSvgDrag, clamp } from './svgutil.js';

// 角度互动演示：拖动一条射线改变角度，实时显示度数与「锐角/直角/钝角/平角」分类。
const VX = 70;
const VY = 165;
const L = 200;

const TYPES = [
  { key: 'A', label: '锐角', value: '锐角' },
  { key: 'B', label: '直角', value: '直角' },
  { key: 'C', label: '钝角', value: '钝角' },
  { key: 'D', label: '平角', value: '平角' },
];

function classify(deg) {
  if (deg < 90) return { name: '锐角', color: '#16a34a', note: '小于 90°' };
  if (deg === 90) return { name: '直角', color: '#2563eb', note: '正好 90°' };
  if (deg < 180) return { name: '钝角', color: '#f59e0b', note: '大于 90°、小于 180°' };
  return { name: '平角', color: '#7c3aed', note: '正好 180°，两条边成一条直线' };
}

export default function AngleDemo() {
  const svgRef = useRef(null);
  const [deg, setDeg] = useState(50);
  const [practice, setPractice] = useState(null);

  const rad = (deg * Math.PI) / 180;
  const mx = VX + L * Math.cos(rad);
  const my = VY - L * Math.sin(rad);
  const arcR = 40;
  const large = deg > 180 ? 1 : 0;

  const onDrag = useCallback((p) => {
    let a = (Math.atan2(VY - p.y, p.x - VX) * 180) / Math.PI;
    if (a < 0) a = 0; // 限制在上半平面 0–180°，分类更直观
    setDeg(clamp(Math.round(a), 0, 180));
  }, []);
  const start = useSvgDrag(svgRef, onDrag);

  const c = classify(deg);

  function makeQuestion() {
    setPractice({
      params: { form: 'classify', deg },
      stem: `下图这个角是 ${deg}°，它属于哪一类角？`,
    });
  }

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="demo-stage">
          <svg ref={svgRef} viewBox="0 0 320 220" width="100%" style={{ maxWidth: 360, touchAction: 'none' }}>
            {/* 固定边（水平向右） */}
            <line x1={VX} y1={VY} x2={VX + L} y2={VY} stroke="#94a3b8" strokeWidth="3" />
            {/* 角度弧 */}
            <path
              d={`M ${VX + arcR} ${VY} A ${arcR} ${arcR} 0 ${large} 0 ${VX + arcR * Math.cos(rad)} ${VY - arcR * Math.sin(rad)}`}
              fill="none"
              stroke={c.color}
              strokeWidth="3"
            />
            {/* 可拖动的边 */}
            <line x1={VX} y1={VY} x2={mx} y2={my} stroke="#2563eb" strokeWidth="3" />
            <text x={VX + arcR + 12} y={VY - 14} fill={c.color} fontSize="16" fontWeight="700">{deg}°</text>
            <circle cx={VX} cy={VY} r="4.5" fill="#1e293b" />
            <circle cx={mx} cy={my} r="10" className="handle" onPointerDown={start} />
          </svg>
          <div className="stage-hint">拖动蓝色端点，绕顶点转动这条边</div>
        </div>

        <div className="demo-side">
          <div className="demo-controls">
            <Slider label="角度" value={deg} min={0} max={180} unit="°" onChange={setDeg} />
          </div>
          <div className="formula">
            <div className="formula-title">这是什么角？</div>
            <div className="formula-main" style={{ color: c.color }}>{c.name}</div>
            <div className="formula-calc">{deg}°，{c.note}。</div>
            <div className="type-scale">
              {TYPES.map((t) => (
                <span key={t.key} className={'type-chip' + (t.value === c.name ? ' on' : '')}>{t.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          判断一个角是什么角，只要拿它和两个「关键角」比一比：<b>90°（直角）</b> 和 <b>180°（平角）</b>。
          比 90° 小是锐角，正好 90° 是直角，在 90° 和 180° 之间是钝角，正好 180° 就是平角（两条边拉成一条直线）。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={makeQuestion}>
          用当前角度出一道练习题 →
        </button>
      ) : (
        <InlinePractice
          topicId="angles"
          topicTitle="角的度量与分类"
          params={practice.params}
          stem={practice.stem}
          type="choice"
          options={TYPES}
          onNew={() => setPractice(null)}
        />
      )}
    </div>
  );
}
